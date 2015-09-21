// Declare requirements for Router
var express = require('express');
var router = express.Router();
var path = require('path');

// Declare Database models that will be used by Router
var Feeds = require('../models/rssdb');
var Articles = require('../models/articledb');
var ParseDate = require('../models/parseDate');

// Need to get the current last parse Date
function getDate(){
    ParseDate.find({}, function(err, lastDate){
        if(err) {
            console.log("Error in pulling last parse date: ", err);
        }
        var lastParse = lastDate[0].date;
        var currentDate = new Date();
        var startDate = new Date("August 1, 2015 01:00:00");
        //var a = currentDate.setDate(currentDate.getDate() -30);
        //var newDate = new Date(a);
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

        var lastParseDayTemp = (lastParse.getDate()).toString();
        if (lastParseDayTemp < 10) {
            var lastParseDay = "0" + lastParseDayTemp;
        } else {
            var lastParseDay = lastParseDayTemp;
        }
        var lastParseMonth = month[lastParse.getMonth()];
        var lastParseYear = ((lastParse.getYear()) + 1900).toString();
        var currentDateDay = (currentDate.getDate()).toString();
        var currentDateMonth = month[currentDate.getMonth()];
        var currentDateYear = ((currentDate.getYear()) + 1900).toString();
        var startDateDayTemp = (startDate.getDate()).toString();
        if (startDateDayTemp < 10) {
            var startDateDay = "0" + startDateDayTemp;
        } else {
            var startDateDay = startDateDayTemp;
        }
        var startDateMonth = month[startDate.getMonth()];
        var startDateYear = ((startDate.getYear()) + 1900).toString();
        console.log("Last Parse Date: ", lastParse);
        console.log("Current Date: ", currentDate);
        //console.log("Value of a: ", a);
        //console.log("New Date: ", newDate);
        console.log("Start Date String: " + startDateYear + startDateMonth + startDateDay);
        console.log("Last Parse String: " + lastParseYear + lastParseMonth + lastParseDay);
        console.log("Current Date String: " + currentDateYear + currentDateMonth + currentDateDay);


    });
}

// Need to get all of the sites from the Database
function getFeeds() {
    Feeds.find({}, function (err, sites) {
        if (err) {
            console.log("Error in pull sites from database ", err);
        }
        console.log(sites);
        console.log("Number of Sites: ", sites.length);
        for(var j = 15; j < 20; j++) {
            var temp = j.toString();
            var dateArticleToAdd = {
                date: "2015-09-" + temp,
                site: []
            };
            for (var i = 0; i < sites.length; i++) {
                var sitePush = {
                    siteName: sites[i].siteFullName,
                    siteID: sites[i].siteID,
                    siteShortName: sites[i].siteShortName,
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
        }
    });
}

router.get('/*', function(req, res, next){
    console.log("Get Date!");
    getDate();
    console.log('Get Sites!');
    //getFeeds();
    console.log('Getting Sites Complete!');
    res.send('Getting Sites Complete!');

});

module.exports = router;