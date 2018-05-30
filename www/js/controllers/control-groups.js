angular.module('starter')
.controller('ControlGroupProductCtrl',['ConstructorService','StoresCombFac','ProductsLiteFac','SecuredFac','CustomersCombFac','ProvinsisCombFac','MerchantsFac','StoresFac','ProductsFac','ProductsCombFac','StorageService','UtilService','$ionicActionSheet','$cordovaImagePicker','$cordovaCamera','$cordovaDialogs','$cordovaToast','$ionicPopup','$ionicSlideBoxDelegate','$ionicModal','$ionicLoading','$ionicHistory','$scope','$timeout','$state','$filter','$location', 
function(ConstructorService,StoresCombFac,ProductsLiteFac,SecuredFac,CustomersCombFac,ProvinsisCombFac,MerchantsFac,StoresFac,ProductsFac,ProductsCombFac,StorageService,UtilService,$ionicActionSheet,$cordovaImagePicker,$cordovaCamera,$cordovaDialogs,$cordovaToast,$ionicPopup,$ionicSlideBoxDelegate,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter,$location) 
{
	$scope.listCanSwipe = true
    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        $scope.$apply();
    }, false);

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
            var parameters = UtilService.GetParameters();
            StoresCombFac.GetStores(parameters)
            .then(function(resgetstores)
            {
                $scope.stores = resgetstores;
                $scope.store  = resgetstores[0];
            });
        });      

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
                    $scope.dataproducts = undefined;
                    $scope.loadgroupproduct(result);
                }
              }]
            });
        }
    /** AKHIR DARI STORES CRUD FUNCTION **/
        $scope.loadgroupproduct = function(store)
    	{;
            var parameters      = UtilService.GetParameters();
            if(store)
            {
                parameters.STORE_ID = store.STORE_ID;
            }

            ProductsCombFac.GetProductGroups(parameters)
            .then(function(resgetgroups)
            {
                $scope.groupsproducts = resgetgroups;
                if(resgetgroups.length > 0)
                {
                    $scope.detailgroupproduct(resgetgroups[0]);
                }
                else
                {
                    document.addEventListener("deviceready", function () 
                    {
                        $cordovaToast.show('Group Produk Untuk Toko Ini Masih Kosong.', 'long', 'bottom');
                    });
                }
            });	
    	}
    	$scope.loadgroupproduct();

    	$scope.detailgroupproduct 	= function(datagroup)
    	{
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
            });

            $scope.showinfoproduct    = true;
            $scope.datadetailgroup 	  = datagroup;
    		if (!$scope.isGroupShown(datagroup)) 
    	    {
    	      $scope.shownGroup = datagroup;
    	    }
            datagroup.TGL_SAVE = $filter('date')(new Date(),'yyyy-MM-dd');
            ProductsLiteFac.GetProductsByGroupID(datagroup)
            .then(function(resproducts)
            {
                $scope.dataproducts = resproducts;
                if($scope.dataproducts.length == 0)
                {
                    document.addEventListener("deviceready", function () 
                    {
                        $cordovaToast.show('Produk Untuk Group Ini Masih Kosong.Tambahkan Produk Melalui Menu Produk', 'long', 'bottom');
                    });
                }
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
    	}

        $scope.detailgroupproductlayarkecil   = function(datagroup)
        {
            $location.path('/tab/control/groupproduct/' + datagroup.STORE_ID + '/' + datagroup.GROUP_ID)
        }

    /** AWAL DARI PRODUCT GROUP CRUD FUNCTION **/
        $scope.modaltambahgroupopen   = function()
        {
            $ionicModal.fromTemplateUrl('templates/control/products-group/modalnewgroup.html', 
            {
                scope: $scope,
                animation: 'animated zoomInUp',
                hideDelay:1020,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            })
            .then(function(modal) 
            {
                ProductsLiteFac.GetMaxProductGroups($scope.store.STORE_ID)
                .then(function(responsemax)
                {
                    var LAST_ID                     = responsemax[0].MAX_GROUP_ID;
                    $scope.newgroupproduct          = ConstructorService.ProductGroupConstructor($scope.store,LAST_ID);
                    $scope.newgroupproduct.STATUS   = 1;
                },
                function(error)
                {
                    console.log(error);
                });
                
                var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.tambahgroupproduct);
                if(resultcheckmodal)
                {
                    $scope.tambahgroupproduct    = modal;
                    $scope.tambahgroupproduct.show();
                }
            });
        }
        
        $scope.modaltambahgroupsubmit = function(formvalidation) 
        {        
            formvalidation.$invalid          = true;
            ProductsLiteFac.CreateProductGroups($scope.newgroupproduct)
            .then(function(responsesetgroup)
            {
                $scope.newgroupproduct.ID_LOCAL = responsesetgroup.insertId;
                $scope.groupsproducts.unshift($scope.newgroupproduct);
                $scope.detailgroupproduct($scope.newgroupproduct);
                $cordovaToast.show('Penambahan Grup Produk Berhasil Disimpan!', 'long', 'bottom');
            },
            function(errorsetgroup)
            {
                $cordovaToast.show('Penambahan Grup Produk Gagal Disimpan!', 'long', 'bottom');
            });

            if($scope.tambahgroupproduct)
            {
                $scope.tambahgroupproduct.remove();
            }   
        };

        $scope.modaltambahgroupclose = function() 
        {
            $scope.tambahgroupproduct.remove();
        };

        $scope.modalupdategroupopen   = function(updategroup,indexgroup)
        {

            $ionicModal.fromTemplateUrl('templates/control/products-group/modalupdategroup.html', 
            {
                scope: $scope,
                animation: 'animated zoomInUp',
                hideDelay:1020,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            })
            .then(function(modal) 
            {
                $scope.updategroup              = angular.copy(updategroup);
                $scope.groupsebelumdiupdate     = angular.copy(updategroup);
                $scope.indexgroupproduct        = angular.copy(indexgroup);

                var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalupdategroup);
                if(resultcheckmodal)
                {
                    $scope.modalupdategroup         = modal;
                    $scope.modalupdategroup.show();
                }
                  
            });
        }
        
        $scope.modalupdategroupsubmit = function() 
        {
            if(!_.isEqual($scope.groupsebelumdiupdate, $scope.updategroup))
            {
                ProductsLiteFac.UpdateProductGroups($scope.updategroup)
                .then(function(resupdategrup)
                {
                    $timeout(function() 
                    {
                        $scope.groupsproducts[$scope.indexgroupproduct] = $scope.updategroup;
                        $scope.detailgroupproduct($scope.updategroup)
                        if (!$scope.isGroupShown($scope.updategroup)) 
                        {
                          $scope.shownGroup = $scope.updategroup;
                        }
                    }, 10);
                    $cordovaToast.show('Data Grup Produk Berhasil Diubah!', 'long', 'bottom');
                    
                },
                function(error)
                {
                    $cordovaToast.show('Data Grup Produk Gagal Diubah!', 'long', 'bottom');
                });
            }
            if($scope.modalupdategroup)
            {
                $scope.modalupdategroup.remove();
            }
        };

        $scope.modalupdategroupclose = function() 
        {
            $scope.modalupdategroup.remove();
        };

    /** AKHIR DARI PRODUCT CRUD FUNCTION **/

    	$scope.toggleGroup = function(datatoshow) 
    	{
    		if(datatoshow == 'infogroup')
    		{
    			$scope.showinfoproduct	     = false;
    			$scope.showinfogroup         = !$scope.showinfogroup;
    		}
            if(datatoshow == 'infoproduct')
            {
                $ionicSlideBoxDelegate.update();
                $scope.showinfogroup         = false;
                $scope.showinfoproduct       = !$scope.showinfoproduct;
            }

    	};

    	$scope.isGroupShown = function(datatoshow) 
    	{
    		return $scope.shownGroup === datatoshow;
    	};	
}])

.controller('ControlGroupProductDetailCtrl',['$stateParams','StoresCombFac','ProductsLiteFac','SecuredFac','CustomersCombFac','ProvinsisCombFac','MerchantsFac','StoresFac','ProductsFac','ProductsCombFac','StorageService','UtilService','$ionicActionSheet','$cordovaImagePicker','$cordovaCamera','$cordovaDialogs','$cordovaToast','$ionicPopup','$ionicSlideBoxDelegate','$ionicModal','$ionicLoading','$ionicHistory','$scope','$timeout','$state','$filter','$location', 
function($stateParams,StoresCombFac,ProductsLiteFac,SecuredFac,CustomersCombFac,ProvinsisCombFac,MerchantsFac,StoresFac,ProductsFac,ProductsCombFac,StorageService,UtilService,$ionicActionSheet,$cordovaImagePicker,$cordovaCamera,$cordovaDialogs,$cordovaToast,$ionicPopup,$ionicSlideBoxDelegate,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter,$location) 
{
    var params      = {};
    params.STORE_ID = $stateParams.storeid;
    params.GROUP_ID = $stateParams.groupid;
    params.TGL_SAVE = $filter('date')(new Date(),'yyyy-MM-dd');
    ProductsLiteFac.GetProductsByGroupID(params)
    .then(function(resproducts)
    {
        $scope.dataproducts = resproducts;
        if($scope.dataproducts.length == 0)
        {
            document.addEventListener("deviceready", function () 
            {
                $cordovaToast.show('Produk Untuk Group Ini Masih Kosong.Tambahkan Produk Melalui Menu Produk', 'long', 'bottom');
            });
        }
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

}])