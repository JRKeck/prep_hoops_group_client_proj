var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var User = require('../models/userdb');



// User Authentication
router.post('/login', passport.authenticate('local'), function(req, res){
    console.log(req.user);
    res.send(req.user);
});

// User Registration
router.post('/register', function(req,res,next) {
    User.create(req.body, function (err, post) {
        if (err)
            next(err);
        else
            console.log('user registered!');
            res.redirect('/');
    })
});

module.exports = router;