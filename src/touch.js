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
  async tap(): Promise<void> {
    await this.driver.browser.activeWindow.touch._tap(this._parent.elementId());
  }

  /**
   * Double tap with the finger on the element
   */
  async doubleTap(): Promise<void> {
    await this.driver.browser.activeWindow.touch._doubleTap(this._parent.elementId());
  }

  /**
   * Long tap with the finger on the element
   */
  async longTap(): Promise<void> {
    await this.driver.browser.activeWindow.touch._longTap(this._parent.elementId());
  }

  /**
   * Finger down on the screen at an offset relative to the element
   */
  async down(xOffset: Number, yOffset: Number): Promise<void> {
    const location = await this._parent.getPosition();
    await this.driver.browser.activeWindow.touch.down(location.x + xOffset, location.y + yOffset);
  }

  /**
   * Finger down on the screen at the center of the element
   */
  async downAtCenter(): Promise<void> {
    const center = await this._parent.getAbsoluteCenter();
    await this.driver.browser.activeWindow.touch.down(center.x, center.y);
  }

  /**
   * Finger up on the screen at an offset relative to the element
   */
  async up(xOffset: Number, yOffset: Number): Promise<void> {
    const location = await this._parent.getPosition();
    await this.driver.browser.activeWindow.touch.down(location.x + xOffset, location.y + yOffset);
  }

  /**
   * Finger up on the screen at the center of the element
   */
  async upAtCenter(): Promise<void> {
    const center = await this._parent.getAbsoluteCenter();
    await this.driver.browser.activeWindow.touch.down(center.x, center.y);
  }

  /**
   * Move finger to an offset relative to the element
   */
  async moveTo(xOffset: Number, yOffset: Number): Promise<void> {
    const location = await this._parent.getPosition();
    await this.driver.browser.activeWindow.touch.move(location.x + xOffset, location.y + yOffset);
  }

  /**
   * Move finger to the center of the element
   */
  async moveToCenter(): Promise<void> {
    const center = await this._parent.getAbsoluteCenter();
    await this.driver.browser.activeWindow.touch.move(center.x, center.y);
  }

  //TODO: Element touch flick
  //TODO: Element touch scroll
}

export default Touch;
