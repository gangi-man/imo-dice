function on_browser() {
    if (typeof window !== 'undefined')
	return true;
    else
	return false;
}

function string_to_u8(str) {
    if (on_browser()) {
	return new TextEncoder('utf-8').encode(str);
    } else {
        let buffer = Buffer.from(str);
	return new Uint8Array(buffer);
    }
}

function u8_to_string(u8_arr) {
    if (on_browser()) {
	return new TextDecoder('utf-8').decode(u8_arr);
    } else {
	return new Buffer(u8_arr).toString('utf-8');
    }
}

exports.string_to_u8 = string_to_u8;
exports.u8_to_string = u8_to_string;
