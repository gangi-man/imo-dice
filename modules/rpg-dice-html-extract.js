function rpg_dice_html_extract() {
    /*
      rpg_dice_extract_responses doesn't hold any data.
      This object is pointers to functions which handle html document (imoge responses).

      extract() returnes array of response object.
      Each response object contains data below.

      { element: response element in document,
        dice: dice object if dice line exists in the respnse, otherwise null
      }

      dice object detail
      { dice_number : number of cast dice,
        dice_value_max: max value of dice,
	dice_addition : +X in dice rule,
	eyes: array of each dice value.
	sum: sum of eyes
      }
     */

    function extract() {
	function get_next_block_quote(elem){
	    while(elem){
		if (elem.tagName == 'BLOCKQUOTE')
		    return elem
		elem = elem.nextElementSibling
	    }
	    return null;
	}

	let result = [];
	let input_arr = document.getElementsByTagName('input');
	for(let i=0; i<input_arr.length; i++){
	    let id_match = /delcheck(\d+)/.exec(input_arr[i].getAttribute('id'))
	    if (!id_match)
		continue;

	    let bloq = get_next_block_quote(input_arr[i]);
	    if (bloq)
		result.push( { element : bloq,
			       dice : _get_dice(bloq)
			     });
	}

	return result;
    }

    function _get_dice(blocq_element) {
	const DiceFaceRegex = /<\s*font\s+color="#ff0000"\s*>\s*([^<]*)<\/\s*font\s*>/i

	let dice_line = null;
	blocq_element.innerHTML.split(/<br>/i).forEach(
	    function(ln, i, ar){
		if (ln.match(DiceFaceRegex)) {
		    dice_line = ln;
		    return;
		}
	    }
	);

	if (!dice_line)
	    return null;

	let found = dice_line.match(/dice(\d+)d(\d+)/);
	if (!found)
	    return null;

	let dice_number = Number(found[1]);
	let dice_value_max = Number(found[2]);

	let dice_addition = 0;
	found = dice_line.match(/\d\+(\d+)=/);
	if (found)
	    dice_addition = Number(found[1]);

	found = dice_line.match(DiceFaceRegex);
	if (!found)
	    return null;

	let dice_eyes = found[1];
	const ReplaceSumRegex = /\s*\(\s*(\d+)\s*\)/;
	found = dice_eyes.match(ReplaceSumRegex);
	if (!found)
	    return null;
	let sum = Number(found[1]);
	dice_eyes = dice_eyes.replace(ReplaceSumRegex, "");

	let eyes = [];
	dice_eyes.split(/\s+/).forEach(
	    function(e) {
		eyes.push(Number(e));
	    });

	return {
	    dice_number : dice_number,
	    dice_value_max : dice_value_max,
	    dice_addition : dice_addition,
	    eyes : eyes,
	    sum : sum
	};
    }

    function extract_image_proc(strict_mode) {
	let alist = document.getElementsByTagName('a');

	for(let i=0; i<alist.length; i++) {
	    let a_element = alist[i];
	    let found = null;

	    if (!a_element.innerHTML.match(/\d+\.jpe?g/i))
		continue;

	    if (strict_mode && !a_element.href.match(/^https?:\/\/[^.]+\.2chan.net\//i))
		continue;

	    return _get_image_binary_promise(a_element.href);
	}

	return null;
    }

    function extract_image() {
	let result = extract_image_proc(true);
	if (result !== null)
	    return result;

	result = extract_image_proc(false);
	if (result !== null)
	    return result;

	throw( new Error("no_image_in_html_error") );
    }

    function _get_image_binary_promise(url, callback) {
	return new Promise(
	    function(resolve, reject) {
		let req = new XMLHttpRequest();
		req.responseType = "arraybuffer";
		req.open("GET", url);

		req.onload = function(e) {
		    let array_buffer = req.response;
		    resolve(new Uint8Array(array_buffer));
		};

		req.onerror = function(e) {
		    reject(e);
		};

		req.send(null);
	    });
    }

    return { extract: extract,
	     extract_image: extract_image
	   };
}

exports.rpg_dice_html_extract = rpg_dice_html_extract;
