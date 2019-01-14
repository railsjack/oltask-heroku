'use strict';
app.factory('professionalAddressService', ['$http', 'localStorageService', 'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var professionalAddressServiceFactory = {};

    var _getProfessionalAddresses = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/ServiceProviderAddresses',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    
    var _postProfessionalAddresses = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/ServiceProviderAddresses',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    professionalAddressServiceFactory.getProfessionalAddresses = _getProfessionalAddresses;
    professionalAddressServiceFactory.postProfessionalAddresses = _postProfessionalAddresses;

    return professionalAddressServiceFactory;

}]);