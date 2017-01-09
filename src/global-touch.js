import type Driver from './driver';
import BaseClass from './base-class';

/**
 * Global touch object handling global touch commands
 */
class GlobalTouch extends BaseClass {
  constructor(driver: Driver) {
    super(driver, '/touch');
  }
  /**
   * Tap on an element
   */
  async _tap(elementId: string): Promise<void> {
    await this.requestJSON('POST', '/click', { element: elementId });
  }

  /**
   * Double tap on an element
   */
  async _doubleTap(elementId: string): Promise<void> {
    await this.requestJSON('POST', '/doubleclick', { element: elementId });
  }

  /**
   * Long tap on an element
   */
  async _longTap(elementId: string): Promise<void> {
    await this.requestJSON('POST', '/longclick', { element: elementId });
  }

  /**
   * Finger down on the screen at the given position
   */
  async down(x: number, y: number): Promise<void> {
    await this.requestJSON('POST', '/down', { x: x, y: y });
  }

  /**
   * Finger up on the screen at the given position
   */
  async up(x: number, y: number): Promise<void> {
    await this.requestJSON('POST', '/up', { x: x, y: y });
  }

  /**
   * Move finger on the screen to the given position
   */
  async move(x: number, y: number): Promise<void> {
    await this.requestJSON('POST', '/move', {x, y});
  }

  /**
   * Scroll on the touch screen using finger based motion events according to an offset
   */
  async scroll(xOffset: number, yOffset: number): Promise<void> {
    await this.requestJSON('POST', '/scroll', { xoffset: xOffset, yoffset: yOffset });
  }

  /**
   * Flick on the touch screen using finger motion events. This flick command starts at a particular screen location.
   */
  async flick(xSpeed: number, ySpeed: number): Promise<void> {
    await this.requestJSON('POST', '/flick', { xspeed: xSpeed, yspeed: ySpeed });
  }
}
export default GlobalTouch;
