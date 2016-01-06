/**
 * Created by Nick on 06/01/2016.
 */

var config;

function constructMsg(msg, res) {
    var out = '';
    if (config.name) out += '['+ config.name + '] ';
    if (res) out += res + ': ';
    out += msg;

    return out;
}

exports.out = function(msg) {
    console.log(constructMsg(msg));
};

exports.result = function(msg, res) {
    console.log(constructMsg(msg, res))
};

// NOTE TO SELF:
// Using console.log for all outputs currently instead of console.error
// This is so that they are actually included in the output file on the server...
// ... probably me not being familiar enough with the Linux output redirect
exports.error = function(msg, res) {
    console.log(constructMsg(msg, res));
};

exports.init = function(options) {
    config = options;
    if (config.quiet) {
        exports.out = function() {};
        exports.error = function() {};
        exports.result = function() {};
    }
};
