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