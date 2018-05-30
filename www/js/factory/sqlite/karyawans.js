angular.module('starter')
.factory('KaryawansLiteFac',['OfflineLiteFac','UtilService','$rootScope','$q','$filter','$cordovaSQLite',
function(OfflineLiteFac,UtilService,$rootScope,$q,$filter,$cordovaSQLite)
{
    var GetKaryawans = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Karyawans WHERE STORE_ID=? AND STATUS = 1';
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

    var GetKaryawanByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Karyawans WHERE ID_LOCAL =?';
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
    
    var GetMaxKaryawanID = function (STORE_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(KARYAWAN_ID)AS MAX_KARYAWAN_ID FROM Tbl_Karyawans WHERE STORE_ID =?';
        $cordovaSQLite.execute($rootScope.db,query,[STORE_ID])
        .then(function(result) 
        {
            if(result.rows.length > 0 && result.rows.item(0)['MAX_KARYAWAN_ID'])
            {
                var response        = UtilService.SqliteToArray(result);
                var lastkaryawanid  = response[0].MAX_KARYAWAN_ID;
                var lastnomorurut   = lastkaryawanid.split('.')[2];
                var newnomorurut    = UtilService.StringPad(Number(lastnomorurut) + 1,'0000')
                var newkaryawanid   = STORE_ID + '.' + newnomorurut;
                deferred.resolve(newkaryawanid);
            }
            else
            {
                var newkaryawanid = STORE_ID + '.0001';
                deferred.resolve(newkaryawanid);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }

    var GetKaryawansByKaryawanID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Karyawans WHERE KARYAWAN_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.KARYAWAN_ID])
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
    
    var CreateKaryawans = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var KARYAWAN_ID     = datatosave.KARYAWAN_ID;
        var NAMA_DPN        = datatosave.NAMA_DPN;
        var NAMA_TGH        = datatosave.NAMA_TGH;
        var NAMA_BLK        = datatosave.NAMA_BLK;
        var KTP             = datatosave.KTP;
        var TMP_LAHIR       = datatosave.TMP_LAHIR;
        var TGL_LAHIR       = datatosave.TGL_LAHIR;
        var GENDER          = datatosave.GENDER;
        var ALAMAT          = datatosave.ALAMAT;
        var STS_NIKAH       = datatosave.STS_NIKAH;
        var TLP             = datatosave.TLP;
        var HP              = datatosave.HP;
        var EMAIL           = datatosave.EMAIL;
        var STATUS          = datatosave.STATUS;

        var isitable        = [TGL_SAVE,ACCESS_GROUP,STORE_ID,KARYAWAN_ID,NAMA_DPN,NAMA_TGH,NAMA_BLK,KTP,TMP_LAHIR,TGL_LAHIR,GENDER,ALAMAT,STS_NIKAH,TLP,HP,EMAIL,STATUS]
        var qinsertemploye  = 'INSERT INTO Tbl_Karyawans (TGL_SAVE,ACCESS_GROUP,STORE_ID,KARYAWAN_ID,NAMA_DPN,NAMA_TGH,NAMA_BLK,KTP,TMP_LAHIR,TGL_LAHIR,GENDER,ALAMAT,STS_NIKAH,TLP,HP,EMAIL,STATUS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,qinsertemploye,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Karyawans';
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

    var UpdateKaryawans = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var ID_LOCAL        = datatosave.ID_LOCAL;
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var NAMA_DPN        = datatosave.NAMA_DPN;
        var NAMA_TGH        = datatosave.NAMA_TGH;
        var NAMA_BLK        = datatosave.NAMA_BLK;
        var KTP             = datatosave.KTP;
        var TMP_LAHIR       = datatosave.TMP_LAHIR;
        var TGL_LAHIR       = datatosave.TGL_LAHIR;
        var GENDER          = datatosave.GENDER;
        var ALAMAT          = datatosave.ALAMAT;
        var STS_NIKAH       = datatosave.STS_NIKAH;
        var TLP             = datatosave.TLP;
        var HP              = datatosave.HP;
        var EMAIL           = datatosave.EMAIL;

        var isitable        = [TGL_SAVE,NAMA_DPN,NAMA_TGH,NAMA_BLK,KTP,TMP_LAHIR,TGL_LAHIR,GENDER,ALAMAT,STS_NIKAH,TLP,HP,EMAIL,ID_LOCAL]
        var qinsertemploye  = 'UPDATE Tbl_Karyawans SET TGL_SAVE = ?,NAMA_DPN  = ?,NAMA_TGH = ?,NAMA_BLK = ?,KTP = ?,TMP_LAHIR = ?,TGL_LAHIR = ?,GENDER = ?,ALAMAT = ?,STS_NIKAH = ?,TLP = ?,HP = ?,EMAIL = ? WHERE ID_LOCAL = ?';
        $cordovaSQLite.execute($rootScope.db,qinsertemploye,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Karyawans';
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

    var DeleteKaryawans = function (datatodelete)
    {
        var deferred            = $q.defer();
        var query               = 'UPDATE Tbl_Karyawans SET STATUS = 3 WHERE KARYAWAN_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[datatodelete.KARYAWAN_ID])
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Karyawans';
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

    var CreateKaryawanAbsensis = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var OFLINE_ID       = datatosave.OFLINE_ID;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP
        var STORE_ID        = datatosave.STORE_ID;
        var KARYAWAN_ID     = datatosave.KARYAWAN_ID;

        var TGL             = $filter('date')(new Date(),'yyyy-MM-dd');
        var WAKTU           = $filter('date')(new Date(),'HH:mm:ss');
        var LATITUDE        = datatosave.LATITUDE;
        var LONGITUDE       = datatosave.LONGITUDE;
        var STATUS          = datatosave.STATUS;
        var DCRP_DETIL      = datatosave.DCRP_DETIL;
        var ABSEN_IMAGE     = datatosave.ABSEN_IMAGE;

        var isitable        = [TGL_SAVE,OFLINE_ID,ACCESS_GROUP,STORE_ID,KARYAWAN_ID,TGL,WAKTU,LATITUDE,LONGITUDE,STATUS,DCRP_DETIL,ABSEN_IMAGE]
        var query           = 'INSERT INTO Tbl_KaryawanAbsensis (TGL_SAVE,OFLINE_ID,ACCESS_GROUP,STORE_ID,KARYAWAN_ID,TGL,WAKTU,LATITUDE,LONGITUDE,STATUS,DCRP_DETIL,ABSEN_IMAGE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_KaryawanAbsensis';
                dataoffline.PRIMARY_KEY = result.insertId;
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

    var GetKaryawanAbsensis = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_KaryawanAbsensis WHERE TGL_SAVE = ? AND STORE_ID = ? AND KARYAWAN_ID = ? GROUP BY STATUS';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.TGL_SAVE,parameters.STORE_ID,parameters.KARYAWAN_ID])
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

    var GetKaryawanAbsensisByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_KaryawanAbsensis WHERE ID_LOCAL = ?';
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
            GetKaryawans:GetKaryawans,
            GetKaryawanByIDLocal:GetKaryawanByIDLocal,
            GetMaxKaryawanID:GetMaxKaryawanID,
            GetKaryawansByKaryawanID:GetKaryawansByKaryawanID,
            CreateKaryawans:CreateKaryawans,
            UpdateKaryawans:UpdateKaryawans,
            DeleteKaryawans:DeleteKaryawans,
            CreateKaryawanAbsensis:CreateKaryawanAbsensis,
            GetKaryawanAbsensis:GetKaryawanAbsensis,
            GetKaryawanAbsensisByIDLocal:GetKaryawanAbsensisByIDLocal
        }
}])