
function test_suite_common_list() {
    //return [];
    return [
	//require("./tests/test-equal.js"),
	require("./tests/test-jpeg-operations.js"),
	require("./tests/test-md5.js"),
	require("./tests/test-string-to-u8.js"),
	require("./tests/test-rpg-dice-rule.js"),
	require("./tests/test-rpg-dice-rule-apply.js"),
    ];
}

function test_suite_browser_list() {
    return [
	//require('./tests-html/test-simple-sjis.js'),
	//require('./tests-html/test-dice-0.js'),
	require('./tests-html/test-dice-status.js'),
	require('./tests-html/test-dice-wiz.js'),
	require('./tests-html/test-dice-iroha.js'),
	require('./tests-html/test-dice-no-rule.js'),
	require('./tests-html/test-dice-text-rule.js'),
    ];
}

exports.test_suite_common_list = test_suite_common_list;
exports.test_suite_browser_list = test_suite_browser_list;
