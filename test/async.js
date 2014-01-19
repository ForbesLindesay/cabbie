'use strict';

console.log('# Test Async');
console.log();

var assert = require('assert');
var getBrowser = require('./get-browser');

var browser = getBrowser({mode: 'async', debug: true});

browser.sauceJobUpdate({name: 'asynchronous', build: process.env.TRAVIS_JOB_ID}).then(function () {
  return browser.setTimeouts({
    'implicit': '10s',
    'async': '10s'
  });
}).then(function () {
  return browser.navigateTo('http://www.example.com')
}).then(function () {
  return browser.getElement('h1');
}).then(function (el) {
  return el.text();
}).then(function (text) {
  assert(text === 'Example Domain');
}).then(function () {
  return browser.dispose({passed: true});
}, function (err) {
  return browser.dispose({passed: false}).then(function () {
    throw err;
  });
}).done(function () {
  console.log();
});
