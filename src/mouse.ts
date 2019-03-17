import MouseButton from './enums/mouse-buttons';
import {HttpMethod} from './flow-types/http-method';
import Debug from './debug';
import Driver from './driver';
import Element from './element';
import {inspect} from 'util';
import addDebugging from './add-debugging';

/**
 * Mouse commands relative to a DOM-element
 */
class Mouse {
  /**
   * @private
   */
  driver: Driver;
  /**
   * @private
   */
  debug: Debug;
  _parent: Element;
  constructor(driver: Driver, parent: Element) {
    this.driver = driver;
    this.debug = driver.debug;
    this._parent = parent;
  }

  /**
   * @private
   */
  async requestJSON(method: HttpMethod, path: string, body?: any): Promise<any> {
    return await this._parent.requestJSON(method, path, body);
  }

  /**
   * Click any mouse button at the center of the element
   */
  async click(button: MouseButton = MouseButton.LEFT): Promise<void> {
    if (button !== MouseButton.LEFT) {
      await this.moveToCenter();
      await this.driver.activeWindow.mouse.click(button);
    } else {
      await this.requestJSON('POST', '/click');
    }
  }

  /**
   * Click any mouse button at a specified offset of the element
   */
  async clickAt(xOffset: number, yOffset: number, button: MouseButton = MouseButton.LEFT): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.driver.activeWindow.mouse.click(button);
  }

  /**
   * Move the mouse by an offset of the element
   */
  async moveTo(xOffset: number, yOffset: number): Promise<void> {
    await this.driver.activeWindow.mouse._moveTo(this._parent.elementID, xOffset, yOffset);
  }

  /**
   * Move the mouse to the center of the element
   */
  async moveToCenter(): Promise<void> {
    await this.driver.activeWindow.mouse._moveTo(this._parent.elementID, undefined, undefined);
  }

  /**
   * Double-clicks the element at the center of the element
   */
  async doubleClick(): Promise<void> {
    await this.moveToCenter();
    await this.driver.activeWindow.mouse.doubleClick();
  }

  /**
   * Double-clicks the element at a specified offset of the element
   */
  async doubleClickAt(xOffset: number, yOffset: number): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.driver.activeWindow.mouse.doubleClick();
  }

  /**
   * Click and hold any mouse button at the center of the element
   */
  async buttonDown(button: MouseButton = MouseButton.LEFT): Promise<void> {
    await this.moveToCenter();
    await this.driver.activeWindow.mouse.buttonDown(button);
  }

  /**
   * Click and hold any mouse button at a specified offset of the element
   */
  async buttonDownAt(xOffset: number, yOffset: number, button: MouseButton = MouseButton.LEFT): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.driver.activeWindow.mouse.buttonDown(button);
  }

  /**
   * Releases a mouse button at the center of the element
   */
  async buttonUp(button: MouseButton = MouseButton.LEFT): Promise<void> {
    await this.moveToCenter();
    await this.driver.activeWindow.mouse.buttonUp(button);
  }

  /**
   * Releases a mouse button at a specified offset of the element
   */
  async buttonUpAt(xOffset: number, yOffset: number, button: MouseButton = MouseButton.LEFT): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.driver.activeWindow.mouse.buttonUp(button);
  }
}
addDebugging(Mouse, {
  inspect(obj, depth, options) {
    return obj._parent[inspect.custom || 'inspect'](depth, options) + '.mouse';
  },
});
export default Mouse;
