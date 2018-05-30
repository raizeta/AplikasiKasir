angular.module('starter')
.service('ToastService',['toastr','$cordovaToast',function(toastr,$cordovaToast)
{
   var ShowToast = function(message,status)
   {
      if (window.cordova && window.cordova.plugins) 
      {
        $cordovaToast.show(message, 'long', 'bottom');
      }
      else
      {
        if(status == 'success')
        {
            toastr.success(message);
        }
        else if(status == 'error')
        {
            toastr.error(message);
        }
      }
   }
   

   return {
      ShowToast:ShowToast
   }
}])