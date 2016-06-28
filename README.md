# Endpoint Validator
Endpoint Validator is a simple and lightweight tool for checking URL statuses and validating both JSON and XML response schemas.

With this tool the developer can monitor endpoint health, which is useful when the Back End is a 3rd party support over which the developer has no or little control. 

## Features
- HTTP status check on given URL
- JSON or XML schema validation on received response (using Yup)
- Relay URL health data to other services (see below)

## Services
- monitoring.js_: is a dead simple server plugin that uses the `http` module of Node.js to display the latest health check data in the browser
- _slack.js_: is a simple Slack Bot that sends messages to a given webhook if the URL responds with a bad HTTP status code or if the response data structure does not match a given schema

## Usage

    npm run start

Or use the Monitoring service and see the details in your browser

    npm run start monitoring

Or use the _slack_ service and get notified in Slack

    npm run start slack

Or use them both

    npm run start monitoring slack

Or write your own services...


By default `SERVER_LOGGING` option is set to be `true`, so all logs will appear on the console as well.

## Recommended Reading
To write ever better schemas, one should definitely read the documentation for Yup.

https://github.com/jquense/yup

## Note & Disclaimer
The approach I took with this project might not be optimal or even good, but as my first Node.js project, I wanted to "play" a bit. I wanted to better understand modules and what I could do with them.

So.. Have fun!

## License
MIT