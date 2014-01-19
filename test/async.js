'use strict';

console.log('# Test Async');
console.log();

var assert = require('assert');
var getBrowser = require('./get-browser');

var browser = getBrowser({mode: 'async', debug: true});

browser.sauceJobUpdate({name: 'asynchronous', build: process.env.TRAVIS_JOB_ID}).then(function () {
  return browser.navigateTo('http://www.example.com')
}).then(function () {
  return browser.getElement('h1');
}).then(function (el) {
  return el.text();
}).then(function (text) {
  assert(text === 'Example Domain');
}).then(function () {
  return browser.sauceJobUpdate({passed: true});
}, function (err) {
  return browser.sauceJobUpdate({passed: false}).then(function () {
    return browser.dispose();
  }).then(function () {
    throw err;
  });
}).then(function () {
  return browser.dispose();
}).done(function () {
  console.log();
});
