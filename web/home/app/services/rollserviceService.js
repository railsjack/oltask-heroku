'use strict';
app.factory('categoryService', ['$http','localStorageService',  'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var categoryServiceFactory = {};


    var _getCategories = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
       
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/Categories',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

   

    categoryServiceFactory.getCategories = _getCategories;
    
    return categoryServiceFactory;
}]);
