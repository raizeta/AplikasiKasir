angular.module('starter')
.controller('ControlPembayaranIuranCtrl',['PerangkatsFac','StoresCombFac','$ionicPopup','$cordovaDialogs','StorageService','UtilService','$ionicModal','$ionicLoading','$scope','$filter','$timeout', 
function(PerangkatsFac,StoresCombFac,$ionicPopup,$cordovaDialogs,StorageService,UtilService,$ionicModal,$ionicLoading,$scope,$filter,$timeout) 
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


	$scope.detailstore 	= function(datastore)
	{
		$scope.datadetail 	= datastore;
        
		if (!$scope.isGroupShown(datastore)) 
	    {
	        $scope.shownGroup = datastore;
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
                duration:300
            });
	    }

        var parameters          = UtilService.GetParameters();
        parameters.STORE_ID     = datastore.STORE_ID;

        PerangkatsFac.GetPerangkats(parameters)
        .then(function(responseperangkat)
        {
            $scope.dataperangkat    = responseperangkat;
        },
        function(error)
        {
            console.log(error);
        });

        PerangkatsFac.GetPakets(parameters)
        .then(function(responseperangkat)
        {
            console.log(responseperangkat);
            $scope.datapaketperangkat = responseperangkat;
        },
        function(error)
        {
            console.log(error);
        });

        PerangkatsFac.GetPaymentMethods(parameters)
        .then(function(responseperangkat)
        {
            console.log(responseperangkat)
        },
        function(error)
        {
            console.log(error);
        });
	}

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

    $scope.modalbayariuranopen   = function(perangkat,indexperangkat)
    {
        $ionicModal.fromTemplateUrl('templates/control/perangkat/modalbayariuranperangkat.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updateperangkat                      = angular.copy(perangkat);
            $scope.dataperangkatsblmdiupdate            = angular.copy(perangkat)
            $scope.indexperangkat                       = angular.copy(indexperangkat);

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.updateperangkatmodal);
            if(resultcheckmodal)
            {
                $scope.updateperangkatmodal  = modal;
                $scope.updateperangkatmodal.show();
            }
        });
    }
    
    $scope.modalbayariuransubmit = function() 
    {        
        console.log($scope.iuranpembayaran);
        if(!_.isEqual($scope.dataperangkatsblmdiupdate,$scope.updateperangkat))
        {
            
        }   
    };

    $scope.modalbayariuranclose = function() 
    {
        if(!_.isEqual($scope.dataperangkatsblmdiupdate,$scope.updateperangkat))
        {
            $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
            .then(function(buttonIndex) 
            {
                var btnIndex = buttonIndex;
                if(buttonIndex == 1)
                {
                    $scope.updateperangkatmodal.remove();
                }
            });
        }
        else
        {
            $scope.updateperangkatmodal.remove();  
        }
    };

    $scope.pilihpaketperangkat = function(productunitsselected)
    {
        if($scope.iuranpembayaran)
        {
            $scope.choicepaketperangkat = {'PAKET_ID':$scope.iuranpembayaran.PAKET_ID}; 
        }
        else
        {
            $scope.choicepaketperangkat = {'PAKET_ID':undefined};
        }
        
        $ionicPopup.confirm({
          templateUrl: 'templates/control/perangkat/popuppaketperangkat.html',
          title: 'PILIH PAKET PERANGKAT?',
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
                var index = _.findIndex($scope.datapaketperangkat,{'PAKET_ID':$scope.choicepaketperangkat.PAKET_ID});
                $scope.iuranpembayaran = $scope.datapaketperangkat[index]; 
                $scope.iuranpembayaran.TYPE_LANGGANAN   = 1;
                $scope.iuranpembayaran.PAYMENT_METHODE  = 3;  
                $scope.iuranpembayaran.BANK_TRANSFER    = 1;
            }
          }]
        });
    }

	

	$scope.isGroupShown = function(datatoshow) 
	{
		return $scope.shownGroup === datatoshow;
	};	
}])