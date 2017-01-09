/**
 * Mouse commands relative to a DOM-element
 */
class Mouse {
  constructor(driver: Driver, parent: Element) {
    this.driver = driver;
    this._parent = parent;
  }

  requestJSON(method: HttpMethod, path: string, body?: Object): any {
    return this._parent.requestJSON(method, path, body);
  }

  /**
   * Click any mouse button at the center of the element
   */
  click(button: MouseButton = MouseButtons.LEFT): void {
    if (button !== MouseButtons.LEFT) {
      this.moveToCenter();
      this.driver.browser.activeWindow.mouse.click(button);
    } else {
      this.requestJSON('POST', '/click');
    }
  }

  /**
   * Click any mouse button at a specified offset of the element
   */
  clickAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.LEFT): void {
    this.moveTo(xOffset, yOffset);
    this.driver.browser.activeWindow.mouse.click(button);
  }

  /**
   * Move the mouse by an offset of the element
   */
  moveTo(xOffset: number, yOffset: number): void {
    this.driver.browser.activeWindow.mouse._moveTo(this._parent.elementId(), xOffset, yOffset);
  }

  /**
   * Move the mouse to the center of the element
   */
  moveToCenter(): void {
    this.driver.browser().activeWindow().mouse()._moveTo(this._parent.elementID(), undefined, undefined);
  }

  /**
   * Double-clicks the element at the center of the element
   */
  doubleClick(): void {
    this.moveToCenter();
    this.driver.browser.activeWindow.mouse.doubleClick();
  }

  /**
   * Double-clicks the element at a specified offset of the element
   */
  doubleClickAt(xOffset: number, yOffset: number): void {
    this.moveTo(xOffset, yOffset);
    this.driver.browser.activeWindow.mouse.doubleClick();
  }

  /**
   * Click and hold any mouse button at the center of the element
   */
  buttonDown(button: MouseButton = MouseButtons.LEFT): void {
    this.moveToCenter();
    this.driver.browser.activeWindow.mouse.buttonDown(button);
  }

  /**
   * Click and hold any mouse button at a specified offset of the element
   */
  buttonDownAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.LEFT): void {
    this.moveTo(xOffset, yOffset);
    this.driver.browser.activeWindow.mouse.buttonDown(button);
  }

  /**
   * Releases a mouse button at the center of the element
   */
  buttonUp(button: MouseButton = MouseButtons.LEFT): void {
    this.moveToCenter();
    this.driver.browser.activeWindow.mouse.buttonUp(button);
  }

  /**
   * Releases a mouse button at a specified offset of the element
   */
  buttonUpAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.LEFT): void {
    this.moveTo(xOffset, yOffset);
    this.driver.browser.activeWindow.mouse.buttonUp(button);
  }
}
export default Mouse;