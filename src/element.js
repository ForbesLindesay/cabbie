import {inspect} from 'util';
import type Driver from './driver';
import type {ElementHandle} from './flow-types/element-handle';
import type {SelectorType} from './enums/selector-types';
import addDebugging from './add-debugging';
import BaseClass from './base-class';
import Mouse from './mouse';
import SelectorTypes from './enums/selector-types';
import Touch from './touch';
import waitFor from './utils/wait-for';

/*
 * A representation of a remote element.  You can use it to click on, type text into and check the attributes of.
 *
 * ```js
 * const element = await driver.activeWindow.getElement('[data-test-id="my-test-element"]');
 *
 * const elements = await driver.activeWindow.getElements('.some-class-name');
 * ```
 */
class Element extends BaseClass {
  _parent: Element | Driver;
  _selector: string;

  /*
   * The selenium id of the element
   */
  elementID: string;
  /*
   * Utility methods for clicking on the element
   */
  mouse: Mouse;
  /*
   * Methods for interacting with the element via touch
   */
  touch: Touch;
  constructor(driver: Driver, parent: Element | Driver, selector: string, elementHandle: ElementHandle) {
    const prefix = '/element/' + elementHandle.ELEMENT;
    super(driver, prefix);
    this._parent = parent;
    this._selector = selector;

    this.elementID = elementHandle.ELEMENT;
    this.mouse = new Mouse(this.driver, this);
    this.touch = new Touch(this.driver, this);
  }

  /*
   * Get the value of an attribute.
   */
  async getAttribute(attribute: string): Promise<string> {
    return await this.requestJSON('GET', '/attribute/' + attribute);
  }

  /*
   * Test if the element have a specific class
   */
  async hasClass(className: string): Promise<boolean> {
    const classNames = await this.getAttribute('class');
    return !!classNames.match(new RegExp('\\b' + className + '\\b'));
  }

  /*
   * Get the text body of an element.
   */
  async getText(): Promise<string> {
    return await this.requestJSON('GET', '/text');
  }

  /*
   * Get the tag-name of an element.
   */
  async getTagName(): Promise<string> {
    return await this.requestJSON('GET', '/name');
  }

  /*
   * Query the value of an element's computed CSS property. The CSS property to query
   * should be specified using the CSS property name, not the JavaScript property name
   * (e.g. background-color instead of backgroundColor).
   */
  async getCssValue(property: string): Promise<string> {
    return await this.requestJSON('GET', '/css/' + property);
  }

  /*
   * Return true if the element is currently displayed on the page
   */
  async isDisplayed(): Promise<boolean> {
    return await this.requestJSON('GET', '/displayed');
  }

  /*
   * Return true if the form element is selected
   */
  async isSelected(): Promise<boolean> {
    return await this.requestJSON('GET', '/selected');
  }

  /*
   * Return true if the current element is equal to the supplied element
   */
  async isEqual(element: Element): Promise<boolean> {
    return await this.requestJSON('GET', '/equals/' + element.elementID);
  }

  /*
   * Return true if the form element is enabled
   */
  async isEnabled(): Promise<boolean> {
    return await this.requestJSON('GET', '/enabled');
  }

  /*
   * Return true if the form element is disabled
   */
  async isDisabled(): Promise<boolean> {
    const isEnabled = await this.isEnabled();
    return !isEnabled;
  }

  // todo: uploading files ala wd.Element.sendKeys
  /*
   * Type a string of characters into an input
   */
  async sendKeys(str: string | Array<string>): Promise<void> {
    await this.requestJSON('POST', '/value', {value: Array.isArray(str) ? str : [str]});
  }

  /*
   * Clear the value of an input
   */
  async clear(): Promise<void> {
    await this.requestJSON('POST', '/clear');
  }

  /*
   * Submit a form element
   */
  async submit(): Promise<void> {
    await this.requestJSON('POST', '/submit');
  }

  /*
   * Get the size of an element
   */
  async getSize(): Promise<{width: number, height: number}> {
    const size = await this.requestJSON('GET', '/size');
    return {width: size.width, height: size.height};
  }

  /*
   * Get the position of an element
   */
  async getPosition(): Promise<{x: number, y: number}> {
    const position = await this.requestJSON('GET', '/location');
    return {x: position.x, y: position.y};
  }

  /*
   * Get the frame of an element
   */
  async getFrame(): Promise<{x: number, y: number, width: number, height: number}> {
    const position = await this.getPosition();
    const size = await this.getSize();
    return {x: position.x, y: position.y, width: size.width, height: size.height};
  }

  /*
   * Get the absolute center of an element
   */
  async getAbsoluteCenter(): Promise<{x: number, y: number}> {
    const frame = await this.getFrame();
    return {x: Math.floor(frame.width / 2) + frame.x, y: Math.floor(frame.height / 2) + frame.y};
  }

  /*
   * Get the relative center of an element
   */
  async getRelativeCenter(): Promise<{x: number, y: number}> {
    const size = await this.getSize();
    return {x: Math.floor(size.width / 2), y: Math.floor(size.height / 2)};
  }

  /*
   * Get an element via a selector.
   * Will throw an error if the element does not exist.
   */
  async getElement(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Promise<Element> {
    const elementHandle = await waitFor(() =>
      this.requestJSON('POST', '/element', {using: selectorType, value: selector}));
    return new Element(this.driver, this, [this._selector, selector].join(' '), elementHandle);
  }

  /*
   * Get an element via a selector.
   * Will return null if the element does not exist
   */
  async tryGetElement(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Promise<Element | null> {
    try {
      const elementHandle = await this.requestJSON('POST', '/element', {using: selectorType, value: selector});
      return new Element(this.driver, this, [this._selector, selector].join(' '), elementHandle);
    } catch (ex) {
      if (ex.code === 'NoSuchElement' || ex.code === 'ElementNotVisible' || ex.code === 'ElementIsNotSelectable') {
        return null;
      }
      throw ex;
    }
  }

  /*
   * Get elements via a selector.
   */
  async getElements(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Promise<Array<Element>> {
    const elementHandles = await this.requestJSON('POST', '/elements', {using: selectorType, value: selector});
    return elementHandles.map(elementHandle => {
      return new Element(this.driver, this, [this._selector, selector].join(' '), elementHandle);
    });
  }

  /*
   * Get elements by its text content, optionally narrowed down using a selector.
   *
   * N.B. this is **much** slower than getting elements by ID or css selector.
   */
  async getElementsByTextContent(
    textContent: string,
    selector: string = '*',
    selectorType: SelectorType = SelectorTypes.CSS,
  ): Promise<Array<Element>> {
    if (selector === 'a' && (selectorType === SelectorTypes.CSS || selectorType === SelectorTypes.TAG)) {
      selector = textContent;
      selectorType = SelectorTypes.PARTIAL_LINK_TEXT;
    }
    textContent = textContent.trim();
    const elements = await this.getElements(selector, selectorType);
    const elementsToReturn = [];
    for (let i = 0; i < elements.length; i++) {
      if (textContent === (await elements[i].getText()).trim()) {
        elementsToReturn.push(elements[i]);
      }
    }
    return elementsToReturn;
  }

  /*
   * Get elements by its text content, optionally narrowed down using a selector.
   *
   * N.B. this is **much** slower than getting elements by ID or css selector.
   */
  async getElementByTextContent(
    textContent: string,
    selector: string = '*',
    selectorType: SelectorType = SelectorTypes.CSS,
  ): Promise<Element> {
    const element = await waitFor(() => this.tryGetElementByTextContent(textContent, selector, selectorType));
    if (element) {
      return element;
    }
    const err = new Error('Could not find an element with the text content: ' + textContent);
    err.name = 'NoSuchElement';
    (err: any).code = 'NoSuchElement';
    throw err;
  }

  /*
   * Get elements by its text content, optionally narrowed down using a selector.
   *
   * N.B. this is **much** slower than getting elements by ID or css selector.
   */
  async tryGetElementByTextContent(
    textContent: string,
    selector: string = '*',
    selectorType: SelectorType = SelectorTypes.CSS,
  ): Promise<Element | null> {
    if (selector === 'a' && (selectorType === SelectorTypes.CSS || selectorType === SelectorTypes.TAG)) {
      selector = textContent;
      selectorType = SelectorTypes.PARTIAL_LINK_TEXT;
    }
    textContent = textContent.trim().toLowerCase();
    const elements = await this.getElements(selector, selectorType);
    for (let i = 0; i < elements.length; i++) {
      if (textContent === (await elements[i].getText()).trim().toLowerCase()) {
        return elements[i];
      }
    }
    return null;
  }

  /*
   * Does a specific element exist?
   */
  async hasElement(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Promise<boolean> {
    const elements = await this.getElements(selector, selectorType);
    return elements.length > 0;
  }

  /*
   * @private
   */
  [inspect.custom || 'inspect'](depth: number, options: Object) {
    return 'Element(' + inspect(this._selector, options) + ')';
  }
}
addDebugging(Element);
export default Element;
