angular.module('starter')
.factory('KaryawansFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetKaryawans = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/karyawans";

        parameter.METHODE       = 'GET';
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_KARYAWAN))
            {
              deferred.resolve(data.LIST_KARYAWAN);  
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

    var GetKaryawansByKaryawanID = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/karyawans";

        parameter.METHODE       = 'GET';
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_KARYAWAN))
            {
              deferred.resolve(data.LIST_KARYAWAN);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateKaryawans = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/karyawans";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_KARYAWAN))
            {
              deferred.resolve(data.LIST_KARYAWAN);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateKaryawans = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/karyawans";

        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_KARYAWAN))
            {
              deferred.resolve(data.LIST_KARYAWAN);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteKaryawans = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/karyawans";

        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_KARYAWAN))
            {
              deferred.resolve(data.LIST_KARYAWAN);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetKaryawanAbsensis = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/absensis";

        parameters.METHODE      = 'GET';
        parameters.TGL          = parameters.TGL_SAVE;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_ABSENSI))
            {
              deferred.resolve(data.LIST_ABSENSI);  
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

    var CreateKaryawanAbsensis = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/absensis";

        parameter.METHODE       = 'POST';
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_ABSENSI))
            {
              deferred.resolve(data.LIST_ABSENSI);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateKaryawanAbsensis = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/absensis";

        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_ABSENSI))
            {
              deferred.resolve(data.LIST_ABSENSI);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteKaryawanAbsensis = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "hirs/absensis";

        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_ABSENSI))
            {
              deferred.resolve(data.LIST_ABSENSI);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    return{ 
            GetKaryawans:GetKaryawans,
            GetKaryawansByKaryawanID:GetKaryawansByKaryawanID,
            CreateKaryawans:CreateKaryawans,
            UpdateKaryawans:UpdateKaryawans,
            DeleteKaryawans:DeleteKaryawans,
            GetKaryawanAbsensis:GetKaryawanAbsensis,
            CreateKaryawanAbsensis:CreateKaryawanAbsensis,
            UpdateKaryawanAbsensis:UpdateKaryawanAbsensis,
            DeleteKaryawanAbsensis:DeleteKaryawanAbsensis,
        }
}])