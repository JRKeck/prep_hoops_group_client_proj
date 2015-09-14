var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');


// User Authentication
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/admin'
    })
);

module.exports = router;