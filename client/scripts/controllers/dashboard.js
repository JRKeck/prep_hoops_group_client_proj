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



}]);