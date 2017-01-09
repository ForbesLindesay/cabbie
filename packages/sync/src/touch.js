/**
 * Touch commands relative to a DOM-element
 */
class Touch {
  constructor(driver, parent) {
    this.driver = driver;
    this._parent = parent;
  }

  /**
   * Tap with the finger on the element
   */
  tap(): void {
    this.driver.browser.activeWindow.touch._tap(this._parent.elementId());
  }

  /**
   * Double tap with the finger on the element
   */
  doubleTap(): void {
    this.driver.browser.activeWindow.touch._doubleTap(this._parent.elementId());
  }

  /**
   * Long tap with the finger on the element
   */
  longTap(): void {
    this.driver.browser.activeWindow.touch._longTap(this._parent.elementId());
  }

  /**
   * Finger down on the screen at an offset relative to the element
   */
  down(xOffset: Number, yOffset: Number): void {
    const location = this._parent.getPosition();
    this.driver.browser.activeWindow.touch.down(location.x + xOffset, location.y + yOffset);
  }

  /**
   * Finger down on the screen at the center of the element
   */
  downAtCenter(): void {
    const center = this._parent.getAbsoluteCenter();
    this.driver.browser.activeWindow.touch.down(center.x, center.y);
  }

  /**
   * Finger up on the screen at an offset relative to the element
   */
  up(xOffset: Number, yOffset: Number): void {
    const location = this._parent.getPosition();
    this.driver.browser.activeWindow.touch.down(location.x + xOffset, location.y + yOffset);
  }

  /**
   * Finger up on the screen at the center of the element
   */
  upAtCenter(): void {
    const center = this._parent.getAbsoluteCenter();
    this.driver.browser.activeWindow.touch.down(center.x, center.y);
  }

  /**
   * Move finger to an offset relative to the element
   */
  moveTo(xOffset: Number, yOffset: Number): void {
    const location = this._parent.getPosition();
    this.driver.browser.activeWindow.touch.move(location.x + xOffset, location.y + yOffset);
  }

  /**
   * Move finger to the center of the element
   */
  moveToCenter(): void {
    const center = this._parent.getAbsoluteCenter();
    this.driver.browser.activeWindow.touch.move(center.x, center.y);
  }

  //TODO: Element touch flick
  //TODO: Element touch scroll
}

export default Touch;