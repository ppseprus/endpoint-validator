(function() {
	'use strict';

	var _ = require('lodash'),
		request = require('request'),
		jxon = require('jxon'),
		yup = require('yup'),
		config = require('./config'),
		util = require('./util');

	module.exports = function(endpoints, services) {

		function crawl(endpoint) {
			function sendRequest() {
				request(endpoint.requestOptions, (error, header, response) => {
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

								var parsedResponse;
								try {
									parsedResponse = JSON.parse(response);
								} catch(jsonParseError) {
									try {
										parsedResponse = jxon.stringToJs(response);
									} catch (xmlParseError) {
										// case handled elsewhere
									}
								}

								if (_.isPlainObject(parsedResponse)) {

									// This method is asynchronous and returns a Promise object,
									// that is fulfilled with the value, or rejected with a ValidationError
									// https://github.com/jquense/yup
									currentHealth.expectation.schema.validate(parsedResponse, config.YUP_OPTIONS, (error, value) => {
										currentHealth.log += `finished with `;

										if (_.isNull(error)) {
											currentHealth.isConsistent = true;
											currentHealth.log += `*SUCCESS*.`;
										} else {
											currentHealth.errors = error.errors;
											currentHealth.log += `*${currentHealth.errors.length} error(s)*.\nThe following attribute(s) are incorrect:`;
											_.forEach(currentHealth.errors, e => {
												currentHealth.log += `\n_${e}_`;
											});
										}

										closure();
									});

								} else {
									currentHealth.log += `*NOT POSSIBLE*, due to unparsable response data.`;
									closure();
								}

							} else {
								currentHealth.log += `*NOT POSSIBLE*, due to missing or invalid response schema.`;
								closure();
							}

						} else {
							currentHealth.log += `*NOT POSSIBLE*, due to missing HTTP Status Code.`;
							closure();
						}

						function closure() {
							// archive health checks
							endpoint.health.push(currentHealth);
							// log to server console
							if (config.SERVER_LOGGING) {
								console.log(currentHealth.log.replace(config.MARKDOWN_CHARACTERS, ''));
							}
							// relay health information to services
							_.forEach(services, service => {
								service(currentHealth, endpoint);
							});
						}

					} else {
						console.error(error);
					}

				});
			};

			sendRequest();

			setInterval(sendRequest, util.miliseconds(endpoint.interval));
		}

		_.forEach(endpoints, endpoint => {
			config.ENDPOINT_SCHEMA.validate(endpoint, (error, value) => {
				if (_.isNull(error)) {
					crawl(endpoint);
				} else {
					console.error(`Input schema for ${endpoint.alias} is invalid`);
					_.forEach(error.errors, e => {
						console.error(`${e}`);
					});
				}
			});
		});

	};

})();