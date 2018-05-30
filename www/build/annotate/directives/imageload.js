angular.module('starter')
.directive('imageonload', ['$timeout', function($timeout) 
{
    function timeOut(value, scope) 
    {
        $timeout(function() 
        {
            scope.imageLoaded = value;
        });
    }
    return {
        restrict: 'A',
        link: function(scope, element, attrs) 
        {
            element.bind('load', function() 
            {
                // element.attr('src', 'img/adam.jpg');
                timeOut(true, scope);

            });
            element.bind('error', function()
            {
                element.attr('src', 'img/save-image.png');
                timeOut(false, scope);
            });
        }
    };
}])