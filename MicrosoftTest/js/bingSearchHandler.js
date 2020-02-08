// 1. Get an event from index.js when the user is searching for a celebrity- and search for the celebrity's instagram using bing API
// 2. Returns a link to the celebrity's instagram to index.js
// 3. Write the name of the celebrity to the DB / Storage
// 4. Returns a list of all the celebrities names from the DB 

var https = require('https'),
    fetch = require('node-fetch'),
    storageModel = require('./azureStorageHandler');


const CELEBRITY_NAME = "celebrityName";
const SUBSCRIPTION_KEY = "f67c6a721a8643db8cccda135a0bb7bb";


async function parseUrl(url) {
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

exports.parseUrl = parseUrl;

async function searchCelebrityInstagram(celebrityName) {

    const url = "https://api.cognitive.microsoft.com/bing/v7.0/search?q=" + encodeURIComponent(celebrityName) + " instagram";   

    const response = await fetch(url, {
        method: 'get',
        headers: { "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY },
    });

    console.log('\nJSON Response:\n');
    let jsonResponse = await response.json();
    let instagramLink;
    for (webPage of jsonResponse.webPages.value) {
        instagramLink = webPage.url;
        if (instagramLink.includes("instagram")) {
            break;
        }
    }
    console.log(instagramLink);
    return instagramLink;
}