export type Mode = 'sync' | 'async';
const ModeEnum = {
  /**
   * Sync-mode of web-driver requests
   */
  SYNC: ('sync': 'sync'),

  /**
   * Async-mode of web-driver requests
   */
  ASYNC: ('async': 'async')
};

export default ModeEnum;