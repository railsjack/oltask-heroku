'use strict';
app.controller('partnerCategoryController', ['$scope', 'categoryService', 'partnerCategoryService','partnerService', '$location', '$timeout', 'authService', '$window', function ($scope, categoryService,partnerCategoryService,partnerService, $location, $timeout, authService, $window) {

   

    $scope.Partners = [];

    $scope.Partner = {};


    $scope.savedSuccessfully = false;
    $scope.message = "";

    
    $scope.categoryies = [];
    var data = {};
    //gat all categories
    categoryService.getCategories(data).then(function (results) {

        $scope.categoryies = results.data;

    }, function (error) {
        //alert(error.data.message);
    });

    $scope.isSelected = false;

    $scope.checkedItems = [];
    $scope.toggleCheck = function (cat) {

        $scope.isSelected = true;

        if ($scope.checkedItems.indexOf(cat) === -1) {
            $scope.checkedItems = [];
            $scope.checkedItems.push(cat);
        } else {
            $scope.checkedItems.splice($scope.checkedItems.indexOf(cat), 1);
        }
    };


    

    $scope.saveCategory = function () {

        partnerService.getPartnerByEmail(data).then(function (results) {
            
            $scope.Partner = results.data[0];
            
        var categorydata = {

            "partner_Id": $scope.Partner.partner_Id,
            "categories_Id": $scope.checkedItems[0].categorie_Id,
            "createdBy": null,
            "createdOn": null,
            "createdAt": null,
            "modifiedBy": null,
            "modifiedOn": null,
            "modifiedAt": null

        };

      
            
        partnerCategoryService.postPartnerCategory(categorydata).then(function (response) {

                $scope.savedSuccessfully = true;
                $scope.message = "Your Category has been saved successfully, you will be redicted to login page in 2 seconds.";
                
                startTimer();
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




      

        }, function (error) {
            //alert(error.data.message);
        });
       
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $window.location.href = '/sociallogin/#/login';
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


