
var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar']);

app.config(function ($routeProvider) {

    /////For localhost
    //$routeProvider.when("/home", {
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

    //$routeProvider.when("/orders", {
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


    ///use this on server
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/sociallogin/app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/sociallogin/app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/sociallogin/app/views/signup.html"
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "/sociallogin/app/views/orders.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/sociallogin/app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/sociallogin/app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/sociallogin/app/views/associate.html"
    });

    $routeProvider.otherwise({ redirectTo: "/login" });

});




//var serviceBase = 'http://localhost:51414/';
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


