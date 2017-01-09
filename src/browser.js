import type {BrowserOrientation} from './enums/browser-orientations';
import ActiveWindow from './active-window';
import BaseClass from './base-class';
import CookieStorage from './cookie-storage';
import IME from './ime';
import LocalStorage from './local-storage';
import Window from './window';

/**
 * Browser accessor class
 */
class Browser extends BaseClass {
  /**
   * Change focus to another window
   */
  async activateWindow(window: Window): Promise<ActiveWindow> {
    const handle = await window.getID();
    await this.requestJSON('POST', '/window', {name: handle});
    return this.activeWindow;
  };

  /**
   * Get the currently active window.
   */
  get activeWindow(): ActiveWindow {
    return new ActiveWindow(this.driver, 'current');
  };

  /**
   * Get an array of windows for all available windows
   */
  async getWindows(): Promise<Array<Window>> {
    const windowHandles = await this.requestJSON('GET', '/window_handles');
    return windowHandles.map(windowHandle => {
      return new Window(this.driver, windowHandle);
    });
  };


  /**
   * Get the current browser orientation
   */
  async getOrientation(): Promise<BrowserOrientation> {
    return this.requestJSON('GET', '/orientation');
  };

  /**
   * Get the current browser orientation
   */
  async setOrientation(orientation: BrowserOrientation): Promise<void> {
    await this.requestJSON('POST', '/orientation', {orientation});
  };


  /**
   * Get the current geo location
   */
  async getGeoLocation(): Promise<{latitude: number, longitude: number, altitude: number}> {
    return await this.requestJSON('GET', '/location');
  };

  /**
   * Set the current geo location
   */
  async setGeoLocation(loc: {latitude: number, longitude: number, altitude: number}): Promise<void> {
    await this.requestJSON('POST', '/location', loc);
  };


  /**
   * Get the IME object.
   */
  get ime(): IME{
    return new IME(this.driver);
  };


  /**
   * Get the Cookie-Storage object.
   */
  get cookieStorage(): CookieStorage {
    return new CookieStorage(this.driver);
  };

  /**
   * Get the Local-Storage object.
   */
  get localStorage(): LocalStorage {
    return new LocalStorage(this.driver);
  };
}
export default Browser;
