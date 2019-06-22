function testdayo() {
    console.log("********************");
    console.log("in dice testdayo");
    console.log("********************");
}

function test_imodice () {
    let imo_exp = __imo_dice__();
    console.log("## IMOOBJ ##########################################################");
    console.log(Object.keys(imo_exp));

    let res_list = imo_exp.rpg_dice_html_extract().extract();
    console.log(res_list);
}

function extract() {
    return __imo_dice__().rpg_dice_html_extract().extract();
}

function extract_image(strict_mode) {
    return __imo_dice__().rpg_dice_html_extract().extract_image(strict_mode);
}

function get_rule(image_buffer) {
    let jpeg_op = __imo_dice__().jpeg_operations_constructor(image_buffer);
    console.log(`cocomment:${jpeg_op.get_comment()}:`);
    return jpeg_op.get_comment();
}

function test_replace_rule(rule_str=null) {
    let rule = null;
    let dice_element_list = extract();
    if (rule_str===null) {
	for (let i=0; i<dice_element_list.length; i++) {
	    let rule_candidate = __imo_dice__().rpg_dice_rule(dice_element_list[i].element.innerHTML);
	    if (rule_candidate.is_valid()) {
		console.log("FOUND!");
		rule = rule_candidate;
		break;
	    }
	}
    } else {
	rule = __imo_dice__().rpg_dice_rule(rule_str);
    }

    if (!rule) {
	alert('no rule page');
	return;
    }

    for (let i=0; i<dice_element_list.length; i++) {
	let applied = rule.apply(dice_element_list[i].dice);

	if (applied) {
	    console.log(applied);
	    let applied_html = applied.map( (e) => e.disp + e.delimiter).reduce( (p, c) => (p+c) );
	    let bloq = dice_element_list[i].element;
	    bloq.innerHTML += '<br>' + '<font color=\'#841a75\' size=\'-1\'>' + applied_html + '</font>';
	}
    }
}

function extract_rule_image(strict_mode) {
    return extract_image(strict_mode);
}

function extract_rule(strict_mode) {
    return extract_image(strict_mode).
	then(get_rule);
}

var ImoDisplay = null;
function show_dice() {
    console.log("show!");
    if (!ImoDisplay)
	ImoDisplay = __imo_dice__().rpg_dice_display();

    ImoDisplay.show(false);
}

function show_chart() {
    console.log("SHOW CHART!");
    __imo_dice__().rpg_dice_display().show_chart(100, [], [Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*100, Math.random()*10]);
}
