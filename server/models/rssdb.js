// Declare Mongoose Requirement
var mongoose = require('mongoose');

// Declare Schema for the Prep Hoops Article Collection of Mongo DB
var RSSSchema = new mongoose.Schema({
    lastParseDate : Date,
    sites :
        [{
            siteId: Number,
            siteShortName: String,
            siteFullName: String,
            rssURL: String
        }]
});

// Package and Export Article Database Model
module.exports = mongoose.model("Feeds", RSSSchema);