prepHoopsApp.controller('AdminController', ['$scope', '$http', function($scope, $http){
    console.log("Admin Controller Loaded");

    $scope.addSiteForm = {};

    $scope.addNewSite = function(site){
        return $http.post('network/addsite', site)
            .then(function(){

            });
    };

}]);