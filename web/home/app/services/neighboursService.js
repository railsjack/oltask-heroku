'use strict';
app.factory('neighbourhoodService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var neighbourhoodServiceFactory = {};

    var _getNeighbourhoddByCity = function (cityid) {

        return $http.get(serviceBase + 'api/neighborhoodsNoAuth').then(function (results) {
            var neighbourhoodlist = [];
            
            angular.forEach(results.data, function (item) {
                if (item.city_Id == cityid) {
                    
                    neighbourhoodlist.push(item);
                }
            })

            //citylist.push(results.data[0]);
            //alert(results.data[0].state_Id);
            return neighbourhoodlist;
        });
    };


    var _getNeighbourhoddById = function (id) {

        return $http.get(serviceBase + 'api/neighborhoodsNoAuth/'+id).then(function (results) {
            results.data;
        });
    };

    neighbourhoodServiceFactory.getNeighbourhoddByCity = _getNeighbourhoddByCity;
    neighbourhoodServiceFactory.getNeighbourhoddById = _getNeighbourhoddById;

    return neighbourhoodServiceFactory;

}]);