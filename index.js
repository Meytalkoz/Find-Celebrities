/*
 * Index logic, contain all the app lifecycle. Defines port: 443 and protocol: https
 */

var https = require('https'),
    fs = require('fs'),
    celebrityHandler = require('./bingSearchHandler'),
    storageHandler = require('./azureDBHandler'),
    UiHandler = require('./UiHandler');


fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err;
    }

    https.createServer(function (request, response) {
        console.log(request);
        responseToClient(request, response, html);
    }).listen(80);

});

async function responseToClient(request, response, html) {
    response.writeHead(200, { "Content-Type": "text/html" });
    let instagramLink;

    if (request && request.url && request.url.includes("celebrityName")) {
        instagramLink = await celebrityHandler.getInstagramUrl(request.url);
    }

    response.write(html);
    if (instagramLink) {
        UiHandler.addInstagramLink(response, instagramLink);
    }

    //request celebs
    storageHandler.getAllSearches(function (error, result, dbResponse) {
        if (!error) {
            // query was successful
            UiHandler.addListOfItems(response, result.entries.reverse());        
        }

        UiHandler.closeHtmlResponse(response);
        console.log("finished html serving")
    });
}