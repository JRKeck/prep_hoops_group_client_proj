prepHoopsApp.controller('DashboardController', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.sites = ["Site1", "Site2"];
    $scope.dates = [{date: "9/11/15", sites:[{Site1:[{articles:[{title: "Hoops", author: "Sarah"}, {title: "Hoops2", author: "Suren"}]}], Site2:[{articles:[{title: "Hoops3", author: "Josh"}]}]}]}];

    $scope.go = function ( path ) {
        console.log('clicked!');
        $location.path( path );
    };

    $scope.click = function(){
        console.log('clicked!');
    };


}]);