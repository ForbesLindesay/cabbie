// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = Alert;

/**
 * Alert window management
 *
 * Handles regular alerts, prompts, and confirms.
 *
 * @constructor
 * @class Alert
 * @module WebDriver
 * @submodule Navigation
 * @param {Driver} driver
 */
function Alert (driver) {
  this._driver = driver;
}


/////////////////////
// Private Methods //
/////////////////////

/**
 * Logs a method call by an event
 *
 * @param {object} event
 * @method _logMethodCall
 * @private
 */
Alert.prototype._logMethodCall = function (event) {
  event.target = 'Alert';
  this._driver._logMethodCall(event);
};


/**
 * Performs a context dependent JSON request for the current session.
 * The result is parsed for errors.
 *
 * @method _requestJSON
 * @private
 * @param {String} method
 * @param {String} path
 * @param {*} [body]
 * @return {*}
 */
Alert.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, path, body);
};


////////////////////
// Public Methods //
////////////////////

/**
 * Gets the driver object.
 * Direct-access. No need to wait.
 *
 * @return {Driver}
 */
Alert.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog
 *
 * @method getText
 * @return {String}
 */
Alert.prototype.getText = function () {
  return this._requestJSON('GET', '/alert_text');
};

/**
 * Sends keystrokes to a JavaScript prompt() dialog
 *
 * @method setText
 * @param {String} text
 */
Alert.prototype.setText = function (text) {
  type('text', text, 'String');
  return this._requestJSON('POST', '/alert_text', { text: text });
};


/**
 * Accepts the currently displayed alert dialog. Usually, this is equivalent to
 * clicking on the 'OK' button in the dialog.
 *
 * @method accept
 */
Alert.prototype.accept = function () {
  return this._requestJSON('POST', '/accept_alert');
};

/**
 * Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs,
 * this is equivalent to clicking the 'Cancel' button. For alert() dialogs, this is
 * equivalent to clicking the 'OK' button.
 *
 * Note: Never use this with an alert. Use accept() instead.
 *
 * @method dismiss
 */
Alert.prototype.dismiss = function () {
  return this._requestJSON('POST', '/dismiss_alert');
};


logMethods(Alert.prototype);
