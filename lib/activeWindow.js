// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var util = require('util');

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

var Element = require('./element');
var GlobalTouch = require('./globalTouch');
var GlobalMouse = require('./globalMouse');
var Alert = require('./alert');
var Navigator = require('./navigator');
var Frame = require('./frame');
var WindowHandler = require('./window');

module.exports = ActiveWindow;

/**
 * Active window object
 *
 * @constructor
 * @class ActiveWindow
 * @module WebDriver
 * @uses WindowHandler
 * @extends WindowHandler
 * @submodule Navigation
 * @param {Driver} driver
 * @param {string} id
 */
function ActiveWindow (driver, id) {
  this._driver = driver;
  this._id = id;
}
util.inherits(ActiveWindow, WindowHandler);


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
ActiveWindow.prototype._logMethodCall = function (event) {
  event.target = 'ActiveWindow';
  this._driver._logMethodCall(event);
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
ActiveWindow.prototype.getDriver = function () {
  return this._driver;
};


/**
 * Execute a script on the browser and return the result.
 *
 * Source should be either a function body as a string or a function.
 * Keep in mind that if it is a function it will not have access to
 * any variables from the node.js process.
 *
 * @method execute
 * @param {String|Function} script
 * @param {Array} [args]
 * @return {*}
 */
ActiveWindow.prototype.execute = function (script, args) {
  type('script', script, 'Function|String');
  type('args', args, 'Array.<Any>?');
  return this._driver._requestJSON('POST', '/execute', { script: codeToString(script), args: args || [] });
};

/**
 * Execute a script asynchronously on the browser.
 *
 * Source should be either a function body as a string or a function.
 * Keep in mind that if it is a function it will not have access to
 * any variables from the node.js process.
 *
 * @method asyncExecute
 * @param {String|Function} script
 * @param {Array} [args]
 */
ActiveWindow.prototype.asyncExecute = function (script, args) {
  type('script', script, 'Function|String');
  type('args', args, 'Array.<Any>?');
  return this._driver._requestJSON('POST', '/execute_async', { script: codeToString(script), args: args || [] });
};


/**
 * Type a string of characters into the browser
 *
 * Note: Modifier keys is kept between calls, so mouse interactions can be performed
 * while modifier keys are depressed.
 *
 * @method sendKeys
 * @param {String|Array.<String>} str
 */
ActiveWindow.prototype.sendKeys = function (str) {
  type('str', str, 'String|Array.<String>');
  return this._driver._requestJSON('POST', '/keys', { value: Array.isArray(str) ? str : [str] });
};

/**
 * Take a screenshot of the current page
 *
 * @method takeScreenshot
 * @return {Buffer} Binary image buffer
 */
ActiveWindow.prototype.takeScreenshot = function () {
  return when(this._driver._requestJSON('GET', '/screenshot'), function (base64Data) {
    return new Buffer(base64Data, 'base64');
  });
};


/**
 * Get the element on the page that currently has focus
 *
 * @method getActiveElement
 * @return {Element}
 */
ActiveWindow.prototype.getActiveElement = function () {
  return when(this._driver._requestJSON('POST', '/element/active'), function (element) {
    return new Element(this._driver, this._driver.browser(), '<active>', element);
  }.bind(this));
};

/**
 * Get an element via a selector.
 * Will throw an error if the element does not exist.
 *
 * @method getElement
 * @param {String} selector
 * @param {String} [selectorType='css selector']
 * @return {Element}
 */
ActiveWindow.prototype.getElement = function (selector, selectorType) {
  type('selector', selector, 'String');
  type('selectorType', selectorType, 'String?');

  return when(this._driver._requestJSON('POST', '/element', {
    using: selectorType || Element.SELECTOR_CSS,
    value: selector
  }), function (element) {
    return new Element(this._driver, this._driver.browser(), selector, element);
  }.bind(this));
};

/**
 * Get elements via a selector.
 *
 * @method getElements
 * @param {String} selector
 * @param {String} [selectorType='css selector']
 * @return {Array.<Element>}
 */
ActiveWindow.prototype.getElements = function (selector, selectorType) {
  type('selector', selector, 'String');
  type('selectorType', selectorType, 'String?');

  return when(this._driver._requestJSON('POST', '/elements', {
    using: selectorType || Element.SELECTOR_CSS,
    value: selector
  }), function (elements) {
    return elements.map(function (element) {
      return new Element(this._driver, this._driver.browser(), selector, element);
    }.bind(this));
  }.bind(this));
};

/**
 * Does a specific element exist?
 *
 * @method hasElement
 * @param {String} selector
 * @param {String} [selectorType='css selector']
 * @return {boolean}
 */
ActiveWindow.prototype.hasElement = function (selector, selectorType) {
  return when(this.getElements(selector, selectorType), function (elements) {
    return (elements.length > 0);
  });
};


/**
 * Close the current window
 *
 * @method close
 */
ActiveWindow.prototype.close = function () {
  return this._driver._requestJSON('DELETE', '/window');
};


/**
 * Get the current page title
 *
 * @method getTitle
 * @return {String}
 */
ActiveWindow.prototype.getTitle = function () {
  return this._driver._requestJSON('GET', '/title');
};

/**
 * Get the current page source
 *
 * @method getSource
 * @return {String}
 */
ActiveWindow.prototype.getSource = function () {
  return this._driver._requestJSON('GET', '/source');
};


/**
 * Get the global-touch object.
 * Direct-access. No need to wait.
 *
 * @method touch
 * @return {GlobalTouch}
 */
ActiveWindow.prototype.touch = function () {
  return new GlobalTouch(this._driver);
};

/**
 * Get the global-mouse object.
 * Direct-access. No need to wait.
 *
 * @method mouse
 * @return {GlobalMouse}
 */
ActiveWindow.prototype.mouse = function () {
  return new GlobalMouse(this._driver);
};

/**
 * Get the Navigator object.
 * Direct-access. No need to wait.
 *
 * @method navigator
 * @return {Navigator}
 */
ActiveWindow.prototype.navigator = function () {
  return new Navigator(this._driver);
};

/**
 * Get the Frame object.
 * Direct-access. No need to wait.
 *
 * @method frame
 * @return {Frame}
 */
ActiveWindow.prototype.frame = function () {
  return new Frame(this._driver);
};

/**
 * Get the Alert object.
 * Direct-access. No need to wait.
 *
 * @method alert
 * @return {Alert}
 */
ActiveWindow.prototype.alert = function () {
  return new Alert(this._driver);
};


logMethods(ActiveWindow.prototype);


///////////////
// Utilities //
///////////////

/**
 * Convert code to string before execution
 *
 * @param {String|Function} code
 * @return {String}
 */
function codeToString (code) {
  if (typeof code === 'function') {
    code = 'return (' + code + ').apply(null, arguments);';
  }
  return code;
}

