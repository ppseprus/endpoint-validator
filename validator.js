(function() {
	'use strict';

	var _ = require('lodash'),
		request = require('request'),
		jxon = require('jxon'),
		yup = require('yup'),
		settings = require('./settings'),
		util = require('./util');

	module.exports = function(endpoints, services) {

		function validate(endpoint) {
			var I = setInterval(function() {

				var options = {
					url: endpoint.url,
					headers: endpoint.headers
				};

				request(options, (error, header, response) => {
					if (!error) {

						// NOTE TO SELF:
						// _.findLast(_.sortBy(healthObject.log, 'timestamp'))
						if (!endpoint.hasOwnProperty('health')) {
							endpoint.health = [];
						}

						var currentHealth = {
							alias: endpoint.alias,
							timestamp: Date.now(),
							HTTPStatusCode: 0,
							contentType: null,
							expectation: {},
							isConsistent: false,
							errors: [],
							log: `Validation of *${endpoint.alias}* `
						};

						if (!_.isUndefined(header) && !_.isUndefined(header.statusCode)) {
							currentHealth.HTTPStatusCode = header.statusCode;

							// find schema related to the returned http status code
							// if there is no such schema given,
							// fallback to http status code 200
							currentHealth.expectation = _.find(endpoint.expectations, e => {
								return e.statusCode === header.statusCode;
							});
							if (_.isEmpty(currentHealth.expectation)) {
								currentHealth.expectation = _.find(endpoint.expectations, e => {
									return e.statusCode === 200;
								});
							}

							if (
								!_.isEmpty(currentHealth.expectation)
								&& currentHealth.expectation.hasOwnProperty('schema')
								&& !_.isEmpty(currentHealth.expectation.schema)
							) {
								currentHealth.log += `with *HTTP Status Code ${header.statusCode}* is `;

								var parsedResponse = '';
								try {

									if (header.contentType === 'application/xml' || response.substring(0, 5) === '<?xml') {
										parsedResponse = jxon.stringToJs(response);
									} else {
										parsedResponse = JSON.parse(response);
									}

									// This method is asynchronous and returns a Promise object,
									// that is fulfilled with the value, or rejected with a ValidationError
									// https://github.com/jquense/yup
									currentHealth.expectation.schema.validate(parsedResponse, settings.YUP_OPTIONS, (error, value) => {
										if (!_.isNull(error)) {
											currentHealth.errors = error.errors;
										}

										currentHealth.log += `finished with `;
										if (0 < currentHealth.errors.length) {
											currentHealth.log += `*${currentHealth.errors.length} error(s)*.\nThe following attribute(s) are incorrect:`;
											_.forEach(currentHealth.errors, e => {
												currentHealth.log += `\n_${e}_`;
											});
										} else {
											currentHealth.isConsistent = true;
											currentHealth.log += `*SUCCESS*.`;
										}

										callback();
									});

								} catch(error) {
									currentHealth.log += `*NOT POSSIBLE*, due to unparsable response data.`;
									callback();
								}

							} else {
								currentHealth.log += `*NOT POSSIBLE*, due to missing or invalid response schema.`;
								callback();
							}

						} else {
							currentHealth.log += `*NOT POSSIBLE*, due to missing HTTP Status Code.`;
							callback();
						}

						function callback() {
							// archive health checks
							endpoint.health.push(currentHealth);
							// log to server console
							if (settings.SERVER_LOGGING) {
								console.log(currentHealth.log.replace(settings.MARKDOWN_CHARACTERS, ''));
							}
							// relay health information to services
							_.forEach(services, service => {
								service(currentHealth);
							});
						}

					} else {
						console.error(error);
					}

				});

			}, util.miliseconds(endpoint.interval));
		}


		// NOTE TO SELF:
		// user should be notified of inccorrect endpoints
		_.filter(endpoints, e => {
			return /^.+$/.test(e.alias)
				&& !_.isUndefined(e.url)
				&& settings.ENDPOINT_INTERVAL_PATTERN.test(e.interval);
		}).forEach(validate);

	};

})();