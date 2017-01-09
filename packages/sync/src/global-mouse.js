import type { MouseButton } from './enums/mouse-buttons';
import MouseButtons from './enums/mouse-buttons';
import Mouse from './mouse';

/**
 * Global mouse object handling global mouse commands
 */
class GlobalMouse extends BaseClass {
  /**
   * Move the mouse by an offset of the specified element. If no element is specified,
   * the move is relative to the current mouse cursor. If an element is provided but
   * no offset, the mouse will be moved to the center of the element. If the element
   * is not visible, it will be scrolled into view.
   */
  _moveTo(elementId?: string, xOffset?: number, yOffset?: number): void {
    var params = {};

    if (elementId !== undefined) {
      params.element = elementId;
    }
    if (xOffset !== undefined || yOffset !== undefined) {
      params.xoffset = xOffset;
      params.yoffset = yOffset;
    }

    this.requestJSON('POST', '/moveto', params);
  }

  /**
   * Move the mouse by an offset relative to the current mouse cursor position
   */
  moveTo(xOffset: number, yOffset: number): void {
    this._moveTo(undefined, xOffset, yOffset);
  }

  /**
   * Click any mouse button at the current location of the mouse cursor
   */
  click(button: MouseButton = MouseButtons.LEFT): void {
    this.requestJSON('POST', '/click', { button: button });
  }

  /**
   * Click any mouse button at an offset relative to the current location of the mouse cursor
   */
  clickAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.LEFT): void {
    this.moveTo(xOffset, yOffset);
    this.click(button);
  }

  /**
   * Double-clicks at the current location of the mouse cursor
   */
  doubleClick(): void {
    this.requestJSON('POST', '/doubleclick');
  }

  /**
   * Click and hold the any mouse button at the current location of the mouse cursor
   */
  buttonDown(button: MouseButton = MouseButtons.LEFT): void {
    this.requestJSON('POST', '/buttondown', { button: button });
  }

  /**
   * Click and hold the any mouse button relative to the current location of the mouse cursor
   */
  buttonDownAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.LEFT): void {
    this.moveTo(xOffset, yOffset);
    this.buttonDown(button);
  }

  /**
   * Releases the mouse button previously held at the current location of the mouse cursor
   */
  buttonUp(button: MouseButton = MouseButtons.LEFT): void {
    this.requestJSON('POST', '/buttonup', { button: button });
  }

  /**
   * Releases the mouse button previously held at the current location of the mouse cursor
   */
  buttonUpAt(xOffset: number, yOffset: number, button: MouseButton = MouseButtons.BUTTON_LEFT): void {
    this.moveTo(xOffset, yOffset);
    this.buttonUp(button);
  }
}

export default GlobalMouse;