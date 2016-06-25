(function() {
	'use strict';

	var _ = require('lodash'),
		request = require('request'),
		settings = require('./settings');

	module.exports = function(endpoints, service) {

		function validate(endpoint) {
			var I = setInterval(function() {
			    request(endpoint.url, function(error, header, response) {

			    	endpoint.health = {
			    		HTTPStatusCode: 0,
			    		expectation: {},
			    		isConsistent: false,
			    		errorCount: 0,
			    		errorWith: []
			    	};

			    	if (!endpoint.health.hasOwnProperty('log')) {
			    		endpoint.health.log = [];
			    	}

			    	var log = `Validation of *${endpoint.alias}* `;


			    	if (!_.isUndefined(header) && !_.isUndefined(header.statusCode)) {
			    		endpoint.health.HTTPStatusCode = header.statusCode;

				        endpoint.health.expectation = _.find(endpoint.expectations, e => {
				        	return e.statusCode === header.statusCode;
				        });

				        if (endpoint.health.expectation.hasOwnProperty('schema') && !_.isEmpty(endpoint.health.expectation.schema)) {
				        	log += `with *HTTP Status Code ${header.statusCode}* is `;

				        	try {
				        		var responseObject = JSON.parse(response);



				        		// NOTE TO SELF:
				        		// should be replaced with a 3rd party lib in the future
				        		// current solution is only one level deep
					        	_.forEach(endpoint.health.expectation.schema, (type, key) => {
					        		if (!responseObject.hasOwnProperty(key) || typeof responseObject[key] !== type) {
										endpoint.health.errorCount += 1;
										endpoint.health.errorWith.push(key);
					        		}
					        	});



					        	log += `finished with `;
					        	if (0 < endpoint.health.errorCount) {
					        		log += `*${endpoint.health.errorCount} error(s)*.\n`;
					        		log += `The following attribute(s) are incorrect:\n`;
					        		log += `_${endpoint.health.errorWith.toString()}_`;
					        	} else {
					        		endpoint.health.isConsistent = true;
					        		log += `*SUCCESS*.`;
					        	}

				        	} catch(err) {
				        		// ERROR
				        		log += `*NOT POSSIBLE*, due to unparsable response object.`;
				        	}
				        	
				        } else {
				        	// ERROR
				        	log += `*NOT POSSIBLE*, due to missing response schema.`;
				        }

			        } else {
			        	// ERROR
			        	log += `*NOT POSSIBLE*, due to missing HTTP Status Code.`;
			        }


			        // archive log
			        endpoint.health.log.push({
			        	timestamp: Date.now(),
			        	HTTPStatusCode: endpoint.health.HTTPStatusCode,
			        	isConsistent: endpoint.health.isConsistent,
			        	errorCount: endpoint.health.errorCount,
			        	errorWith: endpoint.health.errorWith,
			        	log: log,
			        });


			        if (settings.SERVER_LOGGING) {
			        	console.log(log.replace(settings.MARKDOWN_CHARACTERS, '') + `\n`);
			        }

			        if (!_.isUndefined(service)) {
			        	broadcast(endpoint.health);
			        }

			    });
			}, miliseconds(endpoint.interval));
		}


		function broadcast(healthObject) {
			var {alert, messageObject} = service.evaluate(healthObject);
			if (!_.isEmpty(messageObject) && (
					settings.FORCE_ALERT_ON_SUCCESS	// globally forced alerting on success
					|| service.forceAlertOnSuccess	// service forced alerting on success
					|| alert						// alert when needed
				)
			) {
				request({
					method: service.request.method,
					uri: service.request.uri,
					body: messageObject
				});
			}
		}


		function miliseconds(inputPattern) {
			var ms = settings.DEFAULT_REPEAT_INTERVAL;

			if (settings.ENDPOINT_INTERVAL_PATTERN.test(inputPattern)) {
				var spec = settings.ENDPOINT_INTERVAL_PATTERN.exec(inputPattern);
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


		// NOTE TO SELF:
		// user should be notified of inccorrect endpoints
		_.filter(endpoints, function(e) {
			return /^.+$/.test(e.alias)
				&& !_.isUndefined(e.url)
				&& settings.ENDPOINT_INTERVAL_PATTERN.test(e.interval);
		}).forEach(validate);

	};

})();