const fs = require('fs');
const moment = require('moment');
const request = require('request');
const _ = require('lodash');

function isCachedRequest(entry) {
    var response = entry.response;
    var resBodySize = Math.max(0, response.bodySize || 0, response._transferSize || 0);
    return (response.status == 304 || (resBodySize === 0 && response.content && response.content.size > 0));
};

function load(file, options) {
    options = options || {};
    options.timeout = _.isNumber(options.timeout) ? options.timeout : 60000;
    options.replayCachedEntries = _.isBoolean(options.replayCachedEntries) ? options.replayCachedEntries : false;

    const requestModule = options.request || request;

    fs.readFile(file, function(err, contents) {
        if (err) 
            throw err;

        const har = JSON.parse(contents);

        if (_.isUndefined(har) || 
            _.isUndefined(har.requests) ||
            har.requests.length === 0)
            return;

        const onFinish = _.after(har.requests.length, function() {
            if (options.onFinish)
                options.onFinish();
        });

        const firstTime = moment(har.requests[0].startedDateTime);
        _.forEach(har.requests, function(request) {
            if (options.replayCachedEntries || !isCachedRequest(request)) {
                const delay = moment(request.startedDateTime).diff(firstTime, 'miliseconds');

                if (request.postData && _.isUndefined(request.postData.params))
                    request.postData.params = [];
                _.delay(function() {
                    const headers = [];
                    _.forEach(request.headers, function(header) {
                        if (header.name.indexOf(':') !== 0)
                            headers.push(header);
                    });
                    request.headers = headers;
                    if (options.beforeRequest) {
                        const cont = options.beforeRequest(request);
                        if (_.isBoolean(cont) && !cont) {
                            onFinish();
                            return;
                        }
                    }
                    requestModule({ har: request, timeout: options.timeout }, function(error, response, body) {
                        if (error !== null) {
                            if (options.onError)
                                options.onError(error, request);
                        } else if(response && options.onResponse) {
                            options.onResponse(response, request, body);
                        }
                        onFinish();
                    });
                }, delay);
            } else {
                onFinish();
            }
        });
    });
}

module.exports.load = load;
