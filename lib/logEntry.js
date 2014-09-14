'use strict';

module.exports = LogEntry;

/**
 * Remote log-entry
 *
 * @constructor
 * @class LogEntry
 * @module WebDriver
 * @submodule System
 * @param {Object} values
 */
function LogEntry (values) {
  this._values = values;
}


//////////////////
// Enumerations //
//////////////////

/**
 * Log level 'All'
 *
 * @static
 * @property LEVEL_ALL
 * @type {string}
 */
LogEntry.LEVEL_ALL = 'ALL';

/**
 * Log level 'Debug'
 *
 * @static
 * @property LEVEL_DEBUG
 * @type {string}
 */
LogEntry.LEVEL_DEBUG = 'DEBUG';

/**
 * Log level 'Info'
 *
 * @static
 * @property LEVEL_INFO
 * @type {string}
 */
LogEntry.LEVEL_INFO = 'INFO';

/**
 * Log level 'Warning'
 *
 * @static
 * @property LEVEL_WARNING
 * @type {string}
 */
LogEntry.LEVEL_WARNING = 'WARNING';

/**
 * Log level 'Severe'
 *
 * @static
 * @property LEVEL_SEVERE
 * @type {string}
 */
LogEntry.LEVEL_SEVERE = 'SEVERE';

/**
 * Log level 'Off'. Nothing will be logged.
 *
 * @static
 * @property LEVEL_OFF
 * @type {string}
 */
LogEntry.LEVEL_OFF = 'OFF';


/**
 * Source type of the log-entry - 'client'
 *
 * @static
 * @property TYPE_CLIENT
 * @type {string}
 */
LogEntry.TYPE_CLIENT = 'client';

/**
 * Source type of the log-entry - 'driver'
 *
 * @static
 * @property TYPE_DRIVER
 * @type {string}
 */
LogEntry.TYPE_DRIVER = 'driver';

/**
 * Source type of the log-entry - 'browser'
 *
 * @static
 * @property TYPE_BROWSER
 * @type {string}
 */
LogEntry.TYPE_BROWSER = 'browser';

/**
 * Source type of the log-entry - 'server'
 *
 * @static
 * @property TYPE_SERVER
 * @type {string}
 */
LogEntry.TYPE_SERVER = 'server';


////////////////////
// Public Methods //
////////////////////

/**
 * The timestamp of the entry.
 * Direct-access. No need to wait.
 *
 * @method getTimestamp
 * @return {Number}
 */
LogEntry.prototype.getTimestamp = function () {
  return this._values.timestamp;
};

/**
 * The log level of the entry.
 * Direct-access. No need to wait.
 *
 * @method getLevel
 * @return {String}
 */
LogEntry.prototype.getLevel = function () {
  return this._values.level;
};

/**
 * The log message.
 * Direct-access. No need to wait.
 *
 * @method getMessage
 * @return {String}
 */
LogEntry.prototype.getMessage = function () {
  return this._values.message;
};

