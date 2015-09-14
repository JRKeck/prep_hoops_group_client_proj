// Declare requirements for Router
var express = require('express');
var router = express.Router();
var path = require('path');
var testDate = false;
var testSite = false;

// Declare Database models that will be used by Router
var Articles = require('../models/articledb');

router.post("/articleAdd", function(req, res, next){
    console.log("Add Article Post hit: ", req.body);
    console.log(testDate);
    if (Articles.find({date: req.body.date})){
        testDate = true;
    }
    if (Articles.find({site: req.body.date}).where({date})){
        testDate = true;
    }
    console.log(testDate);
    //var testbool = Articles.
    //    find({date: req.body.date}).
    //    //where({siteID: req.body.site.siteID}).
    //    select('title');
    //console.log(testbool);
    //console.log(res);
    res.send('OK');
    //Articles.create(req.body, function(err, post){
    //    res.send("Database create successful");
    //    if(err){
    //        console.log("Error: ", err);
    //    }
    //});
});
router.get('/getObjectID', function(request, response, next){
    console.log(request);


});

//
//router.put("/article/:id", function(req, res, next){
//    console.log("Article Put hit: ", req.params.id, req.body);
//    Articles.findByIdAndUpdate(req.params.id, req.body, function(err, post){
//        res.send("Database update successful");
//        if(err){
//            console.log("Error: ", err);
//        }
//    });
//});
//
//router.get('/articleGet', function(request, response, next){
//    return Articles.find({}).exec(function(err, rides){
//        if(err) console.log("Your error is in the Articles router.get");
//        if(err) throw new Error(err);
//        response.send(JSON.stringify(rides));
////        next();
//    });
//});

module.exports = router;