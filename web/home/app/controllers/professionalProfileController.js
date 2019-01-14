'use strict';
app.controller('professionalProfileController', ['$scope', 'cityService', 'stateService', 'neighbourhoodService', 'categoryService', 'addressService', 'serviceService', 'customerService', 'proposalService', 'professionalService', 'customerAddressService', '$location', '$timeout', 'authService', '$window', 'localStorageService', '$sce', '$filter', 'professionalAddressService', 'ngDialog', function ($scope, cityService, stateService, neighbourhoodService, categoryService, addressService, serviceService, customerService, proposalService, professionalService, customerAddressService, $location, $timeout, authService, $window, localStorageService, $sce, $filter, professionalAddressService, ngDialog) {

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
    $scope.ProfessionalByEmail = {};
    $scope.ClientAddresses = [];
    $scope.ProfessionalAddresses = [];
    $scope.Addresses = [];
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
            if (item.status == 1) {

                servicelist.push(item);
            }
        })

        $scope.ServicesWithStatusOpened = servicelist;
    })

    $scope.renderHtml = function (html_code) {
        return $sce.trustAsHtml(html_code);
    };
    

    customerService.getCustomers().then(function (results) {

        $scope.Clients = results.data;
    })

  
    professionalService.getProfessionals().then(function (results) {
            var clientlist = [];
            var username = authService.authentication.userName;
            angular.forEach(results.data, function (item) {
                if (item.email == username) {

                    clientlist.push(item);
                }
            })
            $scope.ProfessionalByEmail = clientlist[0];
        })



    professionalService.getProfessionals(data).then(function (results) {
        var result = [];
        var username = authService.authentication.userName;
        angular.forEach(results.data, function (item) {
            if (item.email == username) {

                result.push(item);
            }
        })
            $scope.Professional = result[0];

    })
    

    customerService.getCustomers(data).then(function (results) {
        var result = [];
        var username = authService.authentication.userName;
        angular.forEach(results.data, function (item) {
            if (item.email == username) {

                result.push(item);
            }
        })
        $scope.ClientByEmail = result[0];

    })

    professionalAddressService.getProfessionalAddresses(data).then(function (results) {
       
        $scope.ProfessionalAddresses = results.data;

    })
    
    addressService.getAddresses(data).then(function (results) {
       
        $scope.Addresses = results.data;

    })

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $window.location.href = '#/pro/sendproposalsuccess';
        }, 2000);
    }



    //dashboard setup

   
    $scope.FirstOrDefault = function (items,field, value) {
        var list = [];
        angular.forEach(items, function (item) {
            if (item.field == value) {

                list.push(item);
            }
        })

        return list[0];
    };


    $scope.Filtered = function (items, field, value) {
        var list = [];
        angular.forEach(items, function (item) {
            if (item.field == value) {

                list.push(item);
            }
        })

        return list;
    };

    $scope.isrowFirst = function (item, index) {
        if (index == 0) {
            return true;
        }
        else
        return false;
    };


    $scope.FormatDate=function(date)
    {
        return $filter('date')(date, "MMMM-dd-yyyy");
    }

    $scope.pageChangeHandler = function (num) {
        console.log('meals page changed to ' + num);
    };

    //dialod
    $scope.clickToOpen = function () {
        ngDialog.open({
            template: '/app/views/editbasicprofile.html',
            scope: $scope
            //controller: ['$scope', 'cityService', 'stateService', 'neighbourhoodService', 'categoryService', 'addressService', 'serviceService', 'customerService', 'proposalService', 'professionalService', 'customerAddressService', '$location', '$timeout', 'authService', '$window', 'localStorageService', '$sce', '$filter', 'professionalAddressService', 'ngDialog', function ($scope, cityService, stateService, neighbourhoodService, categoryService, addressService, serviceService, customerService, proposalService, professionalService, customerAddressService, $location, $timeout, authService, $window, localStorageService, $sce, $filter, professionalAddressService, ngDialog){
            //    $scope: $scope;
            //}]

        });
    };

    $scope.clickToOpenLocationInfo = function () {
        ngDialog.open({
            template: '/app/views/editlocationprofile.html',
            scope: $scope
        });
    };

    //put professional 
    $scope.registration = {};
   
    var professionaldata = {
        "serviceProvider_Id":14,
        "name": "new",
        "phone": 454646565,
        "modifiedBy": null,
        "modifiedOn": null,
        "modifiedAt": null,

        
        "rg": null,
        "cpf":null,
        "photo":null,
        "email": "pro035@gmail.com",
        "presentation":null,
        "user_Id":"f4e06fdd-464a-457a-8925-07cee31f6101",
        "createdBy":"pro035@gmail.com",
        "createdOn":null,
        "createdAt":null
        

    };
    $scope.putProfessional = function () {
        $scope.message = "clicked";
        
        alert($scope.registration.serviceProvider_Id + "//" + $scope.registration.name + "//" + professionaldata.serviceProvider_Id);
        professionalService.putProfessional(professionaldata, $scope.registration.serviceProvider_Id).then(function (results) {

            $scope.message = "Information updated successfully.";

        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = "Failed to register user due to:" + errors.join(' ');
         }
        )
    }

}]);






