angular.module('starter')
.directive('autoTabTo', [
function ()
{
  return {
      restrict: "A",
      link: function (scope, el, attrs) {
          el.bind('keyup', function(e) {
            if (this.value.length === this.maxLength) {
              var element = document.getElementById(attrs.autoTabTo);
              if (element)
                element.focus();
            }
          });
      }
  }
}])
