prepHoopsApp.controller('LoginController', ['$scope', '$http', function($scope, $http){
    console.log("Login Controller Loaded");
     $scope.login = function(){
        var data = {
            username: $scope.username,
            password: $scope.password
        };

        console.log("Login Submit Button Clicked!  Post Called", data);
        $http.post('/userApi/login', data).then(function(){
            $http.get('/userApi/name').then(function(response) {
                console.log(response);
            });
        });
    };




}]);