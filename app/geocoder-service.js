(function(){
    'use strict';
    angular.module('weatherApp') // retrieve xml weather data and convert it to json using yahoo developer console
    .factory('geocoderService', ['$http', '$q', function($http, $q){


        return{

            getPlaceInfo: function(val, par){
                var URL = '',
                    deferred = $q.defer();

                // direct geocoding, i.e. look for and address starting from the address
                // val is a city name
                if (par === 'd')
                    URL = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(val) ;

                // reverse geocoding, i.e. look for an address starting from lat & lon
                // in this case val is a lat-lon pair
                else if (par === 'r')
                    URL = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + val;

                console.log(URL);


                $http({
                    method: 'GET',
                    url: URL,
                })
                .then(function(data, status, headers, config){
                    deferred.resolve(data);

                    }, function(data, status, headers, config){
                        deferred.reject(data);

                });

                return deferred.promise;


            }
        }


    }]);

})();