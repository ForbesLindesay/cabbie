'use strict';

var type = require('./type');

// Indentation when it is not in node_modules
var indent = '';
if (__dirname.indexOf('node_modules') === -1) {
  indent = '  ';
}


////////////////////
// Public Methods //
////////////////////

exports.parse = parse;

/**
 * Parse a JSON string to a js-value
 *
 * Note: Small wrapper around standard JSON parser
 *
 * @param {String} str
 * @return {*}
 */
function parse (str) {
  if (Buffer.isBuffer(str)) str = str.toString();
  type('str', str, 'String');
  try {
    return JSON.parse(str);
  } catch (ex) {
    ex.message = 'Unable to parse JSON: ' + ex.message + '\nAttempted to parse: ' + str;
    throw ex;
  }
}

exports.stringify = stringify;

/**
 * Convert a js-value to a JSON string
 *
 * @param {*} obj
 * @return {String}
 */
function stringify (obj) {
  return JSON.stringify(obj, null, indent);
}