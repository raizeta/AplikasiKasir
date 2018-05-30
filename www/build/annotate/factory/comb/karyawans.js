angular.module('starter')
.factory('KaryawansCombFac',['KaryawansLiteFac','KaryawansFac','$q','$filter',
function(KaryawansLiteFac,KaryawansFac,$q,$filter)
{
    var GetKaryawans  = function (parameters)
    {
        var deferred        = $q.defer();
        KaryawansLiteFac.GetKaryawans(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                KaryawansFac.GetKaryawans(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE  = $filter('date')(new Date(),'yyyy-MM-dd');
                            KaryawansLiteFac.CreateKaryawans(value,'FROM-SERVER');
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
        },
        function(error)
        {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    var GetKaryawanAbsensis  = function (parameters)
    {
        var deferred        = $q.defer();
        KaryawansLiteFac.GetKaryawanAbsensis(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                KaryawansFac.GetKaryawanAbsensis(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE = $filter('date')(new Date(),'yyyy-MM-dd');
                            KaryawansLiteFac.CreateKaryawanAbsensis(value,'FROM-SERVER');
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
        },
        function(error)
        {
            deferred.reject(error);
        });
        return deferred.promise;
    }
        
    return{
            GetKaryawans:GetKaryawans,
            GetKaryawanAbsensis:GetKaryawanAbsensis
        }
}])