require('date-utils');
const commander = require('commander');
const fs = require('fs');

const DefaultDiceCastNumber = 50;
const DefaultDiceNumber = 5;
const DefaultDiceMax = 100;


function htmlHeader() {
    //original meta header
    // <meta http-equiv="Content-type" content="text/html; charset=Shift_JIS">
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
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

    let image_name = image_path.match(/[^\/\\]*$/)[0];
    image_name = image_name.replace(/\.jpg$/, "1234567890.jpg");
    let image_url = image_path;

    let image_small_url = image_url;
    let image_size = stat.size;

    let start_date = dateString(tm);
    let end_date = endDateString(tm + 60*60*12*1000);

    return `
    <div class="thre" data-res="${thread_name}">画像ファイル名：
      <a href="${image_url}" target="_blank">${image_name}</a>-(${image_size} B)<small>サムネ表示</small><br>
      <a href="${image_url}" target="_blank">
        <img src="${image_small_url}" alt="${image_size} B" width="250" hspace="20" height="250" border="0" align="left">
      </a>
      <input type="checkbox" name="${thread_name}" value="delete" id="delcheck${thread_name}">${start_date} No.${thread_name}
      <a class="del" href="javascript:void(0);" onclick="del(${thread_name});return(false);">del</a>
      <a href="javascript:void(0);" onclick="sd(${thread_name});return(false);" class="sod" id="sd${thread_name}">+</a>
      <span class="cntd">${end_date}頃消えます</span>
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
        <tbody><tr><td class="rts">…</td><td class="rtd">
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
    return new Date(tm).toFormat("DD日HH24:MI");
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

// generate test document //////////////////////////////////////////////////////////
let options = commander.
    usage('node generate-test-html --cast [dice cast number] --num [dice number] --max [dice max] image-path').
    option('--cast [dice cast number]', 'number of casting dice', DefaultDiceCastNumber).
    option('--num [dice_number]', 'number of dice', DefaultDiceNumber).
    option('--max [dice_max]', 'max value of dice', DefaultDiceMax).
    parse(process.argv);

if (options.args.length <= 0) {
    console.log(options.usage());
    return;
}

let image_path = options.args[0];

let now = new Date().getTime();
let doc = "";
let res_no = 1000;

doc += htmlHeader();
doc += threadHeader(image_path, now-60*60*1000, res_no++, diceLine(options.num, options.max));

for (let i=0; i< options.cast; i++){
    doc += response(`response:${i+1}<br>` + diceLine(options.num, options.max), res_no++, now + i*59*1000);
    doc += response(`random:${i+1}<br>` + randomDiceLine(options.num, options.max), res_no++, now + i*59*1000);
}
doc += threadFooter();
doc += htmlFooter();

console.log(doc);
