(function(){
    angular.module('weatherApp', [])
    .controller('weatherController', function($scope, $http){
        $scope.weatherdata = {};
        $scope.place = {};
        $scope.overcast = [];
        $scope.countriesList = [];
        // $scope.forecast = [];
        $scope.isCelsius = true;

        $scope.place.country = '';
        $scope.place.region = '';
        $scope.place.city = '';
        $scope.place.display = '';



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
                url: URL, //'https://crossorigin.me/http://www.yr.no/place/Ireland/Leinster/Dublin/forecast.xml',
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
                    alert("retrieving data was not successful");
            });

        };


        // Retrieve list of country codes
        $scope.getCountryList = function(code){
            $http.get('lib/countries.min.json')
                .then(function(countriesData){
                    $scope.countriesList = countriesData.data.countries;

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
            return arr = str.split("T");
        };

        // Get user location using ipinfo service
        $scope.getIpInfo = function(){
            $http({
                method: 'GET',
                url: 'http://ipinfo.io/',
                datatype: 'json'
            })
            .then(function(Ipdata, status, headers, config){
                if (Ipdata.data.country !== ''){
                    $scope.place.country = ($scope.getCountryName(Ipdata.data.country).name).replace(" ", "_");

                    if(Ipdata.data.region !== '')
                        $scope.place.region = (Ipdata.data.region).replace(" ", "_");

                    if (Ipdata.data.city !== '')
                        $scope.place.city = (Ipdata.data.city).replace(" ", "_");
                    else
                        $scope.place.city = ($scope.getCountryName(Ipdata.data.country).capital).replace(" ", "_");
                }

                $scope.place.display = $scope.place.country + '>' + $scope.place.region + '>' + $scope.place.city;

                if($scope.place.country !== '' && $scope.place.region !== '' && $scope.place.city !== '')
                // now get the weather data
                    $scope.getWeatherData();
                // else display an error message!


                }, function(Ipdata, status, headers, config){
                       console.log("Retrieving ip info was not successful");
            });

        };

        // get weather icon
        $scope.getWeatherIcon = function(strNo){
            var symbol = {
                "1": "wi-day-sunny", //1 Clear sky
                "2": "wi-day-sunny", //2 fair
                "3": "wi-day-cloudy", //3 partly cloudy
                "4": "wi-cloudy", //4 cloudy
                "5": "wi-day-showers", //5 rain showers
                "6": "wi-thunderstorm", //Heavy rain showers and thunder

                "8": "wi-day-sleet", //8 Light snow showers
                "9": "wi-rain", //9 rain
                "10": "wi-rain", //10 heavy rain
                "13": "wi-snow", //13 snow, light snow
                "22": "wi-thunderstorm" //Rain and thunder
            }
            if (symbol.hasOwnProperty(strNo))
                return symbol[strNo];
            return '';

        };
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
        $scope.getIpInfo();



    });

})();
