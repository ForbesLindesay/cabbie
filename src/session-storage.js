import type Driver from './driver';
import addDebugging from './add-debugging';
import BaseStorage from './base-storage';

/**
 * Managing session-storage
 */
class SessionStorage extends BaseStorage {
  constructor(driver: Driver) {
    super(driver, '/session_storage');
  }
}
addDebugging(SessionStorage);
export default SessionStorage;
