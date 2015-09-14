var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var User = require('../models/userdb');



// User Authentication
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/success',
        failureRedirect: '/dashboard'
    })
);

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