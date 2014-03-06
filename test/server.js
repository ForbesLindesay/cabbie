'use strict';

var http = require('http');
var st = require('st');

http.createServer(st(__dirname)).listen(1338);