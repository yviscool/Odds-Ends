var fs = require('fs');
var path = require('path');
var clipboardy = require('clipboardy');
var { spawn } = require('child_process');

var BROOK_URL = clipboardy.readSync();
var BROOK_URL_DEFAULT = 'brook://default%20159.89.82.37%3A7000%20DOUBIToyo';

var PATTERN = /^brook.*?20(.*?)%3A(.*?)%20(.*)/i;
(BROOK_URL && PATTERN.test(BROOK_URL)) ? BROOK_URL.match(PATTERN) : BROOK_URL_DEFAULT.match(PATTERN);

var clientIp = ['127.0.0.1', '1080'];
var serverIp = [RegExp.$1, RegExp.$2];
var serverPass = RegExp.$3;


/**
 * Run as brook client, start a socks5 proxy socks5://127.0.0.1:1080
 * brook client -l 127.0.0.1:1080 -i 127.0.0.1 -s server_address:port -p password
 * Run as brook client, start a http(s) proxy http(s)://127.0.0.1:8080
 * brook client -l 127.0.0.1:8080 -i 127.0.0.1 -s server_address:port -p password --http
 */

PATTERN = /^brook.*?/i;

for (var file of fs.readdirSync('./')) {
    if (PATTERN.test(file) && !path.extname(file)) {
        console.log('启动成功！！', file);
        var p = spawn(`./${file}`, [`client`, '-l',clientIp.join(':') ,'-i', clientIp[0], '-s', serverIp.join(':'), '-p', serverPass], { detached: true});
        console.log(process.pid, p.pid);
        process.exit(0);
    }
}
