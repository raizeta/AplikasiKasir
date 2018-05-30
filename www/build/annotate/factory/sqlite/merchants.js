angular.module('starter')
.factory('MerchantsLiteFac',['OfflineLiteFac','UtilService','$rootScope','$q','$cordovaSQLite',
function(OfflineLiteFac,UtilService,$rootScope,$q,$cordovaSQLite)
{
    var GetMerchants = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Merchants WHERE STORE_ID = ? AND STATUS = 1';
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

    var GetMerchantByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Merchants WHERE ID_LOCAL = ?';
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

    var GetMaxMerchantID = function (STORE_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(MERCHANT_ID)AS MAX_MERCHANT_ID FROM Tbl_Merchants WHERE STORE_ID =?';
        $cordovaSQLite.execute($rootScope.db,query,[STORE_ID])
        .then(function(result) 
        {
            if(result.rows.length > 0 && result.rows.item(0)['MAX_MERCHANT_ID'])
            {
                var response        = UtilService.SqliteToArray(result);
                var lastmerchantid  = response[0].MAX_MERCHANT_ID;
                var lastnomorurut   = lastmerchantid.split('.')[2];
                var newnomorurut    = UtilService.StringPad(Number(lastnomorurut) + 1,'0000')
                var newmerchantid   = STORE_ID + '.' + newnomorurut;
                deferred.resolve(newmerchantid);
            }
            else
            {
                var newmerchantid = STORE_ID + '.0001';
                deferred.resolve(newmerchantid);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }

    var GetMerchantsByMerchantsId = function (parameters)
    {
        var deferred = $q.defer();
        var queryselectstore = 'SELECT * FROM Tbl_Merchants WHERE MERCHANT_ID = ?';
        $cordovaSQLite.execute($rootScope.db, queryselectstore,[parameters.MERCHANT_ID])
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
    
    var CreateMerchants = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var TYPE_PAY_ID     = datatosave.TYPE_PAY_ID;
        var TYPE_PAY_NM     = datatosave.TYPE_PAY_NM;
        var BANK_ID         = datatosave.BANK_ID;
        var BANK_NM         = datatosave.BANK_NM;
        var MERCHANT_ID     = datatosave.MERCHANT_ID;
        var MERCHANT_NO     = datatosave.MERCHANT_NO;
        var MERCHANT_NM     = datatosave.MERCHANT_NM;
        var MERCHANT_TOKEN  = datatosave.MERCHANT_TOKEN;
        var MERCHANT_URL    = datatosave.MERCHANT_URL;
        var DCRP_DETIL      = datatosave.DCRP_DETIL;
        var STATUS          = datatosave.STATUS;

        var isitable        = [TGL_SAVE,ACCESS_GROUP,STORE_ID,TYPE_PAY_ID,TYPE_PAY_NM,BANK_ID,BANK_NM,MERCHANT_ID,MERCHANT_NO,MERCHANT_NM,MERCHANT_TOKEN,MERCHANT_URL,DCRP_DETIL,STATUS]
        var query           = 'INSERT INTO Tbl_Merchants (TGL_SAVE,ACCESS_GROUP,STORE_ID,TYPE_PAY_ID,TYPE_PAY_NM,BANK_ID,BANK_NM,MERCHANT_ID,MERCHANT_NO,MERCHANT_NM,MERCHANT_TOKEN,MERCHANT_URL,DCRP_DETIL,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Merchants';
                dataoffline.PRIMARY_KEY = result.insertId;
                dataoffline.TYPE_ACTION = 1;
                OfflineLiteFac.CreateOffline(dataoffline)
                .then(function(responsecreateoffline)
                {
                    responsecreateoffline.ID_LOCAL    = result.insertId;
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

    var UpdateMerchants = function (datatosave)
    {
        var deferred        = $q.defer();
        var query           = 'UPDATE Tbl_Merchants SET TYPE_PAY_ID=?,TYPE_PAY_NM=?,BANK_ID=?,BANK_NM=?,MERCHANT_NO=?,MERCHANT_NM=?,MERCHANT_TOKEN=?,MERCHANT_URL=?,DCRP_DETIL=?,STATUS=? WHERE ID_LOCAL=?';
        $cordovaSQLite.execute($rootScope.db,query,[datatosave.TYPE_PAY_ID,datatosave.TYPE_PAY_NM,datatosave.BANK_ID,datatosave.BANK_NM,datatosave.MERCHANT_NO,datatosave.MERCHANT_NM,datatosave.MERCHANT_TOKEN,datatosave.MERCHANT_URL,datatosave.DCRP_DETIL,datatosave.STATUS,datatosave.ID_LOCAL])
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Merchants';
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
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var DeleteMerchants = function (datatodelete)
    {
        var deferred        = $q.defer();
        var query           = 'UPDATE Tbl_Merchants SET STATUS = 3 WHERE ID_LOCAL=?';
        $cordovaSQLite.execute($rootScope.db,query,[datatodelete.ID_LOCAL])
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Merchants';
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

    

    var GetMerchantTypes = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_MerchantTypes WHERE STATUS = 1';
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

    var GetMerchantTypeByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_MerchantTypes WHERE ID_LOCAL = ?';
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

    var GetMaxMerchantTypeID = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(TYPE_PAY_ID)AS MAX_TYPE_PAY_ID FROM Tbl_MerchantTypes';
        $cordovaSQLite.execute($rootScope.db,query,[])
        .then(function(result) 
        {
            if(result.rows.length > 0 && result.rows.item(0)['MAX_TYPE_PAY_ID'])
            {
                var response                = UtilService.SqliteToArray(result);
                var lastmerchanttypeid      = response[0].MAX_TYPE_PAY_ID;
                var newmerchanttypeid       = Number(lastmerchanttypeid) + 1;
                deferred.resolve(newmerchanttypeid);
            }
            else
            {
                var newmerchanttypeid = 1;
                deferred.resolve(newmerchanttypeid);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }
    
    var CreateMerchantTypes = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var TYPE_PAY_ID     = datatosave.TYPE_PAY_ID;
        var TYPE_PAY_NM     = datatosave.TYPE_PAY_NM;
        var DCRP_DETIL      = datatosave.DCRP_DETIL;
        var STATUS          = datatosave.STATUS;

        var isitable        = [TGL_SAVE,TYPE_PAY_ID,TYPE_PAY_NM,DCRP_DETIL,STATUS]
        var query           = 'INSERT INTO Tbl_MerchantTypes(TGL_SAVE,TYPE_PAY_ID,TYPE_PAY_NM,DCRP_DETIL,STATUS) VALUES (?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_MerchantTypes';
                dataoffline.PRIMARY_KEY = result.insertId;
                dataoffline.TYPE_ACTION = 1;
                OfflineLiteFac.CreateOffline(dataoffline)
                .then(function(responsecreateoffline)
                {
                    responsecreateoffline.ID_LOCAL    = result.insertId;
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

    var UpdateMerchantTypes = function (datatoupdate,fromwhere)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatoupdate.TGL_SAVE;
        var TYPE_PAY_ID     = datatoupdate.TYPE_PAY_ID;
        var TYPE_PAY_NM     = datatoupdate.TYPE_PAY_NM;
        var DCRP_DETIL      = datatoupdate.DCRP_DETIL;
        var STATUS          = datatoupdate.STATUS;

        var isitable        = [TGL_SAVE,TYPE_PAY_NM,DCRP_DETIL,STATUS,TYPE_PAY_ID]
        var query           = 'UPDATE Tbl_MerchantTypes SET TGL_SAVE=?,TYPE_PAY_NM=?,DCRP_DETIL=?,STATUS=? WHERE TYPE_PAY_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_MerchantTypes';
                dataoffline.PRIMARY_KEY = datatoupdate.ID_LOCAL;
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

    var DeleteMerchantTypes = function (datatodelete)
    {
        var deferred        = $q.defer();
        var query           = 'UPDATE Tbl_MerchantTypes SET STATUS= 3 WHERE ID_LOCAL=?';
        $cordovaSQLite.execute($rootScope.db,query,[datatodelete.ID_LOCAL])
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_MerchantTypes';
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

    var GetMerchantTypesByTypesID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_MerchantTypes WHERE TYPE_PAY_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.TYPE_PAY_ID])
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


    var GetMerchantBanks = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_MerchantBanks';
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

    var CreateMerchantBanks = function (datatosave)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var BANK_ID         = datatosave.BANK_ID;
        var BANK_NM         = datatosave.BANK_NM;
        var DCRP_DETIL      = datatosave.DCRP_DETIL;
        var STATUS          = datatosave.STATUS;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable        = [TGL_SAVE,BANK_ID,BANK_NM,DCRP_DETIL,STATUS,IS_ONSERVER]
        var query           = 'INSERT INTO Tbl_MerchantBanks(TGL_SAVE,BANK_ID,BANK_NM,DCRP_DETIL,STATUS,IS_ONSERVER) VALUES (?,?,?,?,?,?)';
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

    var UpdateMerchantBanks = function (datatosave)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var BANK_ID         = datatosave.BANK_ID;
        var BANK_NM         = datatosave.BANK_NM;
        var DCRP_DETIL      = datatosave.DCRP_DETIL;
        var STATUS          = datatosave.STATUS;
        var IS_ONSERVER     = datatosave.IS_ONSERVER;

        var isitable        = [TGL_SAVE,BANK_NM,DCRP_DETIL,STATUS,IS_ONSERVER,BANK_ID]
        var query           = 'UPDATE Tbl_MerchantBanks SET TGL_SAVE=?,BANK_NM=?,DCRP_DETIL=?,STATUS=?,IS_ONSERVER=? WHERE BANK_ID=?';
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

    var DeleteMerchantBanks = function (datatosave)
    {
        var deferred        = $q.defer();
        var query           = 'UPDATE Tbl_MerchantBanks SET STATUS=?,IS_ONSERVER=? WHERE BANK_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[datatosave.STATUS,datatosave.IS_ONSERVER,datatosave.BANK_ID])
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


    var GetMerchantBanksByBanksID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_MerchantBanks WHERE BANK_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.BANK_ID])
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
            GetMerchants:GetMerchants,
            GetMerchantByIDLocal:GetMerchantByIDLocal,
            GetMaxMerchantID:GetMaxMerchantID,
            GetMerchantsByMerchantsId:GetMerchantsByMerchantsId,
            CreateMerchants:CreateMerchants,
            UpdateMerchants:UpdateMerchants,
            DeleteMerchants:DeleteMerchants,

            GetMerchantTypes:GetMerchantTypes,
            GetMerchantTypeByIDLocal:GetMerchantTypeByIDLocal,
            GetMaxMerchantTypeID:GetMaxMerchantTypeID,
            CreateMerchantTypes:CreateMerchantTypes,
            UpdateMerchantTypes:UpdateMerchantTypes,
            DeleteMerchantTypes:DeleteMerchantTypes,
            GetMerchantTypesByTypesID:GetMerchantTypesByTypesID,

            GetMerchantBanks:GetMerchantBanks,
            CreateMerchantBanks:CreateMerchantBanks,
            UpdateMerchantBanks:UpdateMerchantBanks,
            DeleteMerchantBanks:DeleteMerchantBanks,
            GetMerchantBanksByBanksID:GetMerchantBanksByBanksID

            
        }
}])