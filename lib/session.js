'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = Session;

/**
 * Session entry
 *
 * @param {Object} values
 * @constructor
 */
function Session (values) {
  this._values = values;
}


//////////////////
// Enumerations //
//////////////////

Session.CAPABILITY_BROWSER_NAME = 'browserName';
Session.CAPABILITY_VERSION = 'version';
Session.CAPABILITY_PLATFORM = 'platform';
Session.CAPABILITY_JAVASCRIPT_ENABLED = 'javascriptEnabled';
Session.CAPABILITY_TAKES_SCREENSHOT = 'takesScreenshot';
Session.CAPABILITY_HANDLES_ALERT = 'handlesAlert';
Session.CAPABILITY_DATABASE_ENABLED = 'databaseEnabled';
Session.CAPABILITY_LOCATION_CONTEXT_ENABLED = 'locationContextEnabled';
Session.CAPABILITY_APPLICATION_CACHE_ENABLED = 'applicationCacheEnabled';
Session.CAPABILITY_BROWSER_CONNECTION_ENABLED = 'browserConnectionEnabled';
Session.CAPABILITY_CSS_SELECTORS_ENABLED = 'cssSelectorsEnabled';
Session.CAPABILITY_WEB_STORAGE_ENABLED = 'webStorageEnabled';
Session.CAPABILITY_ROTATABLE = 'rotatable';
Session.CAPABILITY_ACCEPT_SSL_CERTS = 'acceptSslCerts';
Session.CAPABILITY_NATIVE_EVENTS = 'nativeEvents';
Session.CAPABILITY_PROXY = 'proxy';


////////////////////
// Public Methods //
////////////////////

/**
 * Get the session-id.
 *
 * @returns {String}
 */
Session.prototype.getId = function () {
  return this._values.sessionId;
};

/**
 * Get all the accepted capabilities
 *
 * @returns {Object}
 */
Session.prototype.getCapabilities = function () {
  return this._values.capabilities;
};
