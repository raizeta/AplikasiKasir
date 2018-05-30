//Car Migrasi Dari Proyek Ionic Ke Proyek Mesin EDC


//Hapus 'ngAnimate','ion-sticky','auth0' dari module dependency
//Hapus 'auth' dari run dependency

//Kopi Code Dibawah Pada File app.js,Insert Posisinya Dibawah run
//Inject Dependency NymphEmvService,NymphScannerService

var nymph = require('nymph');
nymph.sys.deviceStatus.init();
nymph.app.start({businessId: '00000001'},
function (err, result)
{
    if (err)
    {
        ToastService.ShowToast('App sign-in failed:' + JSON.stringify(err),'error');
    }
    else
    {
        NymphEmvService.initEmv();
        NymphScannerService.openScanner();
        NymphScannerService.initScannerBack();
    }
});

$scope.aktifkanscanbarcode = false;
$scope.scanbarcode = function()
{
    $scope.aktifkanscanbarcode = true;
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
            var indexproduct    = _.findIndex($scope.databarangpenjualan,{'PRODUCT_QR':result});
            if(indexproduct > -1)
            {
                $scope.tambahqtyitem($scope.databarangpenjualan[indexproduct],indexproduct);
                $timeout(function()
                {
                    $scope.scanbarcode();
                },500);
            }
            else
            {
                ToastService.ShowToast('Barcode Produk Belum Terdaftar','error');
                $timeout(function()
                {
                    $scope.scanbarcode();
                },500);
            }
        }
    });

}

$scope.tambahqtyitem = function(itemproduct,indexproduct)
{
    var itemproduct = angular.copy(itemproduct);
    if($scope.openbookdata.sudahopenbelum)
    {
        if($scope.soundon.on)
        {
            $scope.audio = new Audio('img/beep-07.wav');
            $scope.audio.play();
        }
        if(itemproduct.CURRENT_STOCK > 0)
        {
            var parameters                          = UtilService.GetParameters();
            var datashopcarttosave                  = ConstructorService.ProductAddToShopCart(itemproduct);
            datashopcarttosave.ACCESS_ID            = parameters.ACCESS_ID;
            datashopcarttosave.TRANS_ID             = $scope.nomortransaksiheader;
            datashopcarttosave.OFLINE_ID            = $scope.nomortransaksiheader;

            if(itemproduct.QTY_INCART && itemproduct.QTY_INCART > 0)
            {
                itemproduct.QTY_INCART        += 1;
                datashopcarttosave.QTY_INCART  = itemproduct.QTY_INCART;
                var index_itemincart           = _.findIndex($scope.itemincart,{'PRODUCT_ID': itemproduct.PRODUCT_ID});
                $scope.itemincart[index_itemincart].QTY_INCART += 1;
                ShopCartLiteFac.UpdateShopCartQty(datashopcarttosave);
            }
            else
            {
                itemproduct.QTY_INCART         = 1;
                datashopcarttosave.QTY_INCART  = itemproduct.QTY_INCART;
                $scope.banyakdicart           += 1;
                $scope.itemincart.push(datashopcarttosave);
                ShopCartLiteFac.CreateShopCart(datashopcarttosave);
            }
            itemproduct.CURRENT_STOCK               -= 1;
            $scope.databarangpenjualan[indexproduct] = itemproduct;
            datashopcarttosave.CURRENT_STOCK   = itemproduct.CURRENT_STOCK;
            ProductsLiteFac.UpdateProductsQuantity(datashopcarttosave);
        }
        else
        {
            ToastService.ShowToast('Quantity Tidak Mencukupi','error');
        }

    }
    else
    {
        $scope.modalopenclosebookopen();
    }
}

$scope.submitmodalpembayaran = function()
{
    function lanjutnextstep()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        TransaksisLiteFac.GetTransaksiHeaderByTransIDStatusNol($scope.nomortransaksiheader)
        .then(function(responsegetbynomortransaksi)
        {
            var parameters              = ConstructorService.TransaksiHeaderConstructor($scope.nomortransaksiheader,'manual');
            parameters.TOTAL_PRODUCT    = $scope.itemincart.length;
            parameters.SUB_TOTAL_HARGA  = $scope.totalpembayaransebelumpajak;
            parameters.PPN              = $scope.biayapajak;
            parameters.TOTAL_HARGA      = $scope.totalpembayaran;
            parameters.OPENCLOSE_ID     = $scope.openbookdata.OPENCLOSE_ID;
            parameters.STATUS           = 1;

            if($scope.pelangganradio.valuechoose != 'REGULAR' && $scope.customerchoose)
            {
                parameters.CONSUMER_NM      = $scope.customerchoose.NAME;
                parameters.CONSUMER_EMAIL   = $scope.customerchoose.EMAIL;
                parameters.CONSUMER_PHONE   = $scope.customerchoose.PHONE;
            }

            if($scope.choicetypepembayarandefault.TYPE_PAY_ID != 1)
            {
                parameters.TYPE_PAY_ID      = $scope.choicetypepembayarandefault.TYPE_PAY_ID;
                parameters.TYPE_PAY_NM      = $scope.choicetypepembayarandefault.TYPE_PAY_NM;
                parameters.BANK_ID          = 'BANK0001';
                parameters.BANK_NM          = 'BANK BNI';
                parameters.MERCHANT_ID      = 'MERCHANT0001';
                parameters.MERCHANT_NM      = 'BNI 46';
                parameters.MERCHANT_NO      = '10700135';
            }

            if(responsegetbynomortransaksi.length == 0)
            {
                parameters.TRANS_ID         = $scope.nomortransaksiheader;
                parameters.SPLIT_TRANS_ID   = $scope.nomortransaksiheader.split('.')[3] + '.' + $scope.nomortransaksiheader.split('.')[4];

                TransaksisLiteFac.CreateTransaksiHeaders(parameters)
                .then(function(response)
                {
                    StorageService.destroy('nomortransaksiyangaktif');
                    ToastService.ShowToast('Transaksi Berhasil Disimpan','success');
                },
                function(error)
                {
                    ToastService.ShowToast('Transaksi Gagal Disimpan','error');
                });

                SaveToBillLiteFac.DeleteSaveToBillByNomorTrans($scope.nomortransaksiheader);
            }

            var printtemplate = TemplateService.PrintCashierTemplate($scope.itemincart,parameters,$scope.sisapembayaran,$scope.pembayaran.uang);
            NymphPrinterService.printReceipt(printtemplate);

            var productyangdibeli = angular.copy($scope.itemincart);
            for(var i = productyangdibeli.length - 1;i >= 0;i--)
            {
                productyangdibeli[i].PRODUCT_QTY    = productyangdibeli[i].QTY_INCART;
                productyangdibeli[i].STATUS         = 1;
                var updatestatusitemincart          = angular.copy(productyangdibeli[i]);
                ShopCartLiteFac.UpdateStatusPembelian(updatestatusitemincart);
                if(productyangdibeli[i].GOLONGAN != undefined)
                {
                    updatestatusitemincart.STATUS_BELI = 6;
                    ShopCartLiteFac.UpdateShopCartPPOBStatus(updatestatusitemincart);
                }
            }

            $timeout(function ()
            {
                if($scope.modalviewitemincart)
                {
                    $scope.modalviewitemincart.remove();
                }
                $scope.choicetypepembayarandefault  = $scope.typepembayarans[0];
                $scope.provider                     = {valuechoose:null};
                $scope.pelangganradio               = {valuechoose:'REGULAR'};
                $scope.alasan = [
                    {'todo':'REGULAR','checked':true},
                    {'todo':'MEMBER','checked':false}
                ];
                $scope.loadnomortransaksiheaders();
                $scope.modalpembayaran.remove();

            },2000);
        },
        function(error)
        {
            ToastService.ShowToast(error,'error');
        });
    }

    if($scope.choicetypepembayarandefault.TYPE_PAY_ID != 1)
    {
        NymphCardService.acquireCardAsync();
        $scope.$on('pembayaran-sukses',function()
        {
            $timeout(function()
            {
                lanjutnextstep();
            },500);

        });
    }
    else
    {
        if($scope.pembayaran.uang < $scope.totalpembayaran)
        {
            $cordovaDialogs.alert('Pembayaran Belum Cukup.');
        }
        else
        {
            lanjutnextstep();
        }
    }


};

