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
  getKeys(): Array<string> {
    return this.requestJSON('GET', '');
  }

  /**
   * Get the storage item for the given key
   */
  getItem(key: string): string {
    return this.requestJSON('GET', '/key/' + key);
  }

  /**
   * Set the storage item for the given key
   */
  setItem(key: string, value: string): void {
    this.requestJSON('POST', '', { key: key, value: value });
  }

  /**
   * Remove the storage item for the given key
   */
  removeItem(key: string): void {
    this.requestJSON('DELETE', '/key/' + key);
  }

  /**
   * Clear the storage
   */
  clear(): void {
    this.requestJSON('DELETE', '');
  }

  /**
   * Get the number of items in the storage
   */
  getSize(): number {
    return this.requestJSON('GET', '/size');
  }
}

export default LocalStorage;