'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = GlobalTouch;

/**
 * Global touch object handling global touch commands
 *
 * @param {Browser} browser
 * @constructor
 */
function GlobalTouch (browser) {
  this._browser = browser;
}


/////////////////////
// Private Methods //
/////////////////////

GlobalTouch.prototype._logMethodCall = function (event) {
  event.target = 'GlobalTouch';
  this._browser._logMethodCall(event);
};

GlobalTouch.prototype._request = function (method, path, body) {
  return this._browser._request(method, '/touch' + path, body);
};
GlobalTouch.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, '/touch' + path, body);
};


////////////////////
// Public Methods //
////////////////////

GlobalTouch.prototype.request = GlobalTouch.prototype._request;
GlobalTouch.prototype.requestJSON = GlobalTouch.prototype._requestJSON;


/**
 * Tap on an element
 *
 * @private
 * @param {String} elementId
 */
GlobalTouch.prototype._tap = function (elementId) {
  return this._requestJSON('POST', '/click', { element: elementId });
};

/**
 * Double tap on an element
 *
 * @private
 * @param {String} elementId
 */
GlobalTouch.prototype._doubleTap = function (elementId) {
  return this._requestJSON('POST', '/doubleclick', { element: elementId });
};

/**
 * Long tap on an element
 *
 * @private
 * @param {String} elementId
 */
GlobalTouch.prototype._longTap = function (elementId) {
  return this._requestJSON('POST', '/longclick', { element: elementId });
};


/**
 * Finger down on the screen at the given position
 *
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
 * @param {Number} xSpeed
 * @param {Number} ySpeed
 */
GlobalTouch.prototype.flick = function (xSpeed, ySpeed) {
  type('xSpeed', xSpeed, 'Number');
  type('ySpeed', ySpeed, 'Number');
  return this._requestJSON('POST', '/flick', { xspeed: xSpeed, yspeed: ySpeed });
};


logMethods(GlobalTouch.prototype);
