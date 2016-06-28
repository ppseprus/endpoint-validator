(function() {
	'use strict';

	const PORT = 3000;
	const REFRESH_INTERVAL = 5; // in seconds
	const PUG_OPTIONS = {
		doctype: 'html',
		pretty: true
	};
	const COLORS = {
		success: {
			fontColor: '3c763d',
			backgroundColor: 'dff0d8',
			borderColor: 'd0e9c6'
		},
		warning: {
			fontColor: '8a6d3b',
			backgroundColor: 'fcf8e3',
			borderColor: 'faf2cc'
		},
		error: {
			fontColor: 'a94442',
			backgroundColor: 'f2dede',
			borderColor: 'ebcccc'
		}
	};

	var _ = require('lodash'),
		http = require('http'),
		pug = require('pug'),
		util = require('./../util'),
		healthObjects = [],
		htmlOutPut = pug.compileFile('./services/localhost.pug', PUG_OPTIONS);

	http.createServer((request, response) => {
		response.on('error', error => {
			console.error(error);
		});

		response.writeHead(200, {'Content-Type': 'text/html'});
		var notifications = [];

		// NOTE TO SELF:
		// alphabetical order should be replaced in the future
		_.forEach(_.sortBy(healthObjects, ['alias']), healthObject => {
			var colors = {};

			if (/^[12]..$/.test(healthObject.HTTPStatusCode) && healthObject.isConsistent) {
				// 1xx Informational
				// 2xx Success
				colors = COLORS.success;
			} else if (/^.$/.test(healthObject.HTTPStatusCode) && healthObject.isConsistent) {
				// 3xx Redirection
				colors = COLORS.warning;
			} else {
				colors = COLORS.error;
			}

			notifications.push({
				style: `color: #${colors.fontColor};
					background-color: #${colors.backgroundColor};
					border: 1px solid #${colors.borderColor};`,
				healthObject: {
					elapsedTime: util.elapsedTime(healthObject.timestamp),
					alias: healthObject.alias,
					isConsistent: healthObject.isConsistent,
					HTTPStatusCode: healthObject.HTTPStatusCode
				}
			});

		});

		response.write(htmlOutPut({
			meta: {
				contentRefreshInterval: REFRESH_INTERVAL,
				contentUrl: `URL=http://localhost:${PORT}`
			},
			styles: {
				div: `margin-bottom: .5rem;
					padding: 5px;
					border-radius: .25rem;
					font-size: 14px;
					font-family: 'Helvetica';`,
				inner: `margin-top: 4px;
					margin-bottom: 4px;`,
				p: `margin: 0;
					padding: 0;`,
				timestamp: `font-size: 12px;`
			},
			notifications: notifications
		}));
		response.end();

	}).listen(PORT);
	console.log(`Monitoring service is running on http://localhost:${PORT}`);


	module.exports = function(healthObject) {
		// NOTE TO SELF:
		// endpoint alias must be unique
		var H = _.reject(healthObjects, {alias: healthObject.alias});
		H.push(healthObject);
		healthObjects = H;
	};

})();