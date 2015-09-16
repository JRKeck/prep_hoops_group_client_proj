This push didn't work.
_-------------

Articles.findByIdAndUpdate({"_id": mongoDateID},
                {$push: {"site[siteArrayIndex].articles": newArticle}},
                //{safe: true, new: true},
                function(err, numAffected){
                    console.log(err);
                    if(err) {
                        console.log("This is the push error: ", err);
                    } else {
                        console.log("This is the number of articles affected: ", numAffected);
                    }
                }
            );



This push didn't work.
---------------------

//Articles.findByIdAndUpdate(mongoDateID, function(err,kitty){
            //    if(err) {
            //        console.log("This is the findByID error: ", err);
            //    }
            //    console.log("This is the kitty: ", kitty.site[0].articles[0]);
                // {$push: {"site[siteArrayIndex].articles[articleArrayIndex]": newArticle}}
                //{safe: true, new: true},
                //function(err, numAffected){
                //    console.log(err);
                //    if(err) {
                //        console.log("This is the push error: ", err);
                //    } else {
                //        console.log("This is the number of articles affected: ", numAffected);
                //    }




This push didn't work.
----------------------
//Articles.findByIdAndUpdate({_id: mongoSiteID},
//    {$push: {'articles': {
//        pubDate: req.body.site[0].articles[0].pubDate,
//        author: req.body.site[0].articles[0].author,
//        title: req.body.site[0].articles[0].title,
//        url: req.body.site[0].articles[0].url,
//        articleID: req.body.site[0].articles[0].articleID,
//        paywalled: req.body.site[0].articles[0].paywalled,
//        tags: req.body.site[0].articles[0].tags
//    }
//    }},
//    {safe: true, upsert: true},
//    function(err, article){
//        console.log("This is the error: ", err);
//        console.log("This is the article: ", article);
//    }
//);




STash working code:
 // This set of code will pull the Object IDs of the Date Collection and the Site Array underneath the collection.
        var queryDateID = Articles.findOne({date: req.body.date});
        queryDateID.select('id site');
        queryDateID.exec(function(err, article) {
            //if (err) console.log(err);
            //var mongoDateID = article.id;
            //console.log(mongoDateID);
            //var mongoSiteID = article.site[0]._id;
            //console.log(mongoSiteID);
        });
        //console.log("Site information: ", article.site);
        //console.log("Number of Sites in date: ", article.site.length);

        // Find array index of site in the sites array.
        var searchTerm = req.body.site[0].siteID;
        var siteArrayIndex = -1;
        for (var i = 0; i < article.site.length; i++){
            if (article.site[i].siteID === searchTerm) {
                siteArrayIndex = i;
            }
        }
        var articleArrayIndex = article.site[siteArrayIndex].articles.length;
        console.log("Site Array Index: ", siteArrayIndex);
        console.log("Article Array Index: ", articleArrayIndex);

        // Set newArticle to only the article information that is being passed in (Site and Date not needed)
        // Only want to push the article.
        var newArticle = req.body.site[0].articles[0];
        console.log(newArticle);
        var articleToAdd = {
            pubDate: req.body.site[0].articles[0].pubDate,
            author: req.body.site[0].articles[0].author,
            title: req.body.site[0].articles[0].title,
            url: req.body.site[0].articles[0].url,
            articleID: req.body.site[0].articles[0].articleID,
            paywalled: req.body.site[0].articles[0].paywalled,
            tags: req.body.site[0].articles[0].tags
        };

        Articles.findById(mongoDateID, function(err, item) {
            console.log(item);
            item.site[siteArrayIndex].articles.push(articleToAdd);
            item.save(function (err, item) {
                console.log(err);
            });
        });




        Articles.create(req.body, function(err, post){
                    if(err){
                        console.log("Error on Article Create: ", err);
                    }
                });





    _________________________

    Code we did not need (yet)
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