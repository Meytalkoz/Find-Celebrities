/*
 * Resonsible for showing data inside html UI, all data received from index.js
 */ 

function addInstagramLink(response, instagramLink) {
    response.write(`<a href='${instagramLink}' target='_blank' >
                        <img src='https://instagram-brand.com/wp-content/uploads/2016/11/Instagram_AppIcon_Aug2017.png?w=35' title="Celebrity's Instagram"></img></a>`);
}

function addListOfItems(response, items) {
    response.write("<p><ul  class='list-group'>");
    for (const item of items) {
        response.write(`<li class='list-group-item'>`);
        console.log(item.celebrityName._)
        response.write(item.celebrityName._);
        response.write("</li>");
    }
    response.write("</ul></p>");  
}

function closeHtmlResponse(response) {
    response.write("</div></body></html>");
    response.end();
}

module.exports = {
    addInstagramLink,
    addListOfItems,
    closeHtmlResponse
}