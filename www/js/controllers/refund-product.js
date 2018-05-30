angular.module('starter')
.controller('RefundProductCtrl',['TransaksiCombFac','TransaksisLiteFac','ShopCartLiteFac','ProductsLiteFac','ConstructorService','$ionicPopup','$ionicActionSheet','$cordovaDialogs','$cordovaToast','$scope','$ionicLoading','$ionicModal','$filter','UtilService','StorageService',
function(TransaksiCombFac,TransaksisLiteFac,ShopCartLiteFac,ProductsLiteFac,ConstructorService,$ionicPopup,$ionicActionSheet,$cordovaDialogs,$cordovaToast,$scope,$ionicLoading,$ionicModal,$filter,UtilService,StorageService) 
{
    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        $scope.$apply();
    }, false);

    $scope.namatoko = StorageService.get('advanced-profile').STORES_ACTIVE.STORE_NM;
    $scope.refundby = {valuechoose:'TRANSAKSI'};
    
    var parameters                  = UtilService.GetParameters();

    $scope.loadproductitemforrefund = function()
    {
        ProductsLiteFac.GetProducts(parameters)
        .then(function(responsebarangpenjualan)
        {
            $scope.itemincart           = StorageService.get('barangrefund');
            if(!$scope.itemincart)
            {
                $scope.itemincart = [];
            }
            angular.forEach($scope.itemincart,function(value,key)
            {
                var itemaddtocart = _.findIndex(responsebarangpenjualan, {'PRODUCT_ID': value.PRODUCT_ID});
                if(itemaddtocart != -1)
                {
                    responsebarangpenjualan[itemaddtocart].QTY_INCART = Number(value.QTY_INCART);
                }
            });
            $scope.databarangpenjualan = responsebarangpenjualan;

        },
        function(error)
        {
            console.log(error);
        });
    }
    $scope.loadproductitemforrefund();

    $scope.pilihalasanrefund = function()
    {
        $ionicPopup.confirm({
          templateUrl: 'templates/refund/popupalasanrefund.html',
          title: 'PILIH ALASAN REFUND?',
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
                $scope.alasanrefund = {};
                $scope.alasanrefund.PILIH_ALASAN  = 'Kemasan Rusak';
            }
          }]
        });
    }

/** AWAL DARI ADD TO CART FUNCTION**/
    $scope.OpenModalAddToCart = function(item) 
    {
            
        $scope.itemasli     = angular.copy(item);
        $scope.itemdecinc   = angular.copy(item);
        $scope.itemdimodal  = angular.copy(item);  
        
        $ionicModal.fromTemplateUrl('templates/refund/modaladdtocart.html', 
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
    };
    
    $scope.CloseModalAddToCart = function() 
    {
        var indexbarangpenjualan                            = _.findIndex($scope.databarangpenjualan,{'PRODUCT_ID':$scope.itemdimodal.PRODUCT_ID});
        var indexbarangidicart                              = _.findIndex($scope.itemincart,{'PRODUCT_ID':$scope.itemdimodal.PRODUCT_ID});
        $scope.databarangpenjualan[indexbarangpenjualan]    = $scope.itemdimodal;
        if($scope.itemdimodal.QTY_INCART > 0)
        {
            if(indexbarangidicart >= 0)
            {
                $scope.itemincart[indexbarangidicart].QTY_INCART    = $scope.itemdimodal.QTY_INCART;   
            }
            else
            {
                $scope.itemincart.push($scope.itemdimodal);
            }
        }
        console.log($scope.itemdimodal);

        StorageService.set('barangrefund',$scope.itemincart);
        $scope.modaladdtocart.remove();
    };

    $scope.CancelModalAddToCart = function() 
    {
        $scope.modaladdtocart.remove();
    }

    $scope.incdec = function(incdec)
    {
        $scope.itemdimodal.QTY_INCART       = Number($scope.itemdimodal.QTY_INCART);
        if(incdec == 'inc')
        {
            $scope.itemdimodal.QTY_INCART         += 1;    
        }
        else if(incdec == 'dec')
        {
            if($scope.itemdimodal.QTY_INCART)
            {
                $scope.itemdimodal.QTY_INCART         -= 1;    
            }
            
        }
    }

    $scope.clearquantity = function()
    {
        $scope.itemdimodal.QTY_INCART        = 0;
    }

    $scope.OpenModalItemRefund = function()
    {
        $ionicModal.fromTemplateUrl('templates/refund/modalitemrefund.html', 
        {
            scope: $scope,
            animation: 'fade-in-scale',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalitemrefund);
            {
                $scope.modalitemrefund            = modal;
                $scope.modalitemrefund.show();  
            }
        });   
    }

    $scope.CloseModalItemRefund = function()
    {
        $scope.modalitemrefund.remove();
    }

    $scope.SubmitModalItemRefund = function(totalpembayaran)
    {
        $cordovaDialogs.confirm('Apakah Kamu Yakin Akan Melakukan Refund?', ['Yes','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                var parameters                          = UtilService.GetParameters();
                $scope.nomortransaksirefund             = UtilService.GenerateNomorTransaksiRefund(parameters);

                var parameters              = ConstructorService.TransaksiHeaderConstructor($scope.nomortransaksirefund,'manual');;
                parameters.TRANS_ID         = $scope.nomortransaksirefund;
                parameters.SPLIT_TRANS_ID   = $scope.nomortransaksirefund.split('.')[3] + '.' + $scope.nomortransaksirefund.split('.')[4];
                parameters.TOTAL_PRODUCT    = $scope.itemincart.length;
                parameters.SUB_TOTAL_HARGA  = totalpembayaran;
                parameters.PPN              = 0;
                parameters.TOTAL_HARGA      = totalpembayaran;
                parameters.STATUS           = 1;
                parameters.DCRP_DETIL       = 'REFUND';
                parameters.TRANS_TYPE       = 1;//Refund Transaksi
                
                TransaksisLiteFac.CreateTransaksiHeaders(parameters)
                .then(function(reponse)
                {
                    var barangrefund = StorageService.get('barangrefund');
                    angular.forEach(barangrefund,function(value,index)
                    {
                        var datashopcarttosave                  = ConstructorService.ProductAddToShopCart(value);
                        datashopcarttosave.ACCESS_ID            = parameters.ACCESS_ID;
                        datashopcarttosave.TRANS_ID             = $scope.nomortransaksirefund;
                        datashopcarttosave.CURRENT_STOCK        = value.CURRENT_STOCK;
                        datashopcarttosave.TRANS_TYPE           = 1;
                        datashopcarttosave.STATUS               = 1;

                        ShopCartLiteFac.CreateShopCartRefund(datashopcarttosave)
                        .then(function(responsecreaterefund)
                        {
                            console.log(responsecreaterefund);
                        },
                        function(error)
                        {
                            console.log(error);
                        })
                    });
                })
                .then(function()
                {
                    StorageService.destroy('barangrefund')
                    $scope.loadproductitemforrefund();
                    $scope.CloseModalItemRefund(); 
                },
                function(error)
                {
                    console.log(error)
                });

                
                
            }
        });
    }
/** AKHIR DARI ADD TO CART FUNCTION **/

    $scope.hitungtotal = function(datahitung)
    {
        var total = UtilService.SumPriceWithQtyWithPPN(datahitung,'HARGA_JUAL','QTY_INCART','CURRENT_PPN');  
        return total;
    }

}])


