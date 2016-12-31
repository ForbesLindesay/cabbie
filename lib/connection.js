'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var url = require('url');
var Promise = require('promise');

var when = require('./when');
var errors = require('./errors');
var type = require('./type');

module.exports = Connection;

/**
 * Connection object
 *
 * @constructor
 * @class Connection
 * @module System
 * @param {String} remote
 * @param {String} mode
 */
function Connection (remote, mode) {
  EventEmitter.call(this);

  if (remote[remote.length - 1] === '/') {
    remote = remote.substr(0, remote.length - 1);
  }
  this._remote = remote;
  this._request_internal = createInternalConnection(mode);
}
util.inherits(Connection, EventEmitter);


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


////////////////////
// Public Methods //
////////////////////

/**
 * Session request with automatic parsing for errors
 *
 * @method cabbieRequest
 * @param {Session} session
 * @param {String} method
 * @param {String} uri
 * @param {Object} [opts]
 * @return {*}
 */
Connection.prototype.cabbieRequest = function (session, method, uri, opts) {
  return when(this.sessionRequest(session, method, uri, opts), parseResponse);
};

/**
 * Session request returning raw value
 *
 * @method sessionRequest
 * @param {Session} session
 * @param {String} method
 * @param {String} uri
 * @param {Object} [opts]
 * @return {HttpResponseObject}
 */
Connection.prototype.sessionRequest = function (session, method, uri, opts) {
  var self = this;

  function makeRequest (session) {
    if (!/^https?\:\:\/\//.test(uri)) {
      uri = '/session/' + session.id() + uri;
    }

    return self.request(method, uri, opts);
  }

  return when(session, makeRequest);
};

/**
 * Plain request
 *
 * @method request
 * @param {String} method
 * @param {String} uri
 * @param {Object} [opts]
 * @return {HttpResponseObject}
 */
Connection.prototype.request = function (method, uri, options) {
  if (!/^https?\:\:\/\//.test(uri)) {
    uri = this._remote + uri;
  }

  this.emit('request', {
    method: method,
    uri: uri,
    options: options
  });

  return when(this._request_internal(method, uri, options), function (response) {
    this.emit('response', response);
    return response;
  }.bind(this));
};


/////////////////////
// Private Methods //
/////////////////////

Connection._parseResponse = parseResponse;

/**
 * Parse a response, throwing errors if the status suggests it
 *
 * @param {Object} res
 * @return {*}
 */
function parseResponse (res) {
  var body;

  if (res.statusCode >= 0 && res.statusCode < 100) {
    throw new Error('Server responded with status code (' + res.statusCode + '):\n' + res.body);

  } else if (res.statusCode >= 400 && res.statusCode < 500) { // 400s
    throw new Error('Invalid request (' + res.statusCode + '):\n' + res.body);

  } else if (res.statusCode >= 500 && res.statusCode < 600) { // 500s
    body = JSON.parse(res.body);
    throw new Error("Failed command (" + res.statusCode + "):\n" + body.value.message + (body.value.class ? "\nClass: " + body.value.class : "") + (body.value.stackTrace ? "\nStack-trace:\n " + stringifyStackTrace(body.value.stackTrace) : ""));

  } else if (res.statusCode >= 200 && res.statusCode < 300) {

    if (res.statusCode === 204) {
      return null;

    } else {
      body = JSON.parse(res.body);

      if (body.status === 0) {
        return body.value;
      } else {
        throw new Error(errors.fromBody(body));
      }
    }

  } else {
    throw new Error('Unknown status code (' + res.statusCode + '):\n' + res.body);
  }
}

/**
 * Turns a selenium stack-trace into a string
 *
 * @param {Array.<Object>} stackTrace
 * @return {String}
 */
function stringifyStackTrace (stackTrace) {

  var i, len, result = [];

  for (i = 0, len = stackTrace.length; i < len; i++) {
    if (stackTrace[i]) {
      result.push(stackTrace[i].methodName + "::" + stackTrace[i].className + " (" + stackTrace[i].fileName + ":" + stackTrace[i].lineNumber + ")");
    }
  }

  return result.join("\n");
}


/**
 * Create connection object according to mode-type
 *
 * Returns a function of the form:
 *
 *   request(method, url, options) => result
 *
 * That function may return a promise or the result.
 *
 * @param {String} mode
 * @return {Function}
 */
function createInternalConnection (mode) {
  switch (mode) {
    case 'async':
      var aRequest = require('then-request');
      return function (method, path, options) {
        return new Promise(function (resolve, reject) {
          function attempt(i) {
            aRequest(method, path, options).done(resolve, function (err) {
              if (i > 5) {
                return reject(err);
              }
              setTimeout(function () {
                attempt(i + 1);
              }, i * 1000);
            });
          }
          attempt(1);
        });
      };
    case 'sync':
      var sRequest = require('sync-request');
      return function (method, path, options) {
        for (var i = 0; i < 5; i++) {
          try {
            return sRequest(method, path, options);
          } catch (ex) {}
        }
        return sRequest(method, path, options);
      };
    default:
      throw new Error('Expected options.mode to be "async" ' +
                      'or "sync" but got ' + JSON.stringify(mode));
  }
}
