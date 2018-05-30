angular.module('starter')
.controller('TestingCustomersCtrl', ['CustomersCombFac', 'CustomersLiteFac', 'StorageService', 'UtilService', 'ConstructorService', '$ionicListDelegate', '$cordovaToast', '$cordovaDialogs', '$ionicModal', '$ionicLoading', '$ionicHistory', '$scope', '$timeout', '$state', '$filter', function(CustomersCombFac,CustomersLiteFac,StorageService,UtilService,ConstructorService,$ionicListDelegate,$cordovaToast,$cordovaDialogs,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter) 
{
	var parameters 			= UtilService.GetParameters();
	CustomersCombFac.GetCustomers(parameters)
	.then(function(resgetcustomers)
	{
		$scope.datacustomers = resgetcustomers;
	},
	function(error)
	{
		console.log(error);
	});

	$scope.modalnewcustomeropen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/customers/modalnewcustomer.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            CustomersLiteFac.GetMaxCustomerID(parameters.STORE_ID)
            .then(function(responsenewcustomerid)
            {
                $scope.newcustomer              = {};
                $scope.newcustomer.CUSTOMER_ID  = responsenewcustomerid;
                $scope.newcustomer.ACCESS_GROUP = parameters.ACCESS_GROUP;
                $scope.newcustomer.STORE_ID     = parameters.STORE_ID;
                $scope.newcustomer.STATUS       = 1;
                $scope.newcustomer.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
            },
            function(error)
            {
                console.log(error);
            })
            
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.newcustomermodal);
            if(resultcheckmodal)
            {
                $scope.newcustomermodal   = modal;
                $scope.newcustomermodal.show();
            }
        });
    }
    
    $scope.modalnewcustomersubmit = function() 
    {
        CustomersLiteFac.CreateCustomers($scope.newcustomer)
        .then(function(rescreatecustomer)
        {
            $scope.newcustomer.ID_LOCAL = rescreatecustomer.ID_LOCAL;
            $scope.datacustomers.unshift($scope.newcustomer);
            $cordovaToast.show('Customer Baru Telah Berhasil Di Create!', 'long', 'bottom');
        },
        function(error)
        {
            console.log(error);
        });
        $scope.newcustomermodal.remove();
    };

    $scope.modalnewcustomerclose = function() 
    {
        $scope.newcustomermodal.remove();
    };

    $scope.modalupdatecustomeropen   = function(customer,indexcustomer)
    {
        $ionicModal.fromTemplateUrl('templates/control/customers/modalupdatecustomer.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updatecustomer                      = angular.copy(customer);
            $scope.datacustomersblmdiupdate            = angular.copy(customer)
            $scope.indexcustomer                       = angular.copy(indexcustomer);

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.updatecustomermodal);
            if(resultcheckmodal)
            {
                $scope.updatecustomermodal                 = modal;
                $scope.updatecustomermodal.show();
            }
        });
    }
    
    $scope.modalupdatecustomersubmit = function() 
    {        
        if(!_.isEqual($scope.datacustomersblmdiupdate,$scope.updatecustomer))
        {
            CustomersLiteFac.UpdateCustomers($scope.updatecustomer)
            .then(function(rescreatecustomer)
            {
                $scope.datacustomers[$scope.indexcustomer] = $scope.updatecustomer;
                $cordovaToast.show('Data Customer Telah Berhasil Di Update!', 'long', 'bottom');
            },
            function(error)
            {
                console.log(error);
            });
        }
        else
        {
            console.log("Masih Sama");
        }
        $scope.updatecustomermodal.remove();
    };

    $scope.modalupdatecustomerclose = function() 
    {
        $scope.updatecustomermodal.remove();
    };

    $scope.modaldeletecustomeropen = function(customer,indexcustomer)
	{
		$cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus '+ customer.NAME +' ?',customer.NAME, ['Delete','Cancel'])
    	.then(function(buttonIndex) 
    	{
      		var btnIndex = buttonIndex;
      		if(buttonIndex == 1)
      		{
                CustomersLiteFac.DeleteCustomers(customer)
                .then(function(resdeletecustomer)
                {
                    $ionicListDelegate.closeOptionButtons();
                    $scope.datacustomers.splice(indexcustomer,1);
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