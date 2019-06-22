function rpg_dice_rule(rule_string) {
    /*
      rpg_dice_rule holds rules (m_rules). m_rules is array of rule object.
      rule object is like below.

      { name: rule_name_string,
        newline : boolean if we should newline,
	pip_value_list: list of values corresponding to dice(pip)
      }

      apply() function returns list of applied object.
      The applied object is like below.
      { disp: rule applied result. This value will be displayed,
        name: name of pip,
        value: value of dice,
	is_pip_value: boolean value is modified by pip_value_list or not,
	delimiter: '<br>' or one space ' '
      }
     */

    function parse(rule_str) {
	const MaxDiceNumber  = 10;

	function check_rule_number(sharp_number) {
	    let result = [];
	    let m = null;
	    while(m = sharp_number.match(/#(\d+)/)) {
		result.push(Number(m[1]));
		sharp_number = sharp_number.replace(/#\d+/, "");
	    }
	    return result;
	}

	rule_str = rule_str.replace(/<br>/ig, "\n");
	rule_str = rule_str.replace(/;/g, ";\n");
	rule_str = rule_str.replace(/,/g, ",\n");
	let rule_candidates = rule_str.split(/\r?\n/);

	let rules = {};
	rule_candidates.forEach(
	    function(e, i, arr) {
		let m = null;
		if (m = e.match(/^\s*(#[#\d]+)[^,;]*[,;]\s*$/)) {
		    check_rule_number(m[1]).forEach(
			function(n) {
			    if (n<0 || n>MaxDiceNumber || isNaN(n))
				throw new Error("pip_value_error");
			    let rule = parse_rule_line(m[0]);

			    // special rule #0 means all rules are smme.
			    if (n==0) {
				for (let i=1; i<=MaxDiceNumber; i++){
				    rules[i] = rule;
				}
			    } else {
				rules[n] = rule;
			    }
			}
		    );
		}
	    }
	);

	return rules;
    }

    function parse_rule_line(rule) {
	function sort_pip_value_list(pv_list) {
	    let tmp_list = [];

	    for (let i=0; i<pv_list.length; i++){
		let p_v = pv_list[i].split(/:/);
		if (p_v.length != 2)
		    throw new Error("pip_value_error");

		let pip = Number(p_v[0]);
		if (pip <= 0 || Number.isNaN(pip))
		    throw new Error("pip_value_error");

		tmp_list.push({pip:Number(p_v[0]), value:p_v[1]})
	    }

	    let duplicate_check = {}
	    for (let i=0; i<tmp_list.length; i++) {
		if (tmp_list[i].pip in duplicate_check)
		    throw new Error("pip_value_error");
		duplicate_check[ tmp_list[i].pip ] = 1;
	    }

	    return tmp_list.sort( (a, b) => { return (a.pip - b.pip); } );
	}

	function sanitize(str) {
	    return str.replace(/["'`<>&]/g, '*');
	}

	let m = rule.match(/\s*[#\d]+\s+([^;,]*)([;,])/);
	if (!m)
	    return null;

	let rule_str = m[1].replace(/\s*$/, "");
	rule_str = sanitize(rule_str);
	let delimiter_newline = (m[2] === ";");

	let rule_portions = rule_str.split(/\s+/);
	let rule_name = rule_portions.shift();

	return { name: rule_name,
		 newline: delimiter_newline,
		 pip_value_list: sort_pip_value_list(rule_portions)
	       };
    }

    function apply(dice_object) {
	function applied_obj(disp, name, value, is_newline=false, is_pip_value=false) {
	    return {disp : disp,
		    name : name,
		    value : value,
		    is_pip_value : is_pip_value,
		    delimiter: is_newline ? '<br>' : ' '
		   };
	}

	function apply_pip_value_list(pv_list, pip) {
	    for (let i = 0; i<pv_list.length; i++) {
		let pv_element = pv_list[i];
		if (pip <= pv_element.pip)
		    return pv_element.value;
	    }

	    return pip;
	}
	
	if (!m_rules || !dice_object)
	    return null;

	let result = [];
	let eyes = dice_object.eyes;
	for (let i=0; i<eyes.length; i++) {
	    let ri = m_rules[i+1];
	    	    
	    if (typeof(ri) === "undefined") {
		result.push( applied_obj("d"+(i+1) + ":" + eyes[i],
					 "d"+(i+1),
					 eyes[i]
					)
			   );
		continue;
	    }

	    // Special rule: if parameter name starts '#' the name is not displayed.
	    let name_str = "";
	    let name_val = "";
	    if (ri.name.length && ri.name[0] != '#') {
		name_str = ri.name + ":";
		name_val = ri.name;
	    }

	    if (ri.pip_value_list.length > 0)
		result.push( applied_obj(
		    name_str + apply_pip_value_list(ri.pip_value_list, eyes[i]),
		    name_val,
		    eyes[i],
		    ri.newline,
		    true
		) );
	    else {
		result.push( applied_obj(name_str + eyes[i],
					 name_val,
					 eyes[i],
					 ri.newline,
					 false
					)
			   );
	    }
	}

	return result;
    }

    function rules() {
	if (!m_rules || Object.keys(m_rules).length <= 0)
	    return null;

	return m_rules;
    }

    function is_valid() {
	if (!m_rules)
	    return false;

	return (Object.keys(m_rules).length > 0);
    }

    let m_rules = {};
    if (rule_string)
	m_rules = parse(rule_string);

    return { rules: rules,
	     parse : parse,
	     parse_rule_line : parse_rule_line,
	     apply : apply,
	     is_valid: is_valid
	   };
}

exports.rpg_dice_rule = rpg_dice_rule;
