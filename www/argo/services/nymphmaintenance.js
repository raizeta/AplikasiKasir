angular.module('starter')
.service('MaintenanceService',['NymphPinPadService','NymphEmvService','NymphCardService','NymphWifiService','NymphGprsService','NymphScannerService','NymphPrinterService','NymphLedService','NymphBeepService',
function(NymphPinPadService,NymphEmvService,NymphCardService,NymphWifiService,NymphGprsService,NymphScannerService,NymphPrinterService,NymphLedService,NymphBeepService)
{
    var TestMaintenance = function(aliasfunction)
    {
      switch (aliasfunction)
      {
          case 'feedpaper':
              NymphPrinterService.feedPaper(aliasfunction)
              break;
          case 'printstatus':
              NymphPrinterService.printerStatus(aliasfunction)
              break;
          case 'printbill':
              NymphPrinterService.log(aliasfunction)
              break;

          case 'turnonall':
              NymphLedService.turnOnAll(aliasfunction);
              break;
          case 'turnoffall':
              NymphLedService.turnOffAll(aliasfunction);
              break;
          case 'redlight':
              NymphLedService.operateRedLed(aliasfunction);
              break;
          case 'greenlight':
              NymphLedService.operateGreenLed(aliasfunction);
              break;
          case 'yellowlight':
              NymphLedService.operateYellowLed(aliasfunction);
              break;
          case 'bluelight':
              NymphLedService.operateBlueLed(aliasfunction);
              break;
          case 'blueandredlight':
              NymphLedService.operateBlueRedLed(aliasfunction);
              break;

          case 'openscanner':
              NymphScannerService.openScanner(aliasfunction);
              break;
          case 'initfrontscanner':
              NymphScannerService.initScannerFront(aliasfunction);
              break;
          case 'initbackscanner':
              NymphScannerService.initScannerBack(aliasfunction);
              break;
          case 'startscanner':
              NymphScannerService.startScan(aliasfunction);
              break;
          case 'stopscanner':
              NymphScannerService.stopScan(aliasfunction);
              break;
          case 'closescanner':
              NymphScannerService.closeScanner(aliasfunction);
              break;

          case 'normalbeeper':
              NymphBeepService.beepNormal();
              break;
          case 'errorbeeper':
              NymphBeepService.beepFail();
              break;
          case 'intervalbeeper':
              NymphBeepService.beepInterval();
              break;
          case 'timeoutbeeper':
              NymphBeepService.beepTime();
              break;

          case 'opengprs':
              NymphGprsService.openGprs();
              break;
          case 'closegprs':
              NymphGprsService.closeGprs();
              break;
          case 'setapn':
              NymphGprsService.setDefaultAPN();
              break;
          case 'getapn':
              NymphGprsService.getDefaultAPN();
              break;

          case 'openwifi':
              NymphWifiService.openWifi();
              break;
          case 'closewifi':
              NymphWifiService.closeWifi();
              break;
           case 'listwifi':
              NymphWifiService.getWifiList();
              break;
          case 'infowifi':
              NymphWifiService.getWifiInfo();
              break;
          case 'configwifi':
              NymphWifiService.configWifi();
              break;
          case 'configwifilist':
              NymphWifiService.getConfigList();
              break;
          case 'isconfigexistwifi':
              NymphWifiService.isConfigExist();
              break;

          case 'isCardIn':
              NymphCardService.isCardIn();
              break;
          case 'acquireCardAsyncMag':
              NymphCardService.acquireCardAsyncMag();
              break;
          case 'acquireCardAsyncIcc':
              NymphCardService.acquireCardAsyncIcc();
              break;
          case 'acquireCardAsyncRf':
              NymphCardService.acquireCardAsyncRf();
              break;
          case 'stopAcquireCard':
              NymphCardService.stopAcquireCard();
              break;
          case 'acquireCardAsync':
              NymphCardService.acquireCardAsync();
              break;
          case 'acquireCardSync':
              NymphCardService.acquireCardSync();
              break;
          case 'releaseCard':
              NymphCardService.releaseCard();
              break;

          case 'initEmv':
              NymphEmvService.initEmv();
              break;
          case 'startEmvTest':
              NymphEmvService.startEmvTest();
              break;
          case 'getBalanceTest':
              NymphEmvService.getBalanceTest();
              break;
          case 'emvGetInfo':
              NymphEmvService.emvGetInfo();
              break;
          case 'emvConfig':
              NymphEmvService.emvConfig();
              break;

          case 'inputMasterKey':
              NymphPinPadService.inputMasterKey();
              break;
          case 'loadMasterKey':
              NymphPinPadService.loadMasterKey();
              break;
          case 'cancelLoadMasterKey':
              NymphPinPadService.cancelLoadMasterKey();
              break;
          case 'loadPinKey':
              NymphPinPadService.loadPinKey();
              break;
          case 'inputOnlinePin':
              NymphPinPadService.inputOnlinePin();
              break;
          case 'calculateMac':
              NymphPinPadService.calculateMac();
              break;
          case 'clearKey':
              NymphPinPadService.clearKey();
              break;
          case 'checkPinKey':
              NymphPinPadService.checkPinKey();
              break;
          case 'calculateTDESTest':
              NymphPinPadService.calculateTDESTest();
              break;
          case 'calculateTDESTestKeyData':
              NymphPinPadService.calculateTDESTestKeyData();
              break;
          case 'loadInitKey':
              NymphPinPadService.loadInitKey();
              break;
          case 'cancelLoadInitKey':
              NymphPinPadService.cancelLoadInitKey();
              break;
          case 'getCurrentKsn':
              NymphPinPadService.getCurrentKsn();
              break;
          case 'increaseKsn':
              NymphPinPadService.increaseKsn();
              break;
          case 'calculateMacForDukpt':
              NymphPinPadService.calculateMacForDukpt();
              break;
          case 'calculateTDESTestForDUKPT':
              NymphPinPadService.calculateTDESTestForDUKPT();
              break;
          case 'inputOnlinePinForDukpt':
              NymphPinPadService.inputOnlinePinForDukpt();
              break;
          case 'clearKeyForDukpt':
              NymphPinPadService.clearKey();
              break;
          case 'loadKey':
              NymphPinPadService.loadKey();
              break;
          case 'cancelLoadKey':
              NymphPinPadService.cancelLoadKey();
              break;
          case 'calculateMacForFixed':
              NymphPinPadService.calculateMacForFixed();
              break;
          case 'calculateTDESTestForFixed':
              NymphPinPadService.calculateTDESTestForFixed();
              break;
          case 'inputOnlinePinForFixed':
              NymphPinPadService.inputOnlinePinForFixed();
              break;
          case 'clearKeyForFixed':
              NymphPinPadService.clearKey();
              break;
      }
    }

    var GetMenuMaintenance = function()
    {
        var maintenance =
        [
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
                       {child:'Is Config Exist',aliasfunc:'isconfigexistwifi'}
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

           },
           {
             name: 'GRPS','icons':'ion-ios-color-filter-outline',
             items: [
                       {child:'Open Gprs',aliasfunc:'opengprs'},
                       {child:'Close Gprs',aliasfunc:'closegprs'},
                       {child:'Set APN',aliasfunc:'setapn'},
                       {child:'Get APN',aliasfunc:'getapn'}
                     ]

           },
           {
             name: 'Card','icons':'ion-ios-color-filter-outline',
             items: [
                       {child:'IS Card In',aliasfunc:'isCardIn'},
                       {child:'ACQ Async Card',aliasfunc:'acquireCardAsync'},
                       {child:'ACQ Async Mag',aliasfunc:'acquireCardAsyncMag'},
                       {child:'ACQ Async ICC',aliasfunc:'acquireCardAsyncIcc'},
                       {child:'ACQ ASync RF',aliasfunc:'acquireCardAsyncRf'},

                       {child:'ACQ Sync Card',aliasfunc:'acquireCardSync'},
                       {child:'Stop Acquire',aliasfunc:'stopAcquireCard'},
                       {child:'Release Card',aliasfunc:'releaseCard'}
                     ]

           },
           {
                name: 'EMV','icons':'ion-ios-color-filter-outline',
                items: [
                          {child:'INIT',aliasfunc:'initEmv'},
                          {child:'START',aliasfunc:'startEmvTest'},
                          {child:'GET BALANCE',aliasfunc:'getBalanceTest'},
                          {child:'GET INFO',aliasfunc:'emvGetInfo'},
                          {child:'GET CONFIG',aliasfunc:'emvConfig'},

                        ]

              },
              {
                  name: 'PIN PAD','icons':'ion-ios-color-filter-outline',
                  items: [
                            {child:'inputMasterKey',aliasfunc:'inputMasterKey'},
                            {child:'loadMasterKey',aliasfunc:'loadMasterKey'},
                            {child:'cancelLoadMasterKey',aliasfunc:'cancelLoadMasterKey'},
                            {child:'loadPinKey',aliasfunc:'loadPinKey'},
                            {child:'inputOnlinePin',aliasfunc:'inputOnlinePin'},
                            {child:'calculateMac',aliasfunc:'calculateMac'},
                            {child:'clearKey',aliasfunc:'clearKey'},
                            {child:'checkPinKey',aliasfunc:'checkPinKey'},
                            {child:'calculateTDESTest',aliasfunc:'calculateTDESTest'},
                            {child:'calculateTDESTestKeyData',aliasfunc:'calculateTDESTestKeyData'},
                            {child:'loadInitKey',aliasfunc:'loadInitKey'},
                            {child:'cancelLoadInitKey',aliasfunc:'cancelLoadInitKey'},
                            {child:'getCurrentKsn',aliasfunc:'getCurrentKsn'},
                            {child:'increaseKsn',aliasfunc:'increaseKsn'},
                            {child:'calculateMacForDukpt',aliasfunc:'calculateMacForDukpt'},
                            {child:'calculateTDESTestForDUKPT',aliasfunc:'calculateTDESTestForDUKPT'},
                            {child:'inputOnlinePinForDukpt',aliasfunc:'inputOnlinePinForDukpt'},
                            {child:'clearKeyForDukpt',aliasfunc:'clearKeyForDukpt'},
                            {child:'loadKey',aliasfunc:'loadKey'},
                            {child:'cancelLoadKey',aliasfunc:'cancelLoadKey'},

                            {child:'calculateMacForFixed',aliasfunc:'calculateMacForFixed'},
                            {child:'calculateTDESTestForFixed',aliasfunc:'calculateTDESTestForFixed'},
                            {child:'inputOnlinePinForFixed',aliasfunc:'inputOnlinePinForFixed'},
                            {child:'clearKeyForFixed',aliasfunc:'clearKeyForFixed'}

                          ]

                },

        ];
        return maintenance;
    }
   

   return {
      TestMaintenance:TestMaintenance,
      GetMenuMaintenance:GetMenuMaintenance
   }
}])