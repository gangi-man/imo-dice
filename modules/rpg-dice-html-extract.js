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

    function is_akahuku() {
	let metas = document.getElementsByTagName('meta');
	if (!metas)
	    return false;
	
	for (let i=0; i<metas.length; i++) {
	    if (metas[i].getAttribute("name")=="generator" && metas[i].getAttribute("content")=="akahukuplus")
		return true;
	}

	return false;
    }

    function extract_akahuku() {
	function rewriteDice(text) {
	    let orgText = text;
	    let lines = text.split(/<\s*br\s*>/i);

	    for (let i=0; i<lines.length; i++) {
		if (lines[i].match(/dice\d+d\d+=/) && lines[i].match(/<\s*span\s+class\s*=\s*"mark"\s*>/)) {
		    lines[i] = lines[i].replace(/<\s*\/span\s*>/, "</font>");
		    lines[i] = lines[i].replace(/<\s*span[^>]*>/, "<font color=\"#ff0000\">");
		}
	    }

	    return lines.join("<br>");
	}
	
	let results = [];
	let comments = document.getElementsByClassName("comment");
	if (!comments)
	    return null;
	
	for (let i=0; i<comments.length; i++) {
	    if (comments[i].tagName != "DIV")
		continue;

	    comments[i].innerHTML = rewriteDice(comments[i].innerHTML);

	    results.push(
		{
		    element : comments[i],
		    dice : _get_dice(comments[i])
		}
	    );
	}

	return results;
    }

    function extract_2chan() {
	let result = [];

	let threads = document.getElementsByClassName('thre');
	for (let i=0; i<threads.length; i++) {
	    let bloq_list = threads[i].getElementsByTagName('BLOCKQUOTE');

	    if (bloq_list)
		for (let i=0; i<bloq_list.length; i++) {
		    result.push(
			{
			    element : bloq_list[i],
			    dice : _get_dice(bloq_list[i])
			}
		    );
		}
	}

	return result;
    }

    function extract() {
	if (is_akahuku()) {
	    return extract_akahuku();
	} else {
	    return extract_2chan();
	}
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

    function extract_image_proc_akahuku() {
	let articles = document.getElementsByTagName('ARTICLE');
	for (let i=0; i<articles.length; i++) {
	    let anchors = articles[i].getElementsByTagName('A');
	    if (!anchors)
		continue;
	    
	    for (let j=0; j<anchors.length; j++) {
		let images = anchors[j].getElementsByTagName('IMG');
		if (!images || images.length <= 0)
		    continue;

		let url = anchors[j].href;
		if (!url)
		    continue;

		if (url.match(/^data:/i))
		    continue;

		return _get_image_binary_promise(url);
	    }
	}
    }

    // Extract the first anchor element which has one or more image tags and its link match \d+.jpg
    //  and the tag is included by <div class="thre" ...>
    function extract_image_proc_2chan(strict_mode) {
	function get_image_url(div) {
	    let alist = div.getElementsByTagName('a');
	    for (let i=0; i<alist.length; i++) {
		let a_element = alist[i];

		if (strict_mode && !a_element.href.match(/\d+\.jpe?g/i))
		    continue;
		
		let images = a_element.getElementsByTagName('img');
		if (images.length)
		    return a_element.href;
	    }

	    return null;
	}

	let threads = document.getElementsByClassName("thre");
	for (let i=0; i<threads.length; i++) {
	    let t = threads[i];
	    if (t.tagName != "DIV")
		continue;

	    let url = get_image_url(t);
	    if (url === null)
		continue;

	    if ( strict_mode && !url.match(/^https?:\/\/[^.]+\.2chan.net\//i))
		continue;

	    return _get_image_binary_promise(url);
	}

	return null;
    }

    function extract_image() {
	let result = null;
	
	if (is_akahuku()) {
	    result = extract_image_proc_akahuku();
	    if (result !== null)
		return result;
	} else {
	    result = extract_image_proc_2chan(true);
	    if (result !== null)
		return result;

	    result = extract_image_proc_2chan(false);
	    if (result !== null)
		return result;
	}

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
