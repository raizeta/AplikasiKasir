angular.module('starter')
.factory('SecuredFac',['$http','$q','StorageService','UtilService',
function($http,$q,StorageService,UtilService)
{
    var Login = function(datalogin)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-logins";

        var result              = UtilService.SerializeObject(datalogin);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.result) && (data.result == 'wrong-username'))
            {
                deferred.reject("username_salah");
            }
            else if(angular.isDefined(data.result) && (data.result == 'wrong-password'))
            {
                deferred.reject("password_salah");
            }
            else if(angular.isDefined(data.result) && (data.result == 'wrong-sosmed'))
            {
                deferred.reject("wrong-sosmed");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Active-Code'))
            {
                deferred.reject("Active-Code");
            }
            else if(angular.isDefined(data.result) && (data.result == 'wrong-code'))
            {
                deferred.reject("wrong-code");
            }
            else
            {
                if(angular.isArray(data.User) && data.User.length > 0)
                {
                    var resultuser = data.USER[0];
                }
                else
                {
                    var resultuser = data.USER;
                }
            
                resultuser.STORES_ACTIVE    = resultuser.LIST_STORES[0];
                StorageService.set('advanced-profile',resultuser);

                var parameters          = {};
                parameters.ACCESS_GROUP = resultuser.ACCESS_GROUP;
                parameters.ACCESS_ID    = resultuser.ACCESS_ID;
                parameters.access_token = resultuser.access_token;
                parameters.username     = resultuser.username;
                parameters.UUID         = datalogin.UUID;  
                
                StorageService.set('basic-parameters',parameters);

                deferred.resolve(resultuser);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    
    var Registration = function(dataregistration)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-signup-owners";

        var result              = UtilService.SerializeObject(dataregistration);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.result) && (data.result == 'Email-Already-Exist'))
            {
                deferred.reject("Email-Already-Exist");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Username-Already-Exist'))
            {
                deferred.reject("Username-Already-Exist");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Sosmed-Provider-Already-Exist'))
            {
                deferred.reject("Sosmed-Provider-Already-Exist");
            }

            else
            {
                if(angular.isArray(data.User) && data.User.length > 0)
                {
                    var resultuser = data.USER[0];
                }
                else
                {
                    var resultuser = data.USER;
                }
                
                if(angular.isDefined(resultuser.LIST_STORES))
                {
                    resultuser.STORES_ACTIVE    = resultuser.LIST_STORES[0];
                    StorageService.set('advanced-profile',resultuser);   
                }
                
                var parameters          = {};
                parameters.ACCESS_GROUP = resultuser.ACCESS_GROUP;
                parameters.ACCESS_ID    = resultuser.ACCESS_ID;
                parameters.access_token = resultuser.access_token;
                parameters.username     = resultuser.username;
                parameters.UUID         = dataregistration.UUID;
                StorageService.set('basic-parameters',parameters);

                deferred.resolve(resultuser);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var RegistrationLoginOps = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-signup-oprs";

        parameters.METHODE      = 'POST';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.result) && (data.result == 'User Already Exist'))
            {
                deferred.reject("User Already Exist");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist Store'))
            {
                deferred.reject("Not Exist Store");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist Owner'))
            {
                deferred.reject("Not Exist Owner");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist access_group'))
            {
                deferred.reject("Not Exist access_group");
            }
            else
            {
                deferred.resolve(data.result);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateLoginOps = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-signup-oprs";

        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.result) && (data.result == 'User Already Exist'))
            {
                deferred.reject("User Already Exist");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist Store'))
            {
                deferred.reject("Not Exist Store");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist Owner'))
            {
                deferred.reject("Not Exist Owner");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist access_group'))
            {
                deferred.reject("Not Exist access_group");
            }
            else
            {
                deferred.resolve(data.result);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateProfileOps = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-profiles";

        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.result) && (data.result == 'User Already Exist'))
            {
                deferred.reject("User Already Exist");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist Store'))
            {
                deferred.reject("Not Exist Store");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist Owner'))
            {
                deferred.reject("Not Exist Owner");
            }
            else if(angular.isDefined(data.result) && (data.result == 'Not Exist access_group'))
            {
                deferred.reject("Not Exist access_group");
            }
            else
            {
                deferred.resolve(data.PROFILE);
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetListUserOps = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-operationals";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            deferred.resolve(data.LIST_User);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var GetImageUserOps = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-images";

        parameters.METHODE      = 'GET';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.ACCESS_IMAGE))
            {
                deferred.resolve(data.ACCESS_IMAGE);    
            }
            else
            {
                deferred.reject('data-empty');
            }
            
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    
    var CreateImageUserOps = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-images";

        parameters.METHODE      = 'POST';
        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(data.ACCESS_IMAGE)
            {
                deferred.resolve(data.ACCESS_IMAGE);
            }
            else if (data.result == 'ACCESS_ID-already-exist')
            {
                UpdateImageUserOps(parameters)
                .then(function(updateimageuserops)
                {
                    deferred.resolve(updateimageuserops);
                },
                function(error)
                {
                    deferred.reject(error);
                })
            }
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var UpdateImageUserOps = function(parameters)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-images";

        var result              = UtilService.SerializeObject(parameters);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            deferred.resolve(data.ACCESS_IMAGE);
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var ResetOldPassword = function(data)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-resets";

        var result              = UtilService.SerializeObject(data);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.post(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.result) && (data.result == "Email-Not-Exist"))
            {
                deferred.reject("Email-Not-Exist");
            }
            else if(angular.isDefined(data.result) && (data.result == "Success-Check-Email-Code"))
            {
                deferred.resolve("Success-Check-Email-Code");
            }   
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var SetNewPassword = function(data)
    {
        var deferred            = $q.defer();
        var globalurl           = UtilService.ApiUrl();      
        var url                 = globalurl + "login/user-resets";

        var result              = UtilService.SerializeObject(data);
        var serialized          = result.serialized;
        var config              = result.config;

        $http.put(url,serialized,config)
        .success(function(data,status,headers,config) 
        {
            if(angular.isDefined(data.result) && (data.result == "wrong-code"))
            {
                deferred.reject("wrong-code");
            }
            else
            {
                deferred.resolve(data);
            }   
        })
        .error(function(err,status)
        {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    
	return{
            Login:Login,
            Registration:Registration,
            RegistrationLoginOps:RegistrationLoginOps,
            UpdateLoginOps:UpdateLoginOps,
            UpdateProfileOps:UpdateProfileOps,
            GetListUserOps:GetListUserOps,
            GetImageUserOps:GetImageUserOps,
            UpdateImageUserOps:UpdateImageUserOps,
            CreateImageUserOps:CreateImageUserOps,
            ResetOldPassword:ResetOldPassword,
            SetNewPassword:SetNewPassword
        }
}])