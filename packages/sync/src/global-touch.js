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
  _tap(elementId: string): void {
    this.requestJSON('POST', '/click', { element: elementId });
  }

  /**
   * Double tap on an element
   */
  _doubleTap(elementId: string): void {
    this.requestJSON('POST', '/doubleclick', { element: elementId });
  }

  /**
   * Long tap on an element
   */
  _longTap(elementId: string): void {
    this.requestJSON('POST', '/longclick', { element: elementId });
  }

  /**
   * Finger down on the screen at the given position
   */
  down(x: number, y: number): void {
    this.requestJSON('POST', '/down', { x: x, y: y });
  }

  /**
   * Finger up on the screen at the given position
   */
  up(x: number, y: number): void {
    this.requestJSON('POST', '/up', { x: x, y: y });
  }

  /**
   * Move finger on the screen to the given position
   */
  move(x: number, y: number): void {
    this.requestJSON('POST', '/move', { x, y });
  }

  /**
   * Scroll on the touch screen using finger based motion events according to an offset
   */
  scroll(xOffset: number, yOffset: number): void {
    this.requestJSON('POST', '/scroll', { xoffset: xOffset, yoffset: yOffset });
  }

  /**
   * Flick on the touch screen using finger motion events. This flick command starts at a particular screen location.
   */
  flick(xSpeed: number, ySpeed: number): void {
    this.requestJSON('POST', '/flick', { xspeed: xSpeed, yspeed: ySpeed });
  }
}
export default GlobalTouch;