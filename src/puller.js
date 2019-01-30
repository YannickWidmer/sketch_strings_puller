import sketch from 'sketch'
const Settings = require('sketch/settings')
import { check_settings_exist, check_settings_are_right } from './settings'
import { get_file } from './github_requests'
import { handle_misses } from './miss_modal'
// documentation: https://developer.sketchapp.com/reference/api/

/* ######################################################################
 * ####################     Moodals              ########################
 * ######################################################################
 */


var choose_mode = function(context,languages){
  var alert = COSAlertWindow.new();
  alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
  alert.setMessageText("Process")

  // Creating dialog buttons
  alert.addButtonWithTitle("selection"); // response is 1000
  alert.addButtonWithTitle("the whole document"); // response is 1001
  alert.addButtonWithTitle("cancel"); // response is 1002

  // Creating the view
  var viewWidth = 300;
  var viewHeight = 140;

  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));

  // Creating radio buttons
  var buttonFormat = NSButtonCell.alloc().init();
  buttonFormat.setButtonType(NSRadioButton);

  // The matrix will contain all the cells (radio buttons)
  var matrixFormat = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(
            NSMakeRect(0, 20, 400, 50), // Horizontal position, vertical position, width, height
            NSRadioModeMatrix, // This makes the radio buttons work together
            buttonFormat,
            1, // 1 row
            languages.length // languages.length columns
        );

  // Settings the size of the radio buttons
  matrixFormat.setCellSize(CGSizeMake(100, 25));

  // Adding the radio buttons to the form
  var cells = matrixFormat.cells();
  for(var index in languages){
    cells.objectAtIndex(index).setTitle(languages[index]);
  }

  // Adding the matrix to the form
  view.addSubview(matrixFormat);

  // Add the view
  alert.addAccessoryView(view);
  // Show the dialog
  const modal_res = alert.runModal()
  var language = languages[matrixFormat.cells().indexOfObject(matrixFormat.selectedCell())];
  console.log(`Modal res: button clicked = ${modal_res}, langauge = ${language}`)

  return [modal_res,language]
}


/* ######################################################################
 * ####################     Helper functions     ########################
 * ######################################################################
 */

var traverse = function(layers, lexicon){
  var layer, name;
  var missing = [], missing_names = []
  for(var index in layers){
    layer = layers[index]
    console.log(`    Processing: ${layer.name}`)
    console.log(` Which is a text: ${layer.sketchObject.class() == MSTextLayer}, group: ${layer instanceof sketch.Group}, symbolinstance: ${layer instanceof sketch.SymbolInstance}`)
    if (layer instanceof sketch.Text && layer.name.startsWith('$')) {
      name = layer.name.substr(1);
      console.log(`## checking string existance for ${name} `)
      console.log(lexicon)
      if(lexicon.hasOwnProperty(name)){
        console.log(`value: ${lexicon[name]} `)
        layer.sketchObject.setStringValue(convertHtmlToRtf(lexicon[name]));
      } else {
        console.log(`#### ${name}'s value is missing`)
        missing.push(layer)
        missing_names.push(name)
      }
    } else if (layer instanceof sketch.SymbolInstance && layer.name.startsWith('$')){
      var override
      for(var index in layer.overrides){
        override = layer.overrides[index]
        console.log(`Override (property: ${override.property}, value: ${override.value} propertyName: ${override.affectedLayer.name})`)
        if(override.property == 'stringValue' && override.affectedLayer.name.startsWith('$')){
          name = layer.name.substr(1) +'_' + override.affectedLayer.name.substr(1)
          console.log(`## checking string existance for ${name} `)
          if(lexicon.hasOwnProperty(name)){
            console.log(`it's value is ${lexicon[name]} `)
            symbolInstance.setOverrideValue(override,convertHtmlToRtf(lexicon[name]))
          }else {
            console.log(`#### ${name}'s value is missing`)
            missing.push(layer)
            missing_names.push(name)
          }
        }
      }
    } else if (layer instanceof sketch.Group){
      var intermediate_res = traverse(layer.layers,lexicon)
      missing = missing.concat(intermediate_res[0])
      missing_names = missing_names.concat(intermediate_res[1])
    }
  }
  return [missing, missing_names]
}


/* ######################################################################
 * #################### The command              ########################
 * ######################################################################
 */


export default function(context) {
  console.log('################################################################################')
  console.log('#############            Start                           #######################')
  console.log('################################################################################')

  const doc = sketch.getSelectedDocument()
  check_settings_exist(context) // if settings are set does nothing, else prompts for settings

  var files = Settings.settingForKey('files') || []
  if(files.length == 0){
    check_settings_are_right(context,"There are no files specified")
    files = Settings.settingForKey('files') || []
  }
  console.log('#############         retrieving files      ######################')
  console.log(files)
  Promise.all(files.map((value, index, array) => {
    console.log(value)
    return new Promise((resolve,reject)=>{
      get_file(value[0],value[1],value[2],(dictionary) => {
        console.log(`#### ${value} content ####`)
        console.log(dictionary)
        resolve(dictionary)
      },(file_path) =>{
        // An error occurred
        reject(file_path);
      })
    })
  }))
  .then((values)=> {
    var library = {}
    values.forEach((value,index,array) =>{
      library = {...library, ...value}
    })
    console.log('#############           Languages            #######################')
    console.log(Object.keys(library))
    const modal_res = choose_mode(context, Object.keys(library))

    // Prepare the layers depending on the options
    var layers = []
    switch(modal_res[0]){
      case 1000: // selection
        layers = doc.selectedLayers.layers;
        break;
      case 1001: // the whole document
        var page
        for(var index in doc.pages){
          page = doc.pages[index]
          layers = layers.concat(page.layers)
        }
        break;
    }

    console.log(`${layers.length} top layers`)
    if(layers.length > 0){
      console.log('Now processing the layer')
      const misses = traverse(layers, library[modal_res[1]]);
      handle_misses(doc, misses)
    } else{
      console.log("No layers to process")
    }
  })
  .catch(file_path => check_settings_are_right(context,file_path))
}


// #################### Rich text converter helper function

function convertHtmlToRtf(html) {
  if (!(typeof html === "string" && html)) {
      return html; // it is simoply regular text
  }
  return html
/*
  var tmpRichText, hasHyperlinks;
  var richText = html;

  // Singleton tags
  richText = richText.replace(/<(?:hr)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard \\brdrb \\brdrs \\brdrw10 \\brsp20 \\par}\n{\\pard\\par}\n");
  richText = richText.replace(/<(?:br)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard\\par}\n");

  // Empty tags
  richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?\s*[\/]>/ig, "{\\pard\\par}\n");
  richText = richText.replace(/<(?:[^>]+)\/>/g, "");

  // Hyperlinks
  richText = richText.replace(
      /<a(?:\s+[^>]*)?(?:\s+href=(["'])(?:javascript:void\(0?\);?|#|return false;?|void\(0?\);?|)\1)(?:\s+[^>]*)?>/ig,
      "{{{\n");
  tmpRichText = richText;
  richText = richText.replace(
      /<a(?:\s+[^>]*)?(?:\s+href=(["'])(.+)\1)(?:\s+[^>]*)?>/ig,
      "{\\field{\\*\\fldinst{HYPERLINK\n \"$2\"\n}}{\\fldrslt{\\ul\\cf1\n");
  hasHyperlinks = richText !== tmpRichText;
  richText = richText.replace(/<a(?:\s+[^>]*)?>/ig, "{{{\n");
  richText = richText.replace(/<\/a(?:\s+[^>]*)?>/ig, "\n}}}");

  // Start tags
  richText = richText.replace(/<(?:b|strong)(?:\s+[^>]*)?>/ig, "{\\b\n");
  richText = richText.replace(/<(?:i|em)(?:\s+[^>]*)?>/ig, "{\\i\n");
  richText = richText.replace(/<(?:u|ins)(?:\s+[^>]*)?>/ig, "{\\ul\n");
  richText = richText.replace(/<(?:strike|del)(?:\s+[^>]*)?>/ig, "{\\strike\n");
  richText = richText.replace(/<sup(?:\s+[^>]*)?>/ig, "{\\super\n");
  richText = richText.replace(/<sub(?:\s+[^>]*)?>/ig, "{\\sub\n");
  richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "{\\pard\n");

  // End tags
  richText = richText.replace(/<\/(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "\n\\par}\n");
  richText = richText.replace(/<\/(?:b|strong|i|em|u|ins|strike|del|sup|sub)(?:\s+[^>]*)?>/ig, "\n}");

  // Strip any other remaining HTML tags [but leave their contents]
  richText = richText.replace(/<(?:[^>]+)>/g, "");

  // Prefix and suffix the rich text with the necessary syntax
  richText =
      "{\\rtf1\\ansi\n" + (hasHyperlinks ? "{\\colortbl\n;\n\\red0\\green0\\blue255;\n}\n" : "") + richText +
      "\n}";

  return richText; */
}
