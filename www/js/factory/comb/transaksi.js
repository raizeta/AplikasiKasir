angular.module('starter')
.factory('TransaksiCombFac',function($rootScope,$http,$q,$filter,$cordovaSQLite,UtilService,TransaksisFac,TransaksisLiteFac,ShopCartLiteFac)
{
    var GetTransaksiHeaders = function (parameters)
    {
        var deferred        = $q.defer();
        TransaksisLiteFac.GetTransaksiHeaders(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                TransaksisFac.GetTransaksiHeaders(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        responseserver = _.sortBy(responseserver, 'TRANS_ID');
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE          = $filter('date')(new Date(value.TRANS_DATE),'yyyy-MM-dd');
                            value.TRANS_ID          = value.TRANS_ID;
                            value.SPLIT_TRANS_ID    = value.TRANS_ID.split('.')[3] + '.' + value.TRANS_ID.split('.')[4];
                            value.STATUS            = UtilService.SwitchStatus(value.STATUS);
                            if(!value.CASHIER_NAME)
                            {
                                value.CASHIER_NAME = 'RADUMTA SITEPU';
                            }
                            else
                            {
                                value.CASHIER_NAME = value.CASHIER_NAME.replace(/null/g,'');;
                            }

                            if(value.TYPE_PAY_ID == 0)
                            {
                                value.TYPE_PAY_NM = 'TUNAI';
                            }
                            if(value.CONSUMER_EMAIL == null || value.CONSUMER_EMAIL == 'null')
                            {
                                value.CONSUMER_EMAIL = '--';
                            }

                            if(value.DCRP_DETIL != 'REFUND')
                            {
                                value.DCRP_DETIL   = 'KASIR';
                            }

                            TransaksisLiteFac.CreateTransaksiHeaders(value,'FROM-SERVER')
                            .then(function(res)
                            {
                                console.log(res)
                            },
                            function(error)
                            {
                                console.log(error);
                            })
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

    var GetTransaksiHeaderByTransID = function(TRANS_ID)
    {
        var deferred        = $q.defer();
        TransaksisLiteFac.GetTransaksiHeaderByTransID(TRANS_ID)
        .then(function(responselite)
        {
            deferred.resolve(responselite);
        },
        function(errorlite)
        {
            deferred.reject(errorlite);
        });
        return deferred.promise;
    }

    var GetTransaksiDetails = function(parameters)
    {
        var deferred        = $q.defer();
        ShopCartLiteFac.GetShopCartByNomorTrans(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                TransaksisFac.GetTransaksiDetails(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE          = $filter('date')(new Date(),'yyyy-MM-dd');
                            if(value.PRODUCT_QTY)
                            {
                                value.QTY_INCART    = value.PRODUCT_QTY;   
                            }
                            else
                            {
                                value.QTY_INCART    = 0;   
                            }
                            value.TRANS_ID          = value.TRANS_ID;
                            value.STATUS            = UtilService.SwitchStatus(value.STATUS);
                            value.IS_ONSERVER       = 1;
                            ShopCartLiteFac.CreateShopCart(value,'FROM-SERVER')
                            .then(function(res)
                            {
                                console.log(res)
                            },
                            function(error)
                            {
                                console.log(error);
                            })
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
        function(errorlite)
        {
            deferred.reject(errorlite);
        });
        return deferred.promise;
    }

    return{
            GetTransaksiHeaders:GetTransaksiHeaders,
            GetTransaksiHeaderByTransID:GetTransaksiHeaderByTransID,
            GetTransaksiDetails:GetTransaksiDetails
        }
});