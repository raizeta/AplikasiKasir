angular.module('starter')
.factory('PPOBFac',['$http','$q','$window','$rootScope','UtilService',
function($http,$q,$window,$rootScope,UtilService)
{
    

    var GetGroups  = function()
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "ppob/datas/kelompok-group";
        var method              = 'POST';
        var params              = {};

        $http({url:url,method:method,params:params})
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

    var GetKategoris  = function()
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "ppob/datas/kelompok-kategori";
        var method              = 'POST';
        var params              = {};

        $http({url:url,method:method,params:params})
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

    var GetProducts  = function()
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "ppob/datas/produk";
        var dataparameters      = {KELOMPOK:'ALL'};
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

    

    var GetDetails  = function()
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "ppob/details";
        var method              = 'GET';
        var params              = {};

        $http({url:url,method:method,params:params})
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

    var GetNominals  = function()
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "ppob/nominals";
        var method              = 'GET';
        var params              = {};

        $http({url:url,method:method,params:params})
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

    var CreateTransaksi  = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "ppob/datas/transaksi";
        var result              = UtilService.SerializeObject(parameters);
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

    

	return{
            GetGroups:GetGroups,
            GetKategoris:GetKategoris,
            GetProducts:GetProducts,
            GetDetails:GetDetails,
            GetNominals:GetNominals,
            CreateTransaksi:CreateTransaksi,
        }
}])