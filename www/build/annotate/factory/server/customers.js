angular.module('starter')
.factory('CustomersFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetCustomers  = function(dataparameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/customers"

        dataparameters.METHODE  = 'GET';
        var result              = UtilService.SerializeObject(dataparameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse.CUSTOMER);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetCustomerByCustomerID = function(dataparameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/customers"

        dataparameters.METHODE  = 'GET';
        var result              = UtilService.SerializeObject(dataparameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse.CUSTOMER);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateCustomers = function(datacustomer)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/customers"
        datacustomer.METHODE    = 'POST';
        datacustomer.UUID       = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(datacustomer);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse.CUSTOMER);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

    var UpdateCustomers = function(datacustomer)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/customers";

        datacustomer.UUID       = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(datacustomer);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse.CUSTOMER);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

    var DeleteCustomers = function(datacustomer)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/customers";

        datacustomer.UUID       = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(datacustomer);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(dataresponse,status,headers,config) 
        {
            deferred.resolve(dataresponse.CUSTOMER);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;  
    }

	return{
            GetCustomers:GetCustomers,
            GetCustomerByCustomerID:GetCustomerByCustomerID,
            CreateCustomers:CreateCustomers,
            UpdateCustomers:UpdateCustomers,
            DeleteCustomers:DeleteCustomers
        }
}])