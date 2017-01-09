import type { WebdriverResponse } from './flow-types/webdriver-response';
import { EventEmitter } from 'events';
import autoRequest from './auto-request/async';

import parseResponse from './utils/parse-response';

class Connection extends EventEmitter {
  _remote: string;

  constructor(remote: string) {
    super();
    this._remote = remote;
  }
  /**
   * Session request with automatic parsing for errors
   */
  async requestWithSession(sessionPromise: Session, method: HttpMethod, uri: string, options?: Object): Promise<WebdriverResponse> {
    const session = await sessionPromise;

    if (!/^https?\:\:\/\//.test(uri)) {
      uri = '/session/' + session.id() + uri;
    }

    const response = this.request(method, uri, options);
    return parseResponse(response);
  }

  async request(method: HttpMethod, uri: string, options?: Object): Promise<HttpResponse> {
    if (!/^https?\:\:\/\//.test(uri)) {
      uri = this._remote + uri;
    }

    this.emit('request', { method, uri, options });
    const response = await autoRequest(method, uri, options);
    this.emit('response', response);

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