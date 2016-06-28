(function() {
	'use strict';

	var yup = require('yup');

	var config = Object({

		SERVER_LOGGING: true,
		FORCE_ALERT_ON_SUCCESS: false,
		DEFAULT_REPEAT_INTERVAL: 1000 * 60 * 10, // 10 minute default

		ENDPOINT_INTERVAL_PATTERN: /^(\d+)([smhd])?$/,
		MARKDOWN_CHARACTERS: /[_~*`]/gm,

		YUP_OPTIONS: {
			strict: true,
			abortEarly: false,
			stripUnknown: false,
			recursive: true
		},

		ENDPOINT_SCHEMA: null

	});

	config.ENDPOINT_SCHEMA = yup.object().noUnknown(true)
		.shape({

			alias: yup.string()
				.required(),

			interval: yup.string()
				.matches(config.ENDPOINT_INTERVAL_PATTERN).required(),

			requestOptions: yup.object()
				.shape({
					url: yup.string()
						.url().required()
				}).required(),

			expectations: yup.array()
				.of(yup.object().noUnknown(true)
					.shape({
						statusCode: yup.number()
							.positive().integer(),
						schema: yup.mixed()
					})).required()

		});

	module.exports = Object.freeze(config);

})();