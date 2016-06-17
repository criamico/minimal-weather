(function(){
    angular.module('weatherApp', [])
    .controller('weatherController', function($scope, $http){
        $scope.weatherdata = {};
        $scope.place = {};
        $scope.overcast = [];
        $scope.countriesList = [];
        $scope.isCelsius = true;

        $scope.place.country = '';
        $scope.place.region = '';
        $scope.place.city = '';
        $scope.place.display = '';
        $scope.knowLocation = true;



        // Convert temperature to Farhenheit
        $scope.tempC2F= function(temp){
            return Math.floor(temp* (9/5) + 32) ;
        };

        // true if current units are celsius, false if farhenheit
        $scope.toggleUnits = function(){
            $scope.isCelsius = !$scope.isCelsius;
        };

        // retrieve xml weather data and convert it to json using yahoo developer console
        $scope.getWeatherData = function(){
            var site = 'http://www.yr.no/place/' +$scope.place.country + '/' + $scope.place.region +'/' + $scope.place.city + '/forecast.xml';
            var URL = 'https://query.yahooapis.com/v1/public/yql?q='+ encodeURIComponent('select * from xml where url="' + site + '"') + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
           console.log(URL);
            $http({
                method: 'GET',
                url: URL,
            })
            .then(function(XMLdata, status, headers, config){
                console.log(XMLdata);
                $scope.weatherdata = XMLdata.data.query.results.weatherdata;
                $scope.weatherdata.forecast.tabular.time[0].temperature.farhenheit = $scope.tempC2F($scope.weatherdata.forecast.tabular.time[0].temperature.value);


               // push data for next 36h & add farhenheit value
               for (i = 1; i<= 6; i++) {
                   $scope.overcast.push($scope.weatherdata.forecast.tabular.time[i]);
                   $scope.overcast[i-1].temperature.farhenheit = $scope.tempC2F($scope.overcast[i-1].temperature.value);
               }

                console.log($scope.overcast);


                }, function(data, status, headers, config){
                    alert("Retrieving data was not successful");
            });

        };


        // Retrieve list of country codes
        $scope.getCountryList = function(code){
            $http.get('lib/countries.min.json')
                .then(function(countriesData){
                    $scope.countriesList = countriesData.data.countries;
                    /*call the ip location service*/
                    $scope.getIpInfo();


                }, function(countriesData){
                    alert("retrieving data was not successful");
                });
        };

        //Find name of country inside list
        $scope.getCountryName = function(code){
            for (prop in $scope.countriesList) {
                if ($scope.countriesList.hasOwnProperty(code)) {
                    return $scope.countriesList[code];
                }
            }
        };


        // Helper function; needed to split date/time obtained by weather service
        $scope.filterDate = function(str){
            // format: 2016-06-18T18:00:00
            var forecastDates = {};

            var arr = str.split("T");
            var date = new Date(arr[0]);

            forecastDates.time = arr[1].slice(0,5);
            forecastDates.date = date.toDateString().slice(0,10);

            return forecastDates;
        };

        // Get user location using ipinfo service
        $scope.getIpInfo = function(){
            $http({
                method: 'GET',
                url: 'http://ipinfo.io/',
                datatype: 'json'
            })
            .then(function(Ipdata, status, headers, config){
                if (Ipdata.data.country !== '' &&  $scope.countriesList!== ''){
                    console.log($scope.countriesList);
                    $scope.place.country = ($scope.getCountryName(Ipdata.data.country).name).replace(" ", "_");

                    if(Ipdata.data.region !== '')
                        $scope.place.region = (Ipdata.data.region).replace(" ", "_");

                    if (Ipdata.data.city !== '')
                        $scope.place.city = (Ipdata.data.city).replace(" ", "_");
                   /* else
                        $scope.place.city = ($scope.getCountryName(Ipdata.data.country).capital).replace(" ", "_");*/
                }

                $scope.place.display = $scope.place.country + ' > ' + $scope.place.region + ' > ' + $scope.place.city;

                if($scope.place.country !== '' && $scope.place.region !== '' && $scope.place.city !== ''){
                // get the weather data
                    $scope.knowLocation = true;
                    $scope.getWeatherData();
                }
                else
                    $scope.knowLocation = false;

                }, function(Ipdata, status, headers, config){
                       console.log("Retrieving ip info was not successful");
                       $scope.knowLocation = false;
            });

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



    });

})();