angular.module('starter')
.controller('AccountingRefundCtrl',['TransaksiCombFac','TransaksisLiteFac','TransaksisFac','StoresCombFac','ShopCartLiteFac','$scope','$ionicPopup','$timeout','$ionicLoading','$filter','$ionicPopup','$ionicModal','UtilService','StorageService',
function(TransaksiCombFac,TransaksisLiteFac,TransaksisFac,StoresCombFac,ShopCartLiteFac,$scope,$ionicPopup,$timeout,$ionicLoading,$filter,$ionicPopup,$ionicModal,UtilService,StorageService) 
{
    $scope.$on('$ionicView.beforeEnter', function()
    {        
        $scope.screenbesar      = UtilService.CheckScreenSize();
        window.addEventListener("orientationchange", function() 
        {
            $scope.screenbesar = UtilService.CheckScreenSize(screen);
            $scope.$apply();
        }, false);

        var parameters = UtilService.GetParameters();
        StoresCombFac.GetStores(parameters)
        .then(function(resgetstores)
        {
            $scope.stores       = resgetstores;
            // $scope.stores.push({'STORE_NM':'SEMUA TOKO','STORE_ID':parameters.ACCESS_GROUP + '.00000'});
            $scope.store        = resgetstores[0];
        });
    });

    $scope.openstorepopup = function (store) 
    {
        $scope.choiceview   = store;
        $scope.choice       = {STORE_ID:$scope.choiceview.STORE_ID};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/popupstore.html',
          title: 'PILIH TOKO?',
          scope: $scope,
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
                var resultstore     = angular.copy($scope.stores[index]);
                $scope.store        = resultstore;
                $scope.headerdetail = undefined;
                $timeout(function()
                {
                    $scope.loadtransaksiheader(resultstore);   
                });
            }
          }]
        });
    }

    
    $scope.loadtransaksiheader = function(store)
    {
        var parameters          = UtilService.GetParameters();
        parameters.DCRP_DETIL   = 'REFUND';
        if(store)
        {
            parameters.STORE_ID = store.STORE_ID;
        }
        console.log(parameters);
        TransaksisLiteFac.GetTransaksiHeadersByRefundOrNotRefund(parameters)
        .then(function(responsetransaksiheaders)
        {
            $scope.datatransaksiheader  = responsetransaksiheaders;
            var len                     = $scope.datatransaksiheader.length
            if(len > 0)
            {
                $scope.showdetail($scope.datatransaksiheader[len-1]);
            }
            $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.loadtransaksiheader();
    //This Function Work When Screen Large
    $scope.showdetail   = function(transaksiheader)
    {
        if (!$scope.isGroupShown(transaksiheader)) 
        {
            $scope.datayangdibeli   = undefined;
            $scope.shownGroup       = transaksiheader;
            $ionicLoading.show
            ({
              template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
              noBackdrop:false
            })
            .then(function()
            {
                $scope.headerdetail     = angular.copy(transaksiheader); 
                var parameters          = UtilService.GetParameters();
                parameters.TRANS_ID     = transaksiheader.TRANS_ID;  
                TransaksiCombFac.GetTransaksiDetails(parameters)
                .then(function(restransaksidetails)
                {
                    $scope.datayangdibeli    = restransaksidetails;
                });  
            })
            .finally(function()
            {
                $ionicLoading.show({template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',duration: 1000});
            });
        } 
         
    }

    //This Function Work When Screen Small
    $scope.showmodaldetail   = function(transaksiheader)
    {
        $ionicModal.fromTemplateUrl('templates/accounting/modaldetailrefund.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modaldetailtransaksi);
            if(resultcheckmodal)
            {
                $scope.modaldetailtransaksi          = modal;
                $scope.modaldetailtransaksi.show();
            }

            $scope.headerdetail     = angular.copy(transaksiheader); 
            var parameters          = UtilService.GetParameters();
            parameters.TRANS_ID     = transaksiheader.TRANS_ID; 
            TransaksiCombFac.GetTransaksiDetails(parameters)
            .then(function(restransaksidetails)
            {
                $scope.datayangdibeli    = restransaksidetails;
            });
        });
        $scope.shownGroup = transaksiheader;
    }

    $scope.closemodaltransaksidetail = function()
    {
        $scope.modaldetailtransaksi.remove();
    }

    $scope.isGroupShown = function(datatoshow) 
    {
        return $scope.shownGroup === datatoshow;
    };
}])



