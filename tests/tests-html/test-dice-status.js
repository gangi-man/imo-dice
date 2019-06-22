const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');

const TestName = "Test dice-status.html";
const TestURL = "./data/dice-status.html";


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
	new TestCase("response count").expected(tch.assert_equal, 51).
	    setup(test_response_count, [inner_window]),

	new TestCase("get dice eyes 0").expected(tch.assert_equal_array, [67, 11, 24, 35, 16]).
	    setup(test_response_eyes, [inner_window, 0]),

	new TestCase("get dice eyes 1").expected(tch.assert_equal_array, [21, 44, 78, 29, 45]).
	    setup(test_response_eyes, [inner_window, 1]),

	new TestCase("get dice eyes 5").expected(tch.assert_equal_array, [49, 97, 99, 7, 2]).
	    setup(test_response_eyes, [inner_window, 5]),

	new TestCase("get dice eyes 20").expected(tch.assert_equal_array, [31, 20, 73, 5, 13]).
	    setup(test_response_eyes, [inner_window, 20]),

	new TestCase("get dice eyes 50").expected(tch.assert_equal_array, [25, 74, 18, 39, 96]).
	    setup(test_response_eyes, [inner_window, 50]),

	new TestCase("get image binary").expected(tch.assert_equal_md5, "ee3b82c8c644d1fdef46e4c554e2e24e").
	    setup(inner_window.extract_rule_image, [false]),

	new TestCase("get rule").expected(tch.assert_equal, "#1 STR, #2 AGI, #3 INT, #4 VIT, #5 DEX,").
	    setup(inner_window.extract_rule, [false]),
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
