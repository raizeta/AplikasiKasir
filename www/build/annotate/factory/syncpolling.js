angular.module('starter')
.factory('SyncPollingFac',['PPOBFac','OfflineLiteFac','OpenCloseBookLiteFac','OpenCloseBookFac','MerchantsFac','MerchantsLiteFac','StoresLiteFac','StoresFac','CustomersLiteFac','CustomersFac','KaryawansLiteFac','KaryawansFac','ShopCartLiteFac','TransaksiCombFac','TransaksisFac','TransaksisLiteFac','ProductStockLiteFac','ProductsFac','ProductsLiteFac','$rootScope','$q','UtilService', 
function(PPOBFac,OfflineLiteFac,OpenCloseBookLiteFac,OpenCloseBookFac,MerchantsFac,MerchantsLiteFac,StoresLiteFac,StoresFac,CustomersLiteFac,CustomersFac,KaryawansLiteFac,KaryawansFac,ShopCartLiteFac,TransaksiCombFac,TransaksisFac,TransaksisLiteFac,ProductStockLiteFac,ProductsFac,ProductsLiteFac,$rootScope,$q,UtilService) 
{
    var SyncOfflineToServer = function()
    {
        var deferred            = $q.defer();
        OfflineLiteFac.GetOffline()
        .then(function(responseoffline)
        {
            var promises = [];
            angular.forEach(responseoffline,function(valueoffline,key)
            {
                if(valueoffline.NAMA_TABEL == 'Tbl_Transaksis')
                {
                    var promise = TransaksisLiteFac.GetTransaksiHeaderByTransID(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        TransaksisFac.CreateTransaksiHeaders(responselite[0])
                        .then(function(ressavetoserver)
                        {
                           $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                           OfflineLiteFac.UpdateOffline(valueoffline)
                           .then(function(response)
                           {
                                deferred.resolve(response)
                           },
                           function(error)
                           {
                                deferred.reject(error)
                           });   
                        },
                        function(error)
                        {
                            if(error == 'data-exist')
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                               .then(function(response)
                               {
                                    deferred.resolve(response)
                               },
                               function(error)
                               {
                                    deferred.reject(error)
                               })   
                            }
                            else
                            {
                                deferred.reject(error);
                            }
                        });
                    },
                    function(errorlite)
                    {
                        deferred.reject(errorlite);
                    });
                    promises.push(promise);
                }
                
                else if(valueoffline.NAMA_TABEL == 'Tbl_ShopCart')
                {
                    var promise = ShopCartLiteFac.GetShopCartByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave              = responselite[0];
                        datatosave.PRODUCT_QTY      = datatosave.QTY_INCART;
                        datatosave.STATUS           = 1;
                        TransaksisFac.CreateTranskasiDetails(datatosave)
                        .then(function(ressavetoserver)
                        {
                            $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                            OfflineLiteFac.UpdateOffline(valueoffline)
                            .then(function(response)
                            {
                                deferred.resolve(response)
                            },
                            function(error)
                            {
                                deferred.reject(error)
                            });
                        },
                        function(error)
                        {
                            deferred.reject(error);
                        });
                    },
                    function(error)
                    {
                        deferred.reject(error);
                    })
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_ShopCartRefund')
                {
                    var promise = ShopCartLiteFac.GetShopCartRefundByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave              = responselite[0];
                        datatosave.PRODUCT_QTY      = datatosave.QTY_INCART;
                        datatosave.STATUS           = 1;
                        TransaksisFac.CreateTranskasiDetails(datatosave)
                        .then(function(ressavetoserver)
                        {
                            $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                            OfflineLiteFac.UpdateOffline(valueoffline)
                            .then(function(response)
                            {
                                deferred.resolve(response)
                            },
                            function(error)
                            {
                                deferred.reject(error)
                            });
                        },
                        function(error)
                        {
                            deferred.reject(error);
                        });
                    },
                    function(error)
                    {
                        deferred.reject(error);
                    })
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Product_Stocks')
                {
                    var promise = ProductStockLiteFac.GetProductStockByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        ProductsFac.CreateProductStocks(datatosave)
                        .then(function(ressavetoserver)
                        {
                            $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                            OfflineLiteFac.UpdateOffline(valueoffline)
                            .then(function(response)
                            {
                                deferred.resolve(response)
                            },
                            function(error)
                            {
                                deferred.reject(error)
                            });
                        },
                        function(error)
                        {
                            deferred.reject(error);
                        });
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Product_Hargas')
                {
                    var promise = ProductStockLiteFac.GetProductHargaByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        ProductsFac.CreateProductHargas(datatosave)
                        .then(function(ressavetoserver)
                        {
                            $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                            OfflineLiteFac.UpdateOffline(valueoffline)
                            .then(function(response)
                            {
                                deferred.resolve(response)
                            },
                            function(error)
                            {
                                deferred.reject(error)
                            });
                        },
                        function(error)
                        {
                            deferred.reject(error);
                        });
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_KaryawanAbsensis')
                {
                    var promise = KaryawansLiteFac.GetKaryawanAbsensisByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        KaryawansFac.CreateKaryawanAbsensis(datatosave)
                        .then(function(ressavetoserver)
                        {
                            $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                            OfflineLiteFac.UpdateOffline(valueoffline)
                            .then(function(response)
                            {
                                deferred.resolve(response)
                            },
                            function(error)
                            {
                                deferred.reject(error)
                            });
                        },
                        function(error)
                        {
                            deferred.reject(error);
                        });
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Products')
                {
                    var promise = ProductsLiteFac.GetProductByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        datatosave.CURRENT_PRICE  = datatosave.HARGA_JUAL;

                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            ProductsFac.CreateProducts(datatosave)
                            .then(function(ressavetoserver)
                            {
                                $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if(valueoffline.TYPE_ACTION == 2)
                        {
                            ProductsFac.UpdateProducts(datatosave)
                            .then(function(responseupdatetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error)
                            });
                        }
                        else
                        {
                            ProductsFac.DeleteProducts(datatosave)
                            .then(function(responseupdatetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error)
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Product_Groups')
                {
                    var promise = ProductsLiteFac.GetProductGroupsByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            ProductsFac.CreateProductGroups(datatosave)
                            .then(function(ressavetoserver)
                            {
                                $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if (valueoffline.TYPE_ACTION == 2)
                        {
                            ProductsFac.UpdateProductGroups(datatosave)
                            .then(function(ressavetoserver)
                            {
                                $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }

                        else
                        {
                            ProductsFac.DeleteProductGroups(datatosave)
                            .then(function(ressavetoserver)
                            {
                                $rootScope.$broadcast('syncofflinetoserver',valueoffline);
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Karyawans')
                {
                    var promise = KaryawansLiteFac.GetKaryawanByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            KaryawansFac.CreateKaryawans(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if(valueoffline.TYPE_ACTION == 2)
                        {
                            KaryawansFac.UpdateKaryawans(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else
                        {
                            KaryawansFac.DeleteKaryawans(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Customers')
                {
                    var promise = CustomersLiteFac.GetCustomerByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            CustomersFac.CreateCustomers(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if(valueoffline.TYPE_ACTION == 2)
                        {
                            CustomersFac.UpdateCustomers(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else
                        {
                            CustomersFac.DeleteCustomers(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Stores')
                {
                    var promise = StoresLiteFac.GetStoreByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            StoresFac.CreateStores(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if(valueoffline.TYPE_ACTION == 2)
                        {
                            StoresFac.UpdateStores(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }

                        else
                        {
                            StoresFac.DeleteStores(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Merchants')
                {
                    var promise = MerchantsLiteFac.GetMerchantByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            MerchantsFac.CreateMerchants(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if(valueoffline.TYPE_ACTION == 2)
                        {
                            MerchantsFac.UpdateMerchants(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }

                        else
                        {
                            MerchantsFac.DeleteMerchants(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }
                
                else if(valueoffline.NAMA_TABEL == 'Tbl_MerchantTypes')
                {
                    var promise = MerchantsLiteFac.GetMerchantTypeByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            MerchantsFac.CreateMerchantTypes(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if(valueoffline.TYPE_ACTION == 2)
                        {
                            MerchantsFac.UpdateMerchantTypes(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }

                        else
                        {
                            MerchantsFac.DeleteMerchantTypes(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_OpenCloseBook')
                {
                    var promise = OpenCloseBookLiteFac.GetOpenCloseBookByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            OpenCloseBookFac.CreateOpenCloseBook(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if(valueoffline.TYPE_ACTION == 2)
                        {
                            OpenCloseBookFac.UpdateOpenCloseBook(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }

                else if(valueoffline.NAMA_TABEL == 'Tbl_Setoran')
                {
                    var promise = OpenCloseBookLiteFac.GetSetoranBookByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            OpenCloseBookFac.CreateSetoranBook(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                        else if(valueoffline.TYPE_ACTION == 2)
                        {
                            OpenCloseBookFac.UpdateSetoranBook(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }
                else if(valueoffline.NAMA_TABEL == 'Tbl_ShopCartPPOB')
                {
                    var promise = ShopCartLiteFac.GetShopCartPPOBByIDLocal(valueoffline.PRIMARY_KEY)
                    .then(function(responselite)
                    {
                        var datatosave            = responselite[0];
                        if(valueoffline.TYPE_ACTION == 1)
                        {
                            PPOBFac.CreateTransaksi(datatosave)
                            .then(function(ressavetoserver)
                            {
                                OfflineLiteFac.UpdateOffline(valueoffline)
                                .then(function(response)
                                {
                                    deferred.resolve(response)
                                },
                                function(error)
                                {
                                    deferred.reject(error)
                                });
                            },
                            function(error)
                            {
                                deferred.reject(error);
                            });
                        }
                    },
                    function(error)
                    {
                        deferred.reject(error)
                    });
                    promises.push(promise);
                }
            });
            $q.all(promises).then(function(result)
            {
                deferred.resolve("Sukses")
            },
            function(error)
            {
                deferred.resolve("Gagal");
            })
        },
        function(error)
        {
            deferred.reject(error)
        });
        return deferred.promise;
    }


    return {
                SyncOfflineToServer:SyncOfflineToServer
            };
}])