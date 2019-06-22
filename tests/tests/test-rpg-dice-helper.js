
function rule_obj(name, newline=true, pv_list=[]) {
    return { name: name,
	     newline: newline,
	     pip_value_list: pv_list
	   };
}

function pip_obj(pip, value) {
    return { pip: pip, value: value};
}

function dice_obj(eyes, max=0, add=0) {
    max = Math.max.apply(null, eyes.concat([max]));

    return {
	dice_number : eyes.length,
	dice_value_max : max,
	dice_addition : add,
	eyes : eyes,
	sum : eyes.reduce( (p,c) => {return p+c; })
    };
}

function imo_dice(disp, name, value, is_pip_value=false, is_newline=false) {
    return {
	disp : disp,
	name : name,
	value : value,
	is_pip_value : is_pip_value,
	delimiter : is_newline ? '<br>' : ' '
    };
}

exports.rule_obj = rule_obj;
exports.pip_obj = pip_obj;
exports.dice_obj = dice_obj;
exports.imo_dice = imo_dice;
