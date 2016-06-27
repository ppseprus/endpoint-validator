(function() {
	'use strict';

	module.exports = Object.freeze({
		YUP_OPTIONS: {
			strict: true,
			abortEarly: false,
			stripUnknown: false,
			recursive: true
		},
		DEFAULT_REPEAT_INTERVAL: 1000 * 60 * 10, // 10 minute default
		ENDPOINT_INTERVAL_PATTERN: /^(\d+)([smhd])?$/,
		MARKDOWN_CHARACTERS: /[_~*`]/gm,
		SERVER_LOGGING: true,
		FORCE_ALERT_ON_SUCCESS: false
	});

})();