import type {MouseButton} from './enums/mouse-buttons';
import type {HttpMethod} from './flow-types/http-method';
import type Driver from './driver';
import type Element from './element';
import MouseButtons from './enums/mouse-buttons';

/**
 * Mouse commands relative to a DOM-element
 */
class Mouse {
  driver: Driver;
  _parent: Element;
  constructor(driver: Driver, parent: Element) {
    this.driver = driver;
    this._parent = parent;
  }

  async requestJSON(method: HttpMethod, path: string, body?: Object): Promise<any> {
    return await this._parent.requestJSON(method, path, body);
  }

  /**
   * Click any mouse button at the center of the element
   */
  async click(button: MouseButton = MouseButtons.LEFT): Promise<void> {
    if (button !== MouseButtons.LEFT) {
      await this.moveToCenter();
      await this.driver.browser.activeWindow.mouse.click(button);
    } else {
      await this.requestJSON('POST', '/click');
    }
  }

  /**
   * Click any mouse button at a specified offset of the element
   */
  async clickAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.LEFT): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.driver.browser.activeWindow.mouse.click(button);
  }

  /**
   * Move the mouse by an offset of the element
   */
  async moveTo(xOffset: number, yOffset: number): Promise<void> {
    await this.driver.browser.activeWindow.mouse._moveTo(this._parent.elementID, xOffset, yOffset);
  }

  /**
   * Move the mouse to the center of the element
   */
  async moveToCenter(): Promise<void> {
    await this.driver.browser.activeWindow.mouse._moveTo(this._parent.elementID, undefined, undefined);
  }

  /**
   * Double-clicks the element at the center of the element
   */
  async doubleClick(): Promise<void> {
    await this.moveToCenter();
    await this.driver.browser.activeWindow.mouse.doubleClick();
  }

  /**
   * Double-clicks the element at a specified offset of the element
   */
  async doubleClickAt(xOffset: number, yOffset: number): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.driver.browser.activeWindow.mouse.doubleClick();
  }

  /**
   * Click and hold any mouse button at the center of the element
   */
  async buttonDown(button: MouseButton = MouseButtons.LEFT): Promise<void> {
    await this.moveToCenter();
    await this.driver.browser.activeWindow.mouse.buttonDown(button);
  }

  /**
   * Click and hold any mouse button at a specified offset of the element
   */
  async buttonDownAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.LEFT): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.driver.browser.activeWindow.mouse.buttonDown(button);
  }

  /**
   * Releases a mouse button at the center of the element
   */
  async buttonUp(button: MouseButton = MouseButtons.LEFT): Promise<void> {
    await this.moveToCenter();
    await this.driver.browser.activeWindow.mouse.buttonUp(button);
  }

  /**
   * Releases a mouse button at a specified offset of the element
   */
  async buttonUpAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.LEFT): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.driver.browser.activeWindow.mouse.buttonUp(button);
  }
}
export default Mouse;
