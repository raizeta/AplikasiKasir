angular.module('starter')
.controller('MaintenanceCtrl',['MaintenanceService','$scope',
function(MaintenanceService,$scope)
{
    $scope.menumaintenances = MaintenanceService.GetMenuMaintenance();
    $scope.openfunction = function(aliasfunction)
    {
    	MaintenanceService.TestMaintenance(aliasfunction);
    }
       
}])