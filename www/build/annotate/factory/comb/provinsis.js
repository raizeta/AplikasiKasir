angular.module('starter')
.factory('ProvinsisCombFac',['$rootScope', '$http', '$q', '$filter', '$cordovaSQLite', 'ProvinsisLiteFac', 'ProvinsisFac', function($rootScope,$http,$q,$filter,$cordovaSQLite,ProvinsisLiteFac,ProvinsisFac)
{
    var GetProvinsisComb  = function ()
    {
        var deferred        = $q.defer();
        ProvinsisLiteFac.GetProvinsis()
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProvinsisFac.GetProvinsis()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            ProvinsisLiteFac.SetProvinsis(value);
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
    var GetKotasComb  = function (parameter)
    {
        var deferred        = $q.defer();
        ProvinsisLiteFac.GetKotas(parameter)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProvinsisFac.GetKotas(parameter)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            ProvinsisLiteFac.SetKotas(value);
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
            GetProvinsisComb:GetProvinsisComb,
            GetKotasComb:GetKotasComb
        }
}]);