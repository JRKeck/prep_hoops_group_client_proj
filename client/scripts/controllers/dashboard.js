
prepHoopsApp.controller('DashboardController', ['$scope', '$http', '$location', '$modal','siteFullName', function($scope, $http, $location, $modal,siteFullName){
    $scope.sites = [];
    $scope.dates = [];
    $scope.feeds = [];
    $scope.totalArticles = [];
    $scope.dailyAvg = [];
    $scope.percentPaid= [];
    $scope.zeroDays= [];


    //Function to get last parse date and load data for 30 days before
    $scope.getLastParseDate = function(){
        $http.get('/parseRSS/getLastDate').
            success(function(data){
                $scope.lastParseDate = new Date(data[0].date);
                var lastParseDate = new Date(data[0].date);
                $scope.thirtyDaysBefore = new Date(lastParseDate.setDate($scope.lastParseDate.getDate() - 30));
                var shortFirstDate = $scope.lastParseDate.toISOString();
                $scope.shortFirstDateString = shortFirstDate.substr(0, shortFirstDate.indexOf('T'));
                var shortSecondDate = $scope.thirtyDaysBefore.toISOString();
                $scope.shortSecondDateString = shortSecondDate.substr(0, shortSecondDate.indexOf('T'));
                $scope.getThirtyDaysOfArticles($scope.shortSecondDateString, $scope.shortFirstDateString);

            });

    };
    $scope.getLastParseDate();

    //Not yet working to get day of the week for specified date
    $scope.getDayOfWeek = function(date){
            $scope.dayOfWeek = date.getDay();
            //console.log($scope.dayOfWeek);
    };

    //Gets short names from feeds for table headers

    $scope.getFeeds = function(){
        $http.get('/network/getFeeds').
            success(function(data){
                $scope.feeds = data;

            });
    };


    //Function to make admin button redirect to site page
    $scope.go = function ( path ) {
        $location.path( path );
        //console.log(this);
        siteFullName.set('siteFullName',this.site.siteFullName);
    };



    $scope.getThirtyDaysOfArticles = function(first, last){
        $http.post('/api/articleGet', [first, last]).
            success(function(data){
                $scope.getFeeds();
                $scope.dates = data;
                //console.log("got here");
                $scope.getStats(data);

            });

    };

$scope.getFeeds();
    //Function to call RSS feed dump into database & pull back articles for requested dates
    $scope.getRSS = function (first, last){
        var shortFirstDate = first.toISOString();
        $scope.shortFirstDateString = shortFirstDate.substr(0, shortFirstDate.indexOf('T'));
        var shortSecondDate = last.toISOString();
        $scope.shortSecondDateString = shortSecondDate.substr(0, shortSecondDate.indexOf('T'));

        $http.post('/api/articleGet', [$scope.shortFirstDateString, $scope.shortSecondDateString]).
            success(function(data){
                $scope.getFeeds();
                $scope.dates = data;
                $scope.sites = data[0].site;
                $scope.getStats(data);
                //console.log(data);


        });
    };

    $scope.clearFields = function(){
            $scope.totalSiteArticles=0;
            $scope.totalArticles = [];
            $scope.dailyAvg = [];
            $scope.percentPaid= [];
            $scope.zeroDays= [];
    };

//Function to get stats for the main dashboard
     $scope.getStats= function(data){
         $scope.clearFields();
         var zeroDaysSite=0;
         for (var n=1; n<=$scope.feeds.length; n++) {// Total number of sites from the feeds
             for (var i = 0; i < data.length; i++) {
                 for (var j = 0; j < data[i].site.length; j++) {
                     if (data[i].site[j].siteID === n){
                             $scope.totalSiteArticles = $scope.totalSiteArticles + data[i].site[j].articles.length;
                         if(data[i].site[j].articles.length===0){
                             zeroDaysSite++;
                         }

                    }
                 }

             }
             $scope.totalArticles.push($scope.totalSiteArticles);
             $scope.dailyAvg.push(Math.floor(($scope.totalSiteArticles*100/(data.length)))/100);
             $scope.zeroDays.push(zeroDaysSite);
             $scope.totalSiteArticles=0;// reset before loop
             zeroDaysSite=0;//reset before loop
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

    //creates modal to list articles on specific date

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

//controller for modal

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