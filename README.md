# Endpoint Validator
Endpoint Validator is a simple and lightweight tool for checking URL statuses and validating both JSON and XML response schemas.

With this tool the developer can monitor endpoint health, which is useful when the Back End is a 3rd party support over which the developer has no or little control.

The tool uses the npm [Request](https://github.com/request/request) module.

## Features
- HTTP and HTTPS requests
- Status Code check on given URL
- JSON and XML parsing (jxon used for the latter)
- Schema validation on received response (using Yup)
- Relay URL health data to other services (see below)

## Services
- _monitoring.js_: is a dead simple server plugin that uses the `http` module of Node.js to display the latest health check data in the browser
- _slack.js_: is a simple Slack Bot that sends messages to a given webhook if the URL responds with a bad HTTP status code or if the response data structure does not match a given schema

## Install
Fork this repository and simply run `npm i`.

## Usage
After adding the URLs with their proper schema to the _endpoints.js_ file, just run the following

	npm start

Or use the Monitoring service and see the details in your browser

	npm start monitoring

Or use the _slack_ service and get notified in Slack

	npm start slack

Or use them both

	npm start monitoring slack

Or write your own services...


By default `SERVER_LOGGING` option is set to be `true`, so all logs will appear on the console as well.

## Recommended Reading
To write ever better schemas, one should definitely read the documentation for Yup.

https://github.com/jquense/yup

## Note & Disclaimer
The approach I took with this project might not be optimal or even good, but as my first Node.js project, I wanted to "play" a bit. I wanted to better understand modules and what I could do with them.

So.. Have fun!

## License
The MIT License (MIT)
Copyright (c) 2016 Peter Seprus

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
