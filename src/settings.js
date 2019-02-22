
const Settings = require('sketch/settings')
import { AES_Encrypt_String } from "./jsaes"

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
    alert.addButtonWithTitle("Github API token"); // response is 1001
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
    alert.setInformativeText("Create an API token by visiting https://github.com/settings/tokens and assign the scope repo to it.")
    // Creating dialog buttons
    alert.addButtonWithTitle("save"); // response is 1000
    alert.addButtonWithTitle("cancel"); // response is 1001

    // Creating the view
    var viewWidth = 400;
    var viewHeight = 140;

    var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
    alert.addAccessoryView(view);

    // Create the content of the modal                  (x,y,w,h));
    var label_token = NSTextField.alloc().initWithFrame(NSMakeRect(-1, viewHeight - 65, (viewWidth / 2) - 10, 20));
    label_token.setStringValue("token");
    label_token.setSelectable(false);
    label_token.setEditable(false);
    label_token.setBezeled(false);
    label_token.setDrawsBackground(false);

    var token = NSSecureTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, 330, 20));

    view.addSubview(token)
    view.addSubview(label_token)
    // Show the dialog
    const response = alert.runModal()
    if(response == 1000){
        Settings.setSettingForKey('git-token', AES_Encrypt_String(token.stringValue()+''))
        Settings.setSettingForKey('settings-exist', true)
    }
  }



  var add_file = function(context){
    var window = NSWindow.alloc().init();
    window.setTitle("Add file")

    var viewWidth = 400;
    var viewHeight = 240;
    var contentView = window.contentView()
    window.setFrame_display(NSMakeRect(0, viewHeight - 85, viewWidth, viewHeight),false)
    var icon = NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path())
    var iconView = NSImageView.alloc().initWithFrame(NSMakeRect(10, viewHeight - 100, 60, 60))
    iconView.setImage(icon);
    contentView.addSubview(iconView);

    // Create the content of the modal                  (x,y,w,h));
    var label_owner = NSTextField.alloc().initWithFrame(NSMakeRect(90, viewHeight - 65, (viewWidth / 2) - 10, 20));
    label_owner.setStringValue("file owner");
    label_owner.setSelectable(false);
    label_owner.setEditable(false);
    label_owner.setBezeled(false);
    label_owner.setDrawsBackground(false);
    var field_owner = NSTextField.alloc().initWithFrame(NSMakeRect(90, viewHeight - 85, 130, 20));
    var label_repo = NSTextField.alloc().initWithFrame(NSMakeRect(230, viewHeight - 65, (viewWidth / 2) - 10, 20));
    label_repo.setStringValue("repository");
    label_repo.setSelectable(false);
    label_repo.setEditable(false);
    label_repo.setBezeled(false);
    label_repo.setDrawsBackground(false);
    var field_repo = NSTextField.alloc().initWithFrame(NSMakeRect(230, viewHeight - 85, 130, 20));
    var label_path = NSTextField.alloc().initWithFrame(NSMakeRect(90, viewHeight - 105, (viewWidth / 2) - 10, 20));
    label_path.setStringValue("path");
    label_path.setSelectable(false);
    label_path.setEditable(false);
    label_path.setBezeled(false);
    label_path.setDrawsBackground(false);
    var field_path = NSTextField.alloc().initWithFrame(NSMakeRect(90, viewHeight - 130, viewWidth -130, 20));
    var label_explanation = NSTextField.alloc().initWithFrame(NSMakeRect(20, viewHeight - 180,viewWidth - 40, 40))
    label_explanation.setStringValue("When you visit the file on github.com the URL looks like this https://github.com/{owner}/{repo}/blob/master/{path}");
    label_explanation.setSelectable(false);
    label_explanation.setEditable(false);
    label_explanation.setBezeled(false);
    label_explanation.setDrawsBackground(false);
    contentView.addSubview(label_explanation)

    // make tab switch fields (not working)
    field_owner.setNextKeyView_(field_repo)
    field_repo.setNextKeyView(field_path)

    contentView.addSubview(label_explanation)
    contentView.addSubview(field_owner)
    contentView.addSubview(label_owner)
    contentView.addSubview(field_repo)
    contentView.addSubview(label_repo)
    contentView.addSubview(field_path)
    contentView.addSubview(label_path)

    // Creating dialog buttons
    var response = 0 // 0 None, 1000 save , 1001 cancel
    var saveButton = NSButton.alloc().initWithFrame(NSMakeRect(viewWidth -110,viewHeight - 220,80,25))
    saveButton.setTitle("save");
    saveButton.setBezelStyle(NSRoundedBezelStyle)
    //saveButton.sizeToFit();
    //window.setDefaultButtonCell(saveButton);
    saveButton.setKeyEquivalent("\r"); // return key
    saveButton.setCOSJSTargetFunction( (sender) => {
        response = 1000;
        window.orderOut(null);
        NSApp.stopModal();
    })
    contentView.addSubview(saveButton);
    var cancelButton = NSButton.alloc().initWithFrame(NSMakeRect(viewWidth -220,viewHeight - 220,80,25))
    cancelButton.setTitle("cancel");
    cancelButton.setBezelStyle(NSRoundedBezelStyle)
    //cancelButton.sizeToFit();
    cancelButton.setKeyEquivalent("\b"); // escape key
    cancelButton.setCOSJSTargetFunction( (sender) => {
        response = 1001;
        window.orderOut(null);
        NSApp.stopModal();
    })
    contentView.addSubview(cancelButton);
    // Show the dialog
    NSApp.runModalForWindow(window);

    if(response == 1000){ // save
        console.log("###### Adding File ######")
        console.log(`${field_owner.stringValue()}:${field_repo.stringValue()}:${field_path.stringValue()}`)
        var files = Settings.settingForKey('files') || []
        files.push([field_owner.stringValue(),field_repo.stringValue(), field_path.stringValue()])
        Settings.setSettingForKey('files', files)
    }

    window = null
    saveButton = null
    cancelButton = null
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
    var viewHeight =30 +  30 * files.length;

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
