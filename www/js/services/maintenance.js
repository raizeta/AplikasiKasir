angular.module('starter')
.service('MaintenanceService',function(toastr,$cordovaToast)
{
   var TestMaintenance = function(aliasfunction)
   {
      switch (aliasfunction) 
      {
          case 'feedpaper':
              console.log(aliasfunction)
              break;
          case 'printstatus':
              console.log(aliasfunction)
              break;
          case 'printbill':
              console.log(aliasfunction)
              break;

          case 'turnonall':
              console.log(aliasfunction)
              break;
          case 'turnoffall':
              console.log(aliasfunction)
              break;
          case 'redlight':
              console.log(aliasfunction)
              break;
          case 'greenlight':
              console.log(aliasfunction)
              break;
          case 'yellowlight':
              console.log(aliasfunction)
              break;
          case 'bluelight':
              console.log(aliasfunction)
              break;
          case 'blueandredlight':
              console.log(aliasfunction)
              break;

          case 'openscanner':
              console.log(aliasfunction)
              break;
          case 'initfrontscanner':
              console.log(aliasfunction)
              break;
          case 'initbackscanner':
              console.log(aliasfunction)
              break;
          case 'startscanner':
              console.log(aliasfunction)
              break;
          case 'stopscanner':
              console.log(aliasfunction)
              break;
          case 'closescanner':
              console.log(aliasfunction)
              break;
          case 'blueandredlight':
              console.log(aliasfunction)
              break;

          case 'normalbeeper':
              console.log(aliasfunction)
              break;
          case 'errorbeeper':
              console.log(aliasfunction)
              break;
          case 'intervalbeeper':
              console.log(aliasfunction)
              break;
          case 'timeoutbeeper':
              console.log(aliasfunction)
              break;
      }  
   }
   

   return {
      TestMaintenance:TestMaintenance
   }
});