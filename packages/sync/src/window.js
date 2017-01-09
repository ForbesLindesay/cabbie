/**
 * Window object
 */
class Window extends BaseClass {

  /**
   * The internal selenium id
   */
  id: string;

  constructor(driver: Driver, id: string) {
    super(driver, '/window/' + id);
    this.id = id;
  }

  /**
   * Get the inernal selenium id.
   * Should the id resolve to 'current', then it will request the actual id.
   */
  getID(): string {
    if (this.id === 'current') {
      return this.driver.requestJSON('GET', '/window_handle');
    } else {
      return this.id;
    }
  }

  /**
   * Activate the current window
   */
  activate(): ActiveWindow {
    if (this.id !== 'current') {
      this.driver.browser.activateWindow(this);
    }
  }

  /**
   * Get the size of a window
   */
  getSize(): { width: number; height: number; } {
    return this.requestJSON('GET', '/size');
  }

  /**
   * Get the size of a window
   */
  resize(width: number, height: number): void {
    this.requestJSON('POST', '/size', { width: width, height: height });
  }

  /**
   * Maximize a window
   */
  maximize(): void {
    this.requestJSON('POST', '/maximize');
  }

  /**
   * Get the position of a window
   */
  getPosition(): { x: number; y: number; } {
    return this.requestJSON('GET', '/position');
  }

  /**
   * Position a window
   */
  position(x: number, y: number): void {
    this.requestJSON('POST', '/position', { x: x, y: y });
  }
}