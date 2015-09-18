prepHoopsApp.controller('DashboardController', ['$scope', '$http', '$location', '$modal', function($scope, $http, $location, $modal){

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
    //$scope.siteIds = [[1, []], [2, []], [3, []]];
    $scope.siteIds = [1,2,3,4,5,6];
    $scope.daysArray = [];
    $scope.dates = [];
    $scope.firstDate = '';
    $scope.secondDate = '';
    $scope.dateRangeLength = 0;

    //Not yet working to get day of the week for specified date
    $scope.getDayOfWeek = function(date){
            $scope.dayOfWeek = date.getDay();
            //console.log($scope.dayOfWeek);
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

        $scope.firstDate = $scope.getDate(first);
        $scope.secondDate = $scope.getDate(last);
        $scope.dateRangeLength = ($scope.secondDate + 1) - $scope.firstDate;

        $http.post('/api/articleGet', [$scope.firstDate, $scope.secondDate]).
            success(function(data){
                $scope.dates = data;
                $scope.sites = data[0].site;
                $scope.dateArrayCreator();
        });
    };

    //sorts incoming data into arrays for different sites
    $scope.siteArray=[];
    var n =3;
    $scope.sitesArrayCreator = function(){
        for(var j=0; j<n;j++){
            $scope.siteArray.push([j+1,[]]);
        }
    };


    $scope.sitesArrayCreator();
    //console.log($scope.siteArray);
    $scope.dateArrayCreator = function(){

        for(var i=0; i<4; i++ ) {
            $scope.daysArray.push([$scope.firstDate, $scope.siteArray]);
               $scope.firstDate= (parseInt($scope.firstDate) +1).toString();
        }
        //console.log($scope.daysArray);
            $scope.daySiteSort();

        };


 var dateRange= 4;

    $scope.daySiteSort = function(){

              for(var m =0; m < $scope.dates.length; m++) {
                  for (var i = 0; i < dateRange; i++){
                  if (($scope.daysArray[i][0] === $scope.dates[m].date)) {
                      console.log("user generated " +$scope.daysArray[i][0] + "from dbase " + $scope.dates[m].date );
                      for (var j = 0; j < $scope.daysArray[i][1].length; j++) {
                          console.log("sites array" + $scope.dates[m].site);
                           for (var k = 0; k < $scope.dates[m].site.length; k++) {
                               if ($scope.daysArray[i][1][j][0] === $scope.dates[m].site[k].siteID) {
                                   console.log("siteID position user gen " + $scope.daysArray[i][1][j][0]);
                                   console.log("siteID position from db " + $scope.dates[m].site[k].siteID);

                                   $scope.daysArray[i][1][j][1].push($scope.dates[m].site[k].articles);
                                   console.log("articles array posiitin within sites Array " + $scope.daysArray[i][1][j][1]);
                                   console.log("articles from db " + $scope.dates[m].site[k].articles);
                               }
                           }
                      }
                  }
                  //else {
                  //$scope.daysArray[i][1].push(0);
                  //    console.log("user generated " +$scope.daysArray[i][0]);
                  //    console.log($scope.daysArray[i][1]);
                  //}
              }

      }
        console.log($scope.daysArray);

    };

    $scope.getArticles = function(){
      //console.log(this.day.site);
        for(var i=0; i < this.day.site[0].articles.length; i++){
            console.log(this.day.site[0].articles[i].url)
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
//    var myDate = new Date('9/13/2015');
//    console.log(myDate);
//    var year = myDate.getFullYear().toString();
//    var tempMonth = myDate.getMonth();
//    var month = (tempMonth + 1).toString();
//    var day = myDate.getDate().toString();
//    var dbDate = year + month + day;
//    console.log(dbDate);
//
//    $scope.testDatabase = function() {
//        var newDateArticle =
//        {
//            date: dbDate,
//            site:
//                [{
//                    siteName: 'North Star Hoops Report',
//                    siteID: 1,
//                    articles:
//                        [{
//                            pubDate: 'Sat, 27 Dec 2014 20:15:00 -0600',
//                            author: 'The Czar',
//                            title: 'Test Number 3',
//                            url: 'http://www.northstarhoopsreport.com/news_article/show/460716?referral=rss&referrer_id=982824',
//                            articleID: 460716,
//                            paywalled: false,
//                            tags: []
//                        }]
//                }]
//        };
//
//        console.log("Full article with site and date: ", newDateArticle);
//
//        //$http({
//        //    url: '/api/getObjectID',
//        //    method: 'GET',
//        //    params: {date: dbDate, siteID: 1}
//        //    }).then(function(response){
//        //    console.log(response);
//        //});
//
//        $http.post('/api/articleAdd', newDateArticle).then(function(response) {
//            console.log("Your article was added successfully! ", response);
//        });
//
//    };
//
//    //working on modal to list articles on specific date
//
//    $scope.animationsEnabled = true;
//    $scope.openModal = function(size){
//        $scope.selectedArticles = this.day.site[0].articles;
//        var modalInstance = $modal.open(
//            {
//                animation: $scope.animationsEnabled,
//                templateUrl: '/assets/views/routes/articleUrl.html',
//                controller: 'ArticleInstanceController',
//                size: size,
//                resolve: {
//                    selectedArticles: function(){
//                        return $scope.selectedArticles;
//                    }
//                }
//            }
//        )
//    }
//
//}]);
//
//prepHoopsApp.controller('ArticleInstanceController', ['$scope', '$modalInstance', 'selectedArticles', function($scope, $modalInstance, selectedArticles){
//    $scope.modalArticles = selectedArticles;
//    console.log($scope.modalArticles);
//
//    for(var i = 0; i < $scope.modalArticles.length; i++){
//        console.log($scope.modalArticles[i].url);
//    }
//
//    $scope.ok = function () {
//        $modalInstance.close();
//    };
}]);