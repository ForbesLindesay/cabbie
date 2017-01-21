const CapabilityEnum = {
  /*
   * Request for a specific browser
   */
  BROWSER_NAME: 'browserName',
  /*
   * Request for a specific browser version
   */
  VERSION: 'version',
  /*
   * Request for a specific platform
   */
  PLATFORM: 'platform',
  /*
   * Request for JavaScript to be enabled in the browser
   */
  JAVASCRIPT_ENABLED: 'javascriptEnabled',
  /*
   * Request for screenshot support
   */
  TAKES_SCREENSHOT: 'takesScreenshot',
  /*
   * Request for alert handling support
   */
  HANDLES_ALERT: 'handlesAlert',
  /*
   * Request for the browser database to be enabled
   */
  DATABASE_ENABLED: 'databaseEnabled',
  /*
   * Request for the browser location API to be enabled
   */
  LOCATION_CONTEXT_ENABLED: 'locationContextEnabled',
  /*
   * Request for the browser cache to be enabled
   */
  APPLICATION_CACHE_ENABLED: 'applicationCacheEnabled',
  /*
   * Request for the ability to query the browsers connectivity
   */
  BROWSER_CONNECTION_ENABLED: 'browserConnectionEnabled',
  /*
   * Request for native css selector support.
   *
   * Note: This should always be requested since this is the default for Cabbie.
   */
  CSS_SELECTORS_ENABLED: 'cssSelectorsEnabled',
  /*
   * Request for the web-storage to be enabled
   */
  WEB_STORAGE_ENABLED: 'webStorageEnabled',
  /*
   * Request for a browser that can be rotated (orientation).
   */
  ROTATABLE: 'rotatable',
  /*
   * Request for the browser to accept any ssl certificates
   */
  ACCEPT_SSL_CERTS: 'acceptSslCerts',
  /*
   * Request for native-events
   */
  NATIVE_EVENTS: 'nativeEvents',
  /*
   * Request for a proxy
   */
  PROXY: 'proxy',
};
export default CapabilityEnum;
