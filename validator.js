(function() {
	'use strict';

	var _ = require('lodash'),
		request = require('request'),
		settings = require('./settings'),
		util = require('./util');

	module.exports = function(endpoints, services) {

		function validate(endpoint) {
			var I = setInterval(function() {
			    request(endpoint.url, function(error, header, response) {

			    	// NOTE TO SELF:
			    	// _.findLast(_.sortBy(healthObject.log, 'timestamp'))
			    	if (!endpoint.hasOwnProperty('health')) {
			    		endpoint.health = [];
			    	}

			    	var currentHealth = {
			    		alias: endpoint.alias,
			    		timestamp: Date.now(),
			    		HTTPStatusCode: 0,
			    		expectation: {},
			    		isConsistent: false,
			    		errorCount: 0,
			    		errorWith: [],
			    		log: `Validation of *${endpoint.alias}* `
			    	};


			    	if (!_.isUndefined(header) && !_.isUndefined(header.statusCode)) {
			    		currentHealth.HTTPStatusCode = header.statusCode;

				        currentHealth.expectation = _.find(endpoint.expectations, e => {
				        	return e.statusCode === header.statusCode;
				        });

				        if (currentHealth.expectation.hasOwnProperty('schema') && !_.isEmpty(currentHealth.expectation.schema)) {
				        	currentHealth.log += `with *HTTP Status Code ${header.statusCode}* is `;

				        	try {
				        		var responseObject = JSON.parse(response);


				        		// NOTE TO SELF:
				        		// should be replaced with a 3rd party lib in the future
				        		// current solution is only one level deep
					        	_.forEach(currentHealth.expectation.schema, (type, key) => {
					        		if (!responseObject.hasOwnProperty(key) || typeof responseObject[key] !== type) {
										currentHealth.errorCount += 1;
										currentHealth.errorWith.push(key);
					        		}
					        	});


					        	currentHealth.log += `finished with `;
					        	if (0 < currentHealth.errorCount) {
					        		currentHealth.log += `*${currentHealth.errorCount} error(s)*.\n`;
					        		currentHealth.log += `The following attribute(s) are incorrect:\n`;
					        		currentHealth.log += `_${currentHealth.errorWith.toString()}_`;
					        	} else {
					        		currentHealth.isConsistent = true;
					        		currentHealth.log += `*SUCCESS*.`;
					        	}

				        	} catch(err) {
				        		// ERROR
				        		currentHealth.log += `*NOT POSSIBLE*, due to unparsable response object.`;
				        	}
				        	
				        } else {
				        	// ERROR
				        	currentHealth.log += `*NOT POSSIBLE*, due to missing response schema.`;
				        }

			        } else {
			        	// ERROR
			        	currentHealth.log += `*NOT POSSIBLE*, due to missing HTTP Status Code.`;
			        }


			        // archive health checks
			        endpoint.health.push(currentHealth);


			        if (settings.SERVER_LOGGING) {
			        	console.log(currentHealth.log.replace(settings.MARKDOWN_CHARACTERS, ''));
			        }

			        _.forEach(services, service => {
			        	service(currentHealth);
			        });

			    });
			}, util.miliseconds(endpoint.interval));
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