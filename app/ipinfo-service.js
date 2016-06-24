(function(){
    'use strict';

    angular.module('weatherApp')  // Get user location using ipinfo service
    .factory('ipinfoService', ['$http','$q', function($http, $q){
        return{
            getIpInfo: function(){
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: 'http://ipinfo.io/',
                    datatype: 'json'
                })
                .then(function(Ipdata, status, headers, config){
                    deferred.resolve(Ipdata);
                    /*if (Ipdata.data.country !== '' &&  $scope.countriesList!== ''){
                        console.log($scope.countriesList);
                        place.country = ($scope.getCountryName(Ipdata.data.country).name).replace(" ", "_");

                        if(Ipdata.data.region !== '')
                            place.region = (Ipdata.data.region).replace(" ", "_");

                        if (Ipdata.data.city !== '')
                            place.city = (Ipdata.data.city).replace(" ", "_");
                        // else
                        //     place.city = ($scope.getCountryName(Ipdata.data.country).capital).replace(" ", "_");
                    }

                    place.display = place.country + ' > ' + place.region + ' > ' + place.city;

                    if(place.country !== '' && place.region !== '' && place.city !== ''){
                    // get the weather data
                        place.knowLocation = true;

                        // call the weatherService
                        // $scope.getWeatherData();
                    }
                    else
                        place.knowLocation = false;*/

                    }, function(Ipdata, status, headers, config){
                        deferred.reject(Ipdata);
                          /* console.log("Retrieving ip info was not successful");
                           place.knowLocation = false;*/
                });

                // return place;
                return deferred.promise;
            }

        }

    }]);

})();