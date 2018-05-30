angular.module('starter')
.controller('RefundTransaksiCtrl',['TransaksiCombFac','TransaksisLiteFac','ShopCartLiteFac','ProductsLiteFac','ToastService','ConstructorService','$ionicActionSheet','$cordovaDialogs','$cordovaToast','$scope','$ionicLoading','$ionicModal','$filter','UtilService','StorageService',
function(TransaksiCombFac,TransaksisLiteFac,ShopCartLiteFac,ProductsLiteFac,ToastService,ConstructorService,$ionicActionSheet,$cordovaDialogs,$cordovaToast,$scope,$ionicLoading,$ionicModal,$filter,UtilService,StorageService)
{
    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        $scope.$apply();
    }, false);

    $scope.namatoko = StorageService.get('advanced-profile').STORES_ACTIVE.STORE_NM;
    
    var parameters                  = UtilService.GetParameters();

    
    $scope.SubmitRefundTransaksi = function(totalpembayaran)
    {
        $cordovaDialogs.confirm('Apakah Kamu Yakin Akan Melakukan Refund?', ['Yes','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $ionicLoading.show
                ({
                    noBackdrop:false,
                    hideOnStateChange:true,
                    template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
                });
                $scope.buttonsubmitrefund   = {disabled:true};
                var parameters              = UtilService.GetParameters();
                $scope.nomortransaksirefund = UtilService.GenerateNomorTransaksiRefund(parameters);

                var parameters              = ConstructorService.TransaksiHeaderConstructor($scope.nomortransaksirefund,'manual');;
                parameters.TRANS_ID         = $scope.nomortransaksirefund;
                parameters.SPLIT_TRANS_ID   = $scope.nomortransaksirefund.split('.')[3] + '.' + $scope.nomortransaksirefund.split('.')[4];
                parameters.TOTAL_PRODUCT    = $scope.datayangdibeli.length;
                parameters.SUB_TOTAL_HARGA  = totalpembayaran;
                parameters.PPN              = 0;
                parameters.TOTAL_HARGA      = totalpembayaran;
                parameters.STATUS           = 1;
                parameters.DCRP_DETIL       = 'REFUND';
                parameters.TRANS_REF        = $scope.transheader.TRANS_ID;
                parameters.TRANS_TYPE       = 1;//Refund Transaksi

                TransaksisLiteFac.CreateTransaksiHeaders(parameters)
                .then(function(reponse)
                {
                    angular.forEach($scope.datayangdibeli,function(value,index)
                    {
                        value.ACCESS_ID            = parameters.ACCESS_ID;
                        value.TRANS_ID             = $scope.nomortransaksirefund;
                        value.TRANS_TYPE           = 1;
                        value.STATUS               = 1;

                        ShopCartLiteFac.CreateShopCartRefund(value)
                        .then(function(responsecreaterefund)
                        {
                            console.log(responsecreaterefund);
                        },
                        function(error)
                        {
                            console.log(error);
                        });
                    });
                })
                .then(function()
                {
                    var datatoupdate = {};
                    datatoupdate.TRANS_REF = $scope.nomortransaksirefund;
                    datatoupdate.TRANS_ID  = $scope.transheader.TRANS_ID;
                    TransaksisLiteFac.UpdateTransaksiRef(datatoupdate)
                    .then(function(responseupdatenoref)
                    {
                        ToastService.ShowToast('Transaksi Berhasil Di Refund','success');
                    },
                    function(error)
                    {
                        ToastService.ShowToast('Transaksi Gagal Di Refund','error');
                    })
                },
                function(error)
                {
                    console.log(error)
                })
                .finally(function()
                {
                    $ionicLoading.hide();
                })

            }
        });
    }
/** AKHIR DARI ADD TO CART FUNCTION **/

/** AWAL DARI CARI NOMOR TRANSAKSI FUNCTION **/
    $scope.transheader = {};

    $scope.searchtransheader   = function(transaksiheader)
    {
        TransaksisLiteFac.SearchStringInTransID(transaksiheader.transid)
        .then(function(response)
        {
            return response;
            if(response.length > 0)
            {
                return response[0];
            }
        })
        .then(function(responsetransheader)
        {
            if(responsetransheader.length > 0)
            {
                $scope.headerdetail         = angular.copy(responsetransheader[0]); 
                $scope.transheader.TRANS_ID = responsetransheader[0].TRANS_ID;

                var parameters              = UtilService.GetParameters();
                parameters.TRANS_ID         = responsetransheader[0].TRANS_ID;  
                TransaksiCombFac.GetTransaksiDetails(parameters)
                .then(function(restransaksidetails)
                {
                    $scope.datayangdibeli    = restransaksidetails;
                });
            }
            else
            {
                $scope.headerdetail = undefined;
            }
        },
        function(error)
        {
            console.log(error)
        });
    }
    $scope.searchtransheader($scope.transheader);

    $scope.searchbyscanqrcode = function()
    {
        var nymph = require('nymph');
        nymph.dev.scanner.startScan(20, function (err, result)
        {
            if (err)
            {
                if(err.code == 'CANCELLED')
                {
                    $scope.aktifkanscanbarcode = false;
                }
                else if(err.code == 'TIMEOUT')
                {
                    ToastService.ShowToast('Timeout','error');
                }
            }
            else
            {
                $scope.transheader          = {};
                $scope.transheader.TRANS_ID = result;
                $scope.transheader.transid  = result.split('.')[4];
                $scope.searchtransheader($scope.transheader);
            }
        });
    }
/** AWAL DARI CARI NOMOR TRANSAKSI FUNCTION**/
    $scope.hitungtotal = function(datahitung)
    {
        var total = UtilService.SumPriceWithQtyWithPPN(datahitung,'HARGA_JUAL','QTY_INCART','CURRENT_PPN');  
        return total;
    }

}])


