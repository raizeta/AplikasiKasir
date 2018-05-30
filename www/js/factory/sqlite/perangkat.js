angular.module('starter')
.factory('PerangkatsLiteFac',['OfflineLiteFac','UtilService','$rootScope','$q','$cordovaSQLite',
function(OfflineLiteFac,UtilService,$rootScope,$q,$cordovaSQLite)
{
    var GetPerangkats = function(parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PerangkatStore WHERE ACCESS_GROUP=? AND STORE_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.ACCESS_GROUP,parameters.STORE_ID])
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
    var CreatePerangkats = function (datatosave,fromwhere)
    {
        var deferred                = $q.defer();
        var ACCESS_GROUP            = datatosave.ACCESS_GROUP;
        var STORE_ID                = datatosave.STORE_ID;
        var STORE_NM                = datatosave.STORE_NM;
        var KASIR_ID                = datatosave.KASIR_ID;
        var KASIR_NM                = datatosave.KASIR_NM;
        var PERANGKAT_UUID          = datatosave.PERANGKAT_UUID;
        var KASIR_STT               = datatosave.KASIR_STT;
        var KASIR_STT_NM            = datatosave.KASIR_STT_NM;
        var DOMPET_AUTODEBET        = datatosave.DOMPET_AUTODEBET;
        var DOMPET_AUTODEBET_NM     = datatosave.DOMPET_AUTODEBET_NM;
        var PAYMENT_METHODE         = datatosave.PAYMENT_METHODE;
        var PAYMENT_METHODE_NM      = datatosave.PAYMENT_METHODE_NM;
        var DATE_START              = datatosave.DATE_START;
        var DATE_END                = datatosave.DATE_END;
        var STATUS                  = datatosave.STATUS;
        var STATUS_NM               = datatosave.STATUS_NM;
        var PAKET_GROUP             = datatosave.PAKET_GROUP;
        var PAKET_ID                = datatosave.PAKET_ID;
        var PAKET_NM                = datatosave.PAKET_NM;
        var PAKET_DURATION          = datatosave.PAKET_DURATION;
        var PAKET_DURATION_BONUS    = datatosave.PAKET_DURATION_BONUS;
        var HARGA_BULAN             = datatosave.HARGA_BULAN;
        var HARGA_HARI              = datatosave.HARGA_HARI;
        var HARGA_PAKET             = datatosave.HARGA_PAKET;
        var HARGA_PAKET_HARI        = datatosave.HARGA_PAKET_HARI;
        var PAKET_STT               = datatosave.PAKET_STT;
        var PAKET_STT_NM            = datatosave.PAKET_STT_NM;

        var isitable            = [ACCESS_GROUP,STORE_ID,STORE_NM,KASIR_ID,KASIR_NM,PERANGKAT_UUID,KASIR_STT,KASIR_STT_NM,DOMPET_AUTODEBET,DOMPET_AUTODEBET_NM,PAYMENT_METHODE,PAYMENT_METHODE_NM,DATE_START,DATE_END,STATUS,STATUS_NM,PAKET_GROUP,PAKET_ID,PAKET_NM,PAKET_DURATION,PAKET_DURATION_BONUS,HARGA_BULAN,HARGA_HARI,HARGA_PAKET,HARGA_PAKET_HARI,PAKET_STT,PAKET_STT_NM]
        var query               = 'INSERT INTO Tbl_PerangkatStore (ACCESS_GROUP,STORE_ID,STORE_NM,KASIR_ID,KASIR_NM,PERANGKAT_UUID,KASIR_STT,KASIR_STT_NM,DOMPET_AUTODEBET,DOMPET_AUTODEBET_NM,PAYMENT_METHODE,PAYMENT_METHODE_NM,DATE_START,DATE_END,STATUS,STATUS_NM,PAKET_GROUP,PAKET_ID,PAKET_NM,PAKET_DURATION,PAKET_DURATION_BONUS,HARGA_BULAN,HARGA_HARI,HARGA_PAKET,HARGA_PAKET_HARI,PAKET_STT,PAKET_STT_NM) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_PerangkatStore';
                dataoffline.PRIMARY_KEY = result.insertId;
                dataoffline.TYPE_ACTION = 1;
                OfflineLiteFac.CreateOffline(dataoffline)
                .then(function(responsecreateoffline)
                {
                    responsecreateoffline.ID_LOCAL = result.insertId;
                    deferred.resolve(responsecreateoffline)
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
            else
            {
                result.ID_LOCAL = result.insertId;
                deferred.resolve(result);
            }
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var GetPakets = function(parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PerangkatPaket';
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

    var CreatePakets= function (datatosave,fromwhere)
    {
        var deferred                = $q.defer();
        var PAKET_GROUP             = datatosave.PAKET_GROUP;
        var PAKET_ID                = datatosave.PAKET_ID;
        var PAKET_NM                = datatosave.PAKET_NM;
        var PAKET_DURATION          = datatosave.PAKET_DURATION;
        var PAKET_DURATION_BONUS    = datatosave.PAKET_DURATION_BONUS;
        var HARGA_BULAN             = datatosave.HARGA_BULAN;
        var HARGA_HARI              = datatosave.HARGA_HARI;
        var HARGA_PAKET             = datatosave.HARGA_PAKET;
        var HARGA_PAKET_HARI        = datatosave.HARGA_PAKET_HARI;
        var PAKET_STT               = datatosave.PAKET_STT;
        var PAKET_STT_NM            = datatosave.PAKET_STT_NM;

        var isitable            = [PAKET_GROUP,PAKET_ID,PAKET_NM,PAKET_DURATION,PAKET_DURATION_BONUS,HARGA_BULAN,HARGA_HARI,HARGA_PAKET,HARGA_PAKET_HARI,PAKET_STT,PAKET_STT_NM]
        var query               = 'INSERT INTO Tbl_PerangkatPaket (PAKET_GROUP,PAKET_ID,PAKET_NM,PAKET_DURATION,PAKET_DURATION_BONUS,HARGA_BULAN,HARGA_HARI,HARGA_PAKET,HARGA_PAKET_HARI,PAKET_STT,PAKET_STT_NM) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_PerangkatPaket';
                dataoffline.PRIMARY_KEY = result.insertId;
                dataoffline.TYPE_ACTION = 1;
                OfflineLiteFac.CreateOffline(dataoffline)
                .then(function(responsecreateoffline)
                {
                    responsecreateoffline.ID_LOCAL = result.insertId;
                    deferred.resolve(responsecreateoffline)
                },
                function(error)
                {
                    deferred.reject(error);
                });
            }
            else
            {
                result.ID_LOCAL = result.insertId;
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
            GetPerangkats:GetPerangkats,
            CreatePerangkats:CreatePerangkats,
            GetPakets:GetPakets,
            CreatePakets:CreatePakets    
        }
}])

