'use strict';

const fs = require('fs');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const thenRequest = require('then-request');
const deepEqual = require('deep-equal');

const RECORD = process.argv.includes('--record');

const app = express();

app.use(bodyParser.raw({
  inflate: false,
  type: () => true,
}));

let log = [];
if (!RECORD) {
  log = fs.readFileSync(__dirname + '/snapshot.json', 'utf8').split('\n').filter(Boolean).map(JSON.parse);
}
let timeout = setTimeout(() => {
  console.error('No request received for 4 seconds, killing proxy');
  process.exit(1);
}, 4000);
app.use((req, res) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.error('No request received for 4 seconds, killing proxy');
    process.exit(1);
  }, 4000);
  const request = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body ? req.body.toString('base64') : null,
  };
  if (RECORD) {
    const headers = {};
    for (const key in req.headers) {
      headers[key] = req.headers[key];
    }
    headers.host = 'localhost:9515';
    thenRequest(req.method, 'http://localhost:9515' + req.url, {
      headers,
      body: req.body,
    }).done(rawResponse => {
      const response = {
        statusCode: rawResponse.statusCode,
        headers: rawResponse.headers,
        body: rawResponse.body ? rawResponse.body.toString('base64') : null,
      };
      log.push(JSON.stringify({request, response}));
      fs.writeFileSync(__dirname + '/snapshot.json', log.join('\n'));
      res.status(rawResponse.statusCode);
      res.set(rawResponse.headers);
      res.end(rawResponse.body);
    });
  } else {
    const logEntry = log.length ? log.shift() : null;
    if (!logEntry || !deepEqual(request, logEntry.request)) {
      res.status(500);
      res.send(
        'Unexpected request:\n\n' +
        inspectRequest(request) +
        (logEntry ? '\n\nExpected:\n\n' + inspectRequest(logEntry.request) : '') +
        '\n\nYou can record a new snapshot using chromedriver by running `npm run test:record`'
      );
      return;
    }
    res.status(logEntry.response.statusCode);
    res.set(logEntry.response.headers);
    res.end(new Buffer(logEntry.response.body, 'base64'));
  }
});

function inspectRequest(request) {
  return util.inspect(
    {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body ? new Buffer(request.body, 'base64').toString('utf8') : null,
    },
    {depth: 5}
  );
}

app.listen(7883, () => {
  process.send({status: 'started'});
});
