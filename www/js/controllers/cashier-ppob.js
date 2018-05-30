angular.module('starter')
.controller('CashierPPOBCtrl',['$scope','PPOBLiteFac','UtilService','$state',
function($scope,PPOBLiteFac,UtilService,$state)
{
    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
    }, false);

    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        PPOBLiteFac.GetGroups()
        .then(function(response)
        {
            $scope.groupsmenu = response;
        }) 
    });
    $scope.gotoformisian = function(kelompokform)
    {
        var parameters;
        if(kelompokform == 'paketdata')
        {
            $state.go('tab.sales-ppob-form-pulsa', {kelompok:'paketinternet'});
        }
        else if(kelompokform == 'pulsareguler')
        {
            $state.go('tab.sales-ppob-form-pulsa', {kelompok:'pulsareguler'}); 
        }
        else if(kelompokform == 'paketsms')
        {
            $state.go('tab.sales-ppob-form-pulsa', {kelompok:'paketsms'}); 
        }
        else if(kelompokform == 'pakettelepon')
        {
            $state.go('tab.sales-ppob-form-pulsa', {kelompok:'pakettelepon'}); 
        }
        else if(kelompokform == 'mobilepascabayar')
        {
            $state.go('tab.sales-ppob-form-pulsa', {kelompok:'mobilepascabayar'}); 
        }
        else if(kelompokform == 'tokenpln')
        {
            $state.go('tab.sales-ppob-form-tokenpln'); 
        }
        else if(kelompokform == 'vouchergame')
        {
            $state.go('tab.sales-ppob-form-vouchergame'); 
        }

        
    }

}])
.controller('CashierPPOBKelompokCtrl',['TransaksisLiteFac','MerchantsCombFac','ShopCartLiteFac','ProviderPrefixService','PPOBLiteFac','$ionicHistory','ToastService','StorageService','UtilService','ConstructorService','$ionicLoading','$cordovaDialogs','$ionicModal','$timeout','$filter','$scope','$ionicPopup','$state','$stateParams','$ionicHistory',
function(TransaksisLiteFac,MerchantsCombFac,ShopCartLiteFac,ProviderPrefixService,PPOBLiteFac,$ionicHistory,ToastService,StorageService,UtilService,ConstructorService,$ionicLoading,$cordovaDialogs,$ionicModal,$timeout,$filter,$scope,$ionicPopup,$state,$stateParams,$ionicHistory)
{
    $scope.screenbesar = UtilService.CheckScreenSize();
    $scope.paramurl    = $stateParams.kelompok;
    $scope.searchpelanggan = {'string':''};
    $scope.kirimkemail     = {'valuechoose':'TIDAK'};
    
    $scope.alasan = [
                    {'todo':'REGULAR','checked':true},
                    {'todo':'MEMBER','checked':false}
                ];

    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
    }, false);

    MerchantsCombFac.GetMerchantTypes()
    .then(function(responsemerchanttypes)
    {
        $scope.typepembayarans              = responsemerchanttypes;
        $scope.choicetypepembayarandefault  = $scope.typepembayarans[0];
        $scope.provider                     = {valuechoose:null};   
    })
    .then(function()
    {  
        MerchantsCombFac.GetMerchants(parameters)
        .then(function(resgetmerchants)
        {
            $scope.listmerchants = resgetmerchants;
        },
        function(error)
        {
            console.log(error);
        });
    })

    $scope.datapembelianppob = {};
    $scope.nomorteleponchange = function()
    {
        if($scope.datapembelianppob.MSISDN.length == 4)
        {
            var parammobile                     = {};
            if($scope.paramurl == 'paketinternet')
            {
                $scope.datapembelianppob.PROVIDER   = ProviderPrefixService.GetProviderByPrefix($scope.datapembelianppob.MSISDN);
                parammobile.KELOMPOK                = 'PAKET INTERNET';
                parammobile.KTG_NM                  = $scope.datapembelianppob.PROVIDER + ' DATA' ;
            }
            else if($scope.paramurl == 'pulsareguler')
            {
                $scope.datapembelianppob.PROVIDER   = ProviderPrefixService.GetProviderByPrefix($scope.datapembelianppob.MSISDN);
                parammobile.KELOMPOK                = 'PULSA REGULER';
                parammobile.KTG_NM                  = $scope.datapembelianppob.PROVIDER;
            }
            else if($scope.paramurl == 'paketsms')
            {
                $scope.datapembelianppob.PROVIDER   = ProviderPrefixService.GetProviderByPrefix($scope.datapembelianppob.MSISDN);
                parammobile.KELOMPOK                = 'PULSA REGULER';
                parammobile.KTG_NM                  = $scope.datapembelianppob.PROVIDER + ' SMS' ;
            }
            else if($scope.paramurl == 'pakettelepon')
            {
                $scope.datapembelianppob.PROVIDER   = ProviderPrefixService.GetProviderByPrefix($scope.datapembelianppob.MSISDN);
                parammobile.KELOMPOK                = 'PULSA REGULER';
                parammobile.KTG_NM                  = $scope.datapembelianppob.PROVIDER + ' TELPON' ;
            }

            console.log(parammobile);
            PPOBLiteFac.GetProductsByKelompokNameAndKategoriName(parammobile)
            .then(function(responsenominal)
            {
                $scope.datapembelianppob.DAFTAR_NOMINAL = responsenominal;
            })
        }
        else if($scope.datapembelianppob.MSISDN.length < 4)
        {
           $scope.datapembelianppob.PROVIDER        = '';
           $scope.datapembelianppob.HARGA_JUAL      = '';
           $scope.datapembelianppob.NAME            = '';

        }
    }
    $scope.inputnominalpulsa = function()
    {
        $scope.datanominals       = $scope.datapembelianppob.DAFTAR_NOMINAL;
        $scope.choicekodenominal  = {CODE:null};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/formisian/popupnominalpulsa.html',
          title: 'PILIH JUMLAH NOMINAL?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {

            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                if($scope.choicekodenominal.CODE != null)
                {
                    var index       = _.findIndex($scope.datanominals,{'CODE':$scope.choicekodenominal.CODE});
                    var datanominal = $scope.datanominals[index];
                    $scope.datapembelianppob.NILAI_NOMINAL  = $filter('ktoNumber')(datanominal.NOMINAL);
                    $scope.datapembelianppob.HARGA_KG       = datanominal.HARGA_KG;
                    $scope.datapembelianppob.CODE           = datanominal.CODE;
                    $scope.datapembelianppob.DENOM          = datanominal.DENOM;
                    $scope.datapembelianppob.HARGA_JUAL     = datanominal.HARGA_JUAL;
                    $scope.datapembelianppob.ID_CODE        = datanominal.ID_CODE;
                    $scope.datapembelianppob.ID_PRODUK      = datanominal.ID_PRODUK;
                    $scope.datapembelianppob.KELOMPOK       = datanominal.KELOMPOK;
                    $scope.datapembelianppob.KTG_ID         = datanominal.KTG_ID;
                    $scope.datapembelianppob.KTG_NM         = datanominal.KTG_NM;
                    $scope.datapembelianppob.NAME           = datanominal.NAME;
                    $scope.datapembelianppob.TYPE_NM        = datanominal.TYPE_NM;
                }
            }
          }]
        });
    }

    var parameters                  = UtilService.GetParameters();
    $scope.nomortransaksiheader     = UtilService.GenerateNomorTransaksiPPOB(parameters);

/** AWAL DARI PEMBAYARAN FUNCTION **/
    $scope.openmodalpembayaran = function()
    {
        $scope.totalpembayaran          = $scope.datapembelianppob.HARGA_JUAL;
        $scope.yangdibayarkan           = UtilService.PembayaranFunc($scope.totalpembayaran);
        $scope.radiopembayaranchange($scope.totalpembayaran);
        $ionicModal.fromTemplateUrl('templates/sales/kasir-ppob/modalpembayaran.html', 
        {
            scope: $scope,
            animation: 'slide-in-left',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.pelangganradio           = {'valuechoose':'REGULAR'};
            $scope.datapelanggan            = {};
            $scope.statusdonasi             = {'checked':false};
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalpembayaran);
            if(resultcheckmodal)
            {
                $scope.modalpembayaran          = modal;
                $scope.modalpembayaran.show();
            }
        });
    }

    $scope.closemodalpembayaran = function(status)
    {
        $scope.modalpembayaran.remove();
        if(status == 'success')
        {
            $ionicHistory.backView().go();
        }
    }

    $scope.submitmodalpembayaran = function() 
    {
        function lanjutnextstep(datakartu)
        {
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
            });


            var parameters              = ConstructorService.TransaksiHeaderConstructor($scope.nomortransaksiheader,'manual');
            parameters.TRANS_ID         = $scope.nomortransaksiheader;
            parameters.SPLIT_TRANS_ID   = $scope.nomortransaksiheader.split('.')[3] + '.' + $scope.nomortransaksiheader.split('.')[4];
            parameters.TOTAL_PRODUCT    = 1;
            parameters.SUB_TOTAL_HARGA  = $scope.totalpembayaransebelumpajak;
            parameters.PPN              = $scope.biayapajak;
            parameters.TOTAL_HARGA      = $scope.totalpembayaran;
            parameters.TRANS_TYPE       = 2;//PPOB
            if($scope.statusdonasi.checked)
            {
                parameters.DO_KEM_TYPE      = 1;
            }
            else
            {
                parameters.DO_KEM_TYPE      = 0;
            }

            parameters.DO_KEM           = $scope.sisapembayaran;
            parameters.OPENCLOSE_ID     = StorageService.get('basic-parameters').OPENCLOSE_ID;
            parameters.STATUS           = 1;

            if($scope.pelangganradio.valuechoose != 'REGULAR' && $scope.customerchoose)
            {
                parameters.CONSUMER_NM      = $scope.customerchoose.NAME;
                parameters.CONSUMER_EMAIL   = $scope.customerchoose.EMAIL;
                parameters.CONSUMER_PHONE   = $scope.customerchoose.PHONE;
            }

            parameters.TYPE_PAY_ID      = $scope.choicetypepembayarandefault.TYPE_PAY_ID;
            parameters.TYPE_PAY_NM      = $scope.choicetypepembayarandefault.TYPE_PAY_NM;

            if($scope.choicetypepembayarandefault.TYPE_PAY_ID == 2 || $scope.choicetypepembayarandefault.TYPE_PAY_ID == 3)
            {
                parameters.BANK_ID          = $scope.provider.valuechoose.BANK_ID;
                parameters.BANK_NM          = $scope.provider.valuechoose.BANK_NM;
                parameters.MERCHANT_ID      = $scope.provider.valuechoose.MERCHANT_ID;
                parameters.MERCHANT_NM      = $scope.provider.valuechoose.MERCHANT_NM;
                parameters.MERCHANT_NO      = $scope.provider.valuechoose.MERCHANT_NO;
            }


            TransaksisLiteFac.CreateTransaksiHeaders(parameters)
            .then(function(response)
            {
                StorageService.destroy('nomortransaksippobyangaktif');
                ToastService.ShowToast('Transaksi Berhasil Disimpan','success');
            })
            .then(function()
            {
                var paramppob                   = UtilService.GetParameters();
                paramppob.TRANS_DATE           = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                paramppob.GOLONGAN             = $scope.datapembelianppob.KELOMPOK;
                paramppob.PRODUCT_ID           = $scope.datapembelianppob.ID_PRODUK;
                paramppob.PRODUCT_NM           = $scope.datapembelianppob.NAME;
                paramppob.PRODUCT_PROVIDER     = $scope.datapembelianppob.KTG_NM;
                paramppob.PRODUCT_PROVIDER_NO  = $scope.datapembelianppob.HEADER_NM;
                paramppob.PRODUCT_PROVIDER_NM  = $scope.datapembelianppob.HEADER_NM;
                paramppob.UNIT_ID              = $scope.datapembelianppob.HEADER_NM;
                paramppob.UNIT_NM              = $scope.datapembelianppob.HEADER_NM;
                paramppob.TRANS_TYPE           = 2; //0:Transaksi Kasir,1:Transaksi Refund,2:Transaksi PPOB

                paramppob.HARGA_JUAL           = Number($scope.datapembelianppob.HARGA_JUAL);
                paramppob.QTY_INCART           = 1;
                paramppob.PROMO                = null;
                paramppob.TRANS_ID             = $scope.nomortransaksiheader;
                paramppob.DISCOUNT             = 0;
                paramppob.STATUS               = 1; //0:Belum Bayar;1:Sudah Bayar

                paramppob.PEMBAYARAN           = $scope.datapembelianppob.HARGA_JUAL;
                paramppob.MSISDN               = $scope.datapembelianppob.MSISDN;
                paramppob.ID_PELANGGAN         = $scope.datapembelianppob.MSISDN;
                paramppob.HARGA_KG             = $scope.datapembelianppob.HARGA_KG;
                paramppob.CODE                 = $scope.datapembelianppob.CODE;
                paramppob.DENOM                = $scope.datapembelianppob.DENOM;
                paramppob.HARGA_JUAL           = $scope.datapembelianppob.HARGA_JUAL;
                paramppob.ID_CODE              = $scope.datapembelianppob.ID_CODE;
                paramppob.ID_PRODUK            = $scope.datapembelianppob.ID_PRODUK;
                paramppob.KELOMPOK             = $scope.datapembelianppob.KELOMPOK;
                paramppob.KTG_ID               = $scope.datapembelianppob.KTG_ID;
                paramppob.KTG_NM               = $scope.datapembelianppob.KTG_NM;
                paramppob.NAME                 = $scope.datapembelianppob.NAME;
                paramppob.TYPE_NM              = $scope.datapembelianppob.TYPE_NM;
                paramppob.PEMBAYARAN           = $scope.datapembelianppob.HARGA_JUAL;
                paramppob.STATUS_BELI          = 6; //0:Belum Bayar,1:Sudah Bayar

                ShopCartLiteFac.CreateShopCart(paramppob)
                .then(function(response)
                {
                    console.log("Memasukkan Ke Shop Cart Kasir");
                },
                function(error)
                {
                    console.log(error);
                });

                ShopCartLiteFac.CreateShopCartPPOB(paramppob)
                .then(function(response)
                {
                    console.log("Memasukkan Ke Shop Cart PPOB");
                },
                function(error)
                {
                    console.log(error);
                });
                
                // var printtemplate = TemplatePrintService.PrintPPOBTemplate(paramppob,parameters,$scope.sisapembayaran,$scope.pembayaran.uang,datakartu);
                // NymphPrinterService.printReceipt(printtemplate);
            })
            .then(function()
            {
                $timeout(function ()
                {
                    $ionicLoading.hide();
                    $scope.choicetypepembayarandefault  = $scope.typepembayarans[0];
                    $scope.provider                     = {valuechoose:null};
                    $scope.pelangganradio               = {valuechoose:'REGULAR'};
                    $scope.alasan = [
                        {'todo':'REGULAR','checked':true},
                        {'todo':'MEMBER','checked':false}
                    ];
                    $scope.closemodalpembayaran('success');

                },2000);
            },
            function(error)
            {
                ToastService.ShowToast('Transaksi Gagal Disimpan','error');
            });
        }

        if($scope.choicetypepembayarandefault.TYPE_PAY_ID == 2 || $scope.choicetypepembayarandefault.TYPE_PAY_ID == 3)
        {
            if($scope.provider.valuechoose && ($scope.choicetypepembayarandefault.TYPE_PAY_ID == $scope.provider.valuechoose.TYPE_PAY_ID))
            {
                lanjutnextstep();
            }
            else
            {
                $cordovaDialogs.alert("Merchant Pembayaran Tidak Boleh Kosong.Pilih Merchant Terlebih Dahulu");
            }
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


    //Fungsi Yang Digunakan Untuk Memilih Tipe Pembaran Apakah Tunai Atau Non-Tunai
    //Default Type Pembayaran Yang Dipilih Adalah Pembayaran Tunai
    $scope.selecttypepembayaran = function(choicetypepembayarandefault)
    {
        $scope.choicetypepembayaran             = {'TYPE_PAY_ID':choicetypepembayarandefault.TYPE_PAY_ID};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/pembayaran/popuptypepembayaran.html',
          title: 'PILIH METODE PEMBAYARAN?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                $scope.choicetypepembayaran = $scope.choicetypepembayarandefault;     
            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var index           = _.findIndex($scope.typepembayarans,{'TYPE_PAY_ID':$scope.choicetypepembayaran.TYPE_PAY_ID});
                var result          = angular.copy($scope.typepembayarans[index]);
                $scope.choicetypepembayarandefault = result;
                if($scope.choicetypepembayarandefault.TYPE_PAY_ID == 1)
                {
                    //JIKA TYPE PEMBAYARAN TUNAI
                    $scope.yangdibayarkan           = UtilService.PembayaranFunc($scope.totalpembayaran);
                    $scope.radiopembayaranchange($scope.totalpembayaran);
                }
                else
                {
                    //JIKA TYPE PEMBAYARAN NON-TUNAI
                    $scope.yangdibayarkan           = [{'yangdibayar':$scope.totalpembayaran}];
                    $scope.radiopembayaranchange($scope.totalpembayaran);
                }
            }
          }]
        });
    }

    //Fungsi Yang Digunakan Untuk Memilih Nominal Yang Telah Disediakan Oleh Kontrol Gampang
    //Default Nominal Yang Dipilih Adalah Total Nominal Yang Harus Dibayarkan
    $scope.radiopembayaranchange = function(nominal)
    {
        var nominal         = angular.copy(nominal);
        $scope.pembayaran   = {'uang':nominal};
        if(nominal > $scope.totalpembayaran)
        {
            $scope.sisapembayaran       = Number(nominal) - Number($scope.totalpembayaran);
        }
        else
        {
            $scope.sisapembayaran       = Number($scope.totalpembayaran) - Number(nominal);
        }
        
    }

    //Fungsi Jika Nominal Pembayaran Diinput Secara Manual Dari Form Inputan
    $scope.changemanual = function()
    {
        if($scope.pembayaran.uang > $scope.totalpembayaran)
        {
            $scope.sisapembayaran       = Number($scope.pembayaran.uang) - Number($scope.totalpembayaran);   
        }
        else
        {
            $scope.sisapembayaran       = Number($scope.totalpembayaran) - Number($scope.pembayaran.uang);    
        }
    }

    //Fungsi Untuk Mencari Pelanggan Jika Mode Yang Dipilih Adalah Member
    $scope.changefilterpelanggan = function(valuefilter)
    {
        if(valuefilter.length > 3)
        {
            $scope.showdatapelanggan  = true;
        }
        else
        {
            $scope.showdatapelanggan  = false;
        }

        $scope.filterpelanggan = valuefilter;   
    }

/** AKHIR DARI PEMBAYARAN FUNCTION **/


}])

