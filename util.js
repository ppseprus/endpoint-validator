(function() {
	'use strict';

	var settings = require('./settings');

	module.exports = {
		miliseconds: function(inputPattern) {
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
	};

})();