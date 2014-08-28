'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = Navigator;

/**
 * Navigation object
 *
 * @param {Browser} browser
 * @constructor
 */
function Navigator (browser) {
  this._browser = browser;
}


/////////////////////
// Private Methods //
/////////////////////

Navigator.prototype._logMethodCall = function (event) {
  event.target = 'Navigator';
  this._browser._logMethodCall(event);
};

Navigator.prototype._request = function (method, path, body) {
  return this._browser._request(method, path, body);
};
Navigator.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, path, body);
};


////////////////////
// Public Methods //
////////////////////

Navigator.prototype.request = Navigator.prototype._request;
Navigator.prototype.requestJSON = Navigator.prototype._requestJSON;


/**
 * Navigate forwards in the browser history, if possible.
 */
Navigator.prototype.forward = function () {
  return this._requestJSON('POST', '/forward');
};

/**
 * Navigate backwards in the browser history, if possible.
 */
Navigator.prototype.backward = function () {
  return this._requestJSON('POST', '/back');
};

/**
 * Refreshes the browser
 */
Navigator.prototype.refresh = function () {
  return this._requestJSON('POST', '/refresh');
};


logMethods(Navigator.prototype);
