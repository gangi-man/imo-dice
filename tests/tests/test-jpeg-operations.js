const fs = require('fs');
const {jpeg_operations_constructor} = require('../..//modules/jpeg-operations.js');
const {TestCase} = require('../test-case.js');
const {TestCaseSuite} = require('../test-case-suite.js');
const tch = require('../test-case-helper.js');

const TestName = "Jpeg Operations Test";

const md5_test0_jpg_hex = '38b8612f7e40b85ce176ff8f3cea6c25';

function load_file(path) {
    return new Uint8Array( fs.readFileSync(path) );
}

function write_file(jo_obj, path) {
    let content = jo_obj.get_image_array();
    if (path && !tch.test_on_browser()) {
	fs.writeFileSync(path, Buffer(content));
    }

    return content;
}

function construct_object(u8_content) {
    return jpeg_operations_constructor(u8_content);
}

function get_comment(jo_obj) {
    return jo_obj.get_comment();
}

function set_comment(jo_obj, new_comment) {
    jo_obj.set_comment(new_comment);
    return jo_obj.get_comment();
}

function remove_comment(jo_obj) {
    return set_comment(jo_obj, null);
}


function all_tests() {
    let test0_jpg_u8 = load_file("./data/test0.jpg");
    let wrong_jpg_u8 = load_file("./data/wrong0.jpg");
    let empty_jpg_u8 = load_file("./data/empty.jpg");
    let test0_jo_obj = construct_object(test0_jpg_u8);

    return [
	new TestCase("read test file0").expected(tch.assert_equal_md5, md5_test0_jpg_hex).
	    setup(tch.value_self, [test0_jpg_u8]),

	new TestCase("construct with valid file").expected(tch.assert_no_exception).
	    setup(construct_object, [test0_jpg_u8]),

	new TestCase("construct with wrong file").set_expected_error(new Error("wrong_image_array")).
	    setup(construct_object, [wrong_jpg_u8]),

	new TestCase("construct with empty buffer").set_expected_error(new Error("wrong_image_array")).
	    setup(construct_object, [new Uint8Array()]),

	new TestCase("construct with empty file").set_expected_error(new Error("wrong_image_array")).
	    setup(construct_object, [empty_jpg_u8]),

	new TestCase("test write file").expected(tch.assert_equal_md5, md5_test0_jpg_hex).
	    setup(write_file, [test0_jo_obj, "temp-test0.jpg"]),

	new TestCase("test get comment").expected(tch.assert_equal, "Test comment.\n").
	    setup(get_comment, [test0_jo_obj]),

	new TestCase("test set comment").expected(tch.assert_equal, "UPDATED COMMENT!").
	    setup(set_comment, [test0_jo_obj, "UPDATED COMMENT!"]),

	new TestCase("write updated comment").expected(tch.always_success).
	    setup(write_file, [test0_jo_obj, "tmp-updated.jpg"]),

	new TestCase("test remove comment").expected(tch.assert_null).
	    setup(remove_comment, [test0_jo_obj]),

	new TestCase("write null comment").expected(tch.always_success).
	    setup(write_file, [test0_jo_obj, "tmp-null-comment.jpg"]),
    ];
}

function name() {
    return TestName;
}

exports.all_tests = all_tests;
exports.name = name;

if (!tch.test_file_is_required(__filename))
    new TestCaseSuite(name(), all_tests()).run_all().report();
