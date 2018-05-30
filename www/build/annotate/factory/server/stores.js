angular.module('starter')
.factory('StoresFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetStores = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/stores";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.store))
            {
              deferred.resolve(data.store);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetStoreByStoreID = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/stores";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.store))
            {
              deferred.resolve(data.store);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateStores = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/stores";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.store))
            {
              deferred.resolve(data.store);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateStores = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/stores";

        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.store))
            {
              deferred.resolve(data.store);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteStores = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/stores";

        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.store))
            {
              deferred.resolve(data.store);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetSummary = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-rpt1s?STORE_ID=" + parameters.STORE_ID + "&TRANS_DATE=" + parameters.TRANS_DATE;

        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.get(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data))
            {
              deferred.resolve(data);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetSummaryBaru = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "laporan/trans-rpt-trans?STORE_ID=" + parameters.STORE_ID + "&TGL=" + parameters.TRANS_DATE;

        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.get(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data))
            {
              deferred.resolve(data);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    var GetProductTerjual = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "laporan/trans-rpt2s?STORE_ID=" + parameters.STORE_ID + "&TGL=" + parameters.TRANS_DATE;

        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.get(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data))
            {
              deferred.resolve(data);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetLaporanAbsensi = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "laporan/trans-rpt-absensis";

        var params              = {};
        params['STORE_ID']      = parameters.STORE_ID;
        if(angular.isDefined(parameters.BULAN))
        {
            params['BULAN']           = parameters.BULAN;    
        }
        if(angular.isDefined(parameters.TGL))
        {
            params['TGL']           = parameters.TGL;    
        }
        else if(angular.isDefined(parameters.KARYAWAN_ID))
        {
            params['KARYAWAN_ID']   = parameters.KARYAWAN_ID;    
        }
        
        var method              = "GET";
        $http({method:method, url:url,params:params})
        .success(function(response) 
        {
            deferred.resolve(response);
        })
        return deferred.promise;
    }
	return{ 
            GetStores:GetStores,
            GetStoreByStoreID:GetStoreByStoreID,
            CreateStores:CreateStores,
            UpdateStores:UpdateStores,
            DeleteStores:DeleteStores,
            GetSummary:GetSummary,
            GetSummaryBaru:GetSummaryBaru,
            GetProductTerjual:GetProductTerjual,
            GetLaporanAbsensi:GetLaporanAbsensi
        }
}])