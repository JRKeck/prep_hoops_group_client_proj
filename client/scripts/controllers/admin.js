prepHoopsApp.controller('AdminController', ['$scope', '$http', function($scope, $http){
    console.log("Admin Controller Loaded");

    // Object to hold fields from adminForm
    $scope.adminForm = {};
    // Object to hold fields from editForm
    $scope.editForm = {};
    $scope.editFormName = '';
    $scope.editFormUrl = '';
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

    $scope.checkSite = function(reportName){
        console.log("Report Name: ", reportName);
        for (var i = 0; i < $scope.sites.length; i++){
            if (reportName == $scope.sites[i].siteShortName){
                $scope.editFormName = $scope.sites[i].siteFullName;
                $scope.editFormUrl = $scope.sites[i].rssURL;
                console.log("I'm in the if statement!", $scope.editFormName, $scope.editFormUrl);
            }
        }
    };

    $scope.updateSite = function(site){
        console.log("My current data: ", site);
        console.log("All Sites: ", $scope.sites);


    };

    $scope.removeSite = function() {
        var site = this.site.siteShortName;
        var id = this.site._id;
        console.log("Remove Button Pressed for Site: " + site);
        console.log("Mongo ID: ", id);
        $http.delete('network/deletesite/' + id)
            .then(function(err, res){
                if (err) {
                    console.log("Error on Delete is: ", err);
                } else {
                    console.log("Delete Successful: ", res);
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
                console.log('loading sites');
                $scope.sites = res.data;
            });
    }

}]);