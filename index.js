'use strict';

var Browser = require('./lib/browser.js');
var JSON = require('./lib/json.js');
var type = require('./lib/type.js');

var httpSync, httpAsync;

/*
module.exports = Driver;
function Driver(timing, base, auth) {
  type('timing', timing, 'String');
  type('base', base, 'String');
  type('auth', auth, 'String?');

  if (timing === 'sync') {
    try {
      if (!httpSync) {
        httpSync = require('http-sync').request;
      }
    } catch (ex) {
      httpSync = require('http-sync-win').request;
    }
  } else if (timing === 'async') {
    if (!httpAsync) {
      httpAsync = require('promise').denodeify(require('request'));
    }
  } else {
    var err = new Error('Expected `timing` to be "async" or "sync" not '
                        + JSON.stringify(timing));
    throw err;
  }

  this._timing = timing;
  this._base = base.replace(/\/$/, '');
  this._auth = auth;
  this._events = {
    'request': [],
    'response': []
  };
}
Driver.prototype.emit = function (name, arg) {
  for (var i = 0; i < this._events[name].length; i++) {
    this._events[name][i](arg);
  }
};
Driver.prototype.on = function (name, handler) {
  type('name', name, 'String');
  type('handler', handler, 'Function');
  if (name !== 'request' && name !== 'response') {
    var err = new TypeError('Unexpected event name '
                            + JSON.stringify(name)
                            + ', expected "request" or "response".');
    throw err;
  }
  this._events[name].push(handler);
  return this;
};
Driver.prototype.request = function (method, path, body, logResponse) {
  var uri = this._base + path;
  this.emit('request', {
    method: method,
    path: path,
    body: body
  });
  if (typeof body !== 'string' && !Buffer.isBuffer(body)) {
    body = JSON.stringify(body);
  }
  if (this._timing === 'async') {
    return httpAsync({
      method: method,
      uri: uri,
      body: body
    }).then(function (res) {
      res = {
        statusCode: res.statusCode,
        body: JSON.parse(res.body.toString())
      };
      this.emit('response', res);
      if (logResponse) logResponse(res);
      return res;
    }.bind(this));
  } else {
    var res = httpSync({
      method: method,
      uri: uri,
      body: body
    });
    this.emit('response', res);
    if (logResponse) logResponse(res);
    return res;
  }
};
Driver.prototype.browser = function (capabilities, options) {
  var request = this.request.bind(this);
  return new Browser(function (method, path, body) {
    return request(method, path, body);
  }, capabilities, options);
};
*/

var chromedriver = require('chromedriver');
chromedriver.start();
var browser = new Browser('http://localhost:9515/', {}, {mode: 'async'})
.debug(function (event) {
  switch (event.type) {
    case 'method-call':
      var msg = event.target;
      if (event.selector) {
        msg += '("' + event.selector + '")';
      }
      msg += '.' + event.name;
      msg += '(' + event.args.map(function (a) {
        return require('util').inspect(a, {colors: true});
      }).join(', ') + ')';
      if (event.result && typeof event.result !== 'object') {
        msg += ' => ' + require('util').inspect(event.result, {colors: true});
      }
      console.log('     - ' + msg);
      break;
    default:
      console.dir(event);
  }
});
/*
.on('request', function (req) {
  console.log(require('util').inspect(req, {colors: true}));
})
.on('response', function (res) {
  console.log(require('util').inspect(res, {colors: true}));
});
*/

browser.navigateTo('http://www.example.com').then(function () {
  return browser.getElement('h1');
}).then(function (el) {
  return el.text();
}).then(function () {
  return browser.dispose();
}, function (ex) {
  return browser.dispose().then(function () {
    throw ex;
  }, function () {
    throw ex;
  });
}).done();
/*
try {
  browser.navigateTo('http://www.example.com');
  browser.getElement('h1').text();
} catch (ex) {
  browser.dispose();
  throw ex;
}
browser.dispose();
*/