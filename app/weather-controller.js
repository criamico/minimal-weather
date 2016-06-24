(function(){
    'use strict';
    angular.module('weatherApp')
    .controller('weatherController', ['$scope','$http' ,'ipinfoService', 'weatherService', function($scope, $http, ipinfoService, weatherService){



        // initialize $scope.place
        $scope.place = {
            country: '',
            region: '',
            city: '',
            display: '',
            knowLocation: true
        };

        // initialize object to hold the data sent from Y.no servers
        $scope.YNoData = {
            weatherdata : {},
            next36h : []
        }

        $scope.countriesList = [];
        $scope.isCelsius = true;

        // true if current units are celsius, false if farhenheit
        $scope.toggleUnits = function(){
            $scope.isCelsius = !$scope.isCelsius;
        };



        // Retrieve list of country codes
        $scope.getCountryList = function(code){
            $http.get('lib/countries.min.json')
                .then(function(countriesData){
                    $scope.countriesList = countriesData.data.countries;

                    /*call the ip location service*/
                    ipinfoService.getIpInfo()
                    .then(function(Ipdata, status, headers, config){

                        if (Ipdata.data.country !== '' &&  $scope.countriesList!== ''){
                            // console.log($scope.countriesList);
                            $scope.place.country = ($scope.getCountryName(Ipdata.data.country).name).replace(" ", "_");

                            if(Ipdata.data.region !== '')
                                $scope.place.region = (Ipdata.data.region).replace(" ", "_");

                            if (Ipdata.data.city !== '')
                                $scope.place.city = (Ipdata.data.city).replace(" ", "_");
                            // else
                            //     $scope.place.city = ($scope.getCountryName(Ipdata.data.country).capital).replace(" ", "_");
                        }

                        $scope.place.display = $scope.place.country + ' > ' + $scope.place.region + ' > ' + $scope.place.city;

                        if($scope.place.country !== '' && $scope.place.region !== '' && $scope.place.city !== ''){
                        // get the weather data
                            $scope.place.knowLocation = true;

                            // call the weatherService
                            weatherService.getWeatherData($scope.place, $scope.YNoData);
                        }
                        else
                            $scope.place.knowLocation = false;

                    }, function(Ipdata, status, headers, config){
                       console.log("Retrieving ip info was not successful");
                       $scope.place.knowLocation = false;
                });

                }, function(countriesData){
                    alert("retrieving data was not successful");
            });
        };

        //Find name of country inside list
        $scope.getCountryName = function(code){
            for (var prop in $scope.countriesList) {
                if ($scope.countriesList.hasOwnProperty(code)) {
                    return $scope.countriesList[code];
                }
            }
        };



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
                    bgImg =  '/img/air-2716_1280.jpg';
                    bgColor = '#C8E0FA'
                    break;
                case "3":
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



        $scope.getCountryList();



    }]);

})();