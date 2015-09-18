// Declare requirements for Router
var express = require('express');
var router = express.Router();
var path = require('path');
var testDate = false;
var testSite = false;
var x = 0;

Array.prototype.getIndexBy = function (name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
};

// Declare Database models that will be used by Router
var Articles = require('../models/articledb');

// Results of the .find is an array.  Therefore if the results (articles)
// is greater than 0 - The date already exists in the database.
var saveFeedArticle = function(feedArray, x){
    var saveObject = feedArray[x];

    //console.log("This is the entire array: ", feedArray);
    console.log("This is the length: ", feedArray.length);
    console.log("Index is at start of function: ", x);
        // Console Log to check the site ID of the passed in data/RSS Feed
        console.log("Site ID #: ", saveObject.siteID,"Article ID: ", saveObject.articleID);

        // Start by checking the database for a collection that matches the date of the
        // article published.
        Articles.find({date: saveObject.shortDate}, function (err, dates) {
            if (err) {
                console.log("This is the error! ", err);
            }
            if (dates.length > 0) {
                console.log("Number of Documents in DB with this Date: ", dates.length);

                // Because the Date exists - now call the site check to enumerate the sites
                // You cannot have a date collection without at least one site/article in it.
                var queryArticleInfo = Articles.findOne({date: saveObject.shortDate});
                queryArticleInfo.select('id site');
                queryArticleInfo.exec(function (err, article) {
                    if (err) console.log("This is the queryArticleInfo Error: ", err);
                    var mongoDateID = article.id;
                    var mongoDateSites = article.site.length;
                    testDate = true;
                    //console.log("Test Date Value is now: ", testDate);
                    console.log("The document ID for this date is: ", mongoDateID);
                    console.log("Number of Sites under this date: ", mongoDateSites);

                    // Find array index of site in the sites array.
                    // The we can append the article to the proper site.
                    // indexOf will return -1 if the site is not found.
                    // Otherwise the array index of the site will be returned.
                    //var test = article.site;
                    //console.log(test);

                    var siteArrayIndex = article.site.getIndexBy("SiteID", saveObject.siteID);

                    // Old way
                    //var siteArrayIndex = article.site.indexOf({siteID: saveObject.siteID});
                    console.log("Looking for site: ", saveObject.siteID, " Got return of: ", siteArrayIndex);
                    if (siteArrayIndex == -1) {
                        console.log("Site ID: ", saveObject.siteID, " was not found!");
                        // Since the date exists but the site does not,
                        // we will append the site and article within the Date
                        var siteArticleToAdd = {
                            siteName: saveObject.siteName,
                            siteID: saveObject.siteID,
                            articles: [{
                                pubDate: saveObject.pubDate,
                                author: saveObject.author,
                                title: saveObject.title,
                                url: saveObject.url,
                                articleID: saveObject.articleID,
                                paywalled: false,
                                tags: []
                            }]
                        };

                        Articles.findById(mongoDateID, function (err, item) {
                            //console.log("This is the item: ", item);
                            item.site.push(siteArticleToAdd);
                            item.save(function (err, item) {
                                if (err) {
                                    console.log("Error on Article Create: ", err);
                                } else {
                                    console.log(item);
                                    x++;
                                    console.log("Items Written to Database: ", x);
                                    if (x < feedArray.length) {
                                        saveFeedArticle(feedArray, x)
                                    }
                                }
                            });
                        });
                    } else {
                        testSite = true;
                        console.log("Site ID: ", searchTerm, " was found at Index: ", siteArrayIndex);
                        console.log("Test Site Value is now: ", testSite);
                        // Since the date and the site exist, we will append the article
                        // to the site within the Date
                        var articleToAdd = {
                            pubDate: saveObject.pubDate,
                            author: saveObject.author,
                            title: saveObject.title,
                            url: saveObject.url,
                            articleID: saveObject.articleID,
                            paywalled: false,
                            tags: []
                        };

                        Articles.findById(mongoDateID, function (err, item) {
                            console.log("This is the item: ", item);
                            item.site[siteArrayIndex].articles.push(articleToAdd);
                            item.save(function (err, item) {
                                if (err) {
                                    console.log("Error on Article Create: ", err);
                                } else {
                                    console.log(item);
                                    x++;
                                    console.log("Items Written to Database: ", x);
                                    if (x < feedArray.length) {
                                        saveFeedArticle(feedArray, x)
                                    }
                                }
                            });
                        });
                    }
                });
            } else {
                console.log("Number of Documents in DB with this Date: ", dates.length);
                console.log("Create new date document with site and article");
                //Need to format the new record for the MongoDB
                var dateArticleToAdd = {
                    date: saveObject.shortDate,
                    site: [{
                        siteName: saveObject.siteName,
                        siteID: saveObject.siteID,
                        articles: [{
                            pubDate: saveObject.pubDate,
                            author: saveObject.author,
                            title: saveObject.title,
                            url: saveObject.url,
                            articleID: saveObject.articleID,
                            paywalled: false,
                            tags: []
                        }]
                    }]
                };
                // Since there is no date created yet - we will create the document
                Articles.create(dateArticleToAdd, function (err, post) {
                    if (err) {
                        console.log("Error on Article Create: ", err);
                    } else {
                        console.log(post);
                        x++;
                        console.log("Items Written to Database: ", x);
                        if (x < feedArray.length) {
                            saveFeedArticle(feedArray, x)
                        }
                    }
                });
            }
        });
    // This is to illustrate that we have an async issue here where the values
    // of testDate and testSite are getting "updated" before the promises are returned
    // from the database.
    //console.log("After Find functions - testDate = ", testDate, " and testSite = ", testSite);
};
module.exports = saveFeedArticle;