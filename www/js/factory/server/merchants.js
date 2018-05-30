angular.module('starter')
.factory('MerchantsFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetMerchants = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchants";

        parameter.METHODE       = 'GET';
        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT))
            {
              deferred.resolve(data.MERCHANT);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetMerchantsByMerchantsId = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchants";

        parameter.METHODE       = 'GET';
        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT))
            {
              deferred.resolve(data.MERCHANT);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateMerchants = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchants";

        parameter.UUID          = UtilService.GetParameters().UUID;
        parameter.METHODE       = 'POST';
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT))
            {
              deferred.resolve(data.MERCHANT);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateMerchants = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchants";

        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT))
            {
              deferred.resolve(data.MERCHANT);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteMerchants = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchants";

        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT))
            {
              deferred.resolve(data.MERCHANT);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetMerchantBanks = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-banks";

        if(angular.isDefined(parameter))
        {
            parameter.METHODE   = 'GET';
        }
        else
        {
            var parameter       = {'METHODE':'GET'};
        }
        
        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_BANK))
            {
              deferred.resolve(data.MERCHANT_BANK);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateMerchantBanks = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-banks";

        parameter.METHODE       = 'POST';
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_BANK))
            {
              deferred.resolve(data.MERCHANT_BANK);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateMerchantBanks = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-banks";

        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_BANK))
            {
              deferred.resolve(data.MERCHANT_BANK);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteMerchantBanks = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-banks";

        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.delete(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_BANK))
            {
              deferred.resolve(data.MERCHANT_BANK);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    
    var GetMerchantTypes = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-types";

        if(angular.isDefined(parameter))
        {
            parameter.METHODE   = 'GET';
        }
        else
        {
            var parameter       = {'METHODE':'GET'};
        }
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_TYPE))
            {
              deferred.resolve(data.MERCHANT_TYPE);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetMerchantTypesByTypesID = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-types";

        if(angular.isDefined(parameter))
        {
            parameter.METHODE   = 'GET';
        }
        else
        {
            var parameter       = {'METHODE':'GET'};
        }
        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_TYPE))
            {
              deferred.resolve(data.MERCHANT_TYPE);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateMerchantTypes = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-types";

        parameter.METHODE       = 'POST';
        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_TYPE))
            {
              deferred.resolve(data.MERCHANT_TYPE);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateMerchantTypes = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-types";

        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_TYPE))
            {
              deferred.resolve(data.MERCHANT_TYPE);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteMerchantTypes = function(parameter)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/merchant-types";

        parameter.UUID          = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.delete(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.MERCHANT_TYPE))
            {
              deferred.resolve(data.MERCHANT_TYPE);  
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

	return{ 
            GetMerchants:GetMerchants,
            GetMerchantsByMerchantsId:GetMerchantsByMerchantsId,
            CreateMerchants:CreateMerchants,
            UpdateMerchants:UpdateMerchants,
            DeleteMerchants:DeleteMerchants,

            GetMerchantBanks:GetMerchantBanks,
            CreateMerchantBanks:CreateMerchantBanks,
            UpdateMerchantBanks:UpdateMerchantBanks,
            DeleteMerchantBanks:DeleteMerchantBanks,

            GetMerchantTypes:GetMerchantTypes,
            GetMerchantTypesByTypesID:GetMerchantTypesByTypesID,
            CreateMerchantTypes:CreateMerchantTypes,
            UpdateMerchantTypes:UpdateMerchantTypes,
            DeleteMerchantTypes:DeleteMerchantTypes
        }
}])