angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
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

  $stateProvider.state('tab.sales-bankless', 
  {
      url: '/sales/kasir-bankless',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/kasir-bankless/index.html',
              controller: 'CashierBankLessCtrl'
          }
      }
  });

  $stateProvider.state('tab.sales-ppob', 
  {
      url: '/sales/kasir-ppob',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/kasir-ppob/index.html',
              controller: 'CashierPPOBCtrl'
          }
      }
  });
  $stateProvider.state('tab.sales-ppob-form-pulsa', 
  {
      url: '/sales/kasir-ppob/mobile/:kelompok',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/kasir-ppob/formpulsa.html',
              controller: 'CashierPPOBKelompokCtrl'
          }
      }
  });

  $stateProvider.state('tab.sales-ppob-form-tokenpln', 
  {
      url: '/sales/kasir-ppob/tokenpln',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/kasir-ppob/formtokenpln.html',
              controller: 'CashierPPOBKelompokCtrl'
          }
      }
  });

  $stateProvider.state('tab.sales-ppob-form-vouchergame', 
  {
      url: '/sales/kasir-ppob/vouchergame',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/sales/kasir-ppob/formvouchergame.html',
              controller: 'CashierPPOBKelompokCtrl'
          }
      }
  });

  

});
