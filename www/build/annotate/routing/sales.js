angular.module('starter')
.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{  
  $stateProvider.state('tab.sales', 
  {
      url: '/sales',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/index.html',
              controller: 'CashierCtrl'
          }
      }
  });

  $stateProvider.state('tab.sales-ppob', 
  {
      url: '/sales/pembelian',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/pembelian/index.html',
              controller: 'CashierCtrl'
          }
      }
  });

  $stateProvider.state('tab.promise', 
  {
      url: '/promise',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/promise.html',
              controller: 'PromiseCtrl'
          }
      }
  });

}]);
