//const jpeg_ops = require('./jpeg_marker_operations.js');
//const jpeg_ops_node = require('./jpeg_marker_operations_node_helper.js');
const jpeg_ops = require('../modules/jpeg-operations.js');
const fs = require('fs');


function exit_message() {
    console.log("usage: node get-jpeg-comment.js IMG1 IMG2 ...");
    process.exit(-1);
}

function dump_comment(path) {
    let buffer = new Uint8Array( fs.readFileSync(path) );
    let jo =jpeg_ops.jpeg_operations_constructor(buffer);
    
    console.log("path:" + jo.get_comment());
}

if (process.argv.length <= 2)
    exit_message();

for (let i=2; i<process.argv.length; i++){
    try { 
	dump_comment(process.argv[i]);
    } catch (e) {
	console.log("!!Error occurred!! path:" + process.argv[i] + " error:" + e + "\n");
    }
}
