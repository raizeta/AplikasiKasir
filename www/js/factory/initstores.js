angular.module('starter')
.factory('InitStoresFac',['UserOpsCombFac','PerangkatCombFac','PPOBCombFac','ProvinsisCombFac','KaryawansCombFac','MerchantsCombFac','CustomersCombFac','ProductsCombFac','TransaksiCombFac','OpenCloseBookCombFac','$rootScope','$timeout','$http','$q','$filter','$window','$cordovaSQLite','UtilService',
function(UserOpsCombFac,PerangkatCombFac,PPOBCombFac,ProvinsisCombFac,KaryawansCombFac,MerchantsCombFac,CustomersCombFac,ProductsCombFac,TransaksiCombFac,OpenCloseBookCombFac,$rootScope,$timeout,$http, $q, $filter, $window,$cordovaSQLite,UtilService)
{
    var InitStores = function()
    {
        var deferred        = $q.defer();
        var parameters      = UtilService.GetParameters();
        var timeoutfinish   = 2000;
        var count           = 1;
        OpenCloseBookCombFac.GetOpenCloseBook(parameters)
        .then(function(responseopenbook)
        {
            return responseopenbook;     
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Transaksi Header');
                return TransaksiCombFac.GetTransaksiHeaders(parameters);
            }, timeoutfinish * count++);
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Produk Group');
                return ProductsCombFac.GetProductGroups(parameters);
            }, timeoutfinish * count++);
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Pelanggan');
                return CustomersCombFac.GetCustomers(parameters);
            }, timeoutfinish * count++);
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Type Pembayaran'); //Merchant Type
                return MerchantsCombFac.GetMerchantTypes();
            }, timeoutfinish * count++);   
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Merchant');
                return MerchantsCombFac.GetMerchants(parameters);
            }, timeoutfinish * count++);
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Karyawan');
                return KaryawansCombFac.GetKaryawans(parameters);
            }, timeoutfinish * count++);
        })
        .then(function()
        {
            return ProvinsisCombFac.GetProvinsisComb();
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Produk');
                return ProductsCombFac.GetProducts(parameters);
            }, timeoutfinish * count++);
            
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Produk Unit');
                return ProductsCombFac.GetProductUnits(parameters);
            }, timeoutfinish * count++);
            
        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','PPOB Group');
                return PPOBCombFac.GetGroups();
            }, timeoutfinish * count++);

        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','PPOB Kategori');
                return PPOBCombFac.GetKategoris();
            }, timeoutfinish * count++);

        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Perangkat');
                return PerangkatCombFac.GetPerangkats(parameters);
            }, timeoutfinish * count++);

        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Paket');
                return PerangkatCombFac.GetPakets(parameters);
            }, timeoutfinish * count++);

        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','PPOB Produk');
                return PPOBCombFac.GetProducts();
            }, timeoutfinish * count++);

        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','User Operasional');
                return UserOpsCombFac.GetUserOperationals(parameters);
            }, timeoutfinish * count++);

        })
        .then(function()
        {
            $timeout(function() 
            {
                $rootScope.$broadcast('loading-stores','Sukses');
                deferred.resolve("Sukses");
            }, timeoutfinish * count++);

        },
        function(error)
        {
            deferred.reject(error);
        })
        return deferred.promise;
    }

    return{
            InitStores:InitStores
        }
}])