import type {SessionData} from './session-data';

export type Options = {
  /**
   * You can proivde a baseUrl so that tests can navigate relative to that url.  e.g.
   *
   * Instead of:
   *
   * ```js
   * const driver = cabbie(remote, {});
   * driver.browser.activeWindow.navigator.navigateTo('http://example.com/my/path');
   * ```
   *
   * You can write:
   *
   * ```js
   * const driver = cabbie(remote, {base: 'http://example.com'});
   * driver.browser.activeWindow.navigator.navigateTo('/my/path');
   * ```
   *
   * This makes it easier to port tests between development/staging/production
   */
  base?: string,

  /**
   * Desired capabilities are passed to selenium when setting up the session
   */
  desiredCapabilities?: {[key: string]: string},

  /**
   * Required capabilities are passed to selenium when setting up the session
   */
  requiredCapabilities?: {[key: string]: string},

  /**
   * Optionally provide a session if you have already started the selenium session.
   */
  session?: SessionData,

  /**
   * Log method calls to the console
   */
  debug?: boolean,

  /**
   * Log all requests and responses in great detail.
   * Use this when you are really struggling to debug something.
   */
  httpDebug?: boolean,
};
