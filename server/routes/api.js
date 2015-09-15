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
    Articles.find({date: req.body.date}, function(err, articles){
        if (err) {
            console.log("This is the error! ", err);
        }
        if (articles.length > 0){
            testDate = true;
            console.log("Number of Documents in DB with this Date: ", articles.length);
            console.log("Test Date Value is now: ", testDate);
        }
    });

    Articles.find({site: {"$in": req.body.site[0].siteID }}).where({date: req.body.date}, function(err, articles){
        if (err) {
            console.log("This is the error! ", err);
        }
        if (articles.length > 0){
            testSite = true;
            console.log("Number of sites in DB with this Date: ", articles.length);
            console.log("Test Site Value is now: ". testSite);
        }
    });




    // This if Statement will check if a Date collection exists AND a site collection exists
    // The push functionality here is not working.  Could be just a syntax issue.
    if (Articles.find({site: {"$in": req.body.site[0].siteID }}).where({date: req.body.date})) {
        console.log("Date and Site Match");

    // If Date exists - Set to true - Once you can push in an article - this would be used to push an article
    // with a new site.
    } else if (Articles.find({date: req.body.date})){
        console.log("Date only matches");

    } else {
        console.log("New Date for Article Hit!");

    }

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