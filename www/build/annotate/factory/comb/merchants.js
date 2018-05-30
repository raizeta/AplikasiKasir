angular.module('starter')
.factory('MerchantsCombFac',['MerchantsLiteFac','MerchantsFac','$q','$filter','UtilService',
function(MerchantsLiteFac,MerchantsFac,$q,$filter,UtilService)
{
    var GetMerchants  = function (parameters)
    {
        var deferred        = $q.defer();
        MerchantsLiteFac.GetMerchants(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                MerchantsFac.GetMerchants(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.ACCESS_GROUP  = parameters.ACCESS_GROUP;
                            value.STATUS        = UtilService.SwitchStatus(value.STATUS);
                            MerchantsLiteFac.CreateMerchants(value,'FROM-SERVER');
                        });
                        deferred.resolve(responseserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
        });
        return deferred.promise;
    }
    var GetMerchantTypes  = function (parameters)
    {
        var deferred        = $q.defer();
        MerchantsLiteFac.GetMerchantTypes(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                MerchantsFac.GetMerchantTypes(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.STATUS        = UtilService.SwitchStatus(value.STATUS);
                            MerchantsLiteFac.CreateMerchantTypes(value,'FROM-SERVER');
                        });
                        deferred.resolve(responseserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
        });
        return deferred.promise;
    }

    var GetMerchantBanks  = function (parameters)
    {
        var deferred        = $q.defer();
        MerchantsLiteFac.GetMerchantBanks(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                MerchantsFac.GetMerchantBanks(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.STATUS        = UtilService.SwitchStatus(value.STATUS);
                            value.IS_ONSERVER   = 1;
                            MerchantsLiteFac.CreateMerchantBanks(value);
                        });
                        deferred.resolve(responseserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
        });
        return deferred.promise;
    }

    return{
            GetMerchants:GetMerchants,
            GetMerchantTypes:GetMerchantTypes,
            GetMerchantBanks:GetMerchantBanks
        }
}])