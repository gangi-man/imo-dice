const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');

const TestName = "object equal test";

function object_equal(a, b) {
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

	if (!object_equal(a[k], b[k]))
	    return false;
    }

    return true;
}


function all_tests() {
    function delay_evaluate_promise() {
	return new Promise(
	    function(res) {
		setTimeout( () => {console.log("delay done..."); res(true) }, 5000);
	    }
	);
    }

    let tests = [
	new TestCase("number equal").expected(tch.assert_true).setup(object_equal, [13, 13], tch.assert_true),
	new TestCase("string equal").expected(tch.assert_true).setup(object_equal, ["testdayo", "testdayo"]),

	new TestCase("obj equal 1").expected(tch.assert_true).
	    setup(object_equal, [{ a: 1}, {a: 1}]),

	new TestCase("empty equal").expected(tch.assert_true).setup(object_equal, [{}, {}]),

	new TestCase("null equal").expected(tch.assert_true).setup(object_equal, [null, null]),

	new TestCase("not equal undefined").expected(tch.assert_false).setup(object_equal, []),

	new TestCase("obj equal 2").expected(tch.assert_true).
	    setup(object_equal, [{a: 99, b: "test"}, {b: "test", a:99}]),

	new TestCase("obj equal 3").expected(tch.assert_true).
	    setup(object_equal,
		  [{a: 1, e:{}, o: {a1 : 999, b1: "dat"}},
		   {a: 1, e:{}, o: {a1 : 999, b1: "dat"}}]),

	new TestCase("obj not equal 1").expected(tch.assert_false).
	    setup(object_equal, [{ a: 1}, {a: 2}]),

	new TestCase("obj not equal 2").expected(tch.assert_false).
	    setup(object_equal,
		  [{a: 1, e:{}, o: {a1 : 999, b1: "dat"}},
		   {a: 1, e:{}, o: {a1 : 999, b1: "dat2"}}]),

	new TestCase("delay evaluation").expected(tch.assert_true).setup(delay_evaluate_promise, []),
    ];

    return tests;
}

function name() {
    return TestName;
}

exports.all_tests = all_tests;
exports.name = name;

if (!tch.test_file_is_required(__filename))
    new TestCaseSuite(name(), all_tests()).run_all().report();
