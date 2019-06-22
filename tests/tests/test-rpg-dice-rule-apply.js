const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');

const rpr = require('../../modules/rpg-dice-rule.js');
const rdh = require('./test-rpg-dice-helper.js');


const TestName = "rpg_dice_rule_apply_tests";
const TestURL = null;


let rule_test_0 =  "#1 Test;";
let rule_test_0_dice = rdh.dice_obj([10]);
let rule_test_0_imos = [ rdh.imo_dice("Test:10", "Test", 10, false, true) ];
let rule_test_0_imot = [ "Test:10" ];

let rule_test_1 =  "#1 Test;\n #2 FOO;\n #3 BAR;";
let rule_test_1_dice = rdh.dice_obj([1, 2, 3]);
let rule_test_1_imot = [ "Test:1", "FOO:2", "BAR:3" ];

let rule_test_2 =  "#1 Test 1:ONE 2:TWO 4:THREE_FOR;";
let rule_test_2_dice1 = rdh.dice_obj([1]);
let rule_test_2_dice2 = rdh.dice_obj([2]);
let rule_test_2_dice3 = rdh.dice_obj([3]);
let rule_test_2_dice4 = rdh.dice_obj([4]);
let rule_test_2_dice5 = rdh.dice_obj([5]);


function all_tests() {
    function get_applied_disp_list(rule, dice) {
	let imo_dices = rpr.rpg_dice_rule(rule).apply(dice);
	return imo_dices.map(x => x.disp);
    }

    return [
	new TestCase("Apply test0").expected(tch.assert_equal_object, rule_test_0_imos).
	    setup(rpr.rpg_dice_rule(rule_test_0).apply, [rule_test_0_dice]),

	new TestCase("Apply test0 alt").expected(tch.assert_equal_object, rule_test_0_imot).
	    setup(get_applied_disp_list, [rule_test_0, rule_test_0_dice]),

	new TestCase("Apply test1 multi").expected(tch.assert_equal_object, rule_test_1_imot).
	    setup(get_applied_disp_list, [rule_test_1, rule_test_1_dice]),

	new TestCase("Apply pip-val 1").expected(tch.assert_equal_object, ["Test:ONE"]).
	    setup(get_applied_disp_list, [rule_test_2, rule_test_2_dice1]),

	new TestCase("Apply pip-val 3").expected(tch.assert_equal_object, ["Test:THREE_FOR"]).
	    setup(get_applied_disp_list, [rule_test_2, rule_test_2_dice3]),

	new TestCase("Apply pip-val 4").expected(tch.assert_equal_object, ["Test:THREE_FOR"]).
	    setup(get_applied_disp_list, [rule_test_2, rule_test_2_dice4]),

	new TestCase("Apply pip-val 5").expected(tch.assert_equal_object, ["Test:5"]).
	    setup(get_applied_disp_list, [rule_test_2, rule_test_2_dice5]),
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
