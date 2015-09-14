prepHoopsApp.controller('DashboardController', ['$scope', '$http', function($scope, $http){
    console.log("Dashboard Controller Loaded");
    var myDate = new Date('9/13/2015');
    console.log(myDate);
    var year = myDate.getFullYear().toString();
    var tempMonth = myDate.getMonth();
    var month = (tempMonth + 1).toString();
    var day = myDate.getDate().toString();
    var dbDate = year + month + day;
    console.log(dbDate);

    $scope.refreshFeeds = function(){
        var newDateArticle =
            {
            date: dbDate,
            site:
                [{
                siteName: 'North Star Hoops Report',
                siteID: 1,
                articles:
                        [{
                        pubDate: 'Sat, 27 Dec 2014 20:15:00 -0600',
                        author: 'The Czar',
                        title: '2014 Granite City Classic: Monticello vs Apollo',
                        url: 'http://www.northstarhoopsreport.com/news_article/show/460716?referral=rss&referrer_id=982824',
                        articleID: 460716,
                        paywalled: false,
                        tags: []
                        }]
                }]
            };
        var pushArticle =
            {
                pubDate: 'Sat, 27 Dec 2014 20:15:00 -0600',
                author: 'The Czar',
                title: '2014 Granite City Classic: Monticello vs Apollo',
                url: 'http://www.northstarhoopsreport.com/news_article/show/460716?referral=rss&referrer_id=982824',
                articleID: 460716,
                paywalled: false,
                tags: []
            };

        console.log("Full article with site and date: ", newDateArticle);
        console.log("Push artcile only: ", pushArticle);

        //$http({
        //    url: '/api/getObjectID',
        //    method: 'GET',
        //    params: {date: dbDate, siteID: 1}
        //    }).then(function(response){
        //    console.log(response);
        //});

        $http.post('/api/articleAdd', newDateArticle).then(function(response) {
            console.log("Your article was added successfully! ", response);
        });

    };
}]);