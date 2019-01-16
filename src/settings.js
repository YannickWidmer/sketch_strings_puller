
import sketch from 'sketch'
const Settings = require('sketch/settings')


/* ######################################################################
 * ####################     Moodals              ########################
 * ######################################################################
 */

var set_authentification = function(context){
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alert.setMessageText("Configure Git Access")

    // Creating dialog buttons
    alert.addButtonWithTitle("save"); // response is 1000
    alert.addButtonWithTitle("cancel"); // response is 1001

    // Creating the view
    var viewWidth = 400;
    var viewHeight = 140;

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
    alert.addAccessoryView(view);

    // Create the content of the modal                  (x,y,w,h));
    var label_username = NSTextField.alloc().initWithFrame(NSMakeRect(-1, viewHeight - 65, (viewWidth / 2) - 10, 20));
    label_username.setStringValue("username");
    label_username.setSelectable(false);
    label_username.setEditable(false);
    label_username.setBezeled(false);
    label_username.setDrawsBackground(false);
    var label_psw = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 65, (viewWidth / 2) - 10, 20));
    label_psw.setStringValue("password");
    label_psw.setSelectable(false);
    label_psw.setEditable(false);
    label_psw.setBezeled(false);
    label_psw.setDrawsBackground(false);
    var username = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, 130, 20));
    //[username setNextKeyView:password];
    var password = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 85, 130, 20));

    view.addSubview(username)
    view.addSubview(label_username)
    view.addSubview(password)
    view.addSubview(label_psw)
    // Show the dialog
    const response = alert.runModal()
    if(response == 1000){
        console.log(username.stringValue())
        console.log(password.stringValue())
        Settings.setSettingForKey('git-username', username.stringValue())
        Settings.setSettingForKey('git-password', password.stringValue())
        Settings.setSettingForKey('settings-exist', true)
    }
  }

var settings_modal = function(context){
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alert.setMessageText("Configure Pull Strings git access and files")

    // Creating dialog buttons
    alert.addButtonWithTitle("done"); // response is 1000
    alert.addButtonWithTitle("username/password"); // response is 1001
    alert.addButtonWithTitle("cancel"); // response is 1002
    // Show the dialog
    const response = alert.runModal()
}

var set_files_modal = function(context){
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alert.setMessageText("Configure Pull Strings git access and files")

    // Creating dialog buttons
    alert.addButtonWithTitle("done"); // response is 1000
    alert.addButtonWithTitle("username/password"); // response is 1001
    alert.addButtonWithTitle("cancel"); // response is 1002

    // Creating the view
    var viewWidth = 400;
    var viewHeight = 300;

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
    alert.addAccessoryView(view);

    // Create the content of the modal
    var label = NSTextField.alloc().initWithFrame(NSMakeRect(x,y,w,h));
    label.setStringValue("Set username and password of Github Profile");

    // Show the dialog
    const response = alert.runModal()
  }

export function check_settings_are_right(context,file_path){
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alert.setMessageText(`something went wrong with ${file_path}`)

    // Creating dialog buttons
    alert.addButtonWithTitle("username/password"); // response is 1000
    alert.addButtonWithTitle("git-files"); // response is 1001
    alert.addButtonWithTitle("abandon"); // response is 1002

    // Creating the view
    var viewWidth = 400;
    var viewHeight = 300;

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
    alert.addAccessoryView(view);

    // Create the content of the modal
    var label = NSTextField.alloc().initWithFrame(NSMakeRect(x,y,w,h));
    label.setStringValue("Set username and password of Github Profile");

    // Show the dialog
    const response = alert.runModal()
}

/* ######################################################################
 * ####################     Logic              ########################
 * ######################################################################
 */



export function set_settings(context){
    if(!Settings.settingForKey('git-username')){
        set_authentification(context);
    }
    settings_modal(context);
    return true
}




export function check_settings_exist(context){
    if(Settings.settingForKey('settings-exist')){
        return true
    } else {
        return set_settings(context)
    }
}

// This function is a plugin function
export default function(context) {
    set_settings(context)
}


// Settings.setSettingForKey('my-key', 0.1)
// var setting = Settings.settingForKey('my-key')