prepHoopsApp.controller('LoginController', ['$scope', '$http', '$location', function($scope, $http, $location){
    console.log("Login Controller Loaded");

    $scope.loginForm = {};

    $scope.login = function(user){
        return $http.post('/userauth/login', user)
            .success(function(user){
                console.log('login success, return user object from login controller: ');
                console.log(user);
                userAuth.setUser(user);
                $location.path('/dashboard');
            })
            .error(function(err){
                console.log('Login Error');
                $scope.loginForm = {};
                $scope.error_message = 'Username or Password is Incorrect';
            });

    };
}]);