function test_file_is_required(self_path) {
    function filename(path) {
	let path_list = path.split(/[\\/]/);
	return path_list[path_list.length-1];
    }

    let proc_path = process.argv[1];
    if (proc_path === self_path)
	return false;

    if (filename(proc_path) === filename(self_path))
	return false;

    return true;
}

function test_on_browser() {
    if (typeof window !== 'undefined')
	return true;
    else
	return false;
}

function get_stack_line(level=0) {
    // we count level from caller function. level==0 means caller level.
    // FIXME this is chrome/node only! not generic!
    try {
	throw new Error('');
    } catch(err) {
	let lines = err.stack.split('\n');
	lines.shift(); // remove 'Error:' line.
	lines.shift(); // remove line of this function.

	if (lines.length <= level)
	    return "";

	let ln = lines[level];
	return ln.replace(/^[^()]*/, "");
    }
}

function is_promise(p) {
    if (typeof p === "undefined" || !p || typeof p.then === "undefined")
	return false;
    else
	return true;
}

// assert functions //////////////////////////////////////////////////////////
function always_success(dummy0, dummy1) {
    return true;
}

function always_fail(dummy0, dummy1) {
    return false;
}

function assert_null(a, dummy) {
    if (a===null)
	return true;
    else
	return false;
}

function assert_not_null(a, dummy) {
    return !assert_null(a, null);
}

function assert_true(a, dummy) {
    if (a===true)
	return true;
    else
	return false;
}

function assert_false(a, dummy) {
    if(a===false)
	return true
    else
	return false;
}

function assert_equal(a, b) {
    if (a===b)
	return true;
    else
	return false;
}

function assert_not_equal(a, b) {
    return !assert_equal(a, b);
}

function assert_equal_array(a, b) {
    if (a.length != b.length)
	return false;

    for (let i=0; i<a.length; i++) {
	if (a[i]!==b[i])
	    return false;
    }

    return true;
}

function assert_not_equal_array(a, b) {
    return !assert_equal_array(a, b);
}

function assert_equal_object(a, b) {
    if (typeof a === "undefined" || typeof a === "undefined")
	return false;

    if (typeof a !== typeof b)
	return false;

    if (typeof a !== "object")
	return (a===b);

    if ((a===null) && (b===null))
	return true;

    let keys_a = Object.keys(a);
    let keys_b = Object.keys(b);
    if (keys_a.length !== keys_b.length)
	return false;

    for (let i=0; i<keys_a.length; i++) {
	let k = keys_a[i];

	if (!(k in b))
	    return false;

	if (!assert_equal_object(a[k], b[k]))
	    return false;
    }

    return true;
}

function assert_not_equal_object(a, b) {
    return !assert_equal_object(a,b);
}

function assert_exception(dummy0, dummy1) {
    return false;
}

function assert_no_exception(dummy0, dummy1) {
    return true;
}

function assert_equal_md5(u8_array, md5_hash) {
    let hash = require('crypto').createHash('md5').update(u8_array).digest('hex');
    return (hash === md5_hash);
}

function assert_not_equal_md5(u8_array, md5_hash) {
    return !assert_equal_md5(u8_array, md5_hash);
}


exports.test_on_browser = test_on_browser;
exports.get_stack_line = get_stack_line;
exports.is_promise = is_promise;
exports.test_file_is_required = test_file_is_required;

exports.always_success = always_success;
exports.always_fail= always_fail;
exports.assert_null = assert_null;
exports.assert_not_null = assert_not_null;
exports.assert_true = assert_true;
exports.assert_false = assert_false;
exports.assert_equal = assert_equal;
exports.assert_not_equal = assert_not_equal;
exports.assert_equal_array = assert_equal_array;
exports.assert_not_equal_array = assert_not_equal_array;
exports.assert_equal_object = assert_equal_object;
exports.assert_not_equal_object = assert_not_equal_object;
exports.assert_exception = assert_exception;
exports.assert_no_exception = assert_no_exception;
exports.assert_equal_md5 = assert_equal_md5;
exports.assert_not_equal_md5 = assert_not_equal_md5;

exports.value_self = function(v) { return v; }
exports.empty_test_list = function(name) {
    return { name : name, tests: [] };
}
