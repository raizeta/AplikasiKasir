angular.module('starter')
.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.settingsprofile', 
    {
        url: '/settings/profile',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/settings/profile.html',
            controller: 'SettingCtrl'
          }
        }
    });
    $stateProvider.state('tab.settingtsemplate', 
    {
        url: '/settings/template',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/settings/template.html',
            controller: 'SettingCtrl'
          }
        }
    });
    $stateProvider.state('tab.settingttoko', 
    {
        url: '/settings/toko',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/settings/toko.html',
            controller: 'SettingTokoCtrl'
          }
        }
    });
    $stateProvider.state('tab.settingdevice', 
    {
        url: '/settings/device',
        views: 
        {
          'view-content': 
          {
            templateUrl: 'templates/settings/device.html',
            controller: 'SettingDeviceCtrl'
          }
        }
    });
}]);
