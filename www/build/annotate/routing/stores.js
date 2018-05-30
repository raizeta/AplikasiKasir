angular.module('starter')
.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
  $stateProvider.state('init', 
  {
      url: '/init',
      templateUrl: 'templates/stores/mainstores.html',
      abstract:true,
      resolve:
      {
          auth: ['$q', 'StorageService', '$injector', '$location', function ($q, StorageService,$injector,$location) 
          {
              var userInfo = StorageService.get('advanced-profile');
              if(userInfo)
              {
                  return userInfo;
              }
              else 
              {
                  $location.path("/auth/login");
                  console.log();
              }
          }]  
      }
  });
  $stateProvider.state('init.stores', 
  {
      url: '/stores',
      views: 
      {
          'stores-tab': 
          {
            templateUrl: 'templates/stores/index.html',
            controller: 'StoresCtrl',
          }
      }
  });


}]);
