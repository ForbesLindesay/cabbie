'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = Alert;
function Alert(browser) {
  this._browser = browser;
}

Alert.prototype._logMethodCall = function (event) {
  event.target = 'Alert';
  this._browser._logMethodCall(event);
};

Alert.prototype._request = function (method, path, body) {
  return this._browser._request(method,
    path,
    body);
};
Alert.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method,
    path,
    body);
};


Alert.prototype.request = Alert.prototype._request;
Alert.prototype.requestJSON = Alert.prototype._requestJSON;

/**
 * Gets the text of the currently displayed JavaScript alert(), confirm(), or prompt() dialog
 *
 * @return {String}
 */
Alert.prototype.getText = function () {
  return this._requestJSON('GET', '/alert_text');
};

/**
 * Sends keystrokes to a JavaScript prompt() dialog
 *
 * @param {String} text
 */
Alert.prototype.setText = function (text) {
  type('text', text, 'String');
  return this._requestJSON('POST', '/alert_text', { text: text });
};

/**
 * Accepts the currently displayed alert dialog. Usually, this is equivalent to
 * clicking on the 'OK' button in the dialog.
 */
Alert.prototype.accept = function () {
  return this._requestJSON('POST', '/accept_alert');
};

/**
 * Dismisses the currently displayed alert dialog. For confirm() and prompt() dialogs,
 * this is equivalent to clicking the 'Cancel' button. For alert() dialogs, this is
 * equivalent to clicking the 'OK' button.
 */
Alert.prototype.dismiss = function () {
  return this._requestJSON('POST', '/dismiss_alert');
};

logMethods(Alert.prototype);
