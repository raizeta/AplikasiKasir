angular.module('starter')
.controller('TestingMerchantTypesCtrl', ['MerchantsLiteFac', 'MerchantsCombFac', 'StorageService', 'UtilService', 'ConstructorService', '$ionicListDelegate', '$cordovaToast', '$cordovaDialogs', '$ionicPopup', '$ionicModal', '$ionicLoading', '$ionicHistory', '$scope', '$timeout', '$state', '$filter', function(MerchantsLiteFac,MerchantsCombFac,StorageService,UtilService,ConstructorService,$ionicListDelegate,$cordovaToast,$cordovaDialogs,$ionicPopup,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter) 
{
/** AWAL DARI MERCHANTS CRUD FUNCTION **/
    var parameters          = UtilService.GetParameters();
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        MerchantsCombFac.GetMerchantTypes()
        .then(function(responsemerchanttypes)
        {
            $scope.datamerchantstypes = responsemerchanttypes;
        },
        function(error)
        {
            console.log(error);
        });
    });

    $scope.modalnewmerchanttypeopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/merchants/modalnewmerchant-type.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            MerchantsLiteFac.GetMaxMerchantTypeID()
            .then(function(newmerchanttypeid)
            {
                $scope.newmerchanttype              = {};
                $scope.newmerchanttype.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.newmerchanttype.TYPE_PAY_ID  = newmerchanttypeid;
                $scope.newmerchanttype.STATUS       = 1;
            },
            function(error)
            {
                console.log(error);
            });
            
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalnewmerchanttype);
            if(resultcheckmodal)
            {
                $scope.modalnewmerchanttype     = modal;
                $scope.modalnewmerchanttype.show();
            }  
        });
    }

    $scope.modalnewmerchanttypesubmit = function() 
    {
        MerchantsLiteFac.CreateMerchantTypes($scope.newmerchanttype)
        .then(function(ressavemerchanttype)
        {
            $scope.newmerchanttype.ID_LCOAL = ressavemerchanttype.ID_LCOAL;
            $scope.datamerchantstypes.unshift($scope.newmerchanttype);
            $cordovaToast.show('Type Merchant Telah Berhasil Di Create!', 'long', 'bottom');
        },
        function(error)
        {
            console.log(error);
        })
        $scope.modalnewmerchanttype.remove();
    };

    $scope.modalnewmerchanttypeclose = function() 
    {
        $scope.modalnewmerchanttype.remove();
    };

    $scope.modalupdatemerchanttypeopen   = function(merchanttype,indexmerchanttype)
    {
        $ionicModal.fromTemplateUrl('templates/control/merchants/modalupdatemerchant-type.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updatemerchanttype               = angular.copy(merchanttype);
            $scope.datamerchanttypesebelumdiupdate  = angular.copy(merchanttype);
            $scope.indexmerchanttype                = angular.copy(indexmerchanttype);

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalupdatemerchanttype);
            if(resultcheckmodal)
            {
                $scope.modalupdatemerchanttype          = modal;
                $scope.modalupdatemerchanttype.show();
            }
        });
    }
    
    $scope.modalupdatemerchanttypesubmit = function() 
    {
        if(!_.isEqual($scope.datamerchanttypesebelumdiupdate, $scope.updatemerchanttype))
        {
            MerchantsLiteFac.UpdateMerchantTypes($scope.updatemerchanttype)
            .then(function(resupdatemerchanttype)
            {             
                $scope.datamerchantstypes[$scope.indexmerchanttype] = $scope.updatemerchanttype;
                $cordovaToast.show('Data Type Merchant Telah Berhasil Di Update!', 'long', 'bottom');
            },
            function(error)
            {
                console.log(error);
            })
        }
        $scope.modalupdatemerchanttype.remove();
    };

    $scope.modalupdatemerchanttypeclose = function() 
    {
        $scope.modalupdatemerchanttype.remove();
    };

    $scope.modaldeletemerchanttypeopen = function(merchanttype,indexmerchanttype)
	{
		$cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus '+ merchanttype.TYPE_PAY_NM +' ?',merchanttype.TYPE_PAY_NM, ['Delete','Cancel'])
    	.then(function(buttonIndex) 
    	{
      		var btnIndex = buttonIndex;
      		if(buttonIndex == 1)
      		{
                MerchantsLiteFac.DeleteMerchantTypes(merchanttype)
                .then(function(resdeletestores)
                {
                    $scope.datamerchantstypes.splice(indexmerchanttype,1);
                    $cordovaToast.show('Merchant Type Telah Berhasil Di Delete!', 'long', 'bottom');
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