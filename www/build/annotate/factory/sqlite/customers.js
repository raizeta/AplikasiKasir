angular.module('starter')
.factory('CustomersLiteFac',['OfflineLiteFac','$rootScope','$q','$cordovaSQLite','UtilService',
function(OfflineLiteFac,$rootScope,$q,$cordovaSQLite,UtilService)
{
    var GetCustomers = function(parameters)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_Customers WHERE STORE_ID = ? AND STATUS = 1 GROUP BY NAME';
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

    var GetMaxCustomerID = function (STORE_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(CAST(CUSTOMER_ID as decimal))AS MAX_CUSTOMER_ID FROM Tbl_Customers WHERE STORE_ID =?';
        $cordovaSQLite.execute($rootScope.db,query,[STORE_ID])
        .then(function(result) 
        {
            if(result.rows.length > 0 && result.rows.item(0)['MAX_CUSTOMER_ID'])
            {
                var response        = UtilService.SqliteToArray(result);
                var lastcustomerid  = response[0].MAX_CUSTOMER_ID;
                var newnomorurut    = Number(lastcustomerid) + 1;                
                var newcustomerid   = newnomorurut;
                deferred.resolve(newcustomerid);
            }
            else
            {
                var newcustomerid = 1;
                deferred.resolve(newcustomerid);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }
    
    var GetCustomerByIDLocal = function(ID_LOCAL)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_Customers WHERE ID_LOCAL = ?';
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

    var GetCustomerByCustomerID = function(parameters)
    {
        var deferred        = $q.defer();
        var query           = 'SELECT * FROM Tbl_Customers WHERE CUSTOMER_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.CUSTOMER_ID])
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

    var CreateCustomers = function (datatosave,fromwhere)
    {
        var deferred        = $q.defer();
        var TGL_SAVE        = datatosave.TGL_SAVE;
        var ACCESS_GROUP    = datatosave.ACCESS_GROUP;
        var STORE_ID        = datatosave.STORE_ID;
        var CUSTOMER_ID     = datatosave.CUSTOMER_ID;
        var NAME            = datatosave.NAME;
        var EMAIL           = datatosave.EMAIL;
        var PHONE           = datatosave.PHONE;
        var DCRP_DETIL      = datatosave.DCRP_DETIL;
        var STATUS          = datatosave.STATUS;

        var isitable        = [TGL_SAVE,ACCESS_GROUP,STORE_ID,CUSTOMER_ID,NAME,EMAIL,PHONE,DCRP_DETIL,STATUS]
        var query           = 'INSERT INTO Tbl_Customers (TGL_SAVE,ACCESS_GROUP,STORE_ID,CUSTOMER_ID,NAME,EMAIL,PHONE,DCRP_DETIL,STATUS) VALUES (?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Customers';
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

    var UpdateCustomers = function (datatoupdate)
    {
        var deferred    = $q.defer();
        var isitable    = [datatoupdate.TGL_SAVE,datatoupdate.NAME,datatoupdate.EMAIL,datatoupdate.PHONE,datatoupdate.DCRP_DETIL,datatoupdate.STATUS,datatoupdate.ID_LOCAL]
        var query       = 'UPDATE Tbl_Customers SET TGL_SAVE=?,NAME=?,EMAIL=?,PHONE=?,DCRP_DETIL=?,STATUS=? WHERE ID_LOCAL=?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Customers';
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

    var DeleteCustomers = function (datatodelete)
    {
        console.log(datatodelete);
        var deferred            = $q.defer();
        var query               = 'UPDATE Tbl_Customers SET STATUS = 3 WHERE ID_LOCAL=?';
        $cordovaSQLite.execute($rootScope.db,query,[datatodelete.ID_LOCAL])
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Customers';
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
            CreateCustomers:CreateCustomers,
            GetCustomers:GetCustomers,
            GetMaxCustomerID:GetMaxCustomerID,
            GetCustomerByCustomerID:GetCustomerByCustomerID,
            GetCustomerByIDLocal:GetCustomerByIDLocal,
            UpdateCustomers:UpdateCustomers,
            DeleteCustomers:DeleteCustomers
        }
}])