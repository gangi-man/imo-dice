class PipValueList {
    constructor(parent) {
	this.parent = parent;
	this.pv_list = []; // list of {pip: PIP, value: value}
	this.editing = -1;

	this.duplicated_pip = [];
	this.duplicated_value = [];
    }

    updateDuplicated() {
	let dic_pip = {};
	let duplicated_pip = {};
	let dic_value = {};
	let duplicated_value = {}

	this.pv_list.forEach(
	    function (pv) {
		if (pv.pip in dic_pip)
		    duplicated_pip[pv.pip] = true;

		if (pv.value in dic_value)
		    duplicated_value[pv.value] = true;
		
		dic_pip[pv.pip] = true;
		dic_value[pv.value] = true;
	    }
	);

	this.duplicated_pip = Object.keys(duplicated_pip).map( x=> parseInt(x) );
	this.duplicated_value = Object.keys(duplicated_value);
    }

    update() {
	this.updateDuplicated();
	
	if (this.parent)
	    this.parent.update();
    }

    duplicate() {
	let pip_value_list = new PipValueList(this.parent);
	pip_value_list.pv_list = JSON.parse(JSON.stringify(this.pv_list)); 
	pip_value_list.editing = -1;

	return pip_value_list;
    }

    getState() {
	let state =
	    {
		pv_list : this.pv_list,
		editing : this.editing
	    };

	return JSON.parse( JSON.stringify(state) );
    }

    equals(r) {
	if (this.pv_list.length != r.pv_list.length)
	    return false;

	this.sort(false);
	r.sort(false);
	
	for (let i=0; i<this.pv_list.length; i++) {
	    let pvo = this.pv_list[i];
	    let pvr = r.pv_list[i];

	    if (pvo.pip !== pvr.pip)
		return false;
	    if (pvo.value !== pvr.value)
		return false;
	}

	return true;
    }

    get(index) {
	return this.pv_list[index];
    }

    set(index, pip, value) {
	this.pv_list[index] = { pip:pip, value:value };
	this.update();
    }

    length() {
	return this.pv_list.length;
    }

    getEditing() {
	return this.editing;
    }

    normalizePips() {
	for (let i=0; i<this.pv_list.length; i++) {
	    let pip = parseInt(this.pv_list[i].pip);
	    if (isNaN(pip) || pip < 0)
		pip = 0;

	    this.pv_list[i].pip = pip;
	}
    }

    normalizeValues() {
	for (let i=0; i<this.pv_list.length; i++)
	    this.pv_list[i].value = this.pv_list[i].value.replace(/\s+/g, '');
    }

    normalize() {
	this.normalizePips();
	this.normalizeValues();
	this.sort();
    }

    setEditing(index) {
	this.normalizePips();
	this.editing = index;
	this.update();
    }

    append(index, pip, value, needUpdate=true) {
	this.pv_list.splice(index, 0, {pip: pip, value: value});

	if (needUpdate)
	    this.update();
    }

    remove(index, needUpdate=true) {
	this.pv_list.splice(index, 1);

	if (needUpdate)
	    this.update();
    }

    sort(needUpdate=true) {
	this.pv_list.sort( (a, b) => (a.pip - b.pip) );

	if (needUpdate)
	    this.update();
    }

    getDuplicatedPip() {
	return this.duplicated_pip;
    }

    getDuplicatedValue() {
	return this.duplicated_value;
    }

    isValid() {
	let dup_pips = this.getDuplicatedPip();
	if (dup_pips.length > 0) {
	    return {valid:false, message: "Rule pip duplicated error."};
	}

	for (let i=0; i<this.pv_list.length; i++) {
	    if (this.pv_list[i].pip === 0) {
		return {valid:false, message: "0 pip error"};
	    }
	}

	return {valid:true, message: ""};
    }
}

exports.PipValueList = PipValueList;
