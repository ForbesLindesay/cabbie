// Copyright (c) 2014 Forbes Lindesay
// Copyright (c) 2014 Marcel Erz
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

module.exports = Status;

/**
 * Selenium status
 *
 * @constructor
 * @class Status
 * @module WebDriver
 * @submodule System
 * @param {Object} values
 */
function Status (values) {
  this._values = values;
}


////////////////////
// Public Methods //
////////////////////

/**
 * A generic release label
 * Direct-access. No need to wait.
 *
 * @method getBuildVersion
 * @return {String}
 */
Status.prototype.getBuildVersion = function () {
  return this._values.build.version;
};

/**
 * The revision of the local source control client from which the server was built
 * Direct-access. No need to wait.
 *
 * @method getBuildRevision
 * @return {String}
 */
Status.prototype.getBuildRevision = function () {
  return this._values.build.revision;
};

/**
 * A timestamp from when the server was built.
 * Direct-access. No need to wait.
 *
 * @method getBuildTime
 * @return {Number}
 */
Status.prototype.getBuildTime = function () {
  return this._values.build.time;
};


/**
 * The current system architecture.
 * Direct-access. No need to wait.
 *
 * @method getOSArchitecture
 * @return {String}
 */
Status.prototype.getOSArchitecture = function () {
  return this._values.os.arch;
};

/**
 * The name of the operating system the server is currently running on: "windows", "linux", etc.
 * Direct-access. No need to wait.
 *
 * @method getOSName
 * @return {String}
 */
Status.prototype.getOSName = function () {
  return this._values.os.name;
};

/**
 * The operating system version.
 * Direct-access. No need to wait.
 *
 * @method getOSVersion
 * @return {String}
 */
Status.prototype.getOSVersion = function () {
  return this._values.os.version;
};


