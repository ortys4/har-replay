const HarGenerator = require('har-generator');
const options = {
    url: 'http://rawdata.docker/offer/import',
    harFolder: 'files',
    prettify: false,
    jobInterval: 1
}
const harGen = new HarGenerator(options);
harGen.start();