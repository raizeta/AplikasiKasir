angular.module('starter')
.factory('SaveToBillLiteFac',['$rootScope','$q','$cordovaSQLite','UtilService','$filter',
function($rootScope,$q,$cordovaSQLite,UtilService,$filter)
{
    var SetSaveToBill = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = $filter('date')(new Date(),'yyyy-MM-dd');
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var ACCESS_ID           = datatosave.ACCESS_ID;
        var TRANS_ID            = datatosave.TRANS_ID;
        var ALIAS_TRANS_ID      = datatosave.ALIAS_TRANS_ID;
        var isitable            = [TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,TRANS_ID,ALIAS_TRANS_ID];
        var query               = 'INSERT INTO Tbl_SaveBill (TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,TRANS_ID,ALIAS_TRANS_ID) VALUES (?,?,?,?,?,?)';
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
    var GetSaveToBillByDate = function (dataparams)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = $filter('date')(new Date(),'yyyy-MM-dd');
        var isitable        = [dataparams.TGL_SAVE,dataparams.ACCESS_GROUP,dataparams.STORE_ID,dataparams.ACCESS_ID];
        var query           = 'SELECT * FROM Tbl_SaveBill WHERE TGL_SAVE = ? AND ACCESS_GROUP = ? AND STORE_ID = ? AND ACCESS_ID =?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
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

    var GetSaveToBillByNomorTrans = function (dataparams)
    {
        var deferred    = $q.defer();
        var isitable    = [dataparams.TGL_SAVE,dataparams.ACCESS_GROUP,dataparams.STORE_ID,dataparams.ACCESS_ID,dataparams.TRANS_ID];
        var query       = 'SELECT * FROM Tbl_SaveBill WHERE TGL_SAVE=? AND ACCESS_GROUP=? AND STORE_ID=? AND ACCESS_ID = ? AND TRANS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
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
    
    var DeleteSaveToBillByNomorTrans = function (TRANS_ID)
    {
        var deferred            = $q.defer();
        var querydeletebill     = 'DELETE FROM Tbl_SaveBill WHERE TRANS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,querydeletebill,[TRANS_ID])
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
    

    return{
            SetSaveToBill:SetSaveToBill,
            GetSaveToBillByDate:GetSaveToBillByDate,
            GetSaveToBillByNomorTrans:GetSaveToBillByNomorTrans,
            DeleteSaveToBillByNomorTrans:DeleteSaveToBillByNomorTrans
        }
}])