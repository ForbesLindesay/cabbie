'use strict';

var when = require('./when');
var errors = require('./errors');
var type = require('./type');

module.exports = Connection;

/**
 * Connection object
 *
 * @param {String|Object} remote
 * @param {String} mode
 * @constructor
 */
function Connection (remote, mode) {
  this._remote = remote;
  this._request_internal = createInternalConnection(mode);
}


////////////////////
// Public Methods //
////////////////////

/**
 * Session request with automatic parsing for errors
 *
 * @param {Session} session
 * @param {String} method
 * @param {String} path
 * @param {*} body
 * @returns {*}
 */
Connection.prototype.cabbieRequest = function (session, method, path, body) {
  return when(this.sessionRequest(session, method, path, body), parseResponse);
};

/**
 * Session request returning raw value
 *
 * @param {Session} session
 * @param {String} method
 * @param {String} path
 * @param {*} body
 * @returns {Object}
 */
Connection.prototype.sessionRequest = function (session, method, path, body) {
  var request = this.request;

  function makeRequest (localSession) {

    var raw = typeof body === 'string' || Buffer.isBuffer(body), rawBody = (raw || body === undefined ? body : JSON.stringify(body));

    return request(method, path[0] === '/' || path === '' ? undefined : path, path[0] === '/' || path === '' ? '/session/' + localSession.getId() + path : undefined, rawBody, { 'Content-Type': 'application/json;charset=UTF-8' });
  }

  return when(session, makeRequest);
};

/**
 * Plain request
 *
 * @param {String} method
 * @param {String|undefined} [uri]
 * @param {String} path
 * @param {String} body
 * @param {Object} headers
 * @returns {Buffer}
 */
Connection.prototype.request = function (method, uri, path, body, headers) {
  return this._request_internal(withRemote(this._remote, {
    method: method,
    uri: uri || undefined,
    path: path,
    body: body,
    headers: headers || {}
  }));
};


/////////////////////
// Private Methods //
/////////////////////

/**
 * Parse a response, throwing errors if the status suggests it
 *
 * @param {Object} res
 * @return {*}
 */
function parseResponse (res) {
  var body;

  if (res.statusCode >= 300 || res.statusCode < 200) {
    throw new Error('Server responded with status code (' + res.statusCode + '):\n' + res.body);

  } else if (res.statusCode > 500 || res.statusCode <= 400) { // 400s
    throw new Error('Invalid request (' + res.statusCode + '):\n' + res.body);

  } else if (res.statusCode > 600 || res.statusCode <= 500) { // 500s
    body = JSON.parse(res.body);
    throw new Error("Failed command (" + res.statusCode + "):\n" + body.message + (body.class ? "\nClass: " + body.class : "") + (body.stackTrace ? "\nStack-trace:\n " + stringifyStackTrace(body.stackTrace) : ""));

  } else if (res.statusCode === 200) {
    body = JSON.parse(res.body);

    if (body.status === 0) {
      return body.value;
    } else {
      throw new Error(errors.fromBody(body));
    }

  } else {
    throw new Error('Unknown status code (' + res.statusCode + '):\n' + res.body);
  }
}

/**
 * Turns a selenium stack-trace into a string
 *
 * @param {Array.<Object>} stackTrace
 * @returns {String}
 */
function stringifyStackTrace (stackTrace) {

  var i, len, result = [];

  for (i = 0, len = stackTrace.length; i < len; i++) {
    result.push(stackTrace[i].methodName + "::" + stackTrace[i].className + " (" + stackTrace[i].fileName + ":" + stackTrace[i].lineNumber + ")");
  }

  return result.join("\n");
}


/**
 * Processes connection redirects over HTTP
 *
 * @param {Function} fn
 * @returns {*}
 */
function withRedirects (fn) {

  return function recurse (options) {

    type('options', options, 'Object');
    type('options.uri', options.uri, 'String');

    return when(fn.call(this, options), function (res) {

      if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) && res.headers.location) {
        return recurse({ uri: url.resolve(options.uri, res.headers.location) });
      }

      return res;
    });
  }
}

/**
 * Structures remote options for request
 *
 * @param {String|Object} remote
 * @param {Object} options
 * @returns {Object}
 */
function withRemote (remote, options) {

  var key, request = {};

  if (typeof remote === 'string') {
    remote = { base: remote };
  }

  for (key in options) {
    if (options.hasOwnProperty(key) && (key !== 'path')) {
      request[key] = options[key];
    }
  }

  for (key in remote) {
    if (remote.hasOwnProperty(key) && (key !== 'base' && request[key] === undefined)) {
      request[key] = remote[key];
    }
  }

  if (request.uri === undefined && request.url === undefined) {
    request.uri = remote.base.replace(/\/$/, '') + options.path;
  }

  return request;
}


/**
 * Create connection object according to mode-type
 *
 * @param {String} mode
 * @returns {*}
 */
function createInternalConnection (mode) {

  var result;

  switch (mode) {
    case 'async':
      result = withRedirects(require('promise').denodeify(require('request')));
      break;
    case 'sync':
      result = withRedirects(require('request-sync'));
      break;
    default:
      throw new Error('Expected options.mode to be "async" or "sync" but got ' + JSON.stringify(mode));
  }

  return result;
}

