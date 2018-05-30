angular.module('starter')
.factory('OpenCloseBookCombFac',['OpenCloseBookLiteFac','OpenCloseBookFac','UtilService','$q','$filter',
function(OpenCloseBookLiteFac,OpenCloseBookFac,UtilService,$q,$filter)
{
    var GetOpenCloseBook  = function (parameters)
    {
        var deferred        = $q.defer();
        OpenCloseBookLiteFac.GetOpenCloseBook(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                OpenCloseBookFac.GetOpenCloseBook(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.TGL_SAVE              = $filter('date')(new Date(),'yyyy-MM-dd');
                            value.SPLIT_OPENCLOSE_ID    = value.OPENCLOSE_ID.split('.')[2];
                            if(!value.ADDCASH)
                            {
                                value.ADDCASH           = 0
                            }
                            if(!value.CASHINDRAWER)
                            {
                                value.CASHINDRAWER      = 0
                            }
                            OpenCloseBookLiteFac.CreateOpenCloseBook(value,'FROM-SERVER');
                        });
                        deferred.resolve(responseserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
        });
        return deferred.promise;
    }

    var GetSetoranBook  = function (parameters)
    {
        var deferred        = $q.defer();
        OpenCloseBookLiteFac.GetSetoranBook(parameters)
        .then(function(responselite)
        {
            if(angular.isArray(responselite) && responselite.length > 0)
            {
                deferred.resolve(responselite)
            }
            else
            {
                OpenCloseBookFac.GetSetoranBook(parameters)
                .then(function(responseserver)
                {
                    if(angular.isArray(responseserver) && responseserver.length > 0 )
                    {
                        angular.forEach(responseserver,function(value,key)
                        {
                            value.SPLIT_OPENCLOSE_ID    = value.OPENCLOSE_ID.split('.')[2];
                            value.TGL_SAVE              = $filter('date')(new Date(value.TGL_STORAN),'yyyy-MM-dd');
                            if(!value.STORAN_IMAGE)
                            {
                                value.STORAN_IMAGE      = 'img/save-image.png';
                            }
                            OpenCloseBookLiteFac.CreateSetoranBook(value,'FROM-SERVER');
                        });
                        deferred.resolve(responseserver);
                    }
                    else
                    {
                        deferred.resolve([]);
                    }
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
        });
        return deferred.promise;
    }

    return{
            GetOpenCloseBook:GetOpenCloseBook,
            GetSetoranBook:GetSetoranBook
        }
}])