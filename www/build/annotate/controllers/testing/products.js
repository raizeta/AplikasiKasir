angular.module('starter')
.controller('TestingProductsCtrl', ['ProductsCombFac', 'ProductsFac', 'ProductsLiteFac', 'ConstructorService', 'StorageService', 'UtilService', '$cordovaToast', '$cordovaDialogs', '$ionicPopup', '$ionicModal', '$ionicLoading', '$ionicHistory', '$scope', '$timeout', '$state', '$filter', function(ProductsCombFac,ProductsFac,ProductsLiteFac,ConstructorService,StorageService,UtilService,$cordovaToast,$cordovaDialogs,$ionicPopup,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter) 
{   
/** AWAL DARI PRODUCT CRUD FUNCTION **/
    $scope.$on('$ionicView.beforeEnter', function()
    {
        var parameters  = UtilService.GetParameters();
        var parameters          = UtilService.GetParameters();
        ProductsCombFac.GetProducts(parameters)
        .then(function(resgetproduct)
        {
            $scope.dataproducts = resgetproduct;
        },
        function(error)
        {
            console.log(error);
        });

        ProductsFac.GetProductIndustriGroups()
        .then(function(resindustrigroups)
        {
            $scope.industrigroups = resindustrigroups;
        },
        function(error)
        {
            console.log(error);
        });

        ProductsFac.GetProductUnits(parameters)
        .then(function(responseproductunits)
        {
            $scope.productunits = responseproductunits;
        },
        function(error)
        {
            console.log(error);
        });

        var parameters          = UtilService.GetParameters();
        ProductsFac.GetProductGroups(parameters)
        .then(function(responseproductgroups)
        {
            $scope.productgroups = responseproductgroups;
        });
    });

    $scope.openindustrigroupspop = function (mode) 
    {
        if(mode == 'new')
        {
            $scope.choiceindustrigroups = {INDUSTRY_GRP_ID:$scope.newproduct.INDUSTRY_GRP_ID};  
        }
        else
        {
            $scope.choiceindustrigroups = {INDUSTRY_GRP_ID:$scope.updateitemproduct.INDUSTRY_GRP_ID};
        }

        $ionicPopup.confirm({
          templateUrl: 'templates/control/products/popupindustrigroups.html',
          title: 'PILIH INDUSTRI PRODUCTS?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var indexindustrigroups = _.findIndex($scope.industrigroups,{'INDUSTRY_GRP_ID':$scope.choiceindustrigroups.INDUSTRY_GRP_ID});
                if(mode == 'new')
                {
                    $scope.newproduct.INDUSTRY_GRP_ID          = $scope.industrigroups[indexindustrigroups].INDUSTRY_GRP_ID;
                    $scope.newproduct.INDUSTRY_GRP_NM          = $scope.industrigroups[indexindustrigroups].INDUSTRY_GRP_NM; 
                }
                else
                {
                    $scope.updateitemproduct.INDUSTRY_GRP_ID   = $scope.industrigroups[indexindustrigroups].INDUSTRY_GRP_ID;
                    $scope.updateitemproduct.INDUSTRY_GRP_NM   = $scope.industrigroups[indexindustrigroups].INDUSTRY_GRP_NM;
                }
            }
          }]
        });
    }

    $scope.openproductindustrispop = function (mode) 
    {
        var parameters              = UtilService.GetParameters();
        parameters.INDUSTRY_GRP_ID  = $scope.choiceindustrigroups.INDUSTRY_GRP_ID;

        ProductsFac.GetProductIndustris(parameters)
        .then(function(responseproductindustris)
        {
            $scope.productindustris = responseproductindustris;
        },
        function(error)
        {
            console.log(error);
        });

        if(mode == 'new')
        {
            $scope.choiceproductindustris = {INDUSTRY_ID:$scope.newproduct.INDUSTRY_ID};  
        }
        else
        {
            $scope.choiceproductindustris = {INDUSTRY_ID:$scope.updateitemproduct.INDUSTRY_ID};
        }

        $ionicPopup.confirm({
          templateUrl: 'templates/control/products/popupproductindustris.html',
          title: 'PILIH INDUSTRI PRODUCTS?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var indexproductindustris = _.findIndex($scope.productindustris,{'INDUSTRY_ID':$scope.choiceproductindustris.INDUSTRY_ID});
                
                if(mode == 'new')
                {
                    $scope.newproduct.INDUSTRY_ID             = $scope.productindustris[indexproductindustris].INDUSTRY_ID;
                    $scope.newproduct.INDUSTRY_NM             = $scope.productindustris[indexproductindustris].INDUSTRY_NM; 
                }
                else
                {
                    $scope.updateitemproduct.INDUSTRY_ID      = $scope.productindustris[indexproductindustris].INDUSTRY_ID;
                    $scope.updateitemproduct.INDUSTRY_NM      = $scope.productindustris[indexproductindustris].INDUSTRY_NM;
                }
            }
          }]
        });
    }

    $scope.openproductunitspop = function (mode) 
    {
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
          title: 'PILIH UNIT PRODUCTS?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
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
          title: 'PILIH GROUP PRODUCTS?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
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
            var parameters = UtilService.GetParameters();
            ProductsLiteFac.GetMaxProductID(parameters.STORE_ID)
            .then(function(newproductid)
            {
                $scope.newproduct               = {};
                $scope.newproduct.PRODUCT_ID    = newproductid;
                $scope.newproduct.TGL_SAVE      = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.newproduct.ACCESS_GROUP  = parameters.ACCESS_GROUP;
                $scope.newproduct.STORE_ID      = parameters.STORE_ID;
                $scope.newproduct.PROMO         = "Belum Ada Promo";
                $scope.newproduct.STATUS        = 1;
                $scope.newproduct.IS_FAVORITE   = 0;
            },
            function(error)
            {
                console.log(error);
            });

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modaltambahproduct);
            if(resultcheckmodal)
            {
                $scope.modaltambahproduct    = modal;
                $scope.modaltambahproduct.show();
            }
        });
    }
    
    $scope.modaltambahproductsubmit = function(formvalidation) 
    {        
        formvalidation.$invalid          = true;
        ProductsLiteFac.CreateProducts($scope.newproduct)
        .then(function(responsesetproduct)
        {
            $scope.newproduct.ID_LOCAL = responsesetproduct.ID_LOCAL;
            console.log($scope.newproduct);
            $scope.dataproducts.unshift($scope.newproduct);
            $scope.modaltambahproduct.remove();
            $cordovaToast.show('Penambahan Produk Berhasil Disimpan!', 'long', 'bottom');
        },
        function(errorsetbarang)
        {
            console.log(errorsetbarang);
            $cordovaToast.show('Penambahan Produk Gagal Disimpan!', 'long', 'bottom');
        });   
    };

    $scope.modaltambahproductclose = function() 
    {
        $scope.modaltambahproduct.remove();
    };

    $scope.modalupdateproductopen   = function(updateproducts,indexproduct)
    {
        $scope.mode         = {valuechoose:'INFO'};
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
            $scope.indexproduct     	= angular.copy(indexproduct);
            $scope.updateitemproduct    = angular.copy(updateproducts);
            $scope.productsebelumupdate = angular.copy(updateproducts);

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
        if(!_.isEqual($scope.productsebelumupdate,$scope.updateitemproduct))
        {
            ProductsLiteFac.UpdateProducts($scope.updateitemproduct)
            .then(function(resupdateproduct)
            {
                $scope.dataproducts[$scope.indexproduct] = $scope.updateitemproduct;
                $cordovaToast.show('Data Product Berhasil Di Update!', 'long', 'bottom');
            },
            function(error)
            {
                console.log(error);
            }); 
        }
        $scope.modalupdateproduct.remove();
    };

    $scope.modalupdateproductclose = function() 
    {
        $scope.modalupdateproduct.remove();
    };

    $scope.modaldeleteproductopen = function(product,indexproduct)
	{
		$cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus '+ product.PRODUCT_NM +' ?',product.PRODUCT_NM, ['Delete','Cancel'])
    	.then(function(buttonIndex) 
    	{
      		var btnIndex = buttonIndex;
      		if(buttonIndex == 1)
      		{
                ProductsLiteFac.DeleteProducts(product)
                .then(function(resdeleteproduct)
                {
                    $scope.dataproducts.splice(indexproduct,1);
                    $cordovaToast.show('Product Telah Berhasil Di Delete!', 'long', 'bottom');
                },
                function(error)
                {
                    console.log(error);
                });  	
      		}
      		
    	});
	}
/** AKHIR DARI PRODUCT CRUD FUNCTION **/	   
}]);