angular.module('starter')
.factory('OpenCloseBookLiteFac',['OfflineLiteFac','UtilService','$rootScope','$q','$filter','$cordovaSQLite',
function(OfflineLiteFac,UtilService,$rootScope,$q,$filter,$cordovaSQLite)
{
    var GetOpenCloseBook = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_OpenCloseBook WHERE TGL_SAVE = ? AND STORE_ID = ? AND ACCESS_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.TGL_SAVE,parameters.STORE_ID,parameters.ACCESS_ID])
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

    var GetOpenCloseBookByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_OpenCloseBook WHERE ID_LOCAL = ?';
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

    var GetOpenCloseBookByOpenCloseID = function (OPENCLOSE_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_OpenCloseBook WHERE OPENCLOSE_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[OPENCLOSE_ID])
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

    var GetMaxOpenCloseBookID= function (ACCESS_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(OPENCLOSE_ID)AS MAX_OPENCLOSE_ID FROM Tbl_OpenCloseBook WHERE ACCESS_ID =?';
        $cordovaSQLite.execute($rootScope.db,query,[ACCESS_ID])
        .then(function(result) 
        {
            if(result.rows.length > 0 && result.rows.item(0)['MAX_OPENCLOSE_ID'])
            {
                var response        = UtilService.SqliteToArray(result);
                var lastid          = response[0].MAX_OPENCLOSE_ID;
                var lastnomorurut   = lastid.split('.')[2];
                var newnomorurut    = UtilService.StringPad(Number(lastnomorurut) + 1,'00000')
                var newid           = STORE_ID + '.' + newnomorurut;
                deferred.resolve(newid);
            }
            else
            {
                var newnomorurut    = $filter('date')(new Date(),'yyyyMMddHHmmss');
                var newid           = STORE_ID + '.' + newnomorurut;
                deferred.resolve(newid);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }

    var GetOpenCloseBookWithStatus = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_OpenCloseBook WHERE TGL_SAVE = ? AND STORE_ID = ? AND ACCESS_ID = ? AND STATUS=? GROUP BY OPENCLOSE_ID';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.TGL_SAVE,parameters.STORE_ID,parameters.ACCESS_ID,parameters.STATUS])
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

    var CreateOpenCloseBook = function (datatosave,fromwhere)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = datatosave.TGL_SAVE;
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var ACCESS_ID           = datatosave.ACCESS_ID;
        
        var OPENCLOSE_ID        = datatosave.OPENCLOSE_ID;
        var SPLIT_OPENCLOSE_ID  = datatosave.SPLIT_OPENCLOSE_ID;
        var TGL_OPEN            = datatosave.TGL_OPEN;
        var TGL_CLOSE           = datatosave.TGL_CLOSE;

        var CASHINDRAWER        = datatosave.CASHINDRAWER;
        var ADDCASH             = datatosave.ADDCASH;
        var SELLCASH            = datatosave.SELLCASH;
        var TOTALCASH           = datatosave.TOTALCASH;
        var TOTALDONASI         = datatosave.TOTALDONASI;
        var TOTALREFUND         = datatosave.TOTALREFUND;
        var TOTALCASH_ACTUAL    = datatosave.TOTALCASH_ACTUAL;
        var STATUS              = datatosave.STATUS;

        var isitable            = [TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,OPENCLOSE_ID,SPLIT_OPENCLOSE_ID,TGL_OPEN,TGL_CLOSE,CASHINDRAWER,ADDCASH,SELLCASH,TOTALCASH,TOTALDONASI,TOTALREFUND,TOTALCASH_ACTUAL,STATUS];
        var query               = 'INSERT INTO Tbl_OpenCloseBook (TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,OPENCLOSE_ID,SPLIT_OPENCLOSE_ID,TGL_OPEN,TGL_CLOSE,CASHINDRAWER,ADDCASH,SELLCASH,TOTALCASH,TOTALDONASI,TOTALREFUND,TOTALCASH_ACTUAL,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_OpenCloseBook';
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

    var UpdateOpenCloseBook = function (datatoupdate)
    {
        var deferred            = $q.defer();
        var TGL_CLOSE           = datatoupdate.TGL_CLOSE;
        var SELLCASH            = datatoupdate.SELLCASH;
        var TOTALCASH           = datatoupdate.TOTALCASH;
        var TOTALDONASI         = datatoupdate.TOTALDONASI;
        var TOTALREFUND         = datatoupdate.TOTALREFUND;
        var TOTALCASH_ACTUAL    = datatoupdate.TOTALCASH_ACTUAL;
        var STATUS              = datatoupdate.STATUS;
        var OPENCLOSE_ID        = datatoupdate.OPENCLOSE_ID;
        
        var isitable            = [TGL_CLOSE,SELLCASH,TOTALCASH,TOTALDONASI,TOTALREFUND,TOTALCASH_ACTUAL,STATUS,OPENCLOSE_ID]
        var query               = 'UPDATE Tbl_OpenCloseBook SET TGL_CLOSE=?,SELLCASH=?,TOTALCASH=?,TOTALDONASI=?,TOTALREFUND=?,TOTALCASH_ACTUAL=?,STATUS=? WHERE OPENCLOSE_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {       
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_OpenCloseBook';
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
        },
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }
    
    var GetSetoranBook = function (parameters)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_Setoran WHERE TGL_SAVE = ? AND STORE_ID = ? AND ACCESS_ID = ? GROUP BY OPENCLOSE_ID';
        $cordovaSQLite.execute($rootScope.db, query,[parameters.TGL_SAVE,parameters.STORE_ID,parameters.ACCESS_ID])
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

    var GetSetoranBookByIDLocal = function (ID_LOCAL)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_Setoran WHERE ID_LOCAL = ?';
        $cordovaSQLite.execute($rootScope.db, query,[ID_LOCAL])
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
    
    var GetSetoranBookByOpenCloseID = function (parameters)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_Setoran WHERE OPENCLOSE_ID = ?';
        $cordovaSQLite.execute($rootScope.db, query,[parameters.OPENCLOSE_ID])
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

    var CreateSetoranBook = function (datatosave,fromwhere)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = datatosave.TGL_SAVE;
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var ACCESS_ID           = datatosave.ACCESS_ID;
        var OPENCLOSE_ID        = datatosave.OPENCLOSE_ID;
        var SPLIT_OPENCLOSE_ID  = datatosave.SPLIT_OPENCLOSE_ID;
        var TGL_STORAN          = datatosave.TGL_STORAN;
        var TOTALCASH           = datatosave.TOTALCASH;
        var NOMINAL_STORAN      = datatosave.NOMINAL_STORAN;
        var SISA_STORAN         = datatosave.SISA_STORAN;
        var BANK_NM             = datatosave.BANK_NM;
        var BANK_NO             = datatosave.BANK_NO;
        var CREATE_AT           = datatosave.CREATE_AT;
        var STATUS              = datatosave.STATUS;
        var DCRP_DETIL          = datatosave.DCRP_DETIL;
        var STORAN_IMAGE        = datatosave.STORAN_IMAGE;

        var isitable            = [TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,OPENCLOSE_ID,SPLIT_OPENCLOSE_ID,TGL_STORAN,TOTALCASH,NOMINAL_STORAN,SISA_STORAN,BANK_NM,BANK_NO,CREATE_AT,STATUS,DCRP_DETIL,STORAN_IMAGE];
        var query               = 'INSERT INTO Tbl_Setoran (TGL_SAVE,ACCESS_GROUP,STORE_ID,ACCESS_ID,OPENCLOSE_ID,SPLIT_OPENCLOSE_ID,TGL_STORAN,TOTALCASH,NOMINAL_STORAN,SISA_STORAN,BANK_NM,BANK_NO,CREATE_AT,STATUS,DCRP_DETIL,STORAN_IMAGE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Setoran';
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
    
    var UpdateSetoranBook = function (datatosave)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = datatosave.TGL_SAVE;
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var ACCESS_ID           = datatosave.ACCESS_ID;
        var OPENCLOSE_ID        = datatosave.OPENCLOSE_ID;
        var TGL_STORAN          = datatosave.TGL_STORAN;
        var TOTALCASH           = datatosave.TOTALCASH;
        var NOMINAL_STORAN      = datatosave.NOMINAL_STORAN;
        var SISA_STORAN         = datatosave.SISA_STORAN;
        var BANK_NM             = datatosave.BANK_NM;
        var BANK_NO             = datatosave.BANK_NO;
        var CREATE_AT           = datatosave.CREATE_AT;
        var STATUS              = datatosave.STATUS;
        var DCRP_DETIL          = datatosave.DCRP_DETIL;
        var STORAN_IMAGE        = datatosave.STORAN_IMAGE;

        var isitable            = [TGL_STORAN,TOTALCASH,NOMINAL_STORAN,SISA_STORAN,BANK_NM,BANK_NO,CREATE_AT,STATUS,DCRP_DETIL,STORAN_IMAGE,OPENCLOSE_ID];
        var query               = 'UPDATE Tbl_Setoran SET TGL_STORAN=?,TOTALCASH=?,NOMINAL_STORAN=?,SISA_STORAN=?,BANK_NM=?,BANK_NO=?,CREATE_AT=?,STATUS=?,DCRP_DETIL=?,STORAN_IMAGE=? WHERE OPENCLOSE_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Setoran';
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

    return{
            GetOpenCloseBook:GetOpenCloseBook,
            GetOpenCloseBookByIDLocal:GetOpenCloseBookByIDLocal,
            GetOpenCloseBookByOpenCloseID:GetOpenCloseBookByOpenCloseID,
            GetMaxOpenCloseBookID:GetMaxOpenCloseBookID,
            GetOpenCloseBookWithStatus:GetOpenCloseBookWithStatus,
            CreateOpenCloseBook:CreateOpenCloseBook,
            UpdateOpenCloseBook:UpdateOpenCloseBook,

            
            GetSetoranBook:GetSetoranBook,
            GetSetoranBookByIDLocal:GetSetoranBookByIDLocal,
            GetSetoranBookByOpenCloseID:GetSetoranBookByOpenCloseID,
            CreateSetoranBook:CreateSetoranBook,
            UpdateSetoranBook:UpdateSetoranBook
        }
}])