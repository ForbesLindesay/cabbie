// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var when = require('./when');
var type = require('./type');

var ActiveWindow = require('./activeWindow');
var WindowHandler = require('./window');
var IME = require('./ime');
var LocalStorage = require('./localStorage');
var CookieStorage = require('./cookieStorage');


module.exports = Browser;

/**
 * Browser accessor class
 *
 * @constructor
 * @class Browser
 * @module WebDriver
 * @submodule Core
 * @param {Driver} driver Driver object
 */
function Browser (driver) {
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
 * @protected
 */
Browser.prototype._logMethodCall = function (event) {
  event.target = 'Browser';
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
Browser.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, path, body);
};


//////////////////
// Enumerations //
//////////////////

/**
 * Landscape orientation of the device
 *
 * @static
 * @property ORIENTATION_LANDSCAPE
 * @type {string}
 */
Browser.ORIENTATION_LANDSCAPE = 'landscape';

/**
 * Portrait orientation of the device
 *
 * @static
 * @property ORIENTATION_PORTRAIT
 * @type {string}
 */
Browser.ORIENTATION_PORTRAIT = 'portrait';


////////////////////
// Public Methods //
////////////////////

/**
 * Gets the driver object.
 * Direct-access. No need to wait.
 *
 * @return {Driver}
 */
Browser.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Change focus to another window
 *
 * @method activateWindow
 * @param {WindowHandler} handle
 */
Browser.prototype.activateWindow = function (handle) {
  type('handle', handle, 'Object');

  return when(handle.id(), function (windowHandle) {
    this._requestJSON('POST', '/window', {
      name: windowHandle
    });
  }.bind(this));
};

/**
 * Get the currently active window.
 * Direct-access. No need to wait.
 *
 * @method activeWindow
 * @return {ActiveWindow}
 */
Browser.prototype.activeWindow = function () {
  return new ActiveWindow(this._driver, 'current');
};

/**
 * Get an array of windows for all available windows
 *
 * @method getWindows
 * @return {Array.<WindowHandler>}
 */
Browser.prototype.getWindows = function () {
  return when(this._requestJSON('GET', '/window_handles'), function (handles) {
    return handles.map(function (handle) {
      return new WindowHandler(this._driver, handle);
    }.bind(this));
  }.bind(this));
};


/**
 * Get the current browser orientation
 *
 * @method getOrientation
 * @return {String}
 */
Browser.prototype.getOrientation = function () {
  return this._requestJSON('GET', '/orientation');
};

/**
 * Get the current browser orientation
 *
 * @method setOrientation
 * @param {String} orientation
 */
Browser.prototype.setOrientation = function (orientation) {
  type('orientation', orientation, 'String');
  return this._requestJSON('POST', '/orientation', { orientation: orientation });
};


/**
 * Get the current geo location
 *
 * @method getGeoLocation
 * @return {Object} `{latitude: number, longitude: number, altitude: number}`
 */
Browser.prototype.getGeoLocation = function () {
  return this._requestJSON('GET', '/location');
};

/**
 * Set the current geo location
 *
 * @method setGeoLocation
 * @param {Number} latitude
 * @param {Number} longitude
 * @param {Number} altitude
 */
Browser.prototype.setGeoLocation = function (latitude, longitude, altitude) {
  type('latitude', latitude, 'Number');
  type('longitude', longitude, 'Number');
  type('altitude', altitude, 'Number');
  return this._requestJSON('POST', '/location', { latitude: latitude, longitude: longitude, altitude: altitude });
};


/**
 * Get the IME object.
 * Direct-access. No need to wait.
 *
 * @method ime
 * @return {IME}
 */
Browser.prototype.ime = function () {
  return new IME(this._driver);
};


/**
 * Get the Cookie-Storage object.
 * Direct-access. No need to wait.
 *
 * @method cookieStorage
 * @return {CookieStorage}
 */
Browser.prototype.cookieStorage = function () {
  return new CookieStorage(this._driver);
};

/**
 * Get the Local-Storage object.
 * Direct-access. No need to wait.
 *
 * @method localStorage
 * @return {LocalStorage}
 */
Browser.prototype.localStorage = function () {
  return new LocalStorage(this._driver);
};


logMethods(Browser.prototype);
