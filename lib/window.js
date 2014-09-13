// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

module.exports = WindowHandler;

/**
 * Window object
 *
 * @constructor
 * @class WindowHandler
 * @module WebDriver
 * @submodule Navigation
 * @param {Driver} driver
 * @param {String} id
 */
function WindowHandler (driver, id) {
  this._driver = driver;
  this._id = id;
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
WindowHandler.prototype._logMethodCall = function (event) {
  event.target = 'WindowHandler';
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
WindowHandler.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, '/window/' + this._id + path, body);
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
WindowHandler.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Get the value of the element id.
 * Direct-access. No need to wait.
 *
 * @method id
 * @return {String}
 */
WindowHandler.prototype.id = function () {
  return this._id;
};

/**
 * Get the value of the element id.
 * Should the id resolve to 'current', then it will request the actual id.
 *
 * @method getId
 * @return {String}
 */
WindowHandler.prototype.getId = function () {
  if (this._id === 'current') {
    return this._driver._requestJSON('GET', '/window_handle');
  } else {
    return this._driver._getValue(this._id);
  }
};


/**
 * Activate the current window
 *
 * @method activate
 */
WindowHandler.prototype.activate = function () {
  if (this._id === 'current') {
    return this._driver._getValue();
  } else {
    return this._driver.browser().activateWindow(this);
  }
};


/**
 * Get the size of a window
 *
 * @method getSize
 * @return {Object} `{width: number, height: number}`
 */
WindowHandler.prototype.getSize = function () {
  return this._requestJSON('GET', '/size');
};

/**
 * Get the size of a window
 *
 * @method resize
 * @param {Number} width
 * @param {Number} height
 */
WindowHandler.prototype.resize = function (width, height) {
  type('width', width, 'Number');
  type('height', height, 'Number');
  return this._requestJSON('POST', '/size', { width: width, height: height });
};


/**
 * Maximize a window
 *
 * @method maximize
 */
WindowHandler.prototype.maximize = function () {
  return this._requestJSON('POST', '/maximize');
};


/**
 * Get the position of a window
 *
 * @method getPosition
 * @return {Object} `{x: number, y: number}`
 */
WindowHandler.prototype.getPosition = function () {
  return this._requestJSON('GET', '/position');
};

/**
 * Position a window
 *
 * @method position
 * @param {Number} x
 * @param {Number} y
 */
WindowHandler.prototype.position = function (x, y) {
  type('x', x, 'Number');
  type('y', y, 'Number');
  return this._requestJSON('POST', '/position', { x: x, y: y });
};


logMethods(WindowHandler.prototype);
