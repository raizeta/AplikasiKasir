angular.module('starter')
.factory('PPOBCombFac',function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService,PPOBLiteFac,PPOBFac)
{
    var GetGroups = function (parameters)
    {
        var deferred        = $q.defer();
        PPOBLiteFac.GetGroups(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                PPOBFac.GetGroups()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.KELOMPOK_ID   = value.ID;
                            PPOBLiteFac.CreateGroups(value,'FROM-SERVER');
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

    var GetKategoris = function (parameters)
    {
        var deferred        = $q.defer();
        PPOBLiteFac.GetKategoris(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                PPOBFac.GetKategoris()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            PPOBLiteFac.CreateKategoris(value,'FROM-SERVER');
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

    var GetProducts = function (parameters)
    {
        var deferred        = $q.defer();
        PPOBLiteFac.GetProducts(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                PPOBFac.GetProducts()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            PPOBLiteFac.CreateProducts(value,'FROM-SERVER');
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
            GetGroups:GetGroups,
            GetKategoris:GetKategoris,
            GetProducts:GetProducts
        }
});