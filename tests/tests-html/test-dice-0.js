const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');

const TestName = "Test dice-test.html";
const TestURL = "./data/dice-0.html";


/* dice object (rpg-dice-html-extract.js)
{
    dice_number : dice_number,
    dice_value_max : dice_value_max,
    dice_addition : dice_addition,
    eyes : eyes,
    sum : sum
};
*/

function test_response_count(inner_window) {
    let responses = inner_window.extract();
    return responses.length;
}

function test_response_eyes(inner_window, res_idx) {
    let r = inner_window.extract()[res_idx];
    if (!r.dice)
	return null;

    return r.dice.eyes;
}

function test_dice_info(inner_window, res_idx,
			dnum, dmax, dadd, eyes, sum)
{
    let r = inner_window.extract()[res_idx];
    if (!r.dice)
	return null;

    let d = r.dice;
    for (let i=0; i<d.eyes.length; i++) {
	if (d.eyes[i] != eyes[i])
	    return false;
    }

    if (d.dice_number == dnum &&
	d.dice_value_max == dmax &&
	d.dice_addition == dadd &&
	d.sum == sum
       ) return true;

    return false;
}


function all_tests(inner_window) {
    return [
	new TestCase("hello dice test1").expected(tch.assert_no_exception, null, null).
	    setup(inner_window.testdayo, []),

	new TestCase("response count").expected(tch.assert_equal, 32).
	    setup(test_response_count, [inner_window]),

	new TestCase("get dice eyes 0").expected(tch.assert_equal_array, [73, 90, 40, 14, 74]).
	    setup(test_response_eyes, [inner_window, 0]),

	new TestCase("get dice info 0").expected(tch.assert_true).
	    setup(test_dice_info, [inner_window, 0, 5, 100, 0, [73, 90, 40, 14, 74], 291]),

	new TestCase("get dice info 1").expected(tch.assert_true).
	    setup(test_dice_info, [inner_window, 1, 5, 100, 0, [90, 82, 71, 7, 88], 338]),

	new TestCase("get dice info 31").expected(tch.assert_true).
	    setup(test_dice_info, [inner_window, 31, 5, 100, 0, [43, 53, 89, 17, 60], 262]),

	new TestCase("get no dice response 17").expected(tch.assert_null).
	    setup(test_dice_info, [inner_window, 17]),

	new TestCase("strange dice 15").expected(tch.assert_true).
	    setup(test_dice_info, [inner_window, 15, 5, 1, 0, [1, 1, 1, 1, 1], 5]),

	new TestCase("with comment 27").expected(tch.assert_true).
	    setup(test_dice_info, [inner_window, 27, 5, 100, 0, [54, 14, 51, 42, 1], 162]),

	new TestCase("JUSTTEST jpeg test").expected(tch.assert_equal_md5, "38b8612f7e40b85ce176ff8f3cea6c25").
	    setup(inner_window.extract_rule_image, [false]),
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
