'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = SessionStorage;

/**
 * Managing session-storage
 *
 * @constructor
 * @class SessionStorage
 * @module WebDriver
 * @submodule Storage
 * @param {Driver} driver
 */
function SessionStorage (driver) {
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
SessionStorage.prototype._logMethodCall = function (event) {
  event.target = 'SessionStorage';
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
SessionStorage.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, '/session_storage' + path, body);
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
SessionStorage.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Get all keys of the storage
 *
 * @method getKeys
 * @return {Array.<String>}
 */
SessionStorage.prototype.getKeys = function () {
  return this._requestJSON('GET', '');
};

/**
 * Get the storage item for the given key
 *
 * @method getItem
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
 * @method setItem
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
 * @method removeItem
 * @param {String} key
 */
SessionStorage.prototype.removeItem = function (key) {
  type('key', key, 'String');
  return this._requestJSON('DELETE', '/key/' + key);
};

/**
 * Clear the storage
 *
 * @method clear
 */
SessionStorage.prototype.clear = function () {
  return this._requestJSON('DELETE', '');
};

/**
 * Get the number of items in the storage
 *
 * @method getSize
 * @return {Number}
 */
SessionStorage.prototype.getSize = function () {
  return this._requestJSON('GET', '/size');
};


logMethods(SessionStorage.prototype);
