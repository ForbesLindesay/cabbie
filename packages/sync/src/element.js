import type { SelectorType } from './enums/selector-types';
import BaseClass from './base-class';
import SelectorTypes from './enums/selector-types';

class Element extends BaseClass {
  /**
   * The internal selenium handler object
   */
  elementHandle: ElementHandle;

  constructor(driver: Driver, parent: Element | Browser, selector: string, id: ElementHandle) {
    const prefix = '/element/' + id.ELEMENT;
    super(driver, prefix);
    this._parent = parent;
    this._selector = selector;
    this.elementHandle = id;
  }

  get mouse(): Mouse {
    return new Mouse(this.driver, this);
  }

  get touch(): Touch {
    return new Touch(this.driver, this);
  }

  /**
   * The selenium id of the element
   */
  get elementID(): string {
    return this.elementHandle.ELEMENT;
  }

  /**
   * Get the value of an attribute.
   */
  getAttribute(attribute: string): string {
    return this.requestJSON('GET', '/attribute/' + attribute);
  }

  /**
   * Test if the element have a specific class
   */
  hasClass(className: string): boolean {
    const classNames = this.getAttribute('class');
    return !!classNames.match(new RegExp('\\b' + classStr + '\\b'));
  }

  /**
   * Get the text body of an element.
   */
  getText(): string {
    return this.requestJSON('GET', '/text');
  }

  /**
   * Get the tag-name of an element.
   */
  getTagName(): string {
    return this.requestJSON('GET', '/name');
  }

  /**
   * Query the value of an element's computed CSS property. The CSS property to query
   * should be specified using the CSS property name, not the JavaScript property name
   * (e.g. background-color instead of backgroundColor).
   */
  getCssValue(property: string): string {
    return this.requestJSON('GET', '/css/' + property);
  }

  /**
   * Return true if the element is currently displayed on the page
   */
  isDisplayed(): boolean {
    return this.requestJSON('GET', '/displayed');
  }

  /**
   * Return true if the form element is selected
   */
  isSelected(): boolean {
    return this.requestJSON('GET', '/selected');
  }

  /**
   * Return true if the current element is equal to the supplied element
   */
  isEqual(element: Element): boolean {
    return this.requestJSON('GET', '/equals/' + element.elementID);
  }

  /**
   * Return true if the form element is enabled
   */
  isEnabled(): boolean {
    return this.requestJSON('GET', '/enabled');
  }

  /**
   * Return true if the form element is disabled
   */
  isDisabled(): boolean {
    const isEnabled = this.isEnabled();
    return !isEnabled;
  }

  // todo: uploading files ala wd.Element.sendKeys

  /**
   * Type a string of characters into an input
   */
  sendKeys(str: string | Array<string>): void {
    this.requestJSON('POST', '/value', { value: Array.isArray(str) ? str : [str] });
  }

  /**
   * Clear the value of an input
   */
  clear(): void {
    this.requestJSON('POST', '/clear');
  }

  /**
   * Submit a form element
   */
  submit(): void {
    this.requestJSON('POST', '/submit');
  }

  /**
   * Get the size of an element
   */
  getSize(): { width: number; height: number; } {
    return this.requestJSON('GET', '/size');
  }

  /**
   * Get the position of an element
   */
  getPosition(): { x: number; y: number; } {
    return this.requestJSON('GET', '/location');
  }

  /**
   * Get the frame of an element
   */
  getFrame(): { x: number; y: number; width: number; height: number; } {
    const [position, size] = Promise.all([this.getPosition(), this.getSize()]);
    return {
      x: position.x,
      y: position.y,
      width: size.width,
      height: size.height
    };
  }

  /**
   * Get the absolute center of an element
   */
  getAbsoluteCenter(): { x: number; y: number; } {
    const frame = this.getFrame();
    return {
      x: Math.floor(frame.width / 2) + frame.x,
      y: Math.floor(frame.height / 2) + frame.y
    };
  }

  /**
   * Get the relative center of an element
   */
  getRelativeCenter(): { x: number; y: number; } {
    const size = this.getSize();
    return {
      x: Math.floor(size.width / 2),
      y: Math.floor(size.height / 2)
    };
  }

  /**
   * Get an element via a selector.
   * Will throw an error if the element does not exist.
   */
  getElement(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Element {
    const elementHandle = this.requestJSON('POST', '/element', {
      using: selectorType,
      value: selector
    });
    return new Element(this._driver, this, [this._selector, selector].join(' '), elementHandle);
  }

  /**
   * Get elements via a selector.
   *
   * @method getElements
   * @param {String} selector
   * @param {String} [selectorType='css selector']
   * @return {Array.<Element>}
   */
  getElements(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Array<Element> {
    const elementHandles = this.requestJSON('POST', '/elements', {
      using: selectorType || Element.SELECTOR_CSS,
      value: selector
    });
    return elementHandles.map(elementHandle => {
      return new Element(this._driver, this, [this._selector, selector].join(' '), elementHandle);
    });
  }

  /**
   * Does a specific element exist?
   */
  hasElement(selector, selectorType): boolean {
    const elements = this.getElements(selector, selectorType);
    return elements.length > 0;
  }
}