import type Driver from './driver';
import BaseStorage from './base-storage';

/**
 * Managing session-storage
 */
class SessionStorage extends BaseStorage {
  constructor(driver: Driver) {
    super(driver, '/session_storage');
  }
}
export default SessionStorage;
