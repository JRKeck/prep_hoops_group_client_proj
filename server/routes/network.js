var express = require('express');
var router = express.Router();
var path = require('path');
var Site = require('../models/rssdb');

// Add Site
router.post('/addsite', function(req,res,next) {
    console.log('Add Site Route Hit');
    console.log(req.body);
});

module.exports = router;