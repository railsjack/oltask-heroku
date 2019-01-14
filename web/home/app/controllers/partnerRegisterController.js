'use strict';
app.controller('partnerregisterController', ['$scope', 'cityService', 'stateService', 'partnerService', 'addressService', 'partnerAddressService', 'neighbourhoodService', '$location', '$timeout', 'authService', '$window', 'localStorageService', function ($scope, cityService, stateService, partnerService, addressService, partnerAddressService,neighbourhoodService, $location, $timeout, authService, $window, localStorageService) {

    $scope.cities = [];

    $scope.states = [];

    $scope.CityList = [];

    $scope.Partners = [];

    $scope.Partner = [];

    $scope.Address = {};

    $scope.PartnerAddress = {};

    $scope.submitted = false;
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
    

    


    $scope.getCitiesFilter= function (sid) {
        
        cityService.getCitiesByState(sid).then(function (results) {

            $scope.CityList = results;

        }, function (error) {
            //alert(error.data.message);
        });
    }

    $scope.registration = {};

    $scope.signUp = function (formvalid) {
        $scope.submitted = true;
        if (!formvalid) {
            $scope.message = "Please correct folloing information.";
            return;
        }

        neighbourhoodService.getNeighbourhoddByCity($scope.registration.city.city_Id).then(function (results) {

            $scope.neighbourId = results[0].neighborhood_Id;
        })

        var registrationdata = {
            username: $scope.registration.email,
            password: $scope.registration.password,
            confirmPassword: $scope.registration.confirmpassword,
            Gender: $scope.registration.gender,
            Role: "4",
            Name: $scope.registration.name + " " + $scope.registration.lastname,
            Email: $scope.registration.email,
            PhoneNumber: $scope.registration.phone,
            neighborhood: $scope.neighbourId

        };


        //var loginData = {
        //    userName: "demo",
        //    password: "123456",
        //    useRefreshTokens: false,
        //    grant_type: 'password',
        //};

        authService.saveRegistration(registrationdata).then(function (response) {
            //do login after registration
            
            var loginData = {
                userName: $scope.registration.email,
                password: $scope.registration.password,
                useRefreshTokens: false,
                grant_type: 'password',
            };
            authService.login(loginData).then(function (response) {
                $scope.message = "Logged In Successfully.";
               
                authService.authentication.userRoll = 4;


                localStorageService.set('authorizationData', { token: response.access_token, userName: $scope.registration.email, refreshToken: "", useRefreshTokens: false, userRoll: 4 });

                //add customer
                var partnerdata = {

                    "name":$scope.registration.name + " " + $scope.registration.lastname,
                    "email":$scope.registration.email,
                    "phone1":$scope.registration.phone,
                    "phone2":null,
                    "user_Id":$scope.registration.email,
                    "partnerLevel":null,
                    "status":null,
                    "ad":null,
                    "createdBy":$scope.registration.email,
                    "createdOn":new Date(),
                    "createdAt":null,
                    "modifiedBy":null,
                    "modifiedOn":null,
                    "modifiedAt":null


                };

                partnerService.postPartners(partnerdata).then(function (response) {
                    $scope.message = "Personal Information Saved Successfully.";
                    $scope.Partner = response.data;

                    //do add address

                    var addressData = {

                        "street": $scope.registration.street,
                        "number": $scope.registration.number,
                        "complement": $scope.registration.complement,
                        "neighborhood_Id": $scope.neighbourId,
                        "cep": $scope.registration.zip,
                        "createdBy": $scope.registration.email,
                        "createdOn": new Date(),
                        "createdAt": null,
                        "modifiedBy": null,
                        "modifiedOn": null,
                        "modifiedAt": null
                    };

                    addressService.postAddress(addressData).then(function (response) {
                        $scope.message = "Address Information Saved Successfully.";
                        $scope.Address = response.data;
                        //do add customer address

                        var partneraddressData = {

                            "partner_Id":$scope.Partner.partner_Id,
                            "address_Id":response.data.address_Id,
                            "mainAddress":true,
                            "createdBy":$scope.registration.email,
                            "createdOn":new Date(),
                            "createdAt":null,
                            "modifiedBy":null,
                            "modifiedOn":null,
                            "modifiedAt":null
                        };

                        partnerAddressService.postPartnerAddresses(partneraddressData).then(function (response) {
                            $scope.message = "Address Information is linked Successfully.";

                            $scope.message = "User registration has been completed successfully. You will be redirected to your dashboard in 2 seconds";
                            startTimer();

                        }, function (error) {
                            $scope.message = error.data.message;
                        });

                        
                    }, function (error) {
                        $scope.message = error.data.message;
                    });




                }, function (error) {
                    $scope.message = error.data.message;
                });

                


                //add customer address



            },
        function (err) {
            $scope.message = err.error_description;
        });


            $scope.savedSuccessfully = true;
            $scope.message = "User has been registered successfully,";
            

        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = "Failed to register user due to:" + errors.join(' ');
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $window.location.href = '/pages/createcategory-parceiros.html';
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


