const {app, BrowserWindow, shell} = require('electron');

let win = null;

function create_window() {
    if (win != null)
	return;
    
    win = new BrowserWindow(
	{
	    width:850,
	    height:500,
	    webPreferences: {
		nodeIntegration: true
	    }
	}
    );

    win.loadURL(`file://${__dirname}/index.html`);
    win.on("closed", () => { win = null });
}

app.on("ready", create_window);

app.on("active", create_window);

app.on("window-all-closed",
       function ()
       {
	   if (process.platform !== "darwin") {
	       app.quit();
	   }
       }
      );
