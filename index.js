/*
 * Index logic, contain all the app lifecycle. Using express as server hadler
 */

var fs = require('fs'),
    express = require('express'),
    celebrityHandler = require('./bingSearchHandler'),
    storageHandler = require('./azureDBHandler'),
    UiHandler = require('./UiHandler');


    const app = express()
    const port = process.env.PORT || 80
    app.get('/', (req, res) => {
        fs.readFile('./index.html', function (err, html) {
            if (err) {
                throw err;
            }            
            responseToClient(req, res, html);                   
        });    
    });
    app.listen(port, () => console.log(`Server is listening on port: ${port}`))

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
