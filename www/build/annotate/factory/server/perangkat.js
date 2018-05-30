angular.module('starter')
.factory('PerangkatsFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
	var GetPerangkats  = function(dataparameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "pembayaran/store-kasirs"

        dataparameters.METHODE  = 'GET';
        var result              = UtilService.SerializeObject(dataparameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.STORE_KASIR))
            {
                deferred.resolve(dataresponse.STORE_KASIR);   
            }
            else
            {
                deferred.reject(dataresponse);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreatePerangkats  = function(dataparameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "pembayaran/store-kasirs/tambah-perangkat";

        dataparameters.METHODE  = 'POST';
        var result              = UtilService.SerializeObject(dataparameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.STORE_KASIR))
            {
                deferred.resolve(dataresponse.STORE_KASIR);   
            }
            else
            {
                deferred.reject(dataresponse);
            }
            
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetPakets  = function(dataparameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "pembayaran/store-kasirs/list-paket";

        dataparameters.METHODE  = 'POST';
        var result              = UtilService.SerializeObject(dataparameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.STORE_KASIR))
            {
                deferred.resolve(dataresponse.STORE_KASIR);   
            }
            else
            {
                deferred.resolve(dataresponse);
            }
            
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetPaymentMethods  = function(dataparameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "pembayaran/store-kasirs/list-payment-methode";

        dataparameters.METHODE  = 'POST';
        var result              = UtilService.SerializeObject(dataparameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.STORE_KASIR))
            {
                deferred.resolve(dataresponse.STORE_KASIR);   
            }
            else
            {
                deferred.resolve(dataresponse);
            }
            
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetOutDebetOrNots  = function(dataparameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "pembayaran/store-kasirs/list-auto-debet";

        dataparameters.METHODE  = 'POST';
        var result              = UtilService.SerializeObject(dataparameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    return {
    	GetPerangkats:GetPerangkats,
        CreatePerangkats:CreatePerangkats,
        GetPakets:GetPakets,
        GetPaymentMethods:GetPaymentMethods,
        GetOutDebetOrNots:GetOutDebetOrNots
    }

}]);