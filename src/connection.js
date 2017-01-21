import type {HttpMethod} from './flow-types/http-method';
import type {WebdriverResponse} from './flow-types/webdriver-response';
import type {HttpResponse} from './flow-types/http-response';
import type {Session} from './flow-types/session-data';
import type Debug from './debug';
import autoRequest from 'then-request';
import parseResponse from './utils/parse-response';

class Connection {
  /*
   * The url of the selenium web-driver server
   */
  remote: string;

  /*
   * Reference to the debug context
   *
   * @private
   */
  debug: Debug;
  constructor(remote: string, debug: Debug) {
    this.remote = remote.replace(/\/$/, '');
    this.debug = debug;
  }
  /*
   * Session request with automatic parsing for errors
   */
  async requestWithSession(
    session: Session,
    method: HttpMethod,
    uri: string,
    options?: Object,
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
  async request(method: HttpMethod, uri: string, options?: Object): Promise<HttpResponse> {
    if (!/^https?\:\:\/\//.test(uri)) {
      uri = this.remote + uri;
    }

    let lastEx = null;
    for (let i = 0; i < 10; i++) {
      try {
        this.debug.onRequest({method, uri, options});
        const response = await autoRequest(method, uri, options);
        this.debug.onResponse(response);
        return response;
      } catch (ex) {
        lastEx = ex;
        // TODO: sleep for 100ms, then 1000ms, then 2000ms, 3000ms and so on
      }
    }

    throw lastEx;
  }
}
export default Connection;
