import React from "react";

export class PipValueItem extends React.Component {
    render () {
	let line = null;

	if (this.props.editing)
	    line = (
		<React.Fragment>
		    <td className="pv_td_number">
			<input type="text" className="pv_td_input_number"
			       value={this.props.pip}
			       onChange={this.props.onPipChange}
			       onKeyUp={this.props.onKeyUp}
			/>
		    </td>
		    <td className="pv_td_value">
			<input type="text" className="pv_td_input_value"
			       value={this.props.name}
			       onChange={this.props.onValueChange}
			       onKeyUp={this.props.onKeyUp}
			/>
		    </td>
		</React.Fragment>
	    );
	else
	    line = (
		<React.Fragment>
		    <td className="pv_td_number">
			<span className={this.props.pip_style}>{this.props.pip} </span>
		    </td>
		    <td className="pv_td_value">
			<span className={this.props.name_style}> {this.props.name} </span>
		    </td>
		</React.Fragment>
	    );
	
	
	return (
	    <tr>
		{line}
		<td>
		    <button onClick={this.props.onClickEdit}> E </button>
		    <button onClick={this.props.onClickAdd}> + </button>
		    <button onClick={this.props.onClickRemove}> - </button>
		</td>
	    </tr>
	);
    }
}

export default class PipValueList extends React.Component {
    constructor(props) {
	super(props);
    }

    canEdit() {
	return this.props.use_pip_value_list;
    }

    sort() {
	if (!this.canEdit())
	    return;
	
	this.props.pip_value_list.sort();
    }

    appendListItem(index) {
	if (!this.canEdit())
	    return;
	
	index = (index >=0) ? index : this.props.pip_value_list.length() - 1;
	let pv = { pip:0, value:"nodata" };
	if (this.props.pip_value_list.length() > 0)
	    pv = this.props.pip_value_list.get(index);
	
	this.props.pip_value_list.append(index+1, pv.pip+1, "nodata");
    }
    
    onItemPipChange(index, ev) {
	if (!this.canEdit())
	    return;
	
	let old_pv = this.props.pip_value_list.get(index);
	this.props.pip_value_list.set(index, ev.target.value, old_pv.value);
    }

    onItemValueChange(index, ev) {
	if (!this.canEdit())
	    return;
	
	let old_pv = this.props.pip_value_list.get(index);
	this.props.pip_value_list.set(index, old_pv.pip, ev.target.value);
    }

    onKeyUp(i, ev){
	console.log("onkeyup");
	if (ev.keyCode == 13)  { //enter
	    this.props.pip_value_list.setEditing(-1);
	}
    }

    onClickItemEdit(i) {
	if (!this.canEdit())
	    return;

	let newEditing = (i==this.props.pip_value_list.getEditing()) ? -1 : i;
	this.props.pip_value_list.setEditing(newEditing);
    }

    onClickItemRemove(index) {
	if (!this.canEdit())
	    return;
	
	if ((index >= 0) && (index < this.props.pip_value_list.length()))
	    this.props.pip_value_list.remove(index);
    }

    renderItem(i) {
	let pv_list = this.props.pip_value_list
	let pv = pv_list.get(i);
	let duplicated_pip = pv_list.getDuplicatedPip();
	let duplicated_value = pv_list.getDuplicatedValue();

	let pip_style = duplicated_pip.find( x => x===pv.pip) ? "pv_style_red" : "pv_style_normal";
	if (pv.pip === 0)
	    pip_style = "pv_style_red";
	let name_style = duplicated_value.find( x => x===pv.value) ? "pv_style_yellow" : "pv_style_normal";
	
	return (
	    <PipValueItem
		key={i}
		editing={pv_list.getEditing()===i}
		pip={pv.pip}
	    	name={pv.value}
		pip_style={pip_style}
		name_style={name_style}
		onKeyUp={ this.onKeyUp.bind(this, i) }
		onClickEdit={()=>this.onClickItemEdit(i)}
		onClickAdd={ ()=>this.appendListItem(i) }
		onClickRemove={ ()=>this.onClickItemRemove(i) }
		onPipChange={ this.onItemPipChange.bind(this, i) }
		onValueChange={ this.onItemValueChange.bind(this, i) }
	    />
	);
    }

    render () {
	let style = this.props.use_pip_value_list ? "pv_style_enable" : "pv_style_disable";
	let pip_value_list = this.props.pip_value_list;
	let listCont = [];

	for (let i=0; i<pip_value_list.length(); i++) {
	    listCont.push(this.renderItem(i));
	}
	
	return (
	    <div className={style}>
	    <table>
		<tbody>
		<tr>
		    <th> 出目 </th>
		    <th> 値 </th>
		    <th>
			<button onClick={ ()=> this.appendListItem(-1) }> + </button>
			<button onClick={ ()=> this.sort() }> S </button>
		    </th>
		</tr>
		{listCont}
		</tbody>
	    </table>
	    </div>
	);
    }
}
