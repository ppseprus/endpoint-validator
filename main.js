(function() {
	'use strict';

	var _ = require('lodash'),
		validator = require('./validator'),
		endpoints = require('./endpoints'),
		services = [];

	_.forEach(process.argv, (service, index) => {
		// NOTE TO SELF:
		// index #0 is path to node
		// index #1 is path to main.js
		if (1 < index) {
			try {
				console.log(`Load ${service} integration service`);
				services.push(require(`./services/${service}`));
			} catch(error) {
				console.log(`No service found with the name ${service}`);
			}
		}
	});

	validator(endpoints, services);

})();