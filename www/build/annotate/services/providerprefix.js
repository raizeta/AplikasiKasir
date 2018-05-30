angular.module('starter')
.service('ProviderPrefixService', ['$rootScope', '$window', '$q', '$http', '$filter', 'StorageService', function($rootScope,$window,$q,$http,$filter,StorageService) 
{
    var GetPrefix  = function(provider)
    {
        if(provider == 'TELKOMSEL')
        {
            return /^0811|0812|0813|0821|0822|0823|0851|0852|0853/;
        }
        else if(provider == 'INDOSAT')
        {
            return /^0814|0815|0816|0855|0856|0857|0858/;
        }
        else if(provider == 'XL')
        {
            return /^0817|0818|0819|0859|0877|0878|0879|999|998/;
        }
        else if(provider == 'AXIS')
        {
            return /^0831|0832|0838/;
        }
        else if(provider == 'THREE')
        {
            return /^0895|0896|0897|0898|0899/;
        }
        else if(provider == 'SMARTFREN')
        {
            return /^0881|0882|0883|0884|0885|0886|0887|0888|0889/;
        }
    }
    return {
      GetPrefix:GetPrefix,
    };
}]);