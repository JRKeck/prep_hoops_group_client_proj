prepHoopsApp.controller('DashboardController', ['$scope', '$http', function($scope, $http){
    $scope.sites = ["Site1", "Site2"];
    $scope.dates = [{date: "9/11/15", sites:[{Site1:[{articles:[{title: "Hoops", author: "Sarah"}, {title: "Hoops2", author: "Suren"}]}], Site2:[{articles:[{title: "Hoops3", author: "Josh"}]}]}]}];



}]);