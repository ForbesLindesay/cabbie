/**
 * Managing session-storage
 */
class SessionStorage extends BaseClass {
  constructor(driver: Driver) {
    super(driver, '/session_storage');
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
  getSize(): Number {
    return this.requestJSON('GET', '/size');
  }
}