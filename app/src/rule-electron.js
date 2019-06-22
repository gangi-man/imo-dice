const PipValueList = require('./pip-value-list-electron.js').PipValueList;

class Rule {
    constructor(parent, name, targets=[], newline=false, use_pip_value_list=false, pip_value_list=null) {
	this.parent = parent;
	this.name = name;
	this.targets = targets;
	this.newline = newline;
	this.use_pip_value_list = use_pip_value_list;

	if (pip_value_list === null)
	    this.pip_value_list = new PipValueList(this);
	else
	    this.pip_value_list = pip_value_list;

	this.normalizeTargets();
    }

    update() {
	if (this.parent)
	    this.parent.update();
    }

    duplicate() {
	return new Rule(this.parent,
			this.name,
			JSON.parse(JSON.stringify(this.targets)),
			this.newline,
			this.use_pip_value_list,
			this.pip_value_list.duplicate()
		       );
    }

    getState() {
	let stat =
	    {
		name : this.name,
		targets : this.targets,
		newline : this.newline,
		use_pip_value_list : this.use_pip_value_list,
		pip_value_list : this.pip_value_list.getState(),
	    };

	return JSON.parse( JSON.stringify(stat) );
    }

    normalizeTargets() {
	let new_targets = [];
	for (let i=0; i<this.targets.length; i++) {
	    new_targets.push( parseInt(this.targets[i]) );
	}

	new_targets = new_targets.filter( (e, i, arr) => arr.indexOf(e) == i );
	this.targets = new_targets.sort();
    }

    normalize() {
	this.name = this.name.replace(/\s+/g, '');
	this.normalizeTargets();
	this.pip_value_list.normalize();
    }

    equals(r) {
	if ( (this.name === r.name) &&
	     (this.newline === r.newline) &&
	     (this.use_pip_value_list === r.use_pip_value_list)
	   )
	{
	    if (this.pip_value_list && r.pip_value_list)
		return this.pip_value_list.equals(r.pip_value_list);

	    return true;
	}
	
	return false;
    }

    getName() {
	return this.name;
    }

    setName(value) {
	this.name = value;
	this.update();
    }

    getShouldDisplayName() {
	if (this.name.match(/^#/))
	    return false;
	else
	    return true;
    }

    setShouldDisplayName(value) {
	let new_name = this.name;

	if (value)
	    new_name = new_name.replace(/^#+/, '');
	else
	    new_name = new_name.replace(/^#*/, '#');


	this.name = new_name;
	this.update();
    }

    getNewline() {
	return this.newline;
    }

    setNewline(value) {
	this.newline = value;
	this.update();
    }

    getPipValueList() {
	return this.pip_value_list;
    }

    getUsePipValueList() {
	return this.use_pip_value_list;
    }

    setUsePipValueList(value) {
	this.use_pip_value_list = value;
	this.update();
    }

    flipTarget(target) {
	if (this.targets.find(x => x===target))
	    this.targets = this.targets.filter(x => x!==target);
	else
	    this.targets.push(target);

	this.normalizeTargets();
	this.update();
    }

    getTargets() {
	return this.targets;
    }

    generateRuleText() {
	if (this.targets.length <= 0)
	    return "";

	let result = "";
	for (let i=0; i<this.targets.length; i++)
	    result += ("#" + this.targets[i]);

	result += " " + (this.name ? this.name : "#NONAME");

	if (this.use_pip_value_list) {
	    for (let i=0; i<this.pip_value_list.length(); i++) {
		let pv = this.pip_value_list.get(i);
		result += (" " +  pv.pip + ":" + pv.value);
	    }
	}

	result += (this.newline ? ";" : ",");

	return result;
    }

    isValid() {
	if (this.name === "" || this.name ==="#") {
	    return { valid:false, message:"No rule name error" };
	}

	this.pip_value_list.updateDuplicated();

	if (this.getUsePipValueList()) {
	    let valid_obj = this.pip_value_list.isValid();
	    if (!valid_obj.valid) {
		return valid_obj
	    }
	}

	return {valid:true, message: ""};
    }
}

exports.Rule = Rule;
