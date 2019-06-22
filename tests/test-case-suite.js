const tc = require('./test-case.js');
const tch = require('./test-case-helper.js');

class TestCaseSuite {
    constructor(name, test_list=[]) {
	this.test_name = name;
	this.test_list = test_list;
	this.result_promise_list = [];
    }

    append(test_case) {
	this.test_list.push(test_case);

	return this;
    }

    run_all() {
	for (let i=0; i<this.test_list.length; i++) {
	    this.result_promise_list.push( this.test_list[i].run().get_result_promise() );
	}

	return this;
    }

    report_text() {
	return Promise.all(this.result_promise_list).
	    then(
		(function() {
		    let header = `  TEST ${this.test_name}`;
		    header += (60 - header.length) > 0 ? " ".repeat(60 - header.length) : "";

		    let result_text = `${header}\n`;
		    if (tch.test_on_browser())
			result_text= `\u001b[47m\u001b[30m${header}\u001b[0m\n`;

		    for (let i=0; i<this.test_list.length; i++) {
			result_text += this.test_list[i].report_text() + "\n";
		    }

		    return result_text;
		}).bind(this)
	    );
    }

    report_html() {
	return Promise.all(this.result_promise_list).
	    then(
		(function() {
		    let result_html = `<h2> TEST ${this.test_name} </h2>\n`;
		    for (let i=0; i<this.test_list.length; i++) {
			result_html += this.test_list[i].report_html() + "\n";
		    }

		    return result_html;
		}).bind(this)
	    );
    }

    report() {
	this.report_text().then( r => console.log(r) );
    }
}

exports.TestCaseSuite = TestCaseSuite;
