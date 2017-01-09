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
   async getID(): Promise<string> {
    if (this.id === 'current') {
      return await this.driver.requestJSON('GET', '/window_handle');
    } else {
      return this.id;
    }
  }


  /**
   * Activate the current window
   */
  async activate(): Promise<ActiveWindow> {
    if (this.id !== 'current') {
      await this.driver.browser.activateWindow(this);
    }
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
