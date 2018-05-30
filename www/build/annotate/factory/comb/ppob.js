angular.module('starter')
.factory('PPOBCombFac',['$rootScope', '$http', '$q', '$filter', '$window', '$cordovaSQLite', 'UtilService', 'PPOBLiteFac', 'PPOBFac', function($rootScope,$http, $q, $filter, $window,$cordovaSQLite,UtilService,PPOBLiteFac,PPOBFac)
{
    var GetHeaders = function (parameters)
    {
        var deferred        = $q.defer();
        PPOBLiteFac.GetHeaders(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                PPOBFac.GetHeaders()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            PPOBLiteFac.SetHeaders(value,'FROM-SERVER');
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

    var GetDetails = function (parameters)
    {
        var deferred        = $q.defer();
        PPOBLiteFac.GetDetails(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                PPOBFac.GetDetails()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            PPOBLiteFac.SetDetails(value,'FROM-SERVER');
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

    var GetNominals = function (parameters)
    {
        var deferred        = $q.defer();
        PPOBLiteFac.GetNominals(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                PPOBFac.GetNominals()
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.ID_SERVER     = value.ID;
                            PPOBLiteFac.SetNominals(value,'FROM-SERVER');
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
            GetHeaders:GetHeaders,
            GetGroups:GetGroups,
            GetKategoris:GetKategoris,
            GetProducts:GetProducts,
            GetDetails:GetDetails,
            GetNominals:GetNominals
        }
}]);