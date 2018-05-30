angular.module('starter')
.factory('ProvinsisLiteFac',['$rootScope','$q','$cordovaSQLite','UtilService',
function($rootScope,$q,$cordovaSQLite,UtilService)
{
    var SetProvinsis = function (datatosave)
    {
        var deferred        = $q.defer();
        var PROVINCE_ID     = datatosave.PROVINCE_ID;
        var PROVINCE        = datatosave.PROVINCE;

        var isitable        = [PROVINCE_ID,PROVINCE]
        var query           = 'INSERT INTO Tbl_Provinsis (PROVINCE_ID,PROVINCE) VALUES (?,?)';
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

    var GetProvinsis = function()
    {
        var deferred  = $q.defer();
        var query     = 'SELECT * FROM Tbl_Provinsis';
        $cordovaSQLite.execute($rootScope.db,query,[])
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

    var SetKotas = function (datatosave)
    {
        var deferred        = $q.defer();
        var PROVINCE_ID     = datatosave.PROVINCE_ID;
        var PROVINCE        = datatosave.PROVINCE;
        var CITY_ID         = datatosave.CITY_ID;
        var CITY_NAME       = datatosave.CITY_NAME;
        var TYPE            = datatosave.TYPE;
        var POSTAL_CODE     = datatosave.POSTAL_CODE;

        var isitable        = [PROVINCE_ID,PROVINCE,CITY_ID,CITY_NAME,TYPE,POSTAL_CODE]
        var query           = 'INSERT INTO Tbl_Kotas (PROVINCE_ID,PROVINCE,CITY_ID,CITY_NAME,TYPE,POSTAL_CODE) VALUES (?,?,?,?,?,?)';
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
    var GetKotas = function(parameter)
    {
        var deferred  = $q.defer();
        var query     = 'SELECT * FROM Tbl_Kotas WHERE PROVINCE_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[parameter.PROVINCE_ID])
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
            SetProvinsis:SetProvinsis,
            GetProvinsis:GetProvinsis,
            SetKotas:SetKotas,
            GetKotas:GetKotas
        }
}])