var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var parseString = require('xml2js').parseString;
//var parseString = require('node-rest-client/node_modules/xml2js').parseString;

// Keep track of the # of articles parsed
var articleCount = 0;

// Demo data of a req to the DB for all the sites
var networkArray = [
    {
        siteName: 'NorthStar Hoops Report',
        shortName: 'MN',
        siteID: 1,
        siteFeed: 'http://www.northstarhoopsreport.com/news_rss_feed?tags=744386%252C744387%252C1469282'
    },
    {
        siteName: 'Prep Hoops Iowa',
        shortName: 'IA',
        siteID: 2,
        siteFeed: 'http://www.prephoopsiowa.com/news_rss_feed?tags=1160474%2C1160478%2C1160479%2C1160453%2C1164934%2C1164913%2C1164890%2C1164908%2C1161834%2C1330622'
    }
];

router.get('/*', function(req, res, next){
    console.log('Parsing RSS!');

    networkParser(networkArray);

    console.log('Parsing Complete!');

    res.send('Parsing Complete!');

});

module.exports = router;

// Loop through each RSS Feed in the Network
function networkParser(array){
    // For each Feed in the network snd it to the parser
    for(i=0; i<array.length; i++){
        var el = array[i];
        parseFeed(el.siteFeed, el.siteName, el.siteID);
    }
}

// Parse an RSS Feed
function parseFeed(feedURL, siteName, siteID){
    client = new Client();

    // Connect to Remote RSS Feed
    client.get(feedURL, function(data, response){

        // Parse the returned xml
        parseString(data, function (err, result) {

            // The array of articles
            var articles = result.rss.channel[0].item;

            // Loop through articles array
            for(i=0; i<articles.length; i++){
                var el = articles[i];

                // Change  pubdate to ISO format
                var date = dateToISO(el.pubDate[0]);

                // Get article ID
                var articleID = getSportNginArticleID(el.link[0]);

                // Store the parsed info in an obj
                var articleObj = {};

                // add data to obj that will be sent to mongoose
                articleObj.pubDate = date;
                articleObj.siteID = siteID;
                articleObj.siteName = siteName;
                articleObj.title = el.title[0];
                articleObj.author = el.author[0];
                articleObj.url = el.link[0];
                articleObj.articleID = articleID;

                console.log(articleObj);

                articleCount++;
                console.log(articleCount + ' articles parsed');
            }
        });
    });
}
// Convert a date to ISO format
function dateToISO(date){
    var ISOdate = new Date(date).toISOString();
    return ISOdate;
}

// Grab the unique ID from a SportNgin article
function getSportNginArticleID(url){
    var articleID = url.substr(url.lastIndexOf('/') + 1);
    // Remove everything after the ?
    articleID = articleID.substr(0, articleID.indexOf('?'));
    return articleID;
}