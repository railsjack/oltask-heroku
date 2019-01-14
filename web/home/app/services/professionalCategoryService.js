'use strict';
app.factory('professionalCategoryService', ['$http','localStorageService',  'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var professionalCategoryFactory = {};


    var _getProfessionalCategory = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
       
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/ServiceProviderCategories',
            data:data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _getProfessionalCategoryById = function (id) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/ServiceProviderCategories?serviceProviderId='+id,
           
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _postProfessionalCategory = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/ServiceProviderCategories',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };



    professionalCategoryFactory.getProfessionalCategory = _getProfessionalCategory;
    professionalCategoryFactory.getProfessionalCategoryById = _getProfessionalCategoryById;
    professionalCategoryFactory.postProfessionalCategory = _postProfessionalCategory;

    return professionalCategoryFactory;
}]);
