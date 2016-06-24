(function(){
    'use strict';
    angular.module('weatherApp') // retrieve xml weather data and convert it to json using yahoo developer console
    .factory('weatherService', ['$http', function($http){
         // Convert temperature to Farhenheit

        var tempC2F = function(temp){
            return Math.floor(temp* (9/5) + 32) ;
        };


        return{

            getWeatherData: function(place, wdata){
                var site = 'http://www.yr.no/place/' + place.country + '/' + place.region +'/' + place.city + '/forecast.xml';
                var URL = 'https://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent('select * from xml where url="' + site + '"') + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
               // console.log(URL);


                $http({
                    method: 'GET',
                    url: URL,
                })
                .then(function(XMLdata, status, headers, config){
                    console.log(XMLdata);
                    wdata.weatherdata = XMLdata.data.query.results.weatherdata;
                    wdata.weatherdata.forecast.tabular.time[0].temperature.farhenheit = tempC2F(wdata.weatherdata.forecast.tabular.time[0].temperature.value);

                   // push data for next 36h & add farhenheit value
                   for (var i = 1; i<= 6; i++) {
                       wdata.next36h.push(wdata.weatherdata.forecast.tabular.time[i]);
                       wdata.next36h[i-1].temperature.farhenheit = tempC2F(wdata.next36h[i-1].temperature.value);
                   }


                    console.log(wdata.next36h);


                    }, function(data, status, headers, config){
                        alert("Retrieving data was not successful");
                });
                return wdata;
            }
        }


    }]);

})();