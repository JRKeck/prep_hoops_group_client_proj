prepHoopsApp.controller('DashboardController', ['$scope', '$http', '$location', function($scope, $http, $location){

    $scope.getDate = function(date){
        var year = date.getFullYear().toString();
        var tempMonth = date.getMonth();
        var month = (tempMonth + 1).toString();
        var day = date.getDate().toString();
        var dbDate = year + month + day;
        return dbDate;
    };

    //Hard-coded data for testing purposes
    $scope.sites = [];
    $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $scope.dates = [];

    //Not yet working to get day of the week for specified date
    $scope.getDayOfWeek = function(date){
            $scope.dayOfWeek = date.getDay();
            console.log($scope.dayOfWeek);
    };

    //Function to make admin button redirect to admin page
    $scope.go = function ( path ) {
        $location.path( path );
    };

    //Function to call RSS feed dump into database & pull back articles for requested dates
    $scope.getRSS = function (first, last){
        //code for when we are matching dates from RSS feed to database
        //var shortFirstDate = first.toISOString();
        //var shortFirstDateString = shortFirstDate.substr(0, shortFirstDate.indexOf('T'));
        //var shortSecondDate = last.toISOString();
        //var shortSecondDateString = shortSecondDate.substr(0, shortSecondDate.indexOf('T'));
        var firstDate = $scope.getDate(first);
        var secondDate = $scope.getDate(last);
        $http.post('/api/articleGet', [firstDate, secondDate]).
            success(function(data){
            console.log(data);
                $scope.dates = data;
                $scope.sites = data[0].site;
                console.log(data[0].site);
        });
    };

    $scope.getArticles = function(){
      console.log(this.day.site);
        for(var i=0; i < this.day.site[0].articles.length; i++){
            console.log(this.day.site[0].articles[0].url)
        }
    };

    //Code for DatePicker


    $scope.open = function($event, opened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope[opened] = true;
    };

    $scope.status = {
        opened: false
    };

    $scope.today = function() {
        $scope.first = new Date();
        $scope.last = new Date();
    };

    $scope.today();

    $scope.clear = function () {
        $scope.first = null;
        $scope.last = null;
    };


















































    // This is Bob's test code for creating new database records.
    // All of this is not needed once we being parsing data.
    var myDate = new Date('9/13/2015');
    console.log(myDate);
    var year = myDate.getFullYear().toString();
    var tempMonth = myDate.getMonth();
    var month = (tempMonth + 1).toString();
    var day = myDate.getDate().toString();
    var dbDate = year + month + day;
    console.log(dbDate);

    $scope.getRSS = function() {
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

        console.log("Full article with site and date: ", newDateArticle);

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

    }
}]);