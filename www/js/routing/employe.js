angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{

  $stateProvider.state('tab.employe-absensi', 
  {
      url: '/employe/absensi',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/employe/absensi.html',
              controller: 'AbsensiCtrl'
          }
      }
  });
  $stateProvider.state('tab.employe-laporandaily', 
  {
      url: '/employe/laporan-daily',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/employe/laporandaily.html',
              controller: 'LaporanAbsensiDailyCtrl'
          }
      }
  });
  $stateProvider.state('tab.employe-laporanmonthly', 
  {
      url: '/employe/laporan-monthly',
      views: 
      {
          'view-content': 
            {
              templateUrl: 'templates/employe/laporanmonthly.html',
              controller: 'LaporanAbsensiMonthlyCtrl'
          }
      }
  });
});
