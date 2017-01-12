import type {BrowserOrientation} from './enums/browser-orientations';
import type Driver from './driver';
import ActiveWindow from './active-window';
import BaseClass from './base-class';
import CookieStorage from './cookie-storage';
import IME from './ime';
import LocalStorage from './local-storage';
import WindowHandle from './window-handle';

/**
 * Browser accessor class
 */
class Browser extends BaseClass {
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

  constructor(driver: Driver) {
    super(driver);

    this.activeWindow = new ActiveWindow(this.driver);
    this.ime = new IME(this.driver);
    this.cookieStorage = new CookieStorage(this.driver);
    this.localStorage = new LocalStorage(this.driver);
    this.sessionStorage = new SessionStorage(this);
  }

  /**
   * Get an array of windows for all available windows
   */
  async getWindows(): Promise<Array<WindowHandle>> {
    const windowHandles = await this.requestJSON('GET', '/window_handles');
    return windowHandles.map(windowHandle => {
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
  async getGeoLocation(): Promise<{latitude: number, longitude: number, altitude: number}> {
    return await this.requestJSON('GET', '/location');
  };

  /**
   * Set the current geo location
   */
  async setGeoLocation(loc: {latitude: number, longitude: number, altitude: number}): Promise<void> {
    await this.requestJSON('POST', '/location', loc);
  }
}
export default Browser;
