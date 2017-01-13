import type Driver from './driver';
import type ActiveWindow from './active-window';
import addDebugging from './add-debugging';
import BaseClass from './base-class';

/**
 * Window object
 */
class BaseWindow extends BaseClass {

  constructor(driver: Driver, id: string) {
    super(driver, '/window/' + id);
  }

  /**
   * Get the size of a window
   */
  async getSize(): Promise<{width: number, height: number}> {
    return await this.requestJSON('GET', '/size');
  };

  /**
   * Get the size of a window
   */
  async resize(width: number, height: number): Promise<void> {
    await this.requestJSON('POST', '/size', { width: width, height: height });
  };


  /**
   * Maximize a window
   */
  async maximize(): Promise<void> {
    await this.requestJSON('POST', '/maximize');
  };


  /**
   * Get the position of a window
   */
  async getPosition(): Promise<{x: number, y: number}> {
    return await this.requestJSON('GET', '/position');
  };

  /**
   * Position a window
   */
  async position(x: number, y: number): Promise<void> {
    await this.requestJSON('POST', '/position', { x: x, y: y });
  };
}
addDebugging(BaseWindow, {baseClass: true});
export default BaseWindow;
