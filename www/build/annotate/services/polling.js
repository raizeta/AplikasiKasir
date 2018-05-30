angular.module('starter')
.service('PollingService', ['MerchantsFac', 'MerchantsLiteFac', 'ShopCartLiteFac', 'TransaksiCombFac', 'TransaksisFac', 'TransaksisLiteFac', 'ProductsFac', 'ProductsLiteFac', 'ProductStockLiteFac', '$rootScope', '$window', '$q', '$http', '$filter', 'UtilService', function(MerchantsFac,MerchantsLiteFac,ShopCartLiteFac,TransaksiCombFac,TransaksisFac,TransaksisLiteFac,ProductsFac,ProductsLiteFac,ProductStockLiteFac,$rootScope,$window,$q,$http,$filter,UtilService) 
{
    var SyncServerToLocal = function(datapolling)
    {
      var parameters      = UtilService.GetParameters();
      angular.forEach(datapolling,function(value,key)
      {
           if(value.NM_TABLE == 'TBL_STOCK')
           {
              var param             = {};
              param.STORE_ID        = value.STORE_ID;
              param.ACCESS_GROUP    = value.ACCESS_GROUP;
              param.ACCESS_ID       = parameters.ACCESS_ID;
              param.PRODUCT_ID      = value.PRIMARIKEY_VAL;
              param.ID              = value.PRIMARIKEY_ID;
              param.NM_TABLE        = value.NM_TABLE;

              ProductsFac.GetProductsByProductID(param)
              .then(function(responseproducts)
              {
                  responseproducts.TGL_SAVE = $filter('date')(new Date(),'yyyy-MM-dd');
                  responseproducts.STORE_ID = parameters.STORE_ID;
                  ProductsLiteFac.UpdateProductsQuantity(responseproducts)
                  .then(function(responselocalstock)
                  {
                      $rootScope.$broadcast('update-notifproduct');
                  });
              });

              ProductsFac.GetProductStocks(param)
              .then(function(responsestock)
              {
                  responsestock.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                  responsestock.STATUS        = 1;
                  responsestock.DCRP_DETIL    = 'Deskripsi Penambahan Stok';
                  ProductStockLiteFac.CreateProductStocks(responsestock,'FROM-SERVER')
                  .then(function(responsecreatestock)
                  {
                      console.log("Stok Berhasil Dimasukkan Ke Dalam Tabel Stock");
                  },
                  function(error)
                  {
                      console.log("Stok Gagal Dimasukkan Ke Dalam Tabel Stock");
                  });
              },
              function(error)
              {
                  console.log(error);
              });
           }

           if(value.NM_TABLE == 'TBL_HARGA')
           {
              var param             = {};
              param.STORE_ID        = value.STORE_ID;
              param.ACCESS_GROUP    = value.ACCESS_GROUP;
              param.ACCESS_ID       = parameters.ACCESS_ID;
              param.PRODUCT_ID      = value.PRIMARIKEY_VAL;
              param.ID              = value.PRIMARIKEY_ID;
              param.NM_TABLE        = value.NM_TABLE;

              ProductsFac.GetProductsByProductID(param)
              .then(function(responseproducts)
              {
                  
                  responseproducts.TGL_SAVE = $filter('date')(new Date(),'yyyy-MM-dd');
                  responseproducts.STORE_ID = parameters.STORE_ID;
                  ProductsLiteFac.UpdateProductsHarga(responseproducts)
                  .then(function(responselocalstock)
                  {
                      $rootScope.$broadcast('update-notifproduct');
                  });
              });

              ProductsFac.GetProductHargas(param)
              .then(function(responseharga)
              {
                  responseharga.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                  responseharga.STATUS        = 1;
                  responseharga.DCRP_DETIL    = 'Deskripsi Penambahan Stok';
                  ProductStockLiteFac.CreateProductHargas(responseharga,'FROM-SERVER')
                  .then(function(responsecreatestock)
                  {
                      console.log("Harga Berhasil Dimasukkan Ke Dalam Tabel Harga");
                  },
                  function(error)
                  {
                      console.log("Harga Gagal Dimasukkan Ke Dalam Tabel Harga");
                  });
              },
              function(error)
              {
                  console.log(error);
              });
           }

           else if(value.NM_TABLE == 'TBL_PRODUCT')
           {
              if(value.TYPE_ACTION == 1)
              {
                  var paramproduct          = {};
                  paramproduct.PRODUCT_ID   = value.PRIMARIKEY_VAL;
                  paramproduct.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
                  ProductsLiteFac.GetProductByProductID(paramproduct)
                  .then(function(responselite)
                  {
                      var param             = {};
                      param.STORE_ID        = value.STORE_ID;
                      param.ACCESS_GROUP    = value.ACCESS_GROUP;
                      param.ACCESS_ID       = parameters.ACCESS_ID;
                      param.PRODUCT_ID      = value.PRIMARIKEY_VAL;
                      param.NM_TABLE        = value.NM_TABLE;
                      ProductsFac.GetProductsByProductID(param)
                      .then(function(responseproducts)
                      {
                          responseproducts.ACCESS_GROUP      = parameters.ACCESS_GROUP;
                          responseproducts.STORE_ID          = parameters.STORE_ID;
                          responseproducts.TGL_SAVE          = parameters.TGL_SAVE;
                          responseproducts.HARGA_JUAL        = responseproducts.CURRENT_PRICE;
                          responseproducts.IS_FAVORITE       = 0;
                          responseproducts.IS_ONSERVER       = 1;
                          
                          if(responselite.length == 0)
                          {
                              ProductsLiteFac.CreateProducts(responseproducts,'FROM-SERVER')
                              .then(function(responsesetliteproduct)
                              {
                                  $rootScope.$broadcast('update-notifproduct');
                              });
                          }
                      });
                  }); 
              }
              else if(value.TYPE_ACTION == 2)
              {
                  var paramproduct          = {};
                  paramproduct.PRODUCT_ID   = value.PRIMARIKEY_VAL;
                  paramproduct.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
                  ProductsLiteFac.GetProductByProductID(paramproduct)
                  .then(function(responselite)
                  {
                      if(responselite.length > 0)
                      {
                          var param             = {};
                          param.STORE_ID        = value.STORE_ID;
                          param.ACCESS_GROUP    = value.ACCESS_GROUP;
                          param.ACCESS_ID       = parameters.ACCESS_ID;
                          param.PRODUCT_ID      = value.PRIMARIKEY_VAL;
                          param.NM_TABLE        = value.NM_TABLE;
                          ProductsFac.GetProductsByProductID(param)
                          .then(function(responseproducts)
                          {
                              responseproducts.ID_LOCAL          = responselite[0].ID_LOCAL;
                              responseproducts.ACCESS_GROUP      = parameters.ACCESS_GROUP;
                              responseproducts.STORE_ID          = parameters.STORE_ID;
                              responseproducts.TGL_SAVE          = parameters.TGL_SAVE;
                              responseproducts.HARGA_JUAL        = responseproducts.CURRENT_PRICE;
                              responseproducts.IMG_FILE          = responseproducts.IMG_FILE;
                              responseproducts.IS_FAVORITE       = 0;
                              
                              ProductsLiteFac.UpdateProducts(responseproducts,'FROM-SERVER')
                              .then(function(responsesetliteproduct)
                              {
                                  console.log('Broadcast Product Update');
                                  $rootScope.$broadcast('update-notifproduct');
                              },
                              function(error)
                              {
                                console.log(error)
                              });
                          },
                          function(eror)
                          {
                            console.log(eror);
                          });  
                      }
                  },
                  function(error)
                  {
                      console.log(error);
                  });
              }
              else if(value.TYPE_ACTION == 3)
              {
                console.log(value);
              }
           }
           
           else if(value.NM_TABLE == 'TBL_SYNC_QTY')
           {
              if(value.TYPE_ACTION == 2)
              {
                  var paramproduct          = {};
                  paramproduct.PRODUCT_ID   = value.PRIMARIKEY_VAL;
                  paramproduct.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
                  ProductsLiteFac.GetProductByProductID(paramproduct)
                  .then(function(responselite)
                  {
                      if(responselite.length > 0)
                      {
                          var param             = {};
                          param.STORE_ID        = value.STORE_ID;
                          param.ACCESS_GROUP    = value.ACCESS_GROUP;
                          param.ACCESS_ID       = parameters.ACCESS_ID;
                          param.PRODUCT_ID      = value.PRIMARIKEY_VAL;
                          param.NM_TABLE        = value.NM_TABLE;
                          ProductsFac.GetProductsByProductID(param)
                          .then(function(responseproducts)
                          {
                              responseproducts.ID_LOCAL          = responselite[0].ID_LOCAL;
                              responseproducts.ACCESS_GROUP      = parameters.ACCESS_GROUP;
                              responseproducts.STORE_ID          = parameters.STORE_ID;
                              responseproducts.TGL_SAVE          = parameters.TGL_SAVE;
                              if(responseproducts.CURRENT_STOCK < 0)
                              {
                                  responseproducts.CURRENT_STOCK = 0;
                              }
                              responseproducts.HARGA_JUAL        = responseproducts.CURRENT_PRICE;
                              responseproducts.IMG_FILE          = responseproducts.IMG_FILE;
                              responseproducts.IS_FAVORITE       = 0;
                              
                              ProductsLiteFac.UpdateProducts(responseproducts,'FROM-SERVER')
                              .then(function(responsesetliteproduct)
                              {
                                  console.log('Broadcast Product Update');
                                  $rootScope.$broadcast('update-notifproduct');
                              },
                              function(error)
                              {
                                console.log(error)
                              });
                          },
                          function(eror)
                          {
                            console.log(eror);
                          });  
                      }
                  },
                  function(error)
                  {
                      console.log(error);
                  });
              }
              else if(value.TYPE_ACTION == 3)
              {
                console.log(value);
              }
           }

           else if(value.NM_TABLE == 'TBL_MERCHANT_TYPE')
           {
              if(value.TYPE_ACTION == 1)
              {
                  var param             = {};
                  param.TYPE_PAY_ID     = value.PRIMARIKEY_VAL;
                  param.NM_TABLE        = value.NM_TABLE;
                  MerchantsLiteFac.GetMerchantTypesByTypesID(param)
                  .then(function(responselite)
                  {
                      if(responselite.length ==  0)
                      {
                          MerchantsFac.GetMerchantTypesByTypesID(param)
                          .then(function(responsemerchanttypes)
                          {
                              responsemerchanttypes.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                              responsemerchanttypes.STATUS        = UtilService.SwitchStatus(responsemerchanttypes.STATUS);
                              MerchantsLiteFac.CreateMerchantTypes(responsemerchanttypes,'FROM-SERVER')
                              .then(function(responsecreate)
                              {
                                  console.log(responsecreate)
                              },
                              function(error)
                              {
                                  console.log(error);
                              });
                          },
                          function(error)
                          {
                              console.log(error);
                          });
                      }  
                  },
                  function(error)
                  {
                     console.log(error)
                  }); 
              }
              else if(value.TYPE_ACTION == 2 || value.TYPE_ACTION == 3)
              {
                  var param             = {};
                  param.TYPE_PAY_ID     = value.PRIMARIKEY_VAL;
                  param.NM_TABLE        = value.NM_TABLE;
                  MerchantsLiteFac.GetMerchantTypesByTypesID(param)
                  .then(function(responselite)
                  {
                      if(responselite.length > 0)
                      {
                          MerchantsFac.GetMerchantTypesByTypesID(param)
                          .then(function(responsemerchanttypes)
                          {
                              responsemerchanttypes.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                              responsemerchanttypes.STATUS        = UtilService.SwitchStatus(responsemerchanttypes.STATUS);
                              MerchantsLiteFac.UpdateMerchantTypes(responsemerchanttypes,'FROM-SERVER')
                              .then(function(responsecreate)
                              {
                                  console.log(responsecreate)
                              },
                              function(error)
                              {
                                  console.log(error);
                              });
                          },
                          function(error)
                          {
                              console.log(error);
                          });
                      }  
                  }); 
              }
           }
           else if(value.NM_TABLE == 'TBL_PRODUCT_UNIT')
           {
              if(value.TYPE_ACTION == 1)
              {
                   
              }
              else if(value.TYPE_ACTION == 2 || value.TYPE_ACTION == 3)
              {
                   
              }
           }
      });
    }

    return {
      SyncServerToLocal:SyncServerToLocal
    };
}]);