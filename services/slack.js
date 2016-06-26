(function() {
	'use strict';

	var _ = require('lodash'),
		request = require('request'),
		settings = require('./../settings');

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
			username: 'endpointValidatorBot',
			attachments: [{
				color: color,
				text: healthObject.log,
				mrkdwn_in: ['text']
			}]
		});

		if (!_.isUndefined(messageObject) && (
				settings.FORCE_ALERT_ON_SUCCESS	// globally forced alerting on success
				|| alert						// alert when needed
			)
		) {
			request({
				method: 'POST',
				uri: 'https://hooks.slack.com/services/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',
				body: messageObject
			});
		}
	};

})();