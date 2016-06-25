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
		transform: function(resultObject) {
			var formatting = {};

			var isSchemaOK = _.isEmpty(resultObject.validateBy) || resultObject.errorCount === 0;
			if (/^1..$/.test(resultObject.httpStatusCode) && isSchemaOK) {
				// Informational
				formatting.alert = false;
				formatting.color = 'good';
			} else if (/^2..$/.test(resultObject.httpStatusCode) && isSchemaOK) {
				// Success
				formatting.alert = false;
				formatting.color = 'good';
			} else if (/^3..$/.test(resultObject.httpStatusCode) && isSchemaOK) {
				// Redirection
				formatting.alert = true;
				formatting.color = 'warning';
			} else {
				formatting.alert = true;
				formatting.color = 'danger';
			}

			return {
				alert: formatting.alert,
				messageObject: {
					username: settings.BOT_NAME,
					attachments: [{
						color: formatting.color,
						text: resultObject.log,
						mrkdwn_in: ['text']
					}]
				}
			};
		}
	};

})();