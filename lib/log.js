'use strict';

var EventEmitter = require('events').EventEmitter;
var when = require('./when');

module.exports = logMethods;

var indentation = 0;

//////////////////////
// Public Functions //
//////////////////////

/**
 * Wraps every method in an object with a logger
 *
 * @param {Object} obj
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
 * Wraps one method with a function that logs input and output
 *
 * @param {String} name
 * @param {Function} method
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
      indentation++;
      event.state = 'Start';
      event.indentation = indentation;
      this._logMethodCall(event);
      return method.apply(this, args);
    }.bind(this), function (res) {
      indentation--;
      event.state = 'End';
      event.result = res;
      this._logMethodCall(event);
      return res;
    }.bind(this), function (err) {
      indentation--;
      event.state = 'Err';
      event.error = err;
      this._logMethodCall(event);
      throw err;
    }.bind(this));
  };
}