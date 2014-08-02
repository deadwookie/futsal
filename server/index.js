#!/bin/env node
// init config
var config = require('nconf')
  .argv()
  .env()
  .file('overrides', __dirname + '/config/server.overrides.json')
  .file('default', __dirname + '/config/server.json');

// process termination (ported from Openshift sample app)
var terminator = function(signal) {
  if (typeof signal === 'string') {
    console.log('SERVER [%s]: Received %s - terminating...', (new Date).toISOString(), signal);
    process.exit(1);
  }
  console.log('SERVER [%s]: Node stopped.', (new Date).toISOString());
};

(config.get('terminator:signals') || []).forEach(function(signal, index, array) {
  process.on(signal, function() {
    config.get('terminator:exit') && terminator(signal);
  });
});
process.on('exit', function() {
  terminator();
});


// server dependencies
var isDev = config.get('NODE_ENV') !== 'production';
var express = require('express');
var logger = require('morgan')(config.get('server:logFormat'));
var favicon = require('serve-favicon');
var statics = require('serve-static');
var cookieParser = require('cookie-parser')(config.get('session:secret'));
var session = require('./session');
var compression = require('compression')({
  threshold: config.get('server:compressFromKb')
});


// server setup
var app = express();
!isDev && app.use(logger);
app.use(compression);

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(statics(__dirname + '/public'));
app.use('/bower', statics(__dirname + '/../bower'));

app.use(cookieParser);
app.use(session);
isDev && app.use(logger);


// server routes
// app.get('/', function(req, res, next) {});

// errors
var HttpError = require('errors/http');
app.use(function(req, res, next) {
  // 404, as this is a last man standing
  next(new HttpError('Page not found.', 404));
});
app.use(function(err, req, res, next) {
  var status = err.status || 500,
    data = {
      statusCode: status,
      message: err.message
    };

  if (status === 400 || status >= 500) {
    isDev && (data.stackTrace = err.stack.split('\n'));
    console.warn('ERROR [%s]: %s', (new Date).toISOString(), err);
  }

  res.status(status).json(data);
});


// let the show go on
var host = config.get('OPENSHIFT_NODEJS_IP') || config.get('server:ipaddress'),
  port = config.get('OPENSHIFT_NODEJS_PORT') || config.get('PORT') || config.get('server:port');

app.listen(port, host, function() {
  console.log('SERVER [%s]: Node started on %s:%d...', (new Date).toISOString(), host, port);
});
