angular.module('starter')
.controller('AccountingSummaryCtrl',['StorageService','SummaryLiteFac','StoresFac','StoresCombFac','OpenCloseBookLiteFac','ChartService','UtilService','$ionicPopup','$filter','$window','$scope','$state','$location','$timeout','$ionicLoading','$ionicHistory',  
function(StorageService,SummaryLiteFac,StoresFac,StoresCombFac,OpenCloseBookLiteFac,ChartService,UtilService,$ionicPopup,$filter,$window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory) 
{
    $scope.$on('$ionicView.beforeEnter', function()
    {
        $scope.mode = {valuechoose:'chart'};
        
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
                $timeout(function()
                {
                    $scope.loaddatasummaryfunction(resultstore);   
                });
            }
          }]
        });
    }
    
    $scope.showdatacharting = true;
    $scope.options          = {chart: ChartService.GetPieChartOptions()};
    $scope.transitem        = ChartService.GetDummyData()[0].jumlahtransaksiyangdibayarkanmelalui;
    $scope.transrupiah      = ChartService.GetDummyData()[1].totalrupiahtransaksiyangdibayarkanmelalui;

    $scope.optionsbars      = ChartService.GetBarVerticalOptions();
    $scope.top5qty          = [{'values':ChartService.GetDummyData()[2].top5quantityprodukyangterjual}];
    $scope.top5rupiah       = [{'values':ChartService.GetDummyData()[3].top5quantitykalihargaproduct}];

    $scope.productterjual    = ChartService.GetDummyData()[4].daylyproductyangterjual;


    $scope.loaddatasummaryfunction = function(store)
    {
        
        
        var parameters = UtilService.GetParameters();
        if(store)
        {
            if(store.STORE_NM == 'SEMUA TOKO')
            {
                parameters.STORE_ID = '';
            }
            else
            {
                parameters.STORE_ID = store.STORE_ID;   
            }
            
        }
    
        
        parameters.TRANS_DATE = parameters.TGL_SAVE;
        StoresFac.GetProductTerjual(parameters)
        .then(function(response)
        {
            console.log(response);
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

        StoresFac.GetSummaryBaru(parameters)
        .then(function(response)
        {
            console.log(response);
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
    $scope.loaddatasummaryfunction();
}])

.controller('AccountingSetoranCtrl',['OpenCloseBookCombFac','StoresCombFac','ConstructorService','UtilService','$ionicPopup','$cordovaToast','$cordovaDialogs','$filter','$ionicLoading','$ionicHistory','$ionicModal','$timeout','$scope','$state','$cordovaCamera',
function(OpenCloseBookCombFac,StoresCombFac,ConstructorService,UtilService,$ionicPopup,$cordovaToast,$cordovaDialogs,$filter,$ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state,$cordovaCamera)
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
                $scope.loadsetoranbystore(resultstore);
            }
          }]
        });
    }

    $scope.loadsetoranbystore = function(store)
    {
        var parameters = UtilService.GetParameters();
        if(store)
        {
            if(store.STORE_NM == 'SEMUA TOKO')
            {
                parameters.STORE_ID = '';
            }
            else
            {
                parameters.STORE_ID = store.STORE_ID;   
            }
            
        }
        
        OpenCloseBookCombFac.GetSetoranBook(parameters)
        .then(function(responsegetsetorans)
        {
            $scope.datasetorans = responsegetsetorans;
            if (responsegetsetorans.length > 0)
            {
                $scope.showdetail($scope.datasetorans[0])  
            }
        });
    }
    $scope.loadsetoranbystore();


    //Function Work When Screen Large
    $scope.showdetail   = function(setoran)
    {
        // $scope.setoran = null;
        if (!$scope.isGroupShown(setoran)) 
        {
            $scope.shownGroup = setoran;
            $ionicLoading.show
            ({
                template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
                noBackdrop:true
            })
            .then(function()
            {
                $scope.setoran = setoran;  
            })
            .finally(function()
            {
                $ionicLoading.show({template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',duration: 100});
            });
        }
    }

    //Function Work When Screen Small
    $scope.showmodadetailsetoran   = function(setoran)
    {
        $scope.shownGroup = setoran;
        $ionicModal.fromTemplateUrl('templates/accounting/modaldetailsetoran.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
        }).then(function(modal) 
        {
            $scope.setoran              = angular.copy(setoran);
            $scope.modaldetailsetoran   = modal;
            $scope.modaldetailsetoran.show();
        });  
    }

    $scope.closemodaldetailsetoran = function()
    {
        $scope.modaldetailsetoran.remove();
    }
    $scope.isGroupShown = function(datatoshow) 
    {
        return $scope.shownGroup === datatoshow;
    };

    $scope.showmodalimage = function() 
    {
        $ionicModal.fromTemplateUrl('templates/openclosebook/modalimage.html', 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            $scope.modalimage = modal;
            $scope.modalimage.show();
        });
    }

    $scope.closemodalimage = function() 
    {
        $scope.modalimage.remove()
    };
}])


