'use strict';

module.exports = logMethods;
function logMethods(obj) {
  for (var key in obj) {
    if (key[0] !== '_' && typeof obj[key] === 'function') {
      obj[key] = logMethod(key, obj[key]);
    }
  }
}
function logMethod(name, method) {
  return function () {
    this._log({
      type: 'method-call',
      name: name, 
      args: Array.prototype.slice.call(arguments)
    });
    return method.apply(this, arguments);
  };
}