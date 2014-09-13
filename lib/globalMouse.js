// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

var Mouse = require('./mouse');

module.exports = GlobalMouse;

/**
 * Global mouse object handling global mouse commands
 *
 * @constructor
 * @class GlobalMouse
 * @module WebDriver
 * @submodule Interaction
 * @param {Driver} driver
 */
function GlobalMouse (driver) {
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
GlobalMouse.prototype._logMethodCall = function (event) {
  event.target = 'GlobalMouse';
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
GlobalMouse.prototype._requestJSON = function (method, path, body) {
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
GlobalMouse.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Move the mouse by an offset of the specified element. If no element is specified,
 * the move is relative to the current mouse cursor. If an element is provided but
 * no offset, the mouse will be moved to the center of the element. If the element
 * is not visible, it will be scrolled into view.
 *
 * @protected
 * @method _moveTo
 * @param {String|undefined} elementId
 * @param {Number|undefined} xOffset
 * @param {Number|undefined} yOffset
 */
GlobalMouse.prototype._moveTo = function (elementId, xOffset, yOffset) {
  var params = {};

  if (elementId !== undefined) {
    params.element = elementId;
  }
  if ((xOffset !== undefined) || (yOffset !== undefined)) {
    params.xoffset = xOffset;
    params.yoffset = yOffset;
  }

  return this._requestJSON('POST', '/moveto', params);
};

/**
 * Move the mouse by an offset relative to the current mouse cursor position
 *
 * @method moveTo
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
GlobalMouse.prototype.moveTo = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return this._moveTo(undefined, xOffset, yOffset);
};


/**
 * Click any mouse button at the current location of the mouse cursor
 *
 * @method click
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
GlobalMouse.prototype.click = function (button) {
  button = button || Mouse.BUTTON_LEFT;
  type('button', button, 'Number');
  return this._requestJSON('POST', '/click', { button: button });
};

/**
 * Click any mouse button at an offset relative to the current location of the mouse cursor
 *
 * @method clickAt
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
GlobalMouse.prototype.clickAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this.click(button);
  }.bind(this));
};

/**
 * Double-clicks at the current location of the mouse cursor
 *
 * @method doubleClick
 */
GlobalMouse.prototype.doubleClick = function () {
  return this._requestJSON('POST', '/doubleclick');
};


/**
 * Click and hold the any mouse button at the current location of the mouse cursor
 *
 * @method buttonDown
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
GlobalMouse.prototype.buttonDown = function (button) {
  button = button || Mouse.BUTTON_LEFT;
  type('button', button, 'Number');
  return this._requestJSON('POST', '/buttondown', { button: button });
};

/**
 * Click and hold the any mouse button relative to the current location of the mouse cursor
 *
 * @method buttonDownAt
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
GlobalMouse.prototype.buttonDownAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this.buttonDown(button);
  }.bind(this));
};


/**
 * Releases the mouse button previously held at the current location of the mouse cursor
 *
 * @method buttonUp
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
GlobalMouse.prototype.buttonUp = function (button) {
  button = button || Mouse.BUTTON_LEFT;
  type('button', button, 'Number');
  return this._requestJSON('POST', '/buttonup', { button: button });
};

/**
 * Releases the mouse button previously held at the current location of the mouse cursor
 *
 * @method buttonUpAt
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.BUTTON_LEFT]
 */
GlobalMouse.prototype.buttonUpAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this.buttonUp(button);
  }.bind(this));
};


logMethods(GlobalMouse.prototype);
