angular.module('starter')
.factory('ConnectivityMonitor',['ToastService','UtilService','SyncPollingFac','PollingService','PollingFac','$rootScope','$timeout','$cordovaNetwork','$cordovaToast',
function(ToastService,UtilService,SyncPollingFac,PollingService,PollingFac,$rootScope,$timeout,$cordovaNetwork,$cordovaToast)
{
  	var pollingservertolocal;
    $rootScope.startsyncservertolocal = function()
    {
        pollingservertolocal = $timeout(function()
        {
            $timeout.cancel(pollingservertolocal);
            var parameters        = UtilService.GetParameters();
            PollingFac.GetPolling(parameters)
            .then(function(response)
            {
                if(response.length > 0)
                {
                    PollingService.SyncServerToLocal(response);
                }                    
                $rootScope.startsyncservertolocal();
            });
        }, 8000);
    }

    var pollingofflinelocal;
    $rootScope.startsyncofflinelocal = function()
    {
        pollingofflinelocal = $timeout(function()
        {
            $timeout.cancel(pollingofflinelocal);
            SyncPollingFac.SyncOfflineToServer()
            .then(function(response)
            {
                $rootScope.startsyncofflinelocal();
            },
            function(error)
            {
				$rootScope.startsyncofflinelocal();
            });   
        }, 6000);
    }

  return {
    isOnline: function()
    {
		if(navigator.onLine)
		{
		    $rootScope.startsyncservertolocal();
            $rootScope.startsyncofflinelocal();
		}
    },
    startWatching: function()
    {
        if(ionic.Platform.isWebView())
        {
			$rootScope.$on('$cordovaNetwork:online', function(event, networkState)
			{
				$rootScope.startsyncservertolocal();
            	$rootScope.startsyncofflinelocal();
			});

			$rootScope.$on('$cordovaNetwork:offline', function(event, networkState)
			{
				$timeout.cancel(pollingservertolocal);
            	$timeout.cancel(pollingofflinelocal);
			});
        }
        else
        {
			window.addEventListener("online", function(e)
			{
				$rootScope.startsyncservertolocal();
            	$rootScope.startsyncofflinelocal();
			}, false);   

			window.addEventListener("offline", function(e) 
			{
				$timeout.cancel(pollingservertolocal);
            	$timeout.cancel(pollingofflinelocal);
			}, false); 
        }      
    }
  }
}])