
var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'textAngular', 'ui.directives', 'ui.filters', 'angularUtils.directives.dirPagination', 'ngDialog']);

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/index.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/pages/loginregirect.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "/app/views/orders.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/sociallogin/app/views/associate.html"
    });


    //mm routes

    $routeProvider.when("/pro", {
        controller: "proposalController",
        templateUrl: "app/views/pro/dashbord.html"
    });

    $routeProvider.when("/pro/sendproposal", {
        controller: "proposalController",
        templateUrl: "app/views/pro/sendproposal.html"
    });

    $routeProvider.when("/pro/sendproposalsuccess", {
        controller: "proposalController",
        templateUrl: "app/views/pro/sendproposalsuccsess.html"
    });

    $routeProvider.when("/pro/profile", {
        controller: "professionalProfileController",
        templateUrl: "app/views/pro/profile.html"
    });

    $routeProvider.when("/pro/myschedule", {
        controller: "scheduleController",
        templateUrl: "app/views/pro/myschedules.html"
    });


    $routeProvider.when("/cst", {
        controller: "serviceController",
        templateUrl: "app/views/cst/dashbord.html"
    });

    $routeProvider.when("/cst/postjob", {
        controller: "serviceController",
        templateUrl: "app/views/cst/postjob.html"
    });

    $routeProvider.when("/cst/profile", {
        controller: "customerProfileController",
        templateUrl: "app/views/cst/profile.html"
    });

    $routeProvider.when("/cst/myschedule", {
        controller: "scheduleController",
        templateUrl: "app/views/cst/myschedules.html"
    });

    $routeProvider.when("/prt", {
        controller: "associateController",
        templateUrl: "app/views/prt/dashbord.html"
    });

    
    $routeProvider.otherwise({ redirectTo: "/home" });

});




app.config(function($routeProvider, $locationProvider) {
    
}).
run(function ($rootScope, $location, authService, $window) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        //var authData = localStorageService.get('authorizationData');
        
        if (!authService.authentication.isAuth) {
           
            // no logged user, redirect to /login
            if (next.templateUrl === "/sociallogin/login")
            {
                
            }
            else {
                $location.path("/sociallogin/login");
                
            }
        }

        else {

          
            //if (authService.authentication.userRoll == 2)
            //{ 
            //    $window.location = '/professional.html#/pro';
                
            //}
            //else if(authService.authentication.userRoll ==3)
            //{
            //    $window.location = '/customer.html#/cst';
               
            //}
            //else if (authService.authentication.userRoll == 4) {
            //    $window.location = '/partner.html#/prt';
                
            //}
            //else if (authService.authentication.userRoll == 1) {
            //    $location.path("/admin");
            //}
        }
    });
});


app.controller("LoginCtrl", function ($scope, $location, $rootScope) {
    $scope.login = function () {
        $rootScope.loggedInUser = $scope.username;
        $location.path("/persons");
    };
});







//var serviceBase = 'http://localhost:26264/';
var serviceBase = 'http://consvita.w06.wh-2.com/oltaskapi/api/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);



app.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');

    var spinnerFunction = function spinnerFunction(data, headersGetter) {
        $("#spinner").show();
        $("#spinnerM").show();
        return data;
    };

    $httpProvider.defaults.transformRequest.push(spinnerFunction);
});


app.factory('myHttpInterceptor', function ($q, $window) {
    return function (promise) {
        return promise.then(function (response) {
            $("#spinner").hide();
            $("#spinnerM").hide();
            return response;
        }, function (response) {
            $("#spinner").hide();
            $("#spinnerM").hide();
            return $q.reject(response);
        });
    };
});

app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});

app.directive('starRating',
	function() {
	    return {
	        restrict : 'A',
	        template : '<ul class="rating">'
					 + '	<li ng-repeat="star in stars" ng-class="star" ">'
					 + '\u2605'
					 + '</li>'
					 + '</ul>',
	        scope : {
	            ratingValue : '=',
	            max : '=',
	            onRatingSelected : '&'
	        },
	        link : function(scope, elem, attrs) {
	            var updateStars = function() {
	                scope.stars = [];
	                for ( var i = 0; i < scope.max; i++) {
	                    scope.stars.push({
	                        filled : i < scope.ratingValue
	                    });
	                }
	            };
				
	            scope.toggle = function(index) {
	                scope.ratingValue = index + 1;
	                scope.onRatingSelected({
	                    rating : index + 1
	                });
	            };
				
	            scope.$watch('ratingValue',
					function(oldVal, newVal) {
					    if (newVal) {
					        updateStars();
					    }
					}
				);
	        }
	    };
	}
);