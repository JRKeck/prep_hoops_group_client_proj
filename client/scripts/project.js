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




prepHoopsApp.factory('siteFullName', function(){
    var siteFullName = {};

    return {
        get : function(key){
            return siteFullName[key];
        },
        set : function(key, value){
            siteFullName[key]= value;
        }
    };
});

prepHoopsApp.controller('DropdownCtrl', ['$scope', '$rootScope', '$http', '$log', '$location', 'siteFullName', function ($scope, $rootScope, $http, $log, $location, siteFullName) {

    $scope.feeds = [];
    $scope.getFeeds = function(){
        $http.get('/network/getFeeds').
            success(function(data){
                $scope.feeds = data;
            });
    };
    $scope.getFeeds();

    $scope.go = function ( path ) {
        $scope.getFeeds();
        $location.path( path );
        $scope.selectedSite = this.site.siteFullName;
        siteFullName.set('siteFullName', this.site.siteFullName);
    };

    $scope.$watch('selectedSite', function () {

        $rootScope.$broadcast('siteChanged',

            $scope.selectedSite);

    });

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

}]);