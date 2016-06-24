// input
var inspection = [
	{
		alias: 'Alias',
		url: 'http://domain.com',
		interval: 1, // repeat in minutes
		scenarios: [
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


// requirements
var request = require('request');
var _ = require('lodash');


// functionality
function endpointValidator(element) {
	var interval = setInterval( () => {
	    request(element.url, function (error, header, response) {
	    	var message = `Validation of ${element.alias} `;


	    	if (!_.isUndefined(header) && !_.isUndefined(header.statusCode)) {

		        var scenario = _.find(element.scenarios, s => {
		        	return s.statusCode === header.statusCode;
		        });

		        if (!_.isEmpty(scenario.schema)) {
		        	message += `with HTTP Status Code ${header.statusCode} is `;

		        	try {
		        		var responseObject = JSON.parse(response);
		        		var errorCount = 0;
			        	var errorWith = [];

			        	_.forEach(scenario.schema, (type, key) => {
			        		if (!responseObject.hasOwnProperty(key) || typeof responseObject[key] !== type) {
								errorCount += 1;
								errorWith.push(key);
			        		}
			        	});

			        	message += `finished with `;
			        	if (0 < errorCount) {
			        		message += `${errorCount} error(s).\n`;
			        		message += `The following attribute(s) are incorrect:\n`;
			        		message += `${errorWith.toString()}`;
			        	} else {
			        		message += `SUCCESS.`;
			        	}

		        	} catch(err) {
		        		// ERROR
		        		message += `NOT POSSIBLE, due to unparsable response object.`;
		        	}
		        	
		        } else {
		        	// ERROR
		        	message += `NOT POSSIBLE, due to missing response schema.`;
		        }

	        } else {
	        	// ERROR
	        	message += `NOT POSSIBLE, due to missing HTTP Status Code.`;
	        }


	        console.log(message + `\n`);
	    });
	}, element.interval * 60 * 1000);
}


// run
inspection.forEach(endpointValidator);