/**
 * Created by Nick on 05/01/2016.
 */

var json = require('./jsonServer.js');

var config = {
    port: 8000,
    host: 'localhost',
    shutdownPassword: '',
    fileLoad: [
        './routes/showRequest.js',
        './routes/eve.js'
    ]
};

json.init(config);
json.listen();