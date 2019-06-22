const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');

const TestName = "Test dice-wiz.html";
const TestURL = "./data/dice-wiz.html";


function all_tests(inner_window) {
    return [ ];
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
