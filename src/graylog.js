var graylog = require('graylog-api');
var api = graylog.connect({
    basicAuth: {
        username: 'admin',
        password: 'secret'
    }, // Optional. Default: null. Basic access authentication
    protocol: 'https', // Optional. Default: 'http'. Connection protocol
    host: 'example.com', // Optional. Default: 'localhost'. API hostname
    port: '12900', // Optional. Default: '12900'. API port
    path: '/api' // Optional. Default: ''. API Path
});

ap.getMetricsHistory({
    path: '/system/metrics/{metricName}/history',
        summary: 'Get history of a single metric',
        notes: 'The maximum retention time is currently only 5 minutes.',
        method: 'GET',
        parameters: [
        {
            name: 'metricName',
            description: '',
            required: true,
            paramType: 'path',
            type: 'String'
        },
        {
            name: 'after',
            description: 'Only values for after this UTC timestamp (1970 epoch)',
            required: false,
            paramType: 'query',
            type: 'Long'
        }
    ]
});