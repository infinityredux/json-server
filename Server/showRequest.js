// showRequest.js
// =========================

exports.path = '/test/showRequest';
exports.desc = 'Shows the details of the request received by the server, as available to the node.js server and code.';
exports.hidden = false;
exports.requirePost = false;

exports.callback = function (data) {
    return data;
};
