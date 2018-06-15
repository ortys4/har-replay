var fs = require('fs');
var readline = require('readline');
var request = require('request');
var clc = require('cli-color');
var extend = require('util')._extend;
require('console-sync');

const TIMESTAMP = 0;
const METHOD = 1;
const URL = 2;
const DATA = 3;

var currentTimeStamp = null;
var wait = 0;

var rd = readline.createInterface({
    input: fs.createReadStream('./files/output.csv'),
    // output: process.stdout,
    // console: false
});

rd.on('line', function (line) {
    sendRequest(line.split(','));
});

var sendRequest = function (requestData) {
    if (currentTimeStamp != null) {
        wait = new Date(requestData.startedDateTime) - currentTimeStamp;
    }
    currentTimeStamp = new Date(requestData.startedDateTime);

    doSleep(wait);

    var now = new Date().getTime();

    if (requestData[METHOD] == 'POST') {
        request.post(
            requestData[URL],
            extend({time: true}, requestData[DATA]),
            function (error, response, body) {
                hasResponse(now, requestData, response, error);
            }
        );
    } else if (requestData[METHOD] == 'GET') {
        request.get(
            requestData[URL],
            {time: true},
            function (error, response, body) {
                hasResponse(now, requestData, response, error);
            }
        );
    } else {
        console.log('METHOD ' + requestData[METHOD] + ' is not supported');
    }
}

var hasResponse = function (now, requestData, response, error) {
    var log = "";
    log += clc.blue(now);
    log += " [" + requestData[METHOD] + "] : " + requestData[URL] + " => ";
    if (error) {
        log += clc.red("KO in " + error.toString());
    } else {
        log += clc.green("OK with " + response.statusCode + " in " + (response.elapsedTime / 1000) + " seconds");
    }
    console.log(log);
}

var doSleep = function (miliseconds) {
    var waitTill = new Date(new Date().getTime() + miliseconds);
    while (waitTill > new Date()) {
    }
}




