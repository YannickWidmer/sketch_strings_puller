const UI = require('sketch/ui')
import BrowserWindow from 'sketch-module-web-view';

export function handle_misses(document,misses){
    console.log('#############         creating missing modal      ######################')
    const options = {
        identifier: 'unique.id',
        width: 240,
        height: 180,
        show: false
      }
    var browserWindow = new BrowserWindow(options)

    // only show the window when the page has loaded
    browserWindow.once('ready-to-show', () => {
        browserWindow.show()
    })

    const webContents = browserWindow.webContents

    // print a message when the page loads
    webContents.on('did-finish-load', () => {
        var name, layer;
        for(var i in misses[0]){
            name = misses[1][i];
            webContents
            .executeJavaScript(`addElement('${name}', ${i});`)
            .catch(console.error);
        }

    })

    // add a handler for a call from web content's javascript
    webContents.on('selected', (index) => {
        console.log('Centering on layer '+ index);
        var lay = misses[0][index]
        document.centerOnLayer(lay.sketchObject);
        console.log('Centered');

        console.log('deselected');
        lay.select = true;
        console.log('selected');
    })

    // add a handler for a call from web content's javascript
    webContents.on('nativeLog', (s) => {
        console.log(s)
    })

    browserWindow.loadURL(require("../resources/webview.html"))
}