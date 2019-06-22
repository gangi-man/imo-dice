const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');
const rdh = require('./test-rpg-dice-helper.js');
const rpr = require('../../modules/rpg-dice-rule.js');

const TestName = "rpg dice rule test";


function all_tests() {
    let rule_01 = "#1 Test;";
    let rule_01_obj = rdh.rule_obj("Test");
    let rule_01_sp = "    #1 Test;   ";
    let rule_01_sp_obj = rule_01_obj;
    let rule_10 = "#10 Test;";
    let rule_10_obj = rule_01_obj;

    let rule_e01 = "#1 <Test>;";
    let rule_e01_obj = rdh.rule_obj("*Test*");

    let rule_e02 = "#1 <script> 10:\"ten\" 20:'TWENTY' 30:&thirty& 40:`forty`;"
    let rule_e02_obj = rdh.rule_obj("*script*", true,
				    [ rdh.pip_obj(10, "*ten*"), rdh.pip_obj(20, "*TWENTY*"),
				      rdh.pip_obj(30, "*thirty*"), rdh.pip_obj(40, "*forty*") ]
				   );

    let rule_test_one = " #1 Test  1:One ;   ";
    let rule_test_one_obj = rdh.rule_obj("Test", true,  [ rdh.pip_obj(1, "One") ]);
    let rule_test_one_two = " #1 Test  1:One  2:Two  ;   ";
    let rule_test_one_two_obj = rdh.rule_obj("Test", true, [ rdh.pip_obj(1, "One"), rdh.pip_obj(2, "Two")]);
    let rule_test_two_one = " #1 Test 2:Two  1:One   ;   ";
    let rule_test_two_one_obj = rule_test_one_two_obj;

    //wrong rules
    let PVError = new Error('pip_value_error');
    let rule_wrong_colons = " #1 Test  1:One: ;   ";
    let rule_wrong_sp = "#1 Test One;";
    let rule_not_num = " #1 Test i:One;";
    let rule_multiple = "#1 Test 1:One 1:Two;";

    let rule_comma = " #1 Test,";
    let rule_comma_obj = rdh.rule_obj("Test", false);

    let rule_multi_01 = `
#1 Test;
#2 Test 1:One 2:Two;
`;
    let rule_multi_01_obj = { 1 : rule_01_obj, 2 : rule_test_one_two_obj };

    let rule_multi_02 = "#1#2 Test;";
    let rule_multi_02_obj = { 1 : rule_01_obj, 2 : rule_01_obj};

    let rule_invalid = "NO RULE STRING\n";

    let rule_multi_03 = '#1 Test;#2 Test 1:One 2:Two;';
    let rule_multi_03_obj = rule_multi_01_obj;

    return  [
	// one rule
	new TestCase("parse rule 1").expected(tch.assert_equal_object, rule_01_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_01]),

	new TestCase("parse rule 2 many space").expected(tch.assert_equal_object, rule_01_sp_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_01_sp]),

	new TestCase("parse rule 3 target-10").expected(tch.assert_equal_object, rule_10_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_10]),

	new TestCase("parse rule 5 Pip-Value list 1element").expected(tch.assert_equal_object, rule_test_one_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_test_one]),

	new TestCase("parse rule 6 Pip-Value list 2element").expected(tch.assert_equal_object, rule_test_one_two_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_test_one_two]),

	new TestCase("parse rule 7 Pip-Value list 2element rev").expected(tch.assert_equal_object, rule_test_two_one_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_test_two_one]),

	new TestCase("parse rule 8 invalid rule 1 wrong colons").expected(tch.assert_exception, null, PVError).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_wrong_colons]),

	new TestCase("parse rule 9 invalid rule 2 wrong space").expected(tch.assert_exception, null, PVError).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_wrong_sp]),

	new TestCase("parse rule11 invalid rule 4 pip is not number").expected(tch.assert_exception, null, PVError).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_not_num]),

	new TestCase("parse rule12 invalid rule 5 duplicated pip").expected(tch.assert_exception, null, PVError).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_multiple]),

	new TestCase("parse rule 13 no newline").expected(tch.assert_equal_object, rule_comma_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_comma]),

	new TestCase("Escape chars in rule 001").expected(tch.assert_equal_object, rule_e01_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_e01]),

	new TestCase("Escape chars in rule 002").expected(tch.assert_equal_object, rule_e02_obj).
	    setup(rpr.rpg_dice_rule().parse_rule_line, [rule_e02]),

	// rule set
	new TestCase("Rule check no exception").expected(tch.assert_no_exception).
	    setup(rpr.rpg_dice_rule().parse, [rule_01]),

	new TestCase("Rule check no exception").expected(tch.assert_equal_object, { 1 : rule_01_obj }).
	    setup(rpr.rpg_dice_rule().parse, [rule_01]),

	new TestCase("Check 2 rules multi01").expected(tch.assert_equal_object, rule_multi_01_obj).
	    setup(rpr.rpg_dice_rule().parse, [rule_multi_01]),

	new TestCase("Check 2 rules multi02").expected(tch.assert_equal_object, rule_multi_02_obj).
	    setup(rpr.rpg_dice_rule().parse, [rule_multi_02]),

	new TestCase("Valid test 1(valid)").expected(tch.assert_true).
	    setup(rpr.rpg_dice_rule(rule_01).is_valid, []),

	new TestCase("Valid test multi(valid)").expected(tch.assert_true).
	    setup(rpr.rpg_dice_rule(rule_multi_01).is_valid, []),

	new TestCase("Valid test (invalid)").expected(tch.assert_false).
	    setup(rpr.rpg_dice_rule(rule_invalid).is_valid, []),

	new TestCase("Check 3 rules multi03 no newlines").expected(tch.assert_equal_object, rule_multi_03_obj).
	    setup(rpr.rpg_dice_rule().parse, [rule_multi_03]),

    ];
}


function name() {
    return TestName;
}

exports.all_tests = all_tests;
exports.name = name;

if (!tch.test_file_is_required(__filename))
    new TestCaseSuite(name(), all_tests()).run_all().report();
