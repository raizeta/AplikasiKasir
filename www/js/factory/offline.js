angular.module('starter')
.factory('OfflineLiteFac',['$rootScope','$q','$cordovaSQLite','UtilService',
function($rootScope,$q,$cordovaSQLite,UtilService)
{
    var GetOffline = function()
    {
        var deferred     = $q.defer();
        var parameter    = []
        var query        = 'SELECT * FROM Tbl_SyncLocal WHERE STATUS_SYNC= 0 LIMIT 20';
        $cordovaSQLite.execute($rootScope.db,query,parameter)
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

    var GetLogOffline = function()
    {
        var deferred     = $q.defer();
        var parameter    = []
        var query        = 'SELECT * FROM Tbl_SyncLocal';
        $cordovaSQLite.execute($rootScope.db,query,parameter)
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

    var CreateOffline = function (datatosave)
    {
        var deferred        = $q.defer();
        var NAMA_TABEL      = datatosave.NAMA_TABEL;
        var PRIMARY_KEY     = datatosave.PRIMARY_KEY;
        var TYPE_ACTION     = datatosave.TYPE_ACTION;
        var STATUS_SYNC     = 0;

        var isitable            = [NAMA_TABEL,PRIMARY_KEY,TYPE_ACTION,STATUS_SYNC]
        var query               = 'INSERT INTO Tbl_SyncLocal (NAMA_TABEL,PRIMARY_KEY,TYPE_ACTION,STATUS_SYNC) VALUES (?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var UpdateOffline = function(parameter)
    {
        var deferred     = $q.defer();
        var query        = 'UPDATE Tbl_SyncLocal SET STATUS_SYNC = 1 WHERE ID_LOCAL= ?';
        // var query        = 'DELETE FROM Tbl_SyncLocal WHERE ID_LOCAL= ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameter.ID_LOCAL])
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

    var SumOfflinePerTableName = function()
    {
        var deferred     = $q.defer();
        var parameter    = []
        var query        = 'SELECT NAMA_TABEL,COUNT(ID_LOCAL)AS JUMLAH FROM Tbl_SyncLocal WHERE STATUS_SYNC=0 GROUP BY NAMA_TABEL';
        $cordovaSQLite.execute($rootScope.db,query,parameter)
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

    return{
            CreateOffline:CreateOffline,
            GetLogOffline:GetLogOffline,
            GetOffline:GetOffline,
            UpdateOffline:UpdateOffline,
            SumOfflinePerTableName:SumOfflinePerTableName
        }
}])