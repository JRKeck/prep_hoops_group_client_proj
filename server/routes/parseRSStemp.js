// Declare requirements for Router
var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var parseString = require('xml2js').parseString;
var saveArticle = require('./parseAPI');


// Declare Database models that will be used by Router
var Feeds = require('../models/rssdb');
var ParseDate = require('../models/parseDate');
var Articles = require('../models/articledb');

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
// Holding Array for the RSS Feeds to prevent multiple calls to the DB
var rssFeeds = [];

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
    // Find the Last Parse Date
    findLastParseDate();
    // Capture the time of Parsing execution
    newParseDate = dateToISO(Date.now());
    console.log('New parse date: '+newParseDate);
    res.send('Parsing Complete!');
});

module.exports = router;

// Find the last parse date in the DB
function findLastParseDate(){
    ParseDate.findOne({}, {}, { sort: { 'date' : -1 } }, function(err, obj) {
        console.log('In findLastParseDate - id:', obj.id);
        if (err){
            console.log('Error finding last parse date: ', err);
        }
        // If there is no last parse date create a new one
        else if(!obj){
            lastParseDate = '2000-01-01T00:00:00.000Z';
            ParseDate.create({date: newParseDate}, function (err, post) {
            })
        }
        else {
            // Working Variable for Parse
            lastParseDate = (dateToISO(obj.date));
            console.log("Last Parse Date: ", lastParseDate);
            console.log("Sending to Get Sites");
            // Get the RSS Feeds
            getSites();
        }
        console.log('Last parse date: '+lastParseDate);
    });
}

// Get Site information from the Database
function getSites() {
    Feeds.find({}, function (err, sites) {
        if (err) {
            console.log("Error in pull sites from database ", err);
        }
        //console.log(sites);
        console.log("Number of Sites: ", sites.length);
        console.log("Sending to dateCollectionUpdate.");
        rssFeeds = sites;
        dateCollectionUpdate(rssFeeds);
    });
}

// Need to get the last article collection date from the database
function dateCollectionUpdate(rssFeeds) {
    Articles.find({}).sort({date: -1}).limit(1).exec(function (err, lastdate) {
        if (err) {
            console.log("Error pulling articles: ", err);
        } else {
            // Format last article collection date in Date for comparison to current date
            var tempLastCollectionDate = new Date(lastdate[0].date);
            var lastCollectionDate = new Date(tempLastCollectionDate.setDate(tempLastCollectionDate.getDate() + 1));
            var MS_PER_DAY = 1000 * 60 * 60 * 24;
            var currentDate = new Date();
            console.log("Last Article Date Colleciton: ", lastCollectionDate);
            console.log("Current Date: ", currentDate);

            // a and b are javascript Date objects
            function dateDiffInDays(a, b) {
                // Discard the time and time-zone information.
                var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                return Math.floor((utc2 - utc1) / MS_PER_DAY);
            }

            var daysSinceLastCollection = dateDiffInDays(lastCollectionDate, currentDate);
            console.log("Days Since Last Parse: ", daysSinceLastCollection);

            var month = new Array();
            month[0] = "-01-";
            month[1] = "-02-";
            month[2] = "-03-";
            month[3] = "-04-";
            month[4] = "-05-";
            month[5] = "-06-";
            month[6] = "-07-";
            month[7] = "-08-";
            month[8] = "-09-";
            month[9] = "-10-";
            month[10] = "-11-";
            month[11] = "-12-";

            if (daysSinceLastCollection > 0) {
                for (var i = 0; i < daysSinceLastCollection; i++) {
                    console.log("We need to create collection(s)!  Current Date is: ", currentDate);
                    var currentDateDayTemp = (currentDate.getDate()).toString();
                    if (currentDateDayTemp < 10) {
                        var currentDateDay = "0" + currentDateDayTemp;
                    } else {
                        var currentDateDay = currentDateDayTemp;
                    }
                    var currentDateMonth = month[currentDate.getMonth()];
                    var currentDateYear = ((currentDate.getYear()) + 1900).toString();
                    var currentDateString = currentDateYear + currentDateMonth + currentDateDay;
                    console.log("Current Date String: " + currentDateString);

                    var dateArticleToAdd = {
                        date: currentDateString,
                        site: []
                    };
                    console.log("Preparing to create sites in date: " + currentDateString);
                    console.log("Number of sites to add: ", rssFeeds.length);
                    for (var j = 0; j < rssFeeds.length; j++) {
                        var sitePush = {
                            siteName: rssFeeds[j].siteFullName,
                            siteID: rssFeeds[j].siteID,
                            siteShortName: rssFeeds[j].siteShortName,
                            articles: []
                        };
                        dateArticleToAdd.site.push(sitePush);
                    }
                    console.log(dateArticleToAdd);
                    //Articles.create(dateArticleToAdd, function (err, post) {
                    //    if (err) {
                    //        console.log("Error on Article Create: ", err);
                    //    } else {
                    //        console.log(post);
                    //    }
                    //});
                    currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
                    if((i+1) === daysSinceLastCollection){
                        console.log("Current Date at end of loop: ", currentDate);
                        console.log("Sending to the networkParser");
                        networkParser(rssFeeds);
                    } else {
                        console.log("Current Date at end of loop: ", currentDate);
                    }
                }
            }
        }
    });
}

// Loop through each RSS Feed in the Network
function networkParser(sites){
    console.log("Number of Sites: ", sites.length);
    // For each Feed in the network send it to the parser
    for(i = 0; i < sites.length; i++){
        var el = sites[i];
        var networkCount = sites.length;
        parseFeed(el.rssURL, el.siteFullName, el.siteID, networkCount);
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
                    ParseDate.findOne({}, {}, { sort: { 'date' : -1 } }, function(err, obj) {
                        ParseDate.findByIdAndUpdate(obj.id, {date: newParseDate}, function (err, post) {
                            console.log('New parse date is', newParseDate);
                        });
                    });
                    //saveArticle(holdingArray, 0);
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