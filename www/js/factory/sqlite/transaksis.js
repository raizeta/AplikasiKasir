angular.module('starter')
.factory('TransaksisLiteFac',['OfflineLiteFac','$rootScope','$q','$cordovaSQLite','UtilService',
function(OfflineLiteFac,$rootScope,$q,$cordovaSQLite,UtilService)
{
    var GetTransaksiHeaders = function (parameter)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Transaksis WHERE TGL_SAVE = ? AND STORE_ID = ? GROUP BY TRANS_ID';
        $cordovaSQLite.execute($rootScope.db,query,[parameter.TGL_SAVE,parameter.STORE_ID])
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

    var GetTransaksiHeadersByRefundOrNotRefund = function (parameter)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Transaksis WHERE TGL_SAVE = ? AND STORE_ID = ? AND DCRP_DETIL = ? GROUP BY TRANS_ID';
        $cordovaSQLite.execute($rootScope.db,query,[parameter.TGL_SAVE,parameter.STORE_ID,parameter.DCRP_DETIL])
        .then(function(result) 
        {
            console.log(result);
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

    var GetMaxTransaksiHeaders = function (parameter)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(TRANS_ID)AS MAX_TRANS_ID FROM Tbl_Transaksis WHERE TGL_SAVE = ? AND STORE_ID =? AND ACCESS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameter.TGL_SAVE,parameter.STORE_ID,parameter.ACCESS_ID])
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


    var GetTransaksiHeaderByTransID = function (TRANS_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Transaksis WHERE TRANS_ID = ? AND STATUS = 1';
        $cordovaSQLite.execute($rootScope.db,query,[TRANS_ID])
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

    var SearchStringInTransID = function (stringtosearch)
    {
        var deferred    = $q.defer();
        var query       = "SELECT * FROM Tbl_Transaksis WHERE DCRP_DETIL='KASIR' AND TRANS_ID LIKE '%" + stringtosearch + "%' ";
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

    var GetTransaksiHeaderByTransIDStatusNol = function (TRANS_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Transaksis WHERE TRANS_ID = ? AND STATUS = 0';
        $cordovaSQLite.execute($rootScope.db,query,[TRANS_ID])
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

    var CreateTransaksiHeaders = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var ACCESS_ID       = datatosave.ACCESS_ID;
        var CASHIER_NAME    = datatosave.CASHIER_NAME;

        var OPENCLOSE_ID    = datatosave.OPENCLOSE_ID;
        var TRANS_ID        = datatosave.TRANS_ID;
        var SPLIT_TRANS_ID  = datatosave.SPLIT_TRANS_ID;
        var TRANS_DATE      = datatosave.TRANS_DATE;
        var TOTAL_PRODUCT   = datatosave.TOTAL_PRODUCT;

        var SUB_TOTAL_HARGA = datatosave.SUB_TOTAL_HARGA;
        var PPN             = datatosave.PPN;
        var TOTAL_HARGA     = datatosave.TOTAL_HARGA;
        var DO_KEM_TYPE     = datatosave.DO_KEM_TYPE;
        var DO_KEM          = datatosave.DO_KEM;

        var TYPE_PAY_ID     = datatosave.TYPE_PAY_ID;
        var TYPE_PAY_NM     = datatosave.TYPE_PAY_NM;
        
        var BANK_ID         = datatosave.BANK_ID;
        var BANK_NM         = datatosave.BANK_NM;
        var MERCHANT_ID     = datatosave.MERCHANT_ID;
        var MERCHANT_NM     = datatosave.MERCHANT_NM;
        var MERCHANT_NO     = datatosave.MERCHANT_NO;

        var CONSUMER_ID     = datatosave.CONSUMER_ID;
        var CONSUMER_NM     = datatosave.CONSUMER_NM;
        var CONSUMER_EMAIL  = datatosave.CONSUMER_EMAIL;
        var CONSUMER_PHONE  = datatosave.CONSUMER_PHONE;

        var STATUS          = datatosave.STATUS;
        var DCRP_DETIL      = datatosave.DCRP_DETIL;
        var TRANS_REF       = datatosave.TRANS_REF;
        var TRANS_TYPE      = datatosave.TRANS_TYPE;

        var isitable        = [TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,CASHIER_NAME,OPENCLOSE_ID,TRANS_ID,SPLIT_TRANS_ID,TRANS_DATE,TOTAL_PRODUCT,SUB_TOTAL_HARGA,PPN,TOTAL_HARGA,DO_KEM_TYPE,DO_KEM,TYPE_PAY_ID,TYPE_PAY_NM,BANK_ID,BANK_NM,MERCHANT_ID,MERCHANT_NM,MERCHANT_NO,CONSUMER_ID,CONSUMER_NM,CONSUMER_EMAIL,CONSUMER_PHONE,STATUS,DCRP_DETIL,TRANS_REF,TRANS_TYPE]
        var query           = 'INSERT INTO Tbl_Transaksis (TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,CASHIER_NAME,OPENCLOSE_ID,TRANS_ID,SPLIT_TRANS_ID,TRANS_DATE,TOTAL_PRODUCT,SUB_TOTAL_HARGA,PPN,TOTAL_HARGA,DO_KEM_TYPE,DO_KEM,TYPE_PAY_ID,TYPE_PAY_NM,BANK_ID,BANK_NM,MERCHANT_ID,MERCHANT_NM,MERCHANT_NO,CONSUMER_ID,CONSUMER_NM,CONSUMER_EMAIL,CONSUMER_PHONE,STATUS,DCRP_DETIL,TRANS_REF,TRANS_TYPE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER' && STATUS == 1)
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Transaksis';
                dataoffline.PRIMARY_KEY = datatosave.TRANS_ID;
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

    var UpdateTransaksiHeaders = function (datatosave)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var ACCESS_ID       = datatosave.ACCESS_ID;
        var CASHIER_NAME    = datatosave.CASHIER_NAME;
        var TRANS_ID        = datatosave.TRANS_ID;
        var SPLIT_TRANS_ID  = datatosave.SPLIT_TRANS_ID;
        var TRANS_DATE      = datatosave.TRANS_DATE;
        var TOTAL_PRODUCT   = datatosave.TOTAL_PRODUCT;

        var SUB_TOTAL_HARGA = datatosave.SUB_TOTAL_HARGA;
        var PPN             = datatosave.PPN;
        var TOTAL_HARGA     = datatosave.TOTAL_HARGA;
        var DO_KEM_TYPE     = datatosave.DO_KEM_TYPE;
        var DO_KEM          = datatosave.DO_KEM;

        var TYPE_PAY_ID     = datatosave.TYPE_PAY_ID;
        var TYPE_PAY_NM     = datatosave.TYPE_PAY_NM;
        var BANK_ID         = datatosave.BANK_ID;
        var BANK_NM         = datatosave.BANK_NM;

        var MERCHANT_ID     = datatosave.MERCHANT_ID;
        var MERCHANT_NM     = datatosave.MERCHANT_NM;
        var MERCHANT_NO     = datatosave.MERCHANT_NO;

        var CONSUMER_ID     = datatosave.CONSUMER_ID;
        var CONSUMER_NM     = datatosave.CONSUMER_NM;
        var CONSUMER_EMAIL  = datatosave.CONSUMER_EMAIL;
        var CONSUMER_PHONE  = datatosave.CONSUMER_PHONE;

        var STATUS          = datatosave.STATUS;
        var DCRP_DETIL      = datatosave.DCRP_DETIL;
        var TRANS_REF       = datatosave.TRANS_REF;
        var TRANS_TYPE      = datatosave.TRANS_TYPE;

        var isitable        = [TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,CASHIER_NAME,TRANS_DATE,TOTAL_PRODUCT,SUB_TOTAL_HARGA,PPN,TOTAL_HARGA,DO_KEM_TYPE,DO_KEM,TYPE_PAY_ID,TYPE_PAY_NM,BANK_ID,BANK_NM,MERCHANT_ID,MERCHANT_NM,MERCHANT_NO,CONSUMER_ID,CONSUMER_NM,CONSUMER_EMAIL,CONSUMER_PHONE,STATUS,DCRP_DETIL,TRANS_REF,TRANS_TYPE,TRANS_ID]
        var query           = 'UPDATE Tbl_Transaksis SET TGL_SAVE=?,ACCESS_GROUP=?,STORE_ID=?,ACCESS_ID=?,CASHIER_NAME=?,TRANS_DATE=?,TOTAL_PRODUCT=?,SUB_TOTAL_HARGA=?,DO_KEM_TYPE =?,DO_KEM=?,PPN=?,TOTAL_HARGA=?,TYPE_PAY_ID=?,TYPE_PAY_NM=?,BANK_ID=?,BANK_NM=?,MERCHANT_ID=?,MERCHANT_NM=?,MERCHANT_NO=?,CONSUMER_ID=?,CONSUMER_NM=?,CONSUMER_EMAIL=?,CONSUMER_PHONE=?,STATUS=?,DCRP_DETIL=?,TRANS_REF=?,TRANS_TYPE=? WHERE TRANS_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(STATUS == 1)
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Transaksis';
                dataoffline.PRIMARY_KEY = datatosave.TRANS_ID;
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

    var UpdateTransaksiRef  = function (datatosave)
    {
        var deferred        = $q.defer();
        var TRANS_ID        = datatosave.TRANS_ID;
        var TRANS_REF       = datatosave.TRANS_REF;

        var isitable        = [TRANS_REF,TRANS_ID]
        var query           = 'UPDATE Tbl_Transaksis SET TRANS_REF=? WHERE TRANS_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Transaksis';
            dataoffline.PRIMARY_KEY = datatosave.TRANS_ID;
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
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var DeleteTransaksiHeadersByTransID = function (TRANS_ID)
    {
        var deferred            = $q.defer();
        var query               = 'DELETE FROM Tbl_Transaksis WHERE TRANS_ID = ?';
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

    return{
            GetTransaksiHeaders:GetTransaksiHeaders,
            GetTransaksiHeadersByRefundOrNotRefund:GetTransaksiHeadersByRefundOrNotRefund,
            GetMaxTransaksiHeaders:GetMaxTransaksiHeaders,
            GetTransaksiHeaderByTransID:GetTransaksiHeaderByTransID,
            SearchStringInTransID:SearchStringInTransID,
            GetTransaksiHeaderByTransIDStatusNol:GetTransaksiHeaderByTransIDStatusNol,
            CreateTransaksiHeaders:CreateTransaksiHeaders,
            UpdateTransaksiHeaders:UpdateTransaksiHeaders,
            UpdateTransaksiRef:UpdateTransaksiRef,
            DeleteTransaksiHeadersByTransID:DeleteTransaksiHeadersByTransID
        }
}])