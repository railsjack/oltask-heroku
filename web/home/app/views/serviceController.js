'use strict';
app.controller('serviceController', ['$scope', 'cityService', 'stateService', 'neighbourhoodService', 'categoryService', 'addressService', 'serviceService', 'proposalService', 'professionalService', 'appointmentService', 'reviewService', 'customerService', '$location', '$timeout', 'authService', '$window', 'localStorageService', '$filter', 'ngDialog', function ($scope, cityService, stateService, neighbourhoodService, categoryService, addressService, serviceService, proposalService, professionalService, appointmentService, reviewService,customerService, $location, $timeout, authService, $window, localStorageService, $filter, ngDialog) {
    $scope.authService.authentication.userRoll = authService.authentication.userRoll;
    $scope.customerid ="";
    $scope.cities = [];
    $scope.states = [];
    $scope.categories = [];
    $scope.CityList = [];
    $scope.NeighbourList = [];
    $scope.AddressList = [];

    $scope.ServicesPostedTillToday = [];
    $scope.Proposals = [];
    $scope.Professionals = [];

    $scope.Appointments = [];

    $scope.job = {};

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.savedSuccessfully1 = false;
    $scope.message1 = "";

    $scope.savedSuccessfully2 = false;
    $scope.message2 = "";

    var email = authService.authentication.userName;
    customerService.getCustomerByEmail(email).then(function (results) {
        angular.forEach(results.data, function (item) {
            if (item.email == email) {

                $scope.customerid = item.customer_Id;
            }


        })
        

    }, function (error) {
        //alert(error.data.message);
    });

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


    

    $scope.jobdetail = {};
    $scope.submitted = false;
    $scope.isclicked = true;

    $scope.submitted1 = false;
    $scope.isclicked1 = true;

    $scope.submitted2 = false;
    $scope.isclicked2 = true;

    $scope.newAddressFields = false;
    
    $scope.stateChanged = function () {
        if ($scope.jobdetail.radioEnterAddress) { //If it is checked
            $scope.newAddressFields = true;
        }
        else
        {
            $scope.newAddressFields = false;
        }
    }

    
    $scope.postjob = function (formvalid) {
       
        $scope.submitted = true;
        if (!formvalid) {
            $scope.message = "Please correct folloing information.";
            return;
        }
        var username = authService.authentication.userName;
        
        var urgent = false;
        if ($scope.jobdetail.urgent)
        {
            urgent=true;
        }
        var jobdata = {
            
            "customer_Id": $scope.customerid,
            "title": $scope.jobdetail.title,
            "description": $scope.jobdetail.description,
            "categorie_Id": $scope.jobdetail.category.categorie_Id,
            "urgent": urgent,
            "status": 1,
            "address_Id": $scope.jobdetail.address.address_Id,
            "createdBy": username,
            "createdOn": new Date(),
            "createdAt": null,
            "modifiedBy": null,
            "modifiedOn": null,
            "modifiedAt": null


        };


       
            $scope.savedSuccessfully = true;

            var datawithnewaddress = {
                "Service": {
                    "Customer_Id": $scope.customerid,
                    "Title": $scope.jobdetail.title,
                    "Description": $scope.jobdetail.description,
                    "Categorie_Id": $scope.jobdetail.category.categorie_Id
                },
                "Schedules": [{
                    "StartAt": $scope.jobdetail.stratAtSchedule1,
                    "EntAt": $scope.jobdetail.endAtSchedule1,
                    "Scheduled": 0
                },
                 {
                     "StartAt": $scope.jobdetail.stratAtSchedule2,
                     "EntAt": $scope.jobdetail.endAtSchedule2,
                     "Scheduled": 0
                 }],

                "Address": {
                    "Street": $scope.jobdetail.enterStreet,
                    "Number": $scope.jobdetail.enterNumber
                }
            };
            

           

            if ($scope.newAddressFields == false)
            {
                datawithnewaddress = {
                    "Service": {
                        "Customer_Id":$scope.customerid,
                        "Title": $scope.jobdetail.title,
                        "Description": $scope.jobdetail.description,
                        "Categorie_Id": $scope.jobdetail.category.categorie_Id
                    },
                    "Schedules": [{
                        "StartAt": $scope.jobdetail.stratAtSchedule1,
                        "EntAt": $scope.jobdetail.endAtSchedule1,
                        "Scheduled": 0
                    },
                     {
                         "StartAt": $scope.jobdetail.stratAtSchedule2,
                         "EntAt": $scope.jobdetail.endAtSchedule2,
                         "Scheduled": 0
                     }],

                    "Address": {
                        "Address_Id": $scope.jobdetail.address.address_Id
                    }

                };
            }

            serviceService.postServiceScheduleAddress(datawithnewaddress).then(function (response) {
                $scope.message = "Your Job has been posted successfully.";
                startTimer();

            })

           
       
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $window.location.href = '#/cst';
        }, 2000);
    }

    //dashboard set up

    serviceService.getServices(data).then(function (results) {
       
        var username = authService.authentication.userName;
        var servicelist = [];
        angular.forEach(results.data, function (item) {
            if (item.customer_Id == $scope.customerid) {

                servicelist.push(item);
            }
        })

        $scope.ServicesPostedTillToday = servicelist;
    })


    proposalService.getProposal(data).then(function (results) {

        $scope.Proposals = results.data;
    })

    appointmentService.getAppointments(data).then(function (results) {

        $scope.Appointments = results.data;
    })


    professionalService.getProfessionals(data).then(function (results) {

        $scope.Professionals = results.data;
    })

    $scope.isrowFirst = function (item, index) {
        if (index == 0) {
            return true;
        }
        else
            return false;
    };

    $scope.FormatDate = function (date) {

        return $filter('date')(date, "MMMM-dd");
    }

    //paging setup

    $scope.pageChangeHandler = function (num) {
        console.log('meals page changed to ' + num);
    };

    $scope.currentPage = 1;
    $scope.pageSize = 10;

    //openCreateAppointmentPopup
    $scope.openCreateAppointmentPopup=function(){
        ngDialog.open({
            template: '/app/views/cst/createAppoinment.html',
            scope: $scope
        });
    }

    $scope.clickToOpenLocationInfo = function (item) {
        $scope.proposal = item.attributes['data-proposal'].value;
       
        $scope.proposalid = item.attributes['data-proposalid'].value;

        ngDialog.open({
            template: '/app/views/cst/createAppoinment.html',
            scope: $scope
        });
    };

    $scope.openmarkcomplete = function (item) {
        $scope.seviceid = item.attributes['data-seviceid'].value;
        ngDialog.open({
            template: '/app/views/cst/confirmcomplete.html',
            scope: $scope
        });
    }

    $scope.opencancel = function (item) {
        $scope.seviceid = item.attributes['data-seviceid'].value;
        ngDialog.open({
            template: '/app/views/cst/confirmcancel.html',
            scope: $scope
        });
    }


    //select a proposal
    $scope.appointmentdata = {};
    $scope.issaved = false;
    $scope.createAppointment = function (item) {
        proposalService.getProposalById($scope.proposalid).then(function (results) {
            
            var sid = results.data[0].service_Id;

            var professionaldata = {
                "quote_Id": results.data[0].quote_Id, "service_Id": results.data[0].service_Id, "visitValue": results.data[0].visitValue, "appointment_Id": results.data[0].appointment_Id, "serviceProvider_Id": results.data[0].serviceProvider_Id, "status": 1, "createdBy": results.data[0].createdBy, "createdOn": results.data[0].createdOn, "createdAt": results.data[0].createdAt, "modifiedBy": results.data[0].modifiedBy, "modifiedOn": results.data[0].modifiedOn, "modifiedAt": results.data[0].modifiedAt
            };

            proposalService.putProposal(professionaldata, $scope.proposalid).then(function (results) {

                serviceService.getServiceById(sid).then(function (results) {
                   
                    var service = {
                        "service_Id": results.data[0].service_Id, "customer_Id": results.data[0].customer_Id, "title": results.data[0].title, "description": results.data[0].description, "categorie_Id": results.data[0].categorie_Id, "urgent": results.data[0].urgent, "address_Id": results.data[0].address_Id, "createdBy": results.data[0].createdBy, "createdOn": results.data[0].createdOn, "createdAt": results.data[0].createdAt, "modifiedBy": results.data[0].modifiedBy, "modifiedOn": results.data[0].modifiedOn, "modifiedAt": results.data[0].modifiedAt, "status": 2
                    };
                    serviceService.putService(service, sid).then(function (results) {
                        $scope.savedSuccessfully = true;
                        $scope.message = "Proposal has been selected successfully.";
                        $scope.issaved = true;
                    })



                    
                })

               
            });

        })
        
        
        
    };


    //mark job as complete

    $scope.markcomplete = function (item) {

        serviceService.getServiceById($scope.seviceid).then(function (results) {


            var service = {
                "service_Id": results.data[0].service_Id, "customer_Id": results.data[0].customer_Id, "title": results.data[0].title, "description": results.data[0].description, "categorie_Id": results.data[0].categorie_Id, "urgent": results.data[0].urgent, "address_Id": results.data[0].address_Id, "createdBy": results.data[0].createdBy, "createdOn": results.data[0].createdOn, "createdAt": results.data[0].createdAt, "modifiedBy": results.data[0].modifiedBy, "modifiedOn": results.data[0].modifiedOn, "modifiedAt": results.data[0].modifiedAt, "status": 3
            };
            serviceService.putService(service, $scope.seviceid).then(function (results) {
                $scope.savedSuccessfully = true;
                $scope.message1 = "Service has been marked as complete successfully.";
                $scope.issaved1 = true;
            })

        })
    }


    //can job

    $scope.markcancel = function (item) {

        serviceService.getServiceById($scope.seviceid).then(function (results) {
            var service = {
                "service_Id": results.data[0].service_Id, "customer_Id": results.data[0].customer_Id, "title": results.data[0].title, "description": results.data[0].description, "categorie_Id": results.data[0].categorie_Id, "urgent": results.data[0].urgent, "address_Id": results.data[0].address_Id, "createdBy": results.data[0].createdBy, "createdOn": results.data[0].createdOn, "createdAt": results.data[0].createdAt, "modifiedBy": results.data[0].modifiedBy, "modifiedOn": results.data[0].modifiedOn, "modifiedAt": results.data[0].modifiedAt, "status": 4
            };
            serviceService.putService(service, $scope.seviceid).then(function (results) {
                $scope.savedSuccessfully = true;
                $scope.message2 = "Service has been closed successfully.";
                $scope.issaved2 = true;
            })
        })
    }

}]);






