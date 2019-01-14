'use strict';
app.controller('scheduleController', ['$scope', 'serviceService', 'proposalService', 'professionalService', 'appointmentService', 'customerService', 'reviewService', 'addressService', '$location', '$timeout', 'authService', '$window', 'localStorageService', '$filter', 'ngDialog', function ($scope, serviceService, proposalService, professionalService, appointmentService, customerService, reviewService,addressService, $location, $timeout, authService, $window, localStorageService, $filter, ngDialog) {

    $scope.ServicesPostedTillToday = [];
    $scope.ServicesIsInprogress = [];
    $scope.Proposals = [];
    $scope.ProposalsPostedTillToday = [];
    $scope.ProposalSelectedForThisPro = [];
    $scope.Professionals = [];
    $scope.Schedules = [];
    $scope.Services = [];
    $scope.Customers = [];
    $scope.Starvalue = [];
    $scope.Address=[];
    $scope.savedSuccessfully = false;
    $scope.message = "";

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $window.location.href = '#/cst';
        }, 2000);
    }
    var data={};
    appointmentService.getAppointments(data).then(function (results) {
        $scope.Schedules = results.data;


    })
    
    addressService.getAddresses(data).then(function (results) {
        $scope.Address = results.data;


    })

    proposalService.getProposal(data).then(function (results) {
        $scope.Proposals = results.data;
    })

    

    serviceService.getServices(data).then(function (results) {
       
        var username = authService.authentication.userName;
        var servicelist = [];
       
        angular.forEach(results.data, function (item) {
            if (item.createdBy == username) {
                if (item.status==2) {
                    servicelist.push(item);
                }
               
            }
        })
        $scope.ServicesPostedTillToday = servicelist;
       
    })


    proposalService.getProposal(data).then(function (results) {
        var username = authService.authentication.userName;
        var list = [];
        var listselected = [];
        angular.forEach(results.data, function (item) {
            if (item.createdBy == username) {

                list.push(item);
                if (item.status == 1) {
                    listselected.push(item);
                }
                
            }
        })

        $scope.ProposalsPostedTillToday = list;
        $scope.ProposalSelectedForThisPro = listselected;
    })


    professionalService.getProfessionals(data).then(function (results) {

        $scope.Professionals = results.data;
    })

    serviceService.getServices(data).then(function (results) {

        $scope.Services = results.data;
    })

    customerService.getCustomers(data).then(function (results) {
        $scope.Customers = results.data;
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

    $scope.staroptions = [{
        value: '1',
        label: 'One'
    }, {
        value: '2',
        label: 'Two'
    },
    {
        value: '3',
        label: 'Three'
    },
    {
        value: '4',
        label: 'Four'
    },
    {
        value: '5',
        label: 'Five'
    }

    ];

    $scope.openReviewPopup = function (item) {
        $scope.serviceid = item.attributes['data-serviceid'].value;
        $scope.providerid = item.attributes['data-serviceproviderid'].value;
        $scope.customerid = item.attributes['data-customerid'].value;
        $scope.reviewtype = item.attributes['data-reviewtype'].value;
        
        ngDialog.open({
            template: '/app/views/submitreview.html',
            scope: $scope,
            controller: 'reviewController'
        });
    };
      
    //open profile
    $scope.openProfile = function (id, type) {
       
        $scope.id = id;
        $scope.type = type;
        ngDialog.open({
            template: '/app/views/viewprofile.html',
            scope: $scope,
            controller: 'viewprofileController'
            
        });
    };


    //update appointment
    $scope.update = function (item) {
        var aid = item.attributes['data-id'].value;
        var serviceid = item.attributes['data-serviceid'].value
       
        var appintdata = {
            "appointment_Id":aid,
            "service_Id": item.attributes['data-serviceid'].value,
            "scheduled":true
        };
        appointmentService.putAppointments(appintdata, aid).then(function (results) {
            
           
        })
        
        
    };

    //reviews
    $scope.getReviewByProviderId = function (pid) {
       
        reviewService.getReviews(data).then(function (results) {
            var list = [];
            var star = .1;
            var count = .1;
            angular.forEach(results.data, function (item) {
                if (item.createdBy != pid) {
                    
                    if (item.serviceProvider_Id == pid)
                    {
                        if (item.score > 0) {
                            count = count + 1;
                            star = star + item.score;
                        }
                        list = [];
                        list.push({ "stars": star / count });
                    }
                }
            })
            $scope.Starvalue = list;
            
        })
        
    }


    $scope.getReviewByCustomerId = function (cid) {

        reviewService.getReviews(data).then(function (results) {
            var list = [];
            var star = .1;
            var count = .1;
            angular.forEach(results.data, function (item) {
                if (item.createdBy != cid) {
                    if (item.customer_Id == cid) {
                        if (item.score > 0) {
                            count = count + 1;
                            star = star + item.score;
                        }
                        list = [];
                        list.push({ "stars": star / count });
                    }
                }
            })

            //$scope.Starvalue = list;
        })

    }

}]);






