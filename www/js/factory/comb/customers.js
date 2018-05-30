angular.module('starter')
.factory('CustomersCombFac',['CustomersLiteFac','CustomersFac','$q','$filter',
function(CustomersLiteFac,CustomersFac,$q,$filter)
{
    var GetCustomers  = function (parameters)
    {
        var deferred        = $q.defer();
        CustomersLiteFac.GetCustomers(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                CustomersFac.GetCustomers(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                            CustomersLiteFac.CreateCustomers(value,'FROM-SERVER');
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
            GetCustomers:GetCustomers
        }
}])