'use strict';

var util = require('util');

var Alert = require('./lib/alert');
var Browser = require('./lib/browser');
var Cookie = require('./lib/cookie');
var CookieStorage = require('./lib/cookieStorage');
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

module.exports = cabbie;

/**
 * Create a new browser session, remember to call `.dispose()`
 * at the end to terminate the session.
 *
 * @param {String|Object} remote
 * @param {Object} capabilities
 * @param {Object} options
 */
function cabbie(remote, capabilities, options) {
  var browser = new Browser(remote, capabilities, options),
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
      browser.on('request', function (req) {
        console.log(getIndentation(1) + "Request:  ", JSON.stringify(req).substr(0, 5000));
      });
      browser.on('response', function (res) {
        console.log(getIndentation(1) + "Response: ", JSON.stringify(res).substr(0, 5000));
      });
    }
    browser.on('method-call', function (event) {
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
  return browser;
}

cabbie.Alert = Alert;
cabbie.Browser = Browser;
cabbie.Cookie = Cookie;
cabbie.CookieStorage = CookieStorage;
cabbie.Element = Element;
cabbie.Frame = Frame;
cabbie.GlobalMouse = GlobalMouse;
cabbie.GlobalTouch = GlobalTouch;
cabbie.IME = IME;
cabbie.Keys = Keys;
cabbie.LocalStorage = LocalStorage;
cabbie.LogEntry = LogEntry;
cabbie.Mouse = Mouse;
cabbie.Navigator = Navigator;
cabbie.Session = Session;
cabbie.SessionStorage = SessionStorage;
cabbie.Status = Status;
cabbie.TimeOut = TimeOut;
cabbie.Touch = Touch;
cabbie.WindowHandler = WindowHandler;


