prepHoopsApp.controller('DashboardController', ['$scope', '$http', '$location', function($scope, $http, $location){

    //Hard-coded data for testing purposes
    $scope.sites = ["Site1", "Site2"];
    $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $scope.dates = [{date: "9/11/15", sites:[{Site1:[{articles:[{title: "Hoops", author: "Sarah"}, {title: "Hoops2", author: "Suren"}]}], Site2:[{articles:[{title: "Hoops3", author: "Josh"}]}]}]}];

    //Not yet working code to get day of the week for specified date
    $scope.getDayOfWeek = function(date){
            $scope.dayOfWeek = date.getDay();
            console.log($scope.dayOfWeek);
    };

    //Function to make admin button redirect to admin page
    $scope.go = function ( path ) {
        $location.path( path );
    };


    //Code for DatePicker
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.open = function($event) {
        $scope.status.opened = true;
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

    }
}]);