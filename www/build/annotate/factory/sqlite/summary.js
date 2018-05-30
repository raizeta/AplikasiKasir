angular.module('starter')
.factory('SummaryLiteFac',['$rootScope','$q','$cordovaSQLite','UtilService',
function($rootScope,$q,$cordovaSQLite,UtilService)
{
    var CountTransaksiComplete = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT count(id) AS jlhcomplete FROM Tbl_Transaksis WHERE STORE_ID=? AND STATUS = ? AND TGL_SAVE = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STORE_ID,parameters.STATUS,parameters.TGL_SAVE])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var SumTransHeaderComplete = function (ACCESS_UNIX,OUTLET_ID,STATUS_BUY,TRANS_DATE)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT sum(TOTAL_HARGA) AS TOTAL FROM Tbl_CustBuyTrans WHERE ACCESS_UNIX = ? AND OUTLET_ID = ? AND STATUS_BUY = ? AND TRANS_DATE = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[ACCESS_UNIX,OUTLET_ID,STATUS_BUY,TRANS_DATE])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var SumTransHeaderCompletePerShift = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT sum(TOTAL_HARGA) AS TOTALPENJUALAN,sum(CASE WHEN DO_KEM_TYPE = 1 THEN DO_KEM ELSE 0 END)AS TOTALDONASI FROM Tbl_Transaksis WHERE OPENCLOSE_ID=? AND STORE_ID = ? AND ACCESS_ID = ? AND STATUS = ? AND TGL_SAVE = ? GROUP BY DCRP_DETIL';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.OPENCLOSE_ID,parameters.STORE_ID,parameters.ACCESS_ID,parameters.STATUS,parameters.TGL_SAVE])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var JoinTransWithShopCart = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT * FROM Tbl_Transaksis JOIN Tbl_ShopCart ON  Tbl_Transaksis.TRANS_ID = Tbl_ShopCart.TRANS_ID WHERE Tbl_Transaksis.STORE_ID=? AND Tbl_Transaksis.STATUS = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STORE_ID,parameters.STATUS])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var BayarCash = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = 'SELECT * FROM Tbl_Transaksis WHERE STATUS = ? AND TGL_SAVE = ? AND TYPE_PAY_ID = ? AND STORE_ID = ?';
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STATUS,parameters.TGL_SAVE,parameters.TYPE_PAY_ID,parameters.STORE_ID])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var JumlahTransPerMethodPembayaran = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = "SELECT  COUNT(case TYPE_PAY_ID when 0 then 1 else null end) AS 'TUNAI',COUNT(case TYPE_PAY_ID when 2 then 1 else null end) AS 'EDC',COUNT(case TYPE_PAY_ID when 3 then 1 else null end) AS 'ACC' FROM Tbl_Transaksis WHERE STATUS = ? AND TGL_SAVE = ? AND STORE_ID = ?";
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STATUS,parameters.TGL_SAVE,parameters.STORE_ID])
        .then(function(result) 
        {
            
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response[0]);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var TotalRupiahPerMethodPembayaran = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = "SELECT  SUM(case TYPE_PAY_ID when 0 then TOTAL_HARGA else 0 end) AS 'TUNAI',SUM(case TYPE_PAY_ID when 2 then TOTAL_HARGA else 0 end) AS 'EDC',SUM(case TYPE_PAY_ID when 3 then TOTAL_HARGA else 0 end) AS 'ACC' FROM Tbl_Transaksis WHERE STATUS = ? AND TGL_SAVE = ? AND STORE_ID = ?";
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STATUS,parameters.TGL_SAVE,parameters.STORE_ID])
        .then(function(result) 
        {
            
            var response = UtilService.SqliteToArray(result);
            deferred.resolve(response[0]);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var SumItemProductAllTrans = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = "SELECT PRODUCT_NM,SUM(QTY_INCART) AS 'TOTAL' FROM Tbl_ShopCart WHERE STATUS = ? AND TGL_SAVE = ? AND STORE_ID = ? GROUP BY PRODUCT_ID ORDER BY TOTAL DESC";
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STATUS,parameters.TGL_SAVE,parameters.STORE_ID])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            var hasil = {};
            hasil.label = [];
            hasil.value = []; 
            angular.forEach(response,function(value,key)
            {
                hasil.label.push(value.PRODUCT_NM);
                hasil.value.push(value.TOTAL);
            })
            deferred.resolve(hasil)
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var SumItemProductWithHargaAllTrans = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = "SELECT PRODUCT_NM,SUM(QTY_INCART * HARGA_JUAL) AS 'TOTAL' FROM Tbl_ShopCart WHERE STATUS = ? AND TGL_SAVE = ? AND STORE_ID = ? GROUP BY PRODUCT_ID ORDER BY TOTAL DESC";
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STATUS,parameters.TGL_SAVE,parameters.STORE_ID])
        .then(function(result) 
        {
            var response    = UtilService.SqliteToArray(result);
            var hasil       = {};
            hasil.label     = [];
            hasil.value     = []; 
            angular.forEach(response,function(value,key)
            {
                hasil.label.push(value.PRODUCT_NM);
                hasil.value.push(value.TOTAL);
            })
            deferred.resolve(hasil)
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var TopProductAllTrans = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = "SELECT * FROM (SELECT PRODUCT_NM,SUM(QTY_INCART) AS 'TOTAL' FROM Tbl_ShopCart WHERE STATUS = ? AND TGL_SAVE = ? AND STORE_ID = ? GROUP BY PRODUCT_ID ORDER BY TOTAL DESC) LIMIT 5";
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STATUS,parameters.TGL_SAVE,parameters.STORE_ID])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            var hasil = {};
            hasil.label = [];
            hasil.value = []; 
            angular.forEach(response,function(value,key)
            {
                hasil.label.push(value.PRODUCT_NM);
                hasil.value.push(value.TOTAL);
            })
            deferred.resolve(hasil)
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var TopProductHargaAllTrans = function (parameters)
    {
        var deferred            = $q.defer();
        var qcounttransaksi     = "SELECT * FROM (SELECT PRODUCT_NM,SUM(QTY_INCART * HARGA_JUAL) AS 'TOTAL' FROM Tbl_ShopCart WHERE STATUS = ? AND TGL_SAVE = ? AND STORE_ID = ? GROUP BY PRODUCT_ID ORDER BY TOTAL DESC) LIMIT 5";
        $cordovaSQLite.execute($rootScope.db,qcounttransaksi,[parameters.STATUS,parameters.TGL_SAVE,parameters.STORE_ID])
        .then(function(result) 
        {
            var response = UtilService.SqliteToArray(result);
            var hasil = {};
            hasil.label = [];
            hasil.value = []; 
            angular.forEach(response,function(value,key)
            {
                hasil.label.push(value.PRODUCT_NM);
                hasil.value.push(value.TOTAL);
            })
            deferred.resolve(hasil)
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }


    return{
            CountTransaksiComplete:CountTransaksiComplete,
            SumTransHeaderComplete:SumTransHeaderComplete,
            SumTransHeaderCompletePerShift:SumTransHeaderCompletePerShift,
            JoinTransWithShopCart:JoinTransWithShopCart,
            BayarCash:BayarCash,
            JumlahTransPerMethodPembayaran:JumlahTransPerMethodPembayaran,
            TotalRupiahPerMethodPembayaran:TotalRupiahPerMethodPembayaran,
            SumItemProductAllTrans:SumItemProductAllTrans,
            SumItemProductWithHargaAllTrans:SumItemProductWithHargaAllTrans,
            TopProductAllTrans:TopProductAllTrans,
            TopProductHargaAllTrans:TopProductHargaAllTrans
        }
}])