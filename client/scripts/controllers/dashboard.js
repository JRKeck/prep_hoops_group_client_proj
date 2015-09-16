prepHoopsApp.controller('DashboardController', ['$scope', '$http', '$location', function($scope, $http, $location){

    //Hard-coded data for testing purposes
    $scope.sites = ["Site1", "Site2"];
    $scope.daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    $scope.dates = [{date: "9/11/15", sites:[{Site1:[{articles:[{title: "Hoops", author: "Sarah"}, {title: "Hoops2", author: "Suren"}]}], Site2:[{articles:[{title: "Hoops3", author: "Josh"}]}]}]},
        {date: "9/12/15", sites:[{Site1:[{articles:[{title: "Hoops", author: "Sarah"}, {title: "Hoops2", author: "Suren"}]}], Site2:[{articles:[{title: "Hoops3", author: "Josh"}]}]}]},
        {date: "9/13/15", sites:[{Site1:[{articles:[{title: "Hoops", author: "Sarah"}, {title: "Hoops2", author: "Suren"}]}], Site2:[{articles:[{title: "Hoops3", author: "Josh"}]}]}]},
        {date: "9/14/15", sites:[{Site1:[{articles:[{title: "Hoops", author: "Sarah"}, {title: "Hoops2", author: "Suren"}]}], Site2:[{articles:[{title: "Hoops3", author: "Josh"}]}]}]}
    ];

    //Not yet working code to get day of the week for specified date
    $scope.getDayOfWeek = function(date){
            $scope.dayOfWeek = date.getDay();
            console.log($scope.dayOfWeek);
    };

    //Function to make admin button redirect to admin page
    $scope.go = function ( path ) {
        $location.path( path );
    };

    //Function to call RSS feed dump into database
    $scope.getRSS = function (firstDate, lastDate){
        console.log(firstDate, lastDate);
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

    $scope.getRSS = function() {
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

    }
}]);