'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = LocalStorage;

function LocalStorage(browser) {
  this._browser = browser;
}

LocalStorage.prototype._logMethodCall = function (event) {
  event.target = 'LocalStorage';
  this._browser._logMethodCall(event);
};

LocalStorage.prototype._request = function (method, path, body) {
  return this._browser._request(method,
      '/local_storage' + path,
    body);
};
LocalStorage.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method,
      '/local_storage' + path,
    body);
};


LocalStorage.prototype.request = LocalStorage.prototype._request;
LocalStorage.prototype.requestJSON = LocalStorage.prototype._requestJSON;


/**
 * Get all keys of the storage
 *
 * @return {Array.<String>}
 */
LocalStorage.prototype.getKeys = function () {
  return this._requestJSON('GET', '');
};

/**
 * Get the storage item for the given key
 *
 * @param {String} key
 * @return {String}
 */
LocalStorage.prototype.getItem = function (key) {
  type('key', key, 'String');
  return this._requestJSON('GET', '/key/' + key);
};

/**
 * Set the storage item for the given key
 *
 * @param {String} key
 * @param {String} value
 */
LocalStorage.prototype.setItem = function (key, value) {
  type('key', key, 'String');
  type('value', value, 'String');
  return this._requestJSON('POST', '', { key: key, value: value });
};

/**
 * Remove the storage item for the given key
 *
 * @param {String} key
 */
LocalStorage.prototype.removeItem = function (key) {
  type('key', key, 'String');
  return this._requestJSON('POST', '/key/' + key);
};

/**
 * Clear the storage
 */
LocalStorage.prototype.clear = function () {
  return this._requestJSON('DELETE', '');
};

/**
 * Get the number of items in the storage
 *
 * @return {Number}
 */
LocalStorage.prototype.getSize = function () {
  return this._requestJSON('GET', '/size');
};

logMethods(LocalStorage.prototype);
