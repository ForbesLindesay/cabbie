'use strict';

var logMethods = require('./log');
var type = require('./type');
var when = require('./when');

var Mouse = require('./mouse');
var Touch = require('./touch');

module.exports = Element;

/**
 * Object representing a DOM-Element
 *
 * @param {Browser} browser
 * @param {Browser|Element} parent
 * @param {String} selector
 * @param {String} id
 * @constructor
 */
function Element (browser, parent, selector, id) {
  this._browser = browser;
  this._parent = parent;
  this._selector = selector;
  this._id = id;
}


//////////////////
// Enumerations //
//////////////////

Element.SELECTOR_CLASS = 'class name';
Element.SELECTOR_CSS = 'css selector';
Element.SELECTOR_ID = 'id';
Element.SELECTOR_NAME = 'name';
Element.SELECTOR_LINK_TEXT = 'link text';
Element.SELECTOR_PARTIAL_LINK_TEXT = 'partial link text';
Element.SELECTOR_TAG = 'tag name';
Element.SELECTOR_XPATH = 'xpath';


/////////////////////
// Private Methods //
/////////////////////

Element.prototype._logMethodCall = function (event) {
  event.target = 'Element';
  event.selector = this._selector;
  this._parent._logMethodCall(event);
};

Element.prototype._request = function (method, path, body) {
  return this._parent._request(method, '/element/' + this._id.ELEMENT + path, body);
};
Element.prototype._requestJSON = function (method, path, body) {
  return this._parent._requestJSON(method, '/element/' + this._id.ELEMENT + path, body);
};


////////////////////
// Public Methods //
////////////////////

Element.prototype.request = Element.prototype._request;
Element.prototype.requestJSON = Element.prototype._requestJSON;


/**
 * Get the mouse object
 *
 * @returns {Mouse}
 */
Element.prototype.mouse = function () {
  return new Mouse(this._browser, this);
};

/**
 * Get the touch object
 *
 * @returns {Touch}
 */
Element.prototype.touch = function () {
  return new Touch(this._browser, this);
};


/**
 * Get the value of the element id
 *
 * @returns {String}
 */
Element.prototype.getElementId = function () {
  return this._id;
};


/**
 * Get the value of an attribute.
 *
 * @param {String} attribute
 * @return {String}
 */
Element.prototype.getAttribute = function (attribute) {
  type('attribute', attribute, 'String');
  return this._requestJSON('GET', '/attribute/' + attribute);
};

/**
 * Get the value of an attribute.
 *
 * @deprecated Use attribute
 * @param {String} attribute
 * @return {String}
 */
Element.prototype.get = Element.prototype.getAttribute;


/**
 * Get the text body of an element.
 *
 * @return {String}
 */
Element.prototype.getText = function () {
  return this._requestJSON('GET', '/text');
};

/**
 * Get the text body of an element.
 *
 * @deprecated Use getText
 * @return {String}
 */
Element.prototype.text = Element.prototype.getText;


/**
 * Get the name of an element.
 *
 * @return {String}
 */
Element.prototype.getName = function () {
  return this._requestJSON('GET', '/name');
};

/**
 * Query the value of an element's computed CSS property. The CSS property to query
 * should be specified using the CSS property name, not the JavaScript property name
 * (e.g. background-color instead of backgroundColor).
 *
 * @return {String}
 */
Element.prototype.getCssValue = function (property) {
  type('property', property, 'String');
  return this._requestJSON('GET', '/css/' + property);
};


/**
 * Return true if the element is currently displayed on the page
 *
 * @return {Boolean}
 */
Element.prototype.isDisplayed = function () {
  return this._requestJSON('GET', '/displayed');
};

/**
 * Return true if the element is currently visible on the page
 *
 * @deprecated Use isDisplayed
 * @return {Boolean}
 */
Element.prototype.isVisible = Element.prototype.isDisplayed;


/**
 * Return true if the form element is selected
 *
 * @return {Boolean}
 */
Element.prototype.isSelected = function () {
  return this._requestJSON('GET', '/selected');
};

/**
 * Return true if the current element is equal to the supplied element
 *
 * @param {Element} element
 * @return {Boolean}
 */
Element.prototype.isEqual = function (element) {
  type('element', element, 'Object');
  return this._requestJSON('GET', '/equals/' + element.getElementId());
};

/**
 * Return true if the form element is enabled
 *
 * @return {Boolean}
 */
Element.prototype.isEnabled = function () {
  return this._requestJSON('GET', '/enabled');
};


// todo: uploading files ala wd.Element.sendKeys

/**
 * Type a string of characters into an input
 *
 * @param {String|Array.<String>} str
 */
Element.prototype.sendKeys = function (str) {
  type('str', str, 'String|Array.<String>');
  return this._requestJSON('POST', '/value', { value: Array.isArray(str) ? str : [str] });
};

/**
 * Type a string of characters into an input
 *
 * @deprecated Use sendKeys
 * @param {String|Array.<String>} str
 */
Element.prototype.type = Element.prototype.sendKeys;


/**
 * Clear the value of an input
 */
Element.prototype.clear = function () {
  return this._requestJSON('POST', '/clear');
};


/**
 * Click on an element
 *
 * @deprecated Use mouse().click
 */
Element.prototype.click = function () {
  return this.mouse().click();
};


/**
 * Submit a form element
 */
Element.prototype.submit = function () {
  return this._requestJSON('POST', '/submit');
};


/**
 * Get the size of an element
 *
 * @return {Object} `{width: number, height: number}`
 */
Element.prototype.getSize = function () {
  return this._requestJSON('GET', '/size');
};

/**
 * Get the location of an element
 *
 * @return {Object} `{x: number, y: number}`
 */
Element.prototype.getLocation = function () {
  return this._requestJSON('GET', '/location');
};

/**
 * Get the frame of an element
 *
 * @return {Object} `{x: number, y: number, width: number, height: number}`
 */
Element.prototype.getFrame = function () {
  return when(this.getLocation(), function (location) {
    return when(this.getSize(), function (size) {
      return {
        x: location.x,
        y: location.y,
        width: size.width,
        height: size.height
      };
    }.bind(this));
  }.bind(this));
};

/**
 * Get the absolute center of an element
 *
 * @return {Object} `{x: number, y: number}`
 */
Element.prototype.getAbsoluteCenter = function () {
  return when(this.getFrame(), function (rect) {
    return {
      x: Math.floor(rect.width / 2) + rect.x,
      y: Math.floor(rect.height / 2) + rect.y
    };
  }.bind(this));
};

/**
 * Get the relative center of an element
 *
 * @return {Object} `{x: number, y: number}`
 */
Element.prototype.getRelativeCenter = function () {
  return when(this.getSize(), function (size) {
    return {
      x: Math.floor(size.width / 2),
      y: Math.floor(size.height / 2)
    };
  }.bind(this));
};


/**
 * Get an element via a CSS selector,
 * will throw an error if the element
 * does not exist.
 *
 * @param {String} selector
 * @param {String} [selectorType='css selector']
 * @return {Element}
 */
Element.prototype.getElement = function (selector, selectorType) {
  type('selector', selector, 'String');
  type('selectorType', selectorType, 'String?');

  return when(this._requestJSON('POST', '/element', {
    using: selectorType || Element.SELECTOR_CSS,
    value: selector
  }), function (element) {
    return new Element(this._browser, this, [this._selector, selector].join(' '), element);
  }.bind(this));
};

/**
 * Get elements via a CSS selector.
 *
 * @param {String} selector
 * @param {String} [selectorType='css selector']
 * @return {Array.<Element>}
 */
Element.prototype.getElements = function (selector, selectorType) {
  type('selector', selector, 'String');
  type('selectorType', selectorType, 'String?');

  return when(this._requestJSON('POST', '/elements', {
    using: selectorType || Element.SELECTOR_CSS,
    value: selector
  }), function (elements) {
    return elements.map(function (element) {
      return new Element(this._browser, this, [this._selector, selector].join(' '), element);
    }.bind(this));
  }.bind(this));
};


logMethods(Element.prototype);