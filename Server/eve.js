// eve.js
// =========================

var https = require('https');

var crest = false;
var crestPaths = {};

exports.paths = {};

exports.paths['/eve/pathsCREST'] = {
    desc : 'Parsed output of the EVE CREST api (https://public-crest.eveonline.com/) showing the available endpoints and their associated paths, retrieved and processed as part of the server startup.',
    hidden : false,
    requirePost : false,
    callback : function (data) {
        var results = {};
        for (var key in crestPaths) {
            if (crestPaths[key].href) {
                results[key] = crestPaths[key].href;
            }
        }
        return results;
    }
};

exports.paths['/eve/nonPaths'] = {
    desc: 'Parsed output of the EVE CREST api (https://public-crest.eveonline.com/) showing the available endpoints and their associated paths, retrieved and processed as part of the server startup.',
    hidden: false,
    requirePost: false,
    callback: function (data) {
        var results = {};
        for (var key in crestPaths) {
            if (!crestPaths[key].href) {
                results[key] = crestPaths[key];
            }
        }
        return results;
    }
};

function evePathsCREST() {
    https.get("https://public-crest.eveonline.com/", function (res) {
        console.log("EVE response: " + res.statusCode);
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            console.log("EVE data complete");
            crestPaths = JSON.parse(data);
            crest = true;
        })
    }).on('error', function (e) {
        console.log("EVE error: " + e.message);
    });
}

exports.init = evePathsCREST;
