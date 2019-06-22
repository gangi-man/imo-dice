const TestGenerator = require('../../modules/generate-test-content.js');
const Electron = window.require('electron');
var NodeStatic = window.require('node-static');

var ServerDirectory = null;

function searchDiceMax(image_dice) {
    let rules = image_dice.getAllRules();

    let all_targets = [0];
    for (let i=0; i<rules.length; i++) {
	let targets = rules[i].getTargets();
	all_targets = all_targets.concat(targets);
    }

    return all_targets.reduce( (a, b) => (a > b) ? a : b );
}

function searchPipMax(image_dice) {
    let rules = image_dice.getAllRules();

    let all_pips = [0];
    for (let i=0; i<rules.length; i++) {
	let pv_list = rules[i].getPipValueList();
	for (let j=0; j<pv_list.length(); j++) {
	    let pv = pv_list.get(j);
	    all_pips.push( pv.pip );
	}
    }

    return all_pips.reduce( (a, b) => (a > b) ? a : b );
}

function generateAndOpen(image_dice) {
    function genFileName() {
	let d = new Date();
	let ds = Math.floor(d/1000);

	return { html : (ds + ".html"), jpeg : (ds + ".jpg") };
    }

    const fs = Electron.remote.require('fs');
    const TestPort = 10801;
    const DirectoryName = "imo-dice";

    const DefaultCastNumber = 100;
    const DefaultDiceNumber = 3;
    const DefaultDiceMax = 100;

    let cast_number = DefaultCastNumber;
    let dice_number = searchDiceMax(image_dice);
    let dice_max = searchPipMax(image_dice);

    dice_number = dice_number ? dice_number : DefaultDiceNumber;
    dice_max = dice_max ? dice_max : DefaultDiceMax;
    
    let tmpDirectory = Electron.remote.app.getPath('temp') +"\\" + DirectoryName;
    let fileName = genFileName();

    if (!fs.existsSync(tmpDirectory)) {
	fs.mkdirSync(tmpDirectory);
    }

    let tempJpegFile = tmpDirectory + "\\" + fileName.jpeg;
    if (!image_dice.save(tempJpegFile))
	throw new Error("file generate failed:" + fileName.jpeg);

    let tempHtmlFile = tmpDirectory + "\\" + fileName.html;
    let html = TestGenerator.generate(cast_number, dice_number, dice_max, tempJpegFile);
    fs.writeFileSync(tempHtmlFile, html);

    if (ServerDirectory === null) {
	ServerDirectory = new NodeStatic.Server(tmpDirectory, {cache : 1});

	window.require('http').createServer(
	    function (request, response) {
		request.addListener('end',
				    function () {
					ServerDirectory.serve(request, response);
				    }
				   ).resume();
	    }).listen(TestPort);
    }

    Electron.remote.shell.openExternal(`http://localhost:${TestPort}/${fileName.html}`);
}

exports.generateAndOpen = generateAndOpen;
