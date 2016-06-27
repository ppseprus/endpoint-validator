(function() {
	'use strict';

	var yup = require('yup');

	module.exports = [
		{
			alias: 'Example',
			url: 'http://domain.com',
			headers: {},
			interval: '10s',
			expectations: [
				{
					// UNABLE TO CONNECT
					statusCode: 0
				}, {
					// SUCCESS
					statusCode: 200,
					schema: yup.object().shape({
						string: yup.string(),
						number: yup.number(),
						boolean: yup.boolean(),
						date: yup.date(),
						object: yup.object().shape({
							subString: yup.string(),
							subArray: yup.array().of(mixed())
						})
					})
				}
			]
		}
	];

})();