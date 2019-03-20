import ApplicationCacheStatus from './enums/application-cache-statuses';
import BrowserOrientation from './enums/browser-orientations';
import {Options} from './flow-types/options';
import {Session} from './flow-types/session-data';
import {LogEntry} from './log-entry';
import {parse as parseURL} from 'url';
import depd = require('depd');
import spawn = require('cross-spawn');
import addDebugging from './add-debugging';
import autoRequest, {HttpVerb} from 'then-request';
import {fromBody} from './utils/errors';
import Connection from './connection';
import Browser from './browser';
import Debug from './debug';
import TimeOut from './time-out';
import ActiveWindow from './active-window';
import IME from './ime';
import CookieStorage from './cookie-storage';
import LocalStorage from './local-storage';
import SessionStorage from './session-storage';
import WindowHandle from './window-handle';
import resolveConfig from './config';

const deprecate = depd('cabbie');

/**
 * Create a new Driver session, remember to call `.dispose()`
 * at the end to terminate the session.
 */
class Driver {
  /**
   * The current session.  You can pass this session to createCabbieDriver to convert
   * between sync and async drivers.  e.g.
   *
   * ```js
   * const driver = createCabbieDriver(oldDriver.remote, {...oldDriver.options, session: oldDriver.session});
   * ```
   */
  session: Promise<Session>;

  /**
   * @private
   */
  debug: Debug;

  /**
   * @private
   */
  _connection: Connection;

  /**
   * The location of the selenium server
   */
  remote: string;

  /**
   * The options that were originally passed in to createCabbieDriver
   */
  options: Options;

  /**
   * The browser object.
   *
   * @private
   */
  browser: Browser;

  /**
   * Timeout configuration
   */
  timeOut: TimeOut;

  /**
   * The currently active window.  This has most of the methods to interact with
   * the the current page.
   */
  activeWindow: ActiveWindow;

  /**
   * Get the IME object.
   */
  ime: IME;

  /**
   * Get the Cookie-Storage object.
   */
  cookieStorage: CookieStorage;

  /**
   * Get the Local-Storage object.
   */
  localStorage: LocalStorage;

  /**
   * Get the Session-Storage object.
   */
  sessionStorage: SessionStorage;

  _closeTaxiRank: any;

  constructor(remote: string, options: Options = {}) {
    const resolved = resolveConfig(remote, options);
    this.remote = resolved.remote;
    this.options = resolved.options;
    this.debug = new Debug(resolved.options);
    this._connection = new Connection(
      resolved.remote,
      resolved.remoteURI,
      this.debug,
    );
    this.session = this._createSession(
      resolved.remote,
      this._connection,
      resolved.options,
    );

    this.browser = new Browser(this, resolved.options);
    this.timeOut = new TimeOut(this);

    this.activeWindow = new ActiveWindow(this, resolved.options);
    this.ime = new IME(this);
    this.cookieStorage = new CookieStorage(this);
    this.localStorage = new LocalStorage(this);
    this.sessionStorage = new SessionStorage(this);

    deprecate.property(
      this,
      'browser',
      'All properties of browser are now directly available on the Driver object',
    );
  }
  async _createSession(
    remote: string,
    connection: Connection,
    options: Options,
  ): Promise<Session> {
    if (remote === 'taxirank') {
      this._closeTaxiRank = await startTaxiRank(connection);
    }
    return createSession(remote, this._connection, options);
  }

  /**
   * Performs a context dependent JSON request for the current session.
   * The result is parsed for errors.
   * @private
   */
  async requestJSON(method: HttpVerb, path: string, body?: any): Promise<any> {
    const session = await this.session;
    return this._connection.requestWithSession(session, method, path, {
      json: body,
    });
  }

  /**
   * Get an array of windows for all available windows
   */
  async getWindows(): Promise<Array<WindowHandle>> {
    const windowHandles = await this.requestJSON('GET', '/window_handles');
    return windowHandles.map((windowHandle: string) => {
      return new WindowHandle(this, windowHandle);
    });
  }

  /**
   * Get the current browser orientation
   */
  async getOrientation(): Promise<BrowserOrientation> {
    return this.requestJSON('GET', '/orientation');
  }

  /**
   * Get the current browser orientation
   */
  async setOrientation(orientation: BrowserOrientation): Promise<void> {
    await this.requestJSON('POST', '/orientation', {orientation});
  }

  /**
   * Get the current geo location
   */
  async getGeoLocation(): Promise<{
    latitude: number;
    longitude: number;
    altitude: number;
  }> {
    return await this.requestJSON('GET', '/location');
  }

  /**
   * Set the current geo location
   */
  async setGeoLocation(loc: {
    latitude: number;
    longitude: number;
    altitude: number;
  }): Promise<void> {
    await this.requestJSON('POST', '/location', loc);
  }

  /**
   * Get the status of the html5 application cache
   */
  async getApplicationCacheStatus(): Promise<ApplicationCacheStatus> {
    return await this.requestJSON('GET', '/application_cache/status');
  }

  /**
   * Get the log for a given log type. Log buffer is reset after each request.
   */
  async getLogs(logType: string): Promise<Array<LogEntry>> {
    return await this.requestJSON('POST', '/log', {type: logType});
  }

  /**
   * Get available log types
   */
  async getLogTypes(): Promise<Array<string>> {
    return await this.requestJSON('GET', '/log/types');
  }

  /**
   * End this Driver session
   */
  async dispose(status?: any): Promise<void> {
    if (status) {
      await this.sauceJobUpdate(status);
    }
    await this.requestJSON('DELETE', '');
    if (this._closeTaxiRank) {
      this._closeTaxiRank();
    }
  }

  /**
   * Sauce Labs Methods
   */
  async sauceJobUpdate(body: any): Promise<boolean> {
    const remote: string = this._connection.remote;

    const session = await this.session;

    if (remote.indexOf('saucelabs') === -1) {
      return false;
    }
    if (body === undefined) {
      return true;
    }
    const auth = parseURL(remote).auth;
    if (typeof auth !== 'string') {
      throw new Error('Could not find sauce labs authentication in remote');
    }

    await autoRequest(
      'PUT',
      'http://' +
        auth +
        '@saucelabs.com/rest/v1/' +
        auth.split(':')[0] +
        '/jobs/' +
        session.sessionID,
      {json: body},
    );

    return true;
  }
  // TODO: provide instructions for converting async driver to sync driver and visa versersa
}

/**
 * End this Driver session
 *
 * Alias for `dispose`
 * @method quit
 */
(Driver.prototype as any).quit = Driver.prototype.dispose;

async function startTaxiRank(connection: Connection): Promise<() => void> {
  let started = false;
  try {
    const res = await connection.request('GET', '/version', {noRetries: true});
    if (res.statusCode === 200) {
      const version = JSON.parse(res.body.toString('utf8'));
      const expectedVersion = require('taxi-rank/package.json').version;
      started = version === expectedVersion;
    }
  } catch (ex) {}
  if (process.env.CI) {
    if (started) return () => {};
    const taxiRank = spawn(
      process.execPath,
      [require.resolve('./taxi-rank-ci.js')],
      {
        stdio: ['inherit', 'inherit', 'inherit'],
      },
    );
    return () => taxiRank.kill();
  }
  if (!started) {
    console.log('starting taxi rank');
    spawn(process.execPath, [require.resolve('./taxi-rank.js')], {
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore'],
    }).unref();
    const startTime = Date.now();
    try {
      await connection.request('GET', '/version');
    } catch (ex) {
      const endTime = Date.now();
      console.log(
        'Failed to start a detached server after ' +
          Math.round((endTime - startTime) / 1000) +
          ' seconds.',
      );
      console.log('Starting slower, attached server.');
      spawn(process.execPath, [require.resolve('./taxi-rank.js')], {
        stdio: ['inherit', 'inherit', 'inherit'],
      });
    }
  }

  // this could be done in process for async mode, but must be a separate process for sync mode
  const logger = spawn(
    process.execPath,
    [require.resolve('./taxi-rank-log.js')],
    {
      stdio: ['inherit', 'inherit', 'inherit'],
    },
  );

  return () => {
    logger.kill();
  };
}
async function createSession(
  remote: string,
  connection: Connection,
  options: Options,
): Promise<Session> {
  if (options.session !== undefined) {
    return options.session;
  }
  const capabilities: any = {};
  capabilities.desiredCapabilities = options.capabilities || {};
  if (options.requiredCapabilities) {
    capabilities.requiredCapabilities = options.requiredCapabilities;
  }

  const res = await connection.request('POST', '/session', {
    json: capabilities,
  });

  if (res.statusCode !== 200) {
    switch (remote) {
      case 'saucelabs':
        if (res.statusCode === 401) {
          const err = new Error(
            'Sauce Labs Authentication Failed.\r\nCheck the value of the SAUCE_USERNAME and SAUCE_ACCESS_KEY ' +
              'environment variables exactly match your credentials, you passed in: ' +
              JSON.stringify(options.sauceUsername as any) +
              ' and ' +
              JSON.stringify(options.sauceAccessKey as any) +
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
              JSON.stringify(options.browserStackUsername as any) +
              ' and ' +
              JSON.stringify(options.browserStackAccessKey as any) +
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
              JSON.stringify(options.testingBotKey as any) +
              ' and ' +
              JSON.stringify(options.testingBotSecret as any) +
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

addDebugging(Driver);

export default Driver;
