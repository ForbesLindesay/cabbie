'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

module.exports = Mouse;

/**
 * Mouse commands relative to a DOM-element
 *
 * @param {Browser} browser
 * @param {Element} parent
 * @constructor
 */
function Mouse (browser, parent) {
  this._browser = browser;
  this._parent = parent;
}


//////////////////
// Enumerations //
//////////////////

Mouse.LEFT = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;


/////////////////////
// Private Methods //
/////////////////////

Mouse.prototype._logMethodCall = function (event) {
  event.target = 'Mouse';
  this._browser._logMethodCall(event);
};

Mouse.prototype._request = function (method, path, body) {
  return this._parent._request(method, path, body);
};
Mouse.prototype._requestJSON = function (method, path, body) {
  return this._parent._requestJSON(method, path, body);
};


////////////////////
// Public Methods //
////////////////////

Mouse.prototype.request = Mouse.prototype._request;
Mouse.prototype.requestJSON = Mouse.prototype._requestJSON;


/**
 * Click any mouse button at the center of the element
 *
 * @param {Number} [button=Mouse.LEFT]
 */
Mouse.prototype.click = function (button) {
  if (button) {
    return when(this.moveToCenter(), function () {
      return this._browser.mouse().click(button);
    }.bind(this));
  } else {
    return this._requestJSON('POST', '/click');
  }
};

/**
 * Click any mouse button at a specified offset of the element
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.LEFT]
 */
Mouse.prototype.clickAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this._browser.mouse().click(button);
  }.bind(this));
};


/**
 * Move the mouse by an offset of the element
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Mouse.prototype.moveTo = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return this._browser.mouse()._moveTo(this._parent.getElementId(), xOffset, yOffset);
};

/**
 * Move the mouse to the center of the element
 */
Mouse.prototype.moveToCenter = function () {
  return this._browser.mouse()._moveTo(this._parent.getElementId(), undefined, undefined);
};


/**
 * Double-clicks the element at the center of the element
 */
Mouse.prototype.doubleClick = function () {
  return when(this.moveToCenter(), function () {
    return this._browser.mouse().doubleClick();
  }.bind(this));
};

/**
 * Double-clicks the element at a specified offset of the element
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Mouse.prototype.doubleClickAt = function (xOffset, yOffset) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this._browser.mouse().doubleClick();
  }.bind(this));
};


/**
 * Click and hold any mouse button at the center of the element
 *
 * @param {Number} [button=Mouse.LEFT]
 */
Mouse.prototype.buttonDown = function (button) {
  return when(this.moveToCenter(), function () {
    return this._browser.mouse().buttonDown(button);
  }.bind(this));
};

/**
 * Click and hold any mouse button at a specified offset of the element
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.LEFT]
 */
Mouse.prototype.buttonDownAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this._browser.mouse().buttonDown(button);
  }.bind(this));
};


/**
 * Releases a mouse button at the center of the element
 *
 * @param {Number} [button=Mouse.LEFT]
 */
Mouse.prototype.buttonUp = function (button) {
  return when(this.moveToCenter(), function () {
    return this._browser.mouse().buttonUp(button);
  }.bind(this));
};

/**
 * Releases a mouse button at a specified offset of the element
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 * @param {Number} [button=Mouse.LEFT]
 */
Mouse.prototype.buttonUpAt = function (xOffset, yOffset, button) {
  return when(this.moveTo(xOffset, yOffset), function () {
    return this._browser.mouse().buttonUp(button);
  }.bind(this));
};


logMethods(Mouse.prototype);
