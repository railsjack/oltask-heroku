'use strict';
app.factory('proposalService', ['$http','localStorageService',  'ngAuthSettings', function ($http,localStorageService, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var proposalServiceFactory = {};


    var _getProposal = function (data) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
       
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/quotes',
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _getProposalById = function (pid) {
        var result = [];
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;

        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'GET',
            url: serviceBase + 'api/quotes/'+pid,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };


    var _postProposal = function (data) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'POST',
            url: serviceBase + 'api/quotes',
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    var _putProposal = function (data, proposalid) {
        var authData = localStorageService.get('authorizationData');
        var token = authData.token;
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }

        var promise = $http({
            method: 'PUT',
            url: serviceBase + 'api/quotes/'+proposalid,
            data: data,
            headers: headers
        }).success(function (data, status, headers, config) {
            return data;
        });

        return promise;

    };

    proposalServiceFactory.getProposal = _getProposal;
    proposalServiceFactory.getProposalById = _getProposalById;
    proposalServiceFactory.postProposal = _postProposal;
    proposalServiceFactory.putProposal = _putProposal;
    return proposalServiceFactory;
}]);
