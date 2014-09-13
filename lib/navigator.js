// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

module.exports = Navigator;

/**
 * Navigation object
 *
 * @constructor
 * @class Navigator
 * @module WebDriver
 * @submodule Navigation
 * @param {Driver} driver
 */
function Navigator (driver) {
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
Navigator.prototype._logMethodCall = function (event) {
  event.target = 'Navigator';
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
Navigator.prototype._requestJSON = function (method, path, body) {
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
Navigator.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Navigate forwards in the browser history, if possible.
 *
 * @method forward
 */
Navigator.prototype.forward = function () {
  return this._requestJSON('POST', '/forward');
};

/**
 * Navigate backwards in the browser history, if possible.
 *
 * @method backward
 */
Navigator.prototype.backward = function () {
  return this._requestJSON('POST', '/back');
};

/**
 * Refreshes the browser
 *
 * @method refresh
 */
Navigator.prototype.refresh = function () {
  return this._requestJSON('POST', '/refresh');
};


/**
 * Get the current url that the browser is displaying
 *
 * @method getUrl
 * @return {String}
 */
Navigator.prototype.getUrl = function () {
  return this._driver._requestJSON('GET', '/url');
};

/**
 * Navigates the browser to the specified path
 *
 *  - if `path` begins with a "/" it is relative to `options.base`
 *  - if `path` begins with "http" it is absolute
 *  - otherwise it is relative to the current path
 *
 * @method navigateTo
 * @param {String} path
 */
Navigator.prototype.navigateTo = function (path) {
  type('path', path, 'String');

  if (path[0] === '/') {
    path = this._options.base.replace(/\/$/, '') + path;
  } else if (path.indexOf('http') !== 0) {
    return when(this.getUrl(), function (base) {
      return this.navigateTo(url.resolve(base, path));
    }.bind(this));
  }

  return this._driver._requestJSON('POST', '/url', { url: path });
};

/**
 * Navigates the browser to the specified path
 *
 * Alias for `navigateTo`
 *
 * @method setUrl
 * @param {String} path
 */
Navigator.prototype.setUrl = Navigator.prototype.navigateTo;


logMethods(Navigator.prototype);
