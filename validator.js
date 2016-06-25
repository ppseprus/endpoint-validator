(function() {
	'use strict';

	var _ = require('lodash'),
		request = require('request'),
		settings = require('./settings');

	module.exports = function(endpoints, service) {

		function validate(endpoint) {
			var I = setInterval(function() {
			    request(endpoint.url, function (error, header, response) {

			    	endpoint.status = {
			    		inspectedElement: endpoint,
			    		header: header,
			    		httpStatusCode: 0,
			    		validateBy: {},
			    		errorCount: 0,
			    		errorWith: [],
			    		log: `Validation of *${endpoint.alias}* `,
			    	};


			    	if (!_.isUndefined(header) && !_.isUndefined(header.statusCode)) {
			    		endpoint.status.httpStatusCode = header.statusCode;

				        endpoint.status.validateBy = _.find(endpoint.validations, s => {
				        	return s.statusCode === header.statusCode;
				        });

				        if (!_.isEmpty(endpoint.status.validateBy.schema)) {
				        	endpoint.status.log += `with *HTTP Status Code ${header.statusCode}* is `;

				        	try {
				        		var responseObject = JSON.parse(response);

					        	_.forEach(endpoint.status.validateBy.schema, (type, key) => {
					        		if (!responseObject.hasOwnProperty(key) || typeof responseObject[key] !== type) {
										endpoint.status.errorCount += 1;
										endpoint.status.errorWith.push(key);
					        		}
					        	});

					        	endpoint.status.log += `finished with `;
					        	if (0 < endpoint.status.errorCount) {
					        		endpoint.status.log += `*${endpoint.status.errorCount} error(s)*.\n`;
					        		endpoint.status.log += `The following attribute(s) are incorrect:\n`;
					        		endpoint.status.log += `_${endpoint.status.errorWith.toString()}_`;
					        	} else {
					        		endpoint.status.isSchemaOK = true;
					        		endpoint.status.log += `*SUCCESS*.`;
					        	}

				        	} catch(err) {
				        		// ERROR
				        		endpoint.status.log += `*NOT POSSIBLE*, due to unparsable response object.`;
				        	}
				        	
				        } else {
				        	// ERROR
				        	endpoint.status.log += `*NOT POSSIBLE*, due to missing response schema.`;
				        }

			        } else {
			        	// ERROR
			        	endpoint.status.log += `*NOT POSSIBLE*, due to missing HTTP Status Code.`;
			        }


			        if (settings.SYSTEM_LOGGING) {
			        	console.log(endpoint.status.log.replace(settings.MRKDWN_CHRS, '') + `\n`);
			        }

			        if (!_.isUndefined(service)) {
			        	forwardResult(endpoint.status);
			        }

			    });
			}, miliseconds(endpoint.interval));
		}


		function forwardResult(validatedObject) {
			var {alert, messageObject} = service.transform(validatedObject);
			if (!_.isEmpty(messageObject) && (
					settings.ALERT_ON_SUCCESS	// globally forced alerting on success
					|| service.alertOnSuccess	// service forced alerting on success
					|| alert					// alert when needed
				)
			) {
				request({
					method: service.request.method,
					uri: service.request.uri,
					body: JSON.stringify(messageObject)
				});
			}
		}


		function miliseconds(time) {
			var ms = settings.DEFAULT_REPEAT_INTERVAL;

			if (settings.INTERVAL_PATTERN.test(time)) {
				var spec = settings.INTERVAL_PATTERN.exec(time);
				ms = spec[1];
				switch(spec[2]) {
					case 's':
						// second to milisecond
						ms *= 1000;
						break;
					case 'm':
						// minute to milisecond
						ms *= 1000 * 60;
						break;
					case 'h':
						// hour to milisecond
						ms *= 1000 * 60 * 60 ;
						break;
					case 'd':
						// day to milisecond
						ms *= 1000 * 60 * 60 * 24;
						break;
				}
			}

			return ms;
		}


		_.filter(endpoints, function(e) {
			return /^.+$/.test(e.alias)
				&& !_.isUndefined(e.url)
				&& settings.INTERVAL_PATTERN.test(e.interval);
		}).forEach(validate);

	};

})();