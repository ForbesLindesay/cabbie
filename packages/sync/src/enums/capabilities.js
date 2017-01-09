export type Session = 'browserName' | 'version' | 'platform' | 'javascriptEnabled' | 'takesScreenshot' | 'handlesAlert' | 'databaseEnabled' | 'locationContextEnabled' | 'applicationCacheEnabled' | 'browserConnectionEnabled' | 'cssSelectorsEnabled' | 'webStorageEnabled' | 'rotatable' | 'acceptSslCerts' | 'nativeEvents' | 'proxy';
const SessionEnum = {
  /**
   * Request for a specific browser
   */
  BROWSER_NAME: ('browserName': 'browserName'),

  /**
   * Request for a specific browser version
   */
  VERSION: ('version': 'version'),

  /**
   * Request for a specific platform
   */
  PLATFORM: ('platform': 'platform'),

  /**
   * Request for JavaScript to be enabled in the browser
   */
  JAVASCRIPT_ENABLED: ('javascriptEnabled': 'javascriptEnabled'),

  /**
   * Request for screenshot support
   */
  TAKES_SCREENSHOT: ('takesScreenshot': 'takesScreenshot'),

  /**
   * Request for alert handling support
   */
  HANDLES_ALERT: ('handlesAlert': 'handlesAlert'),

  /**
   * Request for the browser database to be enabled
   */
  DATABASE_ENABLED: ('databaseEnabled': 'databaseEnabled'),

  /**
   * Request for the browser location API to be enabled
   */
  LOCATION_CONTEXT_ENABLED: ('locationContextEnabled': 'locationContextEnabled'),

  /**
   * Request for the browser cache to be enabled
   */
  APPLICATION_CACHE_ENABLED: ('applicationCacheEnabled': 'applicationCacheEnabled'),

  /**
   * Request for the ability to query the browsers connectivity
   */
  BROWSER_CONNECTION_ENABLED: ('browserConnectionEnabled': 'browserConnectionEnabled'),

  /**
   * Request for native css selector support.
   *
   * Note: This should always be requested since this is the default for Cabbie.
   */
  CSS_SELECTORS_ENABLED: ('cssSelectorsEnabled': 'cssSelectorsEnabled'),

  /**
   * Request for the web-storage to be enabled
   */
  WEB_STORAGE_ENABLED: ('webStorageEnabled': 'webStorageEnabled'),

  /**
   * Request for a browser that can be rotated (orientation).
   */
  ROTATABLE: ('rotatable': 'rotatable'),

  /**
   * Request for the browser to accept any ssl certificates
   */
  ACCEPT_SSL_CERTS: ('acceptSslCerts': 'acceptSslCerts'),

  /**
   * Request for native-events
   */
  NATIVE_EVENTS: ('nativeEvents': 'nativeEvents'),

  /**
   * Request for a proxy
   */
  PROXY: ('proxy': 'proxy')
};
export default SessionEnum;