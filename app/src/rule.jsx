import React from "react";

import PipValueList from './pip-value-list.js'

class RuleName extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	return (
	    <span>
		ルール名<input type="text" onChange={this.props.nameChange}  value={this.props.name} />
	    </span>
	);

    }
}

class Targets extends React.Component {
    constructor(props) {
	super(props);
    }

    clickHandler(rule, index) {
	rule.flipTarget(index);
    }

    render() {
	let targets = this.props.rule.getTargets();
	let duplicated_targets = this.props.duplicated_targets;
	let buttons = [];
	
	for (let i=1; i<=10; i++) {
	    let found = targets.find(x => x===i);
	    let isdup = duplicated_targets.find(x => x===i);

	    let button_style = "dice_not_selected";
	    if (found) {
		if (isdup)
		    button_style = "dice_selected_dup";
		else
		    button_style = "dice_selected";
	    }
	    
	    buttons.push(
		<span key={i} className={button_style}
		      onClick={()=>this.clickHandler(this.props.rule, i)}
		>
		    Dice{i}
		</span>
	    )
	}
	
	return (<div> {buttons} </div>);
    }
}


export default class Rule extends React.Component {
    constructor(props) {
	super(props);
    }

    onChangeName(event) {
	this.props.rule.setName(event.target.value);
    }

    onChangeDisplayName(event) {
	this.props.rule.setShouldDisplayName(event.target.checked);
    }

    onChangeNewline(event) {
	this.props.rule.setNewline(event.target.checked);
    }

    onChangeUsePipValueList(event) {
	this.props.rule.setUsePipValueList(event.target.checked);
    }
    
    render() {
	let rule = this.props.rule;

	return (
	    <div>
		<hr />
		<RuleName name={rule.getName()}
			  nameChange={this.onChangeName.bind(this)} />

		<Targets rule={rule} duplicated_targets={this.props.duplicated_targets}/>

		<input type="checkbox"
		       checked={rule.getShouldDisplayName()}
		       onChange={this.onChangeDisplayName.bind(this)}
		/>表示
		<input type="checkbox"
		       checked={rule.getNewline()}
		       onChange={this.onChangeNewline.bind(this)}
		/>改行
		<input type="checkbox"
		       checked={rule.getUsePipValueList()}
		       onChange={this.onChangeUsePipValueList.bind(this)}
		/>出目-値リスト
		<PipValueList use_pip_value_list={rule.getUsePipValueList()}
			      pip_value_list={rule.getPipValueList()}
		/>
	    </div>
	);
    }
}
