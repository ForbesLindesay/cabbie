'use strict';

module.exports = when;
module.exports.done = whenDone;
module.exports.try = whenTry;


//////////////////////
// Public Functions //
//////////////////////

/**
 * When promise is fulfilled, then execute callback
 *
 * @param {*} val
 * @param {Function} fn
 * @return {*}
 */
function when (val, fn) {
  if (isPromise(val)) {
    return val.then(fn);
  } else {
    return fn(val);
  }
}


//////////////////////
// Unused Functions //
//////////////////////

function whenDone (val, fn) {
  if (isPromise(val)) {
    return val.done(fn);
  } else {
    return fn(val);
  }
}

function whenTry (fn, cb, eb) {
  var val;
  try {
    val = fn();
  } catch (ex) {
    return eb(ex);
  }
  if (isPromise(val)) {
    return val.then(cb, eb);
  } else {
    return cb(val);
  }
}


///////////////////////
// Private Functions //
///////////////////////

/**
 * Test whether a value is a promise or not
 *
 * @param {Object} val
 * @return {Boolean}
 */
function isPromise (val) {
  return val && (typeof val === 'object' || typeof val === 'function') && typeof val.then === 'function';
}