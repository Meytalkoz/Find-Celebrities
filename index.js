
var https = require('https');
https.createServer(function(request, response) {  
        response.writeHead(200, {"Content-Type": "text/html"});  
        response.write('<p>hello world</p>');
        response.end();  
    }).listen(443);