import SelectorType from './enums/selector-types';
import Driver from './driver';
import {Options} from './flow-types/options';
import depd from 'depd';
import {resolve} from 'url';
import Alert from './alert';
import addDebugging from './add-debugging';
import Element from './element';
import Frame from './frame';
import GlobalMouse from './global-mouse';
import GlobalTouch from './global-touch';
import Navigator from './navigator';
import BaseWindow from './base-window';
import WindowHandle from './window-handle';
import waitFor from './utils/wait-for';

const deprecate = depd('cabbie');

/**
 * This is an object representing the currently active window.  You can access the navigation for that window,
 * touch and mouse objects for interacting via screen coordinates, and (most imporatantly) getElement and getElements.
 */
class ActiveWindow extends BaseWindow {
  /**
   * The global-touch object.
   */
  touch: GlobalTouch;

  /**
   * Get the global-mouse object.
   */
  mouse: GlobalMouse;

  /**
   * Get the Navigator object.
   *
   * @private
   */
  navigator: Navigator;

  /**
   * Get the Frame object.
   */
  frame: Frame;

  /**
   * Get the Alert object.
   */
  alert: Alert;

  _options: Options;

  constructor(driver: Driver, options: Options) {
    super(driver, 'current');

    this.touch = new GlobalTouch(this.driver);
    this.mouse = new GlobalMouse(this.driver);
    this.navigator = new Navigator(this.driver, options);
    this.frame = new Frame(this.driver);
    this.alert = new Alert(this.driver);

    this._options = options;

    deprecate.property(
      this,
      'navigator',
      'All properties of navigator are now directly available on the ActiveWindow object',
    );
  }

  /**
   * Get a handle for the current window
   */
  async getWindowHandle(): Promise<WindowHandle> {
    const windowHandle = await this.driver.requestJSON('GET', '/window_handle');
    return new WindowHandle(this.driver, windowHandle);
  }

  /**
   * Execute a script on the browser and return the result.
   *
   * Source should be either a function body as a string or a function.
   * Keep in mind that if it is a function it will not have access to
   * any variables from the node.js process.
   */
  async execute(script: string | Function, args: Array<any> = []): Promise<any> {
    return this.driver.requestJSON('POST', '/execute', {script: codeToString(script), args});
  }

  /**
   * Execute a script asynchronously on the browser.
   *
   * Source should be either a function body as a string or a function.
   * Keep in mind that if it is a function it will not have access to
   * any variables from the node.js process.
   */
  async asyncExecute(script: string | Function, args: Array<any> = []): Promise<void> {
    await this.driver.requestJSON('POST', '/execute_async', {script: codeToString(script), args});
  }

  /**
   * Type a string of characters into the browser
   *
   * Note: Modifier keys is kept between calls, so mouse interactions can be performed
   * while modifier keys are depressed.
   */
  async sendKeys(str: string | Array<string>): Promise<void> {
    await this.driver.requestJSON('POST', '/keys', {value: Array.isArray(str) ? str : [str]});
  }

  /**
   * Take a screenshot of the current page
   *
   * This returns the result as a buffer containing the binary image data
   */
  async takeScreenshot(): Promise<Buffer> {
    const base64data = await this.driver.requestJSON('GET', '/screenshot');
    return Buffer.from ? Buffer.from(base64data, 'base64') : new Buffer(base64data, 'base64');
  }

  /**
   * Get the element on the page that currently has focus
   */
  async getActiveElement(): Promise<Element> {
    const elementHandle = await this.driver.requestJSON('POST', '/element/active');
    return new Element(this.driver, this.driver, '<active>', elementHandle);
  }

  /**
   * Get an element via a selector.
   * Will throw an error if the element does not exist.
   */
  async getElement(selector: string, selectorType: SelectorType = SelectorType.CSS): Promise<Element> {
    const elementHandle = await waitFor(() =>
      this.driver.requestJSON('POST', '/element', {using: selectorType, value: selector}));
    return new Element(this.driver, this.driver, selector, elementHandle);
  }

  /**
   * Get an element via a selector.
   * Will return null if the element does not exist
   */
  async tryGetElement(selector: string, selectorType: SelectorType = SelectorType.CSS): Promise<Element | null> {
    try {
      const elementHandle = await this.driver.requestJSON('POST', '/element', {using: selectorType, value: selector});
      return new Element(this.driver, this.driver, selector, elementHandle);
    } catch (ex) {
      if ((ex as any).code === 'NoSuchElement' || (ex as any).code === 'ElementNotVisible' || (ex as any).code === 'ElementIsNotSelectable') {
        return null;
      }
      throw ex;
    }
  }

  /**
   * Get elements via a selector.
   */
  async getElements(selector: string, selectorType: SelectorType = SelectorType.CSS): Promise<Array<Element>> {
    const elementHandles = await this.driver.requestJSON('POST', '/elements', {using: selectorType, value: selector});
    return elementHandles.map(elementHandle => {
      return new Element(this.driver, this.driver, selector, elementHandle);
    });
  }

  /**
   * Get elements by its text content, optionally narrowed down using a selector.
   *
   * N.B. this is **much** slower than getting elements by ID or css selector.
   */
  async getElementsByTextContent(
    textContent: string,
    selector: string = '*',
    selectorType: SelectorType = SelectorType.CSS,
  ): Promise<Array<Element>> {
    if (selector === 'a' && (selectorType === SelectorType.CSS || selectorType === SelectorType.TAG)) {
      selector = textContent;
      selectorType = SelectorType.PARTIAL_LINK_TEXT;
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

  /**
   * Get elements by its text content, optionally narrowed down using a selector.
   *
   * N.B. this is **much** slower than getting elements by ID or css selector.
   */
  async getElementByTextContent(
    textContent: string,
    selector: string = '*',
    selectorType: SelectorType = SelectorType.CSS,
  ): Promise<Element> {
    const element = await waitFor(() => this.tryGetElementByTextContent(textContent, selector, selectorType));
    if (element) {
      return element;
    }
    const err = new Error('Could not find an element with the text content: ' + textContent);
    err.name = 'NoSuchElement';
    (err as any).code = 'NoSuchElement';
    throw err;
  }

  /**
   * Get elements by its text content, optionally narrowed down using a selector.
   *
   * N.B. this is **much** slower than getting elements by ID or css selector.
   */
  async tryGetElementByTextContent(
    textContent: string,
    selector: string = '*',
    selectorType: SelectorType = SelectorType.CSS,
  ): Promise<Element | null> {
    if (selector === 'a' && (selectorType === SelectorType.CSS || selectorType === SelectorType.TAG)) {
      selector = textContent;
      selectorType = SelectorType.PARTIAL_LINK_TEXT;
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

  /**
   * Does a specific element exist?
   */
  async hasElement(selector: string, selectorType: SelectorType = SelectorType.CSS): Promise<boolean> {
    const elements = await this.getElements(selector, selectorType);
    return elements.length > 0;
  }

  /**
   * Close the current window
   */
  async close(): Promise<void> {
    await this.driver.requestJSON('DELETE', '/window');
  }

  /**
   * Get the current page title
   */
  async getTitle(): Promise<string> {
    return await this.driver.requestJSON('GET', '/title');
  }

  /**
   * Get the current page source
   */
  async getSource(): Promise<string> {
    return await this.driver.requestJSON('GET', '/source');
  }

  /**
   * Navigate forwards in the browser history, if possible.
   */
  async goForward(): Promise<void> {
    await this.driver.requestJSON('POST', '/forward');
  }

  /**
   * Navigate backwards in the browser history, if possible.
   */
  async goBackward(): Promise<void> {
    await this.driver.requestJSON('POST', '/back');
  }

  /**
   * Refreshes the browser
   */
  async refresh(): Promise<void> {
    await this.driver.requestJSON('POST', '/refresh');
  }

  /**
   * Get the current url that the browser is displaying
   */
  async getUrl(): Promise<string> {
    return await this.driver.requestJSON('GET', '/url');
  }

  /**
   * Navigates the browser to the specified path
   *
   *  - if `path` begins with a "/" it is relative to `options.base`
   *  - if `path` begins with "http" it is absolute
   *  - otherwise it is relative to the current path
   */
  async navigateTo(path: string): Promise<void> {
    if (path[0] === '/') {
      const base = this._options.base;
      if (!base) {
        throw new Error('You must provide a "base" option to use urls starting with "/"');
      }
      path = base.replace(/\/$/, '') + path;
    } else if (path.indexOf('http') !== 0) {
      const base = await this.getUrl();
      await this.navigateTo(resolve(base, path));
      return;
    }

    await this.driver.requestJSON('POST', '/url', {url: path});
  }
}
/**
 * Convert code to string before execution
 */
function codeToString(code: string | Function): string {
  if (typeof code === 'function') {
    // $FlowFixMe: intentionally concatenating string onto end of code
    return 'return (' + code + ').apply(null, arguments);';
  } else {
    return code;
  }
}
addDebugging(ActiveWindow);
export default ActiveWindow;
