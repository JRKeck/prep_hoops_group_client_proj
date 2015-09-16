prepHoopsApp.controller('AdminController', ['$scope', '$http', function($scope, $http){
    console.log("Admin Controller Loaded");

    $scope.adminForm = {};

    //$scope.addNewSite = function(site){
    //    return $http.post('network/addsite', site)
    //        .then(function(){
    //            $scope.adminForm = {};
    //            console.log('Site Added');
    //        });
    //};

    $scope.addNewSite = function(site){
        return $http.get('network/lastid', site)
            .then(function(data){
                $scope.adminForm = {};
                console.log(data);
                console.log(data.data.siteID);

            });
    };

}]);

//$scope.update = function(register){
//    $http.get('/userApi/adminuser').then(function(response){
//        if (response.status !== 200) {
//            throw new Error("Failed to retrieve users from server API");
//        }
//        var newMemberIdNumber = 0;
//        if (response.data.length === 0) {
//            newMemberIdNumber = 1;
//        } else {
//            var numberOfUsers = response.data.length;
//            newMemberIdNumber = response.data[numberOfUsers-1].memberId + 1;
//        }
//        console.log("New Member ID #: ", newMemberIdNumber);
//        $scope.register.memberId = newMemberIdNumber;
//        $scope.register.rides = [];
//        $scope.register.role ='user';
//        $scope.register.status = 'active';
//
//        $http.post('/registerApi/register', $scope.register).then(function(response){
//            alert("Your account was created successfully!");
//            $location.path('/calendar');
//        });
//    });
//};