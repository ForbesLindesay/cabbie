import type { SelectorType } from './enums/selector-types';
import SelectorTypes from './enums/selector-types';
import Window from './window';
/**
 * Active window object
 */
class ActiveWindow extends Window {

  /**
   * Execute a script on the browser and return the result.
   *
   * Source should be either a function body as a string or a function.
   * Keep in mind that if it is a function it will not have access to
   * any variables from the node.js process.
   */
  execute(script: string | Function, args: Array<any> = []): any {
    return this.driver.requestJSON('POST', '/execute', { script: codeToString(script), args });
  }

  /**
   * Execute a script asynchronously on the browser.
   *
   * Source should be either a function body as a string or a function.
   * Keep in mind that if it is a function it will not have access to
   * any variables from the node.js process.
   */
  asyncExecute(script: string | Function, args: Array<any> = []): void {
    this.driver.requestJSON('POST', '/execute_async', { script: codeToString(script), args });
  }

  /**
   * Type a string of characters into the browser
   *
   * Note: Modifier keys is kept between calls, so mouse interactions can be performed
   * while modifier keys are depressed.
   */
  sendKeys(str: string | Array<string>): void {
    this.driver.requestJSON('POST', '/keys', { value: Array.isArray(str) ? str : [str] });
  }

  /**
   * Take a screenshot of the current page
   *
   * This returns the result as a buffer containing the binary image data
   */
  takeScreenshot(): Buffer {
    const base64data = this.driver.requestJSON('GET', '/screenshot');
    return new Buffer(base64Data, 'base64');
  }

  /**
   * Get the element on the page that currently has focus
   */
  getActiveElement(): Element {
    const elementHandle = this.driver.requestJSON('POST', '/element/active');
    return new Element(this.driver, this.driver.browser, '<active>', elementHandle);
  }

  /**
   * Get an element via a selector.
   * Will throw an error if the element does not exist.
   */
  getElement(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Element {
    const elementHandle = this.driver.requestJSON('POST', '/element', {
      using: selectorType,
      value: selector
    });
    return new Element(this.driver, this.driver.browser, selector, elementHandle);
  }

  /**
   * Get elements via a selector.
   */
  getElements(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Array<Element> {
    const elementHandles = this.driver.requestJSON('POST', '/elements', {
      using: selectorType,
      value: selector
    });
    return elementHandles.map(elementHandle => {
      return new Element(this.driver, this.driver.browser, selector, elementHandle);
    });
  }

  /**
   * Does a specific element exist?
   */
  hasElement(selector: string, selectorType: SelectorType = SelectorTypes.CSS): boolean {
    const elements = this.getElements(selector, selectorType);
    return elements.length > 0;
  }

  /**
   * Close the current window
   */
  close(): void {
    this.driver.requestJSON('DELETE', '/window');
  }

  /**
   * Get the current page title
   */
  getTitle(): string {
    return this.driver.requestJSON('GET', '/title');
  }

  /**
   * Get the current page source
   */
  getSource(): string {
    return this.driver.requestJSON('GET', '/source');
  }

  /**
   * The global-touch object.
   */
  get touch(): GlobalTouch {
    return new GlobalTouch(this.driver);
  }

  /**
   * Get the global-mouse object.
   */
  get mouse(): GlobalMouse {
    return new GlobalMouse(this.driver);
  }

  /**
   * Get the Navigator object.
   */
  get navigator(): Navigator {
    return new Navigator(this.driver);
  }

  /**
   * Get the Frame object.
   */
  get frame(): Frame {
    return new Frame(this.driver);
  }

  /**
   * Get the Alert object.
   */
  get alert(): Alert {
    return new Alert(this.driver);
  }
}
/**
 * Convert code to string before execution
 */
function codeToString(code: string | Function): string {
  if (typeof code === 'function') {
    code = 'return (' + code + ').apply(null, arguments);';
  }
  return code;
}