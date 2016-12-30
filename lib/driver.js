'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var url = require('url');

var logMethods = require('./log');
var JSON = require('./json');
var when = require('./when');
var errors = require('./errors');
var type = require('./type');

var Connection = require('./connection');

var Browser = require('./browser');
var TimeOut = require('./timeOut');

var Session = require('./session');
var Status = require('./status');
var LogEntry = require('./logEntry');

var SessionStorage = require('./sessionStorage');


module.exports = Driver;

/**
 * Create a new Driver session, remember to call `.dispose()`
 * at the end to terminate the session.
 *
 * @constructor
 * @class Driver
 * @module WebDriver
 * @submodule Core
 * @param {String} remote URL to selenium-server
 * @param {Object} capabilities See capabilities in {{#crossLink "Session"}}{{/crossLink}}
 * @param {Object} options
 * @param {String} options.mode Mode of web-driver requests (Driver.MODE_SYNC|Driver.MODE_ASYNC)
 * @param {String} [options.base] Base-url
 * @param {String} [options.sessionID]
 */
function Driver (remote, capabilities, options) {
  EventEmitter.call(this);

  type('remote', remote, 'String|Object');
  type('capabilities', capabilities, 'Object');
  type('options', options, 'Object');
  type('options.mode', options.mode, 'String');

  setupDebug(this, options);

  options.remote = remote;
  options.capabilities = capabilities;
  this._options = options;
  this._connection = new Connection(remote, options.mode);
  this._connection.on('request', function (req) {
    this.emit('request', req);
  }.bind(this));
  this._connection.on('response', function (res) {
    this.emit('response', res);
  }.bind(this));

  if (options.sessionID) {
    this._sessionObj = new Session({ sessionId: options.sessionID, capabilities: capabilities });
  } else {
    this._sessionObj = this._createSession(capabilities);
  }
}
util.inherits(Driver, EventEmitter);


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


////////////////////
// Static Methods //
////////////////////

/**
 * Gets the selenium-system status
 *
 * @method getStatus
 * @param {String} remote
 * @param {String} mode
 * @return {Status}
 */
Driver.getStatus = function (remote, mode) {
  var request = new Connection(remote, mode);

  return when(when(request.request('GET', '/status'), Connection._parseResponse), function (response) {
    return new Status(response);
  });
};

/**
 * Returns a list of the currently active sessions
 *
 * Note: Appears not to be supported by the selenium-standalone-server!
 *
 * @method getSessions
 * @param {String} remote
 * @param {string} mode
 * @return {Array.<Session>}
 */
Driver.getSessions = function (remote, mode) {
  var request = new Connection(remote, mode);

  return when(when(request.request('GET', '/sessions'), Connection._parseResponse), function (sessions) {
    return sessions.map(function (session) {
      return new Session(session);
    }.bind(this));
  }.bind(this));
};


/////////////////////
// Private Methods //
/////////////////////

/**
 * Returns value according to mode
 *
 * @method _getValue
 * @protected
 * @param {*} [value]
 * @return {*}
 */
Driver.prototype._getValue = function (value) {
  switch (this._options.mode) {
    case 'async':
      return require('promise').resolve(value);
      break;
    case 'sync':
      return value;
      break;
    default:
      throw new Error('Expected options.mode to be "async" or "sync" but got ' + JSON.stringify(this._options.mode));
  }
};

/**
 * Create a selenium session
 *
 * @method _createSession
 * @private
 * @param {Object} desiredCapabilities
 * @param {Object} [requiredCapabilities]
 * @return {Session}
 */
Driver.prototype._createSession = function (desiredCapabilities, requiredCapabilities) {

  var capabilities = {};

  capabilities.desiredCapabilities = desiredCapabilities;
  if (requiredCapabilities) {
    capabilities.requiredCapabilities = requiredCapabilities;
  }

  return when(this._connection.request('POST', '/session', {
    json: capabilities
  }), function (res) {
    return new Session(extractSessionData(res));
  });
};

/**
 * Trigger an event to log the method-call
 *
 * @param {object} event
 * @method _logMethodCall
 * @protected
 */
Driver.prototype._logMethodCall = function (event) {
  if (!event.target) {
    event.target = 'Driver';
  }
  this.emit('method-call', event);
};


/**
 * Performs a context dependent JSON request for the current session.
 * The result is parsed for errors.
 *
 * @method _requestJSON
 * @protected
 * @param {String} method
 * @param {String} path
 * @param {Object} [body]
 * @return {*}
 */
Driver.prototype._requestJSON = function (method, path, body) {
  return this._connection.cabbieRequest(this._session(), method, path, {
    json: body
  });
};


//////////////////
// Enumerations //
//////////////////

/**
 * Sync-mode of web-driver requests
 *
 * @static
 * @property MODE_SYNC
 * @type {string}
 */
Driver.MODE_SYNC = 'sync';

/**
 * Async-mode of web-driver requests
 *
 * @static
 * @property MODE_ASYNC
 * @type {string}
 */
Driver.MODE_ASYNC = 'async';


/**
 * Status of the HTML5 application cache - Uncached
 *
 * @static
 * @property APPLICATION_CACHE_UNCACHED
 * @type {int}
 */
Driver.APPLICATION_CACHE_UNCACHED = 0;

/**
 * Status of the HTML5 application cache - Idle
 *
 * @static
 * @property APPLICATION_CACHE_IDLE
 * @type {int}
 */
Driver.APPLICATION_CACHE_IDLE = 1;

/**
 * Status of the HTML5 application cache - Checking
 *
 * @static
 * @property APPLICATION_CACHE_CHECKING
 * @type {int}
 */
Driver.APPLICATION_CACHE_CHECKING = 2;

/**
 * Status of the HTML5 application cache - Downloading
 *
 * @static
 * @property APPLICATION_CACHE_DOWNLOADING
 * @type {int}
 */
Driver.APPLICATION_CACHE_DOWNLOADING = 3;

/**
 * Status of the HTML5 application cache - Update-ready
 *
 * @static
 * @property APPLICATION_CACHE_UPDATE_READY
 * @type {int}
 */
Driver.APPLICATION_CACHE_UPDATE_READY = 4;

/**
 * Status of the HTML5 application cache - Obsolete
 *
 * @static
 * @property APPLICATION_CACHE_OBSOLETE
 * @type {int}
 */
Driver.APPLICATION_CACHE_OBSOLETE = 5;


////////////////////
// Public Methods //
////////////////////

/**
 * Get the session object of current session
 *
 * Note: This function call is not logged!
 *
 * @method _session
 * @private
 * @return {Session}
 */
Driver.prototype._session = function () {
  return this._sessionObj;
};

/**
 * Get the session object of current session
 *
 * @method session
 * @return {Session}
 */
Driver.prototype.session = Driver.prototype._session;


/**
 * Gets the browser object.
 * Direct-access. No need to wait.
 *
 * @returns {Browser}
 */
Driver.prototype.browser = function () {
  return new Browser(this);
};


/**
 * Get the time-out object.
 * Direct-access. No need to wait.
 *
 * @method timeOut
 * @return {TimeOut}
 */
Driver.prototype.timeOut = function () {
  return new TimeOut(this);
};


/**
 * Get the status of the html5 application cache
 *
 * @method getApplicationCacheStatus
 * @return {Number}
 */
Driver.prototype.getApplicationCacheStatus = function () {
  return this._requestJSON('GET', '/application_cache/status');
};


/**
 * Get the log for a given log type. Log buffer is reset after each request.
 *
 * @method getLogs
 * @param {String} logType
 * @return {Array.<LogEntry>}
 */
Driver.prototype.getLogs = function (logType) {
  type('logType', logType, 'String');

  return when(this._requestJSON('POST', '/log', {
    type: logType
  }), function (logs) {
    return logs.map(function (logEntry) {
      return new LogEntry(logEntry);
    }.bind(this));
  }.bind(this));
};

/**
 * Get available log types
 *
 * @method getLogTypes
 * @return {Array.<String>}
 */
Driver.prototype.getLogTypes = function () {
  return this._requestJSON('GET', '/log/types');
};


/**
 * End this Driver session
 *
 * @method dispose
 * @param {Object} [status]
 */
Driver.prototype.dispose = function (status) {
  var doDispose = function () {
    return when(this._requestJSON('DELETE', ''), function (res) {
      this.emit('disposed');
      return res;
    }.bind(this));
  }.bind(this);

  if (status && (status.passed === true || status.passed === false)) {
    return when(this.sauceJobUpdate(status), doDispose);
  } else {
    return doDispose();
  }
};

/**
 * End this Driver session
 *
 * Alias for `dispose`
 * @method quit
 */
Driver.prototype.quit = Driver.prototype.dispose;


/**
 * Get the Session-Storage object.
 * Direct-access. No need to wait.
 *
 * @method sessionStorage
 * @return {SessionStorage}
 */
Driver.prototype.sessionStorage = function () {
  return new SessionStorage(this);
};


/**
 * Sauce Labs Methods
 *
 * @method sauceJobUpdate
 * @param {Object} body
 * @return {Boolean}
 */
Driver.prototype.sauceJobUpdate = function (body) {
  var remote = this._connection._remote;
  var request = this._connection._request_internal.bind(this);

  function makeRequest (session) {
    if (typeof remote !== 'string') {
      remote = remote.base;
    }
    if (remote.indexOf('saucelabs') === -1) {
      return false;
    }
    if (body === undefined) {
      return true;
    }
    var auth = url.parse(remote).auth;

    return when(request('PUT', 'http://' + auth + '@saucelabs.com/rest/v1/' + auth.split(':')[0] + '/jobs/' + session.id(), {
      json: body
    }), function () {
      return true;
    });
  }

  return when(this._session(), makeRequest);
};

/**
 * Get a synchronous cabbie driver from an async driver.
 *
 * N.B. this method will still return a Promise for the Driver.
 *
 * @method getSyncDriver
 * @return {Driver}
 */
Driver.prototype.getSyncDriver = function () {
  var oldOptions = this._options;
  return when(this._session(), function (session) {
    var newOptions = {};
    Object.keys(oldOptions).forEach(function (option) {
      if (option !== 'remote' && option !== 'capabilities') {
        newOptions[option] = oldOptions[option];
      }
    });
    newOptions.mode = 'sync';
    newOptions.sessionID = session.id();
    return new Driver(oldOptions.remote, oldOptions.capabilities, newOptions);
  });
};

logMethods(Driver.prototype);


///////////////
// Utilities //
///////////////

/**
 * Extract a session ID and the accepted capabilities from a server response
 *
 * @param {Object} res
 * @return {Object} `{sessionId: String, capabilities: Object}`
 */
function extractSessionData (res) {
  var body;

  if (res.statusCode !== 200) {
    console.dir(res.headers);
    throw new Error('Failed to start a Selenium session. Server responded with status code ' + res.statusCode + ':\n' + res.body);
  }

  body = JSON.parse(res.body);
  if (body.status === 0) {
    return { sessionId: body.sessionId, capabilities: body.value };
  } else {
    throw new Error(errors.fromBody(body));
  }
}

/**
 * Setup debug output
 *
 * @param {Driver} driver
 * @param {object} options
 */
function setupDebug (driver, options) {
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
