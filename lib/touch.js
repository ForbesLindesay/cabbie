'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

module.exports = Touch;

function Touch(browser, parent) {
  this._browser = browser;
  this._parent = parent;
}

Touch.prototype._logMethodCall = function (event) {
  event.target = 'Touch';
  this._browser._logMethodCall(event);
};

Touch.prototype._request = function (method, path, body) {
  return this._browser._request(method,
      '/touch' + path,
    body);
};
Touch.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method,
      '/touch' + path,
    body);
};


Touch.prototype.request = Touch.prototype._request;
Touch.prototype.requestJSON = Touch.prototype._requestJSON;


/**
 * Tap with the finger on the element
 */
Touch.prototype.tap = function () {
  return this._browser.touch()._tap(this._parent.getElementId());
};

/**
 * Double tap with the finger on the element
 */
Touch.prototype.doubleTap = function () {
  return this._browser.touch()._doubleTap(this._parent.getElementId());
};

/**
 * Long tap with the finger on the element
 */
Touch.prototype.longTap = function () {
  return this._browser.touch()._longTap(this._parent.getElementId());
};

/**
 * Finger down on the screen at an offset relative to the element
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Touch.prototype.down = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return when(this._parent.getLocation(), function (location) {
    return this._browser.touch().down(location.x + xOffset, location.y + yOffset);
  }.bind(this));
};

/**
 * Finger down on the screen at the center of the element
 */
Touch.prototype.downAtCenter = function () {
  return when(this._parent.getAbsoluteCenter(), function (center) {
    return this._browser.touch().down(center.x, center.y);
  }.bind(this));
};

/**
 * Finger up on the screen at an offset relative to the element
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Touch.prototype.up = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return when(this._parent.getLocation(), function (location) {
    return this._browser.touch().down(location.x + xOffset, location.y + yOffset);
  }.bind(this));
};

/**
 * Finger up on the screen at the center of the element
 */
Touch.prototype.upAtCenter = function () {
  return when(this._parent.getAbsoluteCenter(), function (center) {
    return this._browser.touch().down(center.x, center.y);
  }.bind(this));
};

/**
 * Move finger to an offset relative to the element
 *
 * @param {Number} xOffset
 * @param {Number} yOffset
 */
Touch.prototype.moveTo = function (xOffset, yOffset) {
  type('xOffset', xOffset, 'Number');
  type('yOffset', yOffset, 'Number');
  return when(this._parent.getLocation(), function (location) {
    return this._browser.touch().move(location.x + xOffset, location.y + yOffset);
  }.bind(this));
};

/**
 * Move finger to the center of the element
 */
Touch.prototype.moveToCenter = function () {
  return when(this._parent.getAbsoluteCenter(), function (center) {
    return this._browser.touch().move(center.x, center.y);
  }.bind(this));
};

//TODO: Element touch flick
//TODO: Element touch scroll

logMethods(Touch.prototype);
