angular.module('starter')
.factory('PPOBLiteFac',['$rootScope','$q','$cordovaSQLite','UtilService','OfflineLiteFac',
function($rootScope,$q,$cordovaSQLite,UtilService,OfflineLiteFac)
{
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

    var GetProductsByKelompokNameAndKategoriName= function (parameters)
    {
        var deferred    = $q.defer();
        // var stringtosearch  = parameters.KTG_NM;
        // var query           = "SELECT * FROM Tbl_PPOBProducts WHERE KELOMPOK=? AND KTG_NM LIKE '%" + stringtosearch + "%' ";
        var query           = "SELECT * FROM Tbl_PPOBProducts WHERE KELOMPOK=? AND KTG_NM = ?";
        $cordovaSQLite.execute($rootScope.db,query,[parameters.KELOMPOK,parameters.KTG_NM])
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

    
    
    return{
            GetGroups:GetGroups,
            CreateGroups:CreateGroups,
            GetKategoris:GetKategoris,
            GetKategorisByGroupID:GetKategorisByGroupID,
            CreateKategoris:CreateKategoris,
            GetProducts:GetProducts,
            GetProductsByKategoriID:GetProductsByKategoriID,
            GetProductsByKelompokNameAndKategoriName:GetProductsByKelompokNameAndKategoriName,
            CreateProducts:CreateProducts
        }
}])