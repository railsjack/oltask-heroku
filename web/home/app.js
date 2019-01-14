
var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', "ngResource"]);

var webBaseUrl = "http://localhost:53919";

app.config(function ($routeProvider) {

    //$routeProvider.when("/customer.html#", {
    //    controller: "homeController",
    //    templateUrl: "/app/views/home.html"
    //});

    //$routeProvider.when("/login", {
    //    controller: "loginController",
    //    templateUrl: "/app/views/login.html"
    //});

    //$routeProvider.when("/signup", {
    //    controller: "signupController",
    //    templateUrl: "/app/views/signup.html"
    //});

    //$routeProvider.when("/dashboard", {
    //    controller: "ordersController",
    //    templateUrl: "/app/views/orders.html"
    //});

    //$routeProvider.when("/refresh", {
    //    controller: "refreshController",
    //    templateUrl: "/app/views/refresh.html"
    //});

    //$routeProvider.when("/tokens", {
    //    controller: "tokensManagerController",
    //    templateUrl: "/app/views/tokens.html"
    //});

    //$routeProvider.when("/associate", {
    //    controller: "associateController",
    //    templateUrl: "/app/views/associate.html"
    //});

    //$routeProvider.otherwise({ redirectTo: "/home" });


    //new code for spinner

    


});



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


