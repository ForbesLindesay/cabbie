'use strict';

var type = require('./type');


module.exports = Cookie;

/**
 * Cookie data-structure
 *
 * @constructor
 * @class Cookie
 * @module WebDriver
 * @submodule Storage
 * @param {Object} [values]
 */
function Cookie (values) {
  this._values = values || {};
  this.validate();
}


////////////////////
// Public Methods //
////////////////////

/**
 * The name of the cookie.
 * Direct-access. No need to wait.
 *
 * @method getName
 * @return {String}
 */
Cookie.prototype.getName = function () {
  return this._values.name;
};

/**
 * The name of the cookie.
 * Direct-access. No need to wait.
 *
 * @method setName
 * @param {String} name
 */
Cookie.prototype.setName = function (name) {
  type('name', name, 'String');
  this._values.name = name;
  this.validate();
};


/**
 * The cookie value.
 * Direct-access. No need to wait.
 *
 * @method getValue
 * @return {String}
 */
Cookie.prototype.getValue = function () {
  return this._values.value;
};

/**
 * The cookie value.
 * Direct-access. No need to wait.
 *
 * @method setValue
 * @param {String} value
 */
Cookie.prototype.setValue = function (value) {
  type('value', value, 'String');
  this._values.value = value;
  this.validate();
};


/**
 * (Optional) The cookie path.
 * Direct-access. No need to wait.
 *
 * @method getPath
 * @return {String|undefined}
 */
Cookie.prototype.getPath = function () {
  return this._values.path;
};

/**
 * Set the cookie path.
 * Direct-access. No need to wait.
 *
 * @method setPath
 * @param {String} path
 */
Cookie.prototype.setPath = function (path) {
  type('path', path, 'String');
  this._values.path = path;
  this.validate();
};

/**
 * (Optional) The domain the cookie is visible to.
 * Direct-access. No need to wait.
 *
 * @method getDomain
 * @return {String|undefined}
 */
Cookie.prototype.getDomain = function () {
  return this._values.domain;
};

/**
 * Set the domain the cookie is visible to.
 * Direct-access. No need to wait.
 *
 * @method setDomain
 * @param {String} domain
 */
Cookie.prototype.setDomain = function (domain) {
  type('domain', domain, 'String');
  this._values.domain = domain;
  this.validate();
};


/**
 * (Optional) Whether the cookie is a secure cookie.
 * Direct-access. No need to wait.
 *
 * @method isSecure
 * @return {Boolean|undefined}
 */
Cookie.prototype.isSecure = function () {
  return this._values.secure;
};

/**
 * Set whether the cookie is a secure cookie.
 * Direct-access. No need to wait.
 *
 * @method setSecure
 * @param {Boolean} secure
 */
Cookie.prototype.setSecure = function (secure) {
  type('secure', secure, 'Boolean');
  this._values.secure = secure;
  this.validate();
};


/**
 * (Optional) Whether the cookie is an httpOnly cookie.
 * Direct-access. No need to wait.
 *
 * @method isHttpOnly
 * @return {Boolean|undefined}
 */
Cookie.prototype.isHttpOnly = function () {
  return this._values.httpOnly;
};

/**
 * Set whether the cookie is an httpOnly cookie.
 * Direct-access. No need to wait.
 *
 * @method setHttpOnly
 * @param {Boolean} httpOnly
 */
Cookie.prototype.setHttpOnly = function (httpOnly) {
  type('httpOnly', httpOnly, 'Boolean');
  this._values.httpOnly = httpOnly;
  this.validate();
};


/**
 * (Optional) When the cookie expires, specified in seconds since midnight, January 1, 1970 UTC.
 * Direct-access. No need to wait.
 *
 * @method getExpiry
 * @return {Number|undefined}
 */
Cookie.prototype.getExpiry = function () {
  return this._values.expiry;
};

/**
 * Set when the cookie expires, specified in seconds since midnight, January 1, 1970 UTC.
 * Direct-access. No need to wait.
 *
 * @method setExpiry
 * @param {Number} expiry
 */
Cookie.prototype.setExpiry = function (expiry) {
  type('expiry', expiry, 'Number');
  this._values.expiry = expiry;
  this.validate();
};


/**
 * Get cookie data-structure
 * Direct-access. No need to wait.
 *
 * @method toObject
 * @return {Object}
 */
Cookie.prototype.toObject = function () {
  return this._values;
};

/**
 * Validate the cookie data
 *
 * @method validate
 * @param {Boolean} [completed=false]
 */
Cookie.prototype.validate = function (completed) {

  if (completed) {
    if (!this._values.name) {
      throw new Error('A cookie "name" is required.');
    }
    if (!this._values.value) {
      throw new Error('a cookie "value" is required.');
    }
  }

  if (!this._values.path) {
    this._values.path = '/';
  }

  // localhost is a special case, the domain must be ""
  if (this._values.domain === 'localhost') this._values.domain = '';
};
