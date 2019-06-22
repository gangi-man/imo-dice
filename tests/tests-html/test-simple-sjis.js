const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');

const TestName = "SJIS test";
const TestURL = "./data/simple-sjis.html";

function all_tests(inner_window) {
    return [
	new TestCase("do_nothing").expected(tch.assert_no_exception).setup(() => {}, []),

	new TestCase("do_nothing_inner_content").expected(tch.assert_equal, 1).
	    setup(inner_window.test_self_simple_sjis, [1])
    ];
}

function url() {
    return TestURL;
}

function name() {
    return TestName;
}

exports.name = name;
exports.url = url;
exports.all_tests = all_tests;


if (!tch.test_file_is_required(__filename))
    new TestCaseSuite(name(), all_tests()).run_all().report();
