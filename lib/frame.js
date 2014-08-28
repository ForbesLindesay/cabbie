'use strict';

var logMethods = require('./log');
var type = require('./type');


module.exports = Frame;

/**
 * Managing session-storage
 *
 * @param {Browser} browser
 * @constructor
 */
function Frame (browser) {
  this._browser = browser;
}


/////////////////////
// Private Methods //
/////////////////////

Frame.prototype._logMethodCall = function (event) {
  event.target = 'Frame';
  this._browser._logMethodCall(event);
};

Frame.prototype._request = function (method, path, body) {
  return this._browser._request(method, '/frame' + path, body);
};
Frame.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, '/frame' + path, body);
};


////////////////////
// Public Methods //
////////////////////

Frame.prototype.request = Frame.prototype._request;
Frame.prototype.requestJSON = Frame.prototype._requestJSON;


/**
 * Change focus to the default context on the page
 */
Frame.prototype.activateDefault = function () {
  return this._requestJSON('POST', '', { id: null });
};

/**
 * Change focus to a specific frame on the page
 *
 * @param {String} id
 */
Frame.prototype.activate = function (id) {
  return this._requestJSON('POST', '', { id: id });
};

/**
 * Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.
 */
Frame.prototype.activateParent = function () {
  return this._requestJSON('POST', '/parent');
};


logMethods(Frame.prototype);
