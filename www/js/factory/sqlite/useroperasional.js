angular.module('starter')
.factory('UserOpsLiteFac',['OfflineLiteFac','$rootScope','$q','$cordovaSQLite','UtilService',
function(OfflineLiteFac,$rootScope,$q,$cordovaSQLite,UtilService)
{
    var GetUserOperationals = function(parameters)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_UserOperasional WHERE STORE_ID = ? AND ACCESS_GROUP = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.STORE_ID,parameters.ACCESS_GROUP])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise; 
    }

    var GetUserOperationalByIDLocal = function(ID_LOCAL)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_UserOperasional WHERE ID_LOCAL = ?';
        $cordovaSQLite.execute($rootScope.db,query,[ID_LOCAL])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise; 
    }

    var GetUserOperationalByAccessID = function(parameters)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_UserOperasional WHERE ACCESS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.ACCESS_ID])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise; 
    }

    var CreateUserOperationals = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var ACCESS_ID       = datatosave.ACCESS_ID;
        var ACCESS_LEVEL    = datatosave.ACCESS_LEVEL;
        var username        = datatosave.username;
        var email           = datatosave.email;
        var password        = datatosave.password;
        var status          = datatosave.status;

        var isitable        = [ACCESS_GROUP,STORE_ID,ACCESS_ID,ACCESS_LEVEL,username,email,password,status]
        var query           = 'INSERT INTO Tbl_UserOperasional (ACCESS_GROUP,STORE_ID,ACCESS_ID,ACCESS_LEVEL,username,email,password,status) VALUES (?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            result.ID_LOCAL = result.insertId;
            deferred.resolve(result);
            // if(fromwhere != 'FROM-SERVER')
            // {
            //     var dataoffline         = {};
            //     dataoffline.NAMA_TABEL  = 'Tbl_UserOperasional';
            //     dataoffline.PRIMARY_KEY = result.insertId;
            //     dataoffline.TYPE_ACTION = 1;
            //     OfflineLiteFac.CreateOffline(dataoffline)
            //     .then(function(responsecreateoffline)
            //     {
            //         responsecreateoffline.ID_LOCAL = result.insertId;
            //         deferred.resolve(responsecreateoffline)
            //     },
            //     function(error)
            //     {
            //         deferred.reject(error);
            //     });
            // }
            // else
            // {
            //     result.ID_LOCAL = result.insertId;
            //     deferred.resolve(result);
            // }
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var UpdateUserOperationals = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var ACCESS_ID       = datatosave.ACCESS_ID;
        var ACCESS_LEVEL    = datatosave.ACCESS_LEVEL;
        var username        = datatosave.username;
        var email           = datatosave.email;
        var password        = datatosave.password;
        var status          = datatosave.status;

        var isitable        = [ACCESS_GROUP,STORE_ID,ACCESS_LEVEL,username,email,password,status,ACCESS_ID]
        var query           = 'UPDATE Tbl_UserOperasional SET ACCESS_GROUP=?,STORE_ID=?,ACCESS_LEVEL=?,username=?,email=?,password=?,status=? WHERE ACCESS_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_UserOperasional';
                dataoffline.PRIMARY_KEY = datatosave.ID_LOCAL;
                dataoffline.TYPE_ACTION = 2;
                OfflineLiteFac.CreateOffline(dataoffline)
                .then(function(responsecreateoffline)
                {
                    deferred.resolve(responsecreateoffline)
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
            else
            {
                deferred.resolve(result);
            }
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    return{
            GetUserOperationals:GetUserOperationals,
            GetUserOperationalByIDLocal:GetUserOperationalByIDLocal,
            GetUserOperationalByAccessID:GetUserOperationalByAccessID,
            CreateUserOperationals:CreateUserOperationals,
            UpdateUserOperationals:UpdateUserOperationals
        }
}])