'use strict';
app.factory('customerAddressService', ['$http', 'localStorageService', 'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var customerAddressServiceFactory = {};

    var _getCustomerAddresses = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/CustomerAddresses',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _getCustomerAddressesByCId = function (cid) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/CustomerAddresses?customerId='+cid,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _postCustomerAddresses = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/CustomerAddresses',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    customerAddressServiceFactory.getCustomerAddresses = _getCustomerAddresses;
    customerAddressServiceFactory.getCustomerAddressesByCId = _getCustomerAddressesByCId;
    customerAddressServiceFactory.postCustomerAddresses = _postCustomerAddresses;

    return customerAddressServiceFactory;

}]);