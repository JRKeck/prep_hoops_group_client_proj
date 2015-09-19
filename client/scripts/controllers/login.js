prepHoopsApp.controller('LoginController', ['$scope', '$http', '$location', 'AuthService', function($scope, $http, $location, AuthService){
    console.log("Login Controller Loaded");

    $scope.loginForm = {};

    //$scope.login = function(user){
    //    return $http.post('/userauth/login', user)
    //        .success(function(user){
    //            console.log('login success, return user object from login controller: ');
    //            console.log(user);
    //            userAuth.setUser(user);
    //            $location.path('/dashboard');
    //        })
    //        .error(function(err){
    //            console.log('Login Error');
    //            $scope.loginForm = {};
    //            $scope.error_message = 'Username or Password is Incorrect';
    //        });
    //
    //};

    $scope.login = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;
        console.log($scope.loginForm.username + $scope.loginForm.password);


        // call login from service
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
            // handle success
            .then(function () {

                $location.path('/dashboard');
                $scope.disabled = false;
                $scope.loginForm = {};
            })
            // handle error
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "Invalid username and/or password";
                $scope.disabled = false;
                $scope.loginForm = {};
            });

    };

    $scope.logout = function () {

        console.log(AuthService.getUserStatus());

        // call logout from service
        AuthService.logout()
            .then(function () {
                $location.path('/login');
            });

    };


}]);

