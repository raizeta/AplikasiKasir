angular.module('starter')
.service('TemplateService', ['$rootScope', '$window', '$q', '$http', '$filter', 'StorageService', function($rootScope,$window,$q,$http,$filter,StorageService)
{
    var ChangeTemplate = function()
    {
        $rootScope.theme = StorageService.get('template');
        element = angular.element(document.querySelectorAll('ion-side-menu-content ion-header-bar'));
        element.removeClass('bar-positive');
        element.removeClass('bar-balanced');
        element.removeClass('bar-assertive');
        element.removeClass('bar-calm');
        element.removeClass('bar-dark');
        if($rootScope.theme)
        {
            element.addClass($rootScope.theme.headerstyle);
        }
        else
        {
            element.addClass('bar-balanced');
            $rootScope.theme = {'name':'balanced','headerstyle': 'bar-balanced','itemstyle':'item-balanced','buttonstyle':'button-balanced','img_display':'img/balanced.png'};
            StorageService.set('template',$rootScope.theme);
        }
    }

    var PrintCashierTemplate = function(datayangmaudiprint,dataheader,kembalian,yangdibayarkan,datakartu)
    {
        const qr = new QRious({size:150,value: dataheader.TRANS_ID});

        var actual = '';
        actual  = '<h1 align="center" style="margin-top:-10px;">'+ dataheader.STORE_NM +'</h1>';
        //actual += '<h3 align="center" style="margin-top:-15px;">+6281260014478</h3>';
        actual += '<div>';
        actual += '<div style="float:left;width:35vw;">No.Trans</div>';
        actual += '<div>: '+ dataheader.SPLIT_TRANS_ID.split('.')[1] + '</div>';
        actual += '</div>';
        actual += '<div>';

        actual += '<div style="float:left;width:35vw;">Kasir</div>';
        actual += '<div>: '+ dataheader.CASHIER_NAME +'</div>';
        actual += '</div>';

        actual += '<div>';
        actual += '<div style="float:left;width:35vw;">Waktu Beli</div>';
        actual += '<div>: '+ $filter('date')(new Date(dataheader.TRANS_DATE),'dd-MM-yyyy HH:mm:ss') + '</div>';
        actual += '</div>';

        actual += '<div>';
        actual += '<div style="float:left;width:35vw;">Pembayaran</div>';
        actual += '<div>: '+ dataheader.TYPE_PAY_NM +'</div>';
        actual += '</div>';
        if(datakartu)
        {
            actual += '<div>';
            actual += '<div style="float:left;width:35vw;">No.Kartu</div>';
            actual += '<div>: '+ datakartu +'</div>';
            actual += '</div>';
        }
        actual += '</br>';

        angular.forEach(datayangmaudiprint,function(value,index)
        {
             if(index == 0)
             {
                actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';
             }
             else
             {
                actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 1px solid rgba(1, 1, 1,1);">';
             }
             actual += '<div style="float:left;width:40vw;">' + (index + 1);

             if(index < 9)
             {
                actual += '.&nbsp;&nbsp;&nbsp;' + value.PRODUCT_NM + '</div>';
             }
             else
             {
               actual += '.' + value.PRODUCT_NM + '</div>';
             }

             actual += '<div style="float:right;">'+ $filter('number')(value.HARGA_JUAL) + ' X ' + value.QTY_INCART;
             if((value.HARGA_JUAL * value.QTY_INCART) < 100000)
             {
                actual += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + $filter('number')(value.HARGA_JUAL * value.QTY_INCART) + '</div>';
             }
             else
             {
                actual += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + $filter('number')(value.HARGA_JUAL * value.QTY_INCART) + '</div>';
             }
             actual += '</div></br>';
        });

//        actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';
//        actual += '<div style="float:left;width:35vw;">Sub Total</div>';
//        actual += '<div style="float:right;">'+ $filter('number')(dataheader.SUB_TOTAL_HARGA) +'</div>';
//        actual += '</div></br>';
//
//        actual += '<div style="padding-top:5px;padding-bottom:5px;">';
//        actual += '<div style="float:left;width:35vw;">PPN (10%)</div>';
//        actual += '<div style="float:right;">'+ $filter('number')(dataheader.PPN) +'</div>';
//        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';
        actual += '<div style="float:left;width:35vw;">Grand Total</div>';
        actual += '<div style="float:right;">'+ $filter('number')(dataheader.TOTAL_HARGA) +'</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;">';
        actual += '<div style="float:left;width:35vw;">Dibayarkan</div>';
        actual += '<div style="float:right;">'+ $filter('number')(yangdibayarkan) +'</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';
        actual += '<div style="float:left;width:35vw;">Kembalian</div>';
        actual += '<div style="float:right;">'+ $filter('number')(kembalian) +'</div>';
        actual += '</div></br>';

        actual += '<p align="center">';
            actual += '<img src="'+ qr.toDataURL() + '" align="middle">';
        actual += '</p>';

        actual += '<h2 align="center">Anda Puas Kami Bahagia</h2>';

        return actual;
    }


    var PrintCloseBookTemplate = function(dataclosebook,profileops)
    {
        var actual = '';
        actual  = '<h1 align="center">TUTUP BUKU</h1>';
        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Kasir</div>';
            actual += '<div>: '+ profileops.PROFILE.NM_DEPAN + '</div>';
        actual += '</div>';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Waktu</div>';
            actual += '<div>: '+ $filter('date')(new Date(dataclosebook.TGL_OPEN),'dd-MM-yyyy HH:mm:ss') + '</div>';
        actual += '</div>';

        actual += '</br>';
        actual += '</br>';
        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Pemasukan</div>';
        actual += '</div>';
        actual += '</br>';
        actual += '<div style="padding-top:0px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Modal Awal</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.CASHINDRAWER) + '</div>';
        actual += '</div></br>';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Tambah Modal</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.ADDCASH) + '</div>';
        actual += '</div></br>';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Hasil Penjualan</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.SELLCASH) + '</div>';
        actual += '</div></br>';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Donasi</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.TOTALDONASI) + '</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Sub Total</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.PEMASUKAN) + '</div>';
        actual += '</div></br>';


        actual += '</br>';
        actual += '</br>';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Pengeluaran</div>';
        actual += '</div>';
        actual += '</br>';

        actual += '<div style="padding-top:0px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Refund</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.TOTALREFUND) + '</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:5px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Sub Total</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.TOTALREFUND) + '</div>';
        actual += '</div></br>';

        actual += '</br>';
        actual += '</br>';
        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Neraca</div>';
        actual += '</div>';
        actual += '</br>';
        actual += '<div style="padding-top:0px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Pemasukan</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.PEMASUKAN) + '</div>';
        actual += '</div></br>';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Pengeluaran</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.TOTALREFUND) + '</div>';
        actual += '</div></br>';

        actual += '<div style="padding-top:0px;padding-bottom:5px;border-top: 3px solid rgba(1, 1, 1,1);">';

        actual += '<div>';
            actual += '<div style="float:left;width:35vw;">Total</div>';
            actual += '<div style="float:right;"> '+ $filter('number')(dataclosebook.TOTALCASH) + '</div>';
        actual += '</div>';


        actual += '<br/><div>';
            actual += '<img src="data:image/png;base64,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">';
        actual += '</div>';



        return actual;
    }

    return {
      ChangeTemplate:ChangeTemplate,
      PrintCashierTemplate:PrintCashierTemplate,
      PrintCloseBookTemplate:PrintCloseBookTemplate
    };
}]);