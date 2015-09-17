var http = require('http');

var port = process.argv[2] || 9000;

var echoPattern = /^\/echo\/(\d{3})$/i;
var delayPattern = /^\/delay\/(\d+)$/i;
var streamPattern = /^\/stream\/(\d+)$/i;
var cookiesPattern = /^\/cookies$/i;


http.createServer(function (request, response) {
  var handler = getRouteHandler(request);
  handler(request, response);
}).listen(port, "127.0.0.1");

console.log('Server running at http://127.0.0.1:' + port);


function getRouteHandler(request) {
  console.log(request.url);
  if (echoPattern.test(request.url)) {
    return echoHandler;
  }
  if (delayPattern.test(request.url)) {
    return delayHandler;
  }
  if (streamPattern.test(request.url)) {
    return streamHandler;
  }
  if (cookiesPattern.test(request.url)) {
    return cookiesHandler;
  }
  return notFoundHandler;
}

function echoHandler(request, response) {
  var matches = request.url.match(echoPattern);
  var responseBody = "";
  request.on('data', function (chunk) {
    responseBody += chunk.toString();
  });
  request.on('end', function () {
    response.setHeader('x-method', request.method);
    if (request.headers['content-type']) {
      response.setHeader('content-type', request.headers['content-type']);
    }
    response.writeHead(parseInt(matches[1], 10));
    if (responseBody.length > 0) {
      response.write(responseBody);
    }
    response.end();
  });
}

function delayHandler(request, response) {
  var matches = request.url.match(delayPattern);
  var delay = parseInt(matches[1], 10);
  setTimeout(function () {
    response.writeHead(200, {'content-type': 'text/plain'});
    response.end("Delayed for " + delay);
  }, delay * 1000);
}

function streamHandler(request, response) {
  var matches = request.url.match(streamPattern);
  var delaySeconds = parseInt(matches[1], 10);
  var counter = 0;
  var interval = setInterval(function () {
    counter++;
    response.write(counter + '\n');
    if (counter >= delaySeconds) {
      clearInterval(interval);
      response.end();
    }
  }, 1000);

  response.writeHead(200, {'content-type': 'text/plain'});
}

function cookiesHandler(request, response) {
  response.setHeader('set-cookie', ['alpha=1', 'beta=2'])
  response.writeHead(200);
  response.end();
}

function notFoundHandler(request, response) {
  response.writeHead(404);
  response.end();
}
