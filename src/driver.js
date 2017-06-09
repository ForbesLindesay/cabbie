import type {ApplicationCacheStatus} from './enums/application-cache-statuses';
import type {BrowserOrientation} from './enums/browser-orientations';
import type {HttpMethod} from './flow-types/http-method';
import type {Options} from './flow-types/options';
import type {Session} from './flow-types/session-data';
import type {LogEntry} from './log-entry';
import util from 'util';
import url from 'url';
import {readFileSync} from 'fs';
import {parse as parseEnv} from 'dotenv';
import depd from 'depd';
import getBrowser from 'available-browsers';
import addDebugging from './add-debugging';
import autoRequest from 'then-request';
import {fromBody} from './utils/errors';
import Connection from './connection';
import Browser from './browser';
import Debug from './debug';
import TimeOut from './time-out';
import Status from './status';
import parseResponse from './utils/parse-response';
import ActiveWindow from './active-window';
import IME from './ime';
import CookieStorage from './cookie-storage';
import LocalStorage from './local-storage';
import SessionStorage from './session-storage';
import WindowHandle from './window-handle';

const deprecate = depd('cabbie');

/*
 * Create a new Driver session, remember to call `.dispose()`
 * at the end to terminate the session.
 */
class Driver {
  /*
   * The current session.  You can pass this session to createCabbieDriver to convert
   * between sync and async drivers.  e.g.
   *
   * ```js
   * const driver = createCabbieDriver(oldDriver.remote, {...oldDriver.options, session: oldDriver.session});
   * ```
   */
  session: Promise<Session>;

  /*
   * @private
   */
  debug: Debug;

  /*
   * @private
   */
  _connection: Connection;

  /*
   * The location of the selenium server
   */
  remote: string;

  /*
   * The options that were originally passed in to createCabbieDriver
   */
  options: Options;

  /*
   * The browser object.
   *
   * @private
   */
  browser: Browser;

  /*
   * Timeout configuration
   */
  timeOut: TimeOut;

  /*
   * The currently active window.  This has most of the methods to interact with
   * the the current page.
   */
  activeWindow: ActiveWindow;

  /*
   * Get the IME object.
   */
  ime: IME;

  /*
   * Get the Cookie-Storage object.
   */
  cookieStorage: CookieStorage;

  /*
   * Get the Local-Storage object.
   */
  localStorage: LocalStorage;

  /*
   * Get the Session-Storage object.
   */
  sessionStorage: SessionStorage;

  constructor(remote: string, options: Options = {}) {
    options = addEnvironment(options);
    this.remote = remote;
    this.options = options;
    this.debug = new Debug(options);
    let remoteURI = remote;
    const capabilities = {
      ...(options.browser && (remote === 'saucelabs' || remote === 'browserstack' || remote === 'testingbot')
        ? getBrowser(remote, options.browser.name, options.browser.version, options.browser.platform)
        : {}),
      ...(options.capabilities || {}),
    };
    switch (remote) {
      case 'chromedriver':
        remoteURI = 'http://localhost:9515/';
        break;
      case 'saucelabs':
        const {sauceUsername, sauceAccessKey} = options;
        if (!sauceUsername || !sauceAccessKey) {
          throw new Error(
            'To use sauce labs, you must specify SAUCE_USERNAME and SAUCE_ACCESS_KEY in enviornment variables or ' +
              'provide sauceUsername and sauceAccessKey as options.',
          );
        }
        remoteURI = `http://${sauceUsername}:${sauceAccessKey}@ondemand.saucelabs.com/wd/hub`;
        break;
      case 'browserstack':
        const {browserStackUsername, browserStackAccessKey} = options;
        if (!browserStackUsername || !browserStackAccessKey) {
          throw new Error(
            'To use browserstack, you must specify BROWSER_STACK_USERNAME and BROWSER_STACK_ACCESS_KEY in ' +
              'enviornment variables or provide browserStackUsername and browserStackAccessKey as options.',
          );
        }
        remoteURI = 'http://hub-cloud.browserstack.com/wd/hub';
        capabilities['browserstack.user'] = browserStackUsername;
        capabilities['browserstack.key'] = browserStackAccessKey;
        break;
      case 'testingbot':
        const {testingBotKey, testingBotSecret} = options;
        if (!testingBotKey || !testingBotSecret) {
          throw new Error(
            'To use testingbot, you must specify TESTING_BOT_KEY and TESTING_BOT_SECRET in enviornment ' +
              'variables or provide testingBotKey and testingBotSecret as options.',
          );
        }
        remoteURI = `http://${testingBotKey}:${testingBotSecret}@hub.testingbot.com/wd/hub`;
        break;
    }
    this._connection = new Connection(remote, remoteURI, this.debug);
    this.session = createSession(remote, this._connection, {...options, capabilities});

    this.browser = new Browser(this);
    this.timeOut = new TimeOut(this);

    this.activeWindow = new ActiveWindow(this);
    this.ime = new IME(this);
    this.cookieStorage = new CookieStorage(this);
    this.localStorage = new LocalStorage(this);
    this.sessionStorage = new SessionStorage(this);

    deprecate.property(this, 'browser', 'All properties of browser are now directly available on the Driver object');
  }

  /*
   * Performs a context dependent JSON request for the current session.
   * The result is parsed for errors.
   * @private
   */
  async requestJSON(method: HttpMethod, path: string, body?: Object): Promise<any> {
    const session = await this.session;
    return this._connection.requestWithSession(session, method, path, {json: body});
  }

  /*
   * Get an array of windows for all available windows
   */
  async getWindows(): Promise<Array<WindowHandle>> {
    const windowHandles = await this.requestJSON('GET', '/window_handles');
    return windowHandles.map(windowHandle => {
      return new WindowHandle(this, windowHandle);
    });
  }

  /*
   * Get the current browser orientation
   */
  async getOrientation(): Promise<BrowserOrientation> {
    return this.requestJSON('GET', '/orientation');
  }

  /*
   * Get the current browser orientation
   */
  async setOrientation(orientation: BrowserOrientation): Promise<void> {
    await this.requestJSON('POST', '/orientation', {orientation});
  }

  /*
   * Get the current geo location
   */
  async getGeoLocation(): Promise<{latitude: number, longitude: number, altitude: number}> {
    return await this.requestJSON('GET', '/location');
  }

  /*
   * Set the current geo location
   */
  async setGeoLocation(loc: {latitude: number, longitude: number, altitude: number}): Promise<void> {
    await this.requestJSON('POST', '/location', loc);
  }

  /*
   * Get the status of the html5 application cache
   */
  async getApplicationCacheStatus(): Promise<ApplicationCacheStatus> {
    return await this.requestJSON('GET', '/application_cache/status');
  }

  /*
   * Get the log for a given log type. Log buffer is reset after each request.
   */
  async getLogs(logType: string): Promise<Array<LogEntry>> {
    return await this.requestJSON('POST', '/log', {type: logType});
  }

  /*
   * Get available log types
   */
  async getLogTypes(): Promise<Array<string>> {
    return await this.requestJSON('GET', '/log/types');
  }

  /*
   * End this Driver session
   */
  async dispose(status?: Object): Promise<void> {
    if (status) {
      await this.sauceJobUpdate(status);
    }
    await this.requestJSON('DELETE', '');
  }

  /*
   * Sauce Labs Methods
   */
  async sauceJobUpdate(body: Object): Promise<boolean> {
    const remote: string = this._connection.remote;

    const session = await this.session;

    if (remote.indexOf('saucelabs') === -1) {
      return false;
    }
    if (body === undefined) {
      return true;
    }
    const auth = url.parse(remote).auth;
    if (typeof auth !== 'string') {
      throw new Error('Could not find sauce labs authentication in remote');
    }

    await autoRequest(
      'PUT',
      'http://' + auth + '@saucelabs.com/rest/v1/' + auth.split(':')[0] + '/jobs/' + session.sessionID,
      {json: body},
    );

    return true;
  }
  // TODO: provide instructions for converting async driver to sync driver and visa versersa
}

/*
 * End this Driver session
 *
 * Alias for `dispose`
 * @method quit
 */
(Driver.prototype: any).quit = Driver.prototype.dispose;

async function createSession(remote: string, connection: Connection, options: Options): Promise<Session> {
  if (options.session !== undefined) {
    return options.session;
  }
  const capabilities = {};
  capabilities.desiredCapabilities = options.capabilities || {};
  if (options.requiredCapabilities) {
    capabilities.requiredCapabilities = options.requiredCapabilities;
  }

  const res = await connection.request('POST', '/session', {json: capabilities});

  if (res.statusCode !== 200) {
    switch (remote) {
      case 'saucelabs':
        if (res.statusCode === 401) {
          const err = new Error(
            'Sauce Labs Authentication Failed.\r\nCheck the value of the SAUCE_USERNAME and SAUCE_ACCESS_KEY ' +
              'environment variables exactly match your credentials, you passed in: ' +
              JSON.stringify(options.sauceUsername) +
              ' and ' +
              JSON.stringify(options.sauceAccessKey) +
              '.',
          );
          throw err;
        }
        break;
      case 'browserstack':
        if (res.statusCode === 401) {
          const err = new Error(
            'Browser Stack Authentication Failed.\r\nCheck the value of the BROWSER_STACK_USERNAME and BROWSER_STACK_ACCESS_KEY ' +
              'environment variables exactly match your credentials, you passed in: ' +
              JSON.stringify(options.browserStackUsername) +
              ' and ' +
              JSON.stringify(options.browserStackAccessKey) +
              '.',
          );
          throw err;
        }
        break;
      case 'testingbot':
        if (res.statusCode === 401) {
          const err = new Error(
            'Testing Bot Authentication Failed.\r\nCheck the value of the TESTING_BOT_KEY and TESTING_BOT_SECRET ' +
              'environment variables exactly match your credentials, you passed in: ' +
              JSON.stringify(options.testingBotKey) +
              ' and ' +
              JSON.stringify(options.testingBotSecret) +
              '.',
          );
          throw err;
        }
        break;
    }
    throw new Error(
      'Failed to start a Selenium session. ' +
        remote +
        ' responded with status code ' +
        res.statusCode +
        ':\n' +
        res.body.toString('utf8'),
    );
  }

  const body = JSON.parse(res.body.toString('utf8'));
  if (body.status === 0) {
    return {sessionID: body.sessionId, capabilities: body.value};
  } else {
    throw fromBody(body);
  }
}

const environmentAliases = {
  SAUCE_USERNAME: 'sauceUsername',
  SAUCE_ACCESS_KEY: 'sauceAccessKey',
  BROWSER_STACK_USERNAME: 'browserStackUsername',
  BROWSER_STACK_ACCESS_KEY: 'browserStackAccessKey',
  TESTING_BOT_KEY: 'testingBotkey',
  TESTING_BOT_SECRET: 'testingBotSecret',

  // deprecated aliases
  TESTINGBOT_KEY: 'testingBotkey',
  TESTINGBOT_SECRET: 'testingBotSecret',
};
function addEnvironment(options: Options): Options {
  const result = {...options};

  Object.keys(environmentAliases).forEach(key => {
    if (result[environmentAliases[key]] === undefined && process.env[key]) {
      result[environmentAliases[key]] = process.env[key];
    }
  });

  try {
    const parsedObj = parseEnv(readFileSync('.env.local', 'utf8'));
    Object.keys(environmentAliases).forEach(key => {
      if (result[environmentAliases[key]] === undefined && parsedObj[key]) {
        result[environmentAliases[key]] = parsedObj[key];
      }
    });
  } catch (e) {}

  try {
    const parsedObj = parseEnv(readFileSync('.env', 'utf8'));
    Object.keys(environmentAliases).forEach(key => {
      if (result[environmentAliases[key]] === undefined && parsedObj[key]) {
        result[environmentAliases[key]] = parsedObj[key];
      }
    });
  } catch (e) {}

  return result;
}

addDebugging(Driver);

export default Driver;
