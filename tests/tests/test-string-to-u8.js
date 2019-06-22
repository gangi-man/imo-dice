const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');
const s2u8 = require('../../modules/string-to-u8.js');

TestName ="string-to-u8 Test";

function all_tests() {
    const str_A = "A";
    const u8_array_A = new Uint8Array( [0x41] );

    const str_ABC = "ABC";
    const u8_array_ABC = new Uint8Array( [0x41, 0x42, 0x43] )

    const str_cjk_0_3c = "あい愛";
    const u8_array_cjk_0_3c = new Uint8Array([0xe3, 0x81, 0x82,
					     0xe3, 0x81, 0x84,
					     0xe6, 0x84, 0x9b
					    ]);

    return [
	new TestCase("str_to_u8_1c").expected(tch.assert_equal_array, u8_array_A).
	    setup(s2u8.string_to_u8, [str_A]),

	new TestCase("str_to_u8_3c").expected(tch.assert_equal_array, u8_array_ABC).
	    setup(s2u8.string_to_u8, [str_ABC]),

	new TestCase("str_to_u8_3cjk").expected(tch.assert_equal_array, u8_array_cjk_0_3c).
	    setup(s2u8.string_to_u8, [str_cjk_0_3c]),

	new TestCase("u8_to_str_ABC").expected(tch.assert_equal, str_ABC).
	    setup(s2u8.u8_to_string, [u8_array_ABC]),
    ];
}

function name() {
    return TestName;
}

exports.all_tests = all_tests;
exports.name = name;

if (!tch.test_file_is_required(__filename))
    new TestCaseSuite(name(), all_tests()).run_all().report();
