prepHoopsApp.controller('AdminController', ['$scope', '$http', function($scope, $http){
    console.log("Admin Controller Loaded");

    // Object to hold fields from adminForm
    $scope.adminForm = {};
    // Array to hold sites returned from DB
    $scope.sites = [];

    // Var to hold value of last siteID in the DB
    var lastSiteID;

    loadSites();

    $scope.assignSiteID = function(){
        return $http.get('network/lastid')
            .then(function(data){
                lastSiteID = data.data.siteID;
                if(!lastSiteID) lastSiteID = 0;
                $scope.adminForm.siteID = lastSiteID + 1;
                addNewSite($scope.adminForm)
            });
    };

    function addNewSite(site){
        $http.post('network/addsite', site)
                .then(function(){
                    $scope.adminForm = {};
                    loadSites();
                });
    }

    function loadSites(){
        $http.get('network')
            .then(function(res){
                console.log('loading sites');
                $scope.sites = res.data;
            });
    }

}]);