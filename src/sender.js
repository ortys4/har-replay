var clc = require('cli-color');
var jsonReplay = require('lib/reader.js');

var startRequest;
var during;
var filepath = 'files/graylogs.har';

var args = process.argv.slice(2);
if(args.length == 1) {
    filepath = args[0];
}

jsonReplay.load(filepath, {
    beforeRequest: function(request) {
        request.headers['Some-New-Header'] = 'abc';
        startRequest = new Date().getTime();
    },
    onResponse: function(response, request, body) {
        var now = new Date().getTime();
        during =  now - startRequest;
        console.log("[" + clc.blue(response.statusCode) + "] in " + during + " ms => " + request.url.substr(0, 50) );
    },
    onFinish: function() {
        console.log(clc.green('All done!'));
    },
    onError: function(error, request) {
        console.log("[" + clc.red(error.toString()) + "] => " + request.url.substr(0, 50) );
    }
});
