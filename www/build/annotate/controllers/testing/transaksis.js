angular.module('starter')
.controller('TestingTransaksiHeadersCtrl', ['TransaksiCombFac', 'ConstructorService', 'UtilService', '$cordovaToast', '$cordovaDialogs', '$ionicListDelegate', '$ionicPopup', '$ionicModal', '$ionicLoading', '$ionicHistory', '$scope', '$timeout', '$state', '$filter', 'StorageService', function(TransaksiCombFac,ConstructorService,UtilService,$cordovaToast,$cordovaDialogs,$ionicListDelegate,$ionicPopup,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter,StorageService) 
{
	$scope.$on('$ionicView.beforeEnter', function()
    {
        var parameters  = UtilService.GetParameters()
        TransaksiCombFac.GetTransaksiHeaders(parameters)
        .then(function(resgettransaksiheader)
        {
            $scope.datatransaksiheaders = resgettransaksiheader;
        },
        function(error)
        {
            console.log(error);
        });
    });

    $scope.modalnewtransaksiheaderopen = function()
    {
        $ionicModal.fromTemplateUrl('templates/testing/transaksis/modalnewtransaksi-header.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.newtransasksiheader      = ConstructorService.TransaksiHeaderConstructor($scope.datatransaksiheaders);
            $scope.newtransasksiheadermodal = modal;
            $scope.newtransasksiheadermodal.show();
        });
    }
    $scope.modalnewtransaksiheadersubmit = function()
    {
        $scope.newtransasksiheader.TOTAL_HARGA = $scope.newtransasksiheader.SUB_TOTAL_HARGA + ($scope.newtransasksiheader.SUB_TOTAL_HARGA * $scope.newtransasksiheader.PPN)/100;
        TransaksiCombFac.CreateTransaksiHeaders($scope.newtransasksiheader)
        .then(function(rescreatetransaksiheader)
        {
            $scope.newtransasksiheader.id = rescreatetransaksiheader.insertId
            $scope.datatransaksiheaders.push($scope.newtransasksiheader);
            $cordovaToast.show('Transaksi Header Telah Berhasil Di Create!', 'long', 'bottom');
        },
        function(error)
        {
            console.log(error);
        });
        $scope.newtransasksiheadermodal.remove();
    }

    $scope.modalnewtransaksiheaderclose = function()
    {
        $scope.newtransasksiheadermodal.remove();
    }


    $scope.modalupdatetransaksiheaderopen = function(transaksiheader,indextransaksiheader)
    {
        $ionicModal.fromTemplateUrl('templates/testing/transaksis/modalupdatetransaksi-header.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updatetransasksiheader               = angular.copy(transaksiheader);
            $scope.datatransaksiheadersebelumdiupdate   = angular.copy(transaksiheader);
            $scope.indextransaksiheader                 = angular.copy(indextransaksiheader);
            $scope.updatetransasksiheadermodal = modal;
            $scope.updatetransasksiheadermodal.show();
        });
    }
    $scope.modalupdatetransaksiheadersubmit = function()
    {
        $scope.updatetransasksiheader.IS_ONSERVER = 0;
        $scope.updatetransasksiheader.TOTAL_HARGA = $scope.updatetransasksiheader.SUB_TOTAL_HARGA * ( 1 + ($scope.updatetransasksiheader.PPN/100));
        TransaksiCombFac.UpdateTransaksiHeaders($scope.updatetransasksiheader)
        .then(function(rescreatetransaksiheader)
        {
            $scope.datatransaksiheaders[$scope.indextransaksiheader] = $scope.updatetransasksiheader;
            $cordovaToast.show('Transaksi Header Telah Berhasil Di Create!', 'long', 'bottom');
        },
        function(error)
        {
            console.log(error);
        });
        $scope.updatetransasksiheadermodal.remove();
    }

    $scope.modalupdatetransaksiheaderclose = function()
    {
        $scope.updatetransasksiheadermodal.remove();
    }
       
}]);