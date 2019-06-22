import '../node_modules/react-tabs/style/react-tabs.css';
import ImoIcon  from '../../imo-logo.png';

import React from "react";
import ReactDom from "react-dom";
import Rule from './rule.js';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

const ImageDice = require('./image-dice-electron.js').ImageDice;
const TestElectron = require('./test-electron.js');

function imoLoad() {
    let img = document.getElementById('imologo');
    img.src = ImoIcon;
}

imoLoad();

export default class MainScreen extends React.Component {
    constructor(props) {
	super(props);

	this.image_dice = new ImageDice(this);
	this.state = this.image_dice.getState();
    }

    update() {
	this.setState(this.image_dice.getState());
    }

    handleError(e) {
	alert(e);
    }

    contextMenuHandleRule(e, data) {
	console.log("HANDLE-CONT-RULE:", data.index, data.image_dice);
	if (data.operation === "copy") {
	    data.image_dice.copyRule(data.index);
	} else if(data.operation=== "remove") {
	    data.image_dice.removeRule(data.index);
	}

	data.image_dice.update();
    }

    renderContextMenuRule(index) {
	let menu_id= "rule_menu_" + index;
	return (
	    <ContextMenu key={menu_id} id={menu_id} className="contextMenu">
		<MenuItem data={{operation:"copy", index:index, image_dice:this.image_dice}}
			  onClick={this.contextMenuHandleRule}>
		    Copy
		</MenuItem>
		<MenuItem data={{operation:"remove", index:index, image_dice:this.image_dice}}
			  onClick={this.contextMenuHandleRule}>
		    Remove
		</MenuItem>
	    </ContextMenu>
	);
    }

    renderRules() {
	let panel_list = [];
	let panels = [];

	let rule_list = this.image_dice.rule_list;
	for (let i=0; i<rule_list.length; i++) {
	    let rule = this.image_dice.getRule(i);
	    let menu_id= "rule_menu_" + i;

	    let tab_style = "ruleTabValid";
	    
	    if (!rule.isValid().valid) {
		tab_style = "ruleTabInvalid";
	    }

	    if (rule.getTargets().length <= 0)
		tab_style = "ruleTabNoTarget";

	    let duplicated_targets = this.image_dice.duplicatedTargets();
	    let found_dup = rule.getTargets().filter( (t) => duplicated_targets.find( x => (t===x) ));
	    if (found_dup.length > 0)
		tab_style = "ruleTabInvalid";


	    let tab_name = rule.getName() ? rule.getName() : "[NO NAME]";
	    tab_name += (rule.getNewline() ? '\u23ce' : '');

	    panel_list.push(
		<Tab key={i}>
		    <ContextMenuTrigger id={menu_id}>
			<span className={tab_style}> {tab_name}</span>
		    </ContextMenuTrigger>
		</Tab>
	    );
	    
	    panels.push(
		<TabPanel key={i}>
		    <Rule key={i} rule={rule} duplicated_targets={duplicated_targets} />
		    {this.renderContextMenuRule(i)}
		</TabPanel>
	    );
	}

	return (
	    <Tabs defaultFocus={true} defaultIndex={0}>
		<TabList>
		    {panel_list}
		</TabList>
		{panels}
	    </Tabs>
	);
    }

    contextMenuHandleMain(e, data) {
	if (data.operation=="append") {
	    data.image_dice.appendRule();
	} else if (data.operation=="openimage") {
	    data.image_dice.open();
	}
    }

    renderContextMenuMain() {
	return (
	    <ContextMenu id="main_menu" className="contextMenu">
		<MenuItem key="1" data={{operation:"openimage", image_dice:this.image_dice}}
			  onClick={this.contextMenuHandleMain} >
		    Open Image
		</MenuItem>
		<MenuItem key="2" data={{operation:"append", image_dice:this.image_dice}}
			  onClick={this.contextMenuHandleMain} >
		    Append New Rule
		</MenuItem>
	    </ContextMenu>
	);
    }

    render() {
	return (
	    <div className="image_dice_container">
		<ContextMenuTrigger id="main_menu">
		    <div>
			<button onClick={() => this.image_dice.open()}> OPEN </button>
			<button onClick={() => this.image_dice.save()}> SAVE </button>
			<button onClick={() => this.image_dice.appendRule()}> NEW RULE </button>
			<button onClick={() => TestElectron.generateAndOpen(this.image_dice)}> TEST </button>
			<br/>
			<div className="dummy_image_box"> </div>
			<img className="image_box" src={this.state.image_src} />
		    </div>

		</ContextMenuTrigger>

		<div className="image_dice_spacer"></div>

		<div>
		    {this.renderRules()}
		</div>

		{this.renderContextMenuMain()}

		<Modal isOpen={this.image_dice.getDialogMessage()!==null}>
		    Error:{this.image_dice.getDialogMessage()}
		    <div> <button onClick={()=>this.image_dice.closeErrorDialog()}> ok </button> </div>
		</Modal>
	    </div>

	);
    }
}

ReactDom.render(<MainScreen />, document.getElementById('app'));
