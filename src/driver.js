import type {ApplicationCacheStatus} from './enums/application-cache-statuses';
import type {HttpMethod} from './flow-types/http-method';
import type {Options} from './flow-types/options';
import type {Session} from './flow-types/session-data';
import util from 'util';
import url from 'url';
import {readFileSync} from 'fs';
import {parse as parseEnv} from 'dotenv';
import addDebugging from './add-debugging';
import autoRequest from 'then-request';
import {fromBody} from './utils/errors';
import Connection from './connection';
import Browser from './browser';
import Debug from './debug';
import TimeOut from './time-out';
import Status from './status';
import LogEntry from './log-entry';
import parseResponse from './utils/parse-response';

function getVariables(names: Array<string>): Object {
  const result = {};

  names.forEach(key => result[key] = process.env[key]);

  try {
    const parsedObj = parseEnv(readFileSync('.env', 'utf8'));
    names.forEach(key => result[key] = result[key] || parsedObj[key]);
  } catch (e) {}

  return result;
}
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
   */
  browser: Browser;

  /*
   * Timeout configuration
   */
  timeOut: TimeOut;

  constructor(remote: string, options: Options = {}) {
    this.remote = remote;
    this.options = options;
    this.debug = new Debug(options);
    let remoteURI = remote;
    const capabilities = {...(options.capabilities || {})};
    switch (remote) {
      case 'chromedriver':
        remoteURI = 'http://localhost:9515/';
        break;
      case 'saucelabs':
        const {SAUCE_USERNAME, SAUCE_ACCESS_KEY} = getVariables(['SAUCE_USERNAME', 'SAUCE_ACCESS_KEY']);
        if (!SAUCE_USERNAME || !SAUCE_ACCESS_KEY) {
          throw new Error(
            'To use sauce labs, you must specify SAUCE_USERNAME and SAUCE_ACCESS_KEY in enviornment variables.',
          );
        }
        remoteURI = `http://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.saucelabs.com/wd/hub`;
        break;
      case 'browserstack':
        const {BROWSER_STACK_USERNAME, BROWSER_STACK_ACCESS_KEY} = getVariables([
          'BROWSER_STACK_USERNAME',
          'BROWSER_STACK_ACCESS_KEY',
        ]);
        if (!BROWSER_STACK_USERNAME || !BROWSER_STACK_ACCESS_KEY) {
          throw new Error(
            'To use browserstack, you must specify BROWSER_STACK_USERNAME and SAUCE_ACCESS_KEY in enviornment variables.',
          );
        }
        remoteURI = 'http://hub-cloud.browserstack.com/wd/hub';
        capabilities['browserstack.user'] = BROWSER_STACK_USERNAME;
        capabilities['browserstack.key'] = BROWSER_STACK_ACCESS_KEY;
        break;
      case 'testingbot':
        const {TESTINGBOT_KEY, TESTINGBOT_SECRET} = getVariables(['TESTINGBOT_KEY', 'TESTINGBOT_SECRET']);
        if (!TESTINGBOT_KEY || !TESTINGBOT_SECRET) {
          throw new Error(
            'To use testingbot, you must specify TESTINGBOT_KEY and TESTINGBOT_SECRET in enviornment variables.',
          );
        }
        remoteURI = `http://${TESTINGBOT_KEY}:${TESTINGBOT_SECRET}@hub.testingbot.com/wd/hub`;
        break;
    }
    this._connection = new Connection(remoteURI, this.debug);
    this.session = createSession(this._connection, {...options, capabilities});

    this.browser = new Browser(this);
    this.timeOut = new TimeOut(this);
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
   * Get the status of the html5 application cache
   */
  async getApplicationCacheStatus(): Promise<ApplicationCacheStatus> {
    return await this.requestJSON('GET', '/application_cache/status');
  }

  /*
   * Get the log for a given log type. Log buffer is reset after each request.
   */
  async getLogs(logType: string): Promise<Array<LogEntry>> {
    const logs = await this.requestJSON('POST', '/log', {type: logType});

    return logs.map(logEntry => new LogEntry(logEntry));
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

async function createSession(connection: Connection, options: Options): Promise<Session> {
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
    console.dir(res.headers);
    throw new Error(
      'Failed to start a Selenium session. Server responded with status code ' + res.statusCode + ':\n' +
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
