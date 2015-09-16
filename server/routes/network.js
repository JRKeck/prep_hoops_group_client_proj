var express = require('express');
var router = express.Router();
var path = require('path');
var Feeds = require('../models/rssdb');

// Add Site
router.post('/addsite', function(req,res,next) {
    Feeds.create(req.body, function (err, post) {
        if (err)
            next(err);
        else
            console.log('Site Added!');
            res.send('Site Added');
    })
});

// Find last siteID
router.get('/lastid', function(req, res, next){
    console.log('finding last id');
    Feeds.findOne({}, {}, { sort: { 'siteID' : -1 } }, function(err, post) {
        res.send(post);
    });
});

module.exports = router;