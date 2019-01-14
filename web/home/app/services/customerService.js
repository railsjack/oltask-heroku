'use strict';
app.factory('customerService', ['$http','localStorageService',  'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var customerServiceFactory = {};


    var _getCustomers = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
       
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/Customers',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _postCustomers = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/Customers',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _getCustomerByEmail = function (email) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/customers',
            headers: headers
        }).success(function (data, status, headers, config) {

            angular.forEach(data, function (item) {
                if (item.email == email) {

                    result.push(item);
                }


            })

            return result;

        });


        return promise;

    };

    

    var _getCustomerByID = function (cid) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/Customers/'+cid,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });


        return promise;

    };



    customerServiceFactory.getCustomers = _getCustomers;
    customerServiceFactory.postCustomers = _postCustomers;
    customerServiceFactory.getCustomerByEmail = _getCustomerByEmail;
    customerServiceFactory.getCustomerByID = _getCustomerByID;
    return customerServiceFactory;
}]);
