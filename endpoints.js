(function() {
	'use strict';

	module.exports = [
		{
			alias: 'Example',
			url: 'http://domain.com',
			interval: '10s',
			expectations: [
				{
					// UNABLE TO CONNECT
					statusCode: 0
				}, {
					// SUCCESS
					statusCode: 200,
					schema: {
						'key': 'type'
					}
				}
			]
		}
	];

})();