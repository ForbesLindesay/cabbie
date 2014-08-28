'use strict';

module.exports = LogEntry;

/**
 * Remote log-entry
 *
 * @param {Object} values
 * @constructor
 */
function LogEntry (values) {
  this._values = values;
}


//////////////////
// Enumerations //
//////////////////

LogEntry.LEVEL_ALL = 'ALL';
LogEntry.LEVEL_DEBUG = 'DEBUG';
LogEntry.LEVEL_INFO = 'INFO';
LogEntry.LEVEL_WARNING = 'WARNING';
LogEntry.LEVEL_SEVERE = 'SEVERE';
LogEntry.LEVEL_OFF = 'OFF';

LogEntry.TYPE_CLIENT = 'client';
LogEntry.TYPE_DRIVER = 'driver';
LogEntry.TYPE_BROWSER = 'browser';
LogEntry.TYPE_SERVER = 'server';


////////////////////
// Public Methods //
////////////////////

/**
 * The timestamp of the entry.
 *
 * @returns {Number}
 */
LogEntry.prototype.getTimestamp = function () {
  return this._values.timestamp;
};

/**
 * The log level of the entry.
 *
 * @returns {String}
 */
LogEntry.prototype.getLevel = function () {
  return this._values.level;
};

/**
 * The log message.
 *
 * @returns {String}
 */
LogEntry.prototype.getMessage = function () {
  return this._values.message;
};

