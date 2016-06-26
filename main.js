(function() {
	'use strict';

	var _ = require('lodash'),
		validator = require('./validator'),
		endpoints = require('./endpoints'),
		services = [];

	_.forEach(process.argv, (service, index) => {
		if (1 < index) {
			try {
				services.push(require(`./services/${service}`));
			} catch(err) {
				console.log(`No service found with the name ${service}.\n`);
			}
		}
	});

	validator(endpoints, services);

})();