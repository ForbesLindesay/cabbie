// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

module.exports = Touch;

/**
 * Touch commands relative to a DOM-element
 *
 * @constructor
 * @class Touch
 * @module WebDriver
 * @submodule Interaction
 * @param {Driver} driver
 * @param {Element} parent
 */
function Touch (driver, parent) {
  this._driver = driver;
  this._parent = parent;
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
Touch.prototype._logMethodCall = function (event) {
  event.target = 'Touch';
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
Touch.prototype._requestJSON = function (method, path, body) {
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
Touch.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Tap with the finger on the element
 *
 * @method tap
 */
Touch.prototype.tap = function () {
  return this._driver.browser().activeWindow().touch()._tap(this._parent.elementId());
};

/**
 * Double tap with the finger on the element
 *
 * @method doubleTap
 */
Touch.prototype.doubleTap = function () {
  return this._driver.browser().activeWindow().touch()._doubleTap(this._parent.elementId());
};

/**
 * Long tap with the finger on the element
 *
 * @method longTap
 */
Touch.prototype.longTap = function () {
  return this._driver.browser().activeWindow().touch()._longTap(this._parent.elementId());
};


/**
 * Finger down on the screen at an offset relative to the element
 *
 * @method down
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Touch.prototype.down = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return when(this._parent.getPosition(), function (location) {
    return this._driver.browser().activeWindow().touch().down(location.x + xOffset, location.y + yOffset);
  }.bind(this));
};

/**
 * Finger down on the screen at the center of the element
 *
 * @method downAtCenter
 */
Touch.prototype.downAtCenter = function () {
  return when(this._parent.getAbsoluteCenter(), function (center) {
    return this._driver.browser().activeWindow().touch().down(center.x, center.y);
  }.bind(this));
};


/**
 * Finger up on the screen at an offset relative to the element
 *
 * @method up
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Touch.prototype.up = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return when(this._parent.getPosition(), function (location) {
    return this._driver.browser().activeWindow().touch().down(location.x + xOffset, location.y + yOffset);
  }.bind(this));
};

/**
 * Finger up on the screen at the center of the element
 *
 * @method upAtCenter
 */
Touch.prototype.upAtCenter = function () {
  return when(this._parent.getAbsoluteCenter(), function (center) {
    return this._driver.browser().activeWindow().touch().down(center.x, center.y);
  }.bind(this));
};


/**
 * Move finger to an offset relative to the element
 *
 * @method moveTo
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Touch.prototype.moveTo = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return when(this._parent.getPosition(), function (location) {
    return this._driver.browser().activeWindow().touch().move(location.x + xOffset, location.y + yOffset);
  }.bind(this));
};

/**
 * Move finger to the center of the element
 *
 * @method moveToCenter
 */
Touch.prototype.moveToCenter = function () {
  return when(this._parent.getAbsoluteCenter(), function (center) {
    return this._driver.browser().activeWindow().touch().move(center.x, center.y);
  }.bind(this));
};


//TODO: Element touch flick
//TODO: Element touch scroll

logMethods(Touch.prototype);
