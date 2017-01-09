export type ApplicationCacheStatu = 0 | 1 | 2 | 3 | 4 | 5;
const ApplicationCacheStatusEnum = {
  /**
   * Status of the HTML5 application cache - Uncached
   */
  UNCACHED: (0: 0),

  /**
   * Status of the HTML5 application cache - Idle
   */
  IDLE: (1: 1),

  /**
   * Status of the HTML5 application cache - Checking
   */
  CHECKING: (2: 2),

  /**
   * Status of the HTML5 application cache - Downloading
   */
  DOWNLOADING: (3: 3),

  /**
   * Status of the HTML5 application cache - Update-ready
   */
  UPDATE_READY: (4: 4),

  /**
   * Status of the HTML5 application cache - Obsolete
   */
  OBSOLETE: (5: 5)
};

export default ApplicationCacheStatusEnum;