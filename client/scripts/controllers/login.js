prepHoopsApp.controller('LoginController', ['$scope', '$http', function($scope, $http){
    console.log("Login Controller Loaded");

    $scope.loginForm = {};

    $scope.login = function(user){
        return $http.post('/userauth/login', user)
            .then(function(response){
                if (response.status !== 200){
                    alert('error logging in!');
                } else {
                    $scope.loginForm = {};
                    $scope.registerFlag = false;
                    $scope.loginFlag = false;
                    $scope.logoutFlag = true;
                    $scope.username = response.config.data.username;
                    properties.set('username', $scope.username);
                    return $scope.username;
                }
            });
    };

}]);