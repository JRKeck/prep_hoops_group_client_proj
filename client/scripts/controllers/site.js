prepHoopsApp.controller('SiteController', ['$scope', '$http', '$location', '$modal','siteFullName', function($scope, $http, $location, $modal,siteFullName){
    console.log('Dashboard script loaded');
    $scope.sites = [];
    $scope.dates = [];
    $scope.feeds = [];
    $scope.authorsWithArticles=[];
    $scope.siteName=siteFullName.get('siteFullName');
    $scope.authors=[];
    $scope.uniqueAuthors=[];
    $scope.totalArticles = [];
    $scope.dailyAvg = [];
    $scope.max= [];
    $scope.zeroDays= [];
    //$scope.Author = function(date,author, articles){
    //    this.date= date;
    //    this.author = author;
    //    this.articles= articles;
    //
    //};
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

    $scope.getThirtyDaysOfArticles = function(first, last){
        $http.post('/api/articleGet', [first, last]).
            success(function(data){
                $scope.getFeeds();
                $scope.dates = data;
                //console.log("got here");
                $scope.getAuthors(data);

            });

    };

//Function to get new site name from dropdown control
    $scope.$on('siteChanged',
            function (evt, newSite) {

                $scope.siteName =
                    newSite;
            });

//Function to get a unique array from  an array with duplicates
    $scope.onlyUnique= function (value, index, self) {
    return self.indexOf(value) === index;
};


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

    //Function to get unique authors for a site for requested dates. This module loops through the date range first.
    //Then loops through the sites within the dates. If the site name matches the sitename from the $scope.sitename which is sent from the dasboard site
    //page the module then steps through the articles and pushes all the authors(including duplicates) into an array.
    //The next part then loops through this authors array and creates an array of unique authors for the given date range and initializes arrays for total articles, zero days,
    // daily average and maximum no of articles within a date range.
    $scope.getAuthors= function(data){
       for(var i=0; i<data.length; i++) {
           for (var j = 0; j < data[i].site.length; j++) {
               if (data[i].site[j].siteName === $scope.siteName) {
                   for (k = 0; k < data[i].site[j].articles.length; k++) {
                       $scope.authors.push(data[i].site[j].articles[k].author);

                            }
                        }
                    }
                }
         $scope.uniqueAuthors=$scope.authors.filter($scope.onlyUnique);
            for(i=0; i<data.length; i++) {
               $scope.authorsWithArticles.push({date:data[i].date,authors:[]});
                     for (var a = 0; a < $scope.uniqueAuthors.length; a++) {
                         $scope.authorsWithArticles[i].authors.push({authorName:$scope.uniqueAuthors[a], articles:[]});
                         $scope.totalArticles[a]=0;
                         $scope.zeroDays[a]=0;
                         $scope.dailyAvg[a]=0;
                         $scope.max[a]=0;

            }
        }
        //console.log($scope.authorsWithArticles);

        $scope.getAuthorArticles(data);
    };

    //$scope.getAuthorArticles = function(data){
    //    for(var i=0; i<data.length; i++) {
    //       for (var j = 0; j < data[i].site.length; j++) {
    //           if (data[i].site[j].siteName === $scope.siteName) {
    //               for (var a=0; a<$scope.uniqueAuthors.length; a++){
    //                   for (var k = 0; k < data[i].site[j].articles.length; k++) {
    //                       if(data[i].site[j].articles[k].author===$scope.uniqueAuthors[a] && data[i].date ===$scope.authorsWithArticles[i].date) {
    //                           $scope.authorsWithArticles[i].authors[a].articles.push(data[i].site[j].articles[k]);
    //                       }
    //                   }
    //
    //               }
    //           }
    //       }
    //    }
    //          console.log($scope.authorsWithArticles);
    //};

//Function to create and array of author article objects
    $scope.getAuthorArticles = function(data){
        for(var i=0; i<data.length; i++) {
           for (var j = 0; j < data[i].site.length; j++) {
               if (data[i].site[j].siteName === $scope.siteName) {
                   for (var a=0; a<$scope.uniqueAuthors.length; a++){
                       for (var k = 0; k < data[i].site[j].articles.length; k++) {
                           if(data[i].site[j].articles[k].author===$scope.uniqueAuthors[a]) {
                               if (data[i].date === $scope.authorsWithArticles[i].date) {
                                   $scope.authorsWithArticles[i].authors[a].articles.push(data[i].site[j].articles[k]);
                               }
                           }

                       }

                   }

               }

           }

        }
        $scope.getAuthorStats();
    };

    //Function to get author stats for sitepage

    $scope.getAuthorStats = function(){

        for(var i=0; i< $scope.authorsWithArticles.length; i++){
            for(var j=0; j<$scope.authorsWithArticles[i].authors.length; j++){
                if($scope.authorsWithArticles[i].authors[j].articles.length===0){
                    $scope.zeroDays[j]=$scope.zeroDays[j]+1;
                }
                else{
                    $scope.totalArticles[j]= $scope.totalArticles[j] + $scope.authorsWithArticles[i].authors[j].articles.length;
                    $scope.dailyAvg[j]=Math.floor($scope.totalArticles[j]*100/($scope.authorsWithArticles.length))/100;
                    if($scope.authorsWithArticles[i].authors[j].articles.length>$scope.max[j]){
                        $scope.max[j]=$scope.authorsWithArticles[i].authors[j].articles.length;
                    }
                }
            }
        }

    };

    $scope.clearFields = function(){
            $scope.sites = [];
            $scope.dates = [];
            $scope.feeds = [];
            $scope.authorsWithArticles=[];
            $scope.siteName=siteFullName.get('siteFullName');
            $scope.authors=[];
            $scope.uniqueAuthors=[];
            $scope.totalArticles = [];
            $scope.dailyAvg = [];
            $scope.max= [];
            $scope.zeroDays= [];
    };

    //Function to call RSS feed dump into database & pull back articles for requested dates
    $scope.getRSS = function (first, last){
      $scope.clearFields();
        var shortFirstDate = first.toISOString();
        $scope.shortFirstDateString = shortFirstDate.substr(0, shortFirstDate.indexOf('T'));
        var shortSecondDate = last.toISOString();
        $scope.shortSecondDateString = shortSecondDate.substr(0, shortSecondDate.indexOf('T'));

        $http.post('/api/articleGet', [$scope.shortFirstDateString, $scope.shortSecondDateString]).
            success(function(data){
                $scope.getFeeds();
                $scope.dates = data;
                $scope.sites = data[0].site;
                $scope.getAuthors(data);
                //for(var i=0; i<data.length; i++) {
                //    for (var j = 0; j < data[i].site.length; j++) {
                //        if (data[i].site[j].siteName === $scope.siteName) {
                //            for (k = 0; k < data[i].site[j].articles.length; k++) {
                //                $scope.authors.push(data[i].site[j].articles[k].author);
                //
                //            }
                //        }
                //    }
                //}

        });
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

        console.log(this);
        $scope.selectedArticles = this.author.articles;
        var modalInstance = $modal.open(
            {
                animation: $scope.animationsEnabled,
                templateUrl: '/assets/views/routes/authorArticleUrl.html',
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