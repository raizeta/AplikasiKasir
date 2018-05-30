angular.module('starter')
.controller('TestingProductGroupsCtrl', ['ProductsCombFac', 'ProductsLiteFac', 'ConstructorService', 'UtilService', '$cordovaToast', '$cordovaDialogs', '$ionicModal', '$ionicLoading', '$filter', '$scope', function(ProductsCombFac,ProductsLiteFac,ConstructorService,UtilService,$cordovaToast,$cordovaDialogs,$ionicModal,$ionicLoading,$filter,$scope) 
{   
    var parameters = UtilService.GetParameters();
    ProductsCombFac.GetProductGroups(parameters)
    .then(function(responsegetgroups)
    {
        $scope.dataproductgroups = responsegetgroups;
    },
    function(error)
    {
        console.log(error);
    });

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
            ProductsLiteFac.GetMaxProductGroups(parameters.STORE_ID)
            .then(function(newgroupdid)
            {
                $scope.newgroupproduct              = {};
                $scope.newgroupproduct.GROUP_ID     = newgroupdid;
                $scope.newgroupproduct.ACCESS_GROUP = parameters.ACCESS_GROUP;
                $scope.newgroupproduct.STORE_ID     = parameters.STORE_ID;
                $scope.newgroupproduct.STATUS       = 1;
            })
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
        $scope.tambahgroupproduct.remove();
        ProductsLiteFac.CreateProductGroups($scope.newgroupproduct)
        .then(function(responsesetgroup)
        {
            $scope.newgroupproduct.ID_LOCAL = responsesetgroup.ID_LOCAL;
            $scope.dataproductgroups.unshift($scope.newgroupproduct);
            $cordovaToast.show('Penambahan Grup Produk Berhasil Disimpan!', 'long', 'bottom');
        },
        function(errorsetgroup)
        {
            $cordovaToast.show('Penambahan Grup Produk Gagal Disimpan!', 'long', 'bottom');
        });   
    };

    $scope.modaltambahgroupclose = function() 
    {
        $scope.tambahgroupproduct.remove();
    };

    $scope.modalupdategroupopen   = function(productgroup,indexproductgroup)
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
            $scope.groupsebelumdiupdate     = angular.copy(productgroup);
            $scope.updategroup              = angular.copy(productgroup);
            $scope.indexproductgroup        = angular.copy(indexproductgroup);
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
                $scope.dataproductgroups[$scope.indexproductgroup] = $scope.updategroup;
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

    $scope.modaldeletegroupopen = function(productgroup,indexproductgroup)
    {
        $cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus '+ productgroup.GROUP_NM +' ?',productgroup.GROUP_NM, ['Delete','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                ProductsLiteFac.DeleteProductGroups(productgroup)
                .then(function(resdeleteproductgroup)
                {
                    $scope.dataproductgroups.splice(indexproductgroup,1);
                    $cordovaToast.show('Customer Telah Berhasil Di Delete!', 'long', 'bottom');
                },
                function(error)
                {
                    console.log(error);
                });     
            }
            
        });
    }
}]);