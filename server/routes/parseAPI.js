// Declare requirements for Router
var express = require('express');
var router = express.Router();
var path = require('path');
var testDate = false;
var testSite = false;

// Declare Database models that will be used by Router
var Articles = require('../models/articledb');

// Results of the .find is an array.  Therefore if the results (articles)
// is greater than 0 - The date already exists in the database.
var saveFeedArticle = function(feedObject){
    console.log("This is in parseAPI: ", feedObject);
    console.log("This is a single field in parseAPI: ", feedObject.shortDate);

    // Console Log to check the site ID of the passed in data/RSS Feed
    console.log("Site ID #: ", feedObject.siteID);

    // Start by checking the database for a collection that matches the date of the
    // article published.
    Articles.find({date: feedObject.shortDate}, function(err, dates){
        if (err) {
            console.log("This is the error! ", err);
        }
        if (dates.length > 0){
            console.log("Number of Documents in DB with this Date: ", dates.length);

            // Because the Date exists - now call the site check to enumerate the sites
            // You cannot have a date collection without at least one site/article in it.
            var queryArticleInfo = Articles.findOne({date: feedObject.shortDate});
            queryArticleInfo.select('id site');
            queryArticleInfo.exec(function(err, article) {
                if (err) console.log("This is the queryArticleInfo Error: ", err);
                var mongoDateID = article.id;
                var mongoDateSites = article.site.length;
                testDate = true;
                console.log("Test Date Value is now: ", testDate);
                console.log("The document ID for this date is: ", mongoDateID);
                console.log("Number of Sites under this date: ", mongoDateSites);

                // Find array index of site in the sites array.
                // The we can append the article to the proper site.
                var searchTerm = feedObject.siteID;
                var siteArrayIndex = -1;
                for (var i = 0; i < article.site.length; i++){
                    if (article.site[i].siteID === searchTerm) {
                        siteArrayIndex = i;
                        testSite = true;
                        console.log("Site ID: ", searchTerm, " was found at Index: ", siteArrayIndex);
                        console.log("Test Site Value is now: ", testSite);
                        // Since the date and the site exist, we will append the article
                        // to the site within the Date
                        var articleToAdd = {
                            pubDate: feedObject.pubDate,
                            author: feedObject.author,
                            title: feedObject.title,
                            url: feedObject.url,
                            articleID: feedObject.articleID,
                            paywalled: false,
                            tags: []
                        };

                        Articles.findById(mongoDateID, function(err, item) {
                            console.log("This is the item: ", item);
                            item.site[siteArrayIndex].articles.push(articleToAdd);
                            item.save(function (err, item) {
                                console.log(err);
                            });
                        });
                    } else {
                        console.log("Site ID: ", searchTerm, " was not found!");
                        // Since the date exists but the site does not,
                        // we will append the site and article within the Date
                        var siteArticleToAdd = {
                            siteName: feedObject.siteName,
                            siteID: feedObject.siteID,
                            articles:
                                [{
                                    pubDate: feedObject.pubDate,
                                    author: feedObject.author,
                                    title: feedObject.title,
                                    url: feedObject.url,
                                    articleID: feedObject.articleID,
                                    paywalled: false,
                                    tags: []
                                }]
                        };

                        Articles.findById(mongoDateID, function(err, item) {
                            console.log("This is the item: ", item);
                            item.site.push(siteArticleToAdd);
                            item.save(function (err, item) {
                                console.log(err);
                            });
                        });
                    }
                }
            });
        } else {
            console.log("Number of Documents in DB with this Date: ", dates.length);
            console.log("Create new date document with site and article");
            //Need to format the new record for the MongoDB
            var dateArticleToAdd = {
                date: feedObject.shortDate,
                site:
                    [{
                    siteName: feedObject.siteName,
                    siteID: feedObject.siteID,
                    articles:
                        [{
                            pubDate: feedObject.pubDate,
                            author: feedObject.author,
                            title: feedObject.title,
                            url: feedObject.url,
                            articleID: feedObject.articleID,
                            paywalled: false,
                            tags: []
                        }]
                    }]
            };
            // Since there is no date created yet - we will create the document
            Articles.create(dateArticleToAdd, function(err, post){
                if(err){
                    console.log("Error on Article Create: ", err);
                }
            });
        }
    });

    // This is to illustrate that we have an async issue here where the values
    // of testDate and testSite are getting "updated" before the promises are returned
    // from the database.
    console.log("After Find functions - testDate = ", testDate, " and testSite = ", testSite);

};

module.exports = saveFeedArticle;