'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = GlobalTouch;

/**
 * Global touch object handling global touch commands
 *
 * @constructor
 * @class GlobalTouch
 * @module WebDriver
 * @submodule Interaction
 * @param {Driver} driver
 */
function GlobalTouch (driver) {
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
GlobalTouch.prototype._logMethodCall = function (event) {
  event.target = 'GlobalTouch';
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
GlobalTouch.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, '/touch' + path, body);
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
GlobalTouch.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Tap on an element
 *
 * @protected
 * @method _tap
 * @param {String} elementId
 */
GlobalTouch.prototype._tap = function (elementId) {
  return this._requestJSON('POST', '/click', { element: elementId });
};

/**
 * Double tap on an element
 *
 * @protected
 * @method _doubleTap
 * @param {String} elementId
 */
GlobalTouch.prototype._doubleTap = function (elementId) {
  return this._requestJSON('POST', '/doubleclick', { element: elementId });
};

/**
 * Long tap on an element
 *
 * @protected
 * @method _longTap
 * @param {String} elementId
 */
GlobalTouch.prototype._longTap = function (elementId) {
  return this._requestJSON('POST', '/longclick', { element: elementId });
};


/**
 * Finger down on the screen at the given position
 *
 * @method down
 * @param {Number} x
 * @param {Number} y
 */
GlobalTouch.prototype.down = function (x, y) {
  type('x', x, 'Number');
  type('y', y, 'Number');
  return this._requestJSON('POST', '/down', { x: x, y: y });
};

/**
 * Finger up on the screen at the given position
 *
 * @method up
 * @param {Number} x
 * @param {Number} y
 */
GlobalTouch.prototype.up = function (x, y) {
  type('x', x, 'Number');
  type('y', y, 'Number');
  return this._requestJSON('POST', '/up', { x: x, y: y });
};


/**
 * Move finger on the screen to the given position
 *
 * @method move
 * @param {Number} x
 * @param {Number} y
 */
GlobalTouch.prototype.move = function (x, y) {
  type('x', x, 'Number');
  type('y', y, 'Number');
  return this._requestJSON('POST', '/move', { x: x, y: y });
};


/**
 * Scroll on the touch screen using finger based motion events according to an offset
 *
 * @method scroll
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
GlobalTouch.prototype.scroll = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return this._requestJSON('POST', '/scroll', { xoffset: xOffset, yoffset: yOffset });
};

/**
 * Flick on the touch screen using finger motion events. This flick command starts at a particular screen location.
 *
 * @method flick
 * @param {Number} xSpeed
 * @param {Number} ySpeed
 */
GlobalTouch.prototype.flick = function (xSpeed, ySpeed) {
  type('xSpeed', xSpeed, 'Number');
  type('ySpeed', ySpeed, 'Number');
  return this._requestJSON('POST', '/flick', { xspeed: xSpeed, yspeed: ySpeed });
};


logMethods(GlobalTouch.prototype);
