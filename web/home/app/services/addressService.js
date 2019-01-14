'use strict';
app.factory('addressService', ['$http', 'localStorageService', 'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var addressServiceFactory = {};

    var _getAddresses = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/Addresses',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _getAddressesById = function (id) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/Addresses/'+id,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _getAddresseByNeighbourhood = function (nghid) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/Addresses',
            headers: headers
        }).success(function (data, status, headers, config) {

            var addresslist = [];
            angular.forEach(data, function (item) {
                if (item.neighborhood_Id == nghid) {

                    addresslist.push(item);
                }
            })

            //citylist.push(results.data[0]);
            //alert(results.data[0].state_Id);
            return addresslist;
           
        });

        return promise;

    };


    var _postAddress = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/Addresses',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    addressServiceFactory.getAddresses = _getAddresses;
    addressServiceFactory.getAddressesById = _getAddressesById;
    addressServiceFactory.postAddress = _postAddress; 
    addressServiceFactory.getAddresseByNeighbourhood = _getAddresseByNeighbourhood;
    return addressServiceFactory;

}]);