(function() {
	'use strict';

	const PORT = 3000;
	const REFRESH_INTERVAL = 5; // in seconds

	var _ = require('lodash'),
		http = require('http'),
		util = require('./../util'),
		displayObject = [];


	http.createServer(function(request, response) {
		response.on('error', function(err) {
			console.error(err);
		});

		response.writeHead(200, {'Content-Type': 'text/html'});

		// NOTE TO SELF:
		// terrible solution
		var html = `<meta http-equiv="refresh" content="${REFRESH_INTERVAL}; URL=http://localhost:${PORT}">`;

		// NOTE TO SELF:
		// alphabetical order should be replaced in the future
		_.forEach(_.sortBy(displayObject, ['alias']), healthObject => {
			var style = '',
				fontColor = '',
				backgroundColor = '',
				borderColor = '';

			if (/^[12]..$/.test(healthObject.HTTPStatusCode) && healthObject.isConsistent) {
				// 1xx Informational
				// 2xx Success
				fontColor = '3c763d';
				backgroundColor = 'dff0d8';
				borderColor = 'd0e9c6';
			} else if (/^.$/.test(healthObject.HTTPStatusCode) && healthObject.isConsistent) {
				// 3xx Redirection
				fontColor = '8a6d3b';
				backgroundColor = 'fcf8e3';
				borderColor = 'faf2cc';
			} else {
				fontColor = 'a94442';
				backgroundColor = 'f2dede';
				borderColor = 'ebcccc';
			}

			style = `padding: 5px; margin-bottom: .5rem; color: #${fontColor}; background-color: #${backgroundColor}; border: 1px solid #${borderColor}; border-radius: .25rem; font-size: 14px; font-family: 'Helvetica';`;

			html += `<div class="health-data" style="${style}">`;
			html += 	`Endpoint <strong><span>${healthObject.alias}</span></strong><br>`;

			html += 	`<div style="margin-top: 4px; margin-bottom: 4px;">`;
			if (/^[12]..$/.test(healthObject.HTTPStatusCode) && healthObject.isConsistent) {
				html += `Available & Consistent<br>`;

			} else {

				if (!/^[12]..$/.test(healthObject.HTTPStatusCode)) {
					html += `HTTP status code was <span>${healthObject.HTTPStatusCode}</span><br>`;
				}

				if (!healthObject.isConsistent) {
					html += `Response data structure was <span>inconsistent</span><br>`;
				}

			}
			html += 	`</div>`;

			html += 	`<span style="font-size: 12px;">${util.elapsedTime(healthObject.timestamp)}</span>`;
			html += `</div>`;
		});

		response.write(html);
		response.end();

	}).listen(PORT);
	console.log(`Monitoring service is running on http://localhost:${PORT}`);


	module.exports = function(healthObject) {
		// NOTE TO SELF:
		// endpoint alias must be unique
		var D = _.reject(displayObject, {alias: healthObject.alias});
		D.push(healthObject);
		displayObject = D;
	};

})();