'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var url = require('url');
var ms = require('ms');
var Buffer = require('buffer');

var logMethods = require('./log');
var JSON = require('./json');
var when = require('./when');
var errors = require('./errors');
var type = require('./type');

var WindowHandler = require('./window');
var GlobalTouch = require('./globalTouch');
var GlobalMouse = require('./globalMouse');
var IME = require('./ime');
var LocalStorage = require('./localStorage');
var SessionStorage = require('./sessionStorage');
var Alert = require('./alert');
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
  EventEmitter.call(this);
  type('remote', remote, 'String|Object');
  type('capabilities', capabilities, 'Object');
  type('options', options, 'Object');
  type('options.mode', options.mode, 'String');
  switch (options.mode) {
    case 'async':
      this._request_internal = withRedirects(require('promise').denodeify(require('request')));
      break;
    case 'sync':
      this._request_internal = withRedirects(require('request-sync'));
      break;
    default:
      var err = new Error('Expected options.mode to be "async" or "sync" but got '
                          + JSON.stringify(options.mode));
      throw err;
  }
  this._remote = remote;
  this._capabilities = capabilities;
  this._options = options;
  this._sessionID = options.sessionID || when(this._request_internal(withRemote(this._remote, {
    method: 'POST',
    path: '/session',
    body: JSON.stringify({desiredCapabilities: capabilities})
  })), extractSessionID);
}
util.inherits(Browser, EventEmitter);

Browser.prototype._logMethodCall = function (event) {
  if (!event.target) {
    event.target = 'Browser';
  }
  when.done(this._sessionID, function (sessionID) {
    event.sessionID = this._sessionID;
    this.emit('method-call', event);
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

//////////////////
// ENUMERATIONS //
//////////////////

Browser.TIMEOUT_TYPE_SCRIPT = 'script';
Browser.TIMEOUT_TYPE_PAGE_LOAD = 'page load';
Browser.TIMEOUT_TYPE_IMPLICIT = 'implicit';
Browser.TIMEOUT_TYPE_ASYNC = 'async';

Browser.ORIENTATION_LANDSCAPE = 'landscape';
Browser.ORIENTATION_PORTRAIT = 'portrait';

////////////////////
// Public Methods //
////////////////////

/**
 * Get the session id
 *
 * @returns {String}
 */
Browser.prototype.getSessionID = function () {
  return this._sessionID;
};

Browser.prototype.request = Browser.prototype._request;
Browser.prototype.requestJSON = Browser.prototype._requestJSON;

/**
 * Set a timeout
 *
 * Valid values for `timeoutType` are "script" for script timeouts,
 * "implicit" for modifying the implicit wait timeout, "page load"
 * for setting a page load timeout and "async" for modifying the
 * timeout for asynchronous scripts.
 *
 * Note that this may error on some platforms.
 *
 * @param {String}        timeoutType Timeout to set
 * @param {String|Number} timeout     Either the number of milliseconds to set the timeout
 *                                    or a string accepted by [ms](https://npmjs.org/package/ms)
 */
Browser.prototype.setTimeout = function (timeoutType, timeout) {
  type('timeoutType', timeoutType, 'String');
  type('timeout', timeout, 'String|Number');
  timeout = ms(timeout.toString());
  switch (timeoutType) {
    case Browser.TIMEOUT_TYPE_SCRIPT:
    case Browser.TIMEOUT_TYPE_PAGE_LOAD:
      return this._requestJSON('POST', '/timeouts', {type: timeoutType, ms: timeout});
    case Browser.TIMEOUT_TYPE_IMPLICIT:
      return this._requestJSON('POST', '/timeouts/implicit_wait', {ms: timeout});
    case Browser.TIMEOUT_TYPE_ASYNC:
      return this._requestJSON('POST', '/timeouts/async_script', {ms: timeout});
    default:
      throw new Error('Invalid timeout type' + JSON.stringify(timeoutType) +
                      ', expected "script", "page load", "implicit" or "async"');
  }
};

// avoid extra debug logging
var originalSetTimeout = Browser.prototype.setTimeout;
/**
 * Set multiple timeouts at once.
 *
 * @param {Object} timeouts - an object mapping timeout-types to timeout-values
 */
Browser.prototype.setTimeouts = function (timeouts) {
  type('timeouts', timeouts, 'Object');
  var results = [];
  for (var key in timeouts) {
    // call method on 
    results.push(originalSetTimeout.call(this, key, timeouts[key]));
  }
  function unwrap() {
    if (results.length)
      return when(results.pop(), unwrap);
  }
  return unwrap();
};


/**
 * Set the current window handle
 *
 * @param {String|WindowHandler} handle
 */
Browser.prototype.setWindow = function (handle) {
  if (handle instanceof WindowHandler) {
    handle = handle.getWindowId();
  }
  return this._requestJSON('POST', '/window', {
    name: handle
  });
};

/**
 * Get the current window handle
 *
 * @deprecated Use getWindow
 * @return {String}
 */
Browser.prototype.getWindowHandle = function () {
  return this._requestJSON('GET', '/window_handle');
};

/**
 * Get the current window
 *
 * @return {WindowHandler}
 */
Browser.prototype.getWindow = function () {
  return when(this._requestJSON('GET', '/window_handle'), function (handle) {
    return new WindowHandler(this, handle);
  }.bind(this));
};

/**
 * Get an array of window handles for all available windows
 *
 * @deprecated Use getWindows
 * @return {Array.<String>}
 */
Browser.prototype.getWindowHandles = function () {
  return this._requestJSON('GET', '/window_handles');
};

/**
 * Get an array of windows for all available windows
 *
 * @return {Array.<WindowHandler>}
 */
Browser.prototype.getWindows = function () {
  return when(this._requestJSON('GET', '/window_handles'), function (handles) {
    return handles.map(function (handle) {
      return new WindowHandler(this, handle);
    }.bind(this));
  }.bind(this));
};

/**
 * Get the current url that the browser is displaying
 *
 * @return {String}
 */
Browser.prototype.getUrl = function () {
  return this._requestJSON('GET', '/url');
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
};

/**
 * Navigates the browser to the specified path
 *
 * Alias for `navigateTo`
 *
 * @param {String} path
 */
Browser.prototype.setUrl = Browser.prototype.navigateTo;

/**
 * Get the current page source
 *
 * @return {String}
 */
Browser.prototype.getSource = function () {
  return this._requestJSON('GET', '/source');
};

/**
 * Get the current page title
 *
 * @return {String}
 */
Browser.prototype.getTitle = function () {
  return this._requestJSON('GET', '/title');
};

/**
 * Get the current browser orientation
 *
 * @return {String}
 */
Browser.prototype.getOrientation = function () {
  return this._requestJSON('GET', '/orientation');
};

/**
 * Get the current browser orientation
 *
 * @param {String} orientation
 */
Browser.prototype.setOrientation = function (orientation) {
  type('orientation', orientation, 'String');
  return this._requestJSON('POST', '/orientation', { orientation: orientation });
};

/**
 * Navigate forwards in the browser history, if possible.
 */
Browser.prototype.forward = function () {
  return this._requestJSON('POST', '/forward');
};

/**
 * Navigate backwards in the browser history, if possible.
 */
Browser.prototype.backward = function () {
  return this._requestJSON('POST', '/backward');
};

/**
 * Refreshes the browser
 */
Browser.prototype.refresh = function () {
  return this._requestJSON('POST', '/refresh');
};

/**
 * Gets all cookies for the current page
 *
 * @return {Array.<Cookie>} an array of cookie json objects (@see https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object)
 */
Browser.prototype.getCookies = function () {
  return this._requestJSON('GET', '/cookie');
};

/**
 * Gets a given cookie by name, not part of the wire-protocol but useful.
 *
 * @param {String} cookieName The name of the cookie tor etrieve
 * @return {Cookie?} a cookie json object or null (@see https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object)
 */
Browser.prototype.getCookie = function (cookieName) {
  type('cookieName', cookieName, 'String');

  return when(this.getCookies(), function (cookies) {
    cookies = cookies.filter(function(cookie) {
      return cookie.name == cookieName;
    });
    if(cookies.length === 0) return null;
    else return cookies[0];
  });
};

/**
 * Sets a cookie.
 *
 * @param {Cookie} cookie - a cookie json object, @see https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object
 */
Browser.prototype.setCookie = function (cookie) {
  type('cookie', cookie, 'Object');
  type('cookie.name', cookie.name, 'String');
  type('cookie.value', cookie.value, 'String');

  cookie.path = cookie.path || '/';

  // localhost is a special case, the domain must be ""
  if(cookie.domain === 'localhost') cookie.domain = '';

  if (cookie.domain != null) {
    return this._requestJSON('POST', '/cookie', {cookie: cookie});
  } else {
    return when(this.getUrl(), function (base) {
      cookie.domain =  url.parse(base).hostname;

      // localhost is a special case, the domain must be ""
      if(cookie.domain === 'localhost') cookie.domain = '';

      return this._requestJSON('POST', '/cookie', {cookie: cookie});
    }.bind(this));
  }
};

/**
 * Deletes all cookies for the current page
 */
Browser.prototype.clearCookies = function () {
  return this._requestJSON('DELETE', '/cookie');
};

/**
 * Deletes a cookie by name
 * @param {String} cookieName
 */
Browser.prototype.clearCookie = function (cookieName) {
  type('cookieName', cookieName, 'String');
  return this._requestJSON('DELETE', '/cookie/' + cookieName);
};

/**
 * Execute a script on the browser and return the result.
 *
 * Source should be either a function body as a string or a function.
 * Keep in mind that if it is a function it will not have access to
 * any variables from the node.js process.
 *
 * @param {String|Function} script
 * @param {Array} [args]
 */
Browser.prototype.execute = function (script, args) {
  type('script', script, 'Function|String');
  type('args', args, 'Array?');
  return this._requestJSON('POST', '/execute', {script: codeToString(script), args: args || []});
};

/**
 * Take a screenshot of the current page
 *
 * @return {Buffer}
 */
Browser.prototype.takeScreenshot = function () {
  return when(this._requestJSON('POST', '/screenshot'), function (base64Data) {
    return new Buffer(base64Data, 'base64');
  });
};

/**
 * Get the element on the page that currently has focus
 *
 * @return {Element}
 */
Browser.prototype.getActiveElement = function () {
  return when(this._requestJSON('POST', '/element/active'), function (element) {
    return new Element(this, this, '<active>', element);
  }.bind(this));
};

/**

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
    return new Element(this, this, selector, element);
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
      return new Element(this, this, selector, element);
    }.bind(this));
  }.bind(this));
};

/**
 * Get the global-touch object
 *
 * @returns {GlobalTouch}
 */
Browser.prototype.touch = function () {
  return new GlobalTouch(this);
};

/**
 * Get the global-mouse object
 *
 * @returns {GlobalMouse}
 */
Browser.prototype.mouse = function () {
  return new GlobalMouse(this);
};

/**
 * Get the IME object
 *
 * @returns {IME}
 */
Browser.prototype.ime = function () {
  return new IME(this);
};

/**
 * Get the Local-Storage object
 *
 * @returns {LocalStorage}
 */
Browser.prototype.localStorage = function () {
  return new LocalStorage(this);
};

/**
 * Get the Session-Storage object
 *
 * @returns {SessionStorage}
 */
Browser.prototype.sessionStorage = function () {
  return new SessionStorage(this);
};

/**
 * Get the Alert object
 *
 * @returns {Alert}
 */
Browser.prototype.alert = function () {
  return new Alert(this);
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
 * Get the current geo location
 *
 * @return {Object} `{latitude: number, longitude: number, altitude: number}`
 */
Browser.prototype.getGeoLocation = function () {
  return this._requestJSON('GET', '/location');
};

/**
 * Set the current geo location
 *
 * @param {Number} latitude
 * @param {Number} longitude
 * @param {Number} altitude
 */
Browser.prototype.setGeoLocation = function (latitude, longitude, altitude) {
  return this._requestJSON('POST', '/location', { latitude: latitude, longitude: longitude, altitude: altitude });
};

/**
 * End this browser session
 */
Browser.prototype.dispose = function (status) {
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
 * End this browser session
 *
 * Alias for `dispose`
 */
Browser.prototype.quit = Browser.prototype.dispose;

/**
 * Sauce Labs Methods
 *
 * @param {Object} body
 * @returns {Boolean}
 */
Browser.prototype.sauceJobUpdate = function (body) {
  var remote = this._remote;
  var request = this._request_internal.bind(this);
  return when(this._sessionID, makeRequest);
  function makeRequest(sessionID) {
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

    return when(request({
      method: 'PUT',
      uri: 'http://' + auth + '@saucelabs.com/rest/v1/' + auth.split(':')[0] + '/jobs/' + sessionID,
      headers: {
        'Content-Type': 'text/json'
      },
      body: JSON.stringify(body)
    }), function (res) {
      return true;
    });
  }
};

logMethods(Browser.prototype);

///////////////
// Utilities //
///////////////

/**
 * Convert code to string before execution
 *
 * @param {String|Function} code
 * @return {String}
 */
function codeToString(code) {
  if(typeof code === 'function') {
    code = 'return (' + code + ').apply(null, arguments);';
  }
  return code;
}

function withRedirects(fn) {
  return function recurse(options) {
    type('options', options, 'Object');
    type('options.uri', options.uri, 'String');
    return when(fn.call(this, options), function (res) {
      if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303) && res.headers.location) {
        return recurse({uri: url.resolve(options.uri, res.headers.location)});
      }
      return res;
    });
  }
}

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
    console.dir(res.headers);
    var err = new Error('Failed to start Selinium session. '
                        + 'Server responded with status code '
                        + res.statusCode + ':\n' + res.body);
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
  if (res.statusCode >= 300 || res.statusCode < 200) {
    var err = new Error('Server responded with status code '
                        + res.statusCode + ':\n' + res.body);
    throw err;
  }
  if (res.statusCode === 200) {
    var body = JSON.parse(res.body);
    if (body.status === 0) {
     return body.value;
    } else {
      var err = new Error(errors.fromBody(body));
      throw err;
    }
  } else {
    return undefined;
  }
}
