'use strict';
app.controller('proposalController', ['$scope', 'cityService', 'stateService', 'neighbourhoodService', 'categoryService', 'addressService', 'serviceService', 'customerService', 'proposalService', 'professionalService', 'appointmentService', '$location', '$timeout', 'authService', '$window', 'localStorageService', '$sce', '$filter', 'ngDialog', function ($scope, cityService, stateService, neighbourhoodService, categoryService, addressService, serviceService, customerService, proposalService, professionalService, appointmentService, $location, $timeout, authService, $window, localStorageService, $sce, $filter,ngDialog) {

    $scope.cities = [];
    $scope.states = [];
    $scope.categories = [];
    $scope.CityList = [];
    $scope.NeighbourList = [];
    $scope.AddressList = [];

    $scope.ServicesWithStatusOpened = [];

    $scope.Services = [];

    $scope.Clients = [];
    $scope.Professional={};
    $scope.ClientByID = {};
    $scope.Appiontments = [];
    $scope.sprovidercategory = {};

    $scope.ProposalSendedTillToday = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";

    stateService.getStates().then(function (results) {

        $scope.states = results.data;

    }, function (error) {
        //alert(error.data.message);
    });

    cityService.getCities().then(function (results) {

        $scope.cities = results.data;

    }, function (error) {
        //alert(error.data.message);
    });
    var data = {};
    categoryService.getCategories(data).then(function (results) {

        $scope.categories = results.data;

    }, function (error) {
        //alert(error.data.message);
    });

    $scope.getNeighboursFilter = function (cid) {
        neighbourhoodService.getNeighbourhoddByCity(cid).then(function (results) {

            $scope.NeighbourList = results;

        }, function (error) {
            //alert(error.data.message);
        });
    }



    $scope.getAddressFilter = function (nid) {
        addressService.getAddresseByNeighbourhood(nid).then(function (results) {

            $scope.AddressList = results.data;

        }, function (error) {
            //alert(error.data.message);
        });
    }




    $scope.getCitiesFilter = function (sid) {
        cityService.getCitiesByState(sid).then(function (results) {
            $scope.CityList = results;
        }, function (error) {
            //alert(error.data.message);
        });
    }

    serviceService.getServices(data).then(function (results) {
        $scope.Services = results.data;
        var servicelist = [];
        angular.forEach(results.data, function (item) {
            //if (item.status == 1) {

                servicelist.push(item);
            //}
        })

        $scope.ServicesWithStatusOpened = servicelist;
    })

    $scope.renderHtml = function (html_code) {
        return $sce.trustAsHtml(html_code);
    };
    

    customerService.getCustomers().then(function (results) {

        $scope.Clients = results.data;
    })

    appointmentService.getAppointments().then(function (results) {

        $scope.Appiontments = results.data;
    })

    $scope.getClientByID = function (cid) {
        customerService.getCustomers().then(function (results) {
            var clientlist = [];
            angular.forEach(results.data, function (item) {
                if (item.status == 1) {

                    clientlist.push(item);
                }
            })
            $scope.ClientByID = clientlist[0];
        })

    }


    professionalService.getProfessionalByEmail(data).then(function (results) {
        var result = [];
        var username = authService.authentication.userName;
        angular.forEach(results.data, function (item) {
            if (item.email == username) {

                result.push(item);
            }
        })
            $scope.Professional = result[0];

    })

    
    


    $scope.myquote = {};
    $scope.isclicked = true;
    $scope.send = function (item) {
        var serviceid = item.attributes['data-id'].value;
        alert($scope.myquote.appoint);
        var username = authService.authentication.userName;
       
        var quotedata = {
            "service_Id": serviceid,
            "visitValue": $scope.myquote.amount,
            "appointment_Id": $scope.myquote.appoint,
            "serviceProvider_Id": $scope.Professional.serviceProvider_Id,
            "status":0,
            "createdBy":username,
            "createdOn": $filter('date')(new Date(), "yyyy-MM-dd"),
            "createdAt":null,
            "modifiedBy":null,
            "modifiedOn":null,
            "modifiedAt":null
        };


        proposalService.postProposal(quotedata).then(function (response) {
            //do login after registration
            $scope.savedSuccessfully = true;
            $scope.message = "Your proposal has been posted successfully.";
            startTimer();
        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = "Failed to post job due to:" + errors.join(' ');
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $window.location.href = '#/pro/sendproposalsuccess';
        }, 2000);
    }

    //clickToOpenSendProposal
    
    $scope.clickToOpenSendProposal = function (item) {
        $scope.sendServiceid = item.attributes['data-id'].value;
        $scope.sendServiceidplus = parseInt(item.attributes['data-id'].value,10) + 1;

        ngDialog.open({
            template: '/app/views/sendproposal.html',
            scope: $scope,
            controller: 'sendproposalController'
        });
    };



    //dashboard setup

    proposalService.getProposal(data).then(function (results) {

        var proposallist = [];
        angular.forEach(results.data, function (item) {
            if (item.createdBy == authService.authentication.userName) {

                proposallist.push(item);
            }
        })

        $scope.ProposalSendedTillToday = proposallist;
    })


    $scope.isrowFirst = function (item, index) {
        if (index == 0) {
            return true;
        }
        else
        return false;
    };


    $scope.FormatDate=function(date)
    {
        return $filter('date')(date, "MMMM-dd");
    }

    $scope.pageChangeHandler = function (num) {
        console.log('meals page changed to ' + num);
    };

    //paging setup
    $scope.currentPage = 1;
    $scope.pageSize = 10;
}]);






