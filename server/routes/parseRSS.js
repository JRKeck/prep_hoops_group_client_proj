var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;

var xmlFeed = 'http://www.prephoopsarizona.com/news_rss_feed?tags=1560647%2C1564263%2C1564215%2C1564219%2C1564272%2C1564220%2C1579880%2C1579881%2C1579882';

router.get('/*', function(req, res, next){
    client = new Client();

    console.log('Parsing RSS!')

    // Get RSS Feed
    client.get(xmlFeed, function(data, response){

        // Parse the returned xml
        parseString(data, function (err, result) {
            // The array of articles
            var articles = result.rss.channel[0].item;
            // Loop through articles
            for(i=0; i<articles.length; i++){
                console.log(articles[i].pubDate[0]);
                // Save the pubDate
                var date = articles[i].pubDate[0];
                console.log(date);
                // Parse the RFC date to a timestamp
                date = Date.parse(date);
                console.log(date);
                // Change date to ISO
                date = new Date(date).toISOString();
                console.log(date);

                console.log(articles[i].title[0]);
            }
            res.send(JSON.stringify(articles));
        });
    });

});

module.exports = router;

