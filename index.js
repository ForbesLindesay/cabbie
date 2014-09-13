'use strict';

var util = require('util');

var Alert = require('./lib/alert');
var ActiveWindow = require('./lib/activeWindow');
var Browser = require('./lib/browser');
var Cookie = require('./lib/cookie');
var CookieStorage = require('./lib/cookieStorage');
var Driver = require('./lib/driver');
var Element = require('./lib/element');
var Frame = require('./lib/frame');
var GlobalMouse = require('./lib/globalMouse');
var GlobalTouch = require('./lib/globalTouch');
var IME = require('./lib/ime');
var Keys = require('./lib/keys');
var LocalStorage = require('./lib/localStorage');
var LogEntry = require('./lib/logEntry');
var Mouse = require('./lib/mouse');
var Navigator = require('./lib/navigator');
var Session = require('./lib/session');
var SessionStorage = require('./lib/sessionStorage');
var Status = require('./lib/status');
var TimeOut = require('./lib/timeOut');
var Touch = require('./lib/touch');
var WindowHandler = require('./lib/window');

module.exports = Cabbie;

/**
 * Create a new browser session
 *
 * <img src="../../objectReference.png" />
 *
 * Note: Remember to call `.dispose()` at the end to terminate the session.
 *
 * @constructor
 * @class Cabbie
 * @module Cabbie
 * @param {String|Object} remote Request object or URL to selenium-server
 * @param {Object} capabilities See capabilities in {{#crossLink "Session"}}{{/crossLink}}
 * @param {Object} options
 * @param {String} options.mode Mode of web-driver requests (Browser.MODE_SYNC|Browser.MODE_ASYNC)
 * @param {String} [options.base] Base-url
 * @param {String} [options.sessionID]
 * @param {Boolean} [options.debug=false]
 * @param {Boolean} [options.httpDebug=false]
 */
function Cabbie(remote, capabilities, options) {
  var driver = new Driver(remote, capabilities, options),
      indentation = 0;

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
        console.log(getIndentation(1) + "Response: ", JSON.stringify(res).substr(0, 5000));
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
  return driver;
}


/**
 * @property ActiveWindow
 * @type {ActiveWindow}
 */
Cabbie.ActiveWindow = ActiveWindow;

/**
 * @property Alert
 * @type {Alert}
 */
Cabbie.Alert = Alert;

/**
 * @property Browser
 * @type Browser
 */
Cabbie.Browser = Browser;

/**
 * @property Cookie
 * @type Cookie
 */
Cabbie.Cookie = Cookie;

/**
 * @property CookieStorage
 * @type CookieStorage
 */
Cabbie.CookieStorage = CookieStorage;

/**
 * @property Driver
 * @type Driver
 */
Cabbie.Driver = Driver;

/**
 * @property Element
 * @type Element
 */
Cabbie.Element = Element;

/**
 * @property Frame
 * @type Frame
 */
Cabbie.Frame = Frame;

/**
 * @property GlobalMouse
 * @type GlobalMouse
 */
Cabbie.GlobalMouse = GlobalMouse;

/**
 * @property GlobalTouch
 * @type GlobalTouch
 */
Cabbie.GlobalTouch = GlobalTouch;

/**
 * @property IME
 * @type IME
 */
Cabbie.IME = IME;

/**
 * @property Keys
 * @type Keys
 */
Cabbie.Keys = Keys;

/**
 * @property LocalStorage
 * @type LocalStorage
 */
Cabbie.LocalStorage = LocalStorage;

/**
 * @property LogEntry
 * @type LogEntry
 */
Cabbie.LogEntry = LogEntry;

/**
 * @property Mouse
 * @type Mouse
 */
Cabbie.Mouse = Mouse;

/**
 * @property Navigator
 * @type Navigator
 */
Cabbie.Navigator = Navigator;

/**
 * @property Session
 * @type Session
 */
Cabbie.Session = Session;

/**
 * @property SessionStorage
 * @type SessionStorage
 */
Cabbie.SessionStorage = SessionStorage;

/**
 * @property Status
 * @type Status
 */
Cabbie.Status = Status;

/**
 * @property TimeOut
 * @type TimeOut
 */
Cabbie.TimeOut = TimeOut;

/**
 * @property Touch
 * @type Touch
 */
Cabbie.Touch = Touch;

/**
 * @property WindowHandler
 * @type WindowHandler
 */
Cabbie.WindowHandler = WindowHandler;
