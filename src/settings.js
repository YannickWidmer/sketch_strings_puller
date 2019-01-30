
import sketch from 'sketch'
const Settings = require('sketch/settings')


/* ######################################################################
 * ####################     Moodals              ########################
 * ######################################################################
 */

var settings_modal = function(context){
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alert.setMessageText("Configure Pull Strings git access and files")

    // Creating dialog buttons
    alert.addButtonWithTitle("done"); // response is 1000
    alert.addButtonWithTitle("username/password"); // response is 1001
    alert.addButtonWithTitle("remove files"); // response is 1002
    alert.addButtonWithTitle("add file"); // response is 1003
    // Show the dialog
    switch(alert.runModal()){
        case 1000: // done
            break;
        case 1001: // username password
            set_authentification(context);
            settings_modal(context);
            break;
        case 1002: // remove files
            choose_files(context);
            settings_modal(context);
            break;
        case 1003: // add file
            add_file(context);
            settings_modal(context);
            break;
    }
}

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
        Settings.setSettingForKey('git-username', username.stringValue())
        Settings.setSettingForKey('git-password', password.stringValue())
        Settings.setSettingForKey('settings-exist', true)
    }
  }



var add_file = function(context){
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alert.setMessageText("Add file")

    // Creating dialog buttons
    alert.addButtonWithTitle("save"); // response is 1000
    alert.addButtonWithTitle("cancel"); // response is 1001

    // Creating the view
    var viewWidth = 400;
    var viewHeight = 140;

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
    alert.addAccessoryView(view);

    // Create the content of the modal                  (x,y,w,h));

    var label_explanation = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 38, viewWidth - 10, 40))
    label_explanation.setStringValue("When you visit the file on github.com the path looks like this\n https://github.com/{owner}/{repo}/blob/master/{path}");
    label_explanation.setSelectable(false);
    label_explanation.setEditable(false);
    label_explanation.setBezeled(false);
    label_explanation.setDrawsBackground(false);

    var label_owner = NSTextField.alloc().initWithFrame(NSMakeRect(-1, viewHeight - 65, (viewWidth / 2) - 10, 20));
    label_owner.setStringValue("file owner");
    label_owner.setSelectable(false);
    label_owner.setEditable(false);
    label_owner.setBezeled(false);
    label_owner.setDrawsBackground(false);
    var field_owner = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, 130, 20));
    var label_repo = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 65, (viewWidth / 2) - 10, 20));
    label_repo.setStringValue("repository");
    label_repo.setSelectable(false);
    label_repo.setEditable(false);
    label_repo.setBezeled(false);
    label_repo.setDrawsBackground(false);
    var field_repo = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 85, 130, 20));
    var label_path = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 105, (viewWidth / 2) - 10, 20));
    label_path.setStringValue("path");
    label_path.setSelectable(false);
    label_path.setEditable(false);
    label_path.setBezeled(false);
    label_path.setDrawsBackground(false);
    var field_path = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 125, viewWidth, 20));

    // make tab switch fields (not working)
    field_owner.setNextKeyView_(field_repo)
    field_repo.setNextKeyView(field_path)

    view.addSubview(label_explanation)
    view.addSubview(field_owner)
    view.addSubview(label_owner)
    view.addSubview(field_repo)
    view.addSubview(label_repo)
    view.addSubview(field_path)
    view.addSubview(label_path)
    // Show the dialog
    const response = alert.runModal()
    if(response == 1000){ // save
        console.log("###### Adding File ######")
        console.log(`${field_owner.stringValue()}:${field_repo.stringValue()}:${field_path.stringValue()}`)
        var files = Settings.settingForKey('files') || []
        files.push([field_owner.stringValue(),field_repo.stringValue(), field_path.stringValue()])
        Settings.setSettingForKey('files', files)
    }
  }

  var choose_files = function(context){
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alert.setMessageText("Chose files to keep")

    // Creating dialog buttons
    alert.addButtonWithTitle("save"); // response is 1000
    alert.addButtonWithTitle("cancel"); // response is 1001

    // Creating the view
    var files = Settings.settingForKey('files') || []

    var viewWidth = 300;
    var viewHeight = 140 + 30 * files.length;

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
    alert.addAccessoryView(view);

    // Create the content of the modal                  (x,y,w,h));
    // Creating the input
    var arrayLength = files.length;
    var check_boxes = []
    var file, checkbox;
    for (var i = 0; i < arrayLength; i++) {
        file = files[i];
        checkbox = NSButton.alloc().initWithFrame(NSMakeRect(0, viewHeight - 38 - i * 20, viewWidth, 20));

        // Setting the options for the checkbox
        checkbox.setButtonType(NSSwitchButton);
        checkbox.setBezelStyle(0);
        checkbox.setTitle(`owner:${file[0]}, repo:${file[1]}, path:${file[2]}`);
        checkbox.setState(NSOnState); //Change this to NSOnState if you want the checkbox to be selected by default
        check_boxes.push(checkbox);
        view.addSubview(checkbox);
    }

    // Show the dialog
    const response = alert.runModal()
    if(response == 1000){
        var res = []
        console.log("###### keeping Files ######")
        for (var i = 0; i < arrayLength; i++) {

            if(check_boxes[i].stringValue() == 1){ // ==1 when checkbox is checked
                 res.push(files[i]);
            }
        }
        console.log(res)
        Settings.setSettingForKey('files', res)
    }
  }

export function check_settings_are_right(context,message){
    var alert = COSAlertWindow.new();
    alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
    alert.setMessageText(message)

    // Creating dialog buttons
    alert.addButtonWithTitle("ok"); // response is 1000
    alert.addButtonWithTitle("settings"); // response is 1001

    // Creating the view
    var viewWidth = 400;
    var viewHeight = 300;

    // Show the dialog
    if(alert.runModal() == 1001){
        set_settings(context);
    }
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