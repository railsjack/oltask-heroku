'use strict';
app.controller('sendproposalController', ['$scope', 'professionalService', 'proposalService', '$location', '$timeout', 'authService', '$window', '$filter', function ($scope, professionalService, proposalService, $location, $timeout, authService, $window,$filter) {

    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.Professional = {};
    var data = {};
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
        
        var username = authService.authentication.userName;

        var quotedata = {
            "service_Id": serviceid,
            "visitValue": $scope.myquote.amount,
            "appointment_Id": $scope.myquote.appointment_Id.appointment_Id,
            "serviceProvider_Id": $scope.Professional.serviceProvider_Id,
            "status": 0,
            "createdBy": username,
            "createdOn": $filter('date')(new Date(), "yyyy-MM-dd"),
            "createdAt": null,
            "modifiedBy": null,
            "modifiedOn": null,
            "modifiedAt": null
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


