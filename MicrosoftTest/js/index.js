var https = require('https'),
    fs = require('fs');

fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err;
    }

    https.createServer(function (request, response) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    }).listen(443);
});
