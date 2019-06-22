const {app, ipcMain, BrowserWindow} = require("electron");
const {TestCaseSuite} = require('./test-case-suite.js');
const module_list = require('./run-all-tests-module-list.js');

const test_suite_common_list = module_list.test_suite_common_list();

let window = null;

function test_on_node() {
    for (let i=0; i<test_suite_common_list.length; i++) {
	let suite = new TestCaseSuite(test_suite_common_list[i].name(), test_suite_common_list[i].all_tests());
	suite.run_all();
	suite.report_text().then( text => console.log(text) );

	suite.report_html().then( html => window.webContents.send('message', html) );
    }
}

function createWindow() {
    if (window)
	return;

    window = new BrowserWindow({width: 1000, height: 900});
    window.on("closed", () => { window = null; });
    window.webContents.on('did-finish-load', test_on_node);

    window.loadURL("file://" + `${__dirname}` + "/run-all-tests-electron.html");
}

app.on("ready", createWindow);
