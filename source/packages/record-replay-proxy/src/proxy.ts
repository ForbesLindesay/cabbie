'use strict';

import {URL} from 'url';
import {readFileSync, writeFileSync} from 'fs';
import {inspect} from 'util';
import express = require('express');
import bodyParser = require('body-parser');
import thenRequest, {HttpVerb} from 'then-request';
import deepEqual = require('deep-equal');
import {IncomingHttpHeaders} from 'http';
import {ProxyMode} from '.';

interface Request {
  method: string;
  url: string;
  headers: IncomingHttpHeaders;
  body: string | null;
}
interface Response {
  statusCode: number;
  headers: IncomingHttpHeaders;
  body: string | null;
}
interface Record {
  request: Request;
  response: Response;
}

const [modeStr, snapshotFile, destinationStr, portStr] = process.argv.slice(2);
const mode = modeStr as ProxyMode;
const destination = new URL(destinationStr);
const PORT = parseInt(portStr, 10);
const DESTINATION_HOST = destination.host;
const DESTINATION_ORIGIN = destination.origin;
const DESTINATION_PATH = destination.pathname.replace(/\/$/, '');
if (
  DESTINATION_ORIGIN + DESTINATION_PATH !==
  destinationStr.replace(/\/$/, '')
) {
  throw new Error('Invalid destination for proxy');
}

const app = express();

app.use(
  bodyParser.raw({
    inflate: false,
    type: () => true,
  }),
);

let recordedRequests: Record[] = [];
if (mode === ProxyMode.Replay) {
  recordedRequests = readFileSync(snapshotFile, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(str => JSON.parse(str));
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
  const request: Request = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body ? req.body.toString('base64') : null,
  };
  if (mode === ProxyMode.Record) {
    const headers: IncomingHttpHeaders = {};
    for (const key in req.headers) {
      headers[key] = req.headers[key];
    }
    headers.host = DESTINATION_HOST;
    thenRequest(
      req.method as HttpVerb,
      DESTINATION_ORIGIN + DESTINATION_PATH + req.url,
      {
        headers,
        body: req.body && req.body.length ? req.body : undefined,
      },
    ).done(rawResponse => {
      const response: Response = {
        statusCode: rawResponse.statusCode,
        headers: rawResponse.headers,
        body: rawResponse.body ? rawResponse.body.toString('base64') : null,
      };
      recordedRequests.push({request, response});
      writeFileSync(
        snapshotFile,
        recordedRequests.map(r => JSON.stringify(r)).join('\n'),
      );
      res.status(rawResponse.statusCode);
      res.set(rawResponse.headers);
      res.end(rawResponse.body);
    });
  } else {
    const logEntry = recordedRequests.length ? recordedRequests.shift() : null;
    if (!logEntry || !deepEqual(request, logEntry.request)) {
      res.status(500);
      res.send(
        'Unexpected request:\n\n' +
          inspectRequest(request) +
          (logEntry
            ? '\n\nExpected:\n\n' + inspectRequest(logEntry.request)
            : '') +
          '\n\nYou can record a new snapshot using chromedriver by running `npm run test:record`',
      );
      return;
    }
    res.status(logEntry.response.statusCode);
    res.set(logEntry.response.headers);
    if (logEntry.response.body) {
      res.end(Buffer.from(logEntry.response.body, 'base64'));
    } else {
      res.end();
    }
  }
});

function inspectRequest(request: Request) {
  return inspect(
    {
      method: request.method,
      url: request.url,
      headers: request.headers,
      body: request.body
        ? Buffer.from(request.body, 'base64').toString('utf8')
        : null,
    },
    {depth: 5},
  );
}

app.listen(PORT, () => {
  process.send!({status: 'started'});
});
