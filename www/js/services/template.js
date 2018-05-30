angular.module('starter')
.service('TemplateCssService', function(StorageService,UtilService,$rootScope,$window,$q,$http,$filter,StorageService)
{
    var ChangeTemplate = function()
    {
        $rootScope.theme = StorageService.get('template');
        element = angular.element(document.querySelectorAll('ion-side-menu-content ion-header-bar'));
        element.removeClass('bar-positive');
        element.removeClass('bar-balanced');
        element.removeClass('bar-assertive');
        element.removeClass('bar-calm');
        element.removeClass('bar-dark');
        if($rootScope.theme)
        {
            element.addClass($rootScope.theme.headerstyle);
        }
        else
        {
            element.addClass('bar-balanced');
            $rootScope.theme = {'name':'balanced','headerstyle': 'bar-balanced','itemstyle':'item-balanced','buttonstyle':'button-balanced','img_display':'img/balanced.png'};
            StorageService.set('template',$rootScope.theme);
        }
    }

    return {
      ChangeTemplate:ChangeTemplate
    };
});