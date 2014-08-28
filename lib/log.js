'use strict';

var EventEmitter = require('events').EventEmitter;
var when = require('./when');

module.exports = logMethods;


//////////////////////
// Public Functions //
//////////////////////

/**
 *
 * @param obj
 */
function logMethods (obj) {
  for (var key in obj) {
    if (key[0] !== '_' && !(key in EventEmitter.prototype) && typeof obj[key] === 'function') {
      obj[key] = logMethod(key, obj[key]);
    }
  }
}


///////////////////////
// Private Functions //
///////////////////////

/**
 *
 * @param name
 * @param method
 * @returns {Function}
 */
function logMethod (name, method) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var event = {
      name: name,
      args: args
    };
    return when.try(function () {
      return method.apply(this, args);
    }.bind(this), function (res) {
      event.result = res;
      this._logMethodCall(event);
      return res;
    }.bind(this), function (err) {
      event.error = err;
      this._logMethodCall(event);
      throw err;
    }.bind(this));
  };
}