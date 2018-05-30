angular.module('starter')
.factory('StoresCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,UtilService,StoresLiteFac,StoresFac)
{
    var GetStores = function (parameters)
    {
        var deferred        = $q.defer();
        delete parameters['STORE_ID'];
        StoresLiteFac.GetStores(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                StoresFac.GetStores(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE          = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.STATUS            = UtilService.SwitchStatus(value.STATUS);
                            StoresLiteFac.CreateStores(value,'FROM-SERVER');
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
            GetStores:GetStores
        }
});