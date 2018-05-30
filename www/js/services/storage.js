angular.module('starter')
.service('StorageService',function($window)
{
   var set = function(key,value)
   {
      return $window.localStorage.setItem(key,JSON.stringify(value));
   }
   var get = function(key)
   {
     return JSON.parse(localStorage.getItem(key));
   }
   var destroy = function(key)
   {
     return $window.localStorage.removeItem(key);
   }

   return {
      set:set,
      get:get,
      destroy:destroy
   }
});