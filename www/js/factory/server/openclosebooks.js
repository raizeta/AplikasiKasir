angular.module('starter')
.factory('OpenCloseBookFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetOpenCloseBook = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-opencloses";

        parameters.METHODE      = 'GET';
        parameters.TGL_OPEN     = parameters.TGL_SAVE;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_OPENCLOSE))
            {
                deferred.resolve(dataresponse.LIST_OPENCLOSE);
            }
            else
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            if(err === null)
            {
                deferred.resolve([]);
            }
            else
            {
                deferred.reject(err);
            }
        });
        return deferred.promise;  
    }
    var CreateOpenCloseBook = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-opencloses";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_OPENCLOSE))
            {
                deferred.resolve(dataresponse.LIST_OPENCLOSE);
            }
            else
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    var UpdateOpenCloseBook = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-opencloses";

        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_OPENCLOSE))
            {
                deferred.resolve(dataresponse.LIST_OPENCLOSE);
            }
            else
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

    var GetSetoranBook = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-storans";

        parameters.METHODE      = 'GET';
        parameters.TGL_STORAN   = parameters.TGL_SAVE;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_STORAN))
            {
                deferred.resolve(dataresponse.LIST_STORAN);
            }
            else
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

    var CreateSetoranBook = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-storans";
        
        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_STORAN))
            {
                deferred.resolve(dataresponse.LIST_STORAN);
            }
            else
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

    var UpdateSetoranBook = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-storans";
        
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_STORAN))
            {
                deferred.resolve(dataresponse.LIST_STORAN);
            }
            else
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }
    
	return{
            GetOpenCloseBook:GetOpenCloseBook,
            CreateOpenCloseBook:CreateOpenCloseBook,
            UpdateOpenCloseBook:UpdateOpenCloseBook,
            GetSetoranBook:GetSetoranBook,
            CreateSetoranBook:CreateSetoranBook,
            UpdateSetoranBook:UpdateSetoranBook

        }
}])