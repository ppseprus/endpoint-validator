(function() {
	'use strict';

	var validator = require('./validator'),
		endpoints = require('./endpoints'),

		// require slack service
		slack = require('./services/slack');


	validator(endpoints, [slack]);

})();