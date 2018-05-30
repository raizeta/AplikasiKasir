angular.module('starter')
.service('MenuService',['$window','$q','PPOBLiteFac',function($window,$q,PPOBLiteFac)
{
   var GetMenuOperasional = function()
   {
     var menuops = [
                        {
                          name: 'Kasir',icons:'ion-ios-compose',path:'#/tab/sales'
                        },
                        {
                          name: 'Mutasi','icons':'ion-ios-color-filter-outline',
                          items: [
                                    {child:'BUKA BUKU',path:'#/tab/openbook'},
                                    {child:'TUTUP BUKU',path:'#/tab/closebook'},
                                    {child:'SETORAN',path:'#/tab/setoranbook'}
                                  ]
                        },
                        {
                          name: 'Refund','icons':'ion-loop',
                          items: [
                                    {child:'TRANSAKSI',path:'#/tab/refund/transaksi'},
                                    {child:'PRODUK',path:'#/tab/refund/produk'}
                                  ]
                        },
                        {
                          name: 'Laporan','icons':'ion-cash',
                          items: [
                                    {child:'RINGKASAN',path:'#/tab/accounting-summary'},
                                    {child:'TRANSAKSI',path:'#/tab/accounting-transaksi'},
                                    {child:'REFUND',path:'#/tab/accounting-refund'}
                                  ]
                        },
                        
                        {
                          name: 'Karyawan','icons':'ion-person-stalker',
                          items: [
                                    {child:'ABSENSI HARIAN',path:'#/tab/employe/absensi'},
                                    {child:'LAPORAN HARIAN',path:'#/tab/employe/laporan-daily'},
                                    {child:'LAPORAN BULANAN',path:'#/tab/employe/laporan-monthly'}
                                  ]
                        }, 
                        {
                          // name: 'Kontrol','icons':'ion-wrench',path:'#/tab/control/stores',
                          name: 'Kontrol','icons':'ion-monitor',
                          items: [
                                    {child:'TOKO',path:'#/tab/control/stores'},
                                    {child:'PRODUK',path:'#/tab/control/product'},
                                    {child:'PERANGKAT',path:'#/tab/control/perangkat'},
                                    // {child:'TRANSFER SALDO',path:'#/tab/control/dompettoko'},
                                    {child:'DOMPET UTAMA',path:'#/tab/control/dompetutama'},
                                    // {child:'DEPOSIT PPOB',path:'#/tab/control/deposit'},
                                    // {child:'PRODUK GROUP',path:'#/tab/control/groupproduct'},
                                    {child: 'LOG',path:'#/tab/logoffline'}
                                    // {child:'EMPLOYES',path:'#/tab/control/employe'},
                                    // {child:'MERCHANTS',path:'#/tab/control/merchant'}
                                  ]
                        },
                        // {
                        //   name: 'Testing','icons':'ion-wrench',
                        //   items: [
                        //             {child:'LIST TRANSAKSI HEADER',path:'#/tab/testing/transaksiheaders'},
                                    
                                    
                                    
                        //             {child:'LIST PRODUCT ',path:'#/tab/testing/products'},
                                    
                        //             {child:'PRODUCT UNIT',path:'#/tab/testing/productunits'},
                        //             {child:'PRODUCT GROUP INDUSTRI',path:'#/tab/testing/productgroupindustris'},
                        //             {child:'PRODUCT INDUSTRI',path:'#/tab/testing/productindustris'},
                        //             {child:'MERCHANT BANKS',path:'#/tab/testing/merchantbanks'},
                        //             {child:'PRODUCT GROUP',path:'#/tab/testing/productgroups'},
                        //             {child:'MERCHANT TYPES',path:'#/tab/testing/merchanttypes'},
                        //             {child:'LIST MERCHANTS',path:'#/tab/testing/merchants'},
                        //             {child:'LIST STORES',path:'#/tab/testing/stores'},
                        //             {child:'LIST CUSTOMERS',path:'#/tab/testing/customers'},
                        //             {child:'KARYAWANS',path:'#/tab/testing/karyawans'},
                        //           ]
                        // },
                        {
                          name: 'Setelan',icons:'ion-gear-a',
                          items: [
                                    {child:'PROFILE',path:'#/tab/settings/profile'},
                                    {child:'TEMPLATE',path:'#/tab/settings/template'},
                                    {child:'KASIR',path:'#/tab/settings/toko'},
                                    {child:'DEVICE',path:'#/tab/settings/device'},
                                  ]
                        },
                        {
                          name: 'Maintenance',icons:'ion-wrench',path:'#/tab/maintenance'
                        }
                      ];
      return menuops;
   }
   var GetMenuAdmin = function()
   {
     var menuadmin = [
                        {
                          name: 'Kasir',icons:'ion-ios-compose',path:'#/tab/sales'
                        },
                        {
                          name: 'Mutasi','icons':'ion-ios-color-filter-outline',
                          items: [
                                    {child:'BUKA BUKU',path:'#/tab/openbook'},
                                    {child:'TUTUP BUKU',path:'#/tab/closebook'},
                                    {child:'SETORAN',path:'#/tab/setoranbook'}
                                  ]
                        },
                        {
                          name: 'Refund','icons':'ion-loop',
                          items: [
                                    {child:'TRANSAKSI',path:'#/tab/refund/transaksi'},
                                    {child:'PRODUK',path:'#/tab/refund/produk'}
                                  ]
                        },
                        {
                          name: 'Laporan','icons':'ion-cash',
                          items: [
                                    {child:'RINGKASAN',path:'#/tab/accounting-summary'},
                                    {child:'TRANSAKSI',path:'#/tab/accounting-transaksi'},
                                    {child:'REFUND',path:'#/tab/accounting-refund'}
                                  ]
                        },
                        
                        {
                          name: 'Karyawan','icons':'ion-person-stalker',
                          items: [
                                    {child:'ABSENSI HARIAN',path:'#/tab/employe/absensi'},
                                    {child:'LAPORAN HARIAN',path:'#/tab/employe/laporan-daily'},
                                    {child:'LAPORAN BULANAN',path:'#/tab/employe/laporan-monthly'}
                                  ]
                        }, 
                        {
                          // name: 'Kontrol','icons':'ion-wrench',path:'#/tab/control/stores',
                          name: 'Kontrol','icons':'ion-monitor',
                          items: [
                                    {child:'TOKO',path:'#/tab/control/stores'},
                                    {child:'PRODUK',path:'#/tab/control/product'},
                                    {child:'PERANGKAT',path:'#/tab/control/perangkat'},
                                    // {child:'TRANSFER SALDO',path:'#/tab/control/dompettoko'},
                                    {child:'DOMPET UTAMA',path:'#/tab/control/dompetutama'},
                                    // {child:'DEPOSIT PPOB',path:'#/tab/control/deposit'},
                                    // {child:'PRODUK GROUP',path:'#/tab/control/groupproduct'},
                                    {child: 'LOG',path:'#/tab/logoffline'}
                                    // {child:'EMPLOYES',path:'#/tab/control/employe'},
                                    // {child:'MERCHANTS',path:'#/tab/control/merchant'}
                                  ]
                        },
                        // {
                        //   name: 'Testing','icons':'ion-wrench',
                        //   items: [
                        //             {child:'LIST TRANSAKSI HEADER',path:'#/tab/testing/transaksiheaders'},
                                    
                                    
                                    
                        //             {child:'LIST PRODUCT ',path:'#/tab/testing/products'},
                                    
                        //             {child:'PRODUCT UNIT',path:'#/tab/testing/productunits'},
                        //             {child:'PRODUCT GROUP INDUSTRI',path:'#/tab/testing/productgroupindustris'},
                        //             {child:'PRODUCT INDUSTRI',path:'#/tab/testing/productindustris'},
                        //             {child:'MERCHANT BANKS',path:'#/tab/testing/merchantbanks'},
                        //             {child:'PRODUCT GROUP',path:'#/tab/testing/productgroups'},
                        //             {child:'MERCHANT TYPES',path:'#/tab/testing/merchanttypes'},
                        //             {child:'LIST MERCHANTS',path:'#/tab/testing/merchants'},
                        //             {child:'LIST STORES',path:'#/tab/testing/stores'},
                        //             {child:'LIST CUSTOMERS',path:'#/tab/testing/customers'},
                        //             {child:'KARYAWANS',path:'#/tab/testing/karyawans'},
                        //           ]
                        // },
                        {
                          name: 'Setelan',icons:'ion-gear-a',
                          items: [
                                    {child:'PROFILE',path:'#/tab/settings/profile'},
                                    {child:'TEMPLATE',path:'#/tab/settings/template'},
                                    {child:'KASIR',path:'#/tab/settings/toko'},
                                    {child:'DEVICE',path:'#/tab/settings/device'},
                                    {child:'TIMELINE',path:'#/tab/settings/timeline'},
                                  ]
                        },
                        {
                          name: 'Kredit Plus',icons:'ion-gear-a',
                          items: [
                                    {child:'TIMELINE',path:'#/tab/kreditplus/timeline'},
                                  ]
                        },
                        {
                          name: 'Maintenance',icons:'ion-wrench',path:'#/tab/maintenance'
                        }
                      ];
      return menuadmin;
   }

   var GetMenuPPOB = function()
   {
     var deferred    = $q.defer();
     PPOBLiteFac.GetHeaders()
     .then(function(responseheader)
     {
        angular.forEach(responseheader,function(valueheader,indexheader)
        {
            valueheader.icons = 'ion-ios-compose';
            PPOBLiteFac.GetDetailsByHeaderID(valueheader)
            .then(function(responsedetail)
            {
                angular.forEach(responsedetail,function(valuedetail,indexdetail)
                {
                    PPOBLiteFac.GetNominalsByDetailID(valuedetail)
                    .then(function(responsenominal)
                    {
                        valuedetail.DAFTAR_NOMINAL = responsenominal;
                    })
                });
                valueheader.items = responsedetail;
            });

        });

        deferred.resolve(responseheader);
     })
      return deferred.promise;
   }

   var GetMenuRevisiPPOB = function()
   {
     var deferred    = $q.defer();
     PPOBLiteFac.GetGroups()
     .then(function(responseheader)
     {
        angular.forEach(responseheader,function(valueheader,indexheader)
        {
            valueheader.icons = 'ion-ios-compose';
            PPOBLiteFac.GetKategorisByGroupID(valueheader)
            .then(function(responsedetail)
            {
                angular.forEach(responsedetail,function(valuedetail,indexdetail)
                {
                    PPOBLiteFac.GetProductsByKategoriID(valuedetail)
                    .then(function(responsenominal)
                    {
                        valuedetail.DAFTAR_NOMINAL = responsenominal;
                    })
                });
                valueheader.items = responsedetail;
            });

        });
        deferred.resolve(responseheader);
     })
      return deferred.promise;
   }

   var GetMenuMaintenance = function()
   {
     var maintenance = [

                        {
                          name: 'Printer','icons':'ion-ios-color-filter-outline',
                          items: [
                                    {child:'Feed Paper',aliasfunc:'feedpaper'},
                                    {child:'Printer Status',aliasfunc:'printstatus'},
                                    {child:'Print Bill',aliasfunc:'printbill'}
                                  ]
                        },
                        {
                          name: 'LED','icons':'ion-ios-color-filter-outline',
                          items: [
                                    {child:'Turn on All',aliasfunc:'turnonall'},
                                    {child:'Turn off All',aliasfunc:'turnoffall'},
                                    {child:'Operate Red Light',aliasfunc:'redlight'},
                                    {child:'Operate Green Light',aliasfunc:'greenlight'},
                                    {child:'Operate Yellow Light',aliasfunc:'yellowlight'},
                                    {child:'Operate Blue Light',aliasfunc:'bluelight'},
                                    {child:'Turn on Blue and Red Lights',aliasfunc:'blueandredlight'},
                                  ]

                        },
                        {
                          name: 'WIFI','icons':'ion-ios-color-filter-outline',
                          items: [
                                    {child:'Open',aliasfunc:'openwifi'},
                                    {child:'Close',aliasfunc:'closewifi'},
                                    {child:'Get WIFI List',aliasfunc:'listwifi'},
                                    {child:'Get WIFI Info',aliasfunc:'infowifi'},
                                    {child:'Config WIFI',aliasfunc:'configwifi'},
                                    {child:'Get Config List',aliasfunc:'configwifilist'},
                                    {child:'Is Config Exist',aliasfunc:'configexistwifi'}
                                  ]

                        },
                        {
                          name: 'Scan','icons':'ion-ios-color-filter-outline',
                          items: [
                                    {child:'Open Scanner',aliasfunc:'openscanner'},
                                    {child:'Init Scanner(Front Camera)',aliasfunc:'initfrontscanner'},
                                    {child:'Init Scanner(Back Camera)',aliasfunc:'initbackscanner'},
                                    {child:'Start Scan',aliasfunc:'startscanner'},
                                    {child:'Stop Scan',aliasfunc:'stopscanner'},
                                    {child:'Close Scanner',aliasfunc:'closescanner'}
                                  ]

                        },
                        {
                          name: 'Beeper','icons':'ion-ios-color-filter-outline',
                          items: [
                                    {child:'Normal',aliasfunc:'normalbeeper'},
                                    {child:'Error',aliasfunc:'errorbeeper'},
                                    {child:'Interval',aliasfunc:'intervalbeeper'},
                                    {child:'Beep 2s',aliasfunc:'timeoutbeeper'}
                                  ]

                        }
                      ];
      return maintenance;
   }


   return {
      GetMenuOperasional:GetMenuOperasional,
      GetMenuAdmin:GetMenuAdmin,
      GetMenuPPOB:GetMenuPPOB,
      GetMenuRevisiPPOB:GetMenuRevisiPPOB,
      GetMenuMaintenance:GetMenuMaintenance
   }
}])