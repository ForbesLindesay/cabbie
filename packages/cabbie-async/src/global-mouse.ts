import MouseButton from './enums/mouse-buttons';
import addDebugging from './add-debugging';
import BaseClass from './base-class';

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
  async _moveTo(
    elementId?: string,
    xOffset?: number,
    yOffset?: number,
  ): Promise<void> {
    var params: any = {};

    if (elementId !== undefined) {
      params.element = elementId;
    }
    if (xOffset !== undefined || yOffset !== undefined) {
      params.xoffset = xOffset;
      params.yoffset = yOffset;
    }

    await this.requestJSON('POST', '/moveto', params);
  }

  /**
   * Move the mouse by an offset relative to the current mouse cursor position
   */
  async moveTo(xOffset: number, yOffset: number): Promise<void> {
    await this._moveTo(undefined, xOffset, yOffset);
  }

  /**
   * Click any mouse button at the current location of the mouse cursor
   */
  async click(button: MouseButton = MouseButton.LEFT): Promise<void> {
    await this.requestJSON('POST', '/click', {button: button});
  }

  /**
   * Click any mouse button at an offset relative to the current location of the mouse cursor
   */
  async clickAt(
    xOffset: number,
    yOffset: number,
    button: MouseButton = MouseButton.LEFT,
  ): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.click(button);
  }

  /**
   * Double-clicks at the current location of the mouse cursor
   */
  async doubleClick(): Promise<void> {
    await this.requestJSON('POST', '/doubleclick');
  }

  /**
   * Click and hold the any mouse button at the current location of the mouse cursor
   */
  async buttonDown(button: MouseButton = MouseButton.LEFT): Promise<void> {
    await this.requestJSON('POST', '/buttondown', {button: button});
  }

  /**
   * Click and hold the any mouse button relative to the current location of the mouse cursor
   */
  async buttonDownAt(
    xOffset: number,
    yOffset: number,
    button: MouseButton = MouseButton.LEFT,
  ): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.buttonDown(button);
  }

  /**
   * Releases the mouse button previously held at the current location of the mouse cursor
   */
  async buttonUp(button: MouseButton = MouseButton.LEFT): Promise<void> {
    await this.requestJSON('POST', '/buttonup', {button: button});
  }

  /**
   * Releases the mouse button previously held at the current location of the mouse cursor
   */
  async buttonUpAt(
    xOffset: number,
    yOffset: number,
    button: MouseButton = MouseButton.LEFT,
  ): Promise<void> {
    await this.moveTo(xOffset, yOffset);
    await this.buttonUp(button);
  }
}
addDebugging(GlobalMouse);
export default GlobalMouse;
