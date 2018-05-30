angular.module('starter')
.factory('TransaksisFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetTransaksiHeaders = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-penjualan-headers";

        parameters.METHODE      = 'GET';
        parameters.TRANS_DATE   = parameters.TGL_SAVE;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_TRANS_HEADER))
            {
                deferred.resolve(dataresponse.LIST_TRANS_HEADER);
            }
            else if(angular.isDefined(dataresponse.result) && (dataresponse.result == 'data-empty'))
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
    var CreateTransaksiHeaders = function(datatosave)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-penjualan-headers";
        datatosave.METHODE      = 'POST'
        var result              = UtilService.SerializeObject(datatosave);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_TRANS_HEADER))
            {
                deferred.resolve(dataresponse.LIST_TRANS_HEADER);
            }
            else
            {
                deferred.reject("data-exist");
            }
        })
        .error(function(err,status)
        {
            deferred.reject("server-error");
        });
        return deferred.promise;  
    }

    var UpdateTransaksiHeaders = function(datatoupdate)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-penjualan-headers";

        var result              = UtilService.SerializeObject(datatoupdate);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.result) && (dataresponse.result == 'data-empty'))
            {
                deferred.resolve([]);
            }
            else if(angular.isDefined(dataresponse.LIST_TRANS_HEADER))
            {
                deferred.resolve(dataresponse.LIST_TRANS_HEADER[0]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

    var DeleteTransaksiHeaders = function(datatodelete)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-penjualan-headers";

        var result              = UtilService.SerializeObject(datatodelete);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.delete(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.result) && (dataresponse.result == 'data-empty'))
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

    var GetTransaksiDetails = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-penjualan-details";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            if(angular.isDefined(dataresponse.LIST_TRANS_DETAILS))
            {
                deferred.resolve(dataresponse.LIST_TRANS_DETAILS);
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

    var CreateTranskasiDetails = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "transaksi/trans-penjualan-details";

        parameters.METHODE      = 'POST'
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.error))
            {
                deferred.reject(data.error)
            }
            else
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

	return{
            GetTransaksiHeaders:GetTransaksiHeaders,
            CreateTransaksiHeaders:CreateTransaksiHeaders,
            UpdateTransaksiHeaders:UpdateTransaksiHeaders,
            DeleteTransaksiHeaders:DeleteTransaksiHeaders,
            GetTransaksiDetails:GetTransaksiDetails,
            CreateTranskasiDetails:CreateTranskasiDetails
        }
}])