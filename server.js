const http = require('http')
const port = process.argv[2] || 9000
let handlers = []

http.createServer((request, response) => {
  let match = handlers.find(x => x.pattern.test(request.url))
  if (match) {
    match.handler(request, response, request.url.match(match.pattern))
  } else {
    response.writeHead(404)
    response.end()
  }
}).listen(port, '127.0.0.1')
console.log('Server running at http://127.0.0.1:' + port)

handlers.push({
  pattern: /^\/echo\/(\d{3})$/i,
  handler: (request, response, matches) => {
    let responseBody = ''
    request.on('data', chunk => responseBody += chunk.toString())
    request.on('end', () => {
      response.setHeader('x-method', request.method)
      if (request.headers['content-type']) {
        response.setHeader('content-type', request.headers['content-type'])
      }
      response.writeHead(parseInt(matches[1], 10))
      if (responseBody.length > 0) {
        response.write(responseBody)
      }
      response.end()
    })
  }
})

handlers.push({
  pattern: /^\/headers$/i,
  handler: (request, response, matches) => {
    response.writeHead(200, {'content-type': 'application/json'})
    response.end(JSON.stringify(request.headers))
  }
})

handlers.push({
  pattern: /^\/delay\/(\d+)$/i,
  handler: (request, response, matches) => {
    let delay = parseInt(matches[1], 10)
    setTimeout(() => {
      response.writeHead(200, {'content-type': 'text/plain'})
      response.end('Delayed for ' + delay)
    }, delay * 1000)
  }
})

handlers.push({
  pattern: /^\/stream\/(\d+)$/i,
  handler: (request, response, matches) => {
    let delaySeconds = parseInt(matches[1], 10);
    let counter = 0;
    let interval = setInterval(() => {
      counter++
      response.write(counter + '\n')
      if (counter >= delaySeconds) {
        clearInterval(interval)
        response.end()
      }
    }, 1000)
    response.writeHead(200, {'content-type': 'text/plain'})
  }
})

handlers.push({
  pattern: /^\/cookies$/i,
  handler: (request, response, matches) => {
    response.setHeader('set-cookie', ['alpha=1', 'beta=2'])
    response.writeHead(200)
    response.end()
  }
})
