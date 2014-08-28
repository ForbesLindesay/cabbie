'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = WindowHandler;

/**
 *
 * @param browser
 * @param id
 * @constructor
 */
function WindowHandler (browser, id) {
  this._browser = browser;
  this._id = id;
}


/////////////////////
// PRIVATE METHODS //
/////////////////////

WindowHandler.prototype._logMethodCall = function (event) {
  event.target = 'WindowHandler';
  this._browser._logMethodCall(event);
};

WindowHandler.prototype._request = function (method, path, body) {
  return this._browser._request(method, '/window/' + this._id + path, body);
};
WindowHandler.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, '/window/' + this._id + path, body);
};


////////////////////
// Public Methods //
////////////////////

WindowHandler.prototype.request = WindowHandler.prototype._request;
WindowHandler.prototype.requestJSON = WindowHandler.prototype._requestJSON;


/**
 * Get the value of the element id
 *
 * @returns {String}
 */
WindowHandler.prototype.getWindowId = function () {
  return this._id;
};


/**
 * Activate the current window
 */
WindowHandler.prototype.activate = function () {
  return this._browser.activateWindow(this);
};


/**
 * Get the size of a window
 *
 * @return {Object} `{width: number, height: number}`
 */
WindowHandler.prototype.getSize = function () {
  return this._requestJSON('GET', '/size');
};

/**
 * Get the size of a window
 *
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
 */
WindowHandler.prototype.maximize = function () {
  return this._requestJSON('POST', '/maximize');
};


/**
 * Get the position of a window
 *
 * @return {Object} `{x: number, y: number}`
 */
WindowHandler.prototype.getPosition = function () {
  return this._requestJSON('GET', '/position');
};

/**
 * Position a window
 *
 * @param {Number} x
 * @param {Number} y
 */
WindowHandler.prototype.position = function (x, y) {
  type('x', x, 'Number');
  type('y', y, 'Number');
  return this._requestJSON('POST', '/position', { x: x, y: y });
};


logMethods(WindowHandler.prototype);
