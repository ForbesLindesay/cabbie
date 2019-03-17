import Driver from './driver';
import addDebugging from './add-debugging';
import BaseStorage from './base-storage';

/**
 * Managing local-storage
 */
class LocalStorage extends BaseStorage {
  constructor(driver: Driver) {
    super(driver, '/local_storage');
  }
}
addDebugging(LocalStorage);
export default LocalStorage;
