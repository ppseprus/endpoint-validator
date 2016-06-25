(function() {
	'use strict';

	module.exports = [
		{
			alias: 'Alias',
			url: 'http://domain.com',
			interval: '5s',
			validations: [
				{
					// UNABLE TO CONNECT
					statusCode: 0,
					schema: {}
				}, {
					// SUCCESS
					statusCode: 200,
					schema: {
						expectedProperty: 'expectedType'
					}
				}
			]
		}
	];

})();