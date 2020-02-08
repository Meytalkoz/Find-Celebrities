var https = require('http'),
    fs = require('fs'),
    celebrityModel = require('./celebritiesModel');

fs.readFile('../index.html', function (err, html) {
    if (err) {
        throw err;
    }

    https.createServer(function (request, response) {
        responseToClient(request, response, html);
    }).listen(3000);
});

async function responseToClient(request, response, html) {
    response.writeHead(200, { "Content-Type": "text/html" });
    let instagramLink;
    if (request && request.url && request.url.includes("celebrityName")) {
        instagramLink = await celebrityModel.parseUrl(request.url);
    }
    if (instagramLink) {
        
    }
    response.write(html);
    response.end();
    console.log("finished html serving")
}
