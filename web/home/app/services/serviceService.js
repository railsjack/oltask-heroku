'use strict';
app.factory('serviceService', ['$http','localStorageService',  'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var serviceServiceFactory = {};


    var _getServices = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
       
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/services',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _getServiceById = function (id) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/services/'+id,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _postServices = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/services',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _postServiceScheduleAddress = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/ServiceScheduleAddress',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _putService = function (data, sid) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'PUT',
            url: serviceBase + 'api/services/' + sid,
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    serviceServiceFactory.getServices = _getServices;
    serviceServiceFactory.getServiceById = _getServiceById;
    serviceServiceFactory.postServices = _postServices;
    serviceServiceFactory.putService = _putService;
    serviceServiceFactory.postServiceScheduleAddress = _postServiceScheduleAddress;
    return serviceServiceFactory;
}]);
