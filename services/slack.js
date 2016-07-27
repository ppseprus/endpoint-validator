(function() {
	'use strict';

	const USERNAME = 'EVBot';
	const REQUEST_URL = '';

	var _ = require('lodash'),
		request = require('request'),
		config = require('./../config');

	module.exports = function(healthObject) {
		var alert, color, messageObject;

		if (/^[12]..$/.test(healthObject.HTTPStatusCode) && healthObject.isConsistent) {
			// 1xx Informational
			// 2xx Success
			alert = false;
			color = 'good';
		} else if (/^.$/.test(healthObject.HTTPStatusCode) && healthObject.isConsistent) {
			// 3xx Redirection
			alert = true;
			color = 'warning';
		} else {
			alert = true;
			color = 'danger';
		}

		messageObject = JSON.stringify({
			username: USERNAME,
			attachments: [{
				color: color,
				text: healthObject.log,
				mrkdwn_in: ['text']
			}]
		});

		if (!_.isUndefined(messageObject) && (
				config.FORCE_ALERT_ON_SUCCESS	// globally forced alerting on success
				|| alert						// alert when needed
			)
		) {
			request({
				method: 'POST',
				url: REQUEST_URL,
				body: messageObject
			});
		}
	};

})();
