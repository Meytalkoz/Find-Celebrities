/* Responsible for the searches using bing API
 * - Parse the url to find the celebrity name
 * - Search for the celebrity's instagram using bing API */

var https = require('https'),
    fetch = require('node-fetch'),
    storageModel = require('./azureDBHandler');


const CELEBRITY_NAME = "celebrityName";
const INSTAGRAM = "instagram";
const SUBSCRIPTION_KEY = "f67c6a721a8643db8cccda135a0bb7bb";


async function getInstagramUrl(url) {
    let urlParts = url.split('&');
    for (urlPart in urlParts) {
        let part = urlParts[urlPart];
        if (part.includes(CELEBRITY_NAME)) {
            let celebrityNameParts = part.split('=');
            let celebrityName = celebrityNameParts[1];
            celebrityName = celebrityName.replace('+', ' ');
            storageModel.addToSearchesContainer(celebrityName);
            console.log(celebrityName);
            return await searchCelebrityInstagram(celebrityName);            
        }
    }
}

async function searchCelebrityInstagram(celebrityName) {

    const url = "https://api.cognitive.microsoft.com/bing/v7.0/search?q=" + encodeURIComponent(celebrityName) + INSTAGRAM;   

    const response = await fetch(url, {
        method: 'get',
        headers: { "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY },
    });

    console.log('\nJSON Response:\n');
    let jsonResponse = await response.json();
    let instagramLink;
    for (webPage of jsonResponse.webPages.value) {
        instagramLink = webPage.url;
        if (instagramLink.includes(INSTAGRAM)) {
            break;
        }
    }
    console.log(instagramLink);
    return instagramLink;
}

module.exports = {
    getInstagramUrl
};
