angular.module('starter')
.directive('imageonload', function($timeout) 
{
    function replaceimage(value, scope) 
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
                replaceimage(true, scope);

            });
            element.bind('error', function()
            {
                var karakter    = element[0].alt.substr(0,2).toUpperCase();
                var cobj        = getCharacterObject(karakter,'#ffffff','HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',400,30);
                var svg         = getImgTag(90,0,'#5A8770');

                svg.append(cobj);
                var lvcomponent = angular.element('<div>').append(svg.clone()).html();
                var svgHtml = window.btoa(unescape(encodeURIComponent(lvcomponent)));

                element.attr('src', 'data:image/svg+xml;base64,' + svgHtml);
                replaceimage(false, scope);
            });
        }
    };
})