angular.module('starter')
.controller('CashierBankLessCtrl',['$scope','PPOBLiteFac','UtilService','$state',
function($scope,PPOBLiteFac,UtilService,$state)
{
    $scope.mode        = {valuechoose:'SETOR'};
    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
    }, false);

    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        PPOBLiteFac.GetGroups()
        .then(function(response)
        {
            $scope.groupsmenu = response;
        }) 
    });
    $scope.gotomenukelompok = function(kelompok)
    {
        $state.go('tab.sales-ppob-kelompok', {kelompok:kelompok.KELOMPOK});
    }

}])

