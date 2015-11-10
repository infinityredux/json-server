// server.js
// =========================

var http = require('http');
var url = require('url');
var fs = require('fs');

console.log('Starting server...');

var running = true;
var config = {
    port: 8000,
    host: 'projects.infinityredux.net',
    shutdownPassword: '',
    fileLoad: [
        './showRequest.js',
        './eve.js',
    ],
};
var routes = {};

console.log('Initialising additional files');

config.fileLoad.forEach(function (val, i, arr) {
    var load = require(val);
    if (load) {
        if (load.path) {
            routes[load.path] = load;
        }
        if (load.paths) {
            Object.keys(load.paths).forEach(function (key) {
                routes[key] = load.paths[key];
            });
        }
        if (load.init) {
            load.init();
        }
    }
});

// NOTE TO SELF:
// Using console.log for all outputs currently instead of console.error
// This is so that they are actually included in the output file on the server... 
// ... probably me not being familiar enough with the Linux output redirect

var server = http.createServer(function (req, res) {
    var data = url.parse(req.url, true);

    if (!routes.hasOwnProperty(data.pathname)) {
        res.writeHead(404, { 'content-type': 'text/html' });
        console.log('404: ' + data.pathname); // ERROR
        return res.end(default404(data));
    }

    if (routes[data.pathname].requirePost) {
        if (req.method != 'POST') {
            res.writeHead(405, { 'content-type': 'text/html' });
            console.log('405: ' + data.pathname); // ERROR
            return res.end(default405(data));
        }
    }

    var result = routes[data.pathname].callback(data, req, res);
    res.writeHead(200, { 'content-type': 'applicaation/json' });
    res.end(JSON.stringify(result));
    console.log('200: ' + data.pathname)
});

function default404(data) {
    var out = '<!DOCTYPE html><html><head><title>404 - Path not found</title><body><h1>404 - Path not found</h1><p>Valid paths for this server are:</p><ul>';
    Object.keys(routes).sort().forEach(function (key, i, arr) {
        if (!routes[key].hidden)
            out += '<li><a href="' + key + '">' + key + '</a> ' + (routes[key].desc ? '<br />' + routes[key].desc : '') + '</li>';
    })
    out += '</ul></body></html>';
    return out;
}

function default405(data) {
    var out = '<html><head><title>405 - Request must be submitted as POST</title><body><h1>405 - Request must be submitted as POST</h1>'
        + '<p>Standard page requests are obtained via GET, this path only accepts submission of a POST form.</p></body></html>';
    return out;
}

routes['/admin/status.json'] = {
    requirePost: false,
    hidden: false,
    callback: function (data) {
        return {
            running: running,
        };
    }
};
routes['/admin/shutdown.json'] = {
    requirePost: true,
    hidden: true,
    callback: function (data) {
        server.close(function () {
            console.log('Shut down complete');
        });
        console.log('Server shutting down...');
        running = false;
        return {
            shutdown: true,
        };
    }
};

// TODO:
// Work out why this is not actually working as expected
// i.e. it seems to ignore the host address specified
//
// I suspect that this is somehow related to the fact that the path 
// showing the request details happens to consistently return null 
// for protocol, slashes, auth, host, etc.
// 
server.listen(config.port, config.host, 511, function () {
    console.log('Listening for requests');
});
