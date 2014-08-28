'use strict';

var type = require('./type');


module.exports = Cookie;

/**
 * Cookie data-structure
 *
 * @param {Object} values
 * @constructor
 */
function Cookie (values) {
  this._values = values;
  this._validate();
}


////////////////////
// Public Methods //
////////////////////

/**
 * The name of the cookie.
 *
 * @returns {String}
 */
Cookie.prototype.getName = function () {
  return this._values.name;
};

/**
 * The name of the cookie.
 *
 * @param {String} name
 */
Cookie.prototype.setName = function (name) {
  type('name', name, 'String');
  this._values.name = name;
  this._validate();
};


/**
 * The cookie value.
 *
 * @returns {String}
 */
Cookie.prototype.getValue = function () {
  return this._values.value;
};

/**
 * The cookie value.
 *
 * @param {String} value
 */
Cookie.prototype.setValue = function (value) {
  type('value', value, 'String');
  this._values.value = value;
  this._validate();
};


/**
 * (Optional) The cookie path.
 *
 * @returns {String|undefined}
 */
Cookie.prototype.getPath = function () {
  return this._values.path;
};

/**
 * Set the cookie path.
 *
 * @param {String} path
 */
Cookie.prototype.setPath = function (path) {
  type('path', path, 'String');
  this._values.path = path;
  this._validate();
};

/**
 * (Optional) The domain the cookie is visible to.
 *
 * @returns {String|undefined}
 */
Cookie.prototype.getDomain = function () {
  return this._values.domain;
};

/**
 * Set the domain the cookie is visible to.
 *
 * @param {String} domain
 */
Cookie.prototype.setDomain = function (domain) {
  type('domain', domain, 'String');
  this._values.domain = domain;
  this._validate();
};


/**
 * (Optional) Whether the cookie is a secure cookie.
 *
 * @returns {Boolean|undefined}
 */
Cookie.prototype.isSecure = function () {
  return this._values.secure;
};

/**
 * Set whether the cookie is a secure cookie.
 *
 * @param {Boolean} secure
 */
Cookie.prototype.setSecure = function (secure) {
  type('secure', secure, 'Boolean');
  this._values.secure = secure;
  this._validate();
};


/**
 * (Optional) Whether the cookie is an httpOnly cookie.
 *
 * @returns {Boolean|undefined}
 */
Cookie.prototype.isHttpOnly = function () {
  return this._values.httpOnly;
};

/**
 * Set whether the cookie is an httpOnly cookie.
 *
 * @param {Boolean} httpOnly
 */
Cookie.prototype.isHttpOnly = function (httpOnly) {
  type('httpOnly', httpOnly, 'Boolean');
  this._values.httpOnly = httpOnly;
  this._validate();
};


/**
 * (Optional) When the cookie expires, specified in seconds since midnight, January 1, 1970 UTC.
 *
 * @returns {Number|undefined}
 */
Cookie.prototype.getExpiry = function () {
  return this._values.expiry;
};

/**
 * Set when the cookie expires, specified in seconds since midnight, January 1, 1970 UTC.
 *
 * @param {Number} expiry
 */
Cookie.prototype.setExpiry = function (expiry) {
  type('expiry', expiry, 'Number');
  this._values.expiry = expiry;
  this._validate();
};


/**
 * Get cookie data-structure
 *
 * Returns {Object}
 */
Cookie.prototype.toObject = function () {
  return this._values;
};

/**
 * Validate the cookie data
 *
 * @private
 */
Cookie.prototype._validate = function () {

  if (!this._values.name) {
    throw new Error('A cookie "name" is required.');
  }
  if (!this._values.value) {
    throw new Error('a cookie "value" is required.');
  }

  if (!this._values.path) {
    this._values.path = '/';
  }

  // localhost is a special case, the domain must be ""
  if (this._values.domain === 'localhost') this._values.domain = '';
};
