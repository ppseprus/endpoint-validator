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
		translate: function(healthObject) {
			var alert, color;

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

			return {
				alert: alert,
				messageObject: JSON.stringify({
					username: 'endpointValidatorBot',
					attachments: [{
						color: color,
						text: _.findLast(_.sortBy(healthObject.log, 'timestamp')).log,
						mrkdwn_in: ['text']
					}]
				})
			};
		}
	};

})();