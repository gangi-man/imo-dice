tcs = require("./test-case-suite.js");
tc = require("./test-case.js");
trm = require('./test-runner-module.js');

teq = require('./test-equal.js');

let t1 = new tcs.TestCaseSuite("testsuite.dayo");
let tc0 = new tc.TestCase("test0").expected(trm.assert_equal, 10).setup(x=>x, [10]);
let tc1 = new tc.TestCase("test1").expected(trm.assert_equal, 9).setup(x=>x, [10]);

t1.append(tc0);
t1.append(tc1);

t1.run_all();

t1.report_text().then( t => console.log(t) );


let te = new tcs.TestCaseSuite(teq.name(), teq.all_tests());
te.run_all();
te.report_text().then( t=>console.log(t) );
