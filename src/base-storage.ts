import Driver from './driver';
import addDebugging from './add-debugging';
import BaseClass from './base-class';

/*
 * Base class for session storage and base storage
 */
class BaseStorage extends BaseClass {
  /*
   * Get all keys of the storage
   */
  async getKeys(): Promise<Array<string>> {
    return await this.requestJSON('GET', '');
  }

  /*
   * Get the storage item for the given key
   */
  async getItem(key: string): Promise<string> {
    return await this.requestJSON('GET', '/key/' + key);
  }

  /*
   * Set the storage item for the given key
   */
  async setItem(key: string, value: string): Promise<void> {
    await this.requestJSON('POST', '', {key: key, value: value});
  }

  /*
   * Remove the storage item for the given key
   */
  async removeItem(key: string): Promise<void> {
    await this.requestJSON('DELETE', '/key/' + key);
  }

  /*
   * Clear the storage
   */
  async clear(): Promise<void> {
    await this.requestJSON('DELETE', '');
  }

  /*
   * Get the number of items in the storage
   */
  async getSize(): Promise<number> {
    return await this.requestJSON('GET', '/size');
  }
}
addDebugging(BaseStorage, {baseClass: true});
export default BaseStorage;
