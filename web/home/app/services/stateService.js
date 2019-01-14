'use strict';
app.factory('stateService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var stateServiceFactory = {};
    var data = {};
    var _getStates = function () {

        return $http.get(serviceBase + 'api/statesNoAuth').then(function (results) {
            return results;
        });
    };

    stateServiceFactory.getStates = _getStates;

    return stateServiceFactory;

}]);