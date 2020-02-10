/* Responsible for the connection with Azure's DB
 * - Creates the "celebrities" table
 * - For every new search- add the celebrity name to the table */

var azure = require('azure-storage');
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=csb1d0b932b92a2x430cx85e;AccountKey=nV54lRSHobX7LRTKiTHfmFQ03oRSpzdJSl9HyF7nwFazgB7IwWdni4D6eULPrb+xXbi9rQ3q6Voa0gyn3Q1VUg==;EndpointSuffix=core.windows.net";
const AZURE_STORAGE_ACCOUNT = "csb1d0b932b92a2x430cx85e";
const AZURE_STORAGE_ACCESS_KEY = "nV54lRSHobX7LRTKiTHfmFQ03oRSpzdJSl9HyF7nwFazgB7IwWdni4D6eULPrb+xXbi9rQ3q6Voa0gyn3Q1VUg==";
const CELEBRITY_TABLE_NAME = "celebrities";

async function addToSearchesContainer(celebrityName) {

    const tableSvc = azure.createTableService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY);

    tableSvc.createTableIfNotExists(CELEBRITY_TABLE_NAME, function (error, result, response) {
        if (!error) {
            // Table exists or created
            var entGen = azure.TableUtilities.entityGenerator;
            var task = {
                PartitionKey: entGen.String(CELEBRITY_TABLE_NAME),
                RowKey: entGen.String(new Date().getTime().toString()),
                celebrityName: entGen.String(celebrityName),
            };
            tableSvc.insertEntity(CELEBRITY_TABLE_NAME, task, function (error, result, response) {
                if (!error) {
                    // Entity inserted
                    console.log("entitiy inserted succesfully");                  
                }
                else {
                    console.log(error);
                }
            });
        }
        else {
            console.log(error);
        }
    });
    
}

function getAllSearches(callbackFunction) {
    var query = new azure.TableQuery();
    const tableSvc = azure.createTableService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY);
    tableSvc.queryEntities(CELEBRITY_TABLE_NAME, query, null, callbackFunction);
}

module.exports = { addToSearchesContainer, getAllSearches };
