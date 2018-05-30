angular.module('starter')
.service('PollingService', 
function(UserOpsLiteFac,SecuredFac,StoresLiteFac,StoresFac,CustomersLiteFac,CustomersFac,KaryawansFac,KaryawansLiteFac,MerchantsFac,MerchantsLiteFac,ShopCartLiteFac,TransaksiCombFac,TransaksisFac,TransaksisLiteFac,ProductsFac,ProductsLiteFac,ProductStockLiteFac,$rootScope,$window,$q,$http,$filter,UtilService) 
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
          }

          else if(value.NM_TABLE == 'TBL_PRODUCT_UNIT')
          {
              var paramgetoneproductunit           = {};
              paramgetoneproductunit.UNIT_ID       = value.PRIMARIKEY_VAL;
              paramgetoneproductunit.NM_TABLE      = value.NM_TABLE;

              ProductsFac.GetProductUnitsByUnitID(paramgetoneproductunit)
              .then(function(responsegetoneproductunitserver)
              {
                  var paramunitproduct          = {};
                  paramunitproduct.UNIT_ID      = value.PRIMARIKEY_VAL;
                  ProductsLiteFac.GetProductUnitsByUnitID(paramunitproduct)
                  .then(function(responsegetoneunitproductlocal)
                  {
                    if(value.TYPE_ACTION == 1 && responsegetoneunitproductlocal.length == 0)
                    {
                        responsegetoneproductunitserver.TGL_SAVE          = $filter('date')(new Date(),'yyyy-MM-dd');
                        responsegetoneproductunitserver.STATUS            = UtilService.SwitchStatus(responsegetoneproductunitserver.STATUS);
                        ProductsLiteFac.CreateProductUnits(responsegetoneproductunitserver,'FROM-SERVER'); 
                    }
                    else if (value.TYPE_ACTION == 2 && responsegetoneunitproductlocal.length > 0)
                    {
                        responsegetoneproductunitserver.ID_LOCAL          = responsegetoneunitproductlocal[0].ID_LOCAL;
                        responsegetoneproductunitserver.TGL_SAVE          = $filter('date')(new Date(),'yyyy-MM-dd');
                        responsegetoneproductunitserver.STATUS            = UtilService.SwitchStatus(responsegetoneproductunitserver.STATUS);
                        ProductsLiteFac.UpdateProductUnits(responsegetoneproductunitserver,'FROM-SERVER'); 
                    }
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

          else if(value.NM_TABLE == 'TBL_PRODUCT_GROUP')
          {
            if(value.TYPE_ACTION == 1)
            {
                var paramproductgroup         = {};
                paramproductgroup.GROUP_ID    = value.PRIMARIKEY_VAL;
                ProductsLiteFac.GetProductGroupsByGroupID(paramproductgroup)
                .then(function(responseproductgroup)
                {
                    var param             = {};
                    param.STORE_ID        = value.STORE_ID;
                    param.ACCESS_GROUP    = value.ACCESS_GROUP;
                    param.ACCESS_ID       = parameters.ACCESS_ID;
                    param.GROUP_ID        = value.PRIMARIKEY_VAL;
                    param.NM_TABLE        = value.NM_TABLE;
                    ProductsFac.GetProductGroups(param)
                    .then(function(responsegetproductgroupserver)
                    {
                        if(responseproductgrouplocal.length == 0)
                        {
                            ProductsLiteFac.CreateProductGroups(responsegetproductgroupserver,'FROM-SERVER')
                            .then(function(responsesimpanproductgrouptolocal)
                            {
                                console.log(responsesimpanproductgrouptolocal);
                            },
                            function(error)
                            {
                                console.log(error);
                            })
                        }
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
            else if(value.TYPE_ACTION == 2)
            {
                var paramproductgroup         = {};
                paramproductgroup.GROUP_ID    = value.PRIMARIKEY_VAL;
                ProductsLiteFac.GetProductGroupsByGroupID(paramproductgroup)
                .then(function(responseproductgrouplocal)
                {
                    var param             = {};
                    param.STORE_ID        = value.STORE_ID;
                    param.ACCESS_GROUP    = value.ACCESS_GROUP;
                    param.ACCESS_ID       = parameters.ACCESS_ID;
                    param.GROUP_ID        = value.PRIMARIKEY_VAL;
                    param.NM_TABLE        = value.NM_TABLE;
                    ProductsFac.GetProductGroups(param)
                    .then(function(responsegetproductgroupserver)
                    {
                        if(responseproductgrouplocal.length > 0)
                        {
                            responsegetproductgroupserver.ID_LOCAL = responseproductgrouplocal[0].ID_LOCAL;
                            ProductsLiteFac.UpdateProductGroups(responsegetproductgroupserver,'FROM-SERVER')
                            .then(function(responsesimpanproductgrouptolocal)
                            {
                                console.log(responsesimpanproductgrouptolocal);
                            },
                            function(error)
                            {
                                console.log(error);
                            })
                        }
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

          else if(value.NM_TABLE == 'TBL_STORE_MERCHANT')
          {
              if(value.TYPE_ACTION == 1)
              {
                 var param             = {};
                 param.MERCHANT_ID     = value.PRIMARIKEY_VAL;
                 param.NM_TABLE        = value.NM_TABLE;
                 MerchantsLiteFac.GetMerchantsByMerchantsId(param)
                 .then(function(responselite)
                 {
                     var param             = {};
                      param.STORE_ID        = value.STORE_ID;
                      param.ACCESS_GROUP    = value.ACCESS_GROUP;
                      param.ACCESS_ID       = parameters.ACCESS_ID;
                      param.MERCHANT_ID     = value.PRIMARIKEY_VAL;
                      param.NM_TABLE        = value.NM_TABLE;
                     if(responselite.length ==  0)
                     {
                         MerchantsFac.GetMerchantsByMerchantsId(param)
                         .then(function(responsemerchant)
                         {
                              responsemerchant.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                              responsemerchant.STATUS        = UtilService.SwitchStatus(responsemerchant.STATUS);
                              MerchantsLiteFac.CreateMerchants(responsemerchant,'FROM-SERVER')
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
                  param.MERCHANT_ID     = value.PRIMARIKEY_VAL;
                  param.NM_TABLE        = value.NM_TABLE;
                  MerchantsLiteFac.GetMerchantsByMerchantsId(param)
                  .then(function(responselite)
                  {
                      if(responselite.length >  0)
                      {
                          var param             = {};
                          param.STORE_ID        = value.STORE_ID;
                          param.ACCESS_GROUP    = value.ACCESS_GROUP;
                          param.ACCESS_ID       = parameters.ACCESS_ID;
                          param.MERCHANT_ID     = value.PRIMARIKEY_VAL;
                          param.NM_TABLE        = value.NM_TABLE;

                          MerchantsFac.GetMerchantsByMerchantsId(param)
                          .then(function(responsemerchant)
                          {
                               responsemerchant.ID_LOCAL      = responselite[0].ID_LOCAL;
                               responsemerchant.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                               responsemerchant.STATUS        = UtilService.SwitchStatus(responsemerchant.STATUS);
                               MerchantsLiteFac.UpdateMerchants(responsemerchant,'FROM-SERVER')
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
          }

          else if(value.NM_TABLE == 'TBL_MERCHANT_BANK')
          {
              var paramgetonemerchantbank           = {};
              paramgetonemerchantbank.ACCESS_GROUP  = value.ACCESS_GROUP;
              paramgetonemerchantbank.STORE_ID      = value.STORE_ID;
              paramgetonemerchantbank.BANK_ID       = value.PRIMARIKEY_VAL;
              paramgetonemerchantbank.NM_TABLE      = value.NM_TABLE;
              MerchantsFac.GetMerchantBanks(paramgetonemerchantbank)
              .then(function(responsegetonemerchantbankserver)
              {
                  responsegetonemerchantbankserver.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                  responsegetonemerchantbankserver.STATUS        = UtilService.SwitchStatus(responsegetonemerchantbankserver.STATUS);

                  paramgetmerchant          = {};
                  paramgetmerchant.BANK_ID  = value.PRIMARIKEY_VAL;
                  MerchantsLiteFac.GetMerchantBanksByBanksID(paramgetmerchant)
                  .then(function(responsegetmerchantlocal)
                  {
                      if(value.TYPE_ACTION == 1 && responsegetmerchantlocal.length == 0)
                      {
                          MerchantsLiteFac.CreateMerchantBanks(responsegetonemerchantbankserver,'FROM-SERVER'); 
                      }
                      else if (value.TYPE_ACTION == 2 && responsegetmerchantlocal.length > 0)
                      {
                          MerchantsLiteFac.UpdateMerchantBanks(responsegetonemerchantbankserver,'FROM-SERVER'); 
                      }
                  },
                  function(error)
                  {
                      console.log(error);
                  });
              },
              function(error)
              {
                  console.log(error);
              })
          }
          
          else if(value.NM_TABLE == 'TBL_KARYAWAN')
          {
              var paramgetonekaryawan           = {};
              paramgetonekaryawan.ACCESS_GROUP  = value.ACCESS_GROUP;
              paramgetonekaryawan.STORE_ID      = value.STORE_ID;
              paramgetonekaryawan.KARYAWAN_ID   = value.PRIMARIKEY_VAL;
              paramgetonekaryawan.NM_TABLE      = value.NM_TABLE;

              KaryawansFac.GetKaryawans(paramgetonekaryawan)
              .then(function(responsegetonekaryawanserver)
              {
                  var paramkaryawan         = {};
                  paramkaryawan.KARYAWAN_ID = value.PRIMARIKEY_VAL;
                  KaryawansLiteFac.GetKaryawansByKaryawanID(paramkaryawan)
                  .then(function(responsegetkaryawanlocal)
                  {
                    if(value.TYPE_ACTION == 1 && responsegetkaryawanlocal.length == 0)
                    {
                        KaryawansLiteFac.CreateKaryawans(responsegetonekaryawanserver,'FROM-SERVER'); 
                    }
                    else if (value.TYPE_ACTION == 2 && responsegetkaryawanlocal.length > 0)
                    {
                        responsegetonekaryawanserver.ID_LOCAL = responsegetkaryawanlocal[0].ID_LOCAL;
                        KaryawansLiteFac.UpdateKaryawans(responsegetonekaryawanserver,'FROM-SERVER'); 
                    }
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

          else if(value.NM_TABLE == 'TBL_CUSTOMER')
          {
              var paramgetonecustomer           = {};
              paramgetonecustomer.ACCESS_GROUP  = value.ACCESS_GROUP;
              paramgetonecustomer.STORE_ID      = value.STORE_ID;
              paramgetonecustomer.CUSTOMER_ID   = value.PRIMARIKEY_VAL;
              paramgetonecustomer.NM_TABLE      = value.NM_TABLE;

              CustomersFac.GetCustomerByCustomerID(paramgetonecustomer)
              .then(function(responsegetonecustomerserver)
              {
                  var paramcustomer         = {};
                  paramcustomer.CUSTOMER_ID = value.PRIMARIKEY_VAL;
                  CustomersLiteFac.GetCustomerByCustomerID(paramcustomer)
                  .then(function(responsegetonecustomerlocal)
                  {
                    if(value.TYPE_ACTION == 1 && responsegetonecustomerlocal.length == 0)
                    {
                        CustomersLiteFac.CreateCustomers(responsegetonecustomerserver,'FROM-SERVER'); 
                    }
                    else if (value.TYPE_ACTION == 2 && responsegetonecustomerlocal.length > 0)
                    {
                        responsegetonecustomerserver.ID_LOCAL = responsegetonecustomerlocal[0].ID_LOCAL;
                        CustomersLiteFac.UpdateCustomers(responsegetonecustomerserver,'FROM-SERVER'); 
                    }
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

          else if(value.NM_TABLE == 'TBL_STORE')
          {
              var paramgetonestore           = {};
              paramgetonestore.ACCESS_GROUP  = value.ACCESS_GROUP;
              paramgetonestore.STORE_ID      = value.STORE_ID;
              paramgetonestore.STORE_ID      = value.PRIMARIKEY_VAL;
              paramgetonestore.NM_TABLE      = value.NM_TABLE;

              StoresFac.GetStoreByStoreID(paramgetonestore)
              .then(function(responsegetonestoreserver)
              {
                  var paramstores        = {};
                  paramstores.CUSTOMER_ID = value.PRIMARIKEY_VAL;
                  StoresLiteFac.GetStoreByStoreID(paramstores)
                  .then(function(responsegetonestorelocal)
                  {
                    if(value.TYPE_ACTION == 1 && responsegetonestorelocal.length == 0)
                    {
                        responsegetonestoreserver.TGL_SAVE          = $filter('date')(new Date(),'yyyy-MM-dd');
                        responsegetonestoreserver.STATUS            = UtilService.SwitchStatus(responsegetonestoreserver.STATUS);
                        StoresLiteFac.CreateStores(responsegetonestoreserver,'FROM-SERVER'); 
                    }
                    else if (value.TYPE_ACTION == 2 && responsegetonestorelocal.length > 0)
                    {
                        responsegetonestoreserver.ID_LOCAL          = responsegetonestorelocal[0].ID_LOCAL;
                        responsegetonestoreserver.TGL_SAVE          = $filter('date')(new Date(),'yyyy-MM-dd');
                        responsegetonestoreserver.STATUS            = UtilService.SwitchStatus(responsegetonestoreserver.STATUS);
                        StoresLiteFac.UpdateStores(responsegetonestoreserver,'FROM-SERVER'); 
                    }
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

          else if(value.NM_TABLE == 'TBL_USER_OPERATIONAL')
          {
              var paramgetoneuserops           = {};
              paramgetoneuserops.ACCESS_GROUP  = value.ACCESS_GROUP;
              paramgetoneuserops.STORE_ID      = value.STORE_ID;
              paramgetoneuserops.ACCESS_ID     = value.PRIMARIKEY_VAL;
              paramgetoneuserops.NM_TABLE      = value.NM_TABLE;

              SecuredFac.GetOneUserOps(paramgetoneuserops)
              .then(function(responsegetonesuseroperasionalserver)
              {
                  var paramuserops = {};
                  paramuserops.ACCESS_ID = value.PRIMARIKEY_VAL;
                  UserOpsLiteFac.GetUserOperationalByAccessID(paramuserops)
                  .then(function(responsegetoneuseropslocal)
                  {
                      if(value.TYPE_ACTION == 1 && responsegetoneuseropslocal.length == 0)
                      {
                          responsegetonesuseroperasionalserver.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                          responsegetonesuseroperasionalserver.STORE_ID      = parameters.STORE_ID;
                          responsegetonesuseroperasionalserver.password      = '';
                          UserOpsLiteFac.CreateUserOperationals(responsegetonesuseroperasionalserver,'FROM-SERVER');
                      }
                      else if(value.TYPE_ACTION == 2 && responsegetoneuseropslocal.length > 0)
                      {
                          responsegetonesuseroperasionalserver.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                          responsegetonesuseroperasionalserver.STORE_ID      = parameters.STORE_ID;
                          responsegetonesuseroperasionalserver.password      = '';
                          UserOpsLiteFac.UpdateUserOperationals(responsegetonesuseroperasionalserver,'FROM-SERVER');
                      }
                  },
                  function(error)
                  {
                      console.log(error);
                  })
              },
              function(error)
              {
                  console.log(error);
              });
          }

          else if(value.NM_TABLE == 'TBL_USER_PROFILE')
          {
              var paramgetoneprofileuserops           = {};
              paramgetoneprofileuserops.ACCESS_GROUP  = parameters.ACCESS_GROUP;
              paramgetoneprofileuserops.STORE_ID      = parameters.STORE_ID;
              paramgetoneprofileuserops.ACCESS_ID     = value.PRIMARIKEY_VAL;
              paramgetoneprofileuserops.NM_TABLE      = value.NM_TABLE;

              SecuredFac.GetOneProfileUserOps(paramgetoneprofileuserops)
              .then(function(responsegetoneprofileuseroperasionalserver)
              {
                    var paramuserprofile        = {};
                    paramuserprofile.ACCESS_ID  = value.PRIMARIKEY_VAL;
                    UserOpsLiteFac.GetOneProfileUserOps(paramuserprofile)
                    .then(function(responsegetoneuserprofilelocal)
                    {
                        if(value.TYPE_ACTION == 1 && responsegetoneuserprofilelocal.length == 0)
                        {

                        }
                        else if(value.TYPE_ACTION == 2 && responsegetoneuserprofilelocal.length > 0)
                        {

                        }
                    },
                    function(error)
                    {
                        console.log(error);
                    });
              },
              function(error)
              {
                  console.log(error);
              })
          }

          
      });
    }

    return {
      SyncServerToLocal:SyncServerToLocal
    };
});