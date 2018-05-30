angular.module('starter')
.factory('UserOpsCombFac',['UserOpsLiteFac','SecuredFac','$q','$filter',
function(UserOpsLiteFac,SecuredFac,$q,$filter)
{
    var GetUserOperationals  = function (parameters)
    {
        var deferred        = $q.defer();
        UserOpsLiteFac.GetUserOperationals(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                SecuredFac.GetListUserOps(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.STORE_ID      = parameters.STORE_ID;
                            value.password      = '';
                            UserOpsLiteFac.CreateUserOperationals(value,'FROM-SERVER');
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
            GetUserOperationals:GetUserOperationals
        }
}])