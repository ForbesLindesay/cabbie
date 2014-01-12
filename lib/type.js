'use strict';

module.exports = checkType;
function checkType(name, obj, expected) {
  if (expected[expected.length - 1] === '?') {
    expected = expected.substring(0, expected.length - 1);
    if (obj === null || obj === undefined) return;
  }
  var actual = type(obj);
  var matches = expected.split('|').some(function (expected) {
    if (actual === 'Array' && obj.length === 0 && /^Array/.test(expected)) {
      return true;
    }
    if (expected === 'Array.<Any>' || expected === 'Array') {
      return Array.isArray(actual);
    }
    return actual === expected;
  });
  if (matches) return;
  var err = new TypeError('Expected `' + name + '` to match type {' + expected
                      + '} but got {' + actual + '}');
  throw err;
}
function type(val) {
  switch (toString.call(val)) {
    case '[object Date]': return 'Date';
    case '[object RegExp]': return 'RegExp';
    case '[object Arguments]': return 'Arguments';
    case '[object Error]': return 'Error';
    case '[object Array]':
      if (val.length === 0) return 'Array';
      var subType = val.map(type).reduce(function (a, b) {
        if (a === b) return a;
        else return null;
      });
      if (subType) return 'Array.<' + subType + '>';
      return 'Array.<Any>';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val !== val) return 'NaN';

  var t = (typeof val.valueOf());
  return t[0].toUpperCase() + t.substring(1);
};