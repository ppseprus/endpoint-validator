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

	    	var result = {
	    		inspectedElement: element,
	    		header: header,
	    		httpStatusCode: 0,
	    		scenario: {},
	    		errorCount: 0,
	    		errorWith: [],
	    		log: `Validation of ${element.alias} `
	    	};


	    	if (!_.isUndefined(header) && !_.isUndefined(header.statusCode)) {
	    		result.httpStatusCode = header.statusCode;

		        result.scenario = _.find(element.scenarios, s => {
		        	return s.statusCode === header.statusCode;
		        });

		        if (!_.isEmpty(result.scenario.schema)) {
		        	result.log += `with HTTP Status Code ${header.statusCode} is `;

		        	try {
		        		var responseObject = JSON.parse(response);

			        	_.forEach(result.scenario.schema, (type, key) => {
			        		if (!responseObject.hasOwnProperty(key) || typeof responseObject[key] !== type) {
								result.errorCount += 1;
								result.errorWith.push(key);
			        		}
			        	});

			        	result.log += `finished with `;
			        	if (0 < result.errorCount) {
			        		result.log += `${result.errorCount} error(s).\n`;
			        		result.log += `The following attribute(s) are incorrect:\n`;
			        		result.log += `${result.errorWith.toString()}`;
			        	} else {
			        		result.log += `SUCCESS.`;
			        	}

		        	} catch(err) {
		        		// ERROR
		        		result.log += `NOT POSSIBLE, due to unparsable response object.`;
		        	}
		        	
		        } else {
		        	// ERROR
		        	result.log += `NOT POSSIBLE, due to missing response schema.`;
		        }

	        } else {
	        	// ERROR
	        	result.log += `NOT POSSIBLE, due to missing HTTP Status Code.`;
	        }


	        console.log(result.log + `\n`);
	    });
	}, element.interval * 60 * 1000);
}


// run
inspection.forEach(endpointValidator);