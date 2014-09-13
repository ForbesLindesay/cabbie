// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var url = require('url');

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

var Cookie = require('./cookie');


module.exports = CookieStorage;

/**
 * Managing cookie-storage
 *
 * @constructor
 * @class CookieStorage
 * @module WebDriver
 * @submodule Storage
 * @param {Driver} driver
 */
function CookieStorage (driver) {
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
CookieStorage.prototype._logMethodCall = function (event) {
  event.target = 'CookieStorage';
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
CookieStorage.prototype._requestJSON = function (method, path, body) {
  return this._driver._requestJSON(method, '/cookie' + path, body);
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
CookieStorage.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Retrieve all cookies visible to the current page.
 *
 * @method getCookies
 * @return {Array.<Cookie>}
 */
CookieStorage.prototype.getCookies = function () {
  return when(this._requestJSON('GET', ''), function (cookies) {
    return cookies.map(function (cookie) {
      return new Cookie(cookie);
    });
  });
};

/**
 * Retrieve all cookie names visible to the current page.
 *
 * @method getKeys
 * @return {Array.<String>}
 */
CookieStorage.prototype.getKeys = function () {
  return when(this._requestJSON('GET', ''), function (cookies) {
    return cookies.map(function (cookie) {
      return cookie.name;
    });
  });
};

/**
 * Retrieve a specific cookie by name that is visible to the current page.
 *
 * @method getCookie
 * @param {String} name
 * @return {Cookie|undefined}
 */
CookieStorage.prototype.getCookie = function (name) {
  type('name', name, 'String');

  return when(this.getCookies(), function (cookies) {
    cookies = cookies.filter(function (cookie) {
      return cookie.getName() == name;
    });
    return (cookies.length !== 0) ? cookies[0] : undefined;
  });
};

/**
 * Set a cookie that is visible to the current page.
 *
 * @method setCookie
 * @param {Cookie} cookie
 */
CookieStorage.prototype.setCookie = function (cookie) {
  type('cookie', cookie, 'Object');
  cookie.validate(true);

  if (cookie.getDomain() != null) {
    return this._requestJSON('POST', '', { cookie: cookie.toObject() });
  } else {
    return when(this._driver.browser().activeWindow().navigator().getUrl(), function (base) {
      cookie.setDomain(url.parse(base).hostname);
      return this._requestJSON('POST', '', { cookie: cookie.toObject() });
    }.bind(this));
  }

};

/**
 * Delete the cookie with the given name.
 *
 * @method removeCookie
 * @param {String} name
 */
CookieStorage.prototype.removeCookie = function (name) {
  type('name', name, 'String');
  return this._requestJSON('DELETE', '/' + name);
};

/**
 * Delete all cookies visible to the current page.
 *
 * @method clear
 */
CookieStorage.prototype.clear = function () {
  return this._requestJSON('DELETE', '');
};

/**
 * Get the number of items in the storage
 *
 * @method getSize
 * @return {Number}
 */
CookieStorage.prototype.getSize = function () {
  return when(this.getCookies(), function (cookies) {
    return cookies.length;
  });
};


logMethods(CookieStorage.prototype);
