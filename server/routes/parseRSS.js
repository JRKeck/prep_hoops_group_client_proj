var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var parseString = require('xml2js').parseString;

var xmlFeed = 'http://www.northstarhoopsreport.com/news_rss_feed?tags=744386%252C744387%252C1469282';

router.get('/*', function(req, res, next){
    client = new Client();

    console.log('Parsing RSS!')

    // Get Remote RSS Feed
    client.get(xmlFeed, function(data, response){

        // Parse the returned xml
        parseString(data, function (err, result) {
            // The array of articles
            var articles = result.rss.channel[0].item;
            // Loop through articles
            for(i=0; i<articles.length; i++){
                // Save the pubDate
                var date = articles[i].pubDate[0];
                console.log(date);
                // Parse the RFC date to a timestamp
                date = Date.parse(date);
                console.log(date);
                // Change the timestamp date to ISO
                date = new Date(date).toISOString();
                console.log('Publish Date: ' + date);
                console.log('Title: '+articles[i].title[0]);
                console.log('Author: ' + articles[i].author[0]);
                var link = articles[i].link[0];
                console.log('Link: ' + link);
                // Get end of URL
                var articleID = link.substr(link.lastIndexOf('/') + 1);
                // Remove everything after the ?
                articleID = articleID.substr(0, articleID.indexOf('?'));
                console.log('Article ID: '+articleID);
            }
            res.send(articles);
        });
    });
});

module.exports = router;

