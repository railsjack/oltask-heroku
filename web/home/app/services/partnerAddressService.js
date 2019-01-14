'use strict';
app.factory('partnerAddressService', ['$http', 'localStorageService', 'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var partnerAddressServiceFactory = {};

    var _getPartnerAddresses = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/PartnerAddresses',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _postPartnerAddresses = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/PartnerAddresses',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    partnerAddressServiceFactory.getPartnerAddresses = _getPartnerAddresses;
    partnerAddressServiceFactory.postPartnerAddresses = _postPartnerAddresses;

    return partnerAddressServiceFactory;

}]);