(function(){
    'use strict';
    angular.module('weatherApp')
    .controller('weatherController', ['$scope','$http' ,'ipinfoService', 'geocoderService', 'weatherService',
        function($scope, $http, ipinfoService, geocoderService, weatherService){


        // initialize $scope.place
        $scope.place = {
            country: '',
            region: '',
            city: '',
            display: '',
            knowLocation: true
        };

        // input text
        $scope.query = '';


        // initialize object to hold the data sent from Y.no servers
        $scope.YNoData = {
            weatherdata : {},
            next36h : [],
            dataRetrieved: false
        }

        $scope.isCelsius = true;


        // true if current units are celsius, false if farhenheit
        $scope.toggleUnits = function(){
            $scope.isCelsius = !$scope.isCelsius;
        };


        // function triggered at page loading
        $scope.Init = function(){
             ipinfoService.getIpInfo()
                    .then(function(Ipdata, status, headers, config){
                       var newQuery = {
                            country: '',
                            region: '',
                            city: '',
                            display: '',
                            knowLocation: false
                        };

                        // console.log(Ipdata);


                        if (Ipdata.data.country !== '' && Ipdata.data.region !== ''){
                            newQuery.city = (Ipdata.data.city).replace(" ", "_");
                            newQuery.region = (Ipdata.data.region).replace(" ", "_");
                            var query = encodeURI(newQuery.city + newQuery.region);
                            $scope.newSearch(query, 'd', newQuery);
                            // console.log(newQuery);
                        } else
                            $scope.newSearch(Ipdata.data.loc, 'r', newQuery);

                    }, function(Ipdata, status, headers, config){
                       console.log("Retrieving ip info was not successful");
                       $scope.place.knowLocation = false;
                });

        }

        // call the newSearch from the search bar
        $scope.searchBar = function(query){
             // initialize a place object to hold the new search data
                var newPlace = {
                    country: '',
                    region: '',
                    city: query,
                    display: '',
                    knowLocation: false
                };
            $scope.newSearch(query, 'd', newPlace);
        }



        // Make a new search
        $scope.newSearch = function(val, par, newQuery){
            var results = [];

            geocoderService.getPlaceInfo(val, par)
            .then(function(placedata, status, headers, config){

                console.log(placedata);
                    if (placedata.data.status !== "ZERO_RESULTS" ) {
                        results = placedata.data.results[0];
                        newQuery = $scope.formatGeoResults(results, newQuery);

                        if (newQuery.city !== '' && newQuery.region !== '' && newQuery.country !== '')
                        // call the weather service
                            $scope.getWeather(newQuery);
                        else
                            $scope.place.knowLocation = false;
                    }


                }, function(placedata, status, headers, config){
                        console.log("Retrieving place data was not successful", status);

            });

        };

        //retrieve the data provided by geocoding in the correct format to be passed to the weather service
        $scope.formatGeoResults = function(geoResults, place){

            // retrieve city, region, country from the data. Other fields are not needed
                for (var i=0; i < geoResults.address_components.length; i++){
                    if (geoResults.address_components[i].types[0] === 'locality')
                        place.city = geoResults.address_components[i].long_name;

                    if (place.region === '' && geoResults.address_components[i].types[0] === 'administrative_area_level_1')
                        place.region = geoResults.address_components[i].long_name;

                    if (place.country === '' && geoResults.address_components[i].types[0] === 'country')
                        place.country = geoResults.address_components[i].long_name;
                }

                place.knowLocation = true;
                place.display = place.country + ' > ' + place.region + ' > ' + place.city;

                console.log(place);
            return place;
        };

        // call the weather service
        $scope.getWeather = function(newPlace){
              //flush the values and retrieve new values
                    $scope.place = newPlace;
                    $scope.YNoData.weatherdata = {};
                    $scope.YNoData.next36h = [];

                    // call the weather service
                    weatherService.getWeatherData($scope.place, $scope.YNoData);
                    newPlace = {};
        }

        // get weather icon
        $scope.getWeatherIcon = function(strNo){
            var symbol = {
                "1": "wi-day-sunny", //1 Clear sky
                "2": "wi-day-sunny", //2 fair
                "3": "wi-day-cloudy", //3 partly cloudy
                "4": "wi-cloudy", //4 cloudy
                "5": "wi-showers", //5 rain showers
                "6": "wi-thunderstorm", //Heavy rain showers and thunder

                "8": "wi-day-sleet", //8 Light snow showers
                "9": "wi-rain", //9 rain
                "10": "wi-rain", //10 heavy rain
                "13": "wi-snow", //13 snow, light snow
                "15": "wi-day-fog", //15 fog
                "22": "wi-thunderstorm" //Rain and thunder
            }

            if (symbol.hasOwnProperty(strNo))
                return symbol[strNo];
            return '';

        };

         $scope.getBg = function(strNo){
            var bgImg = '';
            var bgColor = '';
            switch(strNo){
                case "1":
                case "2":
                    bgImg =  'img/air-2716_1280.jpg';
                    bgColor = '#C8E0FA'
                    break;
                case "3":
                    bgImg =  "img/sky-414198_1280.jpg";
                    bgColor = '#BFCFDF';
                     break;
                case "4":
                    bgImg = 'img/Cloudy_sky.jpg';
                    bgColor = '#DCDDDE';
                    break;
                case "6":
                case "22":
                     bgImg = 'img/lightning-199651_1920.jpg';
                     bgColor = '#839FCE';
                     break;
                case "5":
                case "9":
                case "10":
                     bgImg = 'img/rain-980076_1280.jpg';
                     bgColor = '#A3C2B3';
                     break;
                case "13":
                    bgImg = 'img/frozen-201495_1920.jpg';
                    bgColor = '#EEEEF1';
                    break;
                case "15":
                    bgImg = 'img/landscape-trees-winter-8781.jpg';
                    bgColor = '#F1EEE6';
                    break;
            }

            return ['url(' + bgImg +')', bgColor];
        }






        // get wind direction icon
        $scope.getWindIcon = function(code){
            var windCode = {
                'N': "wi-from-n",
                'E': "wi-from-e",
                'S': "wi-from-s",
                'W': "wi-from-w",
                'NNE':'wi-from-nne',
                'ESE':'wi-from-ese',
                'SSW': 'wi-from-ssw',
                'WNW': 'wi-from-wnw',
                'SE': "wi-from-se",
                'NE':'wi-from-ne',
                'SW': 'wi-from-sw',
                'NW': 'wi-from-nw',
                'ENE': 'wi-from-ene',
                'SSE': 'wi-from-sse',
                'WSW': 'wi-from-wsw',
                'NNW': 'wi-from-nnw',
            }
           if (windCode.hasOwnProperty(code))
                return windCode[code];
            return '';
        }


        $scope.Init();



    }]);

})();