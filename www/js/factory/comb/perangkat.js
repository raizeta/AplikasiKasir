angular.module('starter')
.factory('PerangkatCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,UtilService,PerangkatsLiteFac,PerangkatsFac)
{
    var GetPerangkats = function (parameters)
    {
        var deferred        = $q.defer();
        PerangkatsLiteFac.GetPerangkats(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                PerangkatsFac.GetPerangkats(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.PAKET_GROUP             = value.PAKET_ATRIBUT.PAKET_GROUP;
                            value.PAKET_ID                = value.PAKET_ATRIBUT.PAKET_ID;
                            value.PAKET_NM                = value.PAKET_ATRIBUT.PAKET_NM;
                            value.PAKET_DURATION          = value.PAKET_ATRIBUT.PAKET_DURATION;
                            value.PAKET_DURATION_BONUS    = value.PAKET_ATRIBUT.PAKET_DURATION_BONUS;
                            value.HARGA_BULAN             = value.PAKET_ATRIBUT.HARGA_BULAN;
                            value.HARGA_HARI              = value.PAKET_ATRIBUT.HARGA_HARI;
                            value.HARGA_PAKET             = value.PAKET_ATRIBUT.HARGA_PAKET;
                            value.HARGA_PAKET_HARI        = value.PAKET_ATRIBUT.HARGA_PAKET_HARI;
                            value.PAKET_STT               = value.PAKET_ATRIBUT.PAKET_STT;
                            value.PAKET_STT_NM            = value.PAKET_ATRIBUT.PAKET_STT_NM;
                            PerangkatsLiteFac.CreatePerangkats(value,'FROM-SERVER');
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
    var GetPakets = function (parameters)
    {
        var deferred        = $q.defer();
        PerangkatsLiteFac.GetPakets(parameters)
        .then(function(responselite)
        {
            console.log(responselite);
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                PerangkatsFac.GetPakets(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            
                            PerangkatsLiteFac.CreatePakets(value,'FROM-SERVER')
                            .then(function(response)
                            {
                                console.log(response);
                            },
                            function(error)
                            {
                                console.log(error);
                            });
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
                    console.log(error);
                    deferred.reject(error);
                });
            }
        });
        return deferred.promise;
    }

    return{
            GetPerangkats:GetPerangkats,
            GetPakets:GetPakets
        }
});