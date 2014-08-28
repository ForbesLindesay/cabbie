'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

var Mouse = require('./mouse');

module.exports = GlobalMouse;

/**
 * Global mouse object handling global mouse commands
 *
 * @param {Browser} browser
 * @constructor
 */
function GlobalMouse (browser) {
  this._browser = browser;
}


/////////////////////
// Private Methods //
/////////////////////

GlobalMouse.prototype._logMethodCall = function (event) {
  event.target = 'GlobalMouse';
  this._browser._logMethodCall(event);
};

GlobalMouse.prototype._request = function (method, path, body) {
  return this._browser._request(method, path, body);
};
GlobalMouse.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, path, body);
};


////////////////////
// Public Methods //
////////////////////

GlobalMouse.prototype.request = GlobalMouse.prototype._request;
GlobalMouse.prototype.requestJSON = GlobalMouse.prototype._requestJSON;


/**
 * Move the mouse by an offset of the specified element. If no element is specified,
 * the move is relative to the current mouse cursor. If an element is provided but
 * no offset, the mouse will be moved to the center of the element. If the element
 * is not visible, it will be scrolled into view.
 *
 * @private
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
 * @param {Number} [button=Mouse.LEFT]
 */
GlobalMouse.prototype.click = function (button) {
  button = button || Mouse.LEFT;
  type('button', button, 'Number');
  return this._requestJSON('POST', '/click', { button: button });
};

/**
 * Click any mouse button at an offset relative to the current location of the mouse cursor
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.LEFT]
 */
GlobalMouse.prototype.clickAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this.click(button);
  }.bind(this));
};

/**
 * Double-clicks at the current location of the mouse cursor
 */
GlobalMouse.prototype.doubleClick = function () {
  return this._requestJSON('POST', '/doubleclick');
};


/**
 * Click and hold the any mouse button at the current location of the mouse cursor
 *
 * @param {Number} [button=Mouse.LEFT]
 */
GlobalMouse.prototype.buttonDown = function (button) {
  button = button || Mouse.LEFT;
  type('button', button, 'Number');
  return this._requestJSON('POST', '/buttondown', { button: button });
};

/**
 * Click and hold the any mouse button relative to the current location of the mouse cursor
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.LEFT]
 */
GlobalMouse.prototype.buttonDownAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this.buttonDown(button);
  }.bind(this));
};


/**
 * Releases the mouse button previously held at the current location of the mouse cursor
 *
 * @param {Number} [button=Mouse.LEFT]
 */
GlobalMouse.prototype.buttonUp = function (button) {
  button = button || Mouse.LEFT;
  type('button', button, 'Number');
  return this._requestJSON('POST', '/buttonup', { button: button });
};

/**
 * Releases the mouse button previously held at the current location of the mouse cursor
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.LEFT]
 */
GlobalMouse.prototype.buttonUpAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this.buttonUp(button);
  }.bind(this));
};


logMethods(GlobalMouse.prototype);
