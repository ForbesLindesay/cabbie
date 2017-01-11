import type {SelectorType} from './enums/selector-types';
import type Driver from './driver';
import Alert from './alert';
import Element from './element';
import Frame from './frame';
import GlobalMouse from './global-mouse';
import GlobalTouch from './global-touch';
import Navigator from './navigator';
import SelectorTypes from './enums/selector-types';
import BaseWindow from './base-window';
import WindowHandle from './window-handle';

/**
 * Active window object
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

  constructor(driver: Driver) {
    super(driver, 'current');

    this.touch = new GlobalTouch(this.driver);
    this.mouse = new GlobalMouse(this.driver);
    this.navigator = new Navigator(this.driver);
    this.frame = new Frame(this.driver);
    this.alert = new Alert(this.driver);
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
    await this.driver.requestJSON('POST', '/keys', { value: Array.isArray(str) ? str : [str] });
  }

  /**
   * Take a screenshot of the current page
   *
   * This returns the result as a buffer containing the binary image data
   */
  async takeScreenshot(): Promise<Buffer> {
    const base64data = await this.driver.requestJSON('GET', '/screenshot');
    return new Buffer(base64data, 'base64');
  }


  /**
   * Get the element on the page that currently has focus
   */
  async getActiveElement(): Promise<Element> {
    const elementHandle =  await this.driver.requestJSON('POST', '/element/active');
    return new Element(this.driver, this.driver.browser, '<active>', elementHandle);
  }

  /**
   * Get an element via a selector.
   * Will throw an error if the element does not exist.
   */
  async getElement(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Promise<Element> {
    const elementHandle = await this.driver.requestJSON('POST', '/element', {
      using: selectorType,
      value: selector
    })
    return new Element(this.driver, this.driver.browser, selector, elementHandle);
  }

  /**
   * Get elements via a selector.
   */
  async getElements(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Promise<Array<Element>> {
    const elementHandles = await this.driver.requestJSON('POST', '/elements', {
      using: selectorType,
      value: selector
    });
    return elementHandles.map((elementHandle) => {
      return new Element(this.driver, this.driver.browser, selector, elementHandle);
    });
  }

  /**
   * Does a specific element exist?
   */
  async hasElement(selector: string, selectorType: SelectorType = SelectorTypes.CSS): Promise<boolean> {
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
export default ActiveWindow;
