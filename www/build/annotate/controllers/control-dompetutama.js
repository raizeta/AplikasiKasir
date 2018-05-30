angular.module('starter')
.controller('ControlDompetUtamaCtrl',['PerangkatsFac','StoresCombFac','$ionicPopup','$cordovaDialogs','StorageService','UtilService','$ionicModal','$ionicLoading','$scope','$filter','$timeout', 
function(PerangkatsFac,StoresCombFac,$ionicPopup,$cordovaDialogs,StorageService,UtilService,$ionicModal,$ionicLoading,$scope,$filter,$timeout) 
{
    $scope.viewtoshow = {'valuechoose':'PEMBAYARAN'};
    
    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        $scope.$apply();
    }, false);
    
    $scope.chooseviewtodisplay = {'viewtodisplay':'TOPUP'};

    $scope.chooseviewtodisplayfunction = function(viewtodisplay)
    {
        $scope.chooseviewtodisplay = {'viewtodisplay':viewtodisplay};
    };

    $scope.tariksaldo                       = {};
    $scope.tariksaldo.NOMOR_REK             = '600-144-7890';
    $scope.tariksaldo.NAMAPEMILIK_REK       = 'Radumta Sitepu';
    $scope.tariksaldo.NAMABANK_REK          = 'BANK BCA';
    $scope.tariksaldo.CABBANK_REK           = 'Alam Sutera,Tangerang,Banten';   
    $scope.tariksaldo.NOMINAL_TARIK         = null;

    $scope.topupsaldo = {};
    $scope.topupsaldo.METHODE_BAYAR = 0;
}])