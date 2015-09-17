# node-test-server
A simple HTTP server for testing purposes built in raw [Node.js](https://nodejs.org).

To run the server, clone/download the source code and then run

```
node server.js [port]
```

No `npm install` required!

The test server has a handful of endpoints, described below:

## Echo

This endpoint echoes back data from the request, including the response status code.
This is useful for testing an HTTP library because you can control the input.

Request details:
* **HTTP Method:** any!
* **URL Template:** `/echo/{statusCode}`
* **Required Headers:** none
* **Request Body:** (optional) any!

Response details:
* **Status Code:** based on the request url
* **Response Headers:**
  * `x-method` - returns the HTTP method used in the request
  * `content-type` - echoed from the request, if provided
* **Response Body:** the request body

Example usage (curl):
```
$ curl -i -X PUT -H "content-type: text/plain" -d "hello world" http://127.0.0.1:9000/echo/201
HTTP/1.1 201 Created
x-method: PUT
content-type: text/plain
Date: Thu, 17 Sep 2015 17:54:33 GMT
Connection: keep-alive
Transfer-Encoding: chunked

hello world
```


## Headers

This endpoint returns all the headers that were provided as a JSON result. Note that due to Node.js, all the header names will be lower cased.

Request details:
* **HTTP Method:** `GET`
* **URL Template:** `/headers`
* **Required Headers:** none
* **Request Body:** none

Response details:
* **Status Code:** 200
* **Response Headers:**
  * `content-type: application/json`
* **Response Body:** JSON representation of the headers that were passed in

Example usage (curl):
```
$ curl -i http://localhost:9000/headers
HTTP/1.1 200 OK
content-type: application/json
Date: Thu, 17 Sep 2015 22:13:37 GMT
Connection: keep-alive
Transfer-Encoding: chunked

{"user-agent":"curl/7.41.0","host":"localhost:9000","accept":"*/*"}
```


## Delay

This endpoint delays for a specified amount of time and then sends a response.
Useful for testing timeout behaviors.

(Note that because JavaScript, the timing is not exact.)

Request details:
* **HTTP Method:** `GET`
* **URL Template:** `/delay/{secondsToDelay}`
* **Required Headers:** none
* **Request Body:** none

Response details:
* **Status Code:** 200
* **Response Headers:**
  * `content-type: text/plain`
* **Response Body:** a message with the number of seconds delayed

Example usage (curl):
```
$ curl -i http://127.0.0.1:9000/delay/5
HTTP/1.1 200 OK
content-type: text/plain
Date: Thu, 17 Sep 2015 17:59:40 GMT
Connection: keep-alive
Transfer-Encoding: chunked

Delayed for 5
```


## Stream

This endpoint streams data back to the client over a specified number of seconds. Once per second it sends back a count.

(Note that because JavaScript, the timing is not exact.)

Request details:
* **HTTP Method:** `GET`
* **URL Template:** `/delay/{secondsToStream}`
* **Required Headers:** none
* **Request Body:** none

Response details:
* **Status Code:** 200
* **Response Headers:**
  * `content-type: text/plain`
* **Response Body:** a message which is streamed back, one number per second

Example usage (curl):
```
$ curl -i http://127.0.0.1:9000/stream/5
HTTP/1.1 200 OK
content-type: text/plain
Date: Thu, 17 Sep 2015 19:15:37 GMT
Connection: keep-alive
Transfer-Encoding: chunked

1
2
3
4
5
```


## Cookies

This endpoint returns two `set-cookie` headers so you can test handling multiple of the same header name.

Request details:
* **HTTP Method:** `GET`
* **URL Template:** `/cookies`
* **Required Headers:** none
* **Request Body:** none

Response details:
* **Status Code:** 200
* **Response Headers:**
  * `set-cookie: alpha=1`
  * `set-cookie: beta=2`
* **Response Body:** none

Example usage (curl):
```
$ curl -i http://127.0.0.1:9000/cookies
HTTP/1.1 200 OK
set-cookie: alpha=1
set-cookie: beta=2
Date: Thu, 17 Sep 2015 19:18:40 GMT
Connection: keep-alive
Transfer-Encoding: chunked
```
