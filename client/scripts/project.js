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

prepHoopsApp.controller("IndexCtrl", ["$scope", "$http", "userAuth",  "$location", function($scope, $http, userAuth, $location) {

    $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
        if (!value && oldValue) {
            console.log("Log Out");
            $scope.user = {};
            $location.path('/login');
        }
        if (value) {
            $scope.user = value;
        }
    }, true);

}]);

// factory for user object
prepHoopsApp.factory('userAuth', function(){
    var user;

    return {
        setUser : function(aUser){
            console.log('saving user to var user in the factory');
            user = aUser;
            console.log(user);
        },
        isLoggedIn : function(){
            console.log('authenticating user');
            return(user) ? user : false;
        }
    };
});