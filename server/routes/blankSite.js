// Declare requirements for Router
var express = require('express');
var router = express.Router();
var path = require('path');

// Declare Database models that will be used by Router
var Feeds = require('../models/rssdb');
var Articles = require('../models/articledb');

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
            Articles.create(dateArticleToAdd, function (err, post) {
                if (err) {
                    console.log("Error on Article Create: ", err);
                } else {
                    console.log(post);
                }
            });
        }
    });
}

router.get('/*', function(req, res, next){
    console.log('Get Sites!');
    getFeeds();
    console.log('Getting Sites Complete!');
    res.send('Getting Sites Complete!');

});

module.exports = router;