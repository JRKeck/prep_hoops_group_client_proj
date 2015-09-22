var prepHoopsApp = angular.module('prepHoopsApp', ['ngRoute', 'ui.bootstrap', 'appControllers']);

var appControllers = angular.module('appControllers', []);

prepHoopsApp.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login', {
            templateUrl: '/assets/views/routes/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: '/assets/views/routes/register.html',
            controller: 'RegisterController'
        })
        .when('/admin', {
            templateUrl: '/assets/views/routes/admin.html',
            controller: 'AdminController'
        })
        .when('/dashboard', {
            templateUrl: '/assets/views/routes/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/site', {
            templateUrl: '/assets/views/routes/site.html',
            controller: 'SiteController'
        })
        .otherwise({
            redirectTo: "/login"
        });
}]);

//
prepHoopsApp.factory('AuthService',
    ['$q', '$timeout', '$http',
        function ($q, $timeout, $http) {

            // create user variable
            var user = false;

            // return available functions for use in controllers
            return ({
                isLoggedIn: isLoggedIn,
                getUserStatus: getUserStatus,
                login: login,
                logout: logout,
                user: user
            });

            function isLoggedIn() {
                if(user) {
                    return true;
                } else {
                    return false;
                }
            }

            function getUserStatus() {
                return user;
            }

            function login(username, password) {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a post request to the server
                $http.post('/userauth/login', {username: username, password: password})
                    // handle success
                    .success(function (data, status) {
                        if(status === 200 && data.status){
                            console.log('success');
                            user = true;
                            deferred.resolve();
                        } else {
                            user = false;
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        console.log('error');
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }

            function logout() {

                // create a new instance of deferred
                var deferred = $q.defer();

                // send a get request to the server
                $http.get('/userauth/logout')
                    // handle success
                    .success(function (data) {
                        user = false;
                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });

                // return promise object
                return deferred.promise;

            }
        }]);

prepHoopsApp.run(['$rootScope', '$location', '$route', 'AuthService', function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (AuthService.isLoggedIn() === false) {
            $location.path('/login');
        }
    });
}]);

prepHoopsApp.factory('siteFullName', function(){
    var siteFullName = {};

    return {
        get : function(key){
            //console.log(siteFullName[key]);
            return siteFullName[key];
        },
        set : function(key, value){
            //console.log('value');
            siteFullName[key]= value;
        }
    };
});
