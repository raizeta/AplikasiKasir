angular.module('starter')
.factory('ProductsFac',['$http','$q','UtilService',
function($http,$q,UtilService)
{
    var GetProducts = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/products";
        var parameter           = {'STORE_ID':parameters.STORE_ID,'METHODE':'GET'};
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT))
            {
                deferred.resolve(data.LIST_PRODUCT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductsByProductID = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/products";

        parameters.METHODE      = 'GET';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT))
            {
                deferred.resolve(data.LIST_PRODUCT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateProducts = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/products";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT))
            {
                deferred.resolve(data.LIST_PRODUCT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateProducts = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/products";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT))
            {
                deferred.resolve(data.LIST_PRODUCT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteProducts = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/products";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT))
            {
                deferred.resolve(data.LIST_PRODUCT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductGroups = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-groups";

        parameters.METHODE      = 'GET';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_GROUP))
            {
                deferred.resolve(data.LIST_PRODUCT_GROUP);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductGroupsByGroupID = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-groups";

        parameters.METHODE      = 'GET';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_GROUP))
            {
                deferred.resolve(data.LIST_PRODUCT_GROUP);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateProductGroups = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-groups";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_GROUP))
            {
                deferred.resolve(data.LIST_PRODUCT_GROUP);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateProductGroups = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-groups";

        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_GROUP))
            {
                deferred.resolve(data.LIST_PRODUCT_GROUP);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteProductGroups = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-groups";

        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_GROUP))
            {
                deferred.resolve(data.LIST_PRODUCT_GROUP);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductUnits = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-units";
        var parameter           = {'STORE_ID':parameters.STORE_ID,'METHODE':'GET'};
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_UNIT))
            {
                deferred.resolve(data.LIST_PRODUCT_UNIT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductIndustriGroups = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-industri-groups";
        
        var parameter           = {'METHODE':'GET'};
        var result              = UtilService.SerializeObject(parameter);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_INDUSTRI_GROUP))
            {
                deferred.resolve(data.LIST_INDUSTRI_GROUP);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductIndustris = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-industris";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_INDUSTRI))
            {
                deferred.resolve(data.LIST_INDUSTRI);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductImages = function(parameters)
    {
        delete parameters['PRODUCT_ID'];
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-images";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;
        config.cache            = true;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_IMAGE))
            {
                deferred.resolve(data.LIST_PRODUCT_IMAGE);
            }
            else
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductImagesByProductID = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-images";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;
        config.cache            = true;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_IMAGE))
            {
                deferred.resolve(data.LIST_PRODUCT_IMAGE);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.reject('data-empty');
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateProductImages = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-images";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_GROUP))
            {
                deferred.resolve(data.LIST_PRODUCT_GROUP);
            }
            else if(angular.isDefined(data.result) && data.result == 'PRODUCT_ID-already-exist')
            {
                deferred.reject('Gambar Sudah Eksis');
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateProductImages = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-images";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_GROUP))
            {
                deferred.resolve(data.LIST_PRODUCT_GROUP);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteProductImages = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-images";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_IMAGE))
            {
                deferred.resolve(data.LIST_PRODUCT_IMAGE);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductHargas = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-hargas";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_HARGA))
            {
                deferred.resolve(data.LIST_PRODUCT_HARGA); 
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateProductHargas = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-hargas";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_HARGA))
            {
                deferred.resolve(data.LIST_PRODUCT_HARGA);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateProductHargas = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-hargas";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_HARGA))
            {
                deferred.resolve(data.LIST_PRODUCT_HARGA);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteProductHargas = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-hargas";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_HARGA))
            {
                deferred.resolve(data.LIST_PRODUCT_HARGA);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductStocks = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-stocks";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_STOCK))
            {
                deferred.resolve(data.LIST_PRODUCT_STOCK);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateProductStocks = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-stocks";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_STOCK))
            {
                deferred.resolve(data.LIST_PRODUCT_STOCK);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateProductStocks = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-stocks";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_STOCK))
            {
                deferred.resolve(data.LIST_PRODUCT_STOCK);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteProductStocks = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-stocks";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_STOCK))
            {
                deferred.resolve(data.LIST_PRODUCT_STOCK);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetProductDiscounts = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-discounts";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_DISCOUNT))
            {
                deferred.resolve(data.LIST_PRODUCT_DISCOUNT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var CreateProductDiscounts = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-discounts";

        parameters.METHODE      = 'POST';
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_DISCOUNT))
            {
                deferred.resolve(data.LIST_PRODUCT_DISCOUNT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateProductDiscounts = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-discounts";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_DISCOUNT))
            {
                deferred.resolve(data.LIST_PRODUCT_DISCOUNT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var DeleteProductDiscounts = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "master/product-discounts";
        parameters.UUID         = UtilService.GetParameters().UUID;
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.LIST_PRODUCT_DISCOUNT))
            {
                deferred.resolve(data.LIST_PRODUCT_DISCOUNT);
            }
            else if(angular.isDefined(data.result) && data.result == 'data-empty')
            {
                deferred.resolve([]);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    

	return{
            GetProducts:GetProducts,
            GetProductsByProductID:GetProductsByProductID,
            CreateProducts:CreateProducts,
            UpdateProducts:UpdateProducts,
            DeleteProducts:DeleteProducts,

            GetProductGroups:GetProductGroups,
            GetProductGroupsByGroupID:GetProductGroupsByGroupID,
            CreateProductGroups:CreateProductGroups,
            UpdateProductGroups:UpdateProductGroups,
            DeleteProductGroups:DeleteProductGroups,

            GetProductUnits:GetProductUnits,
            GetProductIndustriGroups:GetProductIndustriGroups,
            GetProductIndustris:GetProductIndustris,
            GetProductImages:GetProductImages,
            GetProductImagesByProductID:GetProductImagesByProductID,
            CreateProductImages:CreateProductImages,
            UpdateProductImages:UpdateProductImages,
            DeleteProductImages:DeleteProductImages,
            GetProductHargas:GetProductHargas,
            CreateProductHargas:CreateProductHargas,
            UpdateProductHargas:UpdateProductHargas,
            DeleteProductHargas:DeleteProductHargas,
            
            GetProductStocks:GetProductStocks,
            CreateProductStocks:CreateProductStocks,
            UpdateProductStocks:UpdateProductStocks,
            DeleteProductStocks:DeleteProductStocks,

            GetProductDiscounts:GetProductDiscounts,
            CreateProductDiscounts:CreateProductDiscounts,
            UpdateProductDiscounts:UpdateProductDiscounts,
            DeleteProductDiscounts:DeleteProductDiscounts,

        }
}])