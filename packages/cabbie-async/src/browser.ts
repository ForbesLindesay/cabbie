import BrowserOrientation from './enums/browser-orientations';
import Driver from './driver';
import {Options} from './flow-types/options';
import ActiveWindow from './active-window';
import addDebugging from './add-debugging';
import BaseClass from './base-class';
import CookieStorage from './cookie-storage';
import IME from './ime';
import LocalStorage from './local-storage';
import SessionStorage from './session-storage';
import WindowHandle from './window-handle';

/**
 * Browser accessor class
 */
class Browser extends BaseClass {
  /**
   * The currently active window.  This has most of the methods to interact with
   * the the current page.
   */
  activeWindow: ActiveWindow;

  /**
   * Get the IME object.
   */
  ime: IME;

  /**
   * Get the Cookie-Storage object.
   */
  cookieStorage: CookieStorage;

  /**
   * Get the Local-Storage object.
   */
  localStorage: LocalStorage;

  /**
   * Get the Session-Storage object.
   */
  sessionStorage: SessionStorage;

  constructor(driver: Driver, options: Options) {
    super(driver);

    this.activeWindow = new ActiveWindow(this.driver, options);
    this.ime = new IME(this.driver);
    this.cookieStorage = new CookieStorage(this.driver);
    this.localStorage = new LocalStorage(this.driver);
    this.sessionStorage = new SessionStorage(this.driver);
  }

  /**
   * Get an array of windows for all available windows
   */
  async getWindows(): Promise<Array<WindowHandle>> {
    const windowHandles = await this.requestJSON('GET', '/window_handles');
    return windowHandles.map((windowHandle: string) => {
      return new WindowHandle(this.driver, windowHandle);
    });
  }

  /**
   * Get the current browser orientation
   */
  async getOrientation(): Promise<BrowserOrientation> {
    return this.requestJSON('GET', '/orientation');
  }

  /**
   * Get the current browser orientation
   */
  async setOrientation(orientation: BrowserOrientation): Promise<void> {
    await this.requestJSON('POST', '/orientation', {orientation});
  }

  /**
   * Get the current geo location
   */
  async getGeoLocation(): Promise<{
    latitude: number;
    longitude: number;
    altitude: number;
  }> {
    return await this.requestJSON('GET', '/location');
  }

  /**
   * Set the current geo location
   */
  async setGeoLocation(loc: {
    latitude: number;
    longitude: number;
    altitude: number;
  }): Promise<void> {
    await this.requestJSON('POST', '/location', loc);
  }
}
addDebugging(Browser);
export default Browser;
