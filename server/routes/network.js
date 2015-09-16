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

module.exports = router;