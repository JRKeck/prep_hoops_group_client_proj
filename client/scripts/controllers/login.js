prepHoopsApp.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location){
    console.log("Login Controller Loaded");

    $scope.loginForm = {};

    $scope.login = function(user){
        return $http.post('/userauth/login', user)
            .success(function(user){
                //$rootScope.authenticated = true;
                //$rootScope.current_user = "james";
                console.log('login success');
                $location.path('/dashboard');
            })
            .error(function(err){
                console.log('Login Error');
                $scope.error_message = 'Username or Password is Incorrect';
            });

    };
}]);