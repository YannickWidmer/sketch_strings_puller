import sketch from 'sketch'
import {main} from './puller'

export function handle_misses(context,misses){
    console.log('#############         creating missing modal      ######################')
    const doc = sketch.getSelectedDocument()
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    var message;
    if(misses[0].length >0){
        message = "These are the missing strings"
    }else{
        message = "All strings were found"
    }
    alert.setMessageText(message)
    alert.addButtonWithTitle("done"); // response is 1000
    alert.addButtonWithTitle("run again"); // response is 1001

    var dict = []; // create an empty array



    for(let i=0; i < misses[0].length; i++){

        var btn = NSButton.alloc().init();
        btn.setTitle(misses[1][i]);
        btn.setBezelStyle(NSRoundedBezelStyle)
        btn.sizeToFit();
        btn.setCOSJSTargetFunction( (sender) => {
            doc.centerOnLayer(misses[0][i].sketchObject);
        })
        alert.addAccessoryView(btn);
    }

    // Show the dialog
    switch(alert.runModal()){
        case 1000: // done
            break;
        case 1001: // run again
            main(context)
            break;
    }
}