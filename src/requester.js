var fs = require('fs');
var clc = require('cli-color');
var request = require('request');
var sortJsonArray = require('sort-json-array');

var filepath = 'files/requests.json';
var currentDateTime = null;
var wait = 0;

var args = process.argv.slice(2);
if(args.length == 1) {
    filepath = args[0];
}

var json = JSON.parse(fs.readFileSync(filepath, 'utf8'));

sortJsonArray(json.requests, 'startedDateTime','asc');

var sendRequest = function (requestData) {
    if (currentDateTime != null) {
        wait = new Date(requestData.startedDateTime) - currentDateTime;
    }
    currentDateTime = new Date(requestData.startedDateTime);

    doSleep(wait);

    var now = new Date().getTime();

    if (requestData.method == 'POST') {
        request.post(
            requestData.url,
            requestData.body,
            function (error, response, body) {
                hasResponse(now, requestData, response, error);
            }
        );
    } else if (requestData.method == 'GET') {
        request.get(
            requestData.url,
            null,
            function (error, response, body) {
                hasResponse(now, requestData, response, error);
            }
        );
    } else {
        console.log('METHOD ' + requestData.method + ' is not supported');
    }
};

var hasResponse = function (now, requestData, response, error) {
    var log = "";
    log += clc.blue(now);
    var now2 = new Date().getTime();
    log += " [" + requestData.method + "] : " + requestData.url + " => ";
    if (error) {
        log += clc.red("KO in " + error.toString());
    } else {
        log += clc.green("OK with " + response.statusCode + " in " + ((now2-now) / 1000) + " seconds");
    }
    console.log(log);
};

var doSleep = function (miliseconds) {
    var waitTill = new Date(new Date().getTime() + miliseconds);
    while (waitTill > new Date()) {
    }
};


json.requests.forEach(function (value) {
    sendRequest(value);
});