angular.module('starter')
.controller('PromiseCtrl', ['TransaksisLiteFac', '$cordovaToast', '$cordovaDialogs', '$ionicModal', '$ionicLoading', '$ionicHistory', '$scope', '$timeout', '$state', '$filter', function(TransaksisLiteFac,$cordovaToast,$cordovaDialogs,$ionicModal,$ionicLoading,$ionicHistory,$scope,$timeout,$state,$filter) 
{
	TransaksisLiteFac.GetTransaksiHeaderOffline()
    .then(function(responsetransaksi)
    {
        if(responsetransaksi.length > 0)
        {  
        }
    },
    function(error)
    {
        
    });	
}]);