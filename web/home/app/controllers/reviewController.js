'use strict';
app.controller('reviewController', ['$scope', 'categoryService',  'professionalService', 'reviewService', '$location', '$timeout', 'authService', '$window', function ($scope, categoryService,  professionalService,reviewService, $location, $timeout, authService, $window) {

    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.categoryies = [];
    $scope.registration = {};

    

    if ($scope.reviewtype == "customer")
    {
        var createdby = $scope.customerid;
        
    }
    else
    {
        var createdby = $scope.providerid;
        
    }
    
    

    $scope.saveReview = function () {
     
        var data = {
            "service_Id": $scope.serviceid,
            "customer_Id": $scope.customerid,
            "serviceProvider_Id": $scope.providerid,
            "dimension": 3,
            "score": $scope.registration.star,
            "createdBy": createdby,
            "createdOn": null,
            "createdAt": null,
            "modifiedBy": null,
            "modifiedOn": null,
            "modifiedAt": null
        };

        reviewService.postReviews(data).then(function (response) {
            $scope.savedSuccessfully = true;
            $scope.message = "Your review has been submitted successfully.";
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


