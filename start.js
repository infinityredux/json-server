/**
 * Created by Nick on 05/01/2016.
 */

var fs = require('fs');

var json = require('./jsonServer.js');

var config = {
    name: 'Local',
    port: 8000,
    host: 'localhost',
    shutdownPassword: 'randomPassword',
    fileLoad: [
        './routes/showRequest.js',
        './routes/eve.js'
    ]
};

if (process.argv.length > 2) {
    console.log('Loading config file');
    try {
        var contents = fs.readFileSync(process.argv[2]);
        var results = JSON.parse(contents);
        if (results) {config = results;}
    }
    catch (err) {
        console.log('Error loading config file, reverting to defaults.');
    }
}

json.init(config);
json.listen();