import {HttpMethod} from './flow-types/http-method';
import {WebdriverResponse} from './flow-types/webdriver-response';
import {HttpResponse} from './flow-types/http-response';
import {Session} from './flow-types/session-data';
import Debug from './debug';
import autoRequest from 'then-request';
import autoSleep from './utils/then-sleep';
import parseResponse from './utils/parse-response';

class Connection {
  /*
   * The name or url of the selenium webdriver server (e.g. 'chromedriver')
   */
  remote: string;
  /*
   * The url of the selenium web-driver server
   */
  remoteURI: string;

  /*
   * Reference to the debug context
   *
   * @private
   */
  debug: Debug;
  constructor(remote: string, remoteURI: string, debug: Debug) {
    this.remote = remote;
    this.remoteURI = remoteURI.replace(/\/$/, '');
    this.debug = debug;
  }
  /*
   * Session request with automatic parsing for errors
   */
  async requestWithSession(
    session: Session,
    method: HttpMethod,
    uri: string,
    options?: any,
  ): Promise<WebdriverResponse> {
    if (!/^https?\:\:\/\//.test(uri)) {
      uri = '/session/' + session.sessionID + uri;
    }

    const response = await this.request(method, uri, options);
    return parseResponse(response);
  }

  /*
   * Make a request without using the current session.
   */
  async request(method: HttpMethod, uri: string, options?: any): Promise<HttpResponse> {
    if (!/^https?\:\:\/\//.test(uri)) {
      uri = this.remoteURI + uri;
    }

    let lastEx = null;
    const maxAttempts = options && options.noRetries ? 1 : 10;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        this.debug.onRequest({method, uri, options});
        const response = await autoRequest(method, uri, options);
        this.debug.onResponse(response);
        return response;
      } catch (ex) {
        lastEx = ex;
        // sleep for 100ms, 200ms, 300ms, 400ms  and so on
        await autoSleep(i * 100 + 100);
      }
    }
    if (!lastEx) {
      // this code sould be unreachable
      throw new Error('Unknown error');
    }
    const err = improveError(this.remote, lastEx);
    (err as any).code = (lastEx as any).code;
    throw err;
  }
}

function improveError(remote: string, err: Error) {
  switch (remote) {
    case 'chromedriver':
      if ((err as any).code === 'ECONNREFUSED') {
        return new Error(
          'Could not connect to chromedriver.\r\nThe easiest way to use chromedriver is to download the latest  ' +
            'release from http://chromedriver.chromium.org/downloads (just look for the highest version ' +
            'number), then run `./chromedriver` in a separate terminal.',
        );
      }
      break;
    case 'taxirank':
      if ((err as any).code === 'ECONNREFUSED') {
        return new Error(
          'Could not connect to taxirank.\r\nThe easiest way to use taxirank is to run:\r\n\r\n' +
            '  npm install -g taxi-rank\r\n  taxi-rank\r\n\r\n' +
            'in your command line/terminal application.',
        );
      }
      break;
    case 'saucelabs':
      if ((err as any).code === 'ECONNREFUSED' || (err as any).code === 'ENOTFOUND') {
        return new Error(
          'Could not connect to saucelabs.\r\nMake sure you are connected to the internet. If you are connected to ' +
            'the internet, you could check their status page at https://status.saucelabs.com/',
        );
      }
      break;
    case 'browserstack':
      if ((err as any).code === 'ECONNREFUSED' || (err as any).code === 'ENOTFOUND') {
        return new Error(
          'Could not connect to browserstack.\r\nMake sure you are connected to the internet. If you are connected to ' +
            'the internet, you could check their twitter feed at https://twitter.com/browserstack',
        );
      }
      break;
    case 'testingbot':
      if ((err as any).code === 'ECONNREFUSED' || (err as any).code === 'ENOTFOUND') {
        return new Error(
          'Could not connect to testingbot.\r\nMake sure you are connected to the internet. If you are connected to ' +
            'the internet, you could check their status page at https://testingbot.statuspage.io/',
        );
      }
      break;
  }
  return err;
}

export default Connection;
