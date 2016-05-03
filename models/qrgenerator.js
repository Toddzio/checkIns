var qr = require('qr-image');  
var fs = require('fs');

var code = qr.image('http://blog.nodejitsu.com', { type: 'svg' });  
var output = fs.createWriteStream('nodejitsu.svg')

code.pipe(output);  