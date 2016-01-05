// server.js
// =========================

var http = require('http');
var url = require('url');

var running = true;
var routes = {};
var config;

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

    if (!config.quiet) console.log('200: ' + data.pathname)
});

function default404() {
    var out = '<html><head><title>404 - Path not found</title><body><h1>404 - Path not found</h1><p>Valid paths for this' +
        ' server are:</p><ul>';
    Object.keys(routes).sort().forEach(function (key) {
        if (!routes[key].hidden)
            out += '<li><a href="' + key + '">' + key + '</a> ' + (routes[key].desc ? '<br />' + routes[key].desc : '') + '</li>';
    });
    out += '</ul></body></html>';
    return out;
}

function default405() {
    return '<html><head><title>405 - Request must be submitted as POST</title><body><h1>405 - Request must be submitted ' +
        'as POST</h1> <p>Standard page requests are obtained via GET, this path only accepts submission of a POST form.' +
        '</p></body></html>';
}

routes['/admin/status.json'] = {
    requirePost: false,
    hidden: false,
    callback: function () {
        return {
            running: running
        };
    }
};

routes['/admin/shutdown.json'] = {
    requirePost: true,
    hidden: true,
    callback: function () {
        server.close(function () {
            console.log('Shut down complete');
        });
        console.log('Server shutting down...');
        running = false;
        return {
            shutdown: true
        };
    }
};

exports.init = function(options) {
    config = options;
    if (!config.quiet) console.log('JSON server init begins...');
    if (!config.quiet) console.log('Initialising additional files');

    config.fileLoad.forEach(function (val) {
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
    if (!config.quiet)
    if (!config.quiet) console.log('JSON server init complete.');
}

// TODO:
// Work out why this is not actually working as expected
// i.e. it seems to ignore the host address specified
//
// I suspect that this is somehow related to the fact that the path
// showing the request details happens to consistently return null
// for protocol, slashes, auth, host, etc.
//
exports.listen = function() {
    server.listen(config.port, config.host, 511, function () {
        if (!config.quiet) console.log('Listening for requests');
    });
}