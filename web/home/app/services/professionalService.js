'use strict';
app.factory('professionalService', ['$http','localStorageService',  'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var professionalServiceFactory = {};


    var _getProfessionals = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
       
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/ServiceProviders',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _getProfessionalById = function (id) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/ServiceProviders/'+id,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _postProfessionals = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/ServiceProviders',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _getProfessionalByEmail = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/ServiceProviders',
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

        
        return promise ;

    };


    var _putProfessional = function (data,id) {
        var authData = localStorageService.get('authorizationData');
       
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'PUT',
            url: serviceBase + 'api/ServiceProviders/' + id,
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    professionalServiceFactory.getProfessionals = _getProfessionals;
    professionalServiceFactory.getProfessionalById = _getProfessionalById;
    professionalServiceFactory.postProfessionals = _postProfessionals;
    professionalServiceFactory.getProfessionalByEmail = _getProfessionalByEmail;
    professionalServiceFactory.putProfessional = _putProfessional;
    return professionalServiceFactory;
}]);
