var inspection = {
    url: 'index.hu',
    interval: 5000
};

var request = require('request');
var interval = setInterval( () => {
    request('http://' + inspection.url, function (error, response, body) {
        console.log(`URL Status Code: ${response.statusCode}`);
    });
}, inspection.interval);