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

// Delete Site
router.delete('/deletesite/:id', function(req, res, next){
    console.log("Delete Hit! ID: ", req.params.id);
    Feeds.findByIdAndRemove(req.params.id, req.body, function(err, post){
        if(err) {
            console.log("Error on Site Delete: ", err);
        }
        res.json(post);
    });
});

// Edit Site
router.put('/editsite/:id', function(req, res, next){
    console.log("Edit Hit! ID: ", req.params.id);
    console.log(req.body);
    Feeds.findByIdAndUpdate(req.params.id, {"siteFullName": req.body.editFullName, "siteShortName": req.body.editShortName, "rssURL": req.body.editRssURL}, function(err, post){
        if(err) {
            console.log("Error on Site Edite: ", err);
        }
        res.send('Updated');
    });
});


// Find last siteID
router.get('/lastid', function(req, res, next){
    console.log('finding last id');
    Feeds.findOne({}, {}, { sort: { 'siteID' : -1 } }, function(err, post) {
        res.send(post);
    });
});

//Get feed info from database
router.get('/getFeeds', function(req, res, next){
    console.log('Getting feeds info');
    Feeds.find({}).
       sort({'siteID':1}).
       exec(function(err, feeds){
       res.send(feeds);
   });
});

// Get the list of Sites in the Network
router.get('/*', function(req, res, next){
    console.log('Getting List of Sites');
    Feeds.find({}).
        sort({'siteID':1}).
        exec(function(err, feeds){
            res.send(feeds);
    });
});

module.exports = router;