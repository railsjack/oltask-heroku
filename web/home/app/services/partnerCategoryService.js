'use strict';
app.factory('partnerCategoryService', ['$http','localStorageService',  'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var partnerCategoryFactory = {};


    var _getPartnerCategory = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
       
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/PartnerCategories',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

   

    var _postPartnerCategory = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/PartnerCategories',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };



    partnerCategoryFactory.getPartnerCategory = _getPartnerCategory;
    partnerCategoryFactory.postPartnerCategory = _postPartnerCategory;

    return partnerCategoryFactory;
}]);
