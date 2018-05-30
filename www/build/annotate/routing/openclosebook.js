angular.module('starter')
.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab.openbook', 
  {
      url: '/openbook',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/openclosebook/openbook.html',
              controller: 'OpenBookCtrl'
          }
      }
  });
  $stateProvider.state('tab.closebook', 
  {
      url: '/closebook',
      views: 
      {
        'view-content': 
        {
          templateUrl: 'templates/openclosebook/closebook.html',
          controller: 'CloseBookCtrl'
        }
      }
  });

  $stateProvider.state('tab.closebook-detail', 
  {
      url: '/closebook/:closebook_id',
      views: 
      {
        'view-content': 
        {
          templateUrl: 'templates/openclosebook/detailclosebook.html',
          controller: 'CloseBookDetailCtrl'
        }
      }
  });

  $stateProvider.state('tab.setoranbook', 
    {
          url: "/setoranbook",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/openclosebook/setoran.html",
                  controller:'SetoranCtrl'
              }
          },
    });

  $stateProvider.state('tab.notifikasiclosebook', 
  {
      url: '/notifikasiclosebook',
      views: 
      {
        'view-content': 
        {
          templateUrl: 'templates/openclosebook/notifikasiclosebook.html',
          controller: 'NotifikasiCtrl'
        }
      }
  })


}]);
