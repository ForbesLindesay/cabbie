'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = Element;
function Element(selector, id, parent) {
  this._selector = selector;
  this._id = id;
  this._parent = parent;
}

Element.prototype._logMethodCall = function (event) {
  event.target = 'Element';
  event.selector = this._selector;
  this._parent._logMethodCall(event);
};

Element.prototype._request = function (method, path, body) {
  return this._parent._request(method,
                              '/element/' + this._id.ELEMENT + path,
                              body);
};
Element.prototype._requestJSON = function (method, path, body) {
  return this._parent._requestJSON(method,
                                  '/element/' + this._id.ELEMENT + path,
                                  body);
};


Element.prototype.request = Element.prototype._request;
Element.prototype.requestJSON = Element.prototype._requestJSON;

/**
 * Get the value of an attribute.
 *
 * @param {String} attribute
 * @return {String}
 */
Element.prototype.get = function (attribute) {
  type('attribute', attribute, 'String');
  if (attribute === 'value') {
    return this._requestJSON('GET', '/' + attribute);
  }
  return this._requestJSON('GET', '/attribute/' + attribute);
};
/**
 * Get the text body of an element.
 *
 * @return {String}
 */
Element.prototype.text = function () {
    return this._requestJSON('GET', '/text');
};

/**
 * Return true if the element is currently visible on the page
 *
 * @return {Boolean}
 */
Element.prototype.isVisible = function () {
  return this._requestJSON('GET', '/displayed');
};

// todo: uploading files ala wd.Element.sendKeys

/**
 * Type a string of characters into an input
 *
 * @param {String|Array.<String>} str
 */
Element.prototype.type = function (str) {
  type('str', str, 'String|Array.<String>');
  return this._requestJSON('POST', '/value', {value: str});
};

/**
 * Clear the value of an input
 */
Element.prototype.clear = function () {
  return this._requestJSON('POST', '/clear');
};

/**
 * Click on an element
 */
Element.prototype.click = function () {
  return this._requestJSON('POST', '/click');
};

/**
 * Get the size of an element
 *
 * @return {Object} `{width: number, height: number}`
 */
Element.prototype.getSize = function () {
  return this._requestJSON('GET', '/size');
};


logMethods(Element.prototype);