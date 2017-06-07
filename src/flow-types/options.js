import type {Mode} from '../enums/modes';
import type {Session} from './session-data';

export type Options = {
  [key: string]: void,
  /*
   * You can proivde a baseUrl so that tests can navigate relative to that url.  e.g.
   *
   * Instead of:
   *
   * ```js
   * const driver = cabbie(remote, {});
   * await driver.activeWindow.navigateTo('http://example.com/my/path');
   * ```
   *
   * You can write:
   *
   * ```js
   * const driver = cabbie(remote, {base: 'http://example.com'});
   * await driver.activeWindow.navigateTo('/my/path');
   * ```
   *
   * This makes it easier to port tests between development/staging/production
   */
  base?: string,
  /*
   * Desired capabilities are passed to selenium when setting up the session
   */
  capabilities?: {[key: string]: string},
  /*
   * Required capabilities are passed to selenium when setting up the session
   */
  requiredCapabilities?: {[key: string]: string},
  /*
   * Optionally provide a session if you have already started the selenium session.
   */
  session?: Session,
  /*
   * Log method calls to the console
   */
  debug?: boolean,
  /*
   * Log all requests and responses in great detail.
   * Use this when you are really struggling to debug something.
   */
  httpDebug?: boolean,
  /*
   * A hook for you to provide custom logging
   */
  onCall?: (event: Object) => mixed,
  /*
   * A hook for you to provide custom logging
   */
  onRequest?: (req: Object) => mixed,
  /*
   * A hook for you to provide custom logging
   */
  onResponse?: (res: Object) => mixed,
  /*
   * This field is ignored unless you are using the combined async/sync cabbie
   */
  mode?: Mode,
  /*
   * Sauce Labs username (normally you should just set the SAUCE_USERNAME environment variable)
   */
  sauceUsername?: string,
  /*
   * Sauce Labs access key (normally you should just set the SAUCE_ACCESS_KEY environment variable)
   */
  sauceAccessKey?: string,
  /*
   * Browser stack username (normally you should just set the BROWSER_STACK_USERNAME environment variable)
   */
  browserStackUsername?: string,
  /*
   * Browser stack access key (normally you should just set the BROWSER_STACK_ACCESS_KEY environment variable)
   */
  browserStackAccessKey?: string,
  /*
   * Testing bot key (normally you should just set the TESTING_BOT_KEY environment variable)
   */
  testingBotKey?: string,
  /*
   * Testing bot secret (normally you should just set the TESTING_BOT_SECRET environment variable)
   */
  testingBotSecret?: string,
};
