angular.module('starter')
.factory('StoresLiteFac',['OfflineLiteFac','UtilService','$rootScope','$q','$cordovaSQLite',
function(OfflineLiteFac,UtilService,$rootScope,$q,$cordovaSQLite)
{
    var GetStores = function(parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Stores WHERE ACCESS_GROUP=? AND ACCESS_ID LIKE "%' + parameters.ACCESS_ID + '%" AND STATUS = 1';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.ACCESS_GROUP])
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

    var GetMaxStoreID = function (ACCESS_GROUP)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(STORE_ID)AS MAX_STORE_ID FROM Tbl_Stores WHERE ACCESS_GROUP=?';
        $cordovaSQLite.execute($rootScope.db,query,[ACCESS_GROUP])
        .then(function(result) 
        {
            if(result.rows.length > 0 && result.rows.item(0)['MAX_STORE_ID'])
            {
                var response        = UtilService.SqliteToArray(result);
                var laststoreid     = response[0].MAX_STORE_ID;
                var lastnomorurut   = laststoreid.split('.')[1];
                var newnomorurut    = UtilService.StringPad(Number(lastnomorurut) + 1,'0000')                
                var newstoreid      = ACCESS_GROUP + '.' + newnomorurut;
                deferred.resolve(newstoreid);
            }
            else
            {
                var newstoreid = ACCESS_GROUP + '.0001';
                deferred.resolve(newstoreid);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }

    var GetStoreByIDLocal = function(ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Stores WHERE ID_LOCAL=?';
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

    var GetStoreByStoreID = function(parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Stores WHERE STORE_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.STORE_ID])
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

    var CreateStores = function (datatosave,fromwhere)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = datatosave.TGL_SAVE;
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var STORE_NM            = datatosave.STORE_NM;
        var ACCESS_ID           = datatosave.ACCESS_ID;
        var UUID                = datatosave.UUID;
        var PLAYER_ID           = datatosave.PLAYER_ID;
        var PROVINCE_ID         = datatosave.PROVINCE_ID;
        var PROVINCE_NM         = datatosave.PROVINCE_NM;
        var CITY_ID             = datatosave.CITY_ID;
        var CITY_NAME           = datatosave.CITY_NAME;
        var ALAMAT              = datatosave.ALAMAT;
        var PIC                 = datatosave.PIC;
        var TLP                 = datatosave.TLP;
        var FAX                 = datatosave.FAX;
        var STATUS              = datatosave.STATUS;
        var START               = datatosave.START;
        var END                 = datatosave.END;
        var DCRP_DETIL          = datatosave.DCRP_DETIL;
        var INDUSTRY_ID         = datatosave.INDUSTRY_ID;
        var INDUSTRY_NM         = datatosave.INDUSTRY_NM;
        var INDUSTRY_GRP_ID     = datatosave.INDUSTRY_GRP_ID;
        var INDUSTRY_GRP_NM     = datatosave.INDUSTRY_GRP_NM;
        var LONGITUDE           = datatosave.LONGITUDE;
        var LATITUDE            = datatosave.LATITUDE;

        var isitable            = [TGL_SAVE,ACCESS_GROUP,STORE_ID,STORE_NM,ACCESS_ID,UUID,PLAYER_ID,PROVINCE_ID,PROVINCE_NM,CITY_ID,CITY_NAME,ALAMAT,PIC,TLP,FAX,STATUS,START,END,DCRP_DETIL,INDUSTRY_ID,INDUSTRY_NM,INDUSTRY_GRP_ID,INDUSTRY_GRP_NM,LONGITUDE,LATITUDE]
        var query               = 'INSERT INTO Tbl_Stores (TGL_SAVE,ACCESS_GROUP,STORE_ID,STORE_NM,ACCESS_ID,UUID,PLAYER_ID,PROVINCE_ID,PROVINCE_NM,CITY_ID,CITY_NAME,ALAMAT,PIC,TLP,FAX,STATUS,START,END,DCRP_DETIL,INDUSTRY_ID,INDUSTRY_NM,INDUSTRY_GRP_ID,INDUSTRY_GRP_NM,LONGITUDE,LATITUDE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Stores';
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

    var UpdateStores = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = datatosave.TGL_SAVE;
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var STORE_NM            = datatosave.STORE_NM;
        var ACCESS_ID           = datatosave.ACCESS_ID;
        var UUID                = datatosave.UUID;
        var PLAYER_ID           = datatosave.PLAYER_ID;
        var PROVINCE_ID         = datatosave.PROVINCE_ID;
        var PROVINCE_NM         = datatosave.PROVINCE_NM;
        var CITY_ID             = datatosave.CITY_ID;
        var CITY_NAME           = datatosave.CITY_NAME;
        var ALAMAT              = datatosave.ALAMAT;
        var PIC                 = datatosave.PIC;
        var TLP                 = datatosave.TLP;
        var FAX                 = datatosave.FAX;
        var STATUS              = datatosave.STATUS;
        var START               = datatosave.START;
        var END                 = datatosave.END;
        var DCRP_DETIL          = datatosave.DCRP_DETIL;
        var INDUSTRY_ID         = datatosave.INDUSTRY_ID;
        var INDUSTRY_NM         = datatosave.INDUSTRY_NM;
        var INDUSTRY_GRP_ID     = datatosave.INDUSTRY_GRP_ID;
        var INDUSTRY_GRP_NM     = datatosave.INDUSTRY_GRP_NM;
        var LONGITUDE           = datatosave.LONGITUDE;
        var LATITUDE            = datatosave.LATITUDE;

        var isitable            = [TGL_SAVE,ACCESS_GROUP,STORE_NM,ACCESS_ID,UUID,PLAYER_ID,PROVINCE_ID,PROVINCE_NM,CITY_ID,CITY_NAME,ALAMAT,PIC,TLP,FAX,STATUS,START,END,DCRP_DETIL,INDUSTRY_ID,INDUSTRY_NM,INDUSTRY_GRP_ID,INDUSTRY_GRP_NM,LONGITUDE,LATITUDE,STORE_ID]
        var query               = 'UPDATE Tbl_Stores SET TGL_SAVE=?,ACCESS_GROUP=?,STORE_NM=?,ACCESS_ID=?,UUID=?,PLAYER_ID=?,PROVINCE_ID=?,PROVINCE_NM=?,CITY_ID=?,CITY_NAME=?,ALAMAT=?,PIC=?,TLP=?,FAX=?,STATUS=?,START=?,END=?,DCRP_DETIL=?,INDUSTRY_ID =?,INDUSTRY_NM =?,INDUSTRY_GRP_ID =?,INDUSTRY_GRP_NM =?,LONGITUDE =?,LATITUDE =? WHERE STORE_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            console.log(result);
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Stores';
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
        },
        function (error)
        {
            console.log(error);
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var DeleteStores = function (datatodelete)
    {
        var deferred            = $q.defer();
        var STORE_ID            = datatodelete.STORE_ID;
        var STATUS              = 3;
        var isitable            = [STATUS,STORE_ID]
        var query               = 'UPDATE Tbl_Stores SET STATUS =? WHERE STORE_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Stores';
            dataoffline.PRIMARY_KEY = datatodelete.ID_LOCAL;
            dataoffline.TYPE_ACTION = 3;
            OfflineLiteFac.CreateOffline(dataoffline)
            .then(function(responsecreateoffline)
            {
                deferred.resolve(responsecreateoffline)
            },
            function(error)
            {
                deferred.reject(error);
            });
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    return{
            GetStores:GetStores,
            GetMaxStoreID:GetMaxStoreID,
            GetStoreByIDLocal:GetStoreByIDLocal,
            GetStoreByStoreID:GetStoreByStoreID,
            CreateStores:CreateStores,
            UpdateStores:UpdateStores,
            DeleteStores:DeleteStores    
        }
}])