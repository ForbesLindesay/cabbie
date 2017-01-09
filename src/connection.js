import type {HttpMethod} from './flow-types/http-method';
import type {WebdriverResponse} from './flow-types/webdriver-response';
import type {HttpResponse} from './flow-types/http-response';
import type Session from './session';
import autoRequest from 'then-request';
import parseResponse from './utils/parse-response';

class Connection {
  remote: string;

  constructor(remote: string) {
    this.remote = remote;
  }
  /**
   * Session request with automatic parsing for errors
   */
  async requestWithSession(
    session: Session,
    method: HttpMethod,
    uri: string,
    options?: Object,
  ): Promise<WebdriverResponse> {
    if (!/^https?\:\:\/\//.test(uri)) {
      uri = '/session/' + session.id() + uri;
    }

    const response = this.request(method, uri, options);
    return parseResponse(response);
  }

  async request(method: HttpMethod, uri: string, options?: Object): Promise<HttpResponse> {
    if (!/^https?\:\:\/\//.test(uri)) {
      uri = this.remote + uri;
    }

    const response = await autoRequest(method, uri, options);

    return response;
  }
}
export default Connection;


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
