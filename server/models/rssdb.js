// Declare Mongoose Requirement
var mongoose = require('mongoose');

// Declare Schema for the Prep Hoops Article Collection of Mongo DB
var RSSSchema = new mongoose.Schema({
    lastParseDate : Date,
    sites :
        [{
            siteId: Integer,
            siteCode: String,
            siteFullName: String,
            parseURL: String
        }]
});

// Package and Export Article Database Model
module.exports = mongoose.model("Feeds", RSSSchema);