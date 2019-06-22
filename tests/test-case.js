const tch = require('./test-case-helper.js');

function _undefined_object_(d) { this.data = d; }

function is_undefined_object(o) {
    if (!o)
	return false;

    return o instanceof _undefined_object_
}


function TestCase(name, check_function, expected_value=null, expected_error=null) {
    
    this.line = tch.get_stack_line(1);

    this.name = name;

    this.check_function = null;
    this.test_function = null;
    this.test_function_args = null;

    this.expected_value = new _undefined_object_("expected_value");
    this.expected_error = new _undefined_object_("expected_error");
    this.result_value = new _undefined_object_("result_value");
    this.result_error = new _undefined_object_("result_error");

    this.test_result_promise = null;
}

TestCase.prototype.expected = function(check_function,
				       expected_value = new _undefined_object_("expected_value"),
				       expected_error = new _undefined_object_("expected_error"))
{
    this.check_function = check_function;
    this.expected_value = expected_value;
    this.expected_error = expected_error;

    return this;
}

TestCase.prototype.set_expected_error = function(expected_error) {
    this.expected( () => false, new _undefined_object_("expected_value"), expected_error);
    return this;
}

TestCase.prototype.setup = function (test_function, args=[]) {
    this.test_function = test_function;
    this.test_function_args = args;

    return this;
}

TestCase.prototype.get_result_promise = function() {
    return this.test_result_promise;
}

TestCase.prototype.run = function () {
    let this_case = this;

    function eval_result(result_value) {
	this_case.result_value = result_value;
	this_case.result_state = this_case.check_function(this_case.expected_value,
							  this_case.result_value);

	return this_case;
    }

    function eval_error(result_error) {
	if (typeof result_error === "undefined" || typeof this_case.expected_error === "_undefined_object_") {
	    this_case.result_state = false;
	} else {
	    this_case.result_error = result_error;
	    this_case.result_state = (result_error.message == this_case.result_error.message);
	}

	return this_case;
    }


    let result_promise;
    try {
	result_promise = this.test_function.apply(null, this.test_function_args);
    } catch(e) {
	result_promise = new Promise( (resolve, reject) => { reject(e); } );
    }

    if (!tch.is_promise(result_promise))
	result_promise = new Promise( resolve => { resolve(result_promise); } );

    this.test_result_promise = result_promise.
	then(eval_result).
	catch(eval_error);

    return this;
}

TestCase.prototype._fail_report_text = function() {
    function obj_to_str(obj, level=1) {
	function blanks() {
	    let result = "";
	    for(let i=0; i<level; i++)
		result += "  ";
	    return result;
	}

	let output = "";
	for (let i=0; i<Object.keys(obj).length; i++){
	    let okey = Object.keys(obj)[i];
	    if (typeof obj[okey] !== "object") {
		output += blanks() + (okey + ":" + obj[okey]) + "\n";
	    } else {
		output += blanks() + okey + ":\n" + obj_to_str(obj[okey], level+1);
	    }
	}

	return output;
    }

    function value_string(val) {
	if (is_undefined_object(val))
	    return "[undefined]";

	if (val===null)
	    return "null";

	if (typeof val === "object")
	    return  "\n{\n" + obj_to_str(val) + "}";
	else {
	    if (typeof val === "undefined")
		return "undefined"
	    else
		return val.toString();
	}
    }

    let report;
    if (!is_undefined_object(this.result_value)) {
	report = `${this.check_function.name}(${value_string(this.result_value)}`;
	if (this.expected_value !== null)
	    report += `, ${value_string(this.expected_value)}`;

	report += `)  ${this.line}`;
    }

    if (!is_undefined_object(this.result_error)) {
	let expected_error_message = is_undefined_object(this.expected_error) ?
	    "NO-EXPECTED-EXCEPTION" : this.expected_error.message;

	report = `error_check(${this.result_error.message}, ${expected_error_message})`;
	report += `  ${this.line}`;
	report += `\n* ${this.result_error.stack}`;
    }

    return report;
}

TestCase.prototype.result = function() {
    let result = null;
    if (!is_undefined_object(this.result_value))
	result = this.check_function(this.result_value, this.expected_value);
    else if (!is_undefined_object(this.result_error))
	result = (this.result_error.message === this.expected_error.message);

    return result;
}

TestCase.prototype.report_text = function() {
    let Red =    '\u001b[31m';
    let Green =  '\u001b[32m';
    let Yellow = '\u001b[33m';
    let Reset =  '\u001b[0m';
    if (tch.test_on_browser())
	Red = Green = Yellow = Reset = '';


    let test_result = this.result();
    let report;
    let report_tail = `${Reset} ${this.name}`;
    if (test_result === true)
	report = `${Green} [PASS]` + report_tail;
    else if (test_result === false)
	report = `${Red} [FAIL]` + report_tail + " " + this._fail_report_text();
    else
	report = `${Yellow} [NOT TESTED]` + report_tail;

    return report;
}

TestCase.prototype.report_html = function() {
    function to_html(txt) {
	return "<br>" + txt.replace(/\r?\n/g, "<br>\n");
    }

    let test_result = this.result();
    let report;
    if (test_result === true)
	report = `<div><span class='pass_green'> PASS </span> ${this.name} </div>`;
    else if (test_result === false)
	report = `<div><span class='fail_red'> FAIL </span> ${this.name} `
	+ to_html(this._fail_report_text())
	+ "</div>";
    else
	report = `<div><span class='skip_yellow'> NOT TESTED </span> ${this.name} </div>`;

    return report;
}

TestCase.prototype.report = function() {
    let report_text_func = this.report_text.bind(this);

    if (this.test_result_promise === null)
	this.test_result_promise = new Promise( r => r(this) );

    this.get_result_promise().
	then(
	    function (this_case) {
		console.log( this_case.report_text() );
		//console.log( this_case.report_html() );
	    }
	);
    return this;
}

exports.TestCase = TestCase;
