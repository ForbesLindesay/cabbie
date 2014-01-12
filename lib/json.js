'use strict';

var type = require('./type');
var indent = '';
if (__dirname.indexOf('node_modules') === -1) {
  indent = '  ';
}

exports.parse = parse;
function parse(str) {
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
function stringify(obj) {
  return JSON.stringify(obj, null, indent);
}