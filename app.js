var http = require('http'),
    url = require('url'),
    httpProxy = require('http-proxy'),
    bunyan = require('bunyan'),
    uuid = require('node-uuid'),
    proxy = httpProxy.createProxyServer({}),
    config = require('./config');

var log = bunyan.createLogger({
    name: 'proxy',
    streams: [{
      stream: process.stdout,
      level: 'debug'
    }, {
      stream: process.stderr,
      level: 'error'
    }],
    serializers: bunyan.stdSerializers
});

// router table example
// https://blog.nodejitsu.com/node-http-proxy-1dot0/

var port = config.port || 3000,
    router = config.router || {},
    maintenance = config.maintenance || false;

// set up proxy server
var app = http.createServer(function(req, res) {
  var target = router[req.headers.host];

  // add a unique ID in case of error
  req.reqId = uuid();
  log.info({
      req: req,
      reqId: req.reqId,
      target: router[req.headers.host],
      maintenance: maintenance
    }, 'received request');

  if (maintenance) {
    log.info({
        reqId: req.reqId
      }, 'maintenance mode');
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('Server is undergoing maintenance, please check back soon.');
  } else if (target) {
    proxy.web(req, res, { target: router[req.headers.host] });
  } else {
    // request host not found in router
    log.warn({
        reqId: req.reqId,
        host: req.headers.host,
      }, 'host not found in router');
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end('Address not available.');
  }
}).listen(port, function() {
  log.info('proxy listening on port ' + port);
});

// proxy error
proxy.on('error', function(err, req, res) {
  log.error({ err: err, reqId: req.reqId}, 'proxy error');
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Server error.');
});

// app.on('close', function() {
//   log.info('shutting down proxy');
// });
