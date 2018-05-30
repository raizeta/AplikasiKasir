angular.module('starter')
.controller('WellComeCtrl',['InitStoresFac','$filter','$scope','$ionicHistory','$ionicLoading','$state','$timeout', 
function(InitStoresFac,$filter,$scope,$ionicHistory,$ionicLoading,$state,$timeout) 
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
	    $scope.sudahikutipanduan 	= false;
	    $scope.datasukses 		 	= 'Mutasi';
	    InitStoresFac.InitStores()
	    .then(function(response)
	    {
	    	$scope.sudahikutipanduan = true;
	    	if($scope.sudahikutipanduan)
	    	{
	    		$timeout(function() 
	            {
	                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
	                $state.go('tab.sales', {}, {reload: true});
	            }, 10000);
	    	}
	    },
	    function(error)
	    {
	    	console.log(error)
	    });
	    $scope.$on('loading-stores',function(event,args)
	    {
	    	$scope.datasukses = args;
	    });
	});

       
}])