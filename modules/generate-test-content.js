require('date-utils');
const fs = require('fs');

const DefaultDiceCastNumber = 50;
const DefaultDiceNumber = 5;
const DefaultDiceMax = 100;


function htmlHeader() {
    return `
<html>
  <head>
  </head>
  <body vlink="#0000EE" text="#800000" link="#0000EE" bgcolor="#FFFFEE" alink="#FF0000">
`;
}

function htmlFooter() {
    return `
  </body>
</html>
`;
}

function threadHeader(image_path, tm, thread_name, response_text) {
    let stat = fs.statSync(image_path);

    //let image_name = image_path.match(/[^\/\\]*$/)[0];
    //image_name = image_name.replace(/\.jpg$/, "1234567890.jpg");
    let image_url = image_path;
    image_url = image_path.match(/[^\/\\]*$/)[0];
    let image_name  = image_path.split(/[\/\\]/).pop();

    let image_small_url = image_url;
    let image_size = stat.size;

    let start_date = dateString(tm);
    let end_date = endDateString(tm + 60*60*12*1000);

    return `
    <div class="thre" data-res="${thread_name}">filename:
      <a href="${image_url}" target="_blank">${image_name}</a>-(${image_size} B)<small>thumbnail</small><br>
      <a href="${image_url}" target="_blank">
        <img src="${image_small_url}" alt="${image_size} B" width="250" hspace="20" height="250" border="0" align="left">
      </a>
      <input type="checkbox" name="${thread_name}" value="delete" id="delcheck${thread_name}">${start_date} No.${thread_name}
      <a class="del" href="javascript:void(0);" onclick="del(${thread_name});return(false);">del</a>
      <a href="javascript:void(0);" onclick="sd(${thread_name});return(false);" class="sod" id="sd${thread_name}">+</a>
      <span class="cntd">delete:${end_date}</span>
      <blockquote>${response_text}</blockquote>
      <span class="maxres"></span>
`;
}

function threadFooter() {
    return `
      <div style="clear:left"></div>
    </div>
`;
}

function response(response_text, res_no, tm) {
    let res_date = dateString(tm);

    return `
      <table border="0">
        <tbody><tr><td class="rts">...</td><td class="rtd">
	      <input type="checkbox" name="${res_no}" value="delete" id="delcheck${res_no}">${res_date} No.${res_no}
	      <a class="del" href="javascript:void(0);" onclick="del(${res_no});return(false);">del</a>
	      <a href="javascript:void(0);" onclick="sd(${res_no});return(false);" class="sod" id="sd${res_no}">+</a>
	      <blockquote>${response_text}</blockquote></td></tr>
        </tbody>
      </table>
`;
}

function dateString(tm) {
    return new Date(tm).toFormat("YY/MM/DD(DDD) HH24:MI:SS");
}

function endDateString(tm) {
    return new Date(tm).toFormat("DD HH24:MI");
}

function diceLine(dice_number, max_number, addition=0) {
    if (dice_number > 10 || max_number > 10000)
	throw new Error("dice setting error");

    let pip = [];
    for (let i=0; i<dice_number; i++)
	pip.push( 1 + Math.floor(Math.random() * max_number));

    let pip_string =  pip.map(p => `${p} `).join('');
    let sum = addition + pip.reduce((a,b) => a+b);

    return `dice${dice_number}d${max_number}=<font color="#ff0000">${pip_string}(${sum})</font>`;
}

function randomDiceLine(dice_number, max_number, addition=0) {
    dice_number = Math.floor(1+10*Math.random());
    max_number = Math.floor(1+9999*Math.random());

    if (dice_number > 10 || max_number > 10000)
	throw new Error("dice setting error");

    let pip = [];
    for (let i=0; i<dice_number; i++)
	pip.push( 1 + Math.floor(Math.random() * max_number));

    let pip_string =  pip.map(p => `${p} `).join('');
    let sum = addition + pip.reduce((a,b) => a+b);

    return `dice${dice_number}d${max_number}=<font color="#ff0000">${pip_string}(${sum})</font>`;
}

function generate(cast_number, dice_number, dice_max, image_path, random=false) {
    let now = new Date().getTime();
    let doc = "";
    let res_no = 1000;

    doc += htmlHeader();
    doc += threadHeader(image_path, now-60*60*1000, res_no++, diceLine(dice_number, dice_max));

    for (let i=0; i< cast_number; i++){
	doc += response(`response:${i+1}<br>` + diceLine(dice_number, dice_max), res_no++, now + i*59*1000);
	if (random)
	    doc += response(`random:${i+1}<br>` + randomDiceLine(dice_number, dice_max), res_no++, now + i*59*1000);
    }
    doc += threadFooter();
    doc += htmlFooter();
    
    return doc;
}

exports.generate = generate;
