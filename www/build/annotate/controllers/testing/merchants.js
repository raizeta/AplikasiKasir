angular.module('starter')
.controller('TestingMerchantsCtrl', ['MerchantsCombFac', 'MerchantsFac', 'MerchantsLiteFac', 'StorageService', 'UtilService', 'ConstructorService', '$cordovaToast', '$cordovaDialogs', '$ionicPopup', '$ionicModal', '$ionicLoading', '$ionicHistory', '$scope', '$timeout', '$state', '$filter', function(MerchantsCombFac,MerchantsFac,MerchantsLiteFac,StorageService,UtilService,ConstructorService,$cordovaToast,$cordovaDialogs,$ionicPopup,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter) 
{
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
        MerchantsFac.GetMerchantTypes()
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

    var parameters 			= UtilService.GetParameters();
    
    MerchantsCombFac.GetMerchants(parameters)
    .then(function(resgetmerchants)
    {
    	$scope.datamerchants = resgetmerchants;
    },
    function(error)
    {
    	console.log(error);
    });



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
            MerchantsLiteFac.GetMaxMerchantID(parameters.STORE_ID)
            .then(function(newmerchantid)
            {
                $scope.newmerchant                  = {};
                $scope.newmerchant.MERCHANT_ID      = newmerchantid;
                $scope.newmerchant.ACCESS_GROUP     = parameters.ACCESS_GROUP;
                $scope.newmerchant.STORE_ID         = parameters.STORE_ID;
                $scope.newmerchant.STATUS           = 1;
                $scope.newmerchant.TGL_SAVE         = $filter('date')(new Date(),'yyyy-MM-dd');
            },
            function(error)
            {
                console.log(error);
            })

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalnewmerchant);
            if(resultcheckmodal)
            {
                $scope.modalnewmerchant   = modal;
                $scope.modalnewmerchant.show();
            }
        });
    }

    $scope.modalnewmerchantsubmit = function() 
    {
        MerchantsLiteFac.CreateMerchants($scope.newmerchant)
        .then(function(ressavenewmerchant)
        {
            $scope.newmerchant.ID_LOCAL = ressavenewmerchant.ID_LOCAL;
            $scope.datamerchants.unshift($scope.newmerchant);
            $cordovaToast.show('Merchant Baru Telah Berhasil Di Create!', 'long', 'bottom');
        },
        function(error)
        {
            console.log(error);
        });
        $scope.modalnewmerchant.remove();
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
            MerchantsLiteFac.UpdateMerchants($scope.updatemerchant)
            .then(function(resupdatemerchant)
            {
                $scope.datamerchants[$scope.indexmerchant] = $scope.updatemerchant;
                $cordovaToast.show('Data Merchant Telah Berhasil Di Update!', 'long', 'bottom');
            },
            function(error)
            {
                console.log(error);
            });
        }
        $scope.modalupdatemerchant.remove();
    };

    $scope.modalupdatemerchantclose = function() 
    {
        $scope.modalupdatemerchant.remove();
    };

    $scope.modaldeletemerchantopen = function(merchant,indexmerchant)
	{
		$cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus '+ merchant.MERCHANT_NM +' ?',merchant.MERCHANT_NM, ['Delete','Cancel'])
    	.then(function(buttonIndex) 
    	{
      		var btnIndex = buttonIndex;
      		if(buttonIndex == 1)
      		{
                MerchantsLiteFac.DeleteMerchants(merchant)
                .then(function(resdeletemerchant)
                {
                    $scope.datamerchants.splice(indexmerchant,1);
                    $cordovaToast.show('Merchant Telah Berhasil Di Delete!', 'long', 'bottom');
                },
                function(error)
                {
                    console.log(error);
                });  	
      		}
      		
    	});
	}
/** AKHIR DARI MERCHANTS CRUD FUNCTION **/
}]);