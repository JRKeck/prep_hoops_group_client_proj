var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var parseString = require('xml2js').parseString;
var saveArticle = require('./parseAPI');

// Keep track of the # of articles parsed
var articleCount = 0;

// Initializes an array that will hold the parsed objects
var holdingArray = [];

// Flag to wait until all RSS feeds are parsed before sending the to DB
var networksParsed = 0;


// Demo data of a req to the DB for all the sites
var networkArray = [
    //{
    //    siteName: 'NorthStar Hoops Report',
    //    shortName: 'MN',
    //    siteID: 1,
    //    siteFeed: 'http://www.northstarhoopsreport.com/news_rss_feed?tags=903525%2C477068%2C477064%2C718293%2C744134%2C744381%2C763955%2C744167%2C876578%2C454209%2C744386%2C744387%2C1513588%2C1469282'
    //}
    {
        siteName: 'Prep Hoops Iowa',
        shortName: 'IA',
        siteID: 2,
        siteFeed: 'http://www.prephoopsiowa.com/news_rss_feed?tags=1160474%2C1160478%2C1160479%2C1160453%2C1164934%2C1164913%2C1164890%2C1164908%2C1161834%2C1330622'
    }
];

// This is the GET call to fire off the parse when localhost:3000/parseRSS is
// fed into the browser
router.get('/*', function(req, res, next){
    console.log('Parsing RSS!');

    networkParser(networkArray);

    console.log('Parsing Complete!');

    res.send('Parsing Complete!');

});

module.exports = router;

// Loop through each RSS Feed in the Network
function networkParser(array){
    // For each Feed in the network send it to the parser
    for(i=0; i<array.length; i++){
        var el = array[i];
        var networkCount = array.length;
        parseFeed(el.siteFeed, el.siteName, el.siteID, networkCount);
    }
}

// Parse an RSS Feed
function parseFeed(feedURL, siteName, siteID, numNetworks){
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

                //Remove the time information from the ISO date
                var shortDate = date.substr(0, date.indexOf('T'));

                // Get article ID
                var articleID = getSportNginArticleID(el.link[0]);

                // Store the parsed info in an obj
                var articleObj = {};

                // add data to obj that will be sent to mongoose
                articleObj.pubDate = date;
                articleObj.shortDate = shortDate;
                articleObj.siteID = siteID;
                articleObj.siteName = siteName;
                articleObj.title = el.title[0];
                articleObj.author = el.author[0];
                articleObj.url = el.link[0];
                articleObj.articleID = articleID;

                //console.log("This is from parseRSS: ", articleObj);
                holdingArray.push(articleObj);
                //console.log("Holding Array Items: ", holdingArray.length);
                articleCount++;
                //console.log(articleCount + ' articles parsed');
            }
            networksParsed++;
            if(networksParsed == numNetworks){
                // If all articles in network have been parsed send them to the DB
                //console.log(holdingArray);
                console.log(articleCount + ' articles parsed');
                saveArticle(holdingArray, 0);
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