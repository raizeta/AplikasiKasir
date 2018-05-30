angular.module('starter')
.factory('ProductStockLiteFac',['OfflineLiteFac','UtilService','$rootScope','$q','$cordovaSQLite',
function(OfflineLiteFac,UtilService,$rootScope,$q,$cordovaSQLite)
{
    var GetProductStocks = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Stocks WHERE PRODUCT_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.PRODUCT_ID])
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

    var GetProductStockByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Stocks WHERE ID_LOCAL = ?';
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

    var CreateProductStocks = function (datatosave,fromwhere)
    {
        var deferred            = $q.defer();
        var ID_SERVER           = datatosave.ID;
        var TGL_SAVE            = datatosave.TGL_SAVE;

        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var PRODUCT_ID          = datatosave.PRODUCT_ID;

        var INPUT_STOCK         = datatosave.INPUT_STOCK
        var LAST_STOCK          = datatosave.LAST_STOCK;
        var CURRENT_STOCK       = datatosave.CURRENT_STOCK;
        var SISA_STOCK          = datatosave.SISA_STOCK;

        var INPUT_DATE          = datatosave.INPUT_DATE;
        var INPUT_TIME          = datatosave.INPUT_TIME;
        var CURRENT_DATE        = datatosave.CURRENT_DATE;
        var CURRENT_TIME        = datatosave.CURRENT_TIME;


        var STATUS              = datatosave.STATUS;
        var DCRP_DETIL          = datatosave.DCRP_DETIL;

        var isitable            = [ID_SERVER,TGL_SAVE,ACCESS_GROUP,STORE_ID,PRODUCT_ID,LAST_STOCK,INPUT_STOCK,CURRENT_STOCK,SISA_STOCK,INPUT_DATE,INPUT_TIME,CURRENT_DATE,CURRENT_TIME,DCRP_DETIL,STATUS]
        var query               = 'INSERT INTO Tbl_Product_Stocks (ID_SERVER,TGL_SAVE,ACCESS_GROUP,STORE_ID,PRODUCT_ID,LAST_STOCK,INPUT_STOCK,CURRENT_STOCK,SISA_STOCK,INPUT_DATE,INPUT_TIME,CURRENT_DATE,CURRENT_TIME,DCRP_DETIL,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Product_Stocks';
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

    var GetProductHargas = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Hargas WHERE PRODUCT_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.PRODUCT_ID])
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

    var GetProductHargaByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Hargas WHERE ID_LOCAL = ?';
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

    var CreateProductHargas = function (datatosave,fromwhere)
    {
        var deferred            = $q.defer();
        var ID_SERVER           = datatosave.ID;
        var TGL_SAVE            = datatosave.TGL_SAVE;

        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var PRODUCT_ID          = datatosave.PRODUCT_ID;

        var HARGA_JUAL          = datatosave.HARGA_JUAL
        var PERIODE_TGL1        = datatosave.PERIODE_TGL1;
        var PERIODE_TGL2        = datatosave.PERIODE_TGL2;
        var START_TIME          = datatosave.START_TIME;


        var STATUS              = datatosave.STATUS;
        var DCRP_DETIL          = datatosave.DCRP_DETIL;

        var isitable            = [ID_SERVER,TGL_SAVE,ACCESS_GROUP,STORE_ID,PRODUCT_ID,HARGA_JUAL,PERIODE_TGL1,PERIODE_TGL2,START_TIME,DCRP_DETIL,STATUS]
        var query               = 'INSERT INTO Tbl_Product_Hargas (ID_SERVER,TGL_SAVE,ACCESS_GROUP,STORE_ID,PRODUCT_ID,HARGA_JUAL,PERIODE_TGL1,PERIODE_TGL2,START_TIME,DCRP_DETIL,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Product_Hargas';
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
            GetProductStocks:GetProductStocks,
            CreateProductStocks:CreateProductStocks,
            GetProductStockByIDLocal:GetProductStockByIDLocal,
            GetProductHargas:GetProductHargas,
            GetProductHargaByIDLocal:GetProductHargaByIDLocal,
            CreateProductHargas:CreateProductHargas
        }
}])