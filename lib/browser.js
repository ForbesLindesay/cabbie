'use strict';

var logMethods = require('./log');
var url = require('url');
var JSON = require('./json');
var when = require('./when');
var errors = require('./errors');
var type = require('./type');

var Element = require('./element');

//////////////////////////
// Initialization Logic //
//////////////////////////

module.exports = Browser;

/**
 * Create a new browser session, remember to call `.dispose()`
 * at the end to terminate the session.
 *
 * @param {String|Object} remote
 * @param {Object}        capabilities
 * @param {Object}        options
 */
function Browser(remote, capabilities, options) {
  type('remote', remote, 'String|Object');
  type('capabilities', capabilities, 'Object');
  type('options', options, 'Object');
  type('options.mode', options.mode, 'String');
  switch (options.mode) {
    case 'async':
      this._request_internal = require('promise').denodeify(require('request'));
      break;
    case 'sync':
      this._request_internal = require('request-sync');
      break;
    default:
      var err = new Error('Expected options.mode to be "async" or "sync" but got '
                          + JSON.stringify(options.mode));
      throw err;
  }
  this._remote = remote;
  this._capabilities = capabilities;
  this._options = options;
  this._sessionID = when(this._request_internal(withRemote(this._remote, {
    method: 'POST',
    path: '/session',
    body: JSON.stringify({desiredCapabilities: capabilities})
  })), extractSessionID);
}
Browser.prototype._log = function (event) {
  if (!this._logListeners) return;
  if (event.method === 'debug') return;
  if (!event.target) {
    event.target = 'Browser';
  }
  when.done(this._sessionID, function (sessionID) {
    event.sessionID = this.sessionID;
    for (var i = 0; i < this._logListeners.length; i++) {
      this._logListeners[i](event);
    }
  }.bind(this));
};
Browser.prototype._request = function (method, path, body) {
  var remote = this._remote;
  var request = this._request_internal.bind(this);
  return when(this._sessionID, makeRequest);
  function makeRequest(sessionID) {
    var raw = typeof body === 'string' || Buffer.isBuffer(body);
    return request(withRemote(remote, {
      method: method,
      uri: path[0] === '/' || path === '' ? undefined : path,
      path: path[0] === '/' || path === '' ? '/session/' + sessionID + path : undefined,
      body: (raw || body === undefined ? body : JSON.stringify(body))
    }));
  }
};
Browser.prototype._requestJSON = function (method, path, body) {
  return when(this._request(method, path, body), parseResponse);
};

////////////////////
// Public Methods //
////////////////////

Browser.prototype.request = Browser.prototype._request;
Browser.prototype.requestJSON = Browser.prototype._requestJSON;
Browser.prototype.debug = function (handler) {
  type('handler', handler, 'Function');
  this._logListeners = this._logListeners || [];
  this._logListeners.push(handler);
  return this;
};

/**
 * Navigates the browser to the specified path
 *
 *  - if `path` begins with a "/" it is relative to `options.base`
 *  - if `path` begins with "http" it is absolute
 *  - otherwise it is relative to the current path
 *
 * @param {String} path
 */
Browser.prototype.navigateTo = function (path) {
  type('path', path, 'String');
  if (path[0] === '/') {
    path = this._options.base.replace(/\/$/, '') + path;
  } else if (path.indexOf('http') !== 0) {
    return when(this.getUrl(), function (base) {
      return this.navigateTo(url.resolve(base, path));
    }.bind(this));
  }
  return this._requestJSON('POST', '/url', {url: path});
}

/**
 * Get the current url that the browser is displaying
 *
 * @return {String}
 */
Browser.prototype.getUrl = function () {
  return this._requestJSON('GET', '/url');
};

/**
 * Refreshes the browser
 */
Browser.prototype.refresh = function () {
  return this._requestJSON('POST', '/refresh');
};

/**
 * Get an element via a CSS selector,
 * will throw an error if the element
 * does not exist.
 *
 * @param {String} selector
 * @return {Element}
 */
Browser.prototype.getElement = function (selector) {
  type('selector', selector, 'String');
  return when(this._requestJSON('POST', '/element', {
    using: 'css selector',
    value: selector
  }), function (element) {
    return new Element(selector, element, this);
  }.bind(this));
};

/**
 * Get elements via a CSS selector.
 *
 * @param {String} selector
 * @return {Array.<Element>}
 */
Browser.prototype.getElements = function (selector) {
  type('selector', selector, 'String');
  return when(this._requestJSON('POST', '/elements', {
    using: 'css selector',
    value: selector
  }), function (elements) {
    return elements.map(function (element) {
      return new Element(selector, element, this);
    }.bind(this));
  }.bind(this));
};

/**
 * Get the capabilities of the current browser
 */
Browser.prototype.capabilities = function () {
  return this._requestJSON('');
};

/**
 * Close the window
 */
Browser.prototype.close = function () {
  return this._requestJSON('DELETE', '/window')
};

/**
 * End this browser session
 */
Browser.prototype.dispose = function () {
  return this._requestJSON('DELETE', '');
};

logMethods(Browser.prototype);
///////////////
// Utilities //
///////////////

function withRemote(remote, options) {
  if (typeof remote === 'string') {
    remote = {base: remote};
  }

  var request = {};
  for (var key in options) {
    if (key !== 'path') {
      request[key] = options[key];
    }
  }

  for (var key in remote) {
    if (key !== 'base' && request[key] === undefined) {
      request[key] = remote[key];
    }
  }

  if (request.uri === undefined && request.url === undefined) {
    request.uri = remote.base.replace(/\/$/, '') + options.path;
  }

  return request;
}

/**
 * Extract a session ID from a server response
 *
 * @param {Response} res
 * @return {SessionID}
 */
function extractSessionID(res) {
  if (res.statusCode !== 200) {
    var err = new Error('Failed to start Selinium session. '
                        + 'Server responded with status code '
                        + res.statusCode);
    throw err;
  }
  var body = JSON.parse(res.body);
  if (body.status === 0) {
   return body.sessionId;
  } else {
    var err = new Error(errors.fromBody(body));
    throw err;
  }
}

/**
 * Parse a response, throwing errors if the status suggests it
 *
 * @param {Response} res
 * @return {*}
 */
function parseResponse(res) {
  if (res.statusCode !== 200) {
    var err = new Error('Server responded with status code '
                        + res.statusCode);
    throw err;
  }
  var body = JSON.parse(res.body);
  if (body.status === 0) {
   return body.value;
  } else {
    var err = new Error(errors.fromBody(body));
    throw err;
  }
}
