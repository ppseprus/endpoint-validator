(function() {
	'use strict';

	var _ = require('lodash'),
		request = require('request'),
		settings = require('./settings');

	module.exports = {
		request: {
			method: 'POST',
			uri: 'https://hooks.slack.com/services/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'
		},
		forceAlertOnSuccess: false,
		transform: function(healthObject) {
			var alert, color, message;

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

			message = {
				alert: alert,
				messageObject: {
					username: 'endpointValidarorBot',
					attachments: [{
						color: color,
						text: _.findLast(_.sortBy(healthObject.log, 'timestamp')).log,
						mrkdwn_in: ['text']
					}]
				}
			};

			return message;
		}
	};

})();