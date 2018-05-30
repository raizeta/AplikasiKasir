angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab', 
  {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'AppCtrl',
  });

  $stateProvider.state('tab.maintenance', 
  {
      url: '/maintenance',
      views: 
      {
        'view-content': 
        {
          templateUrl: 'templates/maintenance/index.html',
          controller: 'MaintenanceCtrl'
        }
      }
  });
  $stateProvider.state('tab.logoffline', 
  {
      url: '/logoffline',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/log/offline.html',
              controller: 'LogOfflineCtrl'
          }
      }
  });
});
