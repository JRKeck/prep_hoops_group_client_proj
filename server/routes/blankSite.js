// Declare requirements for Router
var express = require('express');
var router = express.Router();
var path = require('path');

// Declare Database models that will be used by Router
var Feeds = require('../models/rssdb');
var Articles = require('../models/articledb');
var ParseDate = require('../models/parseDate');
var rssFeeds = [];


// Need to get the last article collection date from the database
function dateCollectionUpdate(rssFeeds) {
    Articles.find({}).sort({date: -1}).limit(1).exec(function (err, lastdate) {
        if (err) {
            console.log("Error pulling articles: ", err);
        } else {
            // Format last article collection date in Date for comparison to current date
            var tempLastParseDate = new Date(lastdate[0].date);
            var lastParseDate = new Date(tempLastParseDate.setDate(tempLastParseDate.getDate() + 1));
            var MS_PER_DAY = 1000 * 60 * 60 * 24;
            var currentDate = new Date();
            console.log("Last Article Date Colleciton: ", lastParseDate);
            console.log("Current Date: ", currentDate);

            // a and b are javascript Date objects
            function dateDiffInDays(a, b) {
                // Discard the time and time-zone information.
                var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                return Math.floor((utc2 - utc1) / MS_PER_DAY);
            }

            var daysSinceLastParse = dateDiffInDays(lastParseDate, currentDate);
            console.log("Days Since Last Parse: ", daysSinceLastParse);

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

            if (daysSinceLastParse > 0) {
                for (var i = 0; i < daysSinceLastParse; i++) {
                    console.log("Current Date is: ", currentDate);
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
                    console.log("Current Date at end of loop: ", currentDate)
                }
            }
        }
    });
}

// Need to get all of the sites from the Database
function getFeeds() {
    Feeds.find({}, function (err, sites) {
        if (err) {
            console.log("Error in pull sites from database ", err);
        }
        //console.log(sites);
        console.log("Number of Sites: ", sites.length);
        rssFeeds = sites;
        getDate(rssFeeds)
    });
}

router.get('/*', function(req, res, next){
    console.log("Get Sites!");
    getFeeds();
    res.send('Getting Sites Complete!');
});

module.exports = router;