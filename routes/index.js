var express = require('express');
var router = express.Router();
var fs = require("fs");
var content = fs.readFileSync("tw.json");
var ipList = JSON.parse(content);
var dns = require('dns');


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Request Url with specific IP' });
});

router.get('/iplist', function(req, res, next) {
    res.json(ipList);
});

router.get('/query/:hostname/:serverip', function(req, res, next) {
    dns.setServers([req.params.serverip]);
    var options = {
        family: 4,
        hints: dns.ADDRCONFIG | dns.V4MAPPED,
        all: true
    };
    dns.lookup(req.params.hostname, options, function(err, addresses) {
        res.json(addresses);
    });

});

module.exports = router;