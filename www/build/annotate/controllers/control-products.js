angular.module('starter')
.controller('ControlProductsCtrl',['ToastService','StoresCombFac','ProductsLiteFac','ProductStockLiteFac','SecuredFac','CustomersCombFac','ProvinsisCombFac','MerchantsFac','StoresFac','ProductsFac','ProductsCombFac','StorageService','ConstructorService','UtilService','$ionicListDelegate','$ionicActionSheet','$cordovaImagePicker','$cordovaCamera','$cordovaDialogs','$ionicPopup','$ionicSlideBoxDelegate','$ionicModal','$ionicLoading','$ionicHistory','$scope','$timeout','$state','$filter', 
function(ToastService,StoresCombFac,ProductsLiteFac,ProductStockLiteFac,SecuredFac,CustomersCombFac,ProvinsisCombFac,MerchantsFac,StoresFac,ProductsFac,ProductsCombFac,StorageService,ConstructorService,UtilService,$ionicListDelegate,$ionicActionSheet,$cordovaImagePicker,$cordovaCamera,$cordovaDialogs,$ionicPopup,$ionicSlideBoxDelegate,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter) 
{

    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        $scope.$apply();
    }, false);

    $scope.changeunitproduct = function(productunitsselected)
    {
        $scope.productunitdetails       = $filter('filter')($scope.productunitall, { UNIT_ID_GRP: parseInt(productunitsselected.UNIT_ID_GRP) });
        $scope.choiceproductunitdetail  = {};
        $ionicPopup.confirm({
          templateUrl: 'templates/control/products/popupproductunitdetail.html',
          title: 'PILIH DETAIL UNIT PRODUK?',
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
                $scope.popup1.close();

                var indexproductgroups = _.findIndex($scope.productunitall,{'UNIT_ID':$scope.choiceproductunitdetail.UNIT_ID});
                if($scope.modeupdateorcreate == 'new')
                {
                    $scope.newproduct.UNIT_ID             = $scope.productunitall[indexproductgroups].UNIT_ID;
                    $scope.newproduct.UNIT_NM             = $scope.productunitall[indexproductgroups].UNIT_NM;  
                }
                else
                {
                    $scope.updateitemproduct.UNIT_ID      = $scope.productunitall[indexproductgroups].UNIT_ID;
                    $scope.updateitemproduct.UNIT_NM      = $scope.productunitall[indexproductgroups].UNIT_NM;
                } 
            }
          }]
        });
    }
/** AWAL DARI FILTER DATA PRODUCT **/
    $scope.changesearchshow = function()
    {
        $scope.showsearch = !$scope.showsearch;
    }
    $scope.xxx = { string : '' };
    $scope.changefilter = function(valuefilter)
    {
        $scope.filterproduct = valuefilter;
    }
/** AKHIR DARI FILTER DATA PRODUCT **/
    $scope.$on('$ionicView.beforeEnter', function()
    {
        $scope.showsearch = false;
        var parameters = UtilService.GetParameters();
        StoresCombFac.GetStores(parameters)
        .then(function(resgetstores)
        {
            $scope.stores = resgetstores;
            $scope.store  = resgetstores[0];
        });
    });

    $scope.openmodalactive = function(valuechoose)
    {
        var detailproduct = $scope.datadetailproduct;
        if(valuechoose == 'RADIOINFORMASI')
        {
            $scope.modalupdateproductopen(detailproduct);
        }
        else if(valuechoose == 'RADIOHARGA')
        {
            $scope.modaltambahproducthargaopen(detailproduct);
        }
        else if(valuechoose == 'RADIOSTOCK')
        {
            $scope.modaltambahproductstockopen(detailproduct);
        }
        else if(valuechoose == 'RADIODISKON')
        {
            $scope.modaltambahproductdiscountopen(detailproduct);
        }
        else if(valuechoose == 'RADIOGAMBAR')
        {
            $scope.tambahgambar(detailproduct)
        }
    }      

/** AWAL DARI STORES CRUD FUNCTION **/
    $scope.openstorepopup = function (store)
    {
        $scope.choiceview   = store;
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
                var index           = _.findIndex($scope.stores,{'STORE_ID':$scope.choice.STORE_ID});
                var result          = angular.copy($scope.stores[index]);
                $scope.store        = result;
                $scope.loadproducts(result);
            }
          }]
        });
    }
/** AKHIR DARI STORES CRUD FUNCTION **/

    $scope.loadproducts = function(store)
	{
        var parameters      = UtilService.GetParameters();
        if(store)
        {
            parameters.STORE_ID = store.STORE_ID;
        }
        ProductsCombFac.GetProducts(parameters)
        .then(function(resproducts)
        {
            $scope.dataproducts = resproducts;
            $timeout(function() 
            {
                $scope.detailproduct($scope.dataproducts[0]); 
            }, 10); 
        },
        function(error)
        {
            console.log(error);
        });	
	}
	$scope.loadproducts();

	$scope.detailproduct 	= function(dataproduct)
	{
        $scope.viewtoshow   = {'valuechoose':'RADIOINFORMASI'}
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
            duration:1500
        });

        $scope.showinfoproduct        = false;
        $scope.showhargaproduct       = false;
        $scope.showstockproduct       = false;
        $scope.showdiscountproduct    = false;
        $scope.showgambarproduct      = true;

        $scope.datadetailproduct 	  = dataproduct;
		if (!$scope.isGroupShown(dataproduct)) 
	    {
	      $scope.shownGroup = dataproduct;
	    }
        var parameters          = UtilService.GetParameters();
        parameters.PRODUCT_ID   = dataproduct.PRODUCT_ID;

        ProductsCombFac.GetProductStocks(parameters)
        .then(function(responsestocks)
        {
            $scope.productstocks = responsestocks;
        },
        function(errorstocks)
        {
            console.log(errorstocks)
        });

        
        ProductsCombFac.GetProductHargas(parameters)
        .then(function(responsehargas)
        {
            $scope.producthargas = responsehargas;
        },
        function(errorhargas)
        {
            console.log(errorhargas)
        });

        
        ProductsFac.GetProductDiscounts(parameters)
        .then(function(responsediscounts)
        {
            $scope.productdiscounts     = responsediscounts;
        },
        function(errordiscounts)
        {
            console.log(errordiscounts)
        });

        
	}

    $scope.modaldetailproductlayarkecilopen   = function(dataproduct)
    {
        if (!$scope.isGroupShown(dataproduct)) 
        {
          $scope.shownGroup = dataproduct;
        }

        $ionicModal.fromTemplateUrl('templates/control/products/modalupdateproductlayarkecil.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            
            $scope.productssebelumdiupdate      = angular.copy(dataproduct);
            $scope.updateitemproduct            = angular.copy(dataproduct);
            $scope.newstock                     = {'CURRENT_STOCK':$scope.updateitemproduct.CURRENT_STOCK,'FORM_INPUT_STOCK':null}
            $scope.datadetailproduct            = angular.copy(dataproduct);
            $scope.indexproductyangdiubah       = _.findIndex($scope.dataproducts,{'PRODUCT_ID':$scope.datadetailproduct.PRODUCT_ID});
            
            var parameters                      = UtilService.GetParameters();
            parameters.PRODUCT_ID               = $scope.updateitemproduct.PRODUCT_ID;

            
            ProductsCombFac.GetProductStocks(parameters)
            .then(function(responsestocks)
            {
                $scope.productstocks = responsestocks;
            },
            function(errorstocks)
            {
                console.log(errorstocks)
            });

            ProductsFac.GetProductHargas(parameters)
            .then(function(responsehargas)
            {
                $scope.producthargas = [];
                if(angular.isDefined(responsehargas[parameters.STORE_ID]))
                {
                    $scope.producthargas = responsehargas[parameters.STORE_ID];    
                }
            },
            function(errorhargas)
            {
                console.log(errorhargas)
            });

            
            ProductsFac.GetProductDiscounts(parameters)
            .then(function(responsediscounts)
            {
                $scope.productdiscounts     = responsediscounts;
            },
            function(errordiscounts)
            {
                console.log(errordiscounts)
            });

            
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalupdateproductlayarkecil);
            if(resultcheckmodal)
            {
                $scope.modalupdateproductlayarkecil   = modal;
                $scope.modalupdateproductlayarkecil.show();
            }
              
        });
    }
    $scope.modaldetailproductlayarkecilclose   = function(dataproduct)
    {
        $scope.modalupdateproductlayarkecil.remove();
    }
/** AWAL DARI PRODUCT CRUD FUNCTION **/
    $scope.openproductunitspop = function (mode) 
    {
        $scope.modeupdateorcreate   = angular.copy(mode);
        var parameters              = UtilService.GetParameters();
        ProductsFac.GetProductUnits(parameters)
        .then(function(responseproductunits)
        {
            $scope.productunitall = angular.copy(responseproductunits);
            $scope.productunits = _.uniq(responseproductunits, 'UNIT_ID_GRP');
        },
        function(error)
        {
            console.log(error);
        });

        if($scope.modeupdateorcreate == 'new')
        {
            var dataxxx = _.find($scope.productunitall,{'UNIT_ID':$scope.newproduct.UNIT_ID});
            if(dataxxx)
            {
              $scope.choiceproductunits = {UNIT_ID_GRP:dataxxx.UNIT_ID_GRP};  
            }
            else
            {
                $scope.choiceproductunits = {UNIT_ID_GRP:undefined};
            }  
        }
        else
        {
            var dataxxx = _.find($scope.productunitall,{'UNIT_ID':$scope.updateitemproduct.UNIT_ID});
            $scope.choiceproductunits = {UNIT_ID_GRP:dataxxx.UNIT_ID_GRP};
        }

        $scope.popup1 = $ionicPopup.confirm({
          templateUrl: 'templates/control/products/popupproductunits.html',
          title: 'PILIH UNIT PRODUK?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                
            }
          }]
        });
    }

    $scope.openproductgroupspop = function (mode) 
    {
        var parameters          = UtilService.GetParameters();
        parameters.STORE_ID     = $scope.store.STORE_ID;
        ProductsLiteFac.GetProductGroups(parameters)
        .then(function(responseproductgroups)
        {
            $scope.productgroups = responseproductgroups;
        });

        if(mode == 'new')
        {
            $scope.choiceproductgroups = {GROUP_ID:$scope.newproduct.GROUP_ID};  
        }
        else
        {
            $scope.choiceproductgroups = {GROUP_ID:$scope.updateitemproduct.GROUP_ID};
        }

        $ionicPopup.confirm({
          templateUrl: 'templates/control/products/popupproductgroups.html',
          title: 'PILIH KATEGORI PRODUK?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                console.log($scope.choiceproductgroups);   
            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                
                var indexproductgroups = _.findIndex($scope.productgroups,{'GROUP_ID':$scope.choiceproductgroups.GROUP_ID});
                
                if(mode == 'new')
                {
                    $scope.newproduct.GROUP_ID             = $scope.productgroups[indexproductgroups].GROUP_ID;
                    $scope.newproduct.GROUP_NM             = $scope.productgroups[indexproductgroups].GROUP_NM; 
                }
                else
                {
                    $scope.updateitemproduct.GROUP_ID      = $scope.productgroups[indexproductgroups].GROUP_ID;
                    $scope.updateitemproduct.GROUP_NM      = $scope.productgroups[indexproductgroups].GROUP_NM;
                }
            }
          }]
        });
    }

    $scope.tambahproductgroup = function()
    {
        $cordovaDialogs.prompt('', 'Tambah Kategori', ['Simpan','Cancel'], '')
        .then(function(result) 
        {
              var input = result.input1;
              var btnIndex = result.buttonIndex;
              if(btnIndex == 1 && input.length > 3)
              {
                    ProductsLiteFac.GetMaxProductGroups($scope.store.STORE_ID)
                    .then(function(responsemax)
                    {
                        var newgroupproduct             = {};
                        newgroupproduct.ACCESS_GROUP    = $scope.store.ACCESS_GROUP;
                        newgroupproduct.STORE_ID        = $scope.store.STORE_ID;
                        newgroupproduct.STATUS          = 1;
                        newgroupproduct.GROUP_ID        = responsemax;
                        newgroupproduct.GROUP_NM        = input;
                        newgroupproduct.NOTE            = 'Catatan Untuk Product Group';
                        return newgroupproduct;
                    })
                    .then(function(newgroupproduct)
                    {
                        ProductsLiteFac.CreateProductGroups(newgroupproduct)
                        .then(function(responsesetgroup)
                        {
                            newgroupproduct.ID_LOCAL = responsesetgroup.insertId;
                            $scope.productgroups.push(newgroupproduct);
                            ToastService.ShowToast('Kategori Produk Berhasil Ditambahkan!','success');
                        },
                        function(errorsetgroup)
                        {
                            ToastService.ShowToast('Kategori Produk Gagal Ditambahkan!','error');
                        });
                    },
                    function(error)
                    {
                        console.log(error);
                    });
              }
        });
    }

    $scope.updateproductgroup = function(productgroup,indexproductgroup)
    {
        $cordovaDialogs.prompt('', 'Ubah Kategori', ['Simpan','Cancel'],productgroup.GROUP_NM)
        .then(function(result) 
        {
              var input = result.input1;
              var btnIndex = result.buttonIndex;
              if(btnIndex == 1 && input.length > 3)
              {
                    productgroup.GROUP_NM                   = input;
                    $scope.productgroups[indexproductgroup] = productgroup;
                    ProductsLiteFac.UpdateProductGroups(productgroup)
                    .then(function(resupdategrup)
                    {
                        ToastService.ShowToast('Kategori Produk Berhasil Diubah!','success');
                    },
                    function(error)
                    {
                        ToastService.ShowToast('Kategori Produk Gagal Diubah!','error');
                    }); 
              }
        });
    }

    $scope.modaltambahproductopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/products/modalnewproduct.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            ProductsLiteFac.GetMaxProductID($scope.store.STORE_ID)
            .then(function(newproductid)
            {
                $scope.newproduct               = {};
                $scope.newproduct.PRODUCT_ID    = newproductid;
                $scope.newproduct.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.newproduct.ACCESS_GROUP  = $scope.store.ACCESS_GROUP;
                $scope.newproduct.STORE_ID      = $scope.store.STORE_ID;
                $scope.newproduct.CURRENT_PROMO = "Belum Ada Promo";
                $scope.newproduct.STATUS        = 1;
                $scope.newproduct.IS_FAVORITE   = 0;

                var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.tambahproduct);
                if(resultcheckmodal)
                {
                    $scope.tambahproduct    = modal;
                    $scope.tambahproduct.show();
                }
            },
            function(error)
            {
                console.log(error);
            });

            
        });
    }
    
    $scope.modaltambahproductsubmit = function(formvalidation) 
    {        
        formvalidation.$invalid          = true;
        $scope.tambahproduct.remove();
        if(!$scope.newproduct.GROUP_ID)
        {
            $scope.newproduct.GROUP_ID      = $scope.store.STORE_ID + '.00001';
            $scope.newproduct.GROUP_NM      = 'LAIN-LAIN';
        }

        if(!$scope.newproduct.PRODUCT_SIZE)
        {
            $scope.newproduct.PRODUCT_SIZE = 0;    
        }
        if(!$scope.newproduct.STOCK_LEVEL)
        {
            $scope.newproduct.STOCK_LEVEL = 0;    
        }

        ProductsLiteFac.CreateProducts($scope.newproduct)
        .then(function(responsesetbarang)
        {
            $scope.newproduct.ID_LOCAL = responsesetbarang.ID_LOCAL;
            $scope.dataproducts.unshift($scope.newproduct);
            $scope.detailproduct($scope.newproduct);
            ToastService.ShowToast('Penambahan Produk Berhasil Disimpan!','success');
        },
        function(errorsetbarang)
        {
            ToastService.ShowToast('Penambahan Produk Gagal Disimpan!','error');
        });   
    };

    $scope.modaltambahproductclose = function() 
    {
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.tambahproduct.remove();
            }
        });

    };

    $scope.modalupdateproductopen   = function(updateproducts)
    {
        $ionicListDelegate.closeOptionButtons();
        $scope.productssebelumdiupdate   = angular.copy(updateproducts);
        $ionicModal.fromTemplateUrl('templates/control/products/modalupdateproductlayarbesar.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updateitemproduct    = angular.copy(updateproducts);
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalupdateproduct);
            if(resultcheckmodal)
            {
                $scope.modalupdateproduct   = modal;
                $scope.modalupdateproduct.show();
            }  
        });
    }
    
    $scope.modalupdateproductsubmit = function() 
    {
        if(!_.isEqual($scope.productssebelumdiupdate, $scope.updateitemproduct))
        {
            if(!$scope.updateitemproduct.GROUP_ID)
            {
                $scope.updateitemproduct.GROUP_ID      = $scope.store.STORE_ID + '.00001';
                $scope.updateitemproduct.GROUP_NM      = 'LAIN-LAIN';
            }
            ProductsLiteFac.UpdateProducts($scope.updateitemproduct)
            .then(function(resupdateproduct)
            {
                var indexproduct = _.findIndex($scope.dataproducts,{'PRODUCT_ID':$scope.updateitemproduct.PRODUCT_ID})
                $timeout(function() 
                {
                    $scope.dataproducts[indexproduct] = $scope.updateitemproduct;
                    $scope.detailproduct($scope.updateitemproduct)
                    if (!$scope.isGroupShown($scope.updateitemproduct)) 
                    {
                      $scope.shownGroup = $scope.updateitemproduct;
                    }
                }, 10);
                ToastService.ShowToast('Data Produk Berhasil Diubah!','success');
                
            },
            function(error)
            {
                ToastService.ShowToast('Data Produk Gagal Diubah!','error');
            }); 
        }

        if($scope.modalupdateproduct)
        {
            $scope.modalupdateproduct.remove();
        }
        else
        {
            $scope.modalupdateproductlayarkecil.remove();    
        }
    };

    $scope.modalupdateproductclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.modalupdateproduct.remove();
            }
        });
    };

    $scope.modaltambahproductstockopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/products/modalnewproductstock.html', 
        {
            scope: $scope,
            backdropClickToClose: true,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.newstock                  = UtilService.GetParameters();
            $scope.newstock.CURRENT_STOCK    = $scope.datadetailproduct.CURRENT_STOCK;
            $scope.newstock.FORM_INPUT_STOCK = undefined;

            $scope.indexproductyangdiubah       = _.findIndex($scope.dataproducts,{'PRODUCT_ID':$scope.datadetailproduct.PRODUCT_ID});
            

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modaltambahproductstock);
            if(resultcheckmodal)
            {
                $scope.modaltambahproductstock          = modal;
                $scope.modaltambahproductstock.show();
            }
        });
    }

    $scope.tambahstock = function(newstock)
    {
        $scope.buttonsubmit     = {'formstock':true};
        $scope.showformstock    = {'show':false};
        var newstock            = angular.copy(newstock);
        // var masihadayangkosong  = UtilService.CheckProperyObjectNullOrNotNull(newstock);
        // if(masihadayangkosong)
        // {
        //     alert("Masih Ada Yang Kosong");
        // }
        // else
        // {
            newstock.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
            newstock.ACCESS_GROUP  = $scope.datadetailproduct.ACCESS_GROUP;
            newstock.STORE_ID      = $scope.datadetailproduct.STORE_ID;
            newstock.PRODUCT_ID    = $scope.datadetailproduct.PRODUCT_ID;
            newstock.INPUT_STOCK   = newstock.FORM_INPUT_STOCK;
            newstock.LAST_STOCK    = 0;
            newstock.SISA_STOCK    = 0;
            newstock.INPUT_DATE    = $filter('date')(new Date(),'yyyy-MM-dd');
            newstock.INPUT_TIME    = $filter('date')(new Date(),'HH:mm:ss');
            newstock.CURRENT_DATE  = $filter('date')(new Date(),'yyyy-MM-dd');
            newstock.CURRENT_TIME  = $filter('date')(new Date(),'HH:mm:ss');
            newstock.STATUS        = 1;
            newstock.DCRP_DETIL    = 'Deskripsi Penambahan Stok';

            ProductStockLiteFac.CreateProductStocks(newstock)
            .then(function(responsecreatestock)
            {
                newstock.ID_LOCAL       = responsecreatestock.ID_LOCAL;
                newstock.CURRENT_STOCK  = Number($scope.dataproducts[$scope.indexproductyangdiubah].CURRENT_STOCK) + Number(newstock.INPUT_STOCK);


                $scope.datadetailproduct.CURRENT_STOCK              = newstock.CURRENT_STOCK;
                $scope.dataproducts[$scope.indexproductyangdiubah]  = $scope.datadetailproduct;

                $scope.productstocks.unshift(newstock);

                ProductsLiteFac.UpdateProductsQuantity(newstock)
                .then(function(response)
                {
                    $scope.newstock = {};
                    $scope.newstock.CURRENT_STOCK       = newstock.CURRENT_STOCK;
                    $scope.newstock.FORM_INPUT_STOCK    = undefined;
                },
                function(error)
                {
                    console.log(error);
                })
                if($scope.modaltambahproductstock)
                {
                    $scope.modaltambahproductstock.remove();
                }
                ToastService.ShowToast('Penambahan Stok Berhasil Disimpan!','success');
            },
            function(error)
            {
                ToastService.ShowToast('Penambahan Stok Gagal Disimpan!','error');
            })
            .finally(function()
            {
                $scope.buttonsubmit     = {'formstock':false};   
            })
        // }
        
    }
    $scope.modaltambahproductstockclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.modaltambahproductstock.remove();
            }
        });
    };

    $scope.modaltambahproducthargaopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/products/modalnewproductharga.html', 
        {
            scope: $scope,
            // animation: 'animated zoomInUp',
            // hideDelay:1020,
            backdropClickToClose: true,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.newproductharga       = {};

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.tambahproductharga);
            if(resultcheckmodal)
            {
                $scope.tambahproductharga    = modal;
                $scope.tambahproductharga.show();
            }
        });
    }

    $scope.tambahharga = function(newharga)
    {
        $scope.buttonsubmit     = {'formharga':true};
        var masihadayangkosong = UtilService.CheckProperyObjectNullOrNotNull(newharga);
        if(masihadayangkosong)
        {
            alert("Masih Ada Yang Kosong");
        }
        else
        {
            newharga.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
            newharga.ACCESS_GROUP  = $scope.datadetailproduct.ACCESS_GROUP;
            newharga.STORE_ID      = $scope.datadetailproduct.STORE_ID;
            newharga.PRODUCT_ID    = $scope.datadetailproduct.PRODUCT_ID;
            newharga.PERIODE_TGL1  = $filter('date')(new Date(newharga.PERIODE_TGL1),'yyyy-MM-dd');
            newharga.PERIODE_TGL2  = $filter('date')(new Date(newharga.PERIODE_TGL2),'yyyy-MM-dd')
            newharga.START_TIME    = $filter('date')(new Date(),'HH:mm:ss')
            newharga.STATUS        = 0;
            newharga.DCRP_DETIL    = 'Deskripsi Penambahan Harga';
            
            ProductStockLiteFac.CreateProductHargas(newharga)
            .then(function(responsecreateharga)
            {
                $scope.producthargas.unshift(newharga);
                $scope.tambahproductharga.remove();
                ToastService.ShowToast('Penambahan Harga Berhasil Disimpan!','success');
            },
            function(error)
            {
                ToastService.ShowToast('Penambahan Harga Gagal Disimpan!','error');
            })
            .finally(function()
            {
                $scope.buttonsubmit     = {'formharga':false};
            })
        }
    }

    $scope.modaltambahproducthargaclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.tambahproductharga.remove();
            }
        });
    };

    $scope.modaltambahproductdiscountopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/products/modalnewproductdiscount.html', 
        {
            scope: $scope,
            // animation: 'animated zoomInUp',
            // hideDelay:1020,
            backdropClickToClose: true,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.newproductdiscount       = {};

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.tambahproductdiscount);
            if(resultcheckmodal)
            {
                $scope.tambahproductdiscount    = modal;
                $scope.tambahproductdiscount.show();
            }
        });
    }

    $scope.tambahdiskon = function(newdiscount)
    {
        var masihadayangkosong = UtilService.CheckProperyObjectNullOrNotNull(newdiscount);
        if(masihadayangkosong)
        {
            alert("Masih Ada Yang Kosong");
        }
        else
        {
            newdiscount.ACCESS_GROUP  = $scope.datadetailproduct.ACCESS_GROUP;
            newdiscount.STORE_ID      = $scope.datadetailproduct.STORE_ID;
            newdiscount.PRODUCT_ID    = $scope.datadetailproduct.PRODUCT_ID;
            newdiscount.PERIODE_TGL1  = $filter('date')(new Date(newdiscount.PERIODE_TGL1),'yyyy-MM-dd');
            newdiscount.PERIODE_TGL2  = $filter('date')(new Date(newdiscount.PERIODE_TGL2),'yyyy-MM-dd')
            newdiscount.START_TIME    = $filter('date')(new Date(),'HH:mm:ss')
            newdiscount.STATUS        = 0;
            newdiscount.DCRP_DETIL    = 'Deskripsi Penambahan Diskon';
            ProductsFac.CreateProductDiscounts(newdiscount)
            .then(function(responsecreateharga)
            {
                $scope.productdiscounts.unshift(newdiscount);
                $scope.tambahproductdiscount.remove();
                ToastService.ShowToast('Penambahan Diskon Berhasil Disimpan!','success');
            },
            function(error)
            {
                ToastService.ShowToast('Penambahan Diskon Gagal Disimpan!','error');
            })
        }
    }
    
    $scope.modaltambahproductdiscountclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.tambahproductdiscount.remove();
            }
        });
    };

    $scope.tambahgambar = function(datadetailproduct)
    {
        if(datadetailproduct)
        {
            $scope.updateitemproduct = angular.copy(datadetailproduct);
        }
        $ionicActionSheet.show
        ({
            titleText: 'Ambil Gambar Produk Melalui?',
            buttons: [
                { text: '<i class="icon ion-image"></i> Galeri' },
                { text: '<i class="icon ion-ios-camera-outline"></i> Kamera'}
                ],
            buttonClicked: function(index) 
            {
                var newgambar           = {};
                newgambar.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                newgambar.ACCESS_GROUP  = $scope.updateitemproduct.ACCESS_GROUP;
                newgambar.STORE_ID      = $scope.updateitemproduct.STORE_ID;
                newgambar.PRODUCT_ID    = $scope.updateitemproduct.PRODUCT_ID;
                
                newgambar.DCRP_DETIL    = 'Deskripsi Penambahan Diskon';
                if(index == 0)
                {
                    document.addEventListener("deviceready", function () 
                    {
                        var options = {maximumImagesCount: 1, width: 800,height: 800,quality: 80};
                        $cordovaImagePicker.getPictures(options)
                        .then(function (results) 
                        {
                            for (var i = 0; i < results.length; i++) 
                            {
                                $scope.userimages = results[i];
                                window.plugins.Base64.encodeFile($scope.userimages, function(base64)
                                {
                                    newgambar.PRODUCT_IMAGE = base64;
                                    if(!datadetailproduct.IMG_FILE)
                                    {
                                        newgambar.STATUS        = 1;
                                        ProductsLiteFac.CreateProductImages(newgambar);
                                    }
                                    else
                                    {
                                        newgambar.STATUS        = 2;
                                        ProductsLiteFac.CreateProductImages(newgambar); 
                                    } 
                                });
                            }
                        }, 
                        function(error) 
                        {
                            console.log('Error: ' + JSON.stringify(error));    // In case of error
                        });
                    }, false);
                }
                else if(index == 1)
                {
                    document.addEventListener("deviceready", function () 
                    {
                        var options = UtilService.CameraOptions();
                        $cordovaCamera.getPicture(options)
                        .then(function (imageData) 
                        {
                            newgambar.PRODUCT_IMAGE = 'data:image/jpeg;base64,' + imageData;
                            if(!datadetailproduct.IMG_FILE)
                            {
                                newgambar.STATUS        = 1;
                                ProductsLiteFac.CreateProductImages(newgambar); 
                            }
                            else
                            {
                                newgambar.STATUS        = 2;
                                ProductsLiteFac.CreateProductImages(newgambar);  
                            } 
                        });
                    }, false);
                }
                return true;
            }
        });
    }

    $scope.modalviewgambaropen = function() 
    {
        $ionicModal.fromTemplateUrl('templates/control/products/modalviewgambarproduct.html', 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalviewigambar);
            if(resultcheckmodal)
            {
                $scope.modalviewigambar = modal;
                $scope.modalviewigambar.show();
            }
        });
    }

    $scope.modalviewgambarclose = function() 
    {
        $scope.modalviewigambar.remove()
    };

    $scope.mode         = {valuechoose:'INFO'};
    $scope.titleup      = $scope.mode.valuechoose;
    $scope.changemode = function(formvalidation)
    {
        $scope.titleup = $scope.mode.valuechoose;
    }
/** AKHIR DARI PRODUCT CRUD FUNCTION **/
	$scope.toggleGroup = function(datatoshow) 
	{
		if(datatoshow == 'infoproduct')
		{
			$scope.showhargaproduct	     = false;
            $scope.showstockproduct      = false;
            $scope.showdiscountproduct   = false;
            $scope.showgambarproduct     = false;
			$scope.showinfoproduct       = !$scope.showinfoproduct;
		}
		else if(datatoshow == 'hargaproduct')
		{
			$scope.showinfoproduct	     = false;
            $scope.showstockproduct      = false;
            $scope.showdiscountproduct   = false;
			$scope.showhargaproduct      = !$scope.showhargaproduct;
		}
        else if(datatoshow == 'stockproduct')
        {
            $scope.showinfoproduct       = false;
            $scope.showhargaproduct      = false;
            $scope.showdiscountproduct   = false;
            $scope.showgambarproduct     = false;
            $scope.showstockproduct      = !$scope.showstockproduct;

        }
        else if(datatoshow == 'discountproduct')
        {
            $scope.showinfoproduct       = false;
            $scope.showhargaproduct      = false;
            $scope.showstockproduct      = false;
            $scope.showgambarproduct     = false;
            $scope.showdiscountproduct   = !$scope.showdiscountproduct;
        }
        else if(datatoshow == 'gambarproduct')
        {
            $scope.showinfoproduct       = false;
            $scope.showhargaproduct      = false;
            $scope.showstockproduct      = false;
            $scope.showdiscountproduct   = false;
            $scope.showgambarproduct     = !$scope.showgambarproduct;
        }

	};

	$scope.isGroupShown = function(datatoshow) 
	{
		return $scope.shownGroup === datatoshow;
	};	
    
}])