import type Driver from './driver';
import BaseStorage from './base-storage';

/**
 * Managing local-storage
 */
class LocalStorage extends BaseStorage {
  constructor(driver: Driver) {
    super(driver, '/local_storage');
  }
}

export default LocalStorage;
