/**
 * Created by Nick on 05/01/2016.
 */

var json = require('./jsonServer.js');

var config = {
    name: 'Infinity',
    port: 8000,
    host: 'projects.infinityredux.net',
    shutdownPassword: 'password',
    fileLoad: [
        './routes/showRequest.js',
        './routes/eve.js'
    ]
};

json.init(config);
json.listen();