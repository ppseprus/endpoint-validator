# Endpoint Validator
Endpoint Validator is a simple and lightweight tool for checking URL statuses and response integrity via JSON Scheme.

## Features
- HTTP status check on given URL
- Integrity check on response data structure
- Relay URL health data to other services (see below)

## Services
- _localhost.js_: is a dead simple server plugin that uses the `http` module of Node.js to display the latest health check data in the browser
- _slack.js_: is a simple Slack Bot that sends messages to a given webhook if the URL responds with a bad HTTP status code or if the response data structure does not match a given schema

## Usage

    npm run start

Or use the _localhost_ service and see the details in your browser

    npm run start localhost

Or use the _slack_ service and get notified in Slack

    npm run start slack

Or use them both

    npm run start localhost slack

Or write your own services...


By default `SERVER_LOGGING` option is set to be `true`, so all logs will appear on the console as well.


## Note & Disclaimer
The approach I took with this project might not be optimal or even good, but as my first Node.js project, I wanted to "play" a bit. I wanted to better understand modules and what I could do with them.

So.. Have fun!