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
 * @param {Browser} browser
 * @constructor
 */
function TimeOut (browser) {
  this._browser = browser;
}


//////////////////
// ENUMERATIONS //
//////////////////

TimeOut.TIMEOUT_TYPE_SCRIPT = 'script';
TimeOut.TIMEOUT_TYPE_ASYNC_SCRIPT = 'async';
TimeOut.TIMEOUT_TYPE_PAGE_LOAD = 'page load';
TimeOut.TIMEOUT_TYPE_IMPLICIT = 'implicit';


/////////////////////
// Private Methods //
/////////////////////

TimeOut.prototype._logMethodCall = function (event) {
  event.target = 'TimeOut';
  this._browser._logMethodCall(event);
};

TimeOut.prototype._request = function (method, path, body) {
  return this._browser._request(method, '/timeouts' + path, body);
};
TimeOut.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, '/timeouts' + path, body);
};


////////////////////
// Public Methods //
////////////////////

TimeOut.prototype.request = TimeOut.prototype._request;
TimeOut.prototype.requestJSON = TimeOut.prototype._requestJSON;


/**
 * Set a time-out
 *
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
 * @param {Number} timeout
 */
TimeOut.prototype.setImplicitTimeOut = function (timeout) {
  type('timeout', timeout, 'String|Number');
  timeout = ms(timeout.toString());
  return this._requestJSON('POST', '', { type: TimeOut.TIMEOUT_TYPE_IMPLICIT, ms: timeout });
};


logMethods(TimeOut.prototype);
