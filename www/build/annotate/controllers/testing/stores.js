angular.module('starter')
.controller('TestingStoresCtrl', ['StoresCombFac', 'StoresFac', 'StoresLiteFac', 'ProvinsisCombFac', 'ConstructorService', 'UtilService', '$cordovaToast', '$cordovaDialogs', '$ionicListDelegate', '$ionicPopup', '$ionicModal', '$ionicLoading', '$ionicHistory', '$scope', '$timeout', '$state', '$filter', 'StorageService', function(StoresCombFac,StoresFac,StoresLiteFac,ProvinsisCombFac,ConstructorService,UtilService,$cordovaToast,$cordovaDialogs,$ionicListDelegate,$ionicPopup,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter,StorageService) 
{
	$scope.$on('$ionicView.beforeEnter', function()
    {
        var parameters  = UtilService.GetParameters()
        StoresCombFac.GetStores(parameters)
        .then(function(resgetstores)
        {
            $scope.datastores = resgetstores;
        },
        function(error)
        {
            console.log(error);
        });
        ProvinsisCombFac.GetProvinsisComb()
        .then(function(resprovinsis)
        {
            $scope.provinsis = resprovinsis;
        });
    });
    
	$scope.openprovinsipopup = function (mode) 
    {
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
            var parameters          = UtilService.GetParameters();
            StoresLiteFac.GetMaxStoreID(parameters.ACCESS_GROUP)
            .then(function(newstoreid)
            {
                $scope.newstore             = ConstructorService.StoreConstructor();
                $scope.newstore.STORE_ID    = newstoreid;
                $scope.newstore.STATUS      = 1;
            },
            function(error)
            {
                console.log(error);
            })
            
            $scope.newstoremodal    = modal;
            $scope.newstoremodal.show();
        });
	}

	$scope.modalnewstoresubmit = function() 
    {
        StoresLiteFac.CreateStores($scope.newstore)
        .then(function(rescreatestores)
        {
            $scope.newstore.ID_LOCAL 	= rescreatestores.ID_LOCAL;
            $scope.datastores.push($scope.newstore);
            $cordovaToast.show('Product Telah Berhasil Disimpan!', 'long', 'bottom');
        },
        function(error)
        {
            console.log(error);
        });
        $scope.newstoremodal.remove();
    };

	$scope.modalnewstoreclose = function() 
    {
        $scope.newstoremodal.remove();
    };

    $scope.modalupdatestoreopen = function(datadetailstore,indexstore)
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
            $scope.indexstore	 		= indexstore;
            $scope.sebelumupdatestore	= angular.copy(datadetailstore)
            $scope.updatestore         	= angular.copy(datadetailstore);
            $scope.updatestoremodal    	= modal;
            $scope.updatestoremodal.show();
        });
    }

    $scope.modalupdatestoresubmit   = function()
    {
        if(!_.isEqual($scope.sebelumupdatestore,$scope.updatestore))
        {
            StoresLiteFac.UpdateStores($scope.updatestore)
            .then(function(resupdatestores)
            {
                $ionicListDelegate.closeOptionButtons();
                $scope.datastores[$scope.indexstore] = $scope.updatestore;
                $cordovaToast.show('Product Telah Berhasil Diupdate!', 'long', 'bottom');
            },
            function(error)
            {
                console.log(error);
            });  
        }
        $scope.updatestoremodal.remove();
    } 
      
    $scope.modalupdatestoreclose = function()
    {
        $scope.updatestoremodal.remove();
    }

	$scope.modaldeletestoreopen = function(itemstore,index)
	{
		$cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus '+ itemstore.STORE_NM +' ?', itemstore.STORE_NM, ['Delete','Cancel'])
    	.then(function(buttonIndex) 
    	{
      		var btnIndex = buttonIndex;
      		if(buttonIndex == 1)
      		{
                StoresLiteFac.DeleteStores(itemstore)
                .then(function(resdeletestores)
                {
                    $scope.datastores.splice(index,1);
                    $cordovaToast.show('Store Telah Berhasil Di Delete!', 'long', 'bottom');
                },
                function(error)
                {
                    console.log(error);
                });  	
      		}
      		
    	});
	}   
}]);