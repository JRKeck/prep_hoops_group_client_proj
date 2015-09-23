// Declare requirements for Router
var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var parseString = require('xml2js').parseString;
var saveArticle = require('./parseAPI');
var ParseDate = require('../models/parseDate');

// Declare Database models that will be used by Router
var Feeds = require('../models/rssdb');

// Holds date/time of last time network was parsed
var lastParseDate;
// Holds date/time of new time network was parsed
var newParseDate;
// Keep track of the # of articles parsed
var articleCount = 0;
// Initializes an array that will hold the parsed objects
var holdingArray = [];
// Flag to wait until all RSS feeds are parsed before sending the to DB
var networksParsed = 0;

// Get call to just get last parse date for use on client side
router.get('/getLastDate', function(req, res, next){
    ParseDate.find({}, function(err, obj){
        res.send(obj)
    });
});

// This is the GET call to fire off the parse when localhost:3000/parseRSS is
// fed into the browser
router.get('/*', function(req, res, next){
    console.log('Parsing RSS!');
    // Capture the time of Parsing execution
    newParseDate = dateToISO(Date.now());
    console.log('New parse date: '+newParseDate);
    // Check the DB for the last parse date
    findLastParseDate();
    // Get the RSS Feeds
    networkParser();

    res.send('Parsing Complete!');

});

module.exports = router;

// Find the last parse date in the DB
function findLastParseDate(){
    ParseDate.findOne({}, {}, { sort: { 'date' : -1 } }, function(err, obj) {
        if (err){
            console.log('Error finding last parse date');
        }
        // If there is no last parse date create a new one
        else if(!obj){
            lastParseDate = '2000-01-01T00:00:00.000Z';
            ParseDate.create({date: newParseDate}, function (err, post) {
            })
        }
        else {
            lastParseDate = (dateToISO(obj.date));
            console.log(obj.id);


        }
        console.log('Last parse date: '+lastParseDate);
    });
}

// Loop through each RSS Feed in the Network
function networkParser(){
    Feeds.find({}, function (err, sites) {
        if (err) {
            console.log("Error in pull sites from database ", err);
        }
        //console.log(sites);
        console.log("Number of Sites: ", sites.length);
        // For each Feed in the network send it to the parser
        for(i = 0; i < sites.length; i++){
            var el = sites[i];
            var networkCount = sites.length;
            parseFeed(el.rssURL, el.siteFullName, el.siteID, networkCount);
        }
    });
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
            for(i = 0; i < articles.length; i++) {
                var el = articles[i];

                // Change  pubdate to ISO format
                var date = dateToISO(el.pubDate[0]);

                //Remove the time information from the ISO date
                var shortDate = date.substr(0, date.indexOf('T'));

                // Get article ID
                var articleID = getSportNginArticleID(el.link[0]);

                // Store the parsed info in an obj
                var articleObj = {};

                // Add data to obj that will be sent to mongoose
                articleObj.pubDate = date;
                articleObj.shortDate = shortDate;
                articleObj.siteID = siteID;
                articleObj.siteName = siteName;
                articleObj.title = el.title[0];
                articleObj.author = el.author[0];
                articleObj.url = el.link[0];
                articleObj.articleID = articleID;

                // If the articles pubDate is newer than the last parse date push it to array
                if (articleObj.pubDate > lastParseDate) {
                    console.log(articleObj.pubDate +' is newer than '+ lastParseDate);
                    holdingArray.push(articleObj);
                }
                else {
                    console.log('article is older than the last parse date');
                }
                // console.log("Holding Array Items: ", holdingArray.length);
                articleCount++;
            }
            networksParsed++;
            // If all articles in network have been parsed send them to the DB
            if(networksParsed == numNetworks){
                console.log('Parsing Complete!');
                console.log(articleCount + ' articles parsed');
                console.log('There are ' + holdingArray.length + ' articles in the array');
                // Reset Counters
                networksParsed = 0;
                articleCount = 0;

                if (holdingArray.length > 0){
                    //console.log(holdingArray);
                    ParseDate.findByIdAndUpdate(obj.id, {date: newParseDate}, function (err, post) {
                    });
                    saveArticle(holdingArray, 0);
                    holdingArray = [];
                }
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