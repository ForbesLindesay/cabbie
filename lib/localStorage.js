// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = LocalStorage;

/**
 * Managing local storage
 *
 * @constructor
 * @class LocalStorage
 * @module WebDriver
 * @submodule Storage
 * @param {Driver} driver
 */
function LocalStorage (driver) {
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
LocalStorage.prototype._logMethodCall = function (event) {
  event.target = 'LocalStorage';
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
LocalStorage.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, '/local_storage' + path, body);
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
LocalStorage.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Get all keys of the storage
 *
 * @method getKeys
 * @return {Array.<String>}
 */
LocalStorage.prototype.getKeys = function () {
  return this._requestJSON('GET', '');
};

/**
 * Get the storage item for the given key
 *
 * @method getItem
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
 * @method setItem
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
 * @method removeItem
 * @param {String} key
 */
LocalStorage.prototype.removeItem = function (key) {
  type('key', key, 'String');
  return this._requestJSON('DELETE', '/key/' + key);
};

/**
 * Clear the storage
 *
 * @method clear
 */
LocalStorage.prototype.clear = function () {
  return this._requestJSON('DELETE', '');
};

/**
 * Get the number of items in the storage
 *
 * @method getSize
 * @return {Number}
 */
LocalStorage.prototype.getSize = function () {
  return this._requestJSON('GET', '/size');
};

logMethods(LocalStorage.prototype);
