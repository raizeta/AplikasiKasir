/* jshint -W117 */
argo.hermesTestController = (function () {
    'use strict';
    var warp = argo.id('content'),
        //ev = 'ontouchstart' in window ? 'touchstart' : 'click';
        ev = 'click';
    argo.delEvent(warp, ev, bingEvent);
    argo.addEvent(warp, ev, bingEvent);

    function bingEvent(e) {
        var elem = e.target;
        if (elem && elem.nodeName.toLowerCase() === 'a') {
            switch (elem.id) {
                //case 'appStart':
                //  alert('appStart');
                //  argo.hermesTestCard.appStart();
                //  break;
                //case 'appStop':
                //  argo.hermesTestCard.appStop();
                //  break;
                case 'acquireCardAsyncMag':
                    argo.hermesTestCard.acquireCardAsyncMag();
                    break;
                case 'acquireCardAsyncIcc':
                    argo.hermesTestCard.acquireCardAsyncIcc();
                    break;
                case 'acquireCardAsyncRf':
                    argo.hermesTestCard.acquireCardAsyncRf();
                    break;
                case 'stopAcquireCard':
                    argo.hermesTestCard.stopAcquireCard();
                    break;
                case 'acquireCardAsync':
                    argo.hermesTestCard.acquireCardAsync();
                    break;
                case 'isCardIn':
                    argo.hermesTestCard.isCardIn();
                    break;
                case 'acquireCardSync':
                    argo.hermesTestCard.acquireCardSync();
                    break;
                case 'releaseCard':
                    argo.hermesTestCard.releaseCard();
                    break;

                case 'openScanner':
                    argo.hermesTestScanner.openScanner();
                    break;
                case 'initScannerFront':
                    argo.hermesTestScanner.initScannerFront();
                    break;
                case 'initScannerBack':
                    argo.hermesTestScanner.initScannerBack();
                    break;
                case 'startScan':
                    argo.hermesTestScanner.startScan();
                    break;
                case 'stopScan':
                    argo.hermesTestScanner.stopScan();
                    break;
                case 'closeScanner':
                    argo.hermesTestScanner.closeScanner();
                    break;

                //for MKSK
                case 'inputMasterKey':
                    argo.hermesTestPinpad.inputMasterKey();
                    break;
                case 'loadMasterKey':
                    argo.hermesTestPinpad.loadMasterKey();
                    break;
                case 'cancelLoadMasterKey':
                    argo.hermesTestPinpad.cancelLoadMasterKey();
                    break;
                case 'loadPinKey':
                    argo.hermesTestPinpad.loadPinKey();
                    break;
                case 'inputOnlinePin':
                    argo.hermesTestPinpad.inputOnlinePin();
                    break;
                case 'calculateMac':
                    argo.hermesTestPinpad.calculateMac();
                    break;
                case 'clearKey':
                    argo.hermesTestPinpad.clearKey();
                    break;
                case 'checkPinKey':
                    argo.hermesTestPinpad.checkPinKey();
                    break;
                case 'calculateTDESTest':
                    argo.hermesTestPinpad.calculateTDESTest();
                    break;
                case 'calculateTDESTestKeyData':
                    argo.hermesTestPinpad.calculateTDESTestKeyData();
                    break;
                case 'loadInitKey':
                    argo.hermesTestPinpad.loadInitKey();
                    break;
                case 'cancelLoadInitKey':
                    argo.hermesTestPinpad.cancelLoadInitKey();
                    break;
                case 'getCurrentKsn':
                    argo.hermesTestPinpad.getCurrentKsn();
                    break;
                case 'increaseKsn':
                    argo.hermesTestPinpad.increaseKsn();
                    break;
                case 'calculateMacForDukpt':
                    argo.hermesTestPinpad.calculateMacForDukpt();
                    break;
                case 'calculateTDESTestForDUKPT':
                    argo.hermesTestPinpad.calculateTDESTestForDUKPT();
                    break;
                case 'inputOnlinePinForDukpt':
                    argo.hermesTestPinpad.inputOnlinePinForDukpt();
                    break;
                case 'clearKeyForDukpt':
                    argo.hermesTestPinpad.clearKey();
                    break;
                case 'loadKey':
                    argo.hermesTestPinpad.loadKey();
                    break;
                case 'cancelLoadKey':
                    argo.hermesTestPinpad.cancelLoadKey();
                    break;
                case 'calculateMacForFixed':
                    argo.hermesTestPinpad.calculateMacForFixed();
                    break;
                case 'calculateTDESTestForFixed':
                    argo.hermesTestPinpad.calculateTDESTestForFixed();
                    break;
                case 'inputOnlinePinForFixed':
                    argo.hermesTestPinpad.inputOnlinePinForFixed();
                    break;
                case 'clearKeyForFixed':
                    argo.hermesTestPinpad.clearKey();
                    break;
                //case 'printOpen':
                //  argo.hermesTestPrint.printOpen();
                //  break;
                //case 'printClose':
                //  argo.hermesTestPrint.printClose();
                //  break;
                case 'printReceipt':
                    argo.hermesTestPrint.printReceipt();
                    break;
                case 'printerStatus':
                    argo.hermesTestPrint.printerStatus();
                    break;
                case 'feedPaper':
                    argo.hermesTestPrint.feedPaper();
                    break;
                case 'resetPrinter':
                    argo.hermesTestPrint.resetPrinter();
                    break;
                case 'initEmv':
                    argo.hermesTestEmv.initEmv();
                    break;
                case 'startEmvTest':
                    argo.hermesTestEmv.startEmvTest();
                    break;
                case 'getBalanceTest':
                    argo.hermesTestEmv.getBalanceTest();
                    break;
                case 'emvConfig':
                    argo.hermesTestEmv.emvConfig();
                    break;
                case 'getContactIcLogsTest':
                    argo.hermesTestEmv.getContactIcLogsTest();
                    break;
                case 'getContactEcLogsTest':
                    argo.hermesTestEmv.getContactEcLogsTest();
                    break;
                case 'getRfIcLogsTest':
                    argo.hermesTestEmv.getRfIcLogsTest();
                    break;
                case 'getRfEcLogsTest':
                    argo.hermesTestEmv.getRfEcLogsTest();
                    break;
                case 'emvGetInfo':
                    argo.hermesTestEmv.emvGetInfo();
                    break;
                case 'beepNormal':
                    argo.hermesTestBeep.beepNormal();
                    break;
                case 'beepFail':
                    argo.hermesTestBeep.beepFail();
                    break;
                case 'beepInterval':
                    argo.hermesTestBeep.beepInterval();
                    break;
                case 'beepTime':
                    argo.hermesTestBeep.beepTime();
                    break;

                case 'turnOnAll':
                    argo.hermesTestLed.turnOnAll();
                    break;
                case 'turnOffAll':
                    argo.hermesTestLed.turnOffAll();
                    break;
                case 'operateRedLed':
                    argo.hermesTestLed.operateRedLed();
                    break;
                case 'operateGreenLed':
                    argo.hermesTestLed.operateGreenLed();
                    break;
                case 'operateYellowLed':
                    argo.hermesTestLed.operateYellowLed();
                    break;
                case 'operateBlueLed':
                    argo.hermesTestLed.operateBlueLed();
                    break;
                case 'operateBlueRedLed':
                    argo.hermesTestLed.operateBlueRedLed();
                    break;

                case 'showSignaturePadTimeout':
                    argo.hermesTestSignature.showSignaturePadTimeout();
                    break;
                case 'showSignaturePadTimeless':
                    argo.hermesTestSignature.showSignaturePadTimeless();
                    break;
                case 'showSignaturePadNone':
                    argo.hermesTestSignature.showSignaturePadNone();
                    break;
                case 'showSignaturePadLandscape':
                    argo.hermesTestSignature.showSignaturePadLandscape();
                    break;
                case 'showSignaturePadPortrait':
                    argo.hermesTestSignature.showSignaturePadPortrait();
                    break;
                case 'showSignaturePadLandscapeReverse':
                    argo.hermesTestSignature.showSignaturePadLandscapeReverse();
                    break;
                case 'showSignaturePadPortraitReverse':
                    argo.hermesTestSignature.showSignaturePadPortraitReverse();
                    break;

                case 'showSignaturePadReSign3':
                    argo.hermesTestSignature.showSignaturePadReSign3();
                    break;
                case 'showSignaturePadReSignResetTimeout':
                    argo.hermesTestSignature.showSignaturePadReSignResetTimeout();
                    break;
                case 'closeSignaturePad':
                    argo.hermesTestSignature.closeSignaturePad();
                    break;

                case 'openUsb':
                    argo.hermesTestSerialPort.openUsb();
                    break;
                case 'readDataFromUsb':
                    argo.hermesTestSerialPort.readDataFromUsb();
                    break;
                case 'sendDataToUsb':
                    argo.hermesTestSerialPort.sendDataToUsb();
                    break;
                case 'readDataFromUsbTimeout':
                    argo.hermesTestSerialPort.readDataFromUsbTimeout();
                    break;
                case 'sendDataToUsbTimeout':
                    argo.hermesTestSerialPort.sendDataToUsbTimeout();
                    break;
                case 'closeUsb':
                    argo.hermesTestSerialPort.closeUsb();
                    break;
                case 'flushUsb':
                    argo.hermesTestSerialPort.flushUsb();
                    break;

                case 'openGprs':
                    argo.hermesTestGprs.open();
                    break;
                case 'closeGprs':
                    argo.hermesTestGprs.close();
                    break;
                case 'setDefaultAPN':
                    argo.hermesTestGprs.setDefaultAPN();
                    break;
                case 'getDefaultAPN':
                    argo.hermesTestGprs.getDefaultAPN();
                    break;

                case 'openWifi':
                    argo.hermesTestWifi.open();
                    break;
                case 'closeWifi':
                    argo.hermesTestWifi.close();
                    break;
                case 'getWifiList':
                    argo.hermesTestWifi.getWifiList();
                    break;
                case 'getWifiInfo':
                    argo.hermesTestWifi.getWifiInfo();
                    break;
                case 'configWifi':
                    argo.hermesTestWifi.configWifi();
                    break;
                case 'getConfigList':
                    argo.hermesTestWifi.getConfigList();
                    break;
                case 'isConfigExist':
                    argo.hermesTestWifi.isConfigExist();
                    break;

                case 'openLan':
                    argo.hermesTestLan.open();
                    break;
                case 'configLanTest':
                    argo.hermesTestLan.configLanTest();
                    break;
                case 'getLanInfo':
                    argo.hermesTestLan.getLanInfo();
                    break;
                case 'closeLan':
                    argo.hermesTestLan.close();
                    break;

                case 'getTerminalInfo':
                    argo.hermesTestOther.getTerminalInfo();
                    break;
                case 'setDatetime':
                    argo.hermesTestOther.setDatetime();
                    break;
                case 'start':
                    argo.hermesTestOther.start();
                    break;
                case 'stop':
                    argo.hermesTestOther.stop();
                    break;
            }
        }
    }
})();
