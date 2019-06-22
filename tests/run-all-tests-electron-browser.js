const {TestCaseSuite} = require('./test-case-suite.js');
const tch = require('./test-case-helper.js');
const module_list = require('./run-all-tests-module-list.js');

const test_suite_common_list = module_list.test_suite_common_list();
const test_suite_browser_list = module_list.test_suite_browser_list();

const{ ipcRenderer } = require('electron');
ipcRenderer.on('message',
	       function(event, result_html) {
		   document.getElementById("results_on_node").innerHTML += result_html;
	       });


function load_and_test_on_browser(frame_width=800, frame_height=600) {
    if (!tch.test_on_browser())
	return;

    for (let i=0; i<test_suite_browser_list.length; i++) {
	let ifrm = document.createElement('iframe')
	ifrm.width = frame_width;
	ifrm.height = frame_height;
	document.body.appendChild(ifrm);

	let test_module = test_suite_browser_list[i];
	ifrm.onload = function () {
	    let suite = new TestCaseSuite(test_module.name(), test_module.all_tests(ifrm.contentWindow));

	    suite.run_all();
	    suite.report_html().then(
		(html) => {
		    let output_div = document.getElementById("results_on_browser_iframe");
		    output_div.innerHTML += html;
		}
	    );
	}

	ifrm.src = test_module.url();
    };
}

function test_on_browser() {
    for (let i=0; i<test_suite_common_list.length; i++) {
	let suite = new TestCaseSuite(test_suite_common_list[i].name(), test_suite_common_list[i].all_tests());
	suite.run_all();
	suite.report_text().then( text => console.log(text) );

	suite.report_html().then( result_html => {
	    document.getElementById("results_on_browser").innerHTML += result_html;
	});
    }
}

function run_tests_on_browser() {
    test_on_browser();
    load_and_test_on_browser();
}
