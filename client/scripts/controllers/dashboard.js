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

    //Not yet working code to get day of the week for specified date
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
      console.log(this);
    };

    //Code for DatePicker
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

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
}]);