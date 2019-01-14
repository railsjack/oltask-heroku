'use strict';
app.factory('cityService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var cityServiceFactory = {};

    var _getCities = function () {

        return $http.get(serviceBase + 'api/CitiesNoAuth').then(function (results) {
            return results;
        });
    };


    var _getCitiesByState = function (stateid) {

        return $http.get(serviceBase + 'api/CitiesNoAuth').then(function (results) {
            var citylist = [];
            angular.forEach(results.data,function(item) {
                if (item.state_Id == stateid) {
                    
                    citylist.push(item);
                }
            })
            
            //citylist.push(results.data[0]);
            //alert(results.data[0].state_Id);
            return citylist;
        });
    };

    cityServiceFactory.getCities = _getCities;
    cityServiceFactory.getCitiesByState = _getCitiesByState;

    return cityServiceFactory;

}]);