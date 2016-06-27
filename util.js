(function() {
	'use strict';

	var settings = require('./settings');

	module.exports = {

		miliseconds: function(inputPattern) {
			var ms = settings.DEFAULT_REPEAT_INTERVAL;

			if (settings.ENDPOINT_INTERVAL_PATTERN.test(inputPattern)) {
				var spec = settings.ENDPOINT_INTERVAL_PATTERN.exec(inputPattern);
				ms = spec[1];
				switch (spec[2]) {
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
		},

		elapsedTime: function(timestamp) {
			var difference = Date.now() - timestamp,
				text = '';

			if (difference <= 1000) {
				text = 'Just a second ago';

			} else if (difference < 5 * 1000) {
				text = 'A few seconds ago';

			} else if (difference < 60 * 1000) {
				text = Math.round(difference / 1000) + ' seconds ago';

			} else if (difference < 60 * 60 * 1000) {
				text = Math.round(difference / 1000 / 60) + ' minutes ago';

			} else {
				// NOTE: the below code is borrowed from
				// http://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript

				// Create a new JavaScript Date object based on the timestamp
				// multiplied by 1000 so that the argument is in milliseconds, not seconds.
				var date = new Date(timestamp * 1000);
				// Hours part from the timestamp
				var hours = date.getHours();
				// Minutes part from the timestamp
				var minutes = "0" + date.getMinutes();
				// Seconds part from the timestamp
				var seconds = "0" + date.getSeconds();

				text = 'At ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

			}

			return text;
		}

	};

})();