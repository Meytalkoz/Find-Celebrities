var https = require('http'),
    fs = require('fs'),
    celebrityModel = require('./bingSearchHandler'),
    storageModel = require('./azureDBHandler');


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
    response.write(html);
    if (instagramLink) {
        response.write(`<a href='${instagramLink}' target='_blank' ><img src='https://instagram-brand.com/wp-content/uploads/2016/11/Instagram_AppIcon_Aug2017.png?w=35' title="Celebrity's Instagram"></img></a>`);
    }

    //request celebs
    storageModel.getAllSearches(function (error, result, dbResponse) {
        if (!error) {            
            // query was successful
            response.write("<p><ul  class='list-group'>");
            for (const entity of result.entries.reverse()) {
                response.write(`<li class='list-group-item'>`);
                console.log(entity.celebrityName._)
                response.write(entity.celebrityName._);
                response.write("</li>");
            }
            response.write("</ul></p>");          
        }

        response.write("</div></body></html>");
        response.end();
        console.log("finished html serving")
    });
}