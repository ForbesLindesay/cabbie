'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = SessionStorage;

/**
 * Managing session-storage
 *
 * @param {Browser} browser
 * @constructor
 */
function SessionStorage (browser) {
  this._browser = browser;
}


/////////////////////
// Private Methods //
/////////////////////

SessionStorage.prototype._logMethodCall = function (event) {
  event.target = 'SessionStorage';
  this._browser._logMethodCall(event);
};

SessionStorage.prototype._request = function (method, path, body) {
  return this._browser._request(method, '/session_storage' + path, body);
};
SessionStorage.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, '/session_storage' + path, body);
};


////////////////////
// Public Methods //
////////////////////

SessionStorage.prototype.request = SessionStorage.prototype._request;
SessionStorage.prototype.requestJSON = SessionStorage.prototype._requestJSON;


/**
 * Get all keys of the storage
 *
 * @return {Array.<String>}
 */
SessionStorage.prototype.getKeys = function () {
  return this._requestJSON('GET', '');
};

/**
 * Get the storage item for the given key
 *
 * @param {String} key
 * @return {String}
 */
SessionStorage.prototype.getItem = function (key) {
  type('key', key, 'String');
  return this._requestJSON('GET', '/key/' + key);
};

/**
 * Set the storage item for the given key
 *
 * @param {String} key
 * @param {String} value
 */
SessionStorage.prototype.setItem = function (key, value) {
  type('key', key, 'String');
  type('value', value, 'String');
  return this._requestJSON('POST', '', { key: key, value: value });
};

/**
 * Remove the storage item for the given key
 *
 * @param {String} key
 */
SessionStorage.prototype.removeItem = function (key) {
  type('key', key, 'String');
  return this._requestJSON('POST', '/key/' + key);
};

/**
 * Clear the storage
 */
SessionStorage.prototype.clear = function () {
  return this._requestJSON('DELETE', '');
};

/**
 * Get the number of items in the storage
 *
 * @return {Number}
 */
SessionStorage.prototype.getSize = function () {
  return this._requestJSON('GET', '/size');
};


logMethods(SessionStorage.prototype);
