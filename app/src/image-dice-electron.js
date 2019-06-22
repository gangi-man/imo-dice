const Electron = window.require('electron');
const JpegOp = require('../../modules/jpeg-operations.js');
const DiceRule = require('../../modules/rpg-dice-rule.js');
const Rule = require('./rule-electron.js').Rule;
const GenerateRuleList = require('./rule-proc-electron.js').generate_rule_list;

import NoImage from '../../no-imoge.png';


function getImageFile() {
    let files = Electron.remote.dialog.showOpenDialog();

    if (files.length <= 0)
	return Promise.reject(new Error('file error'));

    return new Promise(
	function(resolve, reject) {
	    let xml = new XMLHttpRequest();
	    xml.open("GET", files[0]);
	    xml.responseType = "arraybuffer";

	    xml.onload = function(e) {
		if (xml.status !== 200)
		    reject(new Error('File load error:'));
		
		let byteArray = null;
		if (xml.response)
		    byteArray = new Uint8Array(xml.response);

		resolve({url: files[0], data:byteArray});
	    }

	    xml.send(null);
	}
    );
}

class ImageDice {
    constructor(react_object=null) {
	this.image_src = NoImage;
	this.image_object = null;
	this.dialog_message = null;

	this.rule_list = GenerateRuleList(this);
	this.react_object = react_object;
    }

    update() {
	if (this.react_object)
	    this.react_object.update();
    }

    getState() {
	let state =
	    {
		image_src : this.image_src,
		image_buffer : this.image_buffer,
		rule_list : this.rule_list.map( r => r.getState() )
	    };

	return JSON.parse( JSON.stringify(state) );
    }

    normalize() {
	for (let i=0; i<this.rule_list.length; i++) {
	    let rule = this.rule_list[i];
	    rule.normalize();
	}
    }

    getRule(index) {
	return this.rule_list[index];
    }

    getAllRules() {
	return this.rule_list;
    }

    appendRule() {
	function getVacantTarget(rule_list) {
	    let occupied = [];
	    for (let i=0; i<rule_list.length; i++)
		occupied = occupied.concat(rule_list[i].getTargets());

	    let result = 10;
	    for (let i=1; i<=10; i++) {
		if (!occupied.find(x=>x===i)) {
		    result = i;
		    break;
		}
	    }
	    return result;
	}
	
	this.rule_list.push( new Rule(this, "new-rule", [getVacantTarget(this.rule_list)], false, null) );
	this.update();
    }

    removeRule(index) {
	this.rule_list.splice(index, 1);
	this.update();
    }

    copyRule(index) {
	let rule = this.rule_list[index].duplicate();
	this.rule_list.splice(index+1, 0, rule);
	
	this.update();
    }

    duplicatedTargets() {
	let duplicated = {};
	let found = {};
	for (let i=0; i<this.rule_list.length; i++) {
	    let targets = this.rule_list[i].getTargets();
	    targets.forEach(
		function(t) {
		    if (t in found)
			duplicated[t] = true;
		    found[t] = true;
		}
	    );
	}

	return Object.keys(duplicated).map(x=>parseInt(x));
    }

    generateRuleText() {
	let result = "";
	for (let i=0; i<this.rule_list.length; i++) {
	    let r = this.rule_list[i];
	    console.log("TEXT:", r.generateRuleText());
	    result += r.generateRuleText() + "\n";
	}

	return result;
    }

    open() {
	getImageFile().
		 then( (url_buffer) => this.setImageBuffer(url_buffer) ).
		 then( () => this.update() ).
		 catch( this.handleError);
    }

    save(out_file=null) {
	this.normalize();
	this.update();
	
	let valid_obj = this.isValid();
	if (!valid_obj.valid) {
	    this.openErrorDialog(valid_obj.message);
	    return false;
	}

	if (!this.image_object) {
	    this.openErrorDialog("no image");
	    return false;
	}

	let fs = Electron.remote.require('fs');

	this.image_object.set_comment(this.generateRuleText());

	if (out_file===null)
	    out_file = Electron.remote.dialog.showSaveDialog();


	if (out_file) {
	    fs.writeFileSync(out_file, Buffer(this.image_object.get_image_array()) );
	    return true;
	}

	return false;
    }

    getImageBuffer() {
	//return this.buffer;
    }

    setImageBuffer(url_buffer) {
	try {
	    this.image_object = JpegOp.jpeg_operations_constructor(url_buffer.data);

	    // FIXME! we have to open dialog.
	    this.rule_list = this.rule_list.concat (
		GenerateRuleList(this, this.image_object.get_comment()) );
	    this.image_src = url_buffer.url;
	} catch (e) {
	    this.openErrorDialog(e.message);
	}
    }

    getDialogMessage() {
	return this.dialog_message;
    }

    openErrorDialog(message) {
	this.dialog_message = message;
	this.update();
    }

    closeErrorDialog() {
	this.dialog_message = null;
	this.update();
    }

    isValid() {
	let dup_dies = this.duplicatedTargets();
	if (dup_dies.length > 0) {
	    return {valid: false, message: "Duplicated targets [" + dup_dies + "]" }
	}
	
	for (let i=0; i<this.rule_list.length; i++) {
	    let rule = this.rule_list[i];

	    let valid_obj = rule.isValid();
	    if (!valid_obj.valid)
		return valid_obj;
	}

	return {valid:true, message:""};
    }
}


exports.ImageDice = ImageDice;
exports.get_image_file = getImageFile;
