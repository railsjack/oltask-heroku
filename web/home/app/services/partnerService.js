'use strict';
app.factory('partnerService', ['$http','localStorageService',  'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var partnerServiceFactory = {};


    var _getPartners = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
       
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/Partners',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _getPartnerByEmail = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/Partners',
            headers: headers
        }).success(function (data, status, headers, config) {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                
            }

            angular.forEach(data, function (item) {
                if (item.email == authData.userName) {
                   
                    result.push(item);
                }
            })

            return result;
        });

        return promise;

    };


    var _postPartners = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/Partners',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    partnerServiceFactory.getPartners = _getPartners;
    partnerServiceFactory.getPartnerByEmail = _getPartnerByEmail;
    partnerServiceFactory.postPartners = _postPartners;
    return partnerServiceFactory;
}]);
