
prepHoopsApp.controller('DashboardController', ['$scope', '$http', '$location', 'userAuth', '$modal', function($scope, $http, $location, userAuth, $modal){
    console.log('Dashboard script loaded');


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
    $scope.siteIds = [1, 2, 3];
    $scope.daysArray = [];
    $scope.dates = [];
    $scope.firstDate = '';
    $scope.secondDate = '';
    $scope.dateRangeLength = 0;

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
        var shortFirstDate = first.toISOString();
        $scope.shortFirstDateString = shortFirstDate.substr(0, shortFirstDate.indexOf('T'));
        var shortSecondDate = last.toISOString();
        $scope.shortSecondDateString = shortSecondDate.substr(0, shortSecondDate.indexOf('T'));

        //$scope.firstDate = $scope.getDate(first);
        //$scope.secondDate = $scope.getDate(last);
        //$scope.dateRangeLength = ($scope.secondDate + 1) - $scope.firstDate;

        $http.post('/api/articleGet', [$scope.shortFirstDateString, $scope.shortSecondDateString]).
            success(function(data){
            //console.log(data);
                $scope.dates = data;
                $scope.sites = data[0].site;
                console.log(data);
                //$scope.dateArrayCreator();
        });
    }

    //sorts incoming data into arrays for different sites
 //   $scope.siteArray=[];
 //   var n =3;
 //   $scope.sitesArrayCreator = function(){
 //       for(var j=0; j<n;j++){
 //           $scope.siteArray.push([j+1,[]]);
 //       }
 //   };
 //   $scope.sitesArrayCreator();
 //   $scope.dateArrayCreator = function(){
 //
 //       for(var i=0; i<4; i++ ) {
 //           $scope.daysArray.push([$scope.firstDate, $scope.siteArray]);
 //              $scope.firstDate= (parseInt($scope.firstDate) +1).toString();
 //       }
 //       //console.log($scope.daysArray);
 //           $scope.daySiteSort();
 //
 //       };
 //
 //
 //var dateRange= 4;
 //   $scope.daySiteSort = function(){
 //       for(var m = 0; m < $scope.dates.length; m++){
 //           for (var i = 0; i < dateRange; i++){
 //               if($scope.daysArray[i][0] === $scope.dates[m].date){
 //                   console.log('array: ' + $scope.daysArray[i][0] + 'database: ' + $scope.dates[m].date);
 //                   for(var j = 0; j < $scope.daysArray[i][1].length; j++) {
 //                       if($scope.dates[i].site[j]!=null){
 //                           for(var k=0; k < $scope.daysArray[i][1].length; k++){
 //                               if ($scope.dates[m].site[j].siteID === $scope.daysArray[i][1][k][0]){
 //                                   console.log($scope.daysArray[i][1][k][1]);
 //                                   $scope.daysArray[0][1][k][1].push($scope.dates[m].site[j].articles);
 //                                   console.log($scope.daysArray);
 //                               }
 //                           }
 //
 //                       }
 //                   }
 //               }
 //
 //           }
 //
 //
 //
 //     }
        //console.log($scope.daysArray);

    //};

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
    var myDate = new Date('9/15/2015');
    console.log(myDate);
    var year = myDate.getFullYear().toString();
    var tempMonth = myDate.getMonth();
    var month = (tempMonth + 1).toString();
    var day = myDate.getDate().toString();
    var dbDate = year + month + day;
    console.log(dbDate);

    $scope.testDatabase = function() {
        var newDateArticle =
        {
            date: dbDate,
            site:
                [{
                    siteName: 'Prep Hoops Arizona',
                    siteID: 4,
                    articles:
                        [{
                            pubDate: 'Mon, 14 Sep 2015 14:15:00 -0400',
                            author: 'Brandon Dunson',
                            title: 'Frosh/Soph Showcase: Top Freshmen',
                            url: 'http://www.prephoopsarizona.com/news_article/show/553453?referral=rss&referrer_id=1560651',
                            articleID: '553453',
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

    };

    //working on modal to list articles on specific date

    $scope.animationsEnabled = true;
    $scope.openModal = function(size){
        $scope.selectedArticles = this.site.articles;
        var modalInstance = $modal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: '/assets/views/routes/articleUrl.html',
                controller: 'ArticleInstanceController',
                size: size,
                resolve: {
                    selectedArticles: function(){
                        return $scope.selectedArticles;
                    }
                }
            }
        )
    }

}]);

prepHoopsApp.controller('ArticleInstanceController', ['$scope', '$modalInstance', 'selectedArticles', function($scope, $modalInstance, selectedArticles){
    $scope.modalArticles = selectedArticles;
    $scope.articleUrlArray = [];

    for(var i = 0; i < $scope.modalArticles.length; i++){
        $scope.articleUrlArray.push($scope.modalArticles[i].url);
    }

    $scope.ok = function () {
        $modalInstance.close();
    };

}]);