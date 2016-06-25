(function() {
	'use strict';

	var validator = require('./validator'),
		endpoints = require('./endpoints'),

		// require slack service
		slack = require('./slack');


	validator(endpoints, slack);

})();