import BaseClass from './base-class';

/**
 * Input Method Editor object
 */
class IME extends BaseClass {
  constructor(driver: Driver) {
    super(driver, '/ime');
  }

  /**
   * List all available engines on the machine. To use an engine, it has to be present in this list.
   */
  async getEngines(): Promise<Array<string>> {
    return await this.requestJSON('GET', '/available_engines');
  }

  /**
   * Get the name of the active IME engine. The name string is platform specific.
   */
  async getActiveEngine(): Promise<string> {
    return await this.requestJSON('GET', '/active_engine');
  }

  /**
   * Indicates whether IME input is active at the moment (not if it's available)
   */
  async isActivated(): Promise<boolean> {
    return await this.requestJSON('GET', '/activated');
  }

  /**
   * Make an engine that is available (appears on the list returned by
   * getAvailableEngines) active. After this call, the engine will be
   * added to the list of engines loaded in the IME daemon and the input
   * sent using sendKeys will be converted by the active engine.
   *
   * Note that this is a platform-independent method of activating IME
   * (the platform-specific way being using keyboard shortcuts)
   */
  async activate(engine: string): Promise<void> {
    await this.requestJSON('POST', '/activate', { engine: engine });
  }

  /**
   * De-activates the currently-active IME engine
   */
  async deactivate(): Promise<void> {
    await this.requestJSON('POST', '/deactivate');
  }
}

export default IME;
