'use strict';

var logMethods = require('./log');
var type = require('./type');


module.exports = Frame;

/**
 * Managing session-storage
 *
 * @constructor
 * @class Frame
 * @module WebDriver
 * @submodule Navigation
 * @param {Driver} driver
 */
function Frame (driver) {
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
Frame.prototype._logMethodCall = function (event) {
  event.target = 'Frame';
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
Frame.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, '/frame' + path, body);
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
Frame.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Change focus to the default context on the page
 *
 * @method activateDefault
 */
Frame.prototype.activateDefault = function () {
  return this._requestJSON('POST', '', { id: null });
};

/**
 * Change focus to a specific frame on the page
 *
 * @method activate
 * @param {String} id
 */
Frame.prototype.activate = function (id) {
  return this._requestJSON('POST', '', { id: id });
};

/**
 * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
 *
 * @method activateParent
 */
Frame.prototype.activateParent = function () {
  return this._requestJSON('POST', '/parent');
};


logMethods(Frame.prototype);
