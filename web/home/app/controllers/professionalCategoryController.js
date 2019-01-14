'use strict';
app.controller('professionalCategoryController', ['$scope', 'categoryService', 'professionalCategoryService', 'professionalService', '$location', '$timeout', 'authService', '$window', function ($scope, categoryService, professionalCategoryService, professionalService, $location, $timeout, authService, $window) {

   

    $scope.Professionals = [];

    $scope.Professional = {};


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

        professionalService.getProfessionalByEmail(data).then(function (results) {
            var result = [];
          var username=authService.authentication.userName;
            angular.forEach(results.data, function (item) {
                if (item.email == username) {

                    result.push(item);
                }

            })


            $scope.Professional = result[0];
           
        var categorydata = {

            "serviceProvider_Id": $scope.Professional.serviceProvider_Id,
            "categories_Id": $scope.checkedItems[0].categorie_Id,
            "createdBy": null,
            "createdOn": null,
            "createdAt": null,
            "modifiedBy": null,
            "modifiedOn": null,
            "modifiedAt": null

        };

      
            
        professionalCategoryService.postProfessionalCategory(categorydata).then(function (response) {

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

            $window.location.href = '/sociallogin/#/login';;
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


