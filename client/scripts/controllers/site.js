prepHoopsApp.controller('SiteController', ['$scope', '$http', '$location', 'userAuth', '$modal','siteFullName', function($scope, $http, $location, userAuth, $modal,siteFullName){
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
    $scope.Author = function(date,author, articles){
        this.date= date;
        this.author = author;
        this.articles= articles;

    };

  console.log($scope.siteName);
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
    //Then loops through the sites within the dates. If the site name matches the sitename from the $scope.sitename which is sent from the site.html
    //page the module then steps through the articles and pushes all the authors(including duplicates) into an array.
    //The next part then loops through this authors array and creates an array of unique authors
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
                               $scope.totalArticles[a]= $scope.totalArticles[a] + 1;
                               if (data[i].date === $scope.authorsWithArticles[i].date) {
                                   $scope.authorsWithArticles[i].authors[a].articles.push(data[i].site[j].articles[k]);
                               }
                           }

                       }

                   }

               }

           }

        }
              console.log($scope.totalArticles);
    };
     $scope.getAuthorStats= function(data){
         $scope.totalSiteArticles=0;
         var zeroDaysSite=0;
         for (var n=1; n<18; n++) {// Total number of sites = 17 and siteIDs start from 1
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
             $scope.dailyAvg.push(($scope.totalSiteArticles/(data.length)));
             $scope.zeroDays.push(zeroDaysSite);
             //console.log($scope.totalArticles, $scope.dailyAvg,$scope.zeroDays );
             $scope.totalSiteArticles=0;
             zeroDaysSite=0;
         }

     };

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