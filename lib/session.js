// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var logMethods = require('./log');
var type = require('./type');

module.exports = Session;

/**
 * Session entry
 *
 * @constructor
 * @class Session
 * @module WebDriver
 * @submodule System
 * @param {Object} values
 */
function Session (values) {
  this._values = values;
}


//////////////////
// Enumerations //
//////////////////


/**
 * Request for a specific browser
 *
 * @static
 * @property CAPABILITY_BROWSER_NAME
 * @type {String}
 */
Session.CAPABILITY_BROWSER_NAME = 'browserName';

/**
 * Request for a specific browser version
 *
 * @static
 * @property CAPABILITY_VERSION
 * @type {String}
 */
Session.CAPABILITY_VERSION = 'version';

/**
 * Request for a specific platform
 *
 * @static
 * @property CAPABILITY_PLATFORM
 * @type {String}
 */
Session.CAPABILITY_PLATFORM = 'platform';

/**
 * Request for JavaScript to be enabled in the browser
 *
 * @static
 * @property CAPABILITY_JAVASCRIPT_ENABLED
 * @type {String}
 */
Session.CAPABILITY_JAVASCRIPT_ENABLED = 'javascriptEnabled';

/**
 * Request for screenshot support
 *
 * @static
 * @property CAPABILITY_TAKES_SCREENSHOT
 * @type {String}
 */
Session.CAPABILITY_TAKES_SCREENSHOT = 'takesScreenshot';

/**
 * Request for alert handling support
 *
 * @static
 * @property CAPABILITY_HANDLES_ALERT
 * @type {String}
 */
Session.CAPABILITY_HANDLES_ALERT = 'handlesAlert';

/**
 * Request for the browser database to be enabled
 *
 * @static
 * @property CAPABILITY_DATABASE_ENABLED
 * @type {String}
 */
Session.CAPABILITY_DATABASE_ENABLED = 'databaseEnabled';

/**
 * Request for the browser location API to be enabled
 *
 * @static
 * @property CAPABILITY_LOCATION_CONTEXT_ENABLED
 * @type {String}
 */
Session.CAPABILITY_LOCATION_CONTEXT_ENABLED = 'locationContextEnabled';

/**
 * Request for the browser cache to be enabled
 *
 * @static
 * @property CAPABILITY_APPLICATION_CACHE_ENABLED
 * @type {String}
 */
Session.CAPABILITY_APPLICATION_CACHE_ENABLED = 'applicationCacheEnabled';

/**
 * Request for the ability to query the browsers connectivity
 *
 * @static
 * @property CAPABILITY_BROWSER_CONNECTION_ENABLED
 * @type {String}
 */
Session.CAPABILITY_BROWSER_CONNECTION_ENABLED = 'browserConnectionEnabled';

/**
 * Request for native css selector support.
 *
 * Note: This should always be requested since this is the default for Cabbie.
 *
 * @static
 * @property CAPABILITY_CSS_SELECTORS_ENABLED
 * @type {String}
 */
Session.CAPABILITY_CSS_SELECTORS_ENABLED = 'cssSelectorsEnabled';

/**
 * Request for the web-storage to be enabled
 *
 * @static
 * @property CAPABILITY_WEB_STORAGE_ENABLED
 * @type {String}
 */
Session.CAPABILITY_WEB_STORAGE_ENABLED = 'webStorageEnabled';

/**
 * Request for a browser that can be rotated (orientation).
 *
 * @static
 * @property CAPABILITY_ROTATABLE
 * @type {String}
 */
Session.CAPABILITY_ROTATABLE = 'rotatable';

/**
 * Request for the browser to accept any ssl certificates
 *
 * @static
 * @property CAPABILITY_ACCEPT_SSL_CERTS
 * @type {String}
 */
Session.CAPABILITY_ACCEPT_SSL_CERTS = 'acceptSslCerts';

/**
 * Request for native-events
 *
 * @static
 * @property CAPABILITY_NATIVE_EVENTS
 * @type {String}
 */
Session.CAPABILITY_NATIVE_EVENTS = 'nativeEvents';

/**
 * Request for a proxy
 *
 * @static
 * @property CAPABILITY_PROXY
 * @type {String}
 */
Session.CAPABILITY_PROXY = 'proxy';


////////////////////
// Public Methods //
////////////////////

/**
 * Get the session-id.
 * Direct-access. No need to wait.
 *
 * @method id
 * @return {String}
 */
Session.prototype.id = function () {
  return this._values.sessionId;
};

/**
 * Get all the accepted capabilities.
 * Direct-access. No need to wait.
 *
 * @method capabilities
 * @return {Object}
 */
Session.prototype.capabilities = function () {
  return this._values.capabilities;
};
