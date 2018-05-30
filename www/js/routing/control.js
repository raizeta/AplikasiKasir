angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab.newstores', 
  {
      url: '/control/stores',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/stores.html',
              controller: 'ControlStoresCtrl'
          }
      }
  });

  $stateProvider.state('tab.controlperangkat', 
  {
      url: '/control/perangkat',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/perangkat.html',
              controller: 'ControlPerangkatCtrl'
          }
      }
  });

  $stateProvider.state('tab.controldompetutama', 
  {
      url: '/control/dompetutama',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/dompetutama.html',
              controller: 'ControlDompetUtamaCtrl'
          }
      }
  });

  $stateProvider.state('tab.controldompettoko', 
  {
      url: '/control/dompettoko',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/dompettoko.html',
              controller: 'ControlDompetTokoCtrl'
          }
      }
  });


  $stateProvider.state('tab.newdepositppbob', 
  {
      url: '/control/depositppob',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/depositppob.html',
              controller: 'ControlDepositPPOBCtrl'
          }
      }
  });

  $stateProvider.state('tab.newemploye', 
  {
      url: '/control/employe',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/employe.html',
              controller: 'EmployeCtrl'
          }
      }
  });
  
  $stateProvider.state('tab.newproduct', 
  {
      url: '/control/product',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/product.html',
              controller: 'ControlProductsCtrl'
          }
      }
  });

  $stateProvider.state('tab.groupproduct', 
  {
      url: '/control/groupproduct',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/groupproduct.html',
              controller: 'ControlGroupProductCtrl'
          }
      }
  });

  $stateProvider.state('tab.groupproduct-detail', 
  {
      url: '/control/groupproduct/:storeid/:groupid',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/products-group/detailgroupproduct.html',
              controller: 'ControlGroupProductDetailCtrl'
          }
      }
  });

  $stateProvider.state('tab.newmerchant', 
  {
      url: '/control/merchant',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/control/merchant.html',
              controller: 'AbsensiCtrl'
          }
      }
  });
});
