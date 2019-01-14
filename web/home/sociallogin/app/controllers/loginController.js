'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$window', 'localStorageService', 'customerService', 'professionalService', 'partnerService', function ($scope, $location, authService, ngAuthSettings, $window, localStorageService, customerService, professionalService, partnerService) {

    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false,
        grant_type: 'password',
    };

    $scope.message = "";

    $scope.login = function () {

        $.ajax({
            type: 'POST',
            url: 'http://consvita.w06.wh-2.com/oltaskapi/api/token',
            data: $scope.loginData
        }).done(function (data) {
           
            var tokendata = data;
            
            localStorageService.set('authorizationData', { token: data.access_token, userName: $scope.loginData.userName, refreshToken: "", useRefreshTokens: false, userRoll: 0 });
            customerService.getCustomers(data).then(function (results) {

                angular.forEach(results.data, function (item) {

                    if (angular.equals(item.email, $scope.loginData.userName)) {
                       
                        localStorageService.set('authorizationData', { token: data.access_token, userName: $scope.loginData.userName, refreshToken: "", useRefreshTokens: false, userRoll:3 });
                        authService.authentication.isAuth = true;
                        authService.authentication.userRoll = 3;
                        authService.authentication.userName = $scope.loginData.userName;
                        authService.authentication.useRefreshTokens = false;
                        $window.location = '/customer.html#/cst/myschedule';
                    }
                })

            }, function (error) {
                //alert(error.data.message);
            });

            //check in professional

            professionalService.getProfessionals(data).then(function (results) {
                angular.forEach(results.data, function (item) {
                    if (item.email == $scope.loginData.userName) {
                       
                        localStorageService.set('authorizationData', { token: data.access_token, userName: $scope.loginData.userName, refreshToken: "", useRefreshTokens: false, userRoll: 2 });
                        authService.authentication.isAuth = true;
                        authService.authentication.userRoll = 2;
                        authService.authentication.userName = $scope.loginData.userName;
                        authService.authentication.useRefreshTokens = false;
                        $window.location = '/professional.html#/pro/myschedule';
                    }
                })

            }, function (error) {
                //alert(error.data.message);
            });


            //check in partners

            partnerService.getPartners(data).then(function (results) {
                angular.forEach(results.data, function (item) {
                    if (item.email == $scope.loginData.userName) {
                        localStorageService.set('authorizationData', { token: data.access_token, userName: $scope.loginData.userName, refreshToken: "", useRefreshTokens: false, userRoll: 4});
                        authService.authentication.isAuth = true;
                        authService.authentication.userRoll = 4;
                        authService.authentication.userName = $scope.loginData.userName;
                        authService.authentication.useRefreshTokens = false;
                        $location.path("/partner.html#/prt");
                    }
                })

            }, function (error) {
                $scope.message="Username or password do not match";
            });

            
           
            //redirect

            //if (authService.authentication.userRoll == 2) {
               
            //    $window.location = '/professional.html#/pro/myschedule';
            //}
            //else if (authService.authentication.userRoll == 3) {
                
            //    $window.location = '/customer.html#/cst/myschedule';
            //}
            //else if (authService.authentication.userRoll == 4) {
                
            //    $location.path("/partner.html#/prt");
            //}
            //else if (authService.authentication.userRoll == 1) {
            //    $location.path("/admin.html#/admin");
            //}


            startTimer(tokendata);


        }

        ).fail(function (xhr, textStatus, errorThrown) {
            $scope.message = "Username or password is incorrect";
        });
    };



    var startTimer = function (tokendata) {
        var timer = $timeout(function (data) {
            data = tokendata;
            $timeout.cancel(timer);


            localStorageService.set('authorizationData', { token: data.access_token, userName: $scope.loginData.userName, refreshToken: "", useRefreshTokens: false, userRoll: 0 });
            customerService.getCustomers(data).then(function (results) {

                angular.forEach(results.data, function (item) {

                    if (angular.equals(item.email, $scope.loginData.userName)) {

                        localStorageService.set('authorizationData', { token: data.access_token, userName: $scope.loginData.userName, refreshToken: "", useRefreshTokens: false, userRoll: 3 });
                        authService.authentication.isAuth = true;
                        authService.authentication.userRoll = 3;
                        authService.authentication.userName = $scope.loginData.userName;
                        authService.authentication.useRefreshTokens = false;
                    }
                })

            }, function (error) {
                //alert(error.data.message);
            });

            //check in professional

            professionalService.getProfessionals(data).then(function (results) {
                angular.forEach(results.data, function (item) {
                    if (item.email == $scope.loginData.userName) {

                        localStorageService.set('authorizationData', { token: data.access_token, userName: $scope.loginData.userName, refreshToken: "", useRefreshTokens: false, userRoll: 2 });
                        authService.authentication.isAuth = true;
                        authService.authentication.userRoll = 2;
                        authService.authentication.userName = $scope.loginData.userName;
                        authService.authentication.useRefreshTokens = false;

                    }
                })

            }, function (error) {
                //alert(error.data.message);
            });


            //check in partners

            partnerService.getPartners(data).then(function (results) {
                angular.forEach(results.data, function (item) {
                    if (item.email == $scope.loginData.userName) {
                        localStorageService.set('authorizationData', { token: data.access_token, userName: $scope.loginData.userName, refreshToken: "", useRefreshTokens: false, userRoll: 4 });
                        authService.authentication.isAuth = true;
                        authService.authentication.userRoll = 4;
                        authService.authentication.userName = $scope.loginData.userName;
                        authService.authentication.useRefreshTokens = false;
                    }
                })

            }, function (error) {
                $scope.message = "Username or password do not match";
            });




            if (authService.authentication.userRoll == 2) {

                $window.location = '/professional.html#/pro';
            }
            else if (authService.authentication.userRoll == 3) {

                $window.location = '/customer.html#/cst';
            }
            else if (authService.authentication.userRoll == 4) {

                $location.path("/partner.html#/prt");
            }
            else if (authService.authentication.userRoll == 1) {
                $location.path("/admin.html#/admin");
            }



        }, 500);
    }



    $scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/sociallogin/authcomplete.html';

        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                    + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                    + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.authCompletedCB = function (fragment) {

        $scope.$apply(function () {

            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    name: fragment.external_user_name,
                    email: fragment.email,
                    externalAccessToken: fragment.external_access_token
                };

                $location.path('/associate');
                

            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.obtainAccessToken(externalData).then(function (response) {

                    $location.path('/orders');

                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
    }
}]);
