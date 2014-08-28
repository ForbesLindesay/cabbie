'use strict';

var util = require('util');

var Alert = require('lib/alert');
var Browser = require('lib/browser');
var Cookie = require('lib/cookie');
var CookieStorage = require('lib/cookieStorage');
var Element = require('lib/element');
var Frame = require('lib/frame');
var GlobalMouse = require('lib/globalMouse');
var GlobalTouch = require('lib/globalTouch');
var IME = require('lib/ime');
var Keys = require('lib/keys');
var LocalStorage = require('lib/localStorage');
var LogEntry = require('lib/logEntry');
var Mouse = require('lib/mouse');
var Navigator = require('lib/navigator');
var Session = require('lib/session');
var SessionStorage = require('lib/sessionStorage');
var Status = require('lib/status');
var TimeOut = require('lib/timeOut');
var Touch = require('lib/touch');
var WindowHandler = require('lib/window');

module.exports = Cabbie;

/**
 * Create a new browser session, remember to call `.dispose()`
 * at the end to terminate the session.
 *
 * @param {String|Object} remote
 * @param {Object} capabilities
 * @param {Object} options
 */
function Cabbie(remote, capabilities, options) {
  var browser = new Browser(remote, capabilities, options);

  if (options.debug) {
    browser.on('method-call', function (event) {
      var msg = event.target;
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
      console.log('     - ' + msg);
    });
  }
  return browser;
}

Cabbie.Alert = Alert;
Cabbie.Browser = Browser;
Cabbie.Cookie = Cookie;
Cabbie.CookieStorage = CookieStorage;
Cabbie.Element = Element;
Cabbie.Frame = Frame;
Cabbie.GlobalMouse = GlobalMouse;
Cabbie.GlobalTouch = GlobalTouch;
Cabbie.IME = IME;
Cabbie.Keys = Keys;
Cabbie.LocalStorage = LocalStorage;
Cabbie.LogEntry = LogEntry;
Cabbie.Mouse = Mouse;
Cabbie.Navigator = Navigator;
Cabbie.Session = Session;
Cabbie.SessionStorage = SessionStorage;
Cabbie.Status = Status;
Cabbie.TimeOut = TimeOut;
Cabbie.Touch = Touch;
Cabbie.WindowHandler = WindowHandler;


