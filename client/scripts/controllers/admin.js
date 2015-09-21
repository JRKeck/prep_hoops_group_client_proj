prepHoopsApp.controller('AdminController', ['$scope', '$http', function($scope, $http){
    console.log("Admin Controller Loaded");

    // Object to hold fields from adminForm
    $scope.adminForm = {};
    // Object to hold fields from editForm
    $scope.editForm = {};
    // Array to hold sites returned from DB
    $scope.sites = [];
    $scope.sitesSelector = [];

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

    $scope.removeSite = function() {
        var site = this.site.siteShortName;
        var id = this.site._id;
        console.log("Remove Button Pressed for Site: " + site);
        console.log("Mongo ID: ", id);
        $http.delete('network/deletesite/' + id)
            .then(function(res, err){
                if (err) {
                    console.log("Error on Delete is: ", err);
                } else {
                    console.log("Delete Successful: ", res);
                    loadSites();
                }
            });
    };
    // Detect edit site selector change
    $scope.changedValue = function(item){
        if(item) {
            $scope.editForm.editShortName = item.siteShortName;
            $scope.editForm.editFullName = item.siteFullName;
            $scope.editForm.editRssURL = item.rssURL;
            $scope.editForm.editSiteID = item.siteID;
            $scope.editForm.editID = item._id;
        }
    };

    $scope.editSite = function(site) {
        var id = site.editID;
        $http.put('network/editsite/' + id, site)
            .then(function (err, res) {
                if (err.status != 200) {
                    console.log("Error on Edit is: ", err);
                } else {
                    $scope.editForm = {};
                    loadSites();
                }
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
                //console.log('loading sites');
                $scope.sites = res.data;
                $scope.sitesSelector = $scope.sites;
            });
    }

}]);