angular.module('starter')
.controller('TestingMerchantBanksCtrl', ['MerchantsCombFac', 'StorageService', 'UtilService', 'ConstructorService', '$cordovaToast', '$cordovaDialogs', '$ionicPopup', '$ionicModal', '$ionicLoading', '$ionicHistory', '$scope', '$timeout', '$state', '$filter', function(MerchantsCombFac,StorageService,UtilService,ConstructorService,$cordovaToast,$cordovaDialogs,$ionicPopup,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter) 
{
/** AWAL DARI MERCHANTS CRUD FUNCTION **/
    var parameters          = UtilService.GetParameters();
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        MerchantsCombFac.GetMerchantBanks()
        .then(function(responsemerchantbanks)
        {
            $scope.datamerchantsbanks = responsemerchantbanks;
        },
        function(error)
        {
            console.log(error);
        });
    });

    $scope.modalnewmerchantbankopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/merchants/modalnewmerchant-bank.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.newmerchantbank          = ConstructorService.MerchantBankConstructor($scope.datamerchantsbanks);
            $scope.modalnewmerchantbank     = modal;
            $scope.modalnewmerchantbank.show();
        });
    }

    $scope.modalnewmerchantbanksubmit = function() 
    {
        MerchantsCombFac.CreateMerchantBanks($scope.newmerchantbank)
        .then(function(ressavemerchantbank)
        {
            $scope.newmerchantbank.id = ressavemerchantbank.insertId
            $scope.datamerchantsbanks.unshift($scope.newmerchantbank);
            $cordovaToast.show('Merchant Bank Telah Berhasil Di Create!', 'long', 'bottom');
        },
        function(error)
        {
            console.log(error);
        })
        $scope.modalnewmerchantbank.remove();
    };

    $scope.modalnewmerchantbankclose = function() 
    {
        $scope.modalnewmerchantbank.remove();
    };

    $scope.modalupdatemerchantbankopen   = function(merchantbank,indexmerchantbank)
    {
        $ionicModal.fromTemplateUrl('templates/control/merchants/modalupdatemerchant-bank.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updatemerchantbank               = angular.copy(merchantbank);
            $scope.datamerchantbanksebelumdiupdate  = angular.copy(merchantbank);
            $scope.indexmerchantbank                = angular.copy(indexmerchantbank);
            $scope.modalupdatemerchantbank          = modal;
            $scope.modalupdatemerchantbank.show();
        });
    }
    
    $scope.modalupdatemerchantbanksubmit = function() 
    {
        if(!_.isEqual($scope.datamerchantbanksebelumdiupdate,$scope.updatemerchantbank))
        {
            $scope.updatemerchantbank.IS_ONSERVER = 0
            MerchantsCombFac.UpdateMerchantBanks($scope.updatemerchantbank)
            .then(function(resupdatemerchantbank)
            {
                $scope.datamerchantsbanks[$scope.indexmerchantbank] = $scope.updatemerchantbank;
                $cordovaToast.show('Data Merchant Bank Telah Berhasil Di Update!', 'long', 'bottom');
            });
        }
        $scope.modalupdatemerchantbank.remove();
    };

    $scope.modalupdatemerchantbankclose = function() 
    {
        $scope.modalupdatemerchantbank.remove();
    };

    $scope.modaldeletemerchantbankopen = function(merchantbank,indexmerchantbank)
	{
		$cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus '+ merchantbank.BANK_NM +' ?',merchantbank.BANK_NM, ['Delete','Cancel'])
    	.then(function(buttonIndex) 
    	{
      		var btnIndex = buttonIndex;
      		if(buttonIndex == 1)
      		{
                merchantbank.STATUS         = 3;
                merchantbank.IS_ONSERVER    = 0;
                MerchantsCombFac.DeleteMerchantBanks(merchantbank)
                .then(function(resupdatemerchantbank)
                {
                    $scope.datamerchantsbanks.splice(indexmerchantbank,1);
                    $cordovaToast.show('Data Merchant Bank Telah Berhasil Di Hapus!', 'long', 'bottom');
                });	
      		}
      		
    	});
	}
/** AKHIR DARI MERCHANTS CRUD FUNCTION **/
}]);