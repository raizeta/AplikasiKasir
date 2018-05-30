angular.module('starter')
.controller('CashierCtrl',['ToastService','PPOBFac','PPOBCombFac','ProviderPrefixService','MenuService','OpenCloseBookLiteFac','OpenCloseBookCombFac','TransaksiCombFac','TransaksisLiteFac','MerchantsCombFac','CustomersCombFac','CustomersLiteFac','ProductsCombFac','ProductsLiteFac','ShopCartLiteFac','SaveToBillLiteFac','$cordovaBarcodeScanner','$cordovaDialogs','$cordovaToast','$ionicPopup','$ionicPopover','$window','$rootScope','$ionicHistory','$timeout','$ionicPosition','$scope','$state','$location','$ionicLoading','$ionicScrollDelegate','$ionicPopup','$ionicModal','$filter','UtilService','ConstructorService','StorageService','TemplateService',
function(ToastService,PPOBFac,PPOBCombFac,ProviderPrefixService,MenuService,OpenCloseBookLiteFac,OpenCloseBookCombFac,TransaksiCombFac,TransaksisLiteFac,MerchantsCombFac,CustomersCombFac,CustomersLiteFac,ProductsCombFac,ProductsLiteFac,ShopCartLiteFac,SaveToBillLiteFac,$cordovaBarcodeScanner,$cordovaDialogs,$cordovaToast,$ionicPopup,$ionicPopover,$window,$rootScope,$ionicHistory,$timeout,$ionicPosition,$scope,$state,$location,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$ionicModal,$filter,UtilService,ConstructorService,StorageService,TemplateService)
{
    $scope.pakaippnatautidak        = {checked:false,display:false};

    $scope.titleheader              = StorageService.get('advanced-profile').STORES_ACTIVE.STORE_NM;
    $scope.jumlahnilaideposit       = 50000;
    MenuService.GetMenuRevisiPPOB()
    .then(function(response)
    {
        $scope.groupsmenu = response;
    })

    $scope.toggleheaderGroup = function(group) 
    {
        if(group.items)
        {
            if ($scope.isheaderGroupShown(group)) 
            {
                $scope.shownGroup = null;
            } 
            else 
            {
                $scope.shownGroup = group;
            }
        }
        else
        {
            $scope.shownGroup = group;
        }
    };
    
    $scope.isheaderGroupShown = function(group) 
    {
        return $scope.shownGroup === group;
    };

    
    $scope.updateSelection = function(position, itens, title) 
    {
        angular.forEach(itens, function(subscription, index) 
        {
            if (position != index)
            {
                subscription.checked = false;    
            }
            else
            {
                subscription.checked = true;
            }
            $scope.pelangganradio = {valuechoose:title};
        });
    }

    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        if($scope.popovermenumore)
        {
            $scope.popovermenumore.hide();
        }
        else if($scope.popovermenuppob)
        {
            $scope.popovermenuppob.hide();
        }
        $scope.$apply();
    }, false);

    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {        
        $scope.searchpelanggan = {'string':''};
        $scope.kirimkemail     = {'valuechoose':'TIDAK'};
        
        $scope.alasan = [
                        {'todo':'REGULAR','checked':true},
                        {'todo':'MEMBER','checked':false}
                    ];
        

        var defaultconfig = StorageService.get('default-config');
        if(defaultconfig)
        {
            $scope.gridornot    = {grid:defaultconfig.grid};
            $scope.soundon      = {on:defaultconfig.on};
        }
        else
        {
            $scope.gridornot        = {grid: true};
            $scope.soundon          = {on:true};  
        }
        
        $scope.modelayar        = {'cashier':true,'pembelian':false,'pembayaran':false,'transfer':false};
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        })
        .then(function()
        {
            var parameters = UtilService.GetParameters();
            OpenCloseBookCombFac.GetOpenCloseBook(parameters)
            .then(function(responseopenbook)
            {
                return responseopenbook;      
            })
            .then(function(responseopenbook)
            {
                var parameters      = UtilService.GetParameters();
                parameters.STATUS   = 2;
                OpenCloseBookLiteFac.GetOpenCloseBookWithStatus(parameters)
                .then(function(responsehasopenclosebook)
                {
                    if(angular.isArray(responsehasopenclosebook) && responsehasopenclosebook.length > 0)
                    {
                        $scope.openbookdata                 = responsehasopenclosebook[responsehasopenclosebook.length-1];
                        $scope.openbookdata.sudahopenbelum  = true;
                        var parameters                      = UtilService.GetParameters();
                        parameters.OPENCLOSE_ID             = $scope.openbookdata.OPENCLOSE_ID;
                        StorageService.set('basic-parameters',parameters);  
                    }
                    else
                    {
                        var parameters                          = UtilService.GetParameters();
                        $scope.openbookdata                     = ConstructorService.OpenCloseBookConstructor();
                        $scope.openbookdata.OPENCLOSE_ID        = parameters.STORE_ID + '.' + $filter('date')(new Date(),'yyMMddHHmmss');
                        $scope.openbookdata.SPLIT_OPENCLOSE_ID  = $scope.openbookdata.OPENCLOSE_ID.split('.')[2];
                        $scope.openbookdata.sudahopenbelum      = false;    
                    }
                });   
            })
            .then(function()
            {
                TransaksiCombFac.GetTransaksiHeaders(parameters)
                .then(function(responsetransheader)
                {
                    return responsetransheader;
                },
                function(error)
                {
                    console.log(error);
                });
            })
            .then(function()
            {
                ProductsCombFac.GetProductGroups(parameters)
                .then(function(responsegroups)
                {
                    $scope.productgroups = responsegroups;
                },
                function(errorgroups)
                {
                    console.log(errorgroups)
                });
            })
            .then(function()
            {
                CustomersCombFac.GetCustomers(parameters)
                .then(function(responsegetcustomer)
                {
                    $scope.datacustomers  = responsegetcustomer;
                },
                function(errorgetcustomer)
                {
                    console.log(errorgetcustomer);
                });
            })
            .then(function()
            {
                MerchantsCombFac.GetMerchantTypes()
                .then(function(responsemerchanttypes)
                {
                    $scope.typepembayarans              = responsemerchanttypes;
                    $scope.choicetypepembayarandefault  = $scope.typepembayarans[0];
                    $scope.provider                     = {valuechoose:null};   
                },
                function(error)
                {
                    console.log(error);
                });    
            })
            .then(function()
            {  
                MerchantsCombFac.GetMerchants(parameters)
                .then(function(resgetmerchants)
                {
                    $scope.listmerchants = resgetmerchants;
                },
                function(error)
                {
                    console.log(error);
                });
            })
            .then(function()
            {
                $scope.loadnomortransaksiheaders();  
            })
            .finally(function()
            {
                $ionicLoading.hide();
            });
        });
    });    
/** AKHIR DARI CONFIGURATION FUNCTION **/

/** AWAL DARI OPENBOOK FUNCTION **/
    $scope.modalopenclosebookopen = function()
    {
        $ionicModal.fromTemplateUrl('templates/sales/modalopenclosebook.html', 
        {
            scope: $scope,
            backdropClickToClose: true,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalopenclosebook);
            if(resultcheckmodal)
            {
                $scope.modalopenclosebook  = modal;
                $scope.modalopenclosebook.show();
            }
        });
    }
    
    $scope.openbooksubmit = function()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        OpenCloseBookLiteFac.CreateOpenCloseBook($scope.openbookdata)
        .then(function(responseopenclosebook)
        {
            $scope.openbookdata.ID_LOCAL    = responseopenclosebook.ID_LOCAL;
            var parameters                  = UtilService.GetParameters();
            parameters.OPENCLOSE_ID         = $scope.openbookdata.OPENCLOSE_ID;
            StorageService.set('basic-parameters',parameters);
            
            $scope.openbookdata.sudahopenbelum = true;
            $timeout(function() 
            {
                $ionicLoading.hide();
                $scope.modalopenclosebook.remove();
                ToastService.ShowToast('Buka Buku Sukses.Sekarang Kamu Sudah Dapat Melakukan Transaksi.','success');
            }, 3000);
        },
        function(error)
        {
            console.log(error);
        }); 
    }

    $scope.openbookclose = function()
    {
        $scope.modalopenclosebook.remove();    
    }
/** AKHIR DARI OPENBOOK FUNCTION **/

/** AWAL DARI LOAD PRODUCT,PRODUCT IN CART, NEW TRANSACTION FUNCTION **/
    $scope.loadproductforsale = function()
    {
        var parameters                  = UtilService.GetParameters();
        parameters.IS_FAVORITE          = StorageService.get('show-favorite');
        $scope.displayproductfavorite   = StorageService.get('show-favorite');
        ProductsCombFac.GetProducts(parameters)
        .then(function(responsebarangpenjualan)
        {
            if(angular.isArray(responsebarangpenjualan) && responsebarangpenjualan.length > 0)
            {
                
                angular.forEach($scope.itemincart,function(value,key)
                {
                    var itemaddtocart = _.findIndex(responsebarangpenjualan, {'PRODUCT_ID': value.PRODUCT_ID});
                    if(itemaddtocart != -1)
                    {
                        responsebarangpenjualan[itemaddtocart].QTY_INCART = Number(value.QTY_INCART);
                    }
                });
                $scope.databarangpenjualan = responsebarangpenjualan;
            }
            else
            {
                $scope.databarangpenjualan = [];
            }
        },
        function(error)
        {
            console.log(error);
        });
    }
    $scope.$on('update-notifproduct',function()
    {
        $scope.loadproductforsale();  
    });

    $scope.loaditemincart = function()
    {
        var parameters          = UtilService.GetParameters();
        parameters.TRANS_ID     = $scope.nomortransaksiheader;
        ShopCartLiteFac.GetShopCartByNomorTrans(parameters)
        .then(function(response)
        {
            if(angular.isArray(response) && response.length > 0)
            {
                $scope.itemincart =response;
            }
            else
            {
                $scope.itemincart = [];
            }
            $scope.loadproductforsale();
        },
        function(error)
        {
            console.log(error);
        })
        .finally(function()
        {
            if($ionicLoading)
            {
                $ionicLoading.hide();
            }
        });
    }

    $scope.loadnomortransaksiheaders = function()
    {
        
        var parameters                  = UtilService.GetParameters();
        $scope.nomortransaksiheader     = UtilService.GenerateNomorTransaksi(null,parameters);
        $timeout(function()
        {
            $scope.loaditemincart();
        },1000);
    }
    

    $scope.createnewtransaksiheader = function()
    {
        TransaksiCombFac.GetTransaksiHeaderByTransID($scope.nomortransaksiheader)
        .then(function(responsetransaksiid)
        {
            if(responsetransaksiid.length == 0)
            {
                var parameters              = ConstructorService.TransaksiHeaderConstructor($scope.nomortransaksiheader,'manual');
                parameters.OPENCLOSE_ID     = $scope.openbookdata.OPENCLOSE_ID;
                parameters.TOTAL_PRODUCT    = $scope.itemincart.length;
                parameters.SUB_TOTAL_HARGA  = $scope.totalpembayaran;
                parameters.PPN              = 0;
                parameters.TOTAL_HARGA      = Number($scope.totalpembayaran) * ( 1 + (parameters.PPN/100));
                TransaksisLiteFac.CreateTransaksiHeaders(parameters)
                .then(function(rescreatetransaksiheader)
                {
                    $timeout(function () 
                    {
                        $scope.loadnomortransaksiheaders();
                    });
                },
                function(error)
                {
                    console.log(error)
                }); 
            }
            else
            {
                $timeout(function () 
                {
                    $scope.loadnomortransaksiheaders();
                });
            }
        },
        function(error)
        {
            console.log(error);
        })  
    }

    $scope.showproductfavorite = function()
    {
        $scope.modegroup              = false;
        $scope.modefavorit            = true;

        $scope.displayproductgroup    = false;
        $scope.displayproductfavorite = !$scope.displayproductfavorite;
        if($scope.displayproductfavorite)
        {
          $scope.displayproductfavorite = 1;
          $scope.filterfavorite = 1;  
        }
        else
        {
            $scope.displayproductfavorite = 0;
            $scope.filterfavorite = undefined;  
        }
    }

    $scope.addorrevomvefromfavorite = function(itemproduct,indexproduct)
    {
        var itemproduct     = angular.copy(itemproduct);
        if(itemproduct.IS_FAVORITE == 0)
        {
            itemproduct.IS_FAVORITE                 = 1;
        }
        else
        {
            itemproduct.IS_FAVORITE                 = 0;
        }


        var datatoaddorremovefromfavorite           = {};
        datatoaddorremovefromfavorite.IS_FAVORITE   = itemproduct.IS_FAVORITE;
        datatoaddorremovefromfavorite.PRODUCT_ID    = itemproduct.PRODUCT_ID;

        ProductsLiteFac.AddOrRemoveFromFavorite(datatoaddorremovefromfavorite)
        .then(function(responseaddremovefavorite)
        {
            var indexproduct = _.findIndex($scope.databarangpenjualan,{'PRODUCT_ID':itemproduct.PRODUCT_ID});
            $timeout(function()
            {
                $scope.databarangpenjualan[indexproduct] = itemproduct;
            },0)
        })
        .then(function()
        {

            if(itemproduct.IS_FAVORITE == 1)
            {
                ToastService.ShowToast(itemproduct.PRODUCT_NM + ' Berhasil Ditambahkan Ke Favorite.','success');
            }
            else
            {
                ToastService.ShowToast(itemproduct.PRODUCT_NM + ' Berhasil Dikeluarkan Dari Favorite.','error');
            }


        },
        function(error)
        {
            ToastService.ShowToast('Product Favorit Error','error');
        });  
    }

    $scope.showproductgroup = function()
    {
        $scope.displayproductgroup = !$scope.displayproductgroup;
    }

    $scope.chooseproductgroup = function(itemgroup)
    {
        $scope.modefavorit = false;
        $scope.modegroup   = true;

        if(itemgroup)
        {
            StorageService.set('show-group',itemgroup);
            $scope.filtergroup            = itemgroup.GROUP_ID;
            $scope.namagroup   = angular.copy(itemgroup.GROUP_NM);
        }
        else
        {
            $scope.filtergroup            = undefined;
            $scope.filterfavorite         = undefined;
            $scope.displayproductfavorite = 0;   
        }
        $scope.displayproductgroup    = false;
    }
/** AKHIR DARI LOAD PRODUCT,PRODUCT IN CART, NEW TRANSACTION FUNCTION **/

/** AWAL DARI ADD TO CART FUNCTION**/
    $scope.aktifkanscanbarcode = false;
    $scope.scanbarcode = function()
    {
        $scope.aktifkanscanbarcode = true;
        var nymph = require('nymph');
        nymph.dev.scanner.startScan(20, function (err, result)
        {
            if (err)
            {
                if(err.code == 'CANCELLED')
                {
                    $scope.aktifkanscanbarcode = false;
                }
                else if(err.code == 'TIMEOUT')
                {
                    ToastService.ShowToast('Timeout','error');
                }
            }
            else
            {
                var indexproduct    = _.findIndex($scope.databarangpenjualan,{'PRODUCT_QR':result});
                if(indexproduct > -1)
                {
                    $scope.tambahqtyitem($scope.databarangpenjualan[indexproduct],indexproduct);
                    $timeout(function()
                    {
                        $scope.scanbarcode();
                    },500);
                }
                else
                {
                    ToastService.ShowToast('Barcode Produk Belum Terdaftar','error');
                    $timeout(function()
                    {
                        $scope.scanbarcode();
                    },500);
                }
            }
        });

    }

    $scope.tambahqtyitem = function(itemproduct,indexproduct)
    {
        var itemproduct     = angular.copy(itemproduct);
        var indexproduct    = _.findIndex($scope.databarangpenjualan,{'PRODUCT_ID':itemproduct.PRODUCT_ID});
        if($scope.openbookdata.sudahopenbelum)
        {
            if($scope.soundon.on)
            {
                $scope.audio = new Audio('img/beep-07.wav');
                $scope.audio.play();
            }
            if(itemproduct.CURRENT_STOCK > 0)
            {
                var parameters                          = UtilService.GetParameters();
                var datashopcarttosave                  = ConstructorService.ProductAddToShopCart(itemproduct);
                datashopcarttosave.ACCESS_ID            = parameters.ACCESS_ID;
                datashopcarttosave.TRANS_ID             = $scope.nomortransaksiheader;
                datashopcarttosave.OFLINE_ID            = $scope.nomortransaksiheader;

                if(itemproduct.QTY_INCART && itemproduct.QTY_INCART > 0)
                {
                    itemproduct.QTY_INCART        += 1;
                    datashopcarttosave.QTY_INCART  = itemproduct.QTY_INCART;
                    var index_itemincart           = _.findIndex($scope.itemincart,{'PRODUCT_ID': itemproduct.PRODUCT_ID});
                    $scope.itemincart[index_itemincart].QTY_INCART += 1;
                    ShopCartLiteFac.UpdateShopCartQty(datashopcarttosave);
                }
                else
                {
                    itemproduct.QTY_INCART         = 1;
                    datashopcarttosave.QTY_INCART  = itemproduct.QTY_INCART;
                    $scope.banyakdicart           += 1;
                    $scope.itemincart.push(datashopcarttosave);
                    ShopCartLiteFac.CreateShopCart(datashopcarttosave);
                }
                itemproduct.CURRENT_STOCK               -= 1;
                $scope.databarangpenjualan[indexproduct] = itemproduct;
                datashopcarttosave.CURRENT_STOCK         = itemproduct.CURRENT_STOCK;
                ProductsLiteFac.UpdateProductsQuantity(datashopcarttosave);
            }
            else
            {
                ToastService.ShowToast('Quantity Tidak Mencukupi','error');
            }

        }
        else
        {
            $scope.modalopenclosebookopen();
        }
    }

    $scope.OpenModalAddToCart = function(item,mode) 
    {
        if($scope.openbookdata.sudahopenbelum)
        {
            if(mode == 'fromcart')
            {
                var index_itemdicart    = _.findIndex($scope.databarangpenjualan,{'PRODUCT_ID':item.PRODUCT_ID});
                $scope.itemdimodal      = angular.copy($scope.databarangpenjualan[index_itemdicart]);
            }
            else
            {
                $scope.itemasli     = angular.copy(item);
                $scope.itemdecinc   = angular.copy(item);
                $scope.itemdimodal  = angular.copy(item);   
            }
            
            $ionicModal.fromTemplateUrl('templates/sales/addtocart/modaladdtocart.html', 
            {
                scope: $scope,
                animation: 'fade-in-scale',
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            })
            .then(function(modal) 
            {
                $scope.modaladdtocart            = modal;
                $scope.modaladdtocart.show();
                if(!angular.isDefined($scope.itemdimodal.QTY_INCART))
                {
                    $scope.itemdimodal.QTY_INCART = 0;
                }
                
            });
        }
        else
        {
            $scope.modalopenclosebookopen();
        }  
    };

    $scope.CloseModalAddToCart = function() 
    {
        var indexbarangpenjualan                            = _.findIndex($scope.databarangpenjualan,{'PRODUCT_ID':$scope.itemdimodal.PRODUCT_ID});
        var indexbarangidicart                              = _.findIndex($scope.itemincart,{'PRODUCT_ID':$scope.itemdimodal.PRODUCT_ID});
        $scope.databarangpenjualan[indexbarangpenjualan]    = $scope.itemdimodal;
        if(indexbarangidicart >= 0)
        {
            $scope.itemincart[indexbarangidicart].QTY_INCART    = $scope.itemdimodal.QTY_INCART;   
        }
        
        ShopCartLiteFac.GetShopCartByItemAndNoTrans($scope.itemdimodal.PRODUCT_ID,$scope.nomortransaksiheader)
        .then(function(response)
        {
            var parameters                          = UtilService.GetParameters();
            var datashopcarttosave                  = ConstructorService.ProductAddToShopCart($scope.itemdimodal);
            datashopcarttosave.ACCESS_ID            = parameters.ACCESS_ID;
            datashopcarttosave.TRANS_ID             = $scope.nomortransaksiheader;
            datashopcarttosave.CURRENT_STOCK        = $scope.itemdimodal.CURRENT_STOCK;

            if(angular.isArray(response) && response.length > 0)
            {
                if($scope.itemdimodal.QTY_INCART > 0)
                {
                    ShopCartLiteFac.UpdateShopCartQty(datashopcarttosave)
                    .then(function(response)
                    {
                        ProductsLiteFac.UpdateProductsQuantity(datashopcarttosave)
                        .then(function(response)
                        {
                            console.log(response);
                        },
                        function(error)
                        {
                            console.log(error);
                        });
                    });  
                }
                else
                {
                    ShopCartLiteFac.DeleteShopCartByNoTransAndItemId(datashopcarttosave)
                    .then(function(response)
                    {
                        ProductsLiteFac.UpdateProductsQuantity(datashopcarttosave)
                        .then(function(response)
                        {
                            console.log(response);
                        },
                        function(error)
                        {
                            console.log(error);
                        });
                    });
                    $scope.banyakdicart     -= 1;
                    $timeout(function() 
                    {
                        $scope.itemincart.splice(indexbarangidicart,1);
                    }, 10);
                    
                } 
            }
            else
            {
                if($scope.itemdimodal.QTY_INCART > 0)
                {
                    $scope.itemincart.push(datashopcarttosave);
                    $scope.banyakdicart     += 1;
                    ShopCartLiteFac.CreateShopCart(datashopcarttosave)
                    .then(function(response)
                    {
                        ProductsLiteFac.UpdateProductsQuantity(datashopcarttosave)
                        .then(function(response)
                        {
                            console.log(response);
                        },
                        function(error)
                        {
                            console.log(error);
                        });
                    });  
                }
            }
        });
        $scope.modaladdtocart.remove();
    };

    $scope.CancelModalAddToCart = function() 
    {
        $scope.modaladdtocart.remove();
    }

    $scope.incdec = function(incdec)
    {
        $scope.itemdimodal.QTY_INCART       = Number($scope.itemdimodal.QTY_INCART);
        $scope.itemdimodal.CURRENT_STOCK    = Number($scope.itemdimodal.CURRENT_STOCK)
        if(incdec == 'inc')
        {
            if($scope.soundon.on)
            {
                $scope.audio = new Audio('img/beep-07.wav');
                $scope.audio.play();   
            }
            $scope.itemdimodal.CURRENT_STOCK         -= 1;
            if($scope.itemdimodal.CURRENT_STOCK >= 0) 
            {
                $scope.itemdimodal.QTY_INCART         += 1;
            }
            else
            {
                $scope.itemdimodal.CURRENT_STOCK       = 0;  
            }    
        }
        else if(incdec == 'dec')
        {
            if($scope.soundon.on)
            {
                $scope.audio = new Audio('img/beep-5.wav');
                $scope.audio.play();
            }
            if($scope.itemdimodal.QTY_INCART > 0)
            {
                $scope.itemdimodal.QTY_INCART         -= 1;
                $scope.itemdimodal.CURRENT_STOCK      += 1;   
            } 
        }
    }

    $scope.clearquantity = function()
    {
        $scope.itemdimodal.QTY_INCART       = Number($scope.itemdimodal.QTY_INCART);
        $scope.itemdimodal.CURRENT_STOCK    = Number($scope.itemdimodal.CURRENT_STOCK)

        $scope.itemdimodal.CURRENT_STOCK    += $scope.itemdimodal.QTY_INCART;
        $scope.itemdimodal.QTY_INCART        = 0;
    }

    $scope.openmodalclearitemshopcart = function()
    {
        if($scope.itemincart.length > 0)
        {
            var itemincarttodelete = angular.copy($scope.itemincart);
            
            $cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus Semua Item Di Keranjang Belanja ?', ['Delete','Cancel'])
            .then(function(buttonIndex) 
            {
                var btnIndex = buttonIndex;
                if(buttonIndex == 1)
                {
                    angular.forEach(itemincarttodelete,function(value,key)
                    {
                        var indexproduct            = _.findIndex($scope.databarangpenjualan,{'PRODUCT_ID':value.PRODUCT_ID});
                        var dataproduct             = $scope.databarangpenjualan[indexproduct];
                        dataproduct.CURRENT_STOCK   = Number(dataproduct.CURRENT_STOCK) + Number(value.QTY_INCART);
                        ProductsLiteFac.UpdateProductsQuantity(dataproduct);
                    });
                    TransaksiCombFac.GetTransaksiHeaderByTransID($scope.nomortransaksiheader)
                    .then(function(responsetransaksiid)
                    {
                        if(responsetransaksiid.length > 0)
                        {
                            TransaksisLiteFac.DeleteTransaksiHeadersByTransID($scope.nomortransaksiheader);
                            SaveToBillLiteFac.DeleteSaveToBillByNomorTrans($scope.nomortransaksiheader);
                        }
                        ShopCartLiteFac.DeleteItemFromShopCartByNoTrans($scope.nomortransaksiheader);
                        $scope.loadnomortransaksiheaders();
                        ToastService.ShowToast('Keranjang Belanja Berhasil Dikosongkan.','success');
                    }); 
                }
            });
        }
        
    }
/** AKHIR DARI ADD TO CART FUNCTION**/

/** AWAL DARI PEMBAYARAN FUNCTION **/
    //Fungsi Ini Berfungsi Hanya Untuk Layar Kecil Saja
    $scope.openmodalviewitemincart = function()
    {
        $ionicModal.fromTemplateUrl('templates/sales/pembayaran/viewitemincart.html', 
        {
            scope: $scope,
            animation: 'slide-in-left',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalviewitemincart);
            if(resultcheckmodal)
            {
                $scope.modalviewitemincart          = modal;
                $scope.modalviewitemincart.show();
            }
        });   
    }

    $scope.closemodalviewitemincart = function()
    {
        $scope.modalviewitemincart.remove();   
    }

    $scope.openmodalpembayaran = function(noresi,totalpembayaran)
    {
        $scope.totalpembayaransebelumpajak  = totalpembayaran;
        if($scope.pakaippnatautidak.checked)
        {
            $scope.biayapajak               = totalpembayaran * 0.1;
            $scope.totalpembayaran          = Math.round(totalpembayaran * 1.1/50)*50;
        }
        else
        {
           $scope.biayapajak               = 0;
           $scope.totalpembayaran          = totalpembayaran; 
        }

        $scope.yangdibayarkan           = UtilService.PembayaranFunc($scope.totalpembayaran);
        $scope.radiopembayaranchange($scope.totalpembayaran);
        $ionicModal.fromTemplateUrl('templates/sales/pembayaran/modalpembayaran.html', 
        {
            scope: $scope,
            animation: 'slide-in-left',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.pelangganradio           = {'valuechoose':'REGULAR'};
            $scope.datapelanggan            = {};
            $scope.statusdonasi             = {'checked':false};
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalpembayaran);
            if(resultcheckmodal)
            {
                $scope.modalpembayaran          = modal;
                $scope.modalpembayaran.show();
            }
        });
    }

    $scope.closemodalpembayaran = function()
    {
        $scope.modalpembayaran.remove();
    }

    //Fungsi Yang Digunakan Untuk Memilih Tipe Pembaran Apakah Tunai Atau Non-Tunai
    //Default Type Pembayaran Yang Dipilih Adalah Pembayaran Tunai
    $scope.selecttypepembayaran = function(choicetypepembayarandefault)
    {
        $scope.choicetypepembayaran             = {'TYPE_PAY_ID':choicetypepembayarandefault.TYPE_PAY_ID};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/pembayaran/popuptypepembayaran.html',
          title: 'PILIH METODE PEMBAYARAN?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                $scope.choicetypepembayaran = $scope.choicetypepembayarandefault;     
            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var index           = _.findIndex($scope.typepembayarans,{'TYPE_PAY_ID':$scope.choicetypepembayaran.TYPE_PAY_ID});
                var result          = angular.copy($scope.typepembayarans[index]);
                $scope.choicetypepembayarandefault = result;
                if($scope.choicetypepembayarandefault.TYPE_PAY_ID == 1)
                {
                    //JIKA TYPE PEMBAYARAN TUNAI
                    $scope.yangdibayarkan           = UtilService.PembayaranFunc($scope.totalpembayaran);
                    $scope.radiopembayaranchange($scope.totalpembayaran);
                }
                else
                {
                    //JIKA TYPE PEMBAYARAN NON-TUNAI
                    $scope.yangdibayarkan           = [{'yangdibayar':$scope.totalpembayaran}];
                    $scope.radiopembayaranchange($scope.totalpembayaran);
                }
            }
          }]
        });
    }

    //Fungsi Yang Digunakan Untuk Memilih Nominal Yang Telah Disediakan Oleh Kontrol Gampang
    //Default Nominal Yang Dipilih Adalah Total Nominal Yang Harus Dibayarkan
    $scope.radiopembayaranchange = function(nominal)
    {
        var nominal         = angular.copy(nominal);
        $scope.pembayaran   = {'uang':nominal};
        if(nominal > $scope.totalpembayaran)
        {
            $scope.sisapembayaran       = Number(nominal) - Number($scope.totalpembayaran);
        }
        else
        {
            $scope.sisapembayaran       = Number($scope.totalpembayaran) - Number(nominal);
        }
        
    }

    //Fungsi Jika Nominal Pembayaran Diinput Secara Manual Dari Form Inputan
    $scope.changemanual = function()
    {
        if($scope.pembayaran.uang > $scope.totalpembayaran)
        {
            $scope.sisapembayaran       = Number($scope.pembayaran.uang) - Number($scope.totalpembayaran);   
        }
        else
        {
            $scope.sisapembayaran       = Number($scope.totalpembayaran) - Number($scope.pembayaran.uang);    
        }
    }

    $scope.submitmodalpembayaran = function() 
    {
        function lanjutnextstep(datakartu)
        {
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
            });


            var parameters              = ConstructorService.TransaksiHeaderConstructor($scope.nomortransaksiheader,'manual');
            parameters.TRANS_ID         = $scope.nomortransaksiheader;
            parameters.SPLIT_TRANS_ID   = $scope.nomortransaksiheader.split('.')[3] + '.' + $scope.nomortransaksiheader.split('.')[4];
            parameters.TOTAL_PRODUCT    = $scope.itemincart.length;
            parameters.SUB_TOTAL_HARGA  = $scope.totalpembayaransebelumpajak;
            parameters.PPN              = $scope.biayapajak;
            parameters.TOTAL_HARGA      = $scope.totalpembayaran;
            if($scope.statusdonasi.checked)
            {
                parameters.DO_KEM_TYPE      = 1;
            }
            else
            {
                parameters.DO_KEM_TYPE      = 0;
            }

            parameters.DO_KEM           = $scope.sisapembayaran;
            parameters.OPENCLOSE_ID     = $scope.openbookdata.OPENCLOSE_ID;
            parameters.STATUS           = 1;

            if($scope.pelangganradio.valuechoose != 'REGULAR' && $scope.customerchoose)
            {
                parameters.CONSUMER_NM      = $scope.customerchoose.NAME;
                parameters.CONSUMER_EMAIL   = $scope.customerchoose.EMAIL;
                parameters.CONSUMER_PHONE   = $scope.customerchoose.PHONE;
            }

            if($scope.choicetypepembayarandefault.TYPE_PAY_ID != 1)
            {
                parameters.TYPE_PAY_ID      = $scope.choicetypepembayarandefault.TYPE_PAY_ID;
                parameters.TYPE_PAY_NM      = $scope.choicetypepembayarandefault.TYPE_PAY_NM;
                parameters.BANK_ID          = 'BANK0001';
                parameters.BANK_NM          = 'BANK BNI';
                parameters.MERCHANT_ID      = 'MERCHANT0001';
                parameters.MERCHANT_NM      = 'BNI 46';
                parameters.MERCHANT_NO      = '10700135';
            }


            TransaksisLiteFac.CreateTransaksiHeaders(parameters)
            .then(function(response)
            {
                var printtemplate = TemplateService.PrintCashierTemplate($scope.itemincart,parameters,$scope.sisapembayaran,$scope.pembayaran.uang,datakartu);
                console.log(printtemplate);
                // NymphPrinterService.printReceipt(printtemplate);

                StorageService.destroy('nomortransaksiyangaktif');
                ToastService.ShowToast('Transaksi Berhasil Disimpan','success');
            })
            .then(function()
            {
                SaveToBillLiteFac.DeleteSaveToBillByNomorTrans($scope.nomortransaksiheader);
            })
            .then(function()
            {
                var productyangdibeli = angular.copy($scope.itemincart);
                for(var i = productyangdibeli.length - 1;i >= 0;i--)
                {
                    productyangdibeli[i].PRODUCT_QTY    = productyangdibeli[i].QTY_INCART;
                    productyangdibeli[i].STATUS         = 1;
                    var updatestatusitemincart          = angular.copy(productyangdibeli[i]);
                    ShopCartLiteFac.UpdateStatusPembelian(updatestatusitemincart);
                    if(productyangdibeli[i].TRANS_TYPE == 2)
                    {
                        updatestatusitemincart.STATUS_BELI = 6;
                        ShopCartLiteFac.UpdateShopCartPPOBStatus(updatestatusitemincart);
                    }
                }
            })
            .then(function()
            {
                $timeout(function ()
                {
                    if($scope.modalviewitemincart)
                    {
                        $scope.modalviewitemincart.remove();
                    }
                    $scope.choicetypepembayarandefault  = $scope.typepembayarans[0];
                    $scope.provider                     = {valuechoose:null};
                    $scope.pelangganradio               = {valuechoose:'REGULAR'};
                    $scope.alasan = [
                        {'todo':'REGULAR','checked':true},
                        {'todo':'MEMBER','checked':false}
                    ];
                    $scope.loadnomortransaksiheaders();
                    $scope.modalpembayaran.remove();

                },2000);
            },
            function(error)
            {
                ToastService.ShowToast('Transaksi Gagal Disimpan','error');
            });
        }

        if($scope.choicetypepembayarandefault.TYPE_PAY_ID != 1)
        {
            lanjutnextstep();
        }
        else
        {
            if($scope.pembayaran.uang < $scope.totalpembayaran)
            {
                $cordovaDialogs.alert('Pembayaran Belum Cukup.');
            }
            else
            {
                lanjutnextstep();
            }
        }
    };


    $scope.changefilterpelanggan = function(valuefilter)
    {
        if(valuefilter.length > 3)
        {
            $scope.showdatapelanggan  = true;
        }
        else
        {
            $scope.showdatapelanggan  = false;
        }

        $scope.filterpelanggan = valuefilter;   
    }

/** AKHIR DARI PEMBAYARAN FUNCTION **/

/** AWAL DARI MENU MOORE **/
    $scope.showpopovermenumore = function($event)
    {
        $ionicPopover.fromTemplateUrl('templates/sales/popovermenumore.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
        })
        .then(function(popover) 
        {
            $scope.popovermenumore = popover;
            $scope.popovermenumore.show($event);
        });
    }

    $scope.closepopovermenumore = function()
    {
        if($scope.popovermenumore)
        {
            $scope.popovermenumore.hide();
        }
    }

    $scope.turnofonsoundfunction    = function()
    {
       $scope.soundon.on        = !$scope.soundon.on;
       var datadefaultconfig    = {};
       datadefaultconfig.grid   = $scope.gridornot.grid;
       datadefaultconfig.on     = $scope.soundon.on;
       StorageService.set('default-config',datadefaultconfig);
       if($scope.soundon.on)
       {
            ToastService.ShowToast('Suara Berhasil Diaktifkan.','success');
       }
       else
       {
            ToastService.ShowToast('Suara Berhasil Dinonaktifkan.','success');
       }  
    }

    $scope.switchmodegridorlistfunction    = function()
    {
        $scope.gridornot.grid    = !$scope.gridornot.grid;
        var datadefaultconfig    = {};
        datadefaultconfig.grid   = $scope.gridornot.grid;
        datadefaultconfig.on     = $scope.soundon.on;
        StorageService.set('default-config',datadefaultconfig);
        if($scope.gridornot.grid)
        {
            ToastService.ShowToast('Tampilan Gambar Diaktifkan.','success');
        }
        else
        {
            ToastService.ShowToast('Tampilan Teks Diaktifkan.','success');
        }
    }

    $scope.openstorepopup = function () 
    {
        $scope.closepopovermenumore();
        var profileadvanc   = StorageService.get('advanced-profile');
        $scope.stores       = profileadvanc.LIST_STORES;
        $scope.choiceview   = profileadvanc.STORES_ACTIVE;
        $scope.choice       = {STORE_ID:$scope.choiceview.STORE_ID};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/popupstore.html',
          title: 'PILIH STORE?',
          scope: $scope,
          cssClass: 'animated bounceIn',
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                $scope.choice = angular.copy($scope.choiceview);
            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var index                   = _.findIndex($scope.stores,{'STORE_ID':$scope.choice.STORE_ID});
                var result                  = angular.copy($scope.stores[index]);
                profileadvanc.STORES_ACTIVE = result;
                $scope.titleheader          = result.STORE_NM;
                StorageService.set('advanced-profile',profileadvanc);
                $scope.loadnomortransaksiheaders();
            }
          }]
        });
    }
/** AKHIR DARI MENU MOORE **/

/** AWAL DARI MENU PPOB **/
    $scope.showpopovermenuppob = function($event)
    {
        $ionicPopover.fromTemplateUrl('templates/sales/popovermenuppob.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
        })
        .then(function(popover) 
        {
            $scope.popovermenuppob = popover;
            $scope.popovermenuppob.show($event);
        });
    }
    $scope.closepopovermenuppob = function()
    {
        if($scope.popovermenuppob)
        {
            $scope.popovermenuppob.hide();
        }
    }
    $scope.openmodecashier = function()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });
        
        $timeout(function() 
        {
            $scope.modelayar = {'cashier':true,'pembelian':false,'pembayaran':false,'transfer':false};
            $scope.showformpembelian = false;
            $scope.showdetailpembeliantoken         = false;
            $ionicLoading.hide();
        }, 1000);
          
    }
    $scope.openmodepembelian = function()
    {
        $scope.closepopovermenuppob();
        // $state.go('tab.sales-ppob');
        $scope.modelayar = {'cashier':false,'pembelian':true,'pembayaran':false,'transfer':false}; 
        $scope.showformpembelian = false; 
    }
    
    $scope.openformpembelian = function(detailppob)
    {
        $scope.modelayar = {'cashier':false,'pembelian':false,'pembayaran':false,'transfer':false};
        $scope.showformpembelian = true;
        $scope.datapembelianppob = angular.copy(detailppob);
        $scope.showform = UtilService.CheckTypePembelian($scope.datapembelianppob);
        if($scope.showform == 'PULSA')
        {
            $scope.regex = ProviderPrefixService.GetPrefix($scope.datapembelianppob.DETAIL_NM);   
        }
        
    }

    $scope.inputnominalpulsa = function()
    {
        $scope.datanominals       = $scope.datapembelianppob.DAFTAR_NOMINAL;
        $scope.choicekodenominal  = {CODE:null};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/formisian/popupnominalpulsa.html',
          title: 'PILIH JUMLAH NOMINAL?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {

            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                if($scope.choicekodenominal.CODE != null)
                {
                    var index       = _.findIndex($scope.datanominals,{'CODE':$scope.choicekodenominal.CODE});
                    var datanominal = $scope.datanominals[index];
                    $scope.datapembelianppob.NILAI_NOMINAL  = $filter('ktoNumber')(datanominal.NOMINAL);
                    $scope.datapembelianppob.HARGA_KG       = datanominal.HARGA_KG;
                    $scope.datapembelianppob.CODE           = datanominal.CODE;
                    $scope.datapembelianppob.DENOM          = datanominal.DENOM;
                    $scope.datapembelianppob.HARGA_JUAL     = datanominal.HARGA_JUAL;
                    $scope.datapembelianppob.ID_CODE        = datanominal.ID_CODE;
                    $scope.datapembelianppob.ID_PRODUK      = datanominal.ID_PRODUK;
                    $scope.datapembelianppob.KELOMPOK       = datanominal.KELOMPOK;
                    $scope.datapembelianppob.KTG_ID         = datanominal.KTG_ID;
                    $scope.datapembelianppob.KTG_NM         = datanominal.KTG_NM;
                    $scope.datapembelianppob.NAME           = datanominal.NAME;
                    $scope.datapembelianppob.TYPE_NM        = datanominal.TYPE_NM;
                }
            }
          }]
        });
    }

    $scope.submitpembelianpulsa = function()
    {
        $scope.aktualsisadeposit        = angular.copy($scope.jumlahnilaideposit);
        var sisadeposit                 = $scope.jumlahnilaideposit - $scope.datapembelianppob.HARGA_JUAL;
        if(sisadeposit >= 0)
        {
            $scope.jumlahnilaideposit = sisadeposit;
            $scope.openmodepembelian();
            var parameters                  = UtilService.GetParameters();
            parameters.TRANS_DATE           = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
            parameters.GOLONGAN             = $scope.datapembelianppob.KELOMPOK;
            parameters.PRODUCT_ID           = $scope.datapembelianppob.ID_PRODUK;
            parameters.PRODUCT_NM           = $scope.datapembelianppob.NAME;
            parameters.PRODUCT_PROVIDER     = $scope.datapembelianppob.KTG_NM;
            parameters.PRODUCT_PROVIDER_NO  = $scope.datapembelianppob.HEADER_NM;
            parameters.PRODUCT_PROVIDER_NM  = $scope.datapembelianppob.HEADER_NM;
            parameters.UNIT_ID              = $scope.datapembelianppob.HEADER_NM;
            parameters.UNIT_NM              = $scope.datapembelianppob.HEADER_NM;
            parameters.TRANS_TYPE           = 2; //0:Transaksi Kasir,1:Transaksi Refund,2:Transaksi PPOB

            parameters.HARGA_JUAL           = Number($scope.datapembelianppob.HARGA_JUAL);
            parameters.QTY_INCART           = 1;
            parameters.PROMO                = null;
            parameters.TRANS_ID             = $scope.nomortransaksiheader;
            parameters.DISCOUNT             = 0;
            parameters.STATUS               = 0;

            parameters.PEMBAYARAN           = $scope.datapembelianppob.HARGA_JUAL;
            parameters.MSISDN               = $scope.datapembelianppob.MSISDN;
            parameters.ID_PELANGGAN         = $scope.datapembelianppob.MSISDN;
            parameters.HARGA_KG             = $scope.datapembelianppob.HARGA_KG;
            parameters.CODE                 = $scope.datapembelianppob.CODE;
            parameters.DENOM                = $scope.datapembelianppob.DENOM;
            parameters.HARGA_JUAL           = $scope.datapembelianppob.HARGA_JUAL;
            parameters.ID_CODE              = $scope.datapembelianppob.ID_CODE;
            parameters.ID_PRODUK            = $scope.datapembelianppob.ID_PRODUK;
            parameters.KELOMPOK             = $scope.datapembelianppob.KELOMPOK;
            parameters.KTG_ID               = $scope.datapembelianppob.KTG_ID;
            parameters.KTG_NM               = $scope.datapembelianppob.KTG_NM;
            parameters.NAME                 = $scope.datapembelianppob.NAME;
            parameters.TYPE_NM              = $scope.datapembelianppob.TYPE_NM;
            parameters.PEMBAYARAN           = $scope.datapembelianppob.HARGA_JUAL;
            parameters.STATUS_BELI          = 5;

            ShopCartLiteFac.CreateShopCart(parameters)
            .then(function(response)
            {
                $scope.banyakdicart     += 1;
                $scope.itemincart.push(parameters);
            },
            function(error)
            {
                console.log(error);
            });

            ShopCartLiteFac.CreateShopCartPPOB(parameters)
            .then(function(response)
            {
                console.log("Data Pembelian PPOB Shop Cart")
            },
            function(error)
            {
                console.log(error);
            });
        }
        else
        {
            alert("Nilai Deposit Anda Tidak Mencukupi.Lakukan Deposit Terlebih Dahulu.Sisa Deposit = Rp. " + $scope.aktualsisadeposit);
        }
    }

    $scope.submitinquery = function()
    {
        var parameters          = angular.copy($scope.datapembelianppob);
        parameters.ID_PELANGGAN = parameters.MSISDN; 
        parameters.TRANS_DATE   = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
        parameters.STORE_ID     = '1234567890';
        parameters.TRANS_ID     = '1234567890';
        parameters.PEMBAYARAN   = 12000;   
        PPOBFac.CreateTransaksi(parameters)
        .then(function(response)
        {
            $scope.inquerysuccess                   = true;
            $scope.datapembelianppob.NAMA_PELANGGAN = 'Radumta Sitepu';
        },
        function(error)
        {
            console.log(error);
        });
    }

    $scope.openmodepembayaran = function()
    {
        $scope.closepopovermenuppob();
        ToastService.ShowToast('Fitur Cicilan Dalam Pengembangan','error');
    }
    $scope.openmodetransfer = function()
    {
        $scope.closepopovermenuppob();
        ToastService.ShowToast('Fitur Setor/Transfer Dalam Pengembangan','error');
    }

/** AKHIR DARI MENU PPOB **/

/** AWAL DARI FILTER DATA PRODUCT **/
    $scope.xxx = { string : '' };
    $scope.changefilter = function(textfilter)
    {
        $scope.filterproductbyname        = textfilter;
    }
/** AKHIR DARI FILTER DATA PRODUCT **/

/** AWAL DARI HITUNG TOTAL FUNCTION **/
    $scope.hitungtotal = function(datahitung)
    {
        var total = UtilService.SumPriceWithQtyWithPPN(datahitung,'HARGA_JUAL','QTY_INCART','PPN');  
        return total;
    }
/** AKHIR DARI HITUNG TOTAL FUNCTION **/

/** AWAL DARI CUSTOMERS FUNCTION **/
    $scope.openmodallistcustomer = function()
    {
        $ionicModal.fromTemplateUrl('templates/sales/customers/modallistcustomers.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalcustomernewtransaksi);
            if(resultcheckmodal)
            {
                $scope.modalcustomernewtransaksi    = modal;
                $scope.modalcustomernewtransaksi.show();
            }
            var parameters          = UtilService.GetParameters();
            CustomersCombFac.GetCustomers(parameters)
            .then(function(responsegetcustomer)
            {
                $scope.customerisexist              = {'exist':'true'};
                $scope.datacustomers                       = responsegetcustomer;
                
                $scope.newcustomer                  = {};
                
            
                TransaksiCombFac.GetTransaksiHeaderByTransID($scope.nomortransaksiheader)
                .then(function(responsetransaksiid)
                {
                    if(responsetransaksiid.length > 0)
                    {
                        $scope.datatransaksiheadercustomer  = responsetransaksiid[responsetransaksiid.length - 1];
                        var indexcustomeryangdipilih        = _.findIndex(responsegetcustomer,{'NAME':$scope.datatransaksiheadercustomer.CONSUMER_NM});
                        if(indexcustomeryangdipilih > -1)
                        {
                            $scope.shownGroup       = $scope.datacustomers[indexcustomeryangdipilih];
                            $scope.customerchoose   = $scope.datacustomers[indexcustomeryangdipilih];
                        }
                    }
                });
            },
            function(errorgetcustomer)
            {
                console.log(errorgetcustomer);
            }).
            finally(function()
            {
                $ionicLoading.hide();
            });
            
        });
    }
    
    $scope.filtertable = function(filterValue) 
    {
        $scope.filterValue = filterValue;
    };

    $scope.submitmodallistcustomer = function() 
    {
        if($scope.customerisexist.exist == 'false')
        {
            var parameters                  = UtilService.GetParameters();
            CustomersLiteFac.GetMaxCustomerID(parameters.STORE_ID)
            .then(function(responsenewcustomerid)
            {
                $scope.newcustomer.CUSTOMER_ID  = responsenewcustomerid;
                $scope.newcustomer.TGL_SAVE     = parameters.TGL_SAVE;
                $scope.newcustomer.ACCESS_GROUP = parameters.ACCESS_GROUP;
                $scope.newcustomer.STORE_ID     = parameters.STORE_ID;
                $scope.newcustomer.STATUS       = 1;
                CustomersLiteFac.CreateCustomers($scope.newcustomer)
                .then(function(responsesetcustomer)
                {
                    $scope.namacustomer = $scope.newcustomer.NAME;
                }
                ,function(error)
                {
                    console.log(error);
                });
            },
            function(error)
            {
                console.log(error);
            });    
        }
        $scope.modalcustomernewtransaksi.remove();
    };

    $scope.closemodallistcustomer = function()
    {
        $scope.modalcustomernewtransaksi.remove();
    }
    $scope.isGroupShown = function(datatoshow) 
    {
        return $scope.shownGroup === datatoshow;
    };

    $scope.tapcustomer    = function(tapcustomer)
    {
        $scope.customerchoose = tapcustomer;
        $scope.searchpelanggan.string = tapcustomer.NAME;
        if (!$scope.isGroupShown(tapcustomer)) 
        {
          $scope.shownGroup = tapcustomer;
        }
        else
        {
            $scope.shownGroup       = undefined;
            $scope.customerchoose   = undefined;    
        }
    }
/** AKHIR DARI CUSTOMERS FUNCTION **/   

/** AWAL DARI SAVE TO BILL FUNCTION **/
    $scope.openmodalsavetobill     = function()
    {
        
        $ionicModal.fromTemplateUrl('templates/sales/savebill/modalsavetobill.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: true,
            hardwareBackButtonClose: false,
            backdrop:false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.savetobillmodal);
            if(resultcheckmodal)
            {
                $scope.savetobillmodal  = modal;
                $scope.savetobillmodal.show();
            }
            $scope.billidentity     = $scope.nomortransaksiheader.split('.')[4];
        });
    }

    $scope.closemodalsavetobill = function()
    {
        if($scope.savetobillmodal)
        {
            $scope.savetobillmodal.remove();    
        }
           
    }

    $scope.submitmodalsavetobill = function(statusprint) 
    {
        if($scope.itemincart.length > 0)
        {
            if(statusprint == 'print')
            {
                ToastService.ShowToast('Sedang Proses Print.Silahkan Tunggu','success');
            }

            var parameters          = UtilService.GetParameters();
            parameters.TRANS_ID     = $scope.nomortransaksiheader;
            SaveToBillLiteFac.GetSaveToBillByNomorTrans(parameters)
            .then(function(responsesavebill)
            {                
                if(responsesavebill.length == 0)
                {
                    if($scope.billidentity != parameters.TRANS_ID)
                    {
                        parameters.ALIAS_TRANS_ID = $scope.billidentity;
                    }
                    else
                    {
                        parameters.ALIAS_TRANS_ID = '';
                    }

                    SaveToBillLiteFac.SetSaveToBill(parameters)
                    .then(function(responsesave)
                    {
                        console.log(responsesave);
                    },
                    function(error)
                    {
                        console.log(error);
                    });
                    
                }
                StorageService.destroy('nomortransaksiyangaktif');
                $scope.loadnomortransaksiheaders();
            },
            function(error)
            {
                ToastService.ShowToast(error,'error');
            });
        }
        else
        {
            $cordovaDialogs.alert('Belum Ada Item Yang Dipilih.Minimal Harus Ada Satu Item.','Information','Pilih Sekarang');   
        }

        if($scope.modalviewitemincart)
        {
            $scope.modalviewitemincart.remove();
        }
        $scope.savetobillmodal.remove();
    };

    $scope.openmodalloadfromtobill     = function()
    {
        
        $ionicModal.fromTemplateUrl('templates/sales/savebill/modalloadfrombill.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: true,
            hardwareBackButtonClose: false,
            backdrop:false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.savetobillmodal);
            if(resultcheckmodal)
            {
                $scope.savetobillmodal  = modal;
                $scope.savetobillmodal.show();
            }

            $scope.billidentity     = $scope.nomortransaksiheader;
            var parameters  = UtilService.GetParameters();
            SaveToBillLiteFac.GetSaveToBillByDate(parameters)
            .then(function(responselite)
            {
                $scope.listbill = responselite;
            });

        });
    }

    $scope.submitloadfrombill = function(itemsavefrombill)
    {
        if($scope.itemincart.length > 0)
        {
            var dataparams            = UtilService.GetParameters();
            dataparams.TRANS_ID       = $scope.nomortransaksiheader;
            SaveToBillLiteFac.GetSaveToBillByNomorTrans(dataparams)
            .then(function(responsesavebill)
            {                
                if(responsesavebill.length == 0)
                {
                    if($scope.billidentity != dataparams.TRANS_ID)
                    {
                        dataparams.ALIAS_TRANS_ID = $scope.billidentity;
                    }
                    else
                    {
                        dataparams.ALIAS_TRANS_ID = '';
                    }

                    SaveToBillLiteFac.SetSaveToBill(dataparams)
                    .then(function(responsesave)
                    {
                        console.log(responsesave);
                    },
                    function(error)
                    {
                        ToastService.ShowToast(error,'error');
                    });
                }
            },
            function(error)
            {
                ToastService.ShowToast(error,'error');
            });
        }

        TransaksiCombFac.GetTransaksiHeaderByTransID(itemsavefrombill.TRANS_ID)
        .then(function(responsetransaksiid)
        {
            if(responsetransaksiid.length > 0)
            {
                $scope.namacustomer = responsetransaksiid[responsetransaksiid.length - 1].CONSUMER_NM;
            }
        },
        function(error)
        {
            ToastService.ShowToast(error,'error');  
        });
        $scope.nomortransaksiheader       = itemsavefrombill.TRANS_ID;
        $scope.splitnomortransaksi        = $scope.nomortransaksiheader.split('.')[2] + '.' + $scope.nomortransaksiheader.split('.')[3];
        $scope.loaditemincart();
        $scope.closemodalsavetobill();
        
    }
/** AKHIR DARI SAVE TO BILL FUNCTION **/


}])


