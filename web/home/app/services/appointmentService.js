'use strict';
app.factory('appointmentService', ['$http', 'localStorageService', 'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var appointmentServiceFactory = {};

    var _getAppointments = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/schedules',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _postAppointments = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/schedules',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _putAppointments = function (data,apointtid) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/schedules/' + apointtid,
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    appointmentServiceFactory.getAppointments = _getAppointments;
    appointmentServiceFactory.postAppointments = _postAppointments;
    appointmentServiceFactory.putAppointments = _putAppointments;
    return appointmentServiceFactory;

}]);