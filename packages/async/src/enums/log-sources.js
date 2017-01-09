export type LogSource = 'client' | 'driver' | 'browser' | 'server';
const LogSourcesEnum = {

  /**
   * Source type of the log-entry - 'client'
   */
  CLIENT: ('client': 'client'),

  /**
   * Source type of the log-entry - 'driver'
   */
  DRIVER: ('driver': 'driver'),

  /**
   * Source type of the log-entry - 'browser'
   */
  BROWSER: ('browser': 'browser'),

  /**
   * Source type of the log-entry - 'server'
   */
  SERVER: ('server': 'server')
};

export default LogSourcesEnum;