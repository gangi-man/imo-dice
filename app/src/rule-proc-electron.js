const RPGDiceRule = require('../../modules/rpg-dice-rule.js');
const Rule = require('./rule-electron.js').Rule;
const PipValueList = require('./pip-value-list-electron.js').PipValueList;

function generate_pip_value_list(parent, rpg_rule) {
    let pip_value_list = new PipValueList(parent);

    if (rpg_rule.pip_value_list) {
	for (let i=0; i<rpg_rule.pip_value_list.length; i++) {
	    let pv = rpg_rule.pip_value_list[i];

	    pip_value_list.append(pip_value_list.length(), pv.pip, pv.value, false);
	}
    }

    pip_value_list.sort();
    return pip_value_list;
}

function reduce_rule_list(rule_list) {
    let reduced = [];
    
    for (let i=0; i<rule_list.length; i++) {
	let rule = rule_list[i];
	let foundInReduced = false;

	for (let j=0; j<reduced.length; j++) {
	    let rrule = reduced[j];

	    if (rrule.equals(rule)) {
		foundInReduced = true;
		rrule.targets = rrule.targets.concat(rule.targets);
		break;
	    }
	}

	if (!foundInReduced)
	    reduced.push(rule);
    }

    return reduced;
}

function generate_rule_list(parent, rule_text=null) {
    if (rule_text === null)
	return [];

    let rpg_rule_object = RPGDiceRule.rpg_dice_rule(rule_text);
    if (!rpg_rule_object)
	return [];
    
    let rpg_rules = rpg_rule_object.rules();
    if (!rpg_rules)
	return [];

    let dice_num_list = Object.keys(rpg_rules);

    let rules = []
    let rule_this = this;
    for (let i=0; i<dice_num_list.length; i++) {
	let dnum = dice_num_list[i];
	let rpg_rule = rpg_rules[dnum];

	let pip_value_list = generate_pip_value_list(parent, rpg_rule);
	let r = new Rule(parent, rpg_rule.name, [dnum], rpg_rule.newline, pip_value_list.length() > 0, pip_value_list);

	rules.push(r);
    }

    return reduce_rule_list(rules);
}

exports.generate_rule_list = generate_rule_list;
