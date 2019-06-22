const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');

const TestName = "md5-test";


const Md5_ABC = new Uint8Array([
    0x90, 0x2f, 0xbd, 0xd2, 0xb1, 0xdf, 0x0c, 0x4f, 0x70, 0xb4, 0xa5, 0xd2, 0x35, 0x25, 0xe9, 0x32
]);

const Md5_ABC_hex = "902fbdd2b1df0c4f70b4a5d23525e932";
const ABC_u8_array = new Uint8Array([0x41, 0x42, 0x43]);

function calculate_md5_str(str) {
    let digest_u8 =  require('crypto').createHash('md5').update(str).digest()
    return new Uint8Array(digest_u8);
}

function calculate_md5_str_hex(str) {
    return require('crypto').createHash('md5').update(str).digest('hex');
}

function calculate_md5_u8_array_hex(u8_array) {
    return require('crypto').createHash('md5').update(u8_array).digest('hex');
}

function all_tests() {
    function do_nothing() {}
    function myself(v) { return v; }

    return [
	new TestCase("do_nothing").expected(tch.assert_no_exception).setup(do_nothing, []),

	new TestCase("md5-ABC").expected(tch.assert_equal_array, Md5_ABC).
	    setup(calculate_md5_str, ["ABC"]),

	new TestCase("md5-ABC-hex").expected(tch.assert_equal, Md5_ABC_hex).
	    setup(calculate_md5_str_hex, ["ABC"]),

	new TestCase("md5-u8-array").expected(tch.assert_equal, Md5_ABC_hex).
	    setup(calculate_md5_u8_array_hex,[ABC_u8_array]),

	new TestCase("use-assert-assert").expected(tch.assert_equal_md5, Md5_ABC_hex).
	    setup(myself, ["ABC"]),

	new TestCase("use-assert-assert-u8").expected(tch.assert_equal_md5, Md5_ABC_hex).
	    setup(myself, [ABC_u8_array]),
    ];
}

function name() {
    return TestName;
}

exports.all_tests = all_tests;
exports.name = name;

if (!tch.test_file_is_required(__filename))
    new TestCaseSuite(name(), all_tests()).run_all().report();
