const {TestCase} = require('../test-case.js');
const tch = require('../test-case-helper.js');

function value_x(x) {
    return x;
}

function raise_exception(e) {
    throw new Error(e);
}


new TestCase("value10_10").expected(tch.assert_equal, 10).setup(value_x, [10]).run().report();
new TestCase("value10_9").expected(tch.assert_equal, 10).setup(value_x, [9]).run().report();
new TestCase("value10_yet_test").expected(tch.assert_equal, 10).report();

new TestCase("object {a:10}, {a:10}").expected(tch.assert_equal_object, {a:10}).
    setup(value_x, [{a:10}]).run().report();
new TestCase("object {a:10}, {b:9}").expected(tch.assert_equal_object, {a:10}).
    setup(value_x, [{b:9}]).run().report();

new TestCase("object {a:10}, {a:10, c:{}}").expected(tch.assert_equal_object, {a:10}).
    setup(value_x, [{a:10, c:{}}]).run().report();

new TestCase("is_true t").expected(tch.assert_true).setup(value_x, [true]).run().report();
new TestCase("is_true f").expected(tch.assert_true).setup(value_x, [false]).run().report();
new TestCase("is_true 0").expected(tch.assert_true).setup(value_x, [0]).run().report();
new TestCase("is_true 1").expected(tch.assert_true).setup(value_x, [1]).run().report();

new TestCase("is_false t").expected(tch.assert_false).setup(value_x, [true]).run().report();
new TestCase("is_false f").expected(tch.assert_false).setup(value_x, [false]).run().report();
new TestCase("is_false 0").expected(tch.assert_false).setup(value_x, [0]).run().report();
new TestCase("is_false 1").expected(tch.assert_false).setup(value_x, [1]).run().report();

new TestCase("array_test_num").expected(tch.assert_equal_array, [1, 2, 3]).
    setup(value_x, [[1, 2, 3]]).run().report();

new TestCase("array_test_char").expected(tch.assert_equal_array, ["a", "b", "c"]).
    setup(value_x, [["a", "b", "c"]]).run().report();

new TestCase("array_test_fail").expected(tch.assert_equal_array, [1,2] ).
    setup(value_x, [[1, 2, 3]]).run().report();

new TestCase("array_test_char object_check").expected(tch.assert_equal_object, ["a", "b", "c"]).
    setup(value_x, [["a", "b", "c"]]).run().report();

let u8arr0 = new Uint8Array([0x41, 0x42, 0x43]);
let u8arr1 = new Uint8Array([0x41, 0x41, 0x43]);
new TestCase("u8_array").expected(tch.assert_equal_array, u8arr0).
    setup(value_x, [u8arr0]).run().report();
new TestCase("u8_array_fail").expected(tch.assert_equal_array, u8arr1).
    setup(value_x, [u8arr0]).run().report();

new TestCase("null_test_null").expected(tch.assert_null).setup(value_x, [null]).run().report();
new TestCase("null_test_0").expected(tch.assert_null).setup(value_x, [0]).run().report();
new TestCase("null_test_false").expected(tch.assert_null).setup(value_x, [false]).run().report();

new TestCase("not_null_test_0").expected(tch.assert_not_null).setup(value_x, [0]).run().report();
new TestCase("not_null_test_null").expected(tch.assert_not_null).setup(value_x, [null]).run().report();


new TestCase("throw_test_error").
    expected(tch.assert_exception, null, new Error("test_error")).
    setup(raise_exception, ["test_error"]).
    run().report();

new TestCase("throw_another_error").
    expected(tch.assert_exception, null, new Error("test_error")).
    setup(raise_exception, ["another_error"]).
    run().report();

new TestCase("throw_test_error_short").
    set_expected_error(new Error("test_error")).setup(raise_exception, ["test_error"]).
    run().report();

new TestCase("throw_test_another_error_short").
    set_expected_error(new Error("test_error")).setup(raise_exception, ["test_another_error"]).
    run().report();

new TestCase("unexpected error.").
    expected(tch.assert_no_exceptation).setup(raise_exception, ["unexpected1"]).run().report();


function return_promise0(val) {
    return new Promise(
	resolve => {
	    setTimeout( () => {
		resolve(val*val);
	    }, 1000);
	}
    );
}

new TestCase("async test 2*2 ?= 4").expected(tch.assert_equal, 4).setup(return_promise0, [2]).run().report();
new TestCase("async test 3*3 ?= 10").expected(tch.assert_equal, 10).setup(return_promise0, [3]).run().report();
