# cabbie

A webdriver client

[![Build Status](https://travis-ci.org/ForbesLindesay/cabbie.png?branch=master)](https://travis-ci.org/ForbesLindesay/cabbie)
[![Selenium Test Status](https://saucelabs.com/buildstatus/cabbie)](https://saucelabs.com/u/cabbie)
[![Dependency Status](https://gemnasium.com/ForbesLindesay/cabbie.png)](https://gemnasium.com/ForbesLindesay/cabbie)
[![NPM version](https://badge.fury.io/js/cabbie.png)](http://badge.fury.io/js/cabbie)

## Installation

    npm install cabbie

## Usage

```js
var assert = require('assert');
var getBrowser = require('cabbie');
var chromedriver = require('chromedriver');

chromedriver.start();

var browser = getBrowser('http://localhost:9515/', {}, {mode: 'sync', debug: true});

browser.navigateTo('http://www.example.com');
assert(browser.getElement('h1').text() === 'Example Domain');

browser.dispose();

chromedriver.stop();
```

## License

  MIT