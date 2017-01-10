import type {ApplicationCacheStatus} from './enums/application-cache-status';
import type {HttpMethod} from './flow-types/http-method';
import util from "util";
import url from "url";
import autoRequest from 'then-request';
import {fromBody} from "./utils/errors";
import Connection from "./connection";
import Browser from "./browser";
import TimeOut from "./time-out";
import Session from "./session";
import Status from "./status";
import LogEntry from "./log-entry";
import SessionStorage from "./session-storage";
import parseResponse from './utils/parse-response';

/**
 * Create a new Driver session, remember to call `.dispose()`
 * at the end to terminate the session.
 */
class Driver {
  session: Promise<Session>;
  _connection: Connection;
  _options: Object;

  /**
   * @param {String} remote URL to selenium-server
   * @param {Object} capabilities See capabilities in {{#crossLink "Session"}}{{/crossLink}}
   * @param {Object} options
   * @param {String} options.mode Mode of web-driver requests (Driver.MODE_SYNC|Driver.MODE_ASYNC)
   * @param {String} [options.base] Base-url
   * @param {String} [options.sessionID]
   */
  constructor(remote: string, capabilities: Object, options: Object) {
    options.remote = remote;
    options.capabilities = capabilities;
    this._options = options;
    this._connection = new Connection(remote, options.mode);

    if (options.sessionID) {
      // TODO: fix this for sync mode
      this.session = this._createSessionFromExistingID(options.sessionID, capabilities);
    } else {
      this.session = this._createSession(capabilities);
    }
  }

  async _createSessionFromExistingID(sessionId: string, capabilities: Object): Promise<Session> {
    return new Session({sessionId, capabilities});
  }
  async _createSession(desiredCapabilities: Object, requiredCapabilities?: Object): Promise<Session> {
    const capabilities = {};
    capabilities.desiredCapabilities = desiredCapabilities;
    if (requiredCapabilities) {
      capabilities.requiredCapabilities = requiredCapabilities;
    }

    const res = await this._connection.request('POST', '/session', {
      json: capabilities
    });

    return new Session(extractSessionData(res));
  }

  /**
   * Performs a context dependent JSON request for the current session.
   * The result is parsed for errors.
   */
  async requestJSON(method: HttpMethod, path: string, body?: Object): Promise<any> {
    const session = await this.session;
    return this._connection.requestWithSession(session, method, path, {json: body});
  }

  /**
   * Gets the browser object.
   */
  get browser(): Browser {
    return new Browser(this);
  }

  /**
   * Get the time-out object.
   */
  get timeOut(): TimeOut {
    return new TimeOut(this);
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
    const logs = await this.requestJSON('POST', '/log', {
      type: logType
    });

    return logs.map(logEntry => new LogEntry(logEntry));
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
  async dispose(status?: Object): Promise<void> {
    if (status) {
      await this.sauceJobUpdate(status);
    }
    await this.requestJSON('DELETE', '');
  }

  /**
   * Get the Session-Storage object.
   */
  get sessionStorage(): SessionStorage {
    return new SessionStorage(this);
  }

  /**
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

    await autoRequest('PUT', 'http://' + auth + '@saucelabs.com/rest/v1/' + auth.split(':')[0] + '/jobs/' + session.id(), {
      json: body
    });

    return true;
  }

  // TODO: provide instructions for converting async driver to sync driver and visa versersa
}


////////////
// Events //
////////////

/**
 * Fired when a request is made
 *
 * @event request
 * @param {Object} request Request options
 */

/**
 * Fired when a response is received
 *
 * @event response
 * @param {Object} response Response data
 */

/**
 * Fired when a public method is called
 *
 * @event method-call
 * @param {Object} event Method event data
 */

/**
 * Fired when the session is destroyed
 *
 * @event disposed
 */


/**
 * End this Driver session
 *
 * Alias for `dispose`
 * @method quit
 */
(Driver.prototype: any).quit = Driver.prototype.dispose;


///////////////
// Utilities //
///////////////

/**
 * Extract a session ID and the accepted capabilities from a server response
 */
function extractSessionData(res: Object): {sessionId: String, capabilities: Object} {
  var body;

  if (res.statusCode !== 200) {
    console.dir(res.headers);
    throw new Error('Failed to start a Selenium session. Server responded with status code ' + res.statusCode + ':\n' + res.body);
  }

  body = JSON.parse(res.body);
  if (body.status === 0) {
    return { sessionId: body.sessionId, capabilities: body.value };
  } else {
    throw new Error(fromBody(body));
  }
}

/**
 * Setup debug output
 */
 /*
async function setupDebug(driver: Driver, options: object) {
    var indentation = 0;

    function stringFill (filler, length) {
        var buffer = new Buffer(length);
        buffer.fill(filler);
        return buffer.toString();
    }

    function getIndentation (add) {
        return stringFill(' ', (indentation + add) * 2);
    }

    if (options.debug) {
        if (options.httpDebug) {
            driver.on('request', function (req) {
                console.log(getIndentation(1) + "Request:  ", JSON.stringify(req).substr(0, 5000));
            });
            driver.on('response', function (res) {
                var copy = {};
                Object.keys(res).forEach(function (key) { copy[key] = res[key] });
                copy.body = res.body.toString('utf8')
                console.log(getIndentation(1) + "Response: ", JSON.stringify(copy).substr(0, 5000));
            });
        }
        driver.on('method-call', function (event) {
            var msg = event.target;
            indentation = event.indentation;
            if (event.selector) {
                msg += '(' + util.inspect(event.selector, {colors: true}) + ')';
            }
            msg += '.' + event.name;
            msg += '(' + event.args.map(function (a) {
                return util.inspect(a, {colors: true});
            }).join(', ') + ')';
            if (event.result && typeof event.result !== 'object') {
                msg += ' => ' + util.inspect(event.result, {colors: true});
            }
            console.log(getIndentation(0) + '[' + (event.state + stringFill(' ', 5)).substr(0, 5) + '] ' + msg);
            if (event.state.toLowerCase() !== 'start') {
                console.log(getIndentation(0) + stringFill('-', 50));
            }
        });
    }
}
*/
export default Driver;
