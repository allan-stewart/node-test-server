var http = require('http');

var port = process.argv[2] || 9000;

var handlers = [];

http.createServer(function (request, response) {
  var match = handlers.find(function (x) {
    return x.pattern.test(request.url)
  });
  if (match) {
    match.handler(request, response, request.url.match(match.pattern));
  } else {
    notFoundHandler(request, response);
  }
}).listen(port, "127.0.0.1");

console.log('Server running at http://127.0.0.1:' + port);

handlers.push({pattern: /^\/echo\/(\d{3})$/i, handler: function (request, response, matches) {
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
}});

handlers.push({pattern: /^\/headers$/i, handler: function (request, response, matches) {
  response.writeHead(200, {'content-type': 'application/json'});
  response.end(JSON.stringify(request.headers));
}});

handlers.push({pattern: /^\/delay\/(\d+)$/i, handler: function (request, response, matches) {
  var delay = parseInt(matches[1], 10);
  setTimeout(function () {
    response.writeHead(200, {'content-type': 'text/plain'});
    response.end("Delayed for " + delay);
  }, delay * 1000);
}});

handlers.push({pattern: /^\/stream\/(\d+)$/i, handler: function (request, response, matches) {
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
}});

handlers.push({pattern: /^\/cookies$/i, handler: function (request, response, matches) {
  response.setHeader('set-cookie', ['alpha=1', 'beta=2'])
  response.writeHead(200);
  response.end();
}});

function notFoundHandler(request, response) {
  response.writeHead(404);
  response.end();
}
