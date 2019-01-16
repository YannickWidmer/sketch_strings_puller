var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/settings.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/settings.js":
/*!*************************!*\
  !*** ./src/settings.js ***!
  \*************************/
/*! exports provided: set_settings, check_settings_are_right, check_settings_exist, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "set_settings", function() { return set_settings; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "check_settings_are_right", function() { return check_settings_are_right; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "check_settings_exist", function() { return check_settings_exist; });
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch */ "sketch");
/* harmony import */ var sketch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch__WEBPACK_IMPORTED_MODULE_0__);


var Settings = __webpack_require__(/*! sketch/settings */ "sketch/settings");
/* ######################################################################
 * ####################     Moodals              ########################
 * ######################################################################
 */


var set_authentification = function set_authentification(context) {
  var alert = COSAlertWindow.new();
  alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
  alert.setMessageText("Configure Git Access"); // Creating dialog buttons

  alert.addButtonWithTitle("done"); // response is 1000

  alert.addButtonWithTitle("cancel"); // response is 1001
  // Creating the view

  var viewWidth = 400;
  var viewHeight = 300;
  var viewSpacer = 10;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view); // Create the content of the modal                  (x,y,w,h));

  var label_username = NSTextField.alloc().initWithFrame(NSMakeRect(-1, viewHeight - 65, viewWidth / 2 - 10, 20));
  label_username.setStringValue("username");
  var label_psw = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 65, viewWidth / 2 - 10, 20));
  label_psw.setStringValue("password");
  var username = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 85, 130, 20)); //[username setNextKeyView:password];

  var password = NSTextField.alloc().initWithFrame(NSMakeRect(140, viewHeight - 85, 130, 20));
  view.addSubview(username);
  view.addSubview(label_username);
  view.addSubview(password);
  view.addSubview(label_psw); // Show the dialog

  var response = alert.runModal();

  if (response == 1000) {
    console.log(username.stringValue());
    console.log(password.stringValue());
  }
};

var set_files_modal = function set_files_modal(context) {
  var alert = COSAlertWindow.new();
  alert.setIcon(NSImage.alloc().initByReferencingFile(context.plugin.urlForResourceNamed("icon.png").path()));
  alert.setMessageText("Configure Pull Strings git access and files"); // Creating dialog buttons

  alert.addButtonWithTitle("done"); // response is 1000
  // Creating the view

  var viewWidth = 400;
  var viewHeight = 300;
  var viewSpacer = 10;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view); // Create the content of the modal

  var label = NSTextField.alloc().initWithFrame(NSMakeRect(x, y, w, h));
  label.setStringValue("Set username and password of Github Profile"); // Show the dialog

  var response = alert.runModal();
};
/* ######################################################################
 * ####################     Logic              ########################
 * ######################################################################
 */


function set_settings(context) {
  set_authentification(context);
  return true;
}
function check_settings_are_right(context) {
  if (Settings.settingForKey('settings-exist')) {
    return true;
  } else {
    return set_settings(context);
  }
}
function check_settings_exist(context) {
  if (Settings.settingForKey('settings-exist')) {
    return true;
  } else {
    return set_settings(context);
  }
} // This function is a plugin function

/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  set_settings(context);
}); // Settings.setSettingForKey('my-key', 0.1)
// var setting = Settings.settingForKey('my-key')

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ }),

/***/ "sketch/settings":
/*!**********************************!*\
  !*** external "sketch/settings" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/settings");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=settings.js.map