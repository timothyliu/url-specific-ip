var Http = require('http');
var express = require('express');
var router = express.Router();
var url = require('url');

router.get('/:url/:ip', function(req, res, next) {
    var ipt = req.params;
    var options = {};
    var urlobj = url.parse(unescape(ipt.url));
    options.hostname = urlobj.hostname;
    options.path = urlobj.path + (urlobj.search || '');
    options.ip = ipt.ip;
    options.port = urlobj.port;
    options.headers = req.headers;

    imgproxy(options, function(result) {
        result.headers['real-server-ip'] = ipt.ip;
        res.writeHead(result.headers.statusCode, result.headers);
        res.end(result.data);
    }.bind(res));
});

module.exports = router;

var imgproxy = function(options, callback) {
    var client, net, raw_request;

    net = require('net');

    raw_request = 'GET ' + options.path + ' HTTP/1.1';
    raw_request += '\r\nhost: ' + options.hostname;
    for (var item in options.headers) {
        if (item === 'host' || item === 'connection') continue;
        raw_request += '\r\n' + item + ': ' + options.headers[item];
    }
    raw_request += '\r\n\r\n';

    client = new net.Socket();

    client.connect(options.port || 80, options.ip, function() {
        console.log("Sending request");
        return client.write(raw_request);
    });

    var data = [];
    var content_length = 0;
    var bufferIndex = 0;
    client.on("data", function(chunk) {
        bufferIndex += chunk.length;
        data.push(chunk);
        if (content_length === 0 && chunk.toString().indexOf('\r\n\r\n') > -1) {
            var result = parseHTTP(data, true);
            content_length += +result.headers['Content-Length'];
        }
        if (content_length > 0 && bufferIndex >= content_length) {
            client.end();
        }
    });

    client.on("end", function() {
        var result = parseHTTP(data);
        result.headers.statusCode = 200;
        callback(result);
    });

    client.on("error", function(err) {
        console.error("Error during TCP connect");
        console.error(err.message);
    });
};
var parseHTTP = function(data, passBody) {
    var binary = Buffer.concat(data);
    var headerstr = binary.toString().split('\r\n\r\n')[0];
    var headerstrs = headerstr.split('\r\n');
    var headers = {};
    for (var i = 0; i < headerstrs.length; i++) {
        var h = headerstrs[i];
        if (h.length === 0 || h.indexOf(':') <= 0) continue;
        header = h.split(':');
        headers[header[0]] = header[1];
    }
    var result;
    if (passBody) {
        result = { headers: headers };
    } else {
        var body = binary.slice(headerstr.length + 4, binary.length);
        result = {
            data: body,
            headers: headers
        };
    }
    return result;

};