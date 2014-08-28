'use strict';

var url = require('url');

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

var Cookie = require('./cookie');


module.exports = CookieStorage;

/**
 * Managing session-storage
 *
 * @param {Browser} browser
 * @constructor
 */
function CookieStorage (browser) {
  this._browser = browser;
}


/////////////////////
// Private Methods //
/////////////////////

CookieStorage.prototype._logMethodCall = function (event) {
  event.target = 'CookieStorage';
  this._browser._logMethodCall(event);
};

CookieStorage.prototype._request = function (method, path, body) {
  return this._browser._request(method, '/cookie' + path, body);
};
CookieStorage.prototype._requestJSON = function (method, path, body) {
  return this._browser._requestJSON(method, '/cookie' + path, body);
};


////////////////////
// Public Methods //
////////////////////

CookieStorage.prototype.request = CookieStorage.prototype._request;
CookieStorage.prototype.requestJSON = CookieStorage.prototype._requestJSON;


/**
 * Retrieve all cookies visible to the current page.
 *
 * @return {Array.<Cookie>}
 */
CookieStorage.prototype.getCookies = function () {
  return when(this._requestJSON('GET', ''), function (cookies) {
    return cookies.map(function (cookie) {
      return new Cookie(cookie);
    }.bind(this));
  }.bind(this));
};

/**
 * Retrieve a specific cookie by name that is visible to the current page.
 *
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
 * @param {Cookie} cookie
 */
CookieStorage.prototype.setCookie = function (cookie) {
  type('cookie', cookie, 'Object');

  if (cookie.getDomain() != null) {
    return this._requestJSON('POST', '', { cookie: cookie.toObject() });
  } else {
    return when(this._browser.getUrl(), function (base) {
      cookie.setDomain(url.parse(base).hostname);
      return this._requestJSON('POST', '', { cookie: cookie.toObject() });
    }.bind(this));
  }

};

/**
 * Delete the cookie with the given name.
 *
 * @param {String} name
 */
CookieStorage.prototype.removeCookie = function (name) {
  type('name', name, 'String');
  return this._requestJSON('DELETE', '/' + name);
};

/**
 * Delete all cookies visible to the current page.
 */
CookieStorage.prototype.clear = function () {
  return this._requestJSON('DELETE', '');
};

/**
 * Get the number of items in the storage
 *
 * @return {Number}
 */
CookieStorage.prototype.getSize = function () {
  return when(this.getCookies(), function (cookies) {
    return cookies.length;
  });
};


logMethods(CookieStorage.prototype);
