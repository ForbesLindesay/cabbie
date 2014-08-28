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

var Connection = require('./connection');

var WindowHandler = require('./window');
var GlobalTouch = require('./globalTouch');
var GlobalMouse = require('./globalMouse');
var IME = require('./ime');
var LocalStorage = require('./localStorage');
var SessionStorage = require('./sessionStorage');
var CookieStorage = require('./cookieStorage');
var Alert = require('./alert');
var Element = require('./element');
var Navigator = require('./navigator');
var TimeOut = require('./timeOut');
var Frame = require('./frame');

var Session = require('./session');
var Status = require('./status');
var LogEntry = require('./logEntry');


module.exports = Browser;

/**
 * Create a new browser session, remember to call `.dispose()`
 * at the end to terminate the session.
 *
 * @constructor
 * @param {String|Object} remote
 * @param {Object} capabilities
 * @param {Object} options
 * @param {String} options.mode
 * @param {String} options.base (This is possibly needed for navigateTo.)
 * @param {String} [options.sessionID]
 */
function Browser (remote, capabilities, options) {
  EventEmitter.call(this);

  type('remote', remote, 'String|Object');
  type('capabilities', capabilities, 'Object');
  type('options', options, 'Object');
  type('options.mode', options.mode, 'String');

  this._options = options;
  this._connection = new Connection(remote, options.mode);

  if (options.sessionID) {
    this._session = new Session({ sessionId: options.sessionID, capabilities: capabilities });
  } else {
    this._session = this._createSession(capabilities);
  }
}
util.inherits(Browser, EventEmitter);


////////////////////
// Static Methods //
////////////////////

/**
 *
 * @param {String} remote
 * @param {String} mode
 * @returns {Status}
 */
Browser.getStatus = function (remote, mode) {
  var request = new Connection(remote, mode);

  return when(request.request('GET', undefined, '/status', {
    'Content-Type': 'application/json;charset=UTF-8'
  }), function (response) {
    return new Status(response);
  });
};

/**
 * Returns a list of the currently active sessions
 *
 * @param {String} remote
 * @param {string} mode
 * @returns {Array.<Session>}
 */
Browser.getSessions = function (remote, mode) {
  var request = new Connection(remote, mode);

  return when(request.request('GET', undefined, '/sessions', {
    'Content-Type': 'application/json;charset=UTF-8'
  }), function (sessions) {
    return sessions.map(function (session) {
      return new Session(session);
    }.bind(this));
  }.bind(this));
};


/////////////////////
// PRIVATE METHODS //
/////////////////////

/**
 * Create a selenium session
 *
 * @param {Object} desiredCapabilities
 * @param {Object} [requiredCapabilities]
 * @returns {Session}
 * @private
 */
Browser.prototype._createSession = function (desiredCapabilities, requiredCapabilities) {

  var capabilities = {}, capabilitiesStr;

  capabilities.desiredCapabilities = desiredCapabilities;
  if (requiredCapabilities) {
    capabilities.requiredCapabilities = requiredCapabilities;
  }

  capabilitiesStr = JSON.stringify(capabilities);

  return when(this._connection.request('POST', undefined, '/session', capabilitiesStr), function (res) {
    return new Session(extractSessionData(res));
  });
};

Browser.prototype._logMethodCall = function (event) {
  if (!event.target) {
    event.target = 'Browser';
  }
  when.done(this.session().getId(), function (sessionID) {
    event.sessionID = sessionID;
    this.emit('method-call', event);
  }.bind(this));
};

Browser.prototype._request = function (method, path, body) {
  return this._connection.sessionRequest(this.session(), method, path, body);
};
Browser.prototype._requestJSON = function (method, path, body) {
  return this._connection.cabbieRequest(this.session(), method, path, body);
};


//////////////////
// ENUMERATIONS //
//////////////////

Browser.ORIENTATION_LANDSCAPE = 'landscape';
Browser.ORIENTATION_PORTRAIT = 'portrait';

Browser.MODE_SYNC = 'sync';
Browser.MODE_ASYNC = 'async';

Browser.APPLICATION_CACHE_UNCACHED = 0;
Browser.APPLICATION_CACHE_IDLE = 1;
Browser.APPLICATION_CACHE_CHECKING = 2;
Browser.APPLICATION_CACHE_DOWNLOADING = 3;
Browser.APPLICATION_CACHE_UPDATE_READY = 4;
Browser.APPLICATION_CACHE_OBSOLETE = 5;


////////////////////
// Public Methods //
////////////////////

Browser.prototype.request = Browser.prototype._request;
Browser.prototype.requestJSON = Browser.prototype._requestJSON;


/**
 * Get the session object of current session
 *
 * @returns {Session}
 */
Browser.prototype.session = function () {
  return this._session;
};

/**
 * Get the capabilities of the current browser
 *
 * @deprecated Use session().getCapabilities
 * @returns {Object}
 */
Browser.prototype.capabilities = function () {
  return when(this.session(), function (session) {
    return session.getCapabilities();
  });
};


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
 * @deprecated Use timeOut().setTimeOut()
 * @param {String}        timeoutType Timeout to set
 * @param {String|Number} timeout     Either the number of milliseconds to set the timeout
 *                                    or a string accepted by [ms](https://npmjs.org/package/ms)
 */
Browser.prototype.setTimeout = function (timeoutType, timeout) {
  return this.timeOut().setTimeOut(timeoutType, timeout);
};

/**
 * Set multiple timeouts at once.
 *
 * @deprecated Use timeOut().setTimeOuts()
 * @param {Object} timeouts - an object mapping timeout-types to timeout-values
 */
Browser.prototype.setTimeouts = function (timeouts) {
  return this.timeOut().setTimeOuts(timeouts);
};


/**
 * Change focus to another window. The window to change focus to may be specified
 * by its server assigned window handle, or by the value of its name attribute.
 *
 * @param {String|WindowHandler} handle
 */
Browser.prototype.activateWindow = function (handle) {
  type('handle', handle, 'Object|String');

  if (handle instanceof WindowHandler) {
    handle = handle.getWindowId();
  }

  return this._requestJSON('POST', '/window', {
    name: handle
  });
};

/**
 * Change focus to another window. The window to change focus to may be specified
 * by its server assigned window handle, or by the value of its name attribute.
 *
 * @deprecated Use activateWindow
 * @param {String|WindowHandler} handle
 */
Browser.prototype.setWindow = Browser.prototype.activateWindow;

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
 * Close the current window
 */
Browser.prototype.close = function () {
  return this._requestJSON('DELETE', '/window')
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

  return this._requestJSON('POST', '/url', { url: path });
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
 * Get the current page title
 *
 * @return {String}
 */
Browser.prototype.getTitle = function () {
  return this._requestJSON('GET', '/title');
};

/**
 * Get the current page source
 *
 * @return {String}
 */
Browser.prototype.getSource = function () {
  return this._requestJSON('GET', '/source');
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
  type('latitude', latitude, 'Number');
  type('longitude', longitude, 'Number');
  type('altitude', altitude, 'Number');
  return this._requestJSON('POST', '/location', { latitude: latitude, longitude: longitude, altitude: altitude });
};


/**
 * Navigate forwards in the browser history, if possible.
 *
 * @deprecated Use navigator().forward
 */
Browser.prototype.forward = function () {
  return this._requestJSON('POST', '/forward');
};

/**
 * Navigate backwards in the browser history, if possible.
 *
 * @deprecated Use navigator().backward
 */
Browser.prototype.backward = function () {
  return this._requestJSON('POST', '/back');
};

/**
 * Refreshes the browser
 *
 * @deprecated Use navigator().refresh
 */
Browser.prototype.refresh = function () {
  return this._requestJSON('POST', '/refresh');
};


/**
 * Gets all cookies for the current page
 *
 * @deprecated Use cookies().getCookies
 * @return {Array.<Cookie>} an array of cookie json objects (@see https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object)
 */
Browser.prototype.getCookies = function () {
  return this.cookies().getCookies();
};

/**
 * Gets a given cookie by name, not part of the wire-protocol but useful.
 *
 * @deprecated Use cookies().getCookie
 * @param {String} cookieName The name of the cookie tor retrieve
 * @return {Cookie} a cookie json object or null (@see https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object)
 */
Browser.prototype.getCookie = function (cookieName) {
  return this.cookies().getCookie(cookieName);
};

/**
 * Sets a cookie.
 *
 * @deprecated Use cookies().setCookie
 * @param {Cookie} cookie - a cookie json object, @see https://code.google.com/p/selenium/wiki/JsonWireProtocol#Cookie_JSON_Object
 */
Browser.prototype.setCookie = function (cookie) {
  return this.cookies().setCookie(cookie);
};

/**
 * Deletes all cookies for the current page
 *
 * @deprecated Use cookies().clear
 */
Browser.prototype.clearCookies = function () {
  return this.cookies().clear();
};

/**
 * Deletes a cookie by name
 *
 * @deprecated Use cookies().removeCookie
 * @param {String} cookieName
 */
Browser.prototype.clearCookie = function (cookieName) {
  return this.cookies().removeCookie(cookieName);
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
 * @return {*}
 */
Browser.prototype.execute = function (script, args) {
  type('script', script, 'Function|String');
  type('args', args, 'Array?');
  return this._requestJSON('POST', '/execute', { script: codeToString(script), args: args || [] });
};

/**
 * Execute a script asynchronously on the browser.
 *
 * Source should be either a function body as a string or a function.
 * Keep in mind that if it is a function it will not have access to
 * any variables from the node.js process.
 *
 * @param {String|Function} script
 * @param {Array} [args]
 */
Browser.prototype.asyncExecute = function (script, args) {
  type('script', script, 'Function|String');
  type('args', args, 'Array?');
  return this._requestJSON('POST', '/execute_async', { script: codeToString(script), args: args || [] });
};


/**
 * Type a string of characters into the browser
 *
 * Note: Modifier keys is kept between calls, so mouse interactions can be performed
 * while modifier keys are depressed.
 *
 * @param {String|Array.<String>} str
 */
Browser.prototype.sendKeys = function (str) {
  type('str', str, 'String|Array.<String>');
  return this._requestJSON('POST', '/keys', { value: Array.isArray(str) ? str : [str] });
};

/**
 * Take a screenshot of the current page
 *
 * @return {Buffer}
 */
Browser.prototype.takeScreenshot = function () {
  return when(this._requestJSON('GET', '/screenshot'), function (base64Data) {
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
 * Get an element via a CSS selector,
 * will throw an error if the element
 * does not exist.
 *
 * @param {String} selector
 * @param {String} [selectorType='css selector']
 * @return {Element}
 */
Browser.prototype.getElement = function (selector, selectorType) {
  type('selector', selector, 'String');
  type('selectorType', selectorType, 'String?');

  return when(this._requestJSON('POST', '/element', {
    using: selectorType || Element.SELECTOR_CSS,
    value: selector
  }), function (element) {
    return new Element(this, this, selector, element);
  }.bind(this));
};

/**
 * Get elements via a CSS selector.
 *
 * @param {String} selector
 * @param {String} [selectorType='css selector']
 * @return {Array.<Element>}
 */
Browser.prototype.getElements = function (selector, selectorType) {
  type('selector', selector, 'String');
  type('selectorType', selectorType, 'String?');

  return when(this._requestJSON('POST', '/elements', {
    using: selectorType || Element.SELECTOR_CSS,
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
 * Get the time-out object
 *
 * @returns {TimeOut}
 */
Browser.prototype.timeOut = function () {
  return new TimeOut(this);
};

/**
 * Get the Navigator object
 *
 * @returns {Navigator}
 */
Browser.prototype.navigator = function () {
  return new Navigator(this);
};

/**
 * Get the Frame object
 *
 * @returns {Frame}
 */
Browser.prototype.frame = function () {
  return new Frame(this);
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
 * Get the Cookie-Storage object
 *
 * @returns {CookieStorage}
 */
Browser.prototype.cookies = function () {
  return new CookieStorage(this);
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
 * Get the status of the html5 application cache
 *
 * @return {Number}
 */
Browser.prototype.getApplicationCacheStatus = function () {
  return this._requestJSON('GET', '/application_cache/status');
};


/**
 * Get the log for a given log type. Log buffer is reset after each request.
 *
 * @param {String} logType
 * @return {Array.<LogEntry>}
 */
Browser.prototype.getLogs = function (logType) {
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
 * @return {Array.<String>}
 */
Browser.prototype.getLogTypes = function () {
  return this._requestJSON('GET', '/log/types');
};


/**
 * End this browser session
 *
 * @param {Object} [status]
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

    return when(request({
      method: 'PUT',
      uri: 'http://' + auth + '@saucelabs.com/rest/v1/' + auth.split(':')[0] + '/jobs/' + session.getId(),
      headers: {
        'Content-Type': 'text/json'
      },
      body: JSON.stringify(body)
    }), function () {
      return true;
    });
  }

  return when(this.session, makeRequest);
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
function codeToString (code) {
  if (typeof code === 'function') {
    code = 'return (' + code + ').apply(null, arguments);';
  }
  return code;
}

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
    return { sessionId: body.sessionId, capabilities: body.capabilities  };
  } else {
    throw new Error(errors.fromBody(body));
  }
}