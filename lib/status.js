'use strict';

module.exports = Status;

/**
 * Selenium status
 *
 * @param {Object} values
 * @constructor
 */
function Status (values) {
  this._values = values;
}


////////////////////
// Public Methods //
////////////////////

/**
 * A generic release label
 *
 * @returns {String}
 */
Status.prototype.getBuildVersion = function () {
  return this._values.build.version;
};

/**
 * The revision of the local source control client from which the server was built
 *
 * @returns {String}
 */
Status.prototype.getBuildRevision = function () {
  return this._values.build.revision;
};

/**
 * A timestamp from when the server was built.
 *
 * @returns {Number}
 */
Status.prototype.getBuildTime = function () {
  return this._values.build.time;
};


/**
 * The current system architecture.
 *
 * @returns {String}
 */
Status.prototype.getOSArchitecture = function () {
  return this._values.os.arch;
};

/**
 * The name of the operating system the server is currently running on: "windows", "linux", etc.
 *
 * @returns {String}
 */
Status.prototype.getOSName = function () {
  return this._values.os.name;
};

/**
 * The operating system version.
 *
 * @returns {String}
 */
Status.prototype.getOSVersion = function () {
  return this._values.os.version;
};


