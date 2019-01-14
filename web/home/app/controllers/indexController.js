'use strict';
app.controller('indexController', ['$scope', '$location', '$window', 'authService', 'proposalService', 'professionalService','ngDialog', function ($scope, $location, $window, authService, proposalService, professionalService,ngDialog) {

    $scope.logOut = function () {
        authService.logOut();
        $window.location = '/';
    }

    

    $scope.authentication = authService.authentication;
    var data = {};
    proposalService.getProposal(data).then(function (presults) {
        var prof = "";
        professionalService.getProfessionals(data).then(function (results) {
            var username = authService.authentication.userName;
            angular.forEach(results.data, function (item) {
                if (item.email == username) {
                    
                    prof = item.serviceProvider_Id;
                    var result = [];
                    var proposalsended = 0;
                    var username = authService.authentication.userName;
                    angular.forEach(presults.data, function (item) {
                        if (item.serviceProvider_Id == item.serviceProvider_Id) {
                            result = [];
                            proposalsended = proposalsended + 1;
                            result.push({ proposalsended: proposalsended });
                        }
                    })
                    $scope.proposalsended = result[0];
                }
            })
        })

       

    })

}]);