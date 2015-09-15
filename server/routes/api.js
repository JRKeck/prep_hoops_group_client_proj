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

    // This set of code will pull the Object IDs of the Date Collection and the Site Array underneath the collection.
    var queryDateID = Articles.findOne({date: req.body.date});
    queryDateID.select('id site');
    queryDateID.exec(function(err, article) {
        if (err) console.log(err);
        var mongoDateID = article.id;
        var mongoSiteID = article.site[0]._id;
        console.log(mongoDateID);
        console.log(mongoSiteID);


        // This if Statement will check if a Date collection exists AND a site collection exists
        // The push functionality here is not working.  Could be just a syntax issue.
        if (Articles.find({site: {"$in": req.body.site[0].siteID }}).where({date: req.body.date})) {
            // Denote that the current site exists
            testSite = true;
            // Set newArticle to only the article information that is being passed in (Site and Date not needed)
            // Only want to push the article.
            newArticle = req.body.site[0].articles[0];
            // Push - not working
            Articles.findByIdAndUpdate({id: mongoSiteID},
                {$push: {'articles': {
                    pubDate: req.body.site[0].articles[0].pubDate,
                    author: req.body.site[0].articles[0].author,
                    title: req.body.site[0].articles[0].title,
                    url: req.body.site[0].articles[0].url,
                    articleID: req.body.site[0].articles[0].articleID,
                    paywalled: req.body.site[0].articles[0].paywalled,
                    tags: req.body.site[0].articles[0].tags
                }
                }},
                {safe: true, upsert: true},
                function(err, article){
                    console.log("This is the error: ", err);
                    console.log("This is the article: ", article);
                }
            );
        }

        // If Date exists - Set to true - Once you can push in an article - this would be used to push an article
        // with a new site.
        if (Articles.find({date: req.body.date})){
            testDate = true;
        }

        // Console Log to show the checks on the date collection and site collection.
        console.log("Test Date: ", testDate, " Test Site: ", testSite);
    });
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