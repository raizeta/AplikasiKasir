angular.module('starter')
.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
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
}]);
