angular.module('starter')
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) 
{
    

    $stateProvider.state('auth', 
    {
        url: '/auth',
        templateUrl: 'templates/secured/mainlogin.html',
        abstract:true,
    });
    $stateProvider.state('auth.login', 
    {
        url: '/login',
        views: 
        {
            'login-tab': 
            {
              templateUrl: 'templates/secured/login.html',
              controller: 'LoginCtrl',
            }
        },
        resolve:
        {
            userinformation: ['$q', 'StorageService', '$injector', '$location', function ($q,StorageService,$injector,$location) 
            {
                var userinformation = StorageService.get('advanced-profile');
                if(userinformation)
                {
                    $location.path("/tab/sales");
                    $apply();
                }
            }]
        }
    });
    $stateProvider.state('auth.wellcome', 
    {
        url: '/wellcome',
        views: 
        {
            'login-tab': 
            {
              templateUrl: 'templates/wellcome/index.html',
              controller: 'WellComeCtrl',
            }
        }
    });
    $urlRouterProvider.otherwise('/tab/sales');

      
}]);

