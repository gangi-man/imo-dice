//const jpeg_ops_node = require('./jpeg_marker_operations_node_helper.js');
const jpeg_ops = require('../modules/jpeg-operations.js');
const fs = require('fs');
const commander = require('commander');

function exit_message() {
    console.log("usage node set-jpeg-comment.js [--output OUT_IMG] IN_IMG COMMENT");
    console.log("usage node set-jpeg_comment.js --input TEXT_FILE [--output OUT_IMG] IN_IMG");
    process.exit(-1);
}


let comment = null;
let in_img = null;
commander.option('-i --input [type]', 'comment file').
    option('-o --output [tpe]', 'output image file', 'new.jpg').
    parse(process.argv);

if (commander.input && commander.args.length == 1) {
    in_img = commander.args[0];
    comment = fs.readFileSync(commander.input);
} else if (commander.args.length == 2) {
    in_img = commander.args[0];
    comment = commander.args[1];
} else
    exit_message();

out_img = commander.output;

let buffer = new Uint8Array( fs.readFileSync(in_img) );
let jo =jpeg_ops.jpeg_operations_constructor(buffer);
jo.set_comment(comment);

let content = jo.get_image_array();
fs.writeFileSync(out_img, Buffer(content));

