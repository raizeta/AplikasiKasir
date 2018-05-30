angular.module('starter')
.factory('ProvinsisFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetProvinsis = function()
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/provinsis";

        var parameters          = {'METHODE':'GET'};
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.PROVINSI))
            {
              deferred.resolve(data.PROVINSI);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetKotas = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/kotas";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.KOTA))
            {
              deferred.resolve(data.KOTA);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

	return{ 
            GetProvinsis:GetProvinsis,
            GetKotas:GetKotas
        }
}])