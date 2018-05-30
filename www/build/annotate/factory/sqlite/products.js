angular.module('starter')
.factory('ProductsLiteFac',['OfflineLiteFac','$rootScope','$q','$cordovaSQLite','UtilService',
function(OfflineLiteFac,$rootScope,$q,$cordovaSQLite,UtilService)
{
    var GetProducts = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Products WHERE STORE_ID = ? AND STATUS = 1 GROUP BY PRODUCT_ID';
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

    var GetProductsJoinImage = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT Tbl_Products.*,Tbl_Product_Images.PRODUCT_IMAGE FROM Tbl_Products LEFT JOIN Tbl_Product_Images ON  Tbl_Products.PRODUCT_ID = Tbl_Product_Images.PRODUCT_ID WHERE Tbl_Products.STORE_ID = ? AND Tbl_Products.STATUS = 1 GROUP BY Tbl_Products.PRODUCT_ID';
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

    var GetMaxProductID = function (STORE_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(PRODUCT_ID)AS MAX_PRODUCT_ID FROM Tbl_Products WHERE STORE_ID =?';
        $cordovaSQLite.execute($rootScope.db,query,[STORE_ID])
        .then(function(result) 
        {
            if(result.rows.length > 0 && result.rows.item(0)['MAX_PRODUCT_ID'])
            {
                var response        = UtilService.SqliteToArray(result);
                var lastproductid   = response[0].MAX_PRODUCT_ID;
                var lastnomorurut   = lastproductid.split('.')[2];
                var newnomorurut    = UtilService.StringPad(Number(lastnomorurut) + 1,'00000')
                var newproductid    = STORE_ID + '.' + newnomorurut;
                deferred.resolve(newproductid);
            }
            else
            {
                var newproductid = STORE_ID + '.00001';
                deferred.resolve(newproductid);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }

    var GetProductByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Products WHERE ID_LOCAL= ?';
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

    var GetProductByProductID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Products WHERE PRODUCT_ID = ?';
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

    var GetProductsFavorite = function (parameters)
    {
        var deferred    = $q.defer();
        if(parameters.IS_FAVORITE)
        {
            var query       = 'SELECT * FROM Tbl_Products WHERE STORE_ID = ? AND IS_FAVORITE=?';
            var isitable    = [parameters.STORE_ID,1];   
        }
        else
        {
            var query       = 'SELECT * FROM Tbl_Products WHERE STORE_ID = ?';
            var isitable    = [parameters.STORE_ID];
        }   
        $cordovaSQLite.execute($rootScope.db,query,isitable)
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

    var GetProductsByGroupID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Products WHERE STORE_ID = ? AND GROUP_ID=? AND STATUS = 1';
        var isitable    = [parameters.STORE_ID,parameters.GROUP_ID];   
        $cordovaSQLite.execute($rootScope.db,query,isitable)
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
        var deferred            = $q.defer();
        var TGL_SAVE            = datatosave.TGL_SAVE;
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var GROUP_ID            = datatosave.GROUP_ID;
        var GROUP_NM            = datatosave.GROUP_NM;
        var PRODUCT_ID          = datatosave.PRODUCT_ID;
        var PRODUCT_QR          = datatosave.PRODUCT_QR;
        var PRODUCT_NM          = datatosave.PRODUCT_NM;
        var CURRENT_HPP         = datatosave.CURRENT_HPP;
        var CURRENT_STOCK       = datatosave.CURRENT_STOCK;
        var HARGA_JUAL          = datatosave.HARGA_JUAL;
        var CURRENT_PPN         = datatosave.CURRENT_PPN;
        var CURRENT_DISCOUNT    = datatosave.CURRENT_DISCOUNT;
        var PRODUCT_WARNA       = datatosave.PRODUCT_WARNA;
        var PRODUCT_SIZE        = datatosave.PRODUCT_SIZE;
        var PRODUCT_SIZE_UNIT   = datatosave.PRODUCT_SIZE_UNIT;
        var PRODUCT_HEADLINE    = datatosave.PRODUCT_HEADLINE;
        var UNIT_ID             = datatosave.UNIT_ID;
        var UNIT_NM             = datatosave.UNIT_NM;
        var STOCK_LEVEL         = datatosave.STOCK_LEVEL;
        var INDUSTRY_ID         = datatosave.INDUSTRY_ID;
        var INDUSTRY_NM         = datatosave.INDUSTRY_NM;
        var INDUSTRY_GRP_ID     = datatosave.INDUSTRY_GRP_ID;
        var INDUSTRY_GRP_NM     = datatosave.INDUSTRY_GRP_NM;
        var CURRENT_PROMO       = datatosave.CURRENT_PROMO;
        var STATUS              = datatosave.STATUS;
        var DCRP_DETIL          = datatosave.DCRP_DETIL;
        var IMG_FILE            = datatosave.IMG_FILE;
        var IS_FAVORITE         = datatosave.IS_FAVORITE;

        var isitable        = [TGL_SAVE,ACCESS_GROUP,STORE_ID,GROUP_ID,GROUP_NM,PRODUCT_ID,PRODUCT_QR,PRODUCT_NM,CURRENT_HPP,CURRENT_STOCK,HARGA_JUAL,CURRENT_PPN,CURRENT_DISCOUNT,PRODUCT_WARNA,PRODUCT_SIZE,PRODUCT_SIZE_UNIT,PRODUCT_HEADLINE,UNIT_ID,UNIT_NM,STOCK_LEVEL,INDUSTRY_ID,INDUSTRY_NM,INDUSTRY_GRP_ID,INDUSTRY_GRP_NM,CURRENT_PROMO,STATUS,DCRP_DETIL,IMG_FILE,IS_FAVORITE]
        var query           = 'INSERT INTO Tbl_Products (TGL_SAVE,ACCESS_GROUP,STORE_ID,GROUP_ID,GROUP_NM,PRODUCT_ID,PRODUCT_QR,PRODUCT_NM,CURRENT_HPP,CURRENT_STOCK,HARGA_JUAL,CURRENT_PPN,CURRENT_DISCOUNT,PRODUCT_WARNA,PRODUCT_SIZE,PRODUCT_SIZE_UNIT,PRODUCT_HEADLINE,UNIT_ID,UNIT_NM,STOCK_LEVEL,INDUSTRY_ID,INDUSTRY_NM,INDUSTRY_GRP_ID,INDUSTRY_GRP_NM,CURRENT_PROMO,STATUS,DCRP_DETIL,IMG_FILE,IS_FAVORITE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Products';
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

    var UpdateProducts = function (datatoupdate,fromwhere)
    {
        var deferred    = $q.defer();
        var query       = 'UPDATE Tbl_Products SET TGL_SAVE=?,GROUP_ID=?,GROUP_NM=?,PRODUCT_QR=?,PRODUCT_NM=?,CURRENT_HPP=?,CURRENT_STOCK=?,HARGA_JUAL=?,CURRENT_PPN=?,CURRENT_DISCOUNT=?,PRODUCT_WARNA=?,PRODUCT_SIZE=?,PRODUCT_SIZE_UNIT=?,PRODUCT_HEADLINE=?,UNIT_ID=?,UNIT_NM=?,STOCK_LEVEL=?,INDUSTRY_ID=?,INDUSTRY_NM=?,INDUSTRY_GRP_ID=?,INDUSTRY_GRP_NM=?,CURRENT_PROMO=?,STATUS=?,DCRP_DETIL=?,IMG_FILE=? WHERE ID_LOCAL=?';
        $cordovaSQLite.execute($rootScope.db,query,[datatoupdate.TGL_SAVE,datatoupdate.GROUP_ID,datatoupdate.GROUP_NM,datatoupdate.PRODUCT_QR,datatoupdate.PRODUCT_NM,datatoupdate.CURRENT_HPP,datatoupdate.CURRENT_STOCK,datatoupdate.HARGA_JUAL,datatoupdate.CURRENT_PPN,datatoupdate.CURRENT_DISCOUNT,datatoupdate.PRODUCT_WARNA,datatoupdate.PRODUCT_SIZE,datatoupdate.PRODUCT_SIZE_UNIT,datatoupdate.PRODUCT_HEADLINE,datatoupdate.UNIT_ID,datatoupdate.UNIT_NM,datatoupdate.STOCK_LEVEL,datatoupdate.INDUSTRY_ID,datatoupdate.INDUSTRY_NM,datatoupdate.INDUSTRY_GRP_ID,datatoupdate.INDUSTRY_GRP_NM,datatoupdate.CURRENT_PROMO,datatoupdate.STATUS,datatoupdate.DCRP_DETIL,datatoupdate.IMG_FILE,datatoupdate.ID_LOCAL])
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Products';
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
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var DeleteProducts = function (datatodelete)
    {
        var deferred    = $q.defer();
        var query       = 'UPDATE Tbl_Products SET STATUS=3 WHERE ID_LOCAL=?';
        $cordovaSQLite.execute($rootScope.db,query,[datatodelete.ID_LOCAL])
        .then(function(result) 
        {
            
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Products';
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
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var UpdateProductsQuantity = function (dataupdate)
    {
        var deferred        = $q.defer();
        var STORE_ID        = dataupdate.STORE_ID;
        var PRODUCT_ID      = dataupdate.PRODUCT_ID;
        var CURRENT_STOCK   = dataupdate.CURRENT_STOCK;
        
        var isitable        = [CURRENT_STOCK,STORE_ID,PRODUCT_ID];
        var query           = 'UPDATE Tbl_Products SET CURRENT_STOCK = ? WHERE STORE_ID = ? AND PRODUCT_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var UpdateProductsHarga = function (dataupdate)
    {
        var deferred        = $q.defer();
        var STORE_ID        = dataupdate.STORE_ID;
        var PRODUCT_ID      = dataupdate.PRODUCT_ID;
        var HARGA_JUAL      = dataupdate.CURRENT_PRICE
        
        var isitable        = [HARGA_JUAL,STORE_ID,PRODUCT_ID];
        var query           = 'UPDATE Tbl_Products SET HARGA_JUAL = ? WHERE STORE_ID = ? AND PRODUCT_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    var GetProductImages = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Images WHERE STORE_ID = ?';
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

    var GetProductImagesByProductID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Images WHERE STORE_ID = ? AND PRODUCT_ID=?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.STORE_ID,parameters.PRODUCT_ID])
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

    var CreateProductImages = function (datatosave,fromwhere)
    {
        var deferred            = $q.defer();
        var TGL_SAVE            = datatosave.TGL_SAVE;
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var PRODUCT_ID          = datatosave.PRODUCT_ID;
        var PRODUCT_IMAGE       = datatosave.PRODUCT_IMAGE;
        var STATUS              = datatosave.STATUS; // 1=Create,2=Update
        var DCRP_DETIL          = datatosave.DCRP_DETIL;

        var isitable        = [TGL_SAVE,ACCESS_GROUP,STORE_ID,PRODUCT_ID,PRODUCT_IMAGE,STATUS,DCRP_DETIL]
        var query           = 'INSERT INTO Tbl_Product_Images (TGL_SAVE,ACCESS_GROUP,STORE_ID,PRODUCT_ID,PRODUCT_IMAGE,STATUS,DCRP_DETIL) VALUES (?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Product_Images';
                dataoffline.PRIMARY_KEY = datatosave.PRODUCT_ID;
                dataoffline.TYPE_ACTION = datatosave.STATUS;
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

    var AddOrRemoveFromFavorite = function (datatoupdate)
    {
        var deferred    = $q.defer();
        var query       = 'UPDATE Tbl_Products SET IS_FAVORITE = ? WHERE PRODUCT_ID = ?';
        $cordovaSQLite.execute($rootScope.db,query,[datatoupdate.IS_FAVORITE,datatoupdate.PRODUCT_ID])
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function(error) 
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }
    
    
    var GetProductGroups = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Groups WHERE STORE_ID= ? AND STATUS = 1';
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

    var CreateProductGroups = function(datatosave,fromwhere)
    {
        var deferred            = $q.defer();
        var ACCESS_GROUP        = datatosave.ACCESS_GROUP;
        var STORE_ID            = datatosave.STORE_ID;
        var GROUP_ID            = datatosave.GROUP_ID;
        var GROUP_NM            = datatosave.GROUP_NM;
        var STATUS              = datatosave.STATUS;
        var NOTE                = datatosave.NOTE;

        var isitable        = [ACCESS_GROUP,STORE_ID,GROUP_ID,GROUP_NM,STATUS,NOTE]
        var query           = 'INSERT INTO Tbl_Product_Groups (ACCESS_GROUP,STORE_ID,GROUP_ID,GROUP_NM,STATUS,NOTE) VALUES (?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            if(fromwhere != 'FROM-SERVER')
            {
                var dataoffline         = {};
                dataoffline.NAMA_TABEL  = 'Tbl_Product_Groups';
                dataoffline.PRIMARY_KEY = result.insertId;
                dataoffline.TYPE_ACTION = 1;
                OfflineLiteFac.CreateOffline(dataoffline)
                .then(function(responsecreateoffline)
                {
                    responsecreateoffline.ID_LOCAL  = result.insertId;
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

    var GetMaxProductGroups = function (STORE_ID)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT MAX(GROUP_ID)AS MAX_GROUP_ID FROM Tbl_Product_Groups WHERE STORE_ID =?';
        $cordovaSQLite.execute($rootScope.db,query,[STORE_ID])
        .then(function(result) 
        {
            if(result.rows.length > 0 && result.rows.item(0)['MAX_GROUP_ID'])
            {
                var response        = UtilService.SqliteToArray(result);
                var lastgroupid     = response[0].MAX_GROUP_ID;
                var lastnomorurut   = lastgroupid.split('.')[2];
                var newnomorurut    = UtilService.StringPad(Number(lastnomorurut) + 1,'00000')                
                var newgroupid      = STORE_ID + '.' + newnomorurut;
                deferred.resolve(newgroupid);
            }
            else
            {
                var newgroupid      = STORE_ID + '.00001';
                deferred.resolve(newgroupid);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }

    var GetProductGroupsByGroupID = function (parameters)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Groups WHERE GROUP_ID =?';
        $cordovaSQLite.execute($rootScope.db,query,[parameters.GROUP_ID])
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

    var GetProductGroupsByIDLocal = function (ID_LOCAL)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Product_Groups WHERE ID_LOCAL =?';
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

    var UpdateProductGroups = function(datatoupdate)
    {
        var deferred        = $q.defer();
        var ID_LOCAL        = datatoupdate.ID_LOCAL;
        var GROUP_NM        = datatoupdate.GROUP_NM;
        var STATUS          = datatoupdate.STATUS;
        var NOTE            = datatoupdate.NOTE;

        var isitable        = [GROUP_NM,STATUS,NOTE,ID_LOCAL]
        var query           = 'UPDATE Tbl_Product_Groups SET GROUP_NM = ?,STATUS = ?,NOTE = ? WHERE ID_LOCAL = ?';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Product_Groups';
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
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    var DeleteProductGroups = function(datatodelete)
    {
        var deferred        = $q.defer();
        var query           = 'UPDATE Tbl_Product_Groups SET STATUS = 3 WHERE ID_LOCAL = ?';
        $cordovaSQLite.execute($rootScope.db,query,[datatodelete.ID_LOCAL])
        .then(function(result) 
        {
            var dataoffline         = {};
            dataoffline.NAMA_TABEL  = 'Tbl_Product_Groups';
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
            GetProducts:GetProducts,
            GetProductsJoinImage:GetProductsJoinImage,
            GetProductByIDLocal:GetProductByIDLocal,
            GetMaxProductID:GetMaxProductID,
            GetProductByProductID:GetProductByProductID,
            GetProductsFavorite:GetProductsFavorite,
            GetProductsByGroupID:GetProductsByGroupID,
            CreateProducts:CreateProducts,
            UpdateProducts:UpdateProducts,
            DeleteProducts:DeleteProducts,
            UpdateProductsQuantity:UpdateProductsQuantity,
            UpdateProductsHarga:UpdateProductsHarga,
            GetProductImages:GetProductImages,
            GetProductImagesByProductID:GetProductImagesByProductID,
            CreateProductImages:CreateProductImages,
            AddOrRemoveFromFavorite:AddOrRemoveFromFavorite,
            
            CreateProductGroups:CreateProductGroups,
            GetProductGroups:GetProductGroups,
            GetMaxProductGroups:GetMaxProductGroups,
            GetProductGroupsByGroupID:GetProductGroupsByGroupID,
            GetProductGroupsByIDLocal:GetProductGroupsByIDLocal,
            UpdateProductGroups:UpdateProductGroups,
            DeleteProductGroups:DeleteProductGroups
        }
}])