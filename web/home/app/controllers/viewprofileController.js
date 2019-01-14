'use strict';
app.controller('viewprofileController', ['$scope', 'categoryService', 'professionalService', 'reviewService', 'professionalAddressService', 'addressService', 'neighbourhoodService', 'professionalCategoryService', 'proposalService', 'appointmentService', 'serviceService', 'customerService', 'customerAddressService', '$location', '$timeout', 'authService', '$window', function ($scope, categoryService, professionalService, reviewService, professionalAddressService, addressService, neighbourhoodService, professionalCategoryService, proposalService, appointmentService, serviceService, customerService,customerAddressService, $location, $timeout, authService, $window) {

    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.categoryies = [];
    $scope.registration = {};
    $scope.Profile = {};
    $scope.address = {};
    $scope.neighbourhood = {};
    $scope.category = {};
    $scope.StarvaluePro = [];
    $scope.StarvalueCst = [];
    $scope.TaskCompleted = [];
    $scope.JobPosted = [];
    var data = {};
    if ($scope.type == 'c') {
        customerService.getCustomerByID($scope.id).then(function (response) {
            $scope.Profile = response.data;
            serviceService.getServices(data).then(function (services) {
                var list = [];
                angular.forEach(services.data, function (item) {
                    if (item.customer_Id == $scope.id) {
                        list.push(item[0]);

                    }
                })
                $scope.JobPosted = list;
            })

            customerAddressService.getCustomerAddressesByCId($scope.id).then(function (response) {
                $scope.address = response.data;
                neighbourhoodService.getNeighbourhoddById(1).then(function (neighbour) {
                    $scope.neighbourhood = neighbour;
                })
            })


            //get star values

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

                    $scope.StarvalueCst = list;
                })

            }


        })
    }
    else if ($scope.type == 'p')
    {
        professionalService.getProfessionalById($scope.id).then(function (response) {
            $scope.Profile = response.data;

            professionalCategoryService.getProfessionalCategoryById($scope.id).then(function (results) {
                
                categoryService.getCategoryById(results.data[0].categories_Id).then(function(category){
                    $scope.category = category.data;
                })
            })


            proposalService.getProposal(data).then(function (results) {
                var list = [];
                angular.forEach(results.data, function (item) {
                    if (item.serviceProvider_Id == $scope.id) {
                        appointmentService.getAppointments(data).then(function (appoints) {
                            angular.forEach(appoints.data, function (appoints) {
                                if (appoints.service_Id == item.service_Id) {
                                    serviceService.getServiceById(appoints.service_Id).then(function (results) {
                                        if (results.data[0].status == 1) {
                                            var found = false;
                                            angular.forEach(list.data, function (item) {
                                                if (item == results.data[0])
                                                    found = true;
                                            })
                                            if (!found)
                                            list.push(results[0]);
                                        }
                                    })
                                }
                            })
                        })
                    }
                })

                $scope.TaskCompleted = list;
                
            })


            professionalAddressService.getProfessionalAddresses(data).then(function (results) {
                
                angular.forEach(results.data, function (item) {
                    if (item.serviceProvider_Id == $scope.id) {
                        addressService.getAddressesById(item.address_Id).then(function (address) {
                            $scope.address = address.data;
                            neighbourhoodService.getNeighbourhoddById(1).then(function (neighbour) {
                                $scope.neighbourhood = neighbour;
                            })
                        })
                    }
                })
            })

            



            $scope.getReviewByProviderId = function (pid) {

                reviewService.getReviews(data).then(function (results) {
                    var list = [];
                    var star = .1;
                    var count = .1;
                    angular.forEach(results.data, function (item) {
                        if (item.createdBy != pid) {

                            if (item.serviceProvider_Id == pid) {
                                if (item.score > 0) {
                                    count = count + 1;
                                    star = star + item.score;
                                }
                                list = [];
                                list.push({ "stars": star / count });
                            }
                        }
                    })
                    $scope.StarvaluePro = list;

                })

            }




        })

    }

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $window.location.href = '/pages/login.html';;
        }, 2000);
    }

}]);



(function () {
    'use strict';
    var directiveId = 'ngMatch';
    app.directive(directiveId, ['$parse', function ($parse) {

        var directive = {
            link: link,
            restrict: 'A',
            require: '?ngModel'
        };
        return directive;

        function link(scope, elem, attrs, ctrl) {
            // if ngModel is not defined, we don't need to do anything
            if (!ctrl) return;
            if (!attrs[directiveId]) return;

            var firstPassword = $parse(attrs[directiveId]);

            var validator = function (value) {
                var temp = firstPassword(scope),
                v = value === temp;
                ctrl.$setValidity('match', v);
                return value;
            }

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe(directiveId, function () {
                validator(ctrl.$viewValue);
            });

        }
    }]);
})();


