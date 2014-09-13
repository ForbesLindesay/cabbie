// Copyright (c) 2014 Forbes Lindesay
// Copyrights licensed under the BSD License. See the accompanying LICENSE file for terms.

'use strict';

var http = require('http');
var st = require('st');

http.createServer(st(__dirname)).listen(1338);