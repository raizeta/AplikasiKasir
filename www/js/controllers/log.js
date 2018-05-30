angular.module('starter')
.controller('LogOfflineCtrl',['OfflineLiteFac','$filter','$scope','$ionicLoading', 
function(OfflineLiteFac,$filter,$scope,$ionicLoading) 
{
    $ionicLoading.show
    ({
        noBackdrop:false,
        hideOnStateChange:true,
        template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
    })
    .then(function()
    {
	    OfflineLiteFac.SumOfflinePerTableName()
	    .then(function(response)
	    {
	        $scope.dataofflines = response;
	    },
	    function(error)
	    {
	        console.log(error);
	    })
	    .finally(function()
	    {
	    	$ionicLoading.hide();
	    });
    });

    $scope.$on('syncofflinetoserver', function(event, opt) 
    {
 		var index = _.findIndex($scope.dataofflines,{'ID_LOCAL':opt.ID_LOCAL});
 		$scope.dataofflines[index].STATUS_SYNC = 1;
	});   
}])
