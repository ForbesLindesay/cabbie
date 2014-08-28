'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = IME;

/**
 * Input Method Editor object
 *
 * @param {Browser} browser
 * @constructor
 */
function IME (browser) {
  this._browser = browser;
}


/////////////////////
// Private Methods //
/////////////////////

IME.prototype._logMethodCall = function (event) {
  event.target = 'IME';
  this._browser._logMethodCall(event);
};

IME.prototype._request = function (method, path, body) {
  return this._browser._request(method, '/ime' + path, body);
};
IME.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, '/ime' + path, body);
};


////////////////////
// Public Methods //
////////////////////

IME.prototype.request = IME.prototype._request;
IME.prototype.requestJSON = IME.prototype._requestJSON;


/**
 * List all available engines on the machine. To use an engine, it has to be present in this list.
 *
 * @returns {Array.<String>}
 */
IME.prototype.getEngines = function () {
  return this._requestJSON('GET', '/available_engines');
};


/**
 * Get the name of the active IME engine. The name string is platform specific.
 *
 * @returns {String}
 */
IME.prototype.getActiveEngine = function () {
  return this._requestJSON('GET', '/active_engine');
};

/**
 * Indicates whether IME input is active at the moment (not if it's available)
 *
 * @returns {Boolean}
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
 * @params {String} engine
 */
IME.prototype.activate = function (engine) {
  type('engine', engine, 'String');
  return this._requestJSON('POST', '/activate', { engine: engine });
};

/**
 * De-activates the currently-active IME engine
 */
IME.prototype.deactivate = function () {
  return this._requestJSON('POST', '/deactivate');
};


logMethods(IME.prototype);
