enum ApplicationCacheStatus {
  /*
   * Status of the HTML5 application cache - Uncached
   */
  UNCACHED = 0,
  /*
   * Status of the HTML5 application cache - Idle
   */
  IDLE = 1,
  /*
   * Status of the HTML5 application cache - Checking
   */
  CHECKING = 2,
  /*
   * Status of the HTML5 application cache - Downloading
   */
  DOWNLOADING = 3,
  /*
   * Status of the HTML5 application cache - Update-ready
   */
  UPDATE_READY = 4,
  /*
   * Status of the HTML5 application cache - Obsolete
   */
  OBSOLETE = 5,
};

export default ApplicationCacheStatus;
