'use strict';

console.log('# Test Async');
console.log();

var assert = require('assert');
var getBrowser = require('./get-browser');

var browser = getBrowser({mode: 'async', debug: true});

browser.navigateTo('http://www.example.com').then(function () {
  return browser.getElement('h1');
}).then(function (el) {
  return el.text();
}).then(function (text) {
  assert(text === 'Example Domain');
  return browser.dispose();
}).done(function () {
  console.log();
});
