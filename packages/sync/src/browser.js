import type { BrowserOrientation } from './enums/browser-orientations';

/**
 * Browser accessor class
 */
class Browser extends BaseClass {
  /**
   * Change focus to another window
   */
  activateWindow(window: Window): ActiveWindow {
    const handle = window.getID();
    this._requestJSON('POST', '/window', { name: handle });
    return this.activeWindow;
  }

  /**
   * Get the currently active window.
   */
  get activeWindow(): ActiveWindow {
    return new ActiveWindow(this.driver, 'current');
  }

  /**
   * Get an array of windows for all available windows
   */
  getWindows(): Array<Window> {
    const windowHandles = requestJSON('GET', '/window_handles');
    return windowHandles.map(windowHandle => {
      return new WindowHandler(this.driver, windowHandle);
    });
  }

  /**
   * Get the current browser orientation
   */
  getOrientation(): BrowserOrientation {
    return this.requestJSON('GET', '/orientation');
  }

  /**
   * Get the current browser orientation
   */
  setOrientation(orientation: BrowserOrientation): void {
    this.requestJSON('POST', '/orientation', { orientation });
  }

  /**
   * Get the current geo location
   */
  getGeoLocation(): { latitude: number; longitude: number; altitude: number; } {
    return this.requestJSON('GET', '/location');
  }

  /**
   * Set the current geo location
   */
  setGeoLocation(loc: { latitude: number; longitude: number; altitude: number; }): void {
    this.requestJSON('POST', '/location', loc);
  }

  /**
   * Get the IME object.
   */
  get ime(): IME {
    return new IME(this.driver);
  }

  /**
   * Get the Cookie-Storage object.
   */
  get cookieStorage(): CookieStorage {
    return new CookieStorage(this.driver);
  }

  /**
   * Get the Local-Storage object.
   */
  get localStorage(): LocalStorage {
    return new LocalStorage(this.driver);
  }
}