'use strict';
app.controller('associateController', ['$scope', '$location', '$window', '$timeout', 'authService', function ($scope, $location,$window, $timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.user = authService.externalAuthData.userName;
    $scope.registerData = {
        userName: authService.externalAuthData.userName,
        role: authService.externalAuthData.role,

        name: authService.externalAuthData.name,
        email: authService.externalAuthData.email,
        phoneNumber: authService.externalAuthData.phoneNumber,
        gender: authService.externalAuthData.gender,
        neighborhoodId: authService.externalAuthData.neighborhoodId,

        provider: authService.externalAuthData.provider,
        externalAccessToken: authService.externalAuthData.externalAccessToken
    };


    $scope.registerExternal = function () {

        authService.registerExternal($scope.registerData).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "User has been registered successfully, you will be redicted to orders page in 2 seconds.";
            startTimer();

        },
          function (response) {
              var errors = [];
              for (var key in response.modelState) {
                  errors.push(response.modelState[key]);
              }
              $scope.message = "Failed to register user due to:" + errors.join(' ');
          });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            if (authService.externalAuthData.role == 2) {
                $window.location = '/professional.html#/pro';

            }
            else if (authService.externalAuthData.role == 3) {
                $window.location = '/customer.html#/cst';

            }
            else if (authService.externalAuthData.role == 4) {
                $window.location = '/partner.html#/prt';

            }
            else if (authService.externalAuthData.role == 1) {
                $location.path("/admin");
            }
        }, 2000);
    }

}]);