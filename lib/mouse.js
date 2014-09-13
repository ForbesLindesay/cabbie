// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

module.exports = Mouse;

/**
 * Mouse commands relative to a DOM-element
 *
 * @constructor
 * @class Mouse
 * @module WebDriver
 * @submodule Interaction
 * @param {Driver} driver
 * @param {Element} parent
 */
function Mouse (driver, parent) {
  this._driver = driver;
  this._parent = parent;
}


//////////////////
// Enumerations //
//////////////////

/**
 * Left mouse button
 *
 * @static
 * @property BUTTON_LEFT
 * @type {int}
 */
Mouse.BUTTON_LEFT = 0;

/**
 * Middle mouse button. It is the scroll button on some mouses.
 *
 * @static
 * @property BUTTON_MIDDLE
 * @type {int}
 */
Mouse.BUTTON_MIDDLE = 1;

/**
 * Right mouse button
 *
 * @static
 * @property BUTTON_RIGHT
 * @type {int}
 */
Mouse.BUTTON_RIGHT = 2;


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
Mouse.prototype._logMethodCall = function (event) {
  event.target = 'Mouse';
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
Mouse.prototype._requestJSON = function (method, path, body) {
  return this._parent._requestJSON(method, path, body);
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
Mouse.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Click any mouse button at the center of the element
 *
 * @method click
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
Mouse.prototype.click = function (button) {
  if (button) {
    return when(this.moveToCenter(), function () {
      return this._driver.browser().activeWindow().mouse().click(button);
    }.bind(this));
  } else {
    return this._requestJSON('POST', '/click');
  }
};

/**
 * Click any mouse button at a specified offset of the element
 *
 * @method clickAt
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
Mouse.prototype.clickAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this._driver.browser().activeWindow().mouse().click(button);
  }.bind(this));
};


/**
 * Move the mouse by an offset of the element
 *
 * @method moveTo
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Mouse.prototype.moveTo = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return this._driver.browser().activeWindow().mouse()._moveTo(this._parent.elementId(), xOffset, yOffset);
};

/**
 * Move the mouse to the center of the element
 *
 * @method moveToCenter
 */
Mouse.prototype.moveToCenter = function () {
  return this._driver.browser().activeWindow().mouse()._moveTo(this._parent.elementId(), undefined, undefined);
};


/**
 * Double-clicks the element at the center of the element
 *
 * @method doubleClick
 */
Mouse.prototype.doubleClick = function () {
  return when(this.moveToCenter(), function () {
    return this._driver.browser().activeWindow().mouse().doubleClick();
  }.bind(this));
};

/**
 * Double-clicks the element at a specified offset of the element
 *
 * @method doubleClickAt
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Mouse.prototype.doubleClickAt = function (xOffset, yOffset) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this._driver.browser().activeWindow().mouse().doubleClick();
  }.bind(this));
};


/**
 * Click and hold any mouse button at the center of the element
 *
 * @method buttonDown
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
Mouse.prototype.buttonDown = function (button) {
  return when(this.moveToCenter(), function () {
    return this._driver.browser().activeWindow().mouse().buttonDown(button);
  }.bind(this));
};

/**
 * Click and hold any mouse button at a specified offset of the element
 *
 * @method buttonDownAt
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
Mouse.prototype.buttonDownAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this._driver.browser().activeWindow().mouse().buttonDown(button);
  }.bind(this));
};


/**
 * Releases a mouse button at the center of the element
 *
 * @method buttonUp
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
Mouse.prototype.buttonUp = function (button) {
  return when(this.moveToCenter(), function () {
    return this._driver.browser().activeWindow().mouse().buttonUp(button);
  }.bind(this));
};

/**
 * Releases a mouse button at a specified offset of the element
 *
 * @method buttonUpAt
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
Mouse.prototype.buttonUpAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this._driver.browser().activeWindow().mouse().buttonUp(button);
  }.bind(this));
};


logMethods(Mouse.prototype);
