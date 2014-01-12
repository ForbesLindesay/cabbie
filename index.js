'use strict';

var Browser = require('./lib/browser.js');
module.exports = getBrowser;

/**
 * Create a new browser session, remember to call `.dispose()`
 * at the end to terminate the session.
 *
 * @param {String|Object} remote
 * @param {Object}        capabilities
 * @param {Object}        options
 */
function getBrowser(remote, capabilities, options) {
  var browser = new Browser(remote, capabilities, options);
  if (options.debug) {
    browser.debug(function (event) {
      switch (event.type) {
        case 'method-call':
          var msg = event.target;
          if (event.selector) {
            msg += '("' + event.selector + '")';
          }
          msg += '.' + event.name;
          msg += '(' + event.args.map(function (a) {
            return require('util').inspect(a, {colors: true});
          }).join(', ') + ')';
          if (event.result && typeof event.result !== 'object') {
            msg += ' => ' + require('util').inspect(event.result, {colors: true});
          }
          console.log('     - ' + msg);
          break;
        default:
          console.dir(event);
      }
    });
  }
  return browser;
}
