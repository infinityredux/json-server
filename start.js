/**
 * Created by Nick on 05/01/2016.
 */

var json = require('./jsonServer.js');

var config = {
    port: 8000,
    host: 'projects.infinityredux.net',
    shutdownPassword: '',
    fileLoad: [
        './routes/showRequest.js',
        './routes/eve.js'
    ]
};

json.init(config);
json.listen();