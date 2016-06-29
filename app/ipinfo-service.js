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

                    }, function(Ipdata, status, headers, config){
                        deferred.reject(Ipdata);

                });

                return deferred.promise;
            }

        }

    }]);

})();