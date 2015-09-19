prepHoopsApp.controller('SiteController', ['$scope', '$http', '$location', 'userAuth', '$modal','siteFullName', function($scope, $http, $location, userAuth, $modal,siteFullName){
    console.log('Dashboard script loaded');
    $scope.sites = [];
    $scope.dates = [];
    $scope.feeds = [];
    $scope.sitesWithArrays=[];
    $scope.siteName=siteFullName.get('siteFullName');
    $scope.authors=[];
    $scope.uniqueAuthors=[];

  console.log($scope.siteName);

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
                //console.log($scope.authors);
                $scope.uniqueAuthors=$scope.authors.filter( $scope.onlyUnique);
                console.log($scope.uniqueAuthors);
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