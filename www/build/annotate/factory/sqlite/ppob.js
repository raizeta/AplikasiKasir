angular.module('starter')
.factory('PPOBLiteFac',['$rootScope','$q','$cordovaSQLite','UtilService','OfflineLiteFac',
function($rootScope,$q,$cordovaSQLite,UtilService,OfflineLiteFac)
{
    var GetHeaders = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBHeader WHERE STATUS = 1';
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

    var SetHeaders = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var HEADER_ID       = datatosave.HEADER_ID;
        var HEADER_NM       = datatosave.HEADER_NM;
        var HEADER_DCRP     = datatosave.HEADER_DCRP;
        var STATUS          = datatosave.STATUS;

        var isitable        = [HEADER_ID,HEADER_NM,HEADER_DCRP,STATUS]
        var query           = 'INSERT INTO Tbl_PPOBHeader (HEADER_ID,HEADER_NM,HEADER_DCRP,STATUS) VALUES (?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_PPOBHeader';
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

    var GetGroups = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBGroups WHERE STATUS = 1';
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

    var CreateGroups = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var KELOMPOK_ID     = datatosave.KELOMPOK_ID;
        var KELOMPOK        = datatosave.KELOMPOK;
        var STATUS          = datatosave.STATUS;

        var isitable        = [KELOMPOK_ID,KELOMPOK,STATUS]
        var query           = 'INSERT INTO Tbl_PPOBGroups (KELOMPOK_ID,KELOMPOK,STATUS) VALUES (?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_PPOBGroups';
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

    var GetKategoris = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBKategoris WHERE STATUS = 1';
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

    var GetKategorisByGroupID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBKategoris WHERE KELOMPOK = ? AND STATUS = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.KELOMPOK,parameters.STATUS])
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

    var CreateKategoris = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var KELOMPOK_ID     = datatosave.KELOMPOK_ID;
        var KELOMPOK        = datatosave.KELOMPOK;
        var KTG_ID          = datatosave.KTG_ID;
        var KTG_NM          = datatosave.KTG_NM;
        var KETERANGAN      = datatosave.KETERANGAN;
        var STATUS          = datatosave.STATUS;

        var isitable        = [KELOMPOK_ID,KELOMPOK,KTG_ID,KTG_NM,KETERANGAN,STATUS]
        var query           = 'INSERT INTO Tbl_PPOBKategoris (KELOMPOK_ID,KELOMPOK,KTG_ID,KTG_NM,KETERANGAN,STATUS) VALUES (?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_PPOBKategoris';
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

    var GetProducts = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBProducts';
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

    var GetProductsByKategoriID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBProducts WHERE KTG_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.KTG_ID])
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

    var CreateProducts = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var CODE            = datatosave.CODE;
        var DENOM           = datatosave.DENOM;
        var HARGA_JUAL      = datatosave.HARGA_JUAL;
        var ID_CODE         = datatosave.ID_CODE;
        var ID_PRODUK       = datatosave.ID_PRODUK;
        var KELOMPOK        = datatosave.KELOMPOK;
        var KTG_ID          = datatosave.KTG_ID;
        var KTG_NM          = datatosave.KTG_NM;
        var NAME            = datatosave.NAME;
        var TYPE_NM         = datatosave.TYPE_NM;

        var isitable        = [CODE,DENOM,HARGA_JUAL,ID_CODE,ID_PRODUK,KELOMPOK,KTG_ID,KTG_NM,NAME,TYPE_NM]
        var query           = 'INSERT INTO Tbl_PPOBProducts (CODE,DENOM,HARGA_JUAL,ID_CODE,ID_PRODUK,KELOMPOK,KTG_ID,KTG_NM,NAME,TYPE_NM) VALUES (?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_PPOBProducts';
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

    var GetDetails = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBDetail WHERE STATUS = 1';
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

    var GetDetailsByHeaderID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBDetail WHERE HEADER_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.HEADER_ID])
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

    var SetDetails = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var HEADER_ID       = datatosave.HEADER_ID;
        var HEADER_NM       = datatosave.HEADER_NM;
        var PROVIDER_ID     = datatosave.PROVIDER_ID;
        var PROVIDER_NM     = datatosave.PROVIDER_NM;
        var DETAIL_ID       = datatosave.DETAIL_ID;
        var DETAIL_NM       = datatosave.DETAIL_NM;
        var DETAIL_DCRP     = datatosave.DETAIL_DCRP;
        var STATUS          = datatosave.STATUS;


        var isitable        = [HEADER_ID,HEADER_NM,PROVIDER_ID,PROVIDER_NM,DETAIL_ID,DETAIL_NM,DETAIL_DCRP,STATUS]
        var query           = 'INSERT INTO Tbl_PPOBDetail (HEADER_ID,HEADER_NM,PROVIDER_ID,PROVIDER_NM,DETAIL_ID,DETAIL_NM,DETAIL_DCRP,STATUS) VALUES (?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_PPOBDetail';
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


    var GetNominals = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBNominals WHERE STATUS = 1';
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

    var GetNominalsByDetailID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_PPOBNominals WHERE DETAIL_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.DETAIL_ID])
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

    var SetNominals = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var ID_SERVER       = datatosave.ID_SERVER;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var DETAIL_ID       = datatosave.DETAIL_ID;
        var KODE            = datatosave.KODE;
        var KETERANGAN      = datatosave.KETERANGAN;
        var NOMINAL         = datatosave.NOMINAL;
        var HARGA_KG        = datatosave.HARGA_KG;
        var HARGA_JUAL      = datatosave.HARGA_JUAL;
        var STATUS          = datatosave.STATUS;


        var isitable        = [ID_SERVER,ACCESS_GROUP,STORE_ID,DETAIL_ID,KODE,KETERANGAN,NOMINAL,HARGA_KG,HARGA_JUAL,STATUS]
        var query           = 'INSERT INTO Tbl_PPOBNominals (ID_SERVER,ACCESS_GROUP,STORE_ID,DETAIL_ID,KODE,KETERANGAN,NOMINAL,HARGA_KG,HARGA_JUAL,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_PPOBNominals';
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
            GetHeaders:GetHeaders,
            SetHeaders:SetHeaders,
            GetGroups:GetGroups,
            CreateGroups:CreateGroups,
            GetKategoris:GetKategoris,
            GetKategorisByGroupID:GetKategorisByGroupID,
            CreateKategoris:CreateKategoris,
            GetProducts:GetProducts,
            GetProductsByKategoriID:GetProductsByKategoriID,
            CreateProducts:CreateProducts,
            GetDetails:GetDetails,
            GetDetailsByHeaderID:GetDetailsByHeaderID,
            SetDetails:SetDetails,
            GetNominals:GetNominals,
            GetNominalsByDetailID:GetNominalsByDetailID,
            SetNominals:SetNominals
        }
}])