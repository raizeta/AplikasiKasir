angular.module('starter')
.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider,$urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab.testingstores', 
  {
      url: '/testing/stores',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/stores.html',
              controller: 'TestingStoresCtrl'
          }
      }
  });

  $stateProvider.state('tab.testingcustomers', 
  {
      url: '/testing/customers',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/customers.html',
              controller: 'TestingCustomersCtrl'
          }
      }
  });

  $stateProvider.state('tab.testingproducts', 
  {
      url: '/testing/products',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/products.html',
              controller: 'TestingProductsCtrl'
          }
      }
  });

  $stateProvider.state('tab.testingproductgroups', 
  {
      url: '/testing/productgroups',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/productgroups.html',
              controller: 'TestingProductGroupsCtrl'
          }
      }
  });

  $stateProvider.state('tab.testingproductunits', 
  {
      url: '/testing/productunits',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/productunits.html',
              controller: 'TestingProductUnitsCtrl'
          }
      }
  });

  $stateProvider.state('tab.testingproductgroupindustris', 
  {
      url: '/testing/productgroupindustris',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/productgroupindustris.html',
              controller: 'TestingProductGroupIndustrisCtrl'
          }
      }
  });

  $stateProvider.state('tab.testingproductindustris', 
  {
      url: '/testing/productindustris',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/productindustris.html',
              controller: 'TestingProductIndustrisCtrl'
          }
      }
  });

  $stateProvider.state('tab.testingmerchants', 
  {
      url: '/testing/merchants',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/merchants.html',
              controller: 'TestingMerchantsCtrl'
          }
      }
  });
  $stateProvider.state('tab.testingmerchanttypes', 
  {
      url: '/testing/merchanttypes',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/merchanttypes.html',
              controller: 'TestingMerchantTypesCtrl'
          }
      }
  });
  $stateProvider.state('tab.testingmerchantbanks', 
  {
      url: '/testing/merchantbanks',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/merchantbanks.html',
              controller: 'TestingMerchantBanksCtrl'
          }
      }
  });
  $stateProvider.state('tab.testingkaryawans', 
  {
      url: '/testing/karyawans',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/karyawans.html',
              controller: 'TestingKaryawansCtrl'
          }
      }
  });

  $stateProvider.state('tab.testingtransaksiheaders', 
  {
      url: '/testing/transaksiheaders',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/testing/transaksis/transaksiheaders.html',
              controller: 'TestingTransaksiHeadersCtrl'
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

}]);
