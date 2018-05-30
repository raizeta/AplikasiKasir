angular.module('starter')
.factory('authInterceptor',['StorageService',function (StorageService) 
{
  return {
    request: function (config) 
    {
      config.headers = config.headers || {};

      var storage     = StorageService.get('profile');
      if(storage) 
      {
        config.headers.Authorization = 'Bearer ' + storage.access_token;
      }
      return config;
    },
    response: function (response) 
    {
      if (response.status === 401) 
      {
        console.log("Tidak Bertanggung Jawab");
      }
      return response || $q.when(response);
    }
  };
}])
