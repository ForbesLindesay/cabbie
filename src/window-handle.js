import type Driver from './driver';
import type ActiveWindow from './active-window';
import BaseWindow from './base-window';

/**
 * Window object
 */
class WindowHandle extends BaseWindow {

  /**
   * The internal selenium id
   */
  id: string;

  constructor(driver: Driver, id: string) {
    super(driver, id);
    this.id = id;
  }

  /**
   * Shift the focus to this window (after calling this, browser.activeWindow refers to this window)
   */
  async activate(): Promise<ActiveWindow> {
    await this.driver.requestJSON('POST', '/window', {name: this.id});
    return this.driver.browser.activeWindow;
  }
}
export default WindowHandle;
