// input
var inspection = [
	{
		alias: 'Index',
		url: 'http://index.hu',
		interval: 5000
	}, {
		alias: 'Google',
		url: 'http://google.com',
		interval: 2500
	}
];


// requirements
var request = require('request');


// functionality
function run(element, index, array) {
	var interval = setInterval( () => {
	    request(element.url, function (error, response, body) {
	        console.log(`HTTP Status Code for ${element.alias} is ${response.statusCode}`);
	    });
	}, element.interval);
}


// run
inspection.forEach(run);