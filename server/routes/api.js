// Declare requirements for Router
var express = require('express');
var router = express.Router();
var path = require('path');
var testDate = false;
var testSite = false;

// Declare Database models that will be used by Router
var Articles = require('../models/articledb');

router.post("/articleAdd", function(req, res, next){
    // Console Log to check the site ID of the passed in data/RSS Feed
    console.log("Site ID #: ", req.body.site[0].siteID);

    // Console Log to show the initial settings are set (Should be False / False)
    console.log("Test Date: ", testDate, " Test Site: ", testSite);


    // Test Area
    // Results of the .find is an array.  Therefore if the results (articles)
    // is greater than 0 - The date already exists in the database.
    var collectionDateCheck = function(){
        Articles.find({date: req.body.date}, function(err, dates){
            if (err) {
                console.log("This is the error! ", err);
            }
            if (dates.length > 0){
                testDate = true;
                console.log("Number of Documents in DB with this Date: ", dates.length);
                console.log("Test Date Value is now: ", testDate);
                // Because the Date exists - now call the site check to enumerate the sites
                var queryArticleInfo = Articles.findOne({date: req.body.date});
                queryArticleInfo.select('id site');
                queryArticleInfo.exec(function(err, article) {
                    if (err) console.log("This is the queryArticleInfo Error: ", err);
                    var mongoDateID = article.id;
                    var mongoDateSites = article.site.length;
                    console.log("The document ID for this date is: ", mongoDateID);
                    console.log("Number of Sites under this date: ", mongoDateSites);

                    // Find array index of site in the sites array.
                    var searchTerm = req.body.site[0].siteID;
                    var siteArrayIndex = -1;
                    for (var i = 0; i < article.site.length; i++){
                        if (article.site[i].siteID === searchTerm) {
                            siteArrayIndex = i;
                            testSite = true;
                            console.log("Site ID: ", searchTerm, " was found at Index: ", siteArrayIndex);
                            console.log("Test Site Value is now: ", testSite);
                        } else {
                            console.log("Site ID: ", searchTerm, " was not found!");
                        }
                    }
                });
            } else {
                console.log("Number of Documents in DB with this Date: ", dates.length);
            }
        });

    }();

    // This is to illustrate that we have an async issue here where the values
    // of testDate and testSite are getting "updated" before the promises are returned
    // from the database.
    console.log("After Find functions - testDate = ", testDate, " and testSite = ", testSite);






    // This if Statement will check if a Date collection exists AND a site collection exists
    // The push functionality here is not working.  Could be just a syntax issue.
    //Articles.find({site: {"$in": req.body.site[0].siteID }}).where({date: req.body.date}), function(err, things) {
    //    console.log(things.length);
    //};

    // If Date exists - Set to true - Once you can push in an article - this would be used to push an article
    // with a new site.
    //} else if (Articles.find({date: req.body.date})){
    //    console.log("Date only matches");
    //
    //} else {
    //    console.log("New Date for Article Hit!");
    //
    //}

    // Console Log to show the checks on the date collection and site collection.

    res.send("OK");
});


router.get('/getObjectID', function(request, response, next){
    console.log(request);

});

//
//router.put("/article/:id", function(req, res, next){
//    console.log("Article Put hit: ", req.params.id, req.body);
//    Articles.findByIdAndUpdate(req.params.id, req.body, function(err, post){
//        res.send("Database update successful");
//        if(err){
//            console.log("Error: ", err);
//        }
//    });
//});
//
//router.get('/articleGet', function(request, response, next){
//    return Articles.find({}).exec(function(err, rides){
//        if(err) console.log("Your error is in the Articles router.get");
//        if(err) throw new Error(err);
//        response.send(JSON.stringify(rides));
////        next();
//    });
//});

module.exports = router;