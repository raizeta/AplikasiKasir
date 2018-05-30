angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
    
    $stateProvider.state('tab.kreditplus', 
    {
        url: '/kreditplus/timeline',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/kreditplus/mastercicilan.html',
            controller: 'KreditPlusCtrl'
          }
        }
    });
    $stateProvider.state('tab.kreditplus-datapribadi', 
    {
        url: '/kreditplus/timeline/datapribadi',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/kreditplus/datapribadi.html'
          }
        }
    });
    $stateProvider.state('tab.kreditplus-datakontak', 
    {
        url: '/kreditplus/timeline/datakontak',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/kreditplus/datakontak.html'
          }
        }
    });
    $stateProvider.state('tab.kreditplus-datapekerjaan', 
    {
        url: '/kreditplus/timeline/datapekerjaan',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/kreditplus/datapekerjaan.html'
          }
        }
    });
    $stateProvider.state('tab.kreditplus-datadokumen', 
    {
        url: '/kreditplus/timeline/datadokumen',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/kreditplus/datadokumen.html'
          }
        }
    });
    $stateProvider.state('tab.kreditplus-datadomisili', 
    {
        url: '/kreditplus/timeline/datadomisili',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/kreditplus/datadomisili.html'
          }
        }
    });
});
