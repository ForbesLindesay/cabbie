import type Driver from './driver';
import BaseClass from './base-class';

/**
 * Managing local storage
 */
class LocalStorage extends BaseClass {
  constructor(driver: Driver) {
    super(driver, '/local_storage');
  }

  /**
   * Gets the driver object.
   */
  getDriver(): Driver {
    return this.driver;
  }

  /**
   * Get all keys of the storage
   */
  async getKeys(): Promise<Array<string>> {
    return await this.requestJSON('GET', '');
  }

  /**
   * Get the storage item for the given key
   */
  async getItem(key: string): Promise<string> {
    return await this.requestJSON('GET', '/key/' + key);
  }

  /**
   * Set the storage item for the given key
   */
  async setItem(key: string, value: string): Promise<void> {
    await this.requestJSON('POST', '', { key: key, value: value });
  }

  /**
   * Remove the storage item for the given key
   */
  async removeItem(key: string): Promise<void> {
    await this.requestJSON('DELETE', '/key/' + key);
  }

  /**
   * Clear the storage
   */
  async clear(): Promise<void> {
    await this.requestJSON('DELETE', '');
  }

  /**
   * Get the number of items in the storage
   */
  async getSize(): Promise<number> {
    return await this.requestJSON('GET', '/size');
  }
}

export default LocalStorage;
