function jpeg_operations_constructor(image_array) {
    function on_browser() {
	if (typeof window !== 'undefined')
	    return true;
	else
	    return false;
    }

    function image_segment_length(pos) {
	if (image_array[pos] == 0xff && image_array[pos+1] == 0xda) // SOS
	    return image_array.length - pos - 2;
	else
	    throw new Error("wrong_image_array");
    }
    
    function segment_length(pos) {
	function is_sos_marker(code) {
	    return code == 0xda; // SOS
	}
	
	function is_stand_alone_marker(code) {
	    if (code == 0xd7 || // RST
		code == 0xd8 || // SOI
		code == 0xd9 || //EOI
		code == 0x01 // TEM
	       )
		return true;
	    else
		return false;
	}

	function is_valid_segment(pos) {
	    if (image_array[pos] != 0xff)
		return false;
	    let c = image_array[pos+1];

	    // marker codes https://hp.vector.co.jp/authors/VA032610/JPEGFormat/markers.htm
	    if ( c == 0x01 ||
		 (0x02 <= c && c <= 0x4e) || // reserved
		 c == 0xc0 ||
		 c == 0xc1 ||
		 c == 0xc2 ||
		 c == 0xc3 ||
		 c == 0xc4 ||
		 c == 0xc5 ||
		 c == 0xc6 ||
		 c == 0xc7 ||
		 c == 0xc8 ||
		 c == 0xc9 ||
		 c == 0xca ||
		 c == 0xcb ||
		 c == 0xcc ||
		 c == 0xcd ||
		 c == 0xce ||
		 c == 0xcf ||
		 (0xd0 <= c && c <= 0xd7) ||
		 c == 0xd8 ||
		 c == 0xd9 ||
		 c == 0xda ||
		 c == 0xdb ||
		 c == 0xdc ||
		 c == 0xdd ||
		 c == 0xde ||
		 c == 0xdf ||
		 (0xe0 <= c && c <= 0xef) || // APP
		 (0xf0 <= c && c <= 0xfd) ||
		 c == 0xfe
	       )
		return true;

	    return false;
	}
	
	let rest_length = image_array.length - pos;
	//if (rest_length < 2 || image_array[pos] != 0xff || !is_valid_marker(image))
	if (rest_length < 2 || !is_valid_segment(pos))
	    throw new Error("wrong_image_array");
	
	if (is_sos_marker(image_array[pos+1]))
	    return image_segment_length(pos);
	
	if (is_stand_alone_marker(image_array[pos+1]))
	    return 0;
	
	return 256 * image_array[pos+2] + image_array[pos+3];
    }
    
    function get_segment(pos) {
	let segment_body_len = segment_length(pos);
	let end_pos = pos + segment_body_len + 2;
	return image_array.slice(pos, end_pos);
    }

    function get_all_segments() {
	if (m_segments.length > 0 )
	    return m_segments;

	let pos = 0;
	while (pos < image_array.length) {
	    let seg = get_segment(pos);
	    pos += seg.length;
	    m_segments.push(seg);
	}

	if (m_segments.length <= 0)
	    throw new Error("wrong_image_array");

	return m_segments;
    }

    function get_image_array() { return image_array; }

    function is_comment_segment(segment) {
	if (segment[0] == 0xff && segment[1] == 0xfe) // COM
	    return true;
	else
	    return false;
    }

    function get_comment() {
	function extract_comment_str(segment) {
	    if (on_browser())  {
		return new TextDecoder('utf-8').decode( segment.slice(4) );
	    }else {
		return new Buffer( segment.slice(4) ).toString('utf-8');
	    }
	}

	for (let i=0; i<m_segments.length; i++) {
	    if (is_comment_segment(m_segments[i]))
		return extract_comment_str(m_segments[i]);
	}

	return null;
    }

    function set_comment(comment) {
	function str2u8array(str) {
	    if(on_browser()) {
		return new TextEncoder('utf-8').encode(str);
	    } else {
		let buffer = Buffer.from(str);
		return new Uint8Array(buffer);
	    }
	}

	function create_comment_segment(segment_body_array) {
	    const MaxCommentLength = 65533; // 0xffff - 2

	    if (segment_body_array.length > MaxCommentLength)
		throw new Error("Too long comment");

	    let segment_head = new Uint8Array([ 0xff, 0xfe, 0, 0]);

	    let segment_body_len = segment_body_array.length + 2;
	    segment_head[2] = Math.floor(segment_body_len / 256);
	    segment_head[3] = segment_body_len % 256;

	    let comment_segment = new Uint8Array(segment_head.length + segment_body_array.length);
	    comment_segment.set(segment_head);
	    comment_segment.set(segment_body_array, segment_head.length);

	    return comment_segment;
	}

	function concat_segments(segments) {
	    let whole_len = 0;
	    for (let i=0; i<segments.length; i++)
		whole_len += segments[i].length;

	    let buffer = new Uint8Array(whole_len);
	    let pos = 0;
	    for (let i=0; i<segments.length; i++) {
		buffer.set(segments[i], pos);
		pos += segments[i].length;
	    }

	    return buffer;
	}

	let new_segments = [];
	for (let i=0; i<m_segments.length; i++) {
	    if (!is_comment_segment(m_segments[i]))
		new_segments.push(m_segments[i]);
	}

	if (comment) {
	    let comment_segment = create_comment_segment( str2u8array(comment) );
	    new_segments.splice(new_segments.length-1, 0, comment_segment);
	}

	m_segments = new_segments;
	image_array = concat_segments(new_segments);
    }
        
    // main //////////////////////////////////////////////////////////
    let m_segments = [];
    get_all_segments();
    return {
	get_image_array : get_image_array,
	get_all_segments : get_all_segments,
	get_comment : get_comment,
	set_comment : set_comment
    };
}

exports.jpeg_operations_constructor = jpeg_operations_constructor;
