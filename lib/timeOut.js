'use strict';

var url = require('url');
var ms = require('ms');

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');


module.exports = TimeOut;

/**
 * Managing time-out
 *
 * @constructor
 * @class TimeOut
 * @module WebDriver
 * @submodule System
 * @param {Driver} driver
 */
function TimeOut (driver) {
  this._driver = driver;
}


//////////////////
// Enumerations //
//////////////////

/**
 * Synchronous script execution timeout
 *
 * @static
 * @property TIMEOUT_TYPE_SCRIPT
 * @type {String}
 */
TimeOut.TIMEOUT_TYPE_SCRIPT = 'script';

/**
 * Asynchronous script execution timeout
 *
 * @static
 * @property TIMEOUT_TYPE_ASYNC_SCRIPT
 * @type {String}
 */
TimeOut.TIMEOUT_TYPE_ASYNC_SCRIPT = 'async';

/**
 * Page load timeout
 *
 * @static
 * @property TIMEOUT_TYPE_PAGE_LOAD
 * @type {String}
 */
TimeOut.TIMEOUT_TYPE_PAGE_LOAD = 'page load';

/**
 * Implicit wait timeout.
 * Implicit waits are applied for all requests.
 *
 * @static
 * @property TIMEOUT_TYPE_IMPLICIT
 * @type {String}
 */
TimeOut.TIMEOUT_TYPE_IMPLICIT = 'implicit';


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
TimeOut.prototype._logMethodCall = function (event) {
  event.target = 'TimeOut';
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
TimeOut.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, '/timeouts' + path, body);
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
TimeOut.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Set a time-out
 *
 * @method setTimeOut
 * @param {String} timeOutType
 * @param {Number} ms
 */
TimeOut.prototype.setTimeOut = function (timeOutType, ms) {

  switch (timeOutType) {
    case TimeOut.TIMEOUT_TYPE_SCRIPT:
      return this.setScriptTimeOut(ms);
    case TimeOut.TIMEOUT_TYPE_ASYNC_SCRIPT:
      return this.setAsyncScriptTimeOut(ms);
    case TimeOut.TIMEOUT_TYPE_PAGE_LOAD:
      return this.setPageLoadTimeOut(ms);
    case TimeOut.TIMEOUT_TYPE_IMPLICIT:
      return this.setImplicitTimeOut(ms);
    default:
      throw new Error('Invalid timeout type' + JSON.stringify(timeOutType) + ', expected "script", "page load", "implicit" or "async"');
  }
};

/**
 * Set multiple time-outs at once
 *
 * @method setTimeOuts
 * @param {Object} timeOuts
 */
TimeOut.prototype.setTimeOuts = function (timeOuts) {
  var i, list = [];

  type('timeOuts', timeOuts, 'Object');

  for (i in timeOuts) {
    if (timeOuts.hasOwnProperty(i)) {
      list.push(this.setTimeOut(i, timeOuts[i]));
    }
  }

  function unwrap () {
    if (list.length) {
      return when(list.pop(), unwrap);
    }
  }

  return unwrap();
};


/**
 * Set the amount of time, in milliseconds, that scripts are permitted
 * to run before they are aborted and a "Timeout" error is returned to the client.
 *
 * @method setScriptTimeOut
 * @param {Number} timeout
 */
TimeOut.prototype.setScriptTimeOut = function (timeout) {
  type('timeout', timeout, 'String|Number');
  timeout = ms(timeout.toString());
  return this._requestJSON('POST', '', { type: TimeOut.TIMEOUT_TYPE_SCRIPT, ms: timeout });
};

/**
 * Set the amount of time, in milliseconds, that asynchronous scripts are permitted
 * to run before they are aborted and a "Timeout" error is returned to the client.
 *
 * @method setAsyncScriptTimeOut
 * @param {Number} timeout
 */
TimeOut.prototype.setAsyncScriptTimeOut = function (timeout) {
  type('timeout', timeout, 'String|Number');
  timeout = ms(timeout.toString());
  return this._requestJSON('POST', '/async_script', { ms: timeout });
};

/**
 * Set the amount of time, in milliseconds, that a page is permitted to be loaded
 * before they it is aborted and a "Timeout" error is returned to the client.
 *
 * @method setPageLoadTimeOut
 * @param {Number} timeout
 */
TimeOut.prototype.setPageLoadTimeOut = function (timeout) {
  type('timeout', timeout, 'String|Number');
  timeout = ms(timeout.toString());
  return this._requestJSON('POST', '', { type: TimeOut.TIMEOUT_TYPE_PAGE_LOAD, ms: timeout });
};

/**
 * Set the amount of time, in milliseconds, that scripts executed are permitted
 * to run before they are aborted and a "Timeout" error is returned to the client.
 *
 * @method setImplicitTimeOut
 * @param {Number} timeout
 */
TimeOut.prototype.setImplicitTimeOut = function (timeout) {
  type('timeout', timeout, 'String|Number');
  timeout = ms(timeout.toString());
  return this._requestJSON('POST', '', { type: TimeOut.TIMEOUT_TYPE_IMPLICIT, ms: timeout });
};


logMethods(TimeOut.prototype);
