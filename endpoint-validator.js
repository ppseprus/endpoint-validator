var _ = require('lodash'),
	request = require('request');


// user variables
const DEFAULT_REPEAT_INTERVAL = 1000 * 60 * 10; // 10 minute default
const SYSTEM_LOGGING = true;
const BOT_NAME = 'endpointValidarorBot';
const MRKDWN_CHRS = /[_~*`]/gm;


(function(SERVICE) {

	// endpoints to watch
	var endpoints = [
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



	function validate(endpoint) {
		var I = setInterval(() => {
		    request(endpoint.url, function (error, header, response) {

		    	var resultObject = {
		    		inspectedElement: endpoint,
		    		header: header,
		    		httpStatusCode: 0,
		    		validateBy: {},
		    		errorCount: 0,
		    		errorWith: [],
		    		log: `Validation of *${endpoint.alias}* `,
		    	};


		    	if (!_.isUndefined(header) && !_.isUndefined(header.statusCode)) {
		    		resultObject.httpStatusCode = header.statusCode;

			        resultObject.validateBy = _.find(endpoint.validations, s => {
			        	return s.statusCode === header.statusCode;
			        });

			        if (!_.isEmpty(resultObject.validateBy.schema)) {
			        	resultObject.log += `with *HTTP Status Code ${header.statusCode}* is `;

			        	try {
			        		var responseObject = JSON.parse(response);

				        	_.forEach(resultObject.validateBy.schema, (type, key) => {
				        		if (!responseObject.hasOwnProperty(key) || typeof responseObject[key] !== type) {
									resultObject.errorCount += 1;
									resultObject.errorWith.push(key);
				        		}
				        	});

				        	resultObject.log += `finished with `;
				        	if (0 < resultObject.errorCount) {
				        		resultObject.log += `*${resultObject.errorCount} error(s)*.\n`;
				        		resultObject.log += `The following attribute(s) are incorrect:\n`;
				        		resultObject.log += `_${resultObject.errorWith.toString()}_`;
				        	} else {
				        		resultObject.isSchemaOK = true;
				        		resultObject.log += `*SUCCESS*.`;
				        	}

			        	} catch(err) {
			        		// ERROR
			        		resultObject.log += `*NOT POSSIBLE*, due to unparsable response object.`;
			        	}
			        	
			        } else {
			        	// ERROR
			        	resultObject.log += `*NOT POSSIBLE*, due to missing response schema.`;
			        }

		        } else {
		        	// ERROR
		        	resultObject.log += `*NOT POSSIBLE*, due to missing HTTP Status Code.`;
		        }


		        if (SYSTEM_LOGGING) {
		        	console.log(resultObject.log.replace(MRKDWN_CHRS, '') + `\n`);
		        }

		        if (SERVICE) {
		        	forwardResult(resultObject);
		        }

		    });
		}, miliseconds(endpoint.interval));
	}


	function forwardResult(validatedObject) {
		var {alert, messageObject} = SERVICE.transform(validatedObject);
		if (!_.isEmpty(messageObject) && (alert || SERVICE.alertOnSuccess)) {
			request({
				method: SERVICE.request.method,
				uri: SERVICE.request.uri,
				body: JSON.stringify(messageObject)
			});
		}
	}


	function miliseconds(time) {
		var ms = DEFAULT_REPEAT_INTERVAL;

		var R = /^(\d+)([smhd])?$/;
		if (R.test(time)) {
			var spec = R.exec(time);
			ms = spec[1];
			switch(spec[2]) {
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
	}


	endpoints.forEach(validate);

})({
	alertOnSuccess: false,
	request: {
		method: 'POST',
		uri: 'https://hooks.slack.com/services/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'
	},
	transform: function(resultObject) {
		var formatting = {};

		var isSchemaOK = _.isEmpty(resultObject.validateBy) || resultObject.errorCount === 0;
		if (/^1..$/.test(resultObject.httpStatusCode) && isSchemaOK) {
			// Informational
			formatting.alert = false;
			formatting.color = 'good';
		} else if (/^2..$/.test(resultObject.httpStatusCode) && isSchemaOK) {
			// Success
			formatting.alert = false;
			formatting.color = 'good';
		} else if (/^3..$/.test(resultObject.httpStatusCode) && isSchemaOK) {
			// Redirection
			formatting.alert = true;
			formatting.color = 'warning';
		} else {
			formatting.alert = true;
			formatting.color = 'danger';
		}

		return {
			alert: formatting.alert,
			messageObject: {
				username: BOT_NAME,
				attachments: [{
					color: formatting.color,
					text: resultObject.log,
					mrkdwn_in: ['text']
				}]
			}
		};
	}
});