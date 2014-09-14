'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = IME;

/**
 * Input Method Editor object
 *
 * @constructor
 * @class IME
 * @module WebDriver
 * @submodule Interaction
 * @param {Driver} driver
 */
function IME (driver) {
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
IME.prototype._logMethodCall = function (event) {
  event.target = 'IME';
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
IME.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, '/ime' + path, body);
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
IME.prototype.getDriver = function () {
  return this._driver;
};


/**
 * List all available engines on the machine. To use an engine, it has to be present in this list.
 *
 * @method getEngines
 * @return {Array.<String>}
 */
IME.prototype.getEngines = function () {
  return this._requestJSON('GET', '/available_engines');
};


/**
 * Get the name of the active IME engine. The name string is platform specific.
 *
 * @method getActiveEngine
 * @return {String}
 */
IME.prototype.getActiveEngine = function () {
  return this._requestJSON('GET', '/active_engine');
};

/**
 * Indicates whether IME input is active at the moment (not if it's available)
 *
 * @method isActivated
 * @return {Boolean}
 */
IME.prototype.isActivated = function () {
  return this._requestJSON('GET', '/activated');
};


/**
 * Make an engines that is available (appears on the list returned by
 * getAvailableEngines) active. After this call, the engine will be
 * added to the list of engines loaded in the IME daemon and the input
 * sent using sendKeys will be converted by the active engine.
 *
 * Note that this is a platform-independent method of activating IME
 * (the platform-specific way being using keyboard shortcuts)
 *
 * @method activate
 * @param {String} engine
 */
IME.prototype.activate = function (engine) {
  type('engine', engine, 'String');
  return this._requestJSON('POST', '/activate', { engine: engine });
};

/**
 * De-activates the currently-active IME engine
 *
 * @method deactivate
 */
IME.prototype.deactivate = function () {
  return this._requestJSON('POST', '/deactivate');
};


logMethods(IME.prototype);
