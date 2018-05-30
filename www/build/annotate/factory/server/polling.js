angular.module('starter')
.factory('PollingFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetPolling = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/pollings?ACCESS_GROUP="+ parameter.ACCESS_GROUP + "&STORE_ID=" + parameter.STORE_ID + "&ACCESS_ID=" + parameter.ACCESS_ID + "&UUID=" + parameter.UUID;

        parameter.METHODE       = 'GET';
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.get(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
              deferred.resolve(data);  
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }


    return{ 
            GetPolling:GetPolling,        
        }
}])