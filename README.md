# Endpoint Validator
Endpoint Validator is a simple and lightweight tool for checking URL statuses and response integrity via JSON Scheme.

## Features
- HTTP status code check on given URL
- Integrity check on response data structure
- Relay health check data to other services

## Service Plugins
- _localhost.js_: is a dead simple server plugin that uses `http` module of Node.js to display the latest health check data in the browser
- _slack.js_: is a lightweight Slack Bot that messages to a given webhook if an URL responds with bad HTTP status code or if the data structure of the response does not match a given schema

## Usage

    npm run start

OR use your browser

    npm run start localhost

OR use Slack

    npm run start slack

Or use multplie services

    npm run start localhost slack

By default `SERVER_LOGGING` option is set to be `true`, therefore, all logs will appear on the console


## Note & Disclaimer
The approach I took with this project might not be optimal, but as my first Node.js project, I wanted to "play" a bit too. I wanted to better understand modules and what I could do with them.