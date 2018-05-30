angular.module('starter')
.factory('ShopCartLiteFac',['OfflineLiteFac','$rootScope','$q','$cordovaSQLite','UtilService',
function(OfflineLiteFac,$rootScope,$q,$cordovaSQLite,UtilService)
{
    var GetShopCartByNomorTrans = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_ShopCart WHERE TRANS_ID = ? AND QTY_INCART > 0 GROUP BY PRODUCT_ID';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.TRANS_ID])
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

    var GetShopCartByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_ShopCart WHERE ID_LOCAL =?';
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

    var CreateShopCart = function (datatosave)
    {
        var deferred             = $q.defer();
        var TGL_SAVE             = datatosave.TGL_SAVE;
        var TRANS_DATE           = datatosave.TRANS_DATE;
        var ACCESS_GROUP         = datatosave.ACCESS_GROUP;
        var ACCESS_ID            = datatosave.ACCESS_ID;
        var GOLONGAN             = datatosave.GOLONGAN;
        var STORE_ID             = datatosave.STORE_ID;
        var TRANS_TYPE           = datatosave.TRANS_TYPE;
        var TRANS_ID             = datatosave.TRANS_ID;
        var PRODUCT_ID           = datatosave.PRODUCT_ID;
        var PRODUCT_NM           = datatosave.PRODUCT_NM;

        var PRODUCT_PROVIDER     = datatosave.PRODUCT_PROVIDER;
        var PRODUCT_PROVIDER_NO  = datatosave.PRODUCT_PROVIDER_NO;
        var PRODUCT_PROVIDER_NM  = datatosave.PRODUCT_PROVIDER_NM;
        var UNIT_ID              = datatosave.UNIT_ID;
        var UNIT_NM              = datatosave.UNIT_NM;
        var HARGA_JUAL           = datatosave.HARGA_JUAL;
        var HPP                  = datatosave.HPP;
        var PPN                  = datatosave.PPN;
        var DISCOUNT             = datatosave.DISCOUNT;
        var QTY_INCART           = datatosave.QTY_INCART;
        var PROMO                = datatosave.PROMO;
        var STATUS               = datatosave.STATUS;

        var isitable             = [TGL_SAVE,TRANS_DATE,ACCESS_GROUP,ACCESS_ID,GOLONGAN,STORE_ID,TRANS_TYPE,TRANS_ID,PRODUCT_ID,PRODUCT_NM,PRODUCT_PROVIDER,PRODUCT_PROVIDER_NO,PRODUCT_PROVIDER_NM,UNIT_ID,UNIT_NM,HARGA_JUAL,HPP,PPN,DISCOUNT,QTY_INCART,PROMO,STATUS];
        var query                = 'INSERT INTO Tbl_ShopCart (TGL_SAVE,TRANS_DATE,ACCESS_GROUP,ACCESS_ID,GOLONGAN,STORE_ID,TRANS_TYPE,TRANS_ID,PRODUCT_ID,PRODUCT_NM,PRODUCT_PROVIDER,PRODUCT_PROVIDER_NO,PRODUCT_PROVIDER_NM,UNIT_ID,UNIT_NM,HARGA_JUAL,HPP,PPN,DISCOUNT,QTY_INCART,PROMO,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
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

    var UpdateShopCartQty = function (datatosave)
    {
        var deferred            = $q.defer();
        var TRANS_ID            = datatosave.TRANS_ID;
        var PRODUCT_ID          = datatosave.PRODUCT_ID;
        var QTY_INCART          = datatosave.QTY_INCART;
        var isitable            = [QTY_INCART,TRANS_ID,PRODUCT_ID];
        var queryinsertshopcart  = 'UPDATE Tbl_ShopCart SET QTY_INCART = ? WHERE TRANS_ID = ? AND PRODUCT_ID =?';
        $cordovaSQLite.execute($rootScope.db,queryinsertshopcart,isitable)
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

    var UpdateStatusPembelian = function (datatosave)
    {
        var deferred            = $q.defer();
        var STATUS              = datatosave.STATUS;
        var TRANS_ID            = datatosave.TRANS_ID;
        var PRODUCT_ID          = datatosave.PRODUCT_ID;
        var isitable            = [STATUS,TRANS_ID,PRODUCT_ID];
        var queryinsertshopcart = 'UPDATE Tbl_ShopCart SET STATUS = ? WHERE TRANS_ID = ? AND PRODUCT_ID =?';
        $cordovaSQLite.execute($rootScope.db,queryinsertshopcart,isitable)
        .then(function(result) 
        {
            GetShopCartByItemAndNoTrans(PRODUCT_ID,TRANS_ID)
            .then(function(response)
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_ShopCart';
                dataoffline.PRIMARY_KEY = response[0].ID_LOCAL;
                dataoffline.TYPE_ACTION = 1;
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

    var UpdateShopCartStatusWhenInsert = function (datatosave)
    {
        var deferred            = $q.defer();
        var TRANS_ID            = datatosave.TRANS_ID;
        var PRODUCT_ID          = datatosave.PRODUCT_ID;
        var IS_ONSERVER         = datatosave.IS_ONSERVER;

        var isitable            = [IS_ONSERVER,TRANS_ID,PRODUCT_ID];
        var query               = 'UPDATE Tbl_ShopCart SET IS_ONSERVER = ? WHERE TRANS_ID = ? AND PRODUCT_ID =?';
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

    var DeleteShopCartByNoTransAndItemId = function (datatodelete)
    {
        var deferred            = $q.defer();
        var TRANS_ID            = datatodelete.TRANS_ID;
        var PRODUCT_ID          = datatodelete.PRODUCT_ID;
        var isitable            = [TRANS_ID,PRODUCT_ID];
        var query               = 'DELETE FROM Tbl_ShopCart WHERE TRANS_ID = ? AND PRODUCT_ID =?';
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

    var DeleteItemFromShopCartByNoTrans = function (TRANS_ID)
    {
        var deferred            = $q.defer();
        var query               = 'DELETE FROM Tbl_ShopCart WHERE TRANS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[TRANS_ID])
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
    
    var GetShopCartByItemAndNoTrans = function (PRODUCT_ID,TRANS_ID)
    {
        var deferred = $q.defer();
        var query = 'SELECT * FROM Tbl_ShopCart WHERE PRODUCT_ID = ? AND TRANS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[PRODUCT_ID,TRANS_ID])
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

    var GetShopCartPPOBByIDLocal = function (ID_LOCAL)
    {
        var deferred = $q.defer();
        var query = 'SELECT * FROM Tbl_ShopCartPPOB WHERE ID_LOCAL = ?';
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

    var CreateShopCartPPOB = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var TRANS_DATE      = datatosave.TRANS_DATE;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var ACCESS_ID       = datatosave.ACCESS_ID;
        var STORE_ID        = datatosave.STORE_ID;
        var TRANS_ID        = datatosave.TRANS_ID;
        var PEMBAYARAN      = datatosave.PEMBAYARAN;
        var MSISDN          = datatosave.MSISDN;
        var ID_PELANGGAN    = datatosave.ID_PELANGGAN;
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
        var STATUS_BELI     = datatosave.STATUS_BELI;

        var isitable        = [TGL_SAVE,TRANS_DATE,ACCESS_GROUP,ACCESS_ID,STORE_ID,TRANS_ID,PEMBAYARAN,MSISDN,ID_PELANGGAN,CODE,DENOM,HARGA_JUAL,ID_CODE,ID_PRODUK,KELOMPOK,KTG_ID,KTG_NM,NAME,TYPE_NM,STATUS_BELI]
        var query           = 'INSERT INTO Tbl_ShopCartPPOB (TGL_SAVE,TRANS_DATE,ACCESS_GROUP,ACCESS_ID,STORE_ID,TRANS_ID,PEMBAYARAN,MSISDN,ID_PELANGGAN,CODE,DENOM,HARGA_JUAL,ID_CODE,ID_PRODUK,KELOMPOK,KTG_ID,KTG_NM,NAME,TYPE_NM,STATUS_BELI) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_ShopCartPPOB';
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

    var UpdateShopCartPPOBStatus = function (datatoupdate)
    {
        var deferred            = $q.defer();
        var STATUS_BELI         = datatoupdate.STATUS_BELI;
        var ID_PRODUK           = datatoupdate.PRODUCT_ID;
        var TRANS_ID            = datatoupdate.TRANS_ID;

        var isitable            = [STATUS_BELI,ID_PRODUK,TRANS_ID];
        var query               = 'UPDATE Tbl_ShopCartPPOB SET STATUS_BELI = ? WHERE ID_PRODUK = ? AND TRANS_ID =?';
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

    var CreateShopCartRefund = function (datatosave,fromwhere)
    {
        var deferred             = $q.defer();
        var TGL_SAVE             = datatosave.TGL_SAVE;
        var TRANS_DATE           = datatosave.TRANS_DATE;
        var ACCESS_GROUP         = datatosave.ACCESS_GROUP;
        var ACCESS_ID            = datatosave.ACCESS_ID;
        var GOLONGAN             = datatosave.GOLONGAN;
        var STORE_ID             = datatosave.STORE_ID;
        var TRANS_TYPE           = datatosave.TRANS_TYPE;
        var TRANS_ID             = datatosave.TRANS_ID;
        var PRODUCT_ID           = datatosave.PRODUCT_ID;
        var PRODUCT_NM           = datatosave.PRODUCT_NM;

        var PRODUCT_PROVIDER     = datatosave.PRODUCT_PROVIDER;
        var PRODUCT_PROVIDER_NO  = datatosave.PRODUCT_PROVIDER_NO;
        var PRODUCT_PROVIDER_NM  = datatosave.PRODUCT_PROVIDER_NM;
        var UNIT_ID              = datatosave.UNIT_ID;
        var UNIT_NM              = datatosave.UNIT_NM;
        var HARGA_JUAL           = datatosave.HARGA_JUAL;
        var HPP                  = datatosave.HPP;
        var PPN                  = datatosave.PPN;
        var DISCOUNT             = datatosave.DISCOUNT;
        var QTY_INCART           = datatosave.QTY_INCART;
        var PROMO                = datatosave.PROMO;
        var STATUS               = datatosave.STATUS;

        var isitable             = [TGL_SAVE,TRANS_DATE,ACCESS_GROUP,ACCESS_ID,GOLONGAN,STORE_ID,TRANS_TYPE,TRANS_ID,PRODUCT_ID,PRODUCT_NM,PRODUCT_PROVIDER,PRODUCT_PROVIDER_NO,PRODUCT_PROVIDER_NM,UNIT_ID,UNIT_NM,HARGA_JUAL,HPP,PPN,DISCOUNT,QTY_INCART,PROMO,STATUS];
        var query                = 'INSERT INTO Tbl_ShopCartRefund (TGL_SAVE,TRANS_DATE,ACCESS_GROUP,ACCESS_ID,GOLONGAN,STORE_ID,TRANS_TYPE,TRANS_ID,PRODUCT_ID,PRODUCT_NM,PRODUCT_PROVIDER,PRODUCT_PROVIDER_NO,PRODUCT_PROVIDER_NM,UNIT_ID,UNIT_NM,HARGA_JUAL,HPP,PPN,DISCOUNT,QTY_INCART,PROMO,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_ShopCartRefund';
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

    var GetShopCartRefundByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_ShopCartRefund WHERE ID_LOCAL =?';
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

    return{
            GetShopCartByNomorTrans:GetShopCartByNomorTrans,
            GetShopCartByIDLocal:GetShopCartByIDLocal,
            CreateShopCart:CreateShopCart,
            UpdateShopCartQty:UpdateShopCartQty,
            UpdateStatusPembelian:UpdateStatusPembelian,
            DeleteShopCartByNoTransAndItemId:DeleteShopCartByNoTransAndItemId,
            DeleteItemFromShopCartByNoTrans:DeleteItemFromShopCartByNoTrans,
            UpdateShopCartStatusWhenInsert:UpdateShopCartStatusWhenInsert,
            GetShopCartByItemAndNoTrans:GetShopCartByItemAndNoTrans,
            GetShopCartPPOBByIDLocal:GetShopCartPPOBByIDLocal,
            CreateShopCartPPOB:CreateShopCartPPOB,
            UpdateShopCartPPOBStatus:UpdateShopCartPPOBStatus,
            CreateShopCartRefund:CreateShopCartRefund,
            GetShopCartRefundByIDLocal:GetShopCartRefundByIDLocal
        }
}])