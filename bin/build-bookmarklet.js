const fs = require('fs');
const ugfy = require('uglify-es');

const URLLocal = 'http://localhost:9998/modules/imodice-bookmarklet-body.js';
const URLGitHub = 'https://gangi-man.github.io/imo-dice/imodice-latest.js';

const ModuleFiles = ['modules/jpeg-operations.js',
		     'modules/rpg-dice-html-extract.js',
		     'modules/rpg-dice-rule.js',
		     'modules/rpg-dice-display.js'
		    ];

const ModuleOut = "modules/imodice-bookmarklet-body.js";
const ModuleOutMin = "modules/imodice-bookmarklet-body-min.js";

const ModuleLinkFile = "modules/imodice-bookmarklet-org.js";
const ModuleLinkOutLocal = "modules/imodice-bookmarklet-local.js";
const ModuleLinkOutGitHub = "modules/imodice-bookmarklet-github.js";

function generate_link(url, out_file) {
    let ln = fs.readFileSync(ModuleLinkFile, 'utf8');
    ln = ln.replace(/let\s+/g, "let%20");
    ln = ln.replace(/var\s+/g, "var%20");
    ln = ln.replace(/\r?\n/g, "");
    ln = ln.replace(/\s/g, "");
    ln = `javascript:(${ln})()`;

    ln = ln.replace(/\$\$\$URL\$\$\$/g, url);

    fs.writeFileSync(out_file, ln);
}


let content = "";

for (let i=0; i<ModuleFiles.length; i++) {
    content += fs.readFileSync(ModuleFiles[i], {encode: "utf-8"}) + "\n";
}

let book_marklet = `\
function __imo_dice__() {                          \n\
  if (typeof __imo_dice_exports__ !== "undefined") \n\
    return __imo_dice_exports__;                   \n\
  let exports = {};                                \n\
                                                   \n\
  ${content}                                       \n\
                                                   \n\
  __imo_dice_exports__ = exports;                  \n\
  return exports;                                  \n\
}\n`;


fs.writeFileSync(ModuleOut, book_marklet);

let minified = ugfy.minify(book_marklet);
fs.writeFileSync(ModuleOutMin, minified.code); // FIXME! borken!

generate_link(URLLocal, ModuleLinkOutLocal);
generate_link(URLGitHub, ModuleLinkOutGitHub);
