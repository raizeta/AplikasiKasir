angular.module('starter')
.factory('ProductsCombFac',['ProductStockLiteFac', 'ProductsLiteFac', 'ProductsFac', 'UtilService', '$rootScope', '$http', '$q', '$filter', '$cordovaSQLite', function(ProductStockLiteFac,ProductsLiteFac,ProductsFac,UtilService,$rootScope,$http,$q,$filter,$cordovaSQLite)
{
    var GetProducts = function (parameters)
    {
        var deferred        = $q.defer();
        ProductsLiteFac.GetProducts(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProductsFac.GetProducts(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        var arraypromise = [];
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.ACCESS_GROUP      = parameters.ACCESS_GROUP;
                            value.STORE_ID          = parameters.STORE_ID;
                            value.TGL_SAVE          = parameters.TGL_SAVE;
                            
                            if(value.CURRENT_STOCK < 0)
                            {
                                value.CURRENT_STOCK = 0;
                            }
                            
                            value.HARGA_JUAL        = value.CURRENT_PRICE;
                            value.IS_FAVORITE       = 0;
                            var promise = ProductsLiteFac.CreateProducts(value,'FROM-SERVER');
                            arraypromise.push(promise)
                        });
                        $q.all(arraypromise).then(function(result)
                        {
                            deferred.resolve(responseserver)
                        },
                        function(error)
                        {
                            deferred.resolve(responseserver);    
                        })
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
            console.log(error);
        });
        return deferred.promise;
    }
    
    var GetProductImages = function (parameters)
    {
        var deferred        = $q.defer();
        ProductsLiteFac.GetProductImages(parameters)
        .then(function(responselite)
        {
            
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProductsFac.GetProductImages(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE          = parameters.TGL_SAVE;
                            value.IS_ONSERVER       = 1;
                            ProductsLiteFac.CreateProductImages(value);
                        });
                        deferred.resolve(responseserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                });
            }
        });
        return deferred.promise;
    }
    
    var GetProductGroups= function (parameters)
    {
        var deferred        = $q.defer();
        ProductsLiteFac.GetProductGroups(parameters)
        .then(function(responselite)
        {
            
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProductsFac.GetProductGroups(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            ProductsLiteFac.CreateProductGroups(value,'FROM-SERVER');
                        });
                        deferred.resolve(responseserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                });
            }
        });
        return deferred.promise;
    }

    var GetProductStocks = function (parameters)
    {
        var deferred        = $q.defer();
        ProductStockLiteFac.GetProductStocks(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProductsFac.GetProductStocks(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        var arraypromise = [];
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.STATUS        = UtilService.SwitchStatus(value.STATUS);
                            var promise = ProductStockLiteFac.CreateProductStocks(value,'FROM-SERVER');
                            arraypromise.push(promise)
                        });
                        $q.all(arraypromise).then(function(result)
                        {
                            deferred.resolve(responseserver)
                        },
                        function(error)
                        {
                            deferred.resolve(responseserver);    
                        })
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

    var GetProductHargas = function (parameters)
    {
        var deferred        = $q.defer();
        ProductStockLiteFac.GetProductHargas(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                ProductsFac.GetProductHargas(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        var arraypromise = [];
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.STATUS        = UtilService.SwitchStatus(value.STATUS);
                            var promise = ProductStockLiteFac.CreateProductHargas(value,'FROM-SERVER');
                            arraypromise.push(promise)
                        });
                        $q.all(arraypromise).then(function(result)
                        {
                            deferred.resolve(responseserver)
                        },
                        function(error)
                        {
                            deferred.resolve(responseserver);    
                        })
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
            GetProducts:GetProducts,
            GetProductImages:GetProductImages,
            GetProductGroups:GetProductGroups,
            GetProductStocks:GetProductStocks,
            GetProductHargas:GetProductHargas
        }
}]);