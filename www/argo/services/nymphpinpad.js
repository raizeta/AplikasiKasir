angular.module('starter')
.service('NymphPinPadService',['ToastService','$ionicPlatform','$rootScope','$ionicLoading',function(ToastService,$ionicPlatform,$rootScope,$ionicLoading)
{
       var nymph = require('nymph');
       var pinPadInstance = argo.pinPadHelper.pinPadInstance;
       var pinKey = argo.pinPadHelper.pinKey;
       var onKeyPress = argo.pinPadHelper.onKeyPress;
       var masterKey = argo.pinPadHelper.masterKey;
       var macKey = argo.pinPadHelper.macKey;

       //for MKSK

       /**
        * Download master key
        */
       function loadMasterKey() {
           argo.addLog('Please connect the mother pos',function(){
               argo.addLog('Start to download master key...');
               pinPadInstance.downloadMkeyFromMasterPos(function (err) {
                   if (err) {
                       console.log('downloadMkeyFromMasterPos: err.code:'+err.code);
                       if (err.code === nymph.dev.pinPad.ErrorCode.PINPAD_INPUT_CANCELLED) {
                           argo.addLog('Master key download cancelled.');
                       } else {
                           argo.addLog('Failed to download master key: ' + JSON.stringify(err));
                       }
                   } else {
                       argo.addLog('Download master key succeeded.');
                       pinPadInstance.open();
                       //get the KCV of the key
                       try {
                           //The default key index to 1, please in the input index of the master pos on please on the consistent
                           masterKey.system = nymph.dev.pinPad.KeySystem.MKSK;
                           var kcv = pinPadInstance.getKCV(masterKey);
                           //API fixed return to four, the last of 00 invalid data
                           argo.addLog('KCV:'+ kcv.slice(0,6));
                       } catch (err) {
                           argo.addLog('Failed to get KCV,the index is 1,check the index in the master pos download key' + JSON.stringify(err));
                       }
                       pinPadInstance.close();
                   }
               });
           });
       }

       /**
        * cancel master key download
        */
       function cancelLoadMasterKey() {
           try {
               pinPadInstance.cancelDownloadMkeyFromMasterPos();
               argo.addLog('Succeeded to cancel master key download!');
           } catch (err) {
               argo.addLog('Failed to cancel master key download:' + JSON.stringify(err));
           }
       }

       /**
        * Download PIN Key
        */
       function loadPinKey() {
           argo.addLog('Download PIN key, key value: D0FB24EA73F599C1D0FB24EA73F599C1', function () {
               var pinKeyData = nymph.util.encoding.hexStringToBuffer('D0FB24EA73F599C1D0FB24EA73F599C1');
               pinPadInstance.open();

               try {
                   pinPadInstance.loadEncryptedKey(pinKeyData, pinKey, masterKey);
                   argo.addLog('PIN key download completed.');
               } catch (err) {
                   argo.addLog('PIN Key download failure:' + JSON.stringify(err));
                   throw err;
               } finally {
                   pinPadInstance.close();
               }
           });
       }

       /**
        * Input Online PIN
        */
       function inputOnlinePin() {
           argo.addLog('Start online PIN input.');
           var pan = '6225000000000212',
               scope = [0, 4, 6, 8],
               cfg = {
                   pan: pan,
                   lengthLimit: scope,
                   masterKeyIndex: argo.pinPadHelper.masterIndex,
                   completeTimeout: 600,
                   keypressTimeout: 10,
                   pinMode: nymph.dev.pinPad.PinMode.ISO9564FMT1
               };

           argo.pinPadHelper.pinLength = 0;
           argo.pinPadHelper.scope = scope;
           pinPadInstance.removeAllListeners();
           pinPadInstance.on('keypress', function (keycode) {
                   onKeyPress(keycode);
               }
           );
           pinPadInstance.open();

           pinPadInstance.inputOnlinePin(pinKey, cfg, function (err, pinBlock) {
               pinPadInstance.close();
               if (err) {
                   argo.addLog('Online PIN input failure:' + JSON.stringify(err));
               } else {
                   argo.addLog('Online PIN input result:' + nymph.util.encoding.bufferToHexString(pinBlock));
               }
           });
       }

       /**
        * Calculate Mac
        */
       function calculateMac() {
           var macKeyDatas = '4587596B86F0922F4587596B86F0922F';

           argo.addLog('Download MAC Key: ' + macKeyDatas, function () {
               var macKeyData = nymph.util.encoding.hexStringToBuffer(macKeyDatas);
               pinPadInstance.open();
               try {
                   macKey.system = nymph.dev.pinPad.KeySystem.MKSK;
                   pinPadInstance.loadEncryptedKey(macKeyData, macKey, masterKey);
               } catch (err) {
                   argo.addLog('MAC key download failure:' + JSON.stringify(err));
               } finally {
               }
               argo.addLog('MAC key download completed.', function () {
                   var calcData = '0102030405060708abcdefABCDEF0102';// Calculate mac result: 30 33 39 42 37 32 33 35
                   argo.addLog('Start Calculating MAC:' + calcData, function () {
                       var options = {masterKeyIndex: argo.pinPadHelper.masterIndex, mode: 0};
                       var macData = nymph.util.encoding.hexStringToBuffer(calcData);
                       var result;
                       try {
                           result = pinPadInstance.calculateMac(macData, macKey, options);
                       } catch (err) {
                           argo.addLog('MAC calculation failure: ' + JSON.stringify(err));
                       } finally {
                           pinPadInstance.close();
                       }
                       argo.addLog('MAC calculation result:' + nymph.util.encoding.bufferToHexString(result));
                   });
               });
           });
       }

       /**
        * Clear Key
        */
       function clearKey() {
           argo.addLog('Start clearing key', function () {
               try {
                   pinPadInstance.open();
                   pinPadInstance.format();
                   pinPadInstance.close();
               } catch (err) {
                   argo.addLog('Failed to clear key:' + JSON.stringify(err));
               }
               argo.addLog('Clearing key completed.');
           });
       }

       /**
        * verify the checkvalue of PIN
        */
       function checkPinKey() {
           try {
               argo.addLog('Value to be verified: D2DB51', function () {
                   var keyInfo = {'type': 'pin', 'index': argo.pinPadHelper.pinIndex, 'system': 0, 'algorithm': 'T'};
                   var keyOptions = {'keyFormat': 0};
                   var checkvalue = 'D2DB51';
                   try {
                       pinPadInstance.open();
                   } catch (err) {
                       console.nativeLog('Failed to open PIN pad:' + JSON.stringify(err));
                   }
                   try {
                       var result = pinPadInstance.isValid(keyInfo, checkvalue, keyOptions);
                       console.nativeLog('isValid:' + result);
                       if(result){
                           argo.addLog('PIN key verification Succeeded.');
                       }else{
                           argo.addLog('PIN key verification Failed.');
                       }
                   } catch (err) {
                       pinPadInstance.close();
                       throw err;
                   }
                   pinPadInstance.close();

               });
           } catch (err) {
               argo.addLog('PIN key verification failure:' + JSON.stringify(err));
           }
       }


       /**
        * Test TDES Encrypt and Decrypt
        */
       function calculateTDESTest() {
           var stringData = '7AECF686CA4637317AECF686CA463731A866D0C8EA4306EEA866D0C8EA4306EE';  //3DES encrypt result: B2C7C7E6829AEDA3B2C7C7E6829AEDA
           var enResult = [], deResult = [];
           var TDKeyDataStr = 'ADBF8135A642B58AADBF8135A642B58A';
           try {
               argo.addLog('Start TDES key download.', function () {
                   try {
                       pinPadInstance.open();
                   } catch (err) {
                       argo.addLog('Failed to open PIN pad:' + JSON.stringify(err));
                   }
                   var TDESKeyData = nymph.util.encoding.hexStringToBuffer(TDKeyDataStr),
                       tdesKey = new nymph.dev.pinPad.Key({
                           index: argo.pinPadHelper.desIndex,
                           type: nymph.dev.pinPad.KeyType.DES,
                           algorithm: nymph.dev.pinPad.KeyAlgorithm.TDES,
                           system: nymph.dev.pinPad.KeySystem.MKSK
                       }),
                       masterKey = new nymph.dev.pinPad.Key({
                           index: argo.pinPadHelper.masterIndex,
                           type: nymph.dev.pinPad.KeyType.MASTER,
                           system: nymph.dev.pinPad.KeySystem.MKSK
                       }),
                       tdesOptions = {
                           keyFormat: nymph.dev.pinPad.KeyFormat.NORMAL,
                           isTmsKey: false
                       };

                   /// Test download encrypted pin key
                   try {
                       console.nativeLog('Download TDES Key');
                       pinPadInstance.loadEncryptedKey(TDESKeyData, tdesKey, masterKey, tdesOptions);
                   } catch (err) {
                       pinPadInstance.close();
                       throw err;
                   }
                   pinPadInstance.close();
                   console.log('End of TDES key download.');

                   argo.addLog('TDES key download completed.', function () {
                       try {
                           var Key = new nymph.dev.pinPad.Key({
                               index: argo.pinPadHelper.desIndex,
                               type: nymph.dev.pinPad.KeyType.DES,
                               algorithm: nymph.dev.pinPad.KeyAlgorithm.TDES,
                               system: nymph.dev.pinPad.KeySystem.MKSK
                           });
                           enResult = encrypt(stringData, Key, null);
                           argo.addLog('TDES encryption completed', function () {
                               try {
                                   argo.addLog('start TDES decryption');
                                   deResult = decrypt(nymph.util.encoding.bufferToHexString(enResult), Key,null);
                                   argo.addLog('TDES decryption completed');
                               } catch (err) {
                                   argo.addLog('TDES decryption failure: ' + JSON.stringify(err));
                               }
                               if (0 === deResult.compare(nymph.util.encoding.hexStringToBuffer(stringData))) {
                                   argo.addLog('Encryption And Decryption Succeeded.');
                               } else {
                                   argo.addLog('Encryption And Decryption Failed');
                               }
                           });
                       } catch (err) {
                           argo.addLog('TDES encryption failure: ' + JSON.stringify(err));
                       }
                   });
               });

           } catch (e) {
               argo.addLog('TDES key download failure: ' + JSON.stringify(e));
           }

       }

       /**
        * TDES Encryption And Decryption Test
        */
       function calculateTDESTestKeyData() {
           var stringData = '7AECF686CA4637317AECF686CA463731A866D0C8EA4306EEA866D0C8EA4306EE';  //3DES encrypt result:B2C7C7E6829AEDA3B2C7C7E6829AEDA
           var enResult = [], deResult = [];
           var tdesKey = 'ADBF8135A642B58AADBF8135A642B58A';

           try {
               var Key = new nymph.dev.pinPad.Key({
                   index: argo.pinPadHelper.desIndex,
                   type: nymph.dev.pinPad.KeyType.DES,
                   algorithm: nymph.dev.pinPad.KeyAlgorithm.TDES,
                   system: nymph.dev.pinPad.KeySystem.MKSK
               });
               enResult = encrypt(stringData, Key,tdesKey);
               argo.addLog('TDES Encrypt completed.', function () {
                   try {
                       argo.addLog('Start TDES Decryption(Temporary key)');

                       deResult = decrypt(nymph.util.encoding.bufferToHexString(enResult), Key,tdesKey);
                       argo.addLog('TDES Decryption completed.', function () {
                           if (0 === deResult.compare(nymph.util.encoding.hexStringToBuffer(stringData))) {
                               argo.addLog('Encryption And Decryption Test Succeeded.');
                           } else {
                               argo.addLog('Encryption And Decryption Test Failed.');
                           }
                       });
                   } catch (err) {
                       argo.addLog('TDES Decryption Failure: ' + JSON.stringify(err));
                   }
               });
           } catch (err) {
               argo.addLog('TDES Encryption Failure: ' + JSON.stringify(err));
           }

       }

       /**
        * Encryption
        * @param data The data to encrypt
        * @returns encryption result
        */
       function encrypt(data, Key, keyStr) {
           var result, options, Data;
           pinPadInstance.open();

           if (keyStr === null) {
               options = {
                   keyFormat: 0,
                   masterKeySystem: 0
               };
           }
           else {
               var keyBuf = nymph.util.encoding.hexStringToBuffer(keyStr);
               options = {
                   keyFormat: 0,
                   keyData: keyBuf
               };
           }
           Data = nymph.util.encoding.hexStringToBuffer(data);
           try {
               console.nativeLog('pin-pad data:' + data);
               console.nativeLog('pin-pad keyStr:' + keyStr);
               result = pinPadInstance.encrypt(Data, Key, options);
               console.nativeLog('pin-pad result' + JSON.stringify(result));

           } catch (e) {
               throw({code: e.code, msg: e.message});
           } finally {
               pinPadInstance.close();
           }
           return result;
       }

       /**
        * Decryption
        * @param data The data to decrypt
        * @returns decryption result
        */

       function decrypt(data, Key, keyStr) {
           var result, options, Data;

           pinPadInstance.open();

           if (keyStr === null) {
               options = {
                   keyFormat: 0,
                   masterKeySystem: 0
               };
           }
           else {
               var keyBuf = nymph.util.encoding.hexStringToBuffer(keyStr);
               options = {
                   keyFormat: 0,
                   keyData: keyBuf
               };
           }

           Data = nymph.util.encoding.hexStringToBuffer(data);
           try {
               console.nativeLog('pin-pad data:' + data);
               console.nativeLog('pin-pad keyStr:' + keyStr);
               result = pinPadInstance.decrypt(Data, Key, options);
               console.nativeLog('pin-pad result' + JSON.stringify(result));

           } catch (e) {
               throw({code: e.code, msg: e.message});
           } finally {
               pinPadInstance.close();
           }
           return result;
       }


       //for DUKPT
       /**
        * Download Init key
        */
       function loadInitKey() {
           var masterKeyDukpt = masterKey;
           argo.addLog('Start to download Init key...');
           //It and the MKSK are the same
           pinPadInstance.downloadMkeyFromMasterPos(function (err) {
               if (err) {
                   console.log('downloadMkeyFromMasterPos:err.code'+err.code);
                   if (err.code === nymph.dev.pinPad.ErrorCode.PINPAD_INPUT_CANCELLED) {
                       argo.addLog('Init key download cancelled.');
                   } else {
                       argo.addLog('Failed to download Init key: ' + JSON.stringify(err));
                   }
               } else {
                   argo.addLog('Download Init key succeeded.');
                   pinPadInstance.open();
                   //get the KCV of the key
                   try {
                       //The default key index to 1, please in the input index of the master pos on please on the consistent
                       masterKeyDukpt.system = nymph.dev.pinPad.KeySystem.DUKPT;
                       var kcv = pinPadInstance.getKCV(masterKeyDukpt);
                       //API fixed return to four, the last of 00 invalid data
                       argo.addLog('KCV:'+ kcv.slice(0,6));
                   } catch (err) {
                       argo.addLog('Failed to get KCV,the index is 1,check the index in the Init pos download key' + JSON.stringify(err));
                   }
                   pinPadInstance.close();
               }
           });
       }



       /**
        *  cancel Download init key
        */
       function cancelLoadInitKey() {
           //It and the MKSK are the same
           try {
               pinPadInstance.cancelDownloadMkeyFromMasterPos();
               argo.addLog('Succeeded to cancel Init key download:');
           } catch (err) {
               argo.addLog('Failed to cancel Init key download:' + JSON.stringify(err));
           }
       }

       /**
        * get current KSN
        */
       function getCurrentKsn() {
           pinPadInstance.open();
           try {
               var ksn = pinPadInstance.getDukptCurKsn(masterKey);
               argo.addLog('the current KSN:' + nymph.util.encoding.bufferToHexString(ksn));
           } catch (err) {
               argo.addLog('Failed to get current KSN:' + JSON.stringify(err));
           }
           pinPadInstance.close();
       }

       /**
        * increase KSN
        */
       function increaseKsn() {
           pinPadInstance.open();
           try {
               var ksn = pinPadInstance.increaseDukptKsn(masterKey);
               argo.addLog('increase KSN succeeded');
               //check current ksn

           } catch (err) {
               argo.addLog('Failed to increase KSN:' + JSON.stringify(err));
           }
           pinPadInstance.close();
           getCurrentKsn();
       }

       /**
        * Calculate Mac for DUKPT
        */
       function calculateMacForDukpt() {

           pinPadInstance.open();
           var calcData = '0102030405060708abcdefABCDEF0102';
           var macKeyDukpt = macKey;
           argo.addLog('Start Calculating MAC:' + calcData, function () {
               var options = {masterKeyIndex: argo.pinPadHelper.masterIndex, mode: 0};
               var macData = nymph.util.encoding.hexStringToBuffer(calcData);
               var result;
               try {
                   macKeyDukpt.system = nymph.dev.pinPad.KeySystem.DUKPT;
                   macKeyDukpt.index = argo.pinPadHelper.masterIndex;
                   result = pinPadInstance.calculateMac(macData, macKeyDukpt, options);
               } catch (err) {
                   argo.addLog('MAC calculation failure: ' + JSON.stringify(err));
               } finally {
                   pinPadInstance.close();
               }
               argo.addLog('MAC calculation result:' + nymph.util.encoding.bufferToHexString(result));
           });

       }

       /**
        * Test TDES Encrypt and Decrypt for DUKPT
        */
       function calculateTDESTestForDUKPT() {


           //var stringData = '7AECF686CA4637317AECF686CA463731A866D0C8EA4306EEA866D0C8EA4306EE';  //3DES encrypt result: B2C7C7E6829AEDA3B2C7C7E6829AEDA
           //var enResult = [], deResult = [];
           //
           //try {
           //    var Key = new nymph.dev.pinPad.Key({
           //        index: argo.pinPadHelper.masterIndex,
           //        type: nymph.dev.pinPad.KeyType.DES,
           //        algorithm: nymph.dev.pinPad.KeyAlgorithm.TDES,
           //        system: nymph.dev.pinPad.KeySystem.DUKPT
           //    });
           //    enResult = encrypt(stringData, Key, null);
           //    \
           // 'TDES encryption completed', function () {
           //        try {
           //            argo.addLog('start TDES decryption');
           //            deResult = decrypt(nymph.util.encoding.bufferToHexString(enResult), null);
           //            argo.addLog('TDES decryption completed');
           //        } catch (err) {
           //            argo.addLog('TDES decryption failure: ' + JSON.stringify(err));
           //        }
           //        if (0 === deResult.compare(nymph.util.encoding.hexStringToBuffer(stringData))) {
           //            argo.addLog('Encryption And Decryption Succeeded.');
           //        } else {
           //            argo.addLog('Encryption And Decryption Failed');
           //        }
           //    });
           //} catch (err) {
           //    argo.addLog('TDES encryption failure: ' + JSON.stringify(err));
           //}
           argo.addLog('DUKPT underlying unable to generate the corresponding key, so temporarily does not support encryption and decryption!');
       }

       /**
        * Input Online PIN for DUKPT
        */
       function inputOnlinePinForDukpt() {
           argo.addLog('Start online PIN input.');
           var pan = '6225000000000212',
               scope = [0, 4, 6, 8],
               pinKeyDukpt = pinKey,
               cfg = {
                   pan: pan,
                   lengthLimit: scope,
                   masterKeyIndex: argo.pinPadHelper.masterIndex,
                   completeTimeout: 600,
                   keypressTimeout: 10,
                   pinMode: nymph.dev.pinPad.PinMode.ISO9564FMT1
               };

           argo.pinPadHelper.pinLength = 0;
           argo.pinPadHelper.scope = scope;
           pinPadInstance.removeAllListeners();
           pinPadInstance.on('keypress', function (keycode) {
                   onKeyPress(keycode);
               }
           );
           pinPadInstance.open();

           pinKeyDukpt.index = argo.pinPadHelper.masterIndex;
           pinKeyDukpt.system = nymph.dev.pinPad.KeySystem.DUKPT;
           pinPadInstance.inputOnlinePin(pinKeyDukpt, cfg, function (err, pinBlock) {
               pinPadInstance.close();
               if (err) {
                   argo.addLog('Online PIN input failure:' + JSON.stringify(err));
               } else {
                   argo.addLog('Online PIN input result:' + nymph.util.encoding.bufferToHexString(pinBlock));
               }
           });
       }

       //for FIXED
       /**
        * Download key
        */
       function loadKey(){
           var index;
           var masterKeyFixed;
           var popover = argo.Popover({
               elem : argo.id('dialog'),
               title : 'input key index',
               content : '<input id="index"/>',
               button : {
                   'confirm' : function() {
                       index = Number(argo.id('index').value);
                       popover.close();
                       argo.addLog('Start to download key...');
                       console.nativeLog('index:'+index);
                       //It and the MKSK are the same
                       pinPadInstance.downloadMkeyFromMasterPos(function (err) {
                           if (err) {
                               console.log('downloadMkeyFromMasterPos:err.code'+err.code);
                               if (err.code === nymph.dev.pinPad.ErrorCode.PINPAD_INPUT_CANCELLED) {
                                   argo.addLog('Key download cancelled.');
                               } else {
                                   argo.addLog('Failed to download key: ' + JSON.stringify(err));
                               }
                           } else {
                               argo.addLog('Download key succeeded.');
                               pinPadInstance.open();
                               //get the KCV of the key
                               try {
                                   //The default key index to 1, can according to need to modify
                                   masterKeyFixed = masterKey;
                                   masterKeyFixed.system = nymph.dev.pinPad.KeySystem.FIXED;
                                   masterKeyFixed.index = Number(index);
                                   var kcv = pinPadInstance.getKCV(masterKeyFixed);
                                   //API fixed return to four, the last of 00 invalid data
                                   argo.addLog('KCV:'+ kcv.slice(0,6));
                               } catch (err) {
                                   argo.addLog('Failed to get KCV' + JSON.stringify(err));
                               }
                               pinPadInstance.close();
                           }
                       });

                   }
               }
           });


       }

       /**
        *  cancel Download key
        */
       function cancelLoadKey() {
           //It and the MKSK are the same
           try {
               pinPadInstance.cancelDownloadMkeyFromMasterPos();
               argo.addLog('Succeeded to cancel key download!');
           } catch (err) {
               argo.addLog('Failed to cancel key download:' + JSON.stringify(err));
           }
       }

       /**
        * Calculate Mac for FIXED
        */
       function calculateMacForFixed() {

           pinPadInstance.open();
           var calcData = '0102030405060708abcdefABCDEF0102';
           var macKeyDukpt = macKey;
           argo.addLog('Start Calculating MAC:' + calcData, function () {
               var options = {masterKeyIndex: argo.pinPadHelper.masterIndex, mode: 0};
               var macData = nymph.util.encoding.hexStringToBuffer(calcData);
               var result;
               try {
                   macKeyDukpt.system = nymph.dev.pinPad.KeySystem.FIXED;
                   //To illustrate how convenient, it will use index 1, can according to need to modify
                   macKeyDukpt.index = 1;
                   result = pinPadInstance.calculateMac(macData, macKeyDukpt, options);
               } catch (err) {
                   argo.addLog('MAC calculation failure: ' + JSON.stringify(err));
               } finally {
                   pinPadInstance.close();
               }
               argo.addLog('MAC calculation result:' + nymph.util.encoding.bufferToHexString(result));
           });

       }

       /**
        * Test TDES Encrypt and Decrypt for FIXED
        */
       function calculateTDESTestForFixed() {


           var stringData = '7AECF686CA4637317AECF686CA463731A866D0C8EA4306EEA866D0C8EA4306EE';  //3DES encrypt result: B2C7C7E6829AEDA3B2C7C7E6829AEDA
           var enResult = [], deResult = [];

           try {
               var Key = new nymph.dev.pinPad.Key({
                   index: 3,
                   type: nymph.dev.pinPad.KeyType.DES,
                   algorithm: nymph.dev.pinPad.KeyAlgorithm.TDES,
                   system: nymph.dev.pinPad.KeySystem.FIXED
               });
               enResult = encrypt(stringData, Key, null);

               argo.addLog('TDES encryption completed', function () {

                   try {
                       argo.addLog('start TDES decryption');
                       deResult = decrypt(nymph.util.encoding.bufferToHexString(enResult), Key, null);
                       argo.addLog('TDES decryption completed');
                   } catch (err) {
                       argo.addLog('TDES decryption failure: ' + JSON.stringify(err));
                   }
                   if (0 === deResult.compare(nymph.util.encoding.hexStringToBuffer(stringData))) {
                       argo.addLog('Encryption And Decryption Succeeded.');
                   } else {
                       argo.addLog('Encryption And Decryption Failed');
                   }
               });
           } catch (err) {
               argo.addLog('TDES encryption failure: ' + JSON.stringify(err));
           }
       }

       /**
        * Input Online PIN for FIXED
        */
       function inputOnlinePinForFixed() {
           argo.addLog('Start online PIN input.');
           var pan = '6225000000000212',
               scope = [0, 4, 6, 8],
               pinKeyFixed = pinKey,
               cfg = {
                   pan: pan,
                   lengthLimit: scope,
                   completeTimeout: 600,
                   keypressTimeout: 10,
                   pinMode: nymph.dev.pinPad.PinMode.ISO9564FMT1
               };

           argo.pinPadHelper.pinLength = 0;
           argo.pinPadHelper.scope = scope;
           pinPadInstance.removeAllListeners();
           pinPadInstance.on('keypress', function (keycode) {
                   onKeyPress(keycode);
               }
           );
           pinPadInstance.open();

           pinKeyFixed.index = 2;
           pinKeyFixed.system = nymph.dev.pinPad.KeySystem.FIXED;
           pinPadInstance.inputOnlinePin(pinKeyFixed, cfg, function (err, pinBlock) {
               pinPadInstance.close();
               if (err) {
                   argo.addLog('Online PIN input failure:' + JSON.stringify(err));
               } else {
                   argo.addLog('Online PIN input result:' + nymph.util.encoding.bufferToHexString(pinBlock));
               }
           });
       }

       return {
           loadMasterKey: loadMasterKey,
           cancelLoadMasterKey: cancelLoadMasterKey,
           loadPinKey: loadPinKey,
           inputOnlinePin: inputOnlinePin,
           calculateMac: calculateMac,
           clearKey: clearKey,
           checkPinKey: checkPinKey,
           calculateTDESTest: calculateTDESTest,
           calculateTDESTestKeyData: calculateTDESTestKeyData,
           loadInitKey:loadInitKey,
           cancelLoadInitKey:cancelLoadInitKey,
           getCurrentKsn:getCurrentKsn,
           increaseKsn:increaseKsn,
           calculateMacForDukpt:calculateMacForDukpt,
           calculateTDESTestForDUKPT:calculateTDESTestForDUKPT,
           inputOnlinePinForDukpt:inputOnlinePinForDukpt,
           loadKey:loadKey,
           cancelLoadKey:cancelLoadKey,
           calculateMacForFixed:calculateMacForFixed,
           calculateTDESTestForFixed:calculateTDESTestForFixed,
           inputOnlinePinForFixed:inputOnlinePinForFixed,
           pinPadInstance: pinPadInstance
       };
}])