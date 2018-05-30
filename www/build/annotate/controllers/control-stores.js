angular.module('starter')
.controller('ControlStoresCtrl',['StoresLiteFac','StoresCombFac','SecuredFac','KaryawansCombFac','KaryawansFac','KaryawansLiteFac','MerchantsLiteFac','MerchantsCombFac','CustomersLiteFac','CustomersCombFac','ProvinsisCombFac','MerchantsFac','StoresFac','ProductStockLiteFac','ProductsFac','ProductsLiteFac','ProductsCombFac','ConstructorService','StorageService','UtilService','$cordovaImagePicker','$cordovaCamera','$ionicActionSheet','$cordovaDialogs','ToastService','$ionicPopup','$ionicSlideBoxDelegate','$ionicModal','$ionicLoading','$ionicHistory','$scope','$timeout','$state','$filter', 
function(StoresLiteFac,StoresCombFac,SecuredFac,KaryawansCombFac,KaryawansFac,KaryawansLiteFac,MerchantsLiteFac,MerchantsCombFac,CustomersLiteFac,CustomersCombFac,ProvinsisCombFac,MerchantsFac,StoresFac,ProductStockLiteFac,ProductsFac,ProductsLiteFac,ProductsCombFac,ConstructorService,StorageService,UtilService,$cordovaImagePicker,$cordovaCamera,$ionicActionSheet,$cordovaDialogs,ToastService,$ionicPopup,$ionicSlideBoxDelegate,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter) 
{
	$scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        $scope.$apply();
    }, false);
    
    $scope.myActiveSlide = 1;
	$scope.loadstores = function()
	{
		var parameters = UtilService.GetParameters();
        StoresCombFac.GetStores(parameters)
        .then(function(resgetstores)
        {
            $scope.datastores = resgetstores;
            $timeout(function() 
            {
                $scope.detailstore($scope.datastores[0]); 
            }, 10);
        })  	
	}
	$scope.loadstores();

    $scope.openmodalactive = function(valuechoose)
    {
        if(valuechoose == 'MERCHANT')
        {
            $scope.modalnewmerchantopen();
        }
        else if(valuechoose == 'KARYAWAN')
        {
            $scope.modalnewkaryawanopen();
        }
        else if(valuechoose == 'OPERASIONAL')
        {
            $scope.modalnewuserloginopen();
        }
        else if(valuechoose == 'PELANGGAN')
        {
            $scope.modalnewcustomeropen();
        }
        else if(valuechoose == 'INFORMASI')
        {
            var datatoko = angular.copy($scope.datadetail);
            $scope.modalupdatestoreopen(datatoko)
        }
    }

	$scope.detailstore 	= function(datastore)
	{
        $scope.viewtoshow    = {valuechoose:'MERCHANT'};
        $scope.showbasic	= false;
		$scope.showproduct	= true;
		$scope.showmerchant	= false;
		$scope.showemploye	= false;
		$scope.datadetail 	= datastore;
        
		if (!$scope.isGroupShown(datastore)) 
	    {
	        $scope.shownGroup = datastore;
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
            });
	    }

        var parameters          = UtilService.GetParameters();
        parameters.STORE_ID     = datastore.STORE_ID;

        
        ProductsCombFac.GetProducts(parameters)
        .then(function(resproducts)
        {
            $scope.dataproducts = resproducts;
            $ionicSlideBoxDelegate.update();
            $timeout(function() 
            {
                $ionicLoading.hide();
            },2000);
            
        },
        function(error)
        {
            console.log(error);
        });

        MerchantsCombFac.GetMerchants(parameters)
        .then(function(resgetmerchants)
        {
            $scope.datamerchants = resgetmerchants;
        },
        function(error)
        {
            console.log(error);
        });

        CustomersCombFac.GetCustomers(parameters)
        .then(function(responsecustomers)
        {
            $scope.datacustomers = responsecustomers;
        },
        function(error)
        {
            console.log(error);
        });

        KaryawansCombFac.GetKaryawans(parameters)
        .then(function(resgetkaryawan)
        {
            $scope.datakaryawans = resgetkaryawan;
        })

        SecuredFac.GetListUserOps(parameters)
        .then(function(responseuserops)
        {
            $scope.datauserops = responseuserops;
        },
        function(error)
        {
            console.log(error);
        });
	}


/** AWAL DARI STORES CRUD FUNCTION **/
	$scope.openstorepopup = function (datastores)
    {
        var profileadvanc   = StorageService.get('advanced-profile');
        $scope.stores       = $scope.datastores;
        $scope.choiceview   = datastores;
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
                var index           = _.findIndex($scope.datastores,{'STORE_ID':$scope.choice.STORE_ID});
                var result          = angular.copy($scope.datastores[index]);
                $scope.detailstore(result);
            }
          }]
        });
    }

    $scope.openprovinsipopup = function (mode) 
    {
        ProvinsisCombFac.GetProvinsisComb()
        .then(function(resprovinsis)
        {
            $scope.provinsis = resprovinsis;
        }
        ,
        function(error)
        {
            alert("Error");
        });

        if(mode == 'new')
        {
            $scope.sebelumberubah       = {PROVINCE_ID:$scope.newstore.PROVINCE_ID};
            $scope.choicepropinsi       = {PROVINCE_ID:$scope.newstore.PROVINCE_ID};   
        }
        else
        {
           $scope.sebelumberubah       = {PROVINCE_ID:$scope.updatestore.PROVINCE_ID};
           $scope.choicepropinsi       = {PROVINCE_ID:$scope.updatestore.PROVINCE_ID};
        }

        $ionicPopup.confirm({
          templateUrl: 'templates/control/provinsis.html',
          title: 'PILIH PROVINSI?',
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
                if(!_.isEqual($scope.sebelumberubah, $scope.choicepropinsi))
                {
                    var indexpropinsi = _.findIndex($scope.provinsis,{'PROVINCE_ID':Number($scope.choicepropinsi.PROVINCE_ID)});
                    if(mode == 'new')
                    {
                        $scope.newstore.PROVINCE_NM = $scope.provinsis[indexpropinsi].PROVINCE;
                        $scope.newstore.PROVINCE_ID = $scope.provinsis[indexpropinsi].PROVINCE_ID;
                        $scope.newstore.CITY_NAME   = null;
                        $scope.newstore.CITY_ID     = null; 
                    }
                    else
                    {
                       $scope.updatestore.PROVINCE_NM   = $scope.provinsis[indexpropinsi].PROVINCE;
                       $scope.updatestore.PROVINCE_ID   = $scope.provinsis[indexpropinsi].PROVINCE_ID;
                       $scope.updatestore.CITY_NAME     = null;
                       $scope.updatestore.CITY_ID       = null;  
                    }
                }
            }
          }]
        });
    }

    $scope.openkotapopup = function (mode) 
    {
        if(!$scope.choicepropinsi)
        {
            $scope.choicepropinsi = $scope.updatestore;
        }
        ProvinsisCombFac.GetKotasComb($scope.choicepropinsi)
        .then(function(reskota)
        {
            $scope.kotas = reskota;
        },
        function(error)
        {
            console.log(error);
        });

        if(mode == 'new')
        {
            $scope.choicekota       = {CITY_ID:$scope.newstore.CITY_ID};  
        }
        else
        {
            $scope.choicekota       = {CITY_ID:$scope.updatestore.CITY_ID};
        }
        
        $ionicPopup.confirm({
          templateUrl: 'templates/control/kota.html',
          title: 'PILIH KOTA?',
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
                var indexkota               = _.findIndex($scope.kotas,{'CITY_ID':Number($scope.choicekota.CITY_ID)});
                if(mode == 'new')
                {
                    $scope.newstore.CITY_NAME   = $scope.kotas[indexkota].CITY_NAME;
                    $scope.newstore.CITY_ID     = $scope.kotas[indexkota].CITY_ID;  
                }
                else
                {
                    $scope.updatestore.CITY_NAME   = $scope.kotas[indexkota].CITY_NAME;
                    $scope.updatestore.CITY_ID     = $scope.kotas[indexkota].CITY_ID;
                } 
            }
          }]
        });
    }

    $scope.opengroupindustripopup = function (mode) 
    {
        ProductsFac.GetProductIndustriGroups()
        .then(function(responsegroupindustri)
        {
            $scope.industrigroups = responsegroupindustri;
        })

        if(mode == 'new')
        {
            $scope.sebelumberubah       = {INDUSTRY_GRP_ID:$scope.newstore.INDUSTRY_GRP_ID};
            $scope.choiceindustrigroups = {INDUSTRY_GRP_ID:$scope.newstore.INDUSTRY_GRP_ID};   
        }
        else
        {
           $scope.sebelumberubah       = {INDUSTRY_GRP_ID:$scope.updatestore.INDUSTRY_GRP_ID};
           $scope.choiceindustrigroups = {INDUSTRY_GRP_ID:$scope.updatestore.INDUSTRY_GRP_ID};
        }

        $ionicPopup.confirm({
          templateUrl: 'templates/control/products/popupindustrigroups.html',
          title: 'PILIH GROUP INDUSTRI?',
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
                if(!_.isEqual($scope.sebelumberubah, $scope.choiceindustrigroups))
                {
                    var indexpropinsi = _.findIndex($scope.industrigroups,{'INDUSTRY_GRP_ID':Number($scope.choiceindustrigroups.INDUSTRY_GRP_ID)});
                    if(mode == 'new')
                    {
                        $scope.newstore.INDUSTRY_GRP_NM     = $scope.industrigroups[indexpropinsi].INDUSTRY_GRP_NM;
                        $scope.newstore.INDUSTRY_GRP_ID     = $scope.industrigroups[indexpropinsi].INDUSTRY_GRP_ID;
                        $scope.newstore.INDUSTRY_NM         = null;
                        $scope.newstore.INDUSTRY_ID         = null; 
                    }
                    else
                    {
                       $scope.updatestore.INDUSTRY_GRP_NM   = $scope.industrigroups[indexpropinsi].INDUSTRY_GRP_NM;
                       $scope.updatestore.INDUSTRY_GRP_ID   = $scope.industrigroups[indexpropinsi].INDUSTRY_GRP_ID;
                       $scope.updatestore.INDUSTRY_NM       = null;
                       $scope.updatestore.INDUSTRY_ID       = null;  
                    }
                }
            }
          }]
        });
    }

    $scope.openindustripopup = function (mode) 
    {
        console.log($scope.choiceindustrigroups);
        if(!$scope.choiceindustrigroups)
        {
            $scope.choiceindustrigroups = {};
            $scope.choiceindustrigroups.INDUSTRY_GRP_ID = $scope.updatestore.INDUSTRY_GRP_ID;
        }

        ProductsFac.GetProductIndustris($scope.choiceindustrigroups)
        .then(function(productindustris)
        {
            $scope.productindustris = productindustris;
        })

        if(mode == 'new')
        {
            $scope.choiceproductindustris   = {INDUSTRY_ID:$scope.newstore.INDUSTRY_ID};   
        }
        else
        {
           $scope.choiceproductindustris    = {INDUSTRY_ID:$scope.updatestore.INDUSTRY_ID};
        }

        $ionicPopup.confirm({
          templateUrl: 'templates/control/products/popupproductindustris.html',
          title: 'PILIH INDUSTRI?',
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
                if(!_.isEqual($scope.sebelumberubah, $scope.choiceproductindustris))
                {
                    var indexpropinsi = _.findIndex($scope.productindustris,{'INDUSTRY_ID':Number($scope.choiceproductindustris.INDUSTRY_ID)});
                    if(mode == 'new')
                    {
                        $scope.newstore.INDUSTRY_NM     = $scope.productindustris[indexpropinsi].INDUSTRY_NM;
                        $scope.newstore.INDUSTRY_ID     = $scope.productindustris[indexpropinsi].INDUSTRY_ID;
                    }
                    else
                    {
                       $scope.updatestore.INDUSTRY_NM   = $scope.productindustris[indexpropinsi].INDUSTRY_NM;
                       $scope.updatestore.INDUSTRY_ID   = $scope.productindustris[indexpropinsi].INDUSTRY_ID;
                    }
                }
            }
          }]
        });
    }

    $scope.modalnewstoreopen = function()
	{
		$ionicModal.fromTemplateUrl('templates/control/stores/modalnewstore.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var parameters  = UtilService.GetParameters();
            StoresLiteFac.GetMaxStoreID(parameters.ACCESS_GROUP)
            .then(function(newstoreid)
            {
                $scope.newstore             = ConstructorService.StoreConstructor();
                $scope.newstore.STORE_ID    = newstoreid;
                $scope.newstore.STORE_NM    = '';
                $scope.newstore.STATUS      = 1;
            })
            .then(function()
            {
                var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.newstoremodal);
                if(resultcheckmodal)
                {
                    $scope.newstoremodal    = modal;
                    $scope.newstoremodal.show();
                }
            },
            function(error)
            {
                alert("Get Max Store Error");
            });

            
        });
	}

	$scope.modalnewstoresubmit = function() 
    {
        console.log($scope.newstore);
        StoresLiteFac.CreateStores($scope.newstore)
        .then(function(rescreatestores)
        {
            $scope.newstore.ID_LOCAL = rescreatestores.ID_LOCAL;
            $scope.datastores.unshift($scope.newstore);
            $scope.detailstore($scope.newstore);
            $scope.newstoremodal.remove();
            
        })
        .then(function()
        {
            var datatosave          = {};
            datatosave.ACCESS_GROUP = $scope.newstore.ACCESS_GROUP;
            datatosave.STORE_ID     = $scope.newstore.STORE_ID;
            datatosave.GROUP_ID     = $scope.newstore.STORE_ID + '.00001';
            datatosave.GROUP_NM     = 'LAIN-LAIN';
            datatosave.STATUS       = 1;
            datatosave.NOTE         = 'LAIN-LAIN';
            ProductsLiteFac.CreateProductGroups(datatosave)
            .then(function(responsesetgroup)
            {
                ToastService.ShowToast('Toko Baru Berhasil Disimpan!','success');
            },
            function(error)
            {
                console.log(error);
            }); 
        },
        function(error)
        {
            ToastService.ShowToast('Toko Baru Gagal Disimpan!','error');
        });
    };

	$scope.modalnewstoreclose = function() 
    {
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.newstoremodal.remove();
            }
        });
    };

    $scope.modalupdatestoreopen = function(datadetailstore)
    {
        $ionicModal.fromTemplateUrl('templates/control/stores/modalupdatestore.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            console.log(datadetailstore);
            $scope.updatestore         = angular.copy(datadetailstore);
            var resultcheckmodal       = UtilService.CheckModalExistOrNot($scope.updatestoremodal);
            if(resultcheckmodal)
            {
                $scope.updatestoremodal    = modal;
                $scope.updatestoremodal.show();
            }  
        });
    }

    $scope.modalupdatestoresubmit   = function()
    {
        if(!_.isEqual($scope.datadetail, $scope.updatestore))
        {
            $scope.updatestore.LONGITUDE    = 'BASFASF';
            $scope.updatestore.LATITUDE     = 'GFGF';
            StoresLiteFac.UpdateStores($scope.updatestore)
            .then(function(resupdatestores)
            {
                var indexstore                  = _.findIndex($scope.datastores,{'STORE_ID':$scope.updatestore.STORE_ID});
                $scope.datastores[indexstore]   = $scope.updatestore;
                $scope.datadetail               = $scope.updatestore;
                $scope.detailstore($scope.updatestore);
                ToastService.ShowToast('Data Toko Berhasil Diubah','success');
            },
            function(error)
            {
                ToastService.ShowToast('Data Toko Gagal Diubah','error');
            });  
        }
        $scope.updatestoremodal.remove();
    } 
      
    $scope.modalupdatestoreclose = function()
    {
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.updatestoremodal.remove();
            }
        }); 
    }
/** AKHIR DARI STORES CRUD FUNCTION **/

/** AWAL DARI PRODUCT CRUD FUNCTION **/
    $scope.openproductunitspop = function (mode) 
    {
        var parameters          = StorageService.get('basic-parameters');
        parameters.STORE_ID     = $scope.datadetail.STORE_ID;
        parameters.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');

        ProductsFac.GetProductUnits(parameters)
        .then(function(responseproductunits)
        {
            $scope.productunits = responseproductunits;
        },
        function(error)
        {
            console.log(error);
        });

        if(mode == 'new')
        {
            $scope.choiceproductunits = {UNIT_ID:$scope.newproduct.UNIT_ID};  
        }
        else
        {
            $scope.choiceproductunits = {UNIT_ID:$scope.updateitemproduct.UNIT_ID};
        }

        $ionicPopup.confirm({
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
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var indexproductgroups = _.findIndex($scope.productunits,{'UNIT_ID':$scope.choiceproductunits.UNIT_ID});
                
                if(mode == 'new')
                {
                    $scope.newproduct.UNIT_ID             = $scope.productunits[indexproductgroups].UNIT_ID;
                    $scope.newproduct.UNIT_NM             = $scope.productunits[indexproductgroups].UNIT_NM; 
                }
                else
                {
                    $scope.updateitemproduct.UNIT_ID      = $scope.productunits[indexproductgroups].UNIT_ID;
                    $scope.updateitemproduct.UNIT_NM      = $scope.productunits[indexproductgroups].UNIT_NM;
                }
            }
          }]
        });
    }

    $scope.openproductgroupspop = function (mode) 
    {
        var parameters          = StorageService.get('basic-parameters');
        parameters.STORE_ID     = $scope.datadetail.STORE_ID;
        parameters.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');

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
          title: 'PILIH GROUP PRODUK?',
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
        $cordovaDialogs.prompt('Group Baru', 'Tambah Produk Group', ['Simpan','Cancel'], '')
        .then(function(result) 
        {
              var input = result.input1;
              var btnIndex = result.buttonIndex;
              if(btnIndex == 1 && input.length > 3)
              {
                    ProductsLiteFac.GetMaxProductGroups($scope.datadetail.STORE_ID)
                    .then(function(responsemax)
                    {
                        var newgroupproduct             = {};
                        newgroupproduct.ACCESS_GROUP    = $scope.datadetail.ACCESS_GROUP;
                        newgroupproduct.STORE_ID        = $scope.datadetail.STORE_ID;
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
                            $scope.productgroups.push(newgroupproduct)
                        },
                        function(errorsetgroup)
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
            ProductsLiteFac.GetMaxProductID($scope.datadetail.STORE_ID)
            .then(function(newproductid)
            {
                $scope.newproduct               = {};
                $scope.newproduct.PRODUCT_ID    = newproductid;
                $scope.newproduct.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.newproduct.ACCESS_GROUP  = $scope.datadetail.ACCESS_GROUP;
                $scope.newproduct.STORE_ID      = $scope.datadetail.STORE_ID;
                $scope.newproduct.PROMO         = "Belum Ada Promo";
                $scope.newproduct.STATUS        = 1;
                $scope.newproduct.IS_FAVORITE   = 0;
            })
            .then(function()
            {
                var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.tambahproduct);
                if(resultcheckmodal)
                {
                    $scope.tambahproduct    = modal;
                    $scope.tambahproduct.show();
                }
            },
            function(error)
            {
                alert("Get Max ProductID Error");
            });
            
        });
    }
    
    $scope.modaltambahproductsubmit = function(formvalidation) 
    {        
        formvalidation.$invalid          = true;
        ProductsLiteFac.CreateProducts($scope.newproduct)
        .then(function(responsesetbarang)
        {
            $scope.dataproducts.unshift($scope.newproduct);
            $ionicSlideBoxDelegate.update();
            $scope.tambahproduct.remove();
            ToastService.ShowToast('Produk Baru Berhasil Disimpan!','success');
        },
        function(errorsetbarang)
        {
            ToastService.ShowToast('Produk Baru Gagal Disimpan!','error');
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

    $scope.modalupdateproductopen   = function(updateproducts,indexproduct)
    {
        $scope.updateproducts   = updateproducts;
        $scope.indexproduct     = indexproduct;
        $ionicModal.fromTemplateUrl('templates/control/products/modalupdateproduct.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updateitemproduct        = angular.copy(updateproducts[indexproduct]);
            $scope.newstock                 = {};
            $scope.newstock.CURRENT_STOCK   = Number($scope.updateitemproduct.CURRENT_STOCK);
            console.log($scope.newstock)

            var parameters                  = UtilService.GetParameters();
            parameters.PRODUCT_ID           = $scope.updateitemproduct.PRODUCT_ID;
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

            ProductsFac.GetProductStocks(parameters)
            .then(function(responsestocks)
            {
                $scope.productstocks = responsestocks;
            },
            function(errorstocks)
            {
                console.log(errorstocks)
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

            ProductsLiteFac.GetProductImagesByProductID(parameters)
            .then(function(responsecheckimagesexist)
            {
                console.log(responsecheckimagesexist);
                if(responsecheckimagesexist.length > 0)
                {
                    $scope.productimages = responsecheckimagesexist[0];
                }
                else
                {
                    ProductsFac.GetProductImagesByProductID(parameters)
                    .then(function(responseimages)
                    {
                        $scope.productimages = responseimages;
                    },
                    function(errorimages)
                    {
                        $scope.productimages = undefined;
                    });    
                }
            },
            function(error)
            {
                console.log(error);
            });

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
        if(!_.isEqual($scope.updateproducts[$scope.indexproduct], $scope.updateitemproduct))
        {
            ProductsLiteFac.UpdateProducts($scope.updateitemproduct)
            .then(function(resupdateproduct)
            {
                $scope.updateproducts[$scope.indexproduct]  = $scope.updateitemproduct;
                $scope.modalupdateproduct.remove();
                ToastService.ShowToast('Data Produk Berhasil Diubah!','success');
            },
            function(error)
            {
                ToastService.ShowToast('Data Produk Gagal Diubah!','error');
            }); 
        }
        else
        {
            $scope.modalupdateproduct.remove();
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

    $scope.showformstock = {show:false};
    $scope.tambahstock = function()
    {
        var masihadayangkosong = UtilService.CheckProperyObjectNullOrNotNull($scope.newstock);
        if(masihadayangkosong || $scope.newstock.INPUT_STOCK == 0)
        {
            $cordovaDialogs.alert('Quantity Stock Tidak Boleh Kosong.');
        }
        else
        {
            $scope.newstock.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.newstock.ACCESS_GROUP  = $scope.updateitemproduct.ACCESS_GROUP;
            $scope.newstock.STORE_ID      = $scope.updateitemproduct.STORE_ID;
            $scope.newstock.PRODUCT_ID    = $scope.updateitemproduct.PRODUCT_ID;
            $scope.newstock.INPUT_DATE    = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.newstock.INPUT_TIME    = $filter('date')(new Date(),'HH:mm:ss');
            $scope.newstock.CURRENT_DATE  = $filter('date')(new Date(),'yyyy-MM-dd');
            $scope.newstock.CURRENT_TIME  = $filter('date')(new Date(),'HH:mm:ss');
            $scope.newstock.SISA_STOCK    = 0;
            $scope.newstock.LAST_STOCK    = 0;
            $scope.newstock.STATUS        = 1;
            $scope.newstock.DCRP_DETIL    = 'ada ada saja';

            ProductStockLiteFac.CreateProductStocks($scope.newstock)
            .then(function(responsecreatestock)
            {
                $scope.newstock.ID_LOCAL = responsecreatestock.ID_LOCAL;
                $scope.productstocks.unshift(angular.copy($scope.newstock));

                $scope.newstock.CURRENT_STOCK = Number($scope.newstock.CURRENT_STOCK) + Number($scope.newstock.INPUT_STOCK);
                
                var indexproduct = _.findIndex($scope.dataproducts,{'PRODUCT_ID':$scope.newstock.PRODUCT_ID});
                $scope.dataproducts[indexproduct].CURRENT_STOCK = $scope.newstock.CURRENT_STOCK;

                ProductsLiteFac.UpdateProductsQuantity($scope.newstock)
                .then(function(response)
                {
                    $scope.newstock.INPUT_STOCK = 0;
                    ToastService.ShowToast('Penambahan Stok Berhasil Disimpan!','success');
                },
                function(error)
                {
                    console.log(error);
                });
                
            },
            function(error)
            {
                ToastService.ShowToast('Penambahan Stok Gagal Disimpan!','error');
            })
        }
    }

    $scope.showformharga = {show:false};
    $scope.tambahharga = function(newharga)
    {
        var masihadayangkosong = UtilService.CheckProperyObjectNullOrNotNull(newharga);
        if(masihadayangkosong)
        {
            alert("Masih Ada Yang Kosong");
        }
        else
        {
            newharga.ACCESS_GROUP  = $scope.updateitemproduct.ACCESS_GROUP;
            newharga.STORE_ID      = $scope.updateitemproduct.STORE_ID;
            newharga.PRODUCT_ID    = $scope.updateitemproduct.PRODUCT_ID;
            newharga.PERIODE_TGL1  = $filter('date')(new Date(newharga.PERIODE_TGL1),'yyyy-MM-dd');
            newharga.PERIODE_TGL2  = $filter('date')(new Date(newharga.PERIODE_TGL2),'yyyy-MM-dd')
            newharga.START_TIME    = $filter('date')(new Date(),'HH:mm:ss')
            newharga.STATUS        = 0;
            newharga.DCRP_DETIL    = 'ada ada saja';
            ProductsFac.CreateProductHargas(newharga)
            .then(function(responsecreateharga)
            {
                $scope.producthargas.unshift(newharga);
                ToastService.ShowToast('Penambahan Harga Berhasil Disimpan!','success');
            },
            function(error)
            {
                ToastService.ShowToast('Penambahan Harga Gagal Disimpan!','error');
            })
        }
        
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
            newdiscount.ACCESS_GROUP  = $scope.updateitemproduct.ACCESS_GROUP;
            newdiscount.STORE_ID      = $scope.updateitemproduct.STORE_ID;
            newdiscount.PRODUCT_ID    = $scope.updateitemproduct.PRODUCT_ID;
            newdiscount.PERIODE_TGL1  = $filter('date')(new Date(newdiscount.PERIODE_TGL1),'yyyy-MM-dd');
            newdiscount.PERIODE_TGL2  = $filter('date')(new Date(newdiscount.PERIODE_TGL2),'yyyy-MM-dd')
            newdiscount.START_TIME    = $filter('date')(new Date(),'HH:mm:ss')
            newdiscount.STATUS        = 0;
            newdiscount.DCRP_DETIL    = 'ada ada saja';
            ProductsFac.CreateProductDiscounts(newdiscount)
            .then(function(responsecreateharga)
            {
                $scope.productdiscounts.unshift(newdiscount);
                ToastService.ShowToast('Penambahan Diskon Berhasil Disimpan!','success');
            },
            function(error)
            {
                ToastService.ShowToast('Penambahan Diskon Gagal Disimpan!','error');
            })
        } 
    }

    $scope.tambahgambar = function(newgambar)
    {
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
                newgambar.ACCESS_GROUP  = $scope.updateitemproduct.ACCESS_GROUP;
                newgambar.STORE_ID      = $scope.updateitemproduct.STORE_ID;
                newgambar.PRODUCT_ID    = $scope.updateitemproduct.PRODUCT_ID;
                newgambar.STATUS        = 1;
                newgambar.DCRP_DETIL    = 'ada ada saja';
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
                                    $ionicLoading.show
                                    ({
                                        template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
                                        noBackdrop:true
                                    })
                                    .then(function()
                                    {

                                        newgambar.PRODUCT_IMAGE = base64;
                                        if(!$scope.productimages)
                                        {
                                            ProductsLiteFac.CreateProductImages(newgambar);
                                            ProductsFac.CreateProductImages(newgambar)
                                            .then(function(responsecreategambar)
                                            {
                                                $scope.productimages = newgambar;
                                                ToastService.ShowToast('Gambar Produk Berhasil Diupload!','success');
                                            },
                                            function(error)
                                            {
                                                ToastService.ShowToast('Gambar Produk Gagal Diupload!','error');     
                                            })
                                            .finally(function()
                                            {
                                                $ionicLoading.hide();     
                                            });
                                        }
                                        else
                                        {
                                            ProductsLiteFac.UpdateProductImages(newgambar);
                                            ProductsFac.UpdateProductImages(newgambar)
                                            .then(function(responsecreategambar)
                                            {
                                                $scope.productimages = newgambar;
                                                $cordovaDialogs.alert('Gambar Produk Berhasil Diubah','Information','Ok');
                                            },
                                            function(error)
                                            {
                                                $cordovaDialogs.alert('Gambar Produk Gagal Diubah','Information','Ok');   
                                            })
                                            .finally(function()
                                            {
                                                $ionicLoading.hide();     
                                            });  
                                        }   
                                    });
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
                            $ionicLoading.show
                            ({
                                  template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
                                  noBackdrop:true
                            })
                            .then(function()
                            {
                                newgambar.PRODUCT_IMAGE = 'data:image/jpeg;base64,' + imageData;
                                if(!$scope.productimages)
                                {
                                    ProductsLiteFac.CreateProductImages(newgambar);
                                    ProductsFac.CreateProductImages(newgambar)
                                    .then(function(responsecreategambar)
                                    {
                                        $scope.productimages = newgambar;
                                        ToastService.ShowToast('Gambar Produk Berhasil Diupload!','success');
                                    },
                                    function(error)
                                    {
                                        ToastService.ShowToast('Gambar Produk Gagal Diupload!','error');
                                    })
                                    .finally(function()
                                    {
                                        $ionicLoading.hide();     
                                    }); 
                                }
                                else
                                {
                                    ProductsLiteFac.UpdateProductImages(newgambar);
                                    ProductsFac.UpdateProductImages(newgambar)
                                    .then(function(responsecreategambar)
                                    {
                                        $scope.productimages = newgambar;
                                        $cordovaDialogs.alert('Gambar Produk Berhasil Diubah','Information','Ok');
                                    },
                                    function(error)
                                    {
                                        $cordovaDialogs.alert('Gambar Produk Gagal Diubah','Information','Ok');   
                                    })
                                    .finally(function()
                                    {
                                        $ionicLoading.hide();     
                                    });  
                                }  
                            });
                        });
                    }, false);
                }
                return true;
            }
        });
    }

    $scope.mode         = {valuechoose:'INFO'};
    $scope.titleup      = $scope.mode.valuechoose;
    $scope.changemode = function(formvalidation)
    {
        $scope.titleup = $scope.mode.valuechoose;
    }
/** AKHIR DARI PRODUCT CRUD FUNCTION **/


/** AWAL DARI MERCHANTS CRUD FUNCTION **/
    $scope.openmerchantbankpop = function (mode) 
    {
        MerchantsFac.GetMerchantBanks()
        .then(function(responsemerchantbanks)
        {
            $scope.merchantsbanks = responsemerchantbanks;
        });
        
        if(mode == 'new')
        {
            $scope.choicemerchantsbank = {BANK_ID:$scope.newmerchant.BANK_ID};  
        }
        else
        {
            $scope.choicemerchantsbank = {BANK_ID:$scope.updatemerchant.BANK_ID};
        }

        $ionicPopup.confirm({
          templateUrl: 'templates/control/merchants/popupmerchantsbank.html',
          title: 'PILIH BANK?',
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
                var indexmerchantbank = _.findIndex($scope.merchantsbanks,{'BANK_ID':$scope.choicemerchantsbank.BANK_ID});
                if(mode == 'new')
                {
                    $scope.newmerchant.BANK_ID = $scope.merchantsbanks[indexmerchantbank].BANK_ID;
                    $scope.newmerchant.BANK_NM = $scope.merchantsbanks[indexmerchantbank].BANK_NM;  
                }
                else
                {
                    $scope.updatemerchant.BANK_ID = $scope.merchantsbanks[indexmerchantbank].BANK_ID;
                    $scope.updatemerchant.BANK_NM = $scope.merchantsbanks[indexmerchantbank].BANK_NM;
                }

                
            }
          }]
        });
    }

    $scope.openmerchanttypepop = function (mode) 
    {
        MerchantsLiteFac.GetMerchantTypes()
        .then(function(responsemerchanttypes)
        {
            $scope.merchantstypes = responsemerchanttypes;
        });

        if(mode == 'new')
        {
            $scope.choicemerchantstype = {TYPE_PAY_ID:$scope.newmerchant.TYPE_PAY_ID};  
        }
        else
        {
            $scope.choicemerchantstype = {TYPE_PAY_ID:$scope.updatemerchant.TYPE_PAY_ID};
        }

        $ionicPopup.confirm({
          templateUrl: 'templates/control/merchants/popupmerchantstype.html',
          title: 'PILIH TYPE PEMBAYARAN?',
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
                var indexmerchantbank = _.findIndex($scope.merchantstypes,{'TYPE_PAY_ID':$scope.choicemerchantstype.TYPE_PAY_ID});
                
                if(mode == 'new')
                {
                    $scope.newmerchant.TYPE_PAY_ID      = $scope.merchantstypes[indexmerchantbank].TYPE_PAY_ID;
                    $scope.newmerchant.TYPE_PAY_NM      = $scope.merchantstypes[indexmerchantbank].TYPE_PAY_NM; 
                }
                else
                {
                    $scope.updatemerchant.TYPE_PAY_ID   = $scope.merchantstypes[indexmerchantbank].TYPE_PAY_ID;
                    $scope.updatemerchant.TYPE_PAY_NM   = $scope.merchantstypes[indexmerchantbank].TYPE_PAY_NM;
                }

            }
          }]
        });
    }

    $scope.modalnewmerchantopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/merchants/modalnewmerchant.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            MerchantsLiteFac.GetMaxMerchantID($scope.datadetail.STORE_ID)
            .then(function(responsenewmerchantid)
            {
                $scope.newmerchant              = {};
                $scope.newmerchant.MERCHANT_ID  = responsenewmerchantid;
                $scope.newmerchant.STORE_ID     = $scope.datadetail.STORE_ID;
                $scope.newmerchant.ACCESS_GROUP = $scope.datadetail.ACCESS_GROUP;
                $scope.newmerchant.STORE_ID     = $scope.datadetail.STORE_ID;
                $scope.newmerchant.STATUS       = 1;
                $scope.newmerchant.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
            })
            .then(function()
            {
                var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalnewmerchant);
                if(resultcheckmodal)
                {
                    $scope.modalnewmerchant     = modal;
                    $scope.modalnewmerchant.show();
                }
            },
            function(error)
            {
                console.log(error);
            });
           
            
        });
    }

    $scope.modalnewmerchantsubmit = function() 
    {
        MerchantsLiteFac.CreateMerchants($scope.newmerchant)
        .then(function(ressavenewmerchant)
        {
            $scope.newmerchant.ID_LOCAL = ressavenewmerchant.ID_LOCAL;
            $scope.datamerchants.unshift($scope.newmerchant);
            $scope.modalnewmerchant.remove();
            ToastService.ShowToast('Penambahan Merchant Berhasil.','success');
        },
        function(error)
        {
            ToastService.ShowToast('Penambahan Merchant Gagal.','error');
        });
    };

    $scope.modalnewmerchantclose = function() 
    {
        
        $scope.modalnewmerchant.remove();
    };

    $scope.modalupdatemerchantopen   = function(detailmerchant,indexmerchant)
    {
        $ionicModal.fromTemplateUrl('templates/control/merchants/modalupdatemerchant.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.datamerchantsebelumdiupdate      = angular.copy(detailmerchant);
            $scope.updatemerchant                   = angular.copy(detailmerchant);
            $scope.indexmerchant                    = angular.copy(indexmerchant);

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalupdatemerchant);
            if(resultcheckmodal)
            {
                $scope.modalupdatemerchant              = modal;
                $scope.modalupdatemerchant.show();
            }
            
        });
    }
    
    $scope.modalupdatemerchantsubmit = function() 
    {
        if(!_.isEqual($scope.datamerchantsebelumdiupdate, $scope.updatemerchant))
        {
            $scope.datamerchants[$scope.indexmerchant] = $scope.updatemerchant;
            MerchantsLiteFac.UpdateMerchants($scope.updatemerchant)
            .then(function(resupdatemerchant)
            {
                $scope.datamerchants[$scope.indexmerchant] = $scope.updatemerchant;
                ToastService.ShowToast('Data Merchant Berhasil Diupdate!','success');
            },
            function(error)
            {
                ToastService.ShowToast('Data Merchant Gagal Diupdate!','error');            
            });
        }
        $scope.modalupdatemerchant.remove();
    };

    $scope.modalupdatemerchantclose = function() 
    {
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.modalupdatemerchant.remove();
            }
        });

    };
/** AKHIR DARI MERCHANTS CRUD FUNCTION **/

/** AWAL DARI CUSTOMERS CRUD FUNCTION **/
    $scope.modalnewcustomeropen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/customers/modalnewcustomer.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            CustomersLiteFac.GetMaxCustomerID($scope.datadetail.STORE_ID)
            .then(function(responsenewcustomerid)
            {
                $scope.newcustomer              = {};
                $scope.newcustomer.CUSTOMER_ID  = responsenewcustomerid;
                $scope.newcustomer.ACCESS_GROUP = $scope.datadetail.ACCESS_GROUP;
                $scope.newcustomer.STORE_ID     = $scope.datadetail.STORE_ID;
                $scope.newcustomer.STATUS       = 1;
                $scope.newcustomer.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
            },
            function(error)
            {
                console.log(error);
            })
            
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.newcustomermodal);
            if(resultcheckmodal)
            {
                $scope.newcustomermodal   = modal;
                $scope.newcustomermodal.show();
            }
        });
    }
    
    $scope.modalnewcustomersubmit = function() 
    {
        CustomersLiteFac.CreateCustomers($scope.newcustomer)
        .then(function(rescreatecustomer)
        {
            $scope.newcustomer.ID_LOCAL = rescreatecustomer.ID_LOCAL;
            $scope.datacustomers.unshift($scope.newcustomer);
            $scope.newcustomermodal.remove();
            ToastService.ShowToast('Pelanggan Baru Berhasil Disimpan!','success');
        },
        function(error)
        {
            ToastService.ShowToast('Pelanggan Baru Gagal Disimpan!','error');
        });
    };

    $scope.modalnewcustomerclose = function() 
    {
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.newcustomermodal.remove();
            }
        });

    };

    $scope.modalupdatecustomeropen   = function(customer,indexcustomer)
    {
        $ionicModal.fromTemplateUrl('templates/control/customers/modalupdatecustomer.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updatecustomer                      = angular.copy(customer);
            $scope.datacustomersblmdiupdate            = angular.copy(customer)
            $scope.indexcustomer                       = angular.copy(indexcustomer);

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.updatecustomermodal);
            if(resultcheckmodal)
            {
                $scope.updatecustomermodal  = modal;
                $scope.updatecustomermodal.show();
            }
        });
    }
    
    $scope.modalupdatecustomersubmit = function() 
    {        
        if(!_.isEqual($scope.datacustomersblmdiupdate,$scope.updatecustomer))
        {
            CustomersLiteFac.UpdateCustomers($scope.updatecustomer)
            .then(function(rescreatecustomer)
            {
                $scope.datacustomers[$scope.indexcustomer] = $scope.updatecustomer;
                $scope.updatecustomermodal.remove();
                ToastService.ShowToast('Data Pelanggan Berhasil Diubah!','success');
            },
            function(error)
            {
                ToastService.ShowToast('Data Pelanggan Gagal Diubah!','error');
            });
        }   
    };

    $scope.modalupdatecustomerclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.updatecustomermodal.remove();
            }
        });
    };
/** AKHIR DARI CUSTOMERS CRUD FUNCTION **/

/** AWAL DARI KARYAWANS CRUD FUNCTION **/
    $scope.pilihjeniskelamin = function(statuscreateorupdate) 
    {
    
        $ionicActionSheet.show({
          titleText: 'Pilih Jenis Kelamin',
          buttons: 
          [
            { text: '<i class="icon ion-male"></i> Laki-laki' },
            { text: '<i class="icon ion-female"></i> Perempuan' },
          ],
          cancelText: 'Cancel',
          buttonClicked: function(index) 
          {
            if(index == 0)
            {
                if(statuscreateorupdate == 'create')
                {
                    $scope.newkaryawan.GENDER = 'Laki-laki';    
                }
                else
                {
                    $scope.updatekaryawan.GENDER = 'Laki-laki'; 
                }
                
            }
            else
            {
                if(statuscreateorupdate == 'create')
                {
                    $scope.newkaryawan.GENDER = 'Perempuan';    
                }
                else
                {
                    $scope.updatekaryawan.GENDER = 'Perempuan'; 
                } 
            }
            return true;
          }
        });
    };

    $scope.pilihstatuspernikahan = function(statuscreateorupdate) 
    {
    
        $ionicActionSheet.show({
          titleText: 'Pilih Status Pernikahan',
          buttons: 
          [
            { text: 'Belum Menikah' },
            { text: 'Sudah Menikah' },
          ],
          cancelText: 'Cancel',
          buttonClicked: function(index) 
          {
            if(index == 0)
            {
                if(statuscreateorupdate == 'create')
                {
                    $scope.newkaryawan.STS_NIKAH = 'Belum Menikah';    
                }
                else
                {
                    $scope.updatekaryawan.STS_NIKAH = 'Belum Menikah'; 
                }
            }
            else
            {
                if(statuscreateorupdate == 'create')
                {
                    $scope.newkaryawan.STS_NIKAH = 'Sudah Menikah';    
                }
                else
                {
                    $scope.updatekaryawan.STS_NIKAH = 'Sudah Menikah'; 
                } 
            }
            return true;
          }
        });
    };

    $scope.modalnewkaryawanopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/karyawans/modalnewkaryawan.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            KaryawansLiteFac.GetMaxKaryawanID($scope.datadetail.STORE_ID)
            .then(function(newkaryawanid)
            {
                $scope.newkaryawan                  = {};
                $scope.newkaryawan.KARYAWAN_ID      = newkaryawanid;
                $scope.newkaryawan.ACCESS_GROUP    = $scope.datadetail.ACCESS_GROUP;
                $scope.newkaryawan.STORE_ID        = $scope.datadetail.STORE_ID;
                $scope.newkaryawan.TGL_SAVE        = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.newkaryawan.STATUS          = 1;
            });

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.newkaryawanmodal);
            if(resultcheckmodal)
            {
                $scope.newkaryawanmodal  = modal;
                $scope.newkaryawanmodal.show();
            }
        });
    }
    
    $scope.modalnewkaryawansubmit = function() 
    {
        $ionicModal.fromTemplateUrl('templates/control/karyawans/modalnewkaryawan.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            KaryawansLiteFac.CreateKaryawans($scope.newkaryawan)
            .then(function(responsesetkaryawan)
            {
                $scope.newkaryawan.ID_LOCAL = responsesetkaryawan.ID_LOCAL;
                $scope.datakaryawans.unshift($scope.newkaryawan);  
                ToastService.ShowToast('Penambahan Karyawan Berhasil.','success');
            },
            function(error)
            {
                ToastService.ShowToast('Penambahan Karyawan Gagal.Periksa Form Inputan Karyawan Dengan Teliti','error');
            })
            .finally(function()
            {
                $ionicLoading.hide();
                $scope.newkaryawanmodal.remove();
            });
        }); 
    };

    $scope.modalnewkaryawanclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.newkaryawanmodal.remove();
            }
        });
    };


    $scope.modalupdatekaryawanopen   = function(detailkaryawan,indexkaryawan)
    {
        $ionicModal.fromTemplateUrl('templates/control/karyawans/modalupdatekaryawan.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.datakaryawansebelumdiupdate         = angular.copy(detailkaryawan);
            $scope.updatekaryawan                      = angular.copy(detailkaryawan);
            $scope.indexkaryawan                       = angular.copy(indexkaryawan);

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalupdatekaryawan);
            if(resultcheckmodal)
            {
                $scope.modalupdatekaryawan  = modal;
                $scope.modalupdatekaryawan.show();
            }
        });
    }
    
    $scope.modalupdatekaryawansubmit = function() 
    {
        if(!_.isEqual($scope.datakaryawansebelumdiupdate, $scope.updatekaryawan))
        {
            $scope.updatekaryawan.TGL_SAVE = $filter('date')(new Date(),'yyyy-MM-dd');
            KaryawansLiteFac.UpdateKaryawans($scope.updatekaryawan)
            .then(function(resgetkaryawan)
            {
                $scope.datakaryawans[$scope.indexkaryawan] = $scope.updatekaryawan;
                $scope.modalupdatekaryawan.remove();
                ToastService.ShowToast('Pengubahan Data Karyawan Berhasil.','success');
            },
            function(error)
            {
                ToastService.ShowToast('Pengubahan Data Karyawan Gagal.Periksa Form Inputan Anda.','success');
            });
        }
        else
        {
            ToastService.ShowToast('Tidak Ada Data Yang Berubah.','success'); 
        }
        
    };

    $scope.modalupdatekaryawanclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.modalupdatekaryawan.remove();
            }
        });
    };
/** AKHIR DARI KARYAWANS CRUD FUNCTION **/

/** AWAL DARI USER-LOGINS CRUD FUNCTION **/
    $scope.modalnewuserloginopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/userlogins/modalnewuserlogin.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.newuserlogin                      = {};
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.newuserloginmodal);
            if(resultcheckmodal)
            {
                $scope.newuserloginmodal  = modal;
                $scope.newuserloginmodal.show();
            }
        });
    }
    
    $scope.modalnewuserloginsubmit = function() 
    {
        $scope.newuserlogin.ACCESS_GROUP    = $scope.datadetail.ACCESS_GROUP;
        $scope.newuserlogin.STORE_ID        = $scope.datadetail.STORE_ID;
        SecuredFac.RegistrationLoginOps($scope.newuserlogin)
        .then(function(ressetops)
        {
            $scope.datauserops.unshift(ressetops);
            ToastService.ShowToast('Penambahan Operasional Berhasil Disimpan!','success');
        },
        function(error)
        {
            ToastService.ShowToast('Penambahan Operasional Gagal Disimpan!','error');
        })
        $scope.newuserloginmodal.remove();
    };

    $scope.modalnewuserloginclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.newuserloginmodal.remove();
            }
        });
    };

    $scope.modalupdateuserloginopen   = function(detailops)
    {
        $ionicModal.fromTemplateUrl('templates/control/userlogins/modalupdateuserlogin.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updateuserlogin                      = angular.copy(detailops);
            $scope.updateuserloginmodal                 = modal;
            $scope.updateuserloginmodal.show();
        });
    }

    $scope.modalupdateuserloginsubmit = function() 
    {
        SecuredFac.UpdateLoginOps($scope.updateuserlogin)
        .then(function(resupdateops)
        {
            console.log(resupdateops)
            $scope.newuserloginmodal.remove();
            ToastService.ShowToast('Data Operasional Berhasil Diubah!','success');
        },
        function(error)
        {
            ToastService.ShowToast('Data Operasional Gagal Diubah!','error');
        });
    };

    $scope.modalupdateuserloginclose = function() 
    {
        
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.updateuserloginmodal.remove();
            }
        });
    };
/** AKHIR DARI USER-LOGINS CRUD FUNCTION **/
	$scope.toggleGroup = function(datatoshow) 
	{
		if(datatoshow == 'basic')
		{
			$scope.showmerchant	    = false;
			$scope.showproduct	    = false;
			$scope.showemploye	    = false;
            $scope.showbasic        = !$scope.showbasic;
            $scope.showuserlogin    = false;
            $scope.showcustomers    = false;	
		}
		else if(datatoshow == 'product')
		{
			$scope.showbasic	    = false;
			$scope.showmerchant	    = false;
			$scope.showemploye	    = false;
			$scope.showproduct      = !$scope.showproduct;
            $scope.showuserlogin    = false;
            $scope.showcustomers    = false;
		}
		else if(datatoshow == 'merchant')
		{
			$scope.showbasic	    = false;
			$scope.showproduct	    = false;
			$scope.showemploye	    = false;
			$scope.showmerchant	    = !$scope.showmerchant;
            $scope.showuserlogin    = false;
            $scope.showcustomers    = false;
		}
		else if(datatoshow == 'employe')
		{
			$scope.showbasic	    = false;
			$scope.showproduct	    = false;
			$scope.showmerchant	    = false;
			$scope.showemploye	    = !$scope.showemploye;
            $scope.showuserlogin    = false;
            $scope.showcustomers    = false;
		}
        else if(datatoshow == 'userlogin')
        {
            $scope.showbasic        = false;
            $scope.showproduct      = false;
            $scope.showmerchant     = false;
            $scope.showemploye      = false;
            $scope.showuserlogin    = !$scope.showuserlogin;
            $scope.showcustomers    = false;
        }
        else if(datatoshow == 'customers')
        {
            $scope.showbasic        = false;
            $scope.showproduct      = false;
            $scope.showmerchant     = false;
            $scope.showemploye      = false;
            $scope.showuserlogin    = false;
            $scope.showcustomers    = !$scope.showcustomers;

        }
	};

	$scope.isGroupShown = function(datatoshow) 
	{
		return $scope.shownGroup === datatoshow;
	}
    	
}])