import type Debug from './debug';
import type Driver from './driver';
import type Element from './element';
import addDebugging from './add-debugging';

/*
 * Touch commands relative to a DOM-element
 */
class Touch {
  /*
   * @private
   */
  debug: Debug;
  /*
   * @private
   */
  driver: Driver;
  _parent: Element;

  constructor(driver: Driver, parent: Element) {
    this.debug = driver.debug;
    this.driver = driver;
    this._parent = parent;
  }

  /*
   * Tap with the finger on the element
   */
  async tap(): Promise<void> {
    await this.driver.activeWindow.touch._tap(this._parent.elementID);
  }

  /*
   * Double tap with the finger on the element
   */
  async doubleTap(): Promise<void> {
    await this.driver.activeWindow.touch._doubleTap(this._parent.elementID);
  }

  /*
   * Long tap with the finger on the element
   */
  async longTap(): Promise<void> {
    await this.driver.activeWindow.touch._longTap(this._parent.elementID);
  }

  /*
   * Finger down on the screen at an offset relative to the element
   */
  async down(xOffset: number, yOffset: number): Promise<void> {
    const location = await this._parent.getPosition();
    await this.driver.activeWindow.touch.down(location.x + xOffset, location.y + yOffset);
  }

  /*
   * Finger down on the screen at the center of the element
   */
  async downAtCenter(): Promise<void> {
    const center = await this._parent.getAbsoluteCenter();
    await this.driver.activeWindow.touch.down(center.x, center.y);
  }

  /*
   * Finger up on the screen at an offset relative to the element
   */
  async up(xOffset: number, yOffset: number): Promise<void> {
    const location = await this._parent.getPosition();
    await this.driver.activeWindow.touch.down(location.x + xOffset, location.y + yOffset);
  }

  /*
   * Finger up on the screen at the center of the element
   */
  async upAtCenter(): Promise<void> {
    const center = await this._parent.getAbsoluteCenter();
    await this.driver.activeWindow.touch.down(center.x, center.y);
  }

  /*
   * Move finger to an offset relative to the element
   */
  async moveTo(xOffset: number, yOffset: number): Promise<void> {
    const location = await this._parent.getPosition();
    await this.driver.activeWindow.touch.move(location.x + xOffset, location.y + yOffset);
  }

  /*
   * Move finger to the center of the element
   */
  async moveToCenter(): Promise<void> {
    const center = await this._parent.getAbsoluteCenter();
    await this.driver.activeWindow.touch.move(center.x, center.y);
  }

  //TODO: Element touch flick
  //TODO: Element touch scroll
  /*
   * @private
   */
  inspect(depth: number, options: Object) {
    return this._parent.inspect(depth, options) + '.touch';
  }
}
addDebugging(Touch);
export default Touch;
