/**
 * Created by lilin01 on 2015/11/24.
 */
(function () {
    'use strict';
    /* jshint -W117 */

    if (!argo.router) {
        argo.router = new argo.Router();
    }

    argo.emvService = (function () {
        var reason = {},
            oDialog = argo.id('dialog'),
            iptCard = argo.id('cardNo'),
            btnConfirm = argo.id('confirm'),
            nymph = require('nymph'),
            emvProcessData = {},
            emv = nymph.pay.emv,
            cardReader = nymph.dev.cardReader,
            pinPadHelper = argo.pinPadHelper,
            pinPad = argo.pinPadHelper.pinPadInstance,
            media = nymph.sys.media,
            Buffer = nymph.buffer.Buffer,
            emvData = nymph.pay.emvData,
            nymphEncoding = nymph.util.encoding;

        function getEmvProcessData() {
            return emvProcessData;
        }

        function bindEmvEvents() {
            // 移除所有监听器
            emv.removeAllListeners('waitForCard');
            emv.removeAllListeners('selApp');
            emv.removeAllListeners('finalSelection');
            emv.removeAllListeners('finishRf');
            emv.removeAllListeners('readRecord');
            emv.removeAllListeners('cardHolderInputPin');
            emv.removeAllListeners('certVerify');
            emv.removeAllListeners('onlineProc');
            emv.removeAllListeners('finish');
            emv.removeAllListeners('closePinPad');

            emv.addListener('waitForCard', function (flag) {
                console.nativeLog('waitForCard===========================');
                if (flag === 'TRY_AGAIN') {
                    if (emvProcessData.card) {
                        emvProcessData.card.release();
                    }
                }
                cardReader.waitForCard([{
                    type: cardReader.CardType.CPUCARD,
                    slot: cardReader.SlotType.ICC1
                }, {
                    type: cardReader.CardType.CPUCARD,
                    slot: cardReader.SlotType.RF
                }], {isEmv: true}, function (err, card) {
                    if (err) {
                        // failed to get card.
                        // popover.close();
                        switch (err.code) {
                            case nymph.error.CANCELLED:
                                argo.addLog('Waiting for card cancelled');
                                break;
                            default:
                                argo.addLog('Failed to get card:' + JSON.stringify(err));
                                break;
                        }
                        emv.stopProcess();
                        goHome(err);
                    } else {
                        // popover.close();
                        // Already got card，means emv has continued, disable cancel to protect emv process. Util record event received to enabled cancel.
                        argo.hideItem(argo.id('back'));
                        argo.id('cancel').disabled = 'disabled';
                        emvProcessData.card = card;
                        console.nativeLog('Got card: ' + JSON.stringify(card));
                    }
                });
            });

            emv.addListener('selApp', function (candAidList, isReSelect) {
                console.nativeLog('selApp============================================');
                // todo: Let user choose aid. For test, we choose the first aid.
                var selectedAid = candAidList[0];
                try {
                    // No need to response to emv after get logs.
                    switch (emvProcessData.startData.purpose) {
                        case 'ECLOG':
                            var ecLogs = emv.getLogs(selectedAid.aid, 'EC');
                            //ecLogs.forEach(function (value) {
                            //  argo.addLog('EC log: ' + value.toString());
                            //});
                            return;
                        case 'ICLOG':
                            var icLogs = emv.getLogs(selectedAid.aid, 'IC');
                            //icLogs.forEach(function (value) {
                            //  argo.addLog('IC log: ' + value.toString());
                            //});
                            return;
                    }
                } catch (err) {
                    argo.addLog('Failed to get logs:' + JSON.stringify(err));
                    return;
                }
                emv.eventResponse({selApp: selectedAid.aid});

            });

            emv.addListener('finalSelection', function (aid, kernelId, pid) {
                console.nativeLog('finalSelection==============================================');
                try {
                    // var balance = emv.getBalance();
                } catch (err) {
                    argo.addLog('Failed to get balance: ' + JSON.stringify(err))
                }


                var gpo = new emv.Gpo();
                gpo.amount = 1;
                gpo.otherAmount = 0;
                gpo.transDate = '161024';
                gpo.transTime = '172500';
                gpo.trace = 1234;
                gpo.serviceType = emv.ServiceType.GOOD;
                gpo.gacFlag = emv.GacFlag.NON;
                emv.eventResponse({finalSelection: gpo});
            });

            emv.addListener('readRecord', function (record) {
                console.nativeLog('readRecord==================================' + record);
                // Set public key.
                var ridBuf = new nymph.buffer.Buffer(5);
                if (!record.aid) {
                    record.aid = emv.getTlv('4F');
                }
                record.aid.copy(ridBuf, 0, 0, ridBuf.length);
                var pubKey = emvData.getPubKey(ridBuf, record.pubKeyIndex);
                try {
                    emv.setCaPubKey(record.algorithm, pubKey);
                } catch (err) {
                    console.nativeLog('Failed to set public key: ' + JSON.stringify(err));
                    // Continue, EMV core decides whether to stop.
                }
                emvProcessData.record = record;
                if (argo.id('cardNo')) {
                    argo.id('cardNo').value = record.pan;
                    argo.id('confirm').removeAttribute('disabled');
                    argo.id('cancel').removeAttribute('disabled');
                    argo.showItem(argo.id('back'));
                }
            });

            emv.addListener('cardHolderInputPin', function (isOnlinePin, leftTimes) {
                console.nativeLog('cardHolderInputPin==============================================================' + isOnlinePin);

                var scope = [0, 4, 6, 8];
                argo.pinPadHelper.pinLength = 0;
                argo.pinPadHelper.scope = scope;
                pinPad.removeAllListeners();
                pinPad.on('keypress', function (keycode) {
                    pinPadHelper.onKeyPress(keycode);
                });
                pinPad.open();
                if (isOnlinePin) {
                    var onlinePinOptions = {
                        lengthLimit: scope,
                        pan: emvProcessData.record.pan,
                        allowZeroLength: false,
                        completeTimeout: 600,
                        keypressTimeout: 10
                    };
                    pinPad.inputOnlinePin(pinPadHelper.pinKey, onlinePinOptions, function (err, pinBlock) {
                        pinPad.close();
                        argo.addLog('pinPad.err:' + pinPad.err);
                        if (err) {
                            switch (err.code) {
                                case 'PINPAD_INPUT_CANCELLED':
                                    argo.addLog('Pin Pad input cancelled.');
                                    reason.code = nymph.error.CANCELLED;
                                    reason.msg = "User cancel input pin";
                                    break;
                                case 'PINPAD_INPUT_TIMEOUT':
                                    reason.msg = "User input pin timeout";
                                    argo.addLog('Pin Pad input Time out');
                                    break;
                                default :
                                    argo.addLog('Pin Pad input error: ' + JSON.stringify(err));
                                    reason.msg = "Failed to input pin";
                                    break;
                            }
                            emv.stopProcess();
                        } else {
                            argo.addLog('Pin Pad input succeed.');
                            emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.YES});
                        }
                        argo.router.go('processing');
                    });
                } else {
                    var offlinePinOptions = {
                        lengthLimit: scope,
                        allowZeroLength: false,
                        completeTimeout: 600,
                        keypressTimeout: 10
                    };
                    pinPad.inputOfflinePin(offlinePinOptions, function (err, pinBlock) {
                        if (err) {
                            switch (err.code) {
                                case 'PINPAD_INPUT_CANCELLED':
                                    argo.addLog('Pin Pad input cancelled.');
                                    reason.code = nymph.error.CANCELLED;
                                    reason.msg = "User cancel input pin";
                                    break;
                                case 'PINPAD_INPUT_TIMEOUT':
                                    reason.msg = "User input pin timeout";
                                    argo.addLog('Pin Pad input Time out');
                                    break;
                                default :
                                    argo.addLog('Pin Pad input error: ' + JSON.stringify(err));
                                    reason.msg = "Failed to input pin";
                                    break;
                            }
                            emv.stopProcess();
                        } else {
                            argo.addLog('Pin Pad input succeed.');
                            emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.YES});
                        }
                        argo.router.go('processing');
                    });
                }
            });

            emv.addListener('certVerify', function (certType, certNo) {
                console.nativeLog('certVerify===========================================================================');
                console.nativeLog('emv certVerify event, certType: ' + certType + ', certNo:' + certNo, function () {
                    emv.eventResponse({certVerify: emv.ConfirmResult.YES});
                });
            });

            emv.addListener('onlineProc', function (transData) {
                var hostData = new emv.HostData();
                hostData.state = 'SUCCESS';
                hostData.arc = [0x30, 0x30];
                hostData.authFlag = true;
                var field55 = nymph.util.encoding.hexStringToBuffer('9A031503179F21031056289F02060000000000109F03060000000000009F1A0201565F2A0201569F4E14CEEFC1F7B2E2CAD4C9CCBBA700000000000000009C01199F36022D10');
                hostData.field55 = field55;
                console.log('onlineProc=============' + hostData);
                emv.eventResponse({onlineProc: hostData});
            });

            emv.addListener('finish', function (retCode, transData) {
                console.nativeLog('finish====================================' + retCode);
                console.nativeLog('finish====================================' + JSON.stringify(transData));
                var popover = {};
                argo.showItem(argo.id('back'));
                if (emvProcessData.card ) {
                    popover = argo.Popover({
                        elem: argo.id('dialog'),
                        title: 'Tip',
                        content: '<b style="display:block;text-align: center">Transaction finished, please take card</b>'
                    });
                    nymph.dev.cardReader.waitForCardTaken(emvProcessData.card, function (err) {
                        popover.close();
                        emvProcessData = {};
                        if (err) {
                            argo.addLog('Waiting to take card failed:' + JSON.stringify(err));
                        }
                        if (retCode === 'STOP') {
                            reason.msg = reason.msg ? reason.msg : 'EMV process stopped.';
                            popover = argo.Popover({
                                elem: argo.id('dialog'),
                                title: 'Message',
                                content: '<b style="display:block;text-align: center">' + reason.msg + '</b>'
                            });

                            setTimeout(function () {
                                popover.close();
                                emvProcessData = {};
                                goHome({code: 'EMV FAIL', msg: reason.msg});
                            }, 3000);
                        } else if (retCode === 'SUCCESS') {
                            if (transData.acType === 'APPROVED') {

                                /***** Value Added ***
                                 * If value added app invoke, save the valAddTraceNo
                                 */
                                if(argo.transData && argo.transData.valAddTraceNo){
                                    localStorage.setItem('valAddTraceNo', argo.transData.valAddTraceNo);
                                }
                                /***** Value Added ***
                                 * If value added app invoke and the isValAddPrint, argo-native-js no print and finish itself
                                 */
                                if(argo.transData && argo.transData.isValAddPrint){
                                    var result = {
                                        transId: argo.transData.transId,
                                        resultCode: nymph.app.callTransResultCode.SUCCESS,
                                        resultMsg: nymph.app.callTransResultMsg.SUCCESS,
                                        transData: {
                                            resCode: '00',
                                            resDesc: 'Transaction Success',
                                            valAddTraceNo: argo.transData.valAddTraceNo,
                                            amt: '123',
                                            cardNo: '6214855511118555',
                                            date: '0101',
                                            time: '121010'
                                        }
                                    };
                                    nymph.app.callTransResult(result);
                                    return;
                                }

                                popover = argo.Popover({
                                    elem: argo.id('dialog'),
                                    title: 'Tip',
                                    content: '<b style="display:block;text-align: center">Print receipt?</b>',
                                    button: {
                                        'print': function () {
                                            argo.hermesTestPrint.printStart(function(){
                                                popover.close();
                                                emvProcessData = {};
                                                goHome({code:'00', msg:'Transaction Success'});
                                            });

                                        },
                                        'cancel': function () {
                                            popover.close();
                                            emvProcessData = {};
                                            goHome({code: 'CANCEL', msg: 'User Cancel'});
                                        }
                                    }
                                });
                            } else {
                                var errMsg = 'Transaction failed:' + transData.acType;
                                popover = argo.Popover({
                                    elem: argo.id('dialog'),
                                    title: 'Tip',
                                    content: '<b style="display:block;text-align: center">' + errMsg + '</b>'
                                });

                                setTimeout(function () {
                                    popover.close();
                                    emvProcessData = {};
                                    goHome({code: 'FAIL', msg: errMsg});
                                }, 3000);
                            }
                        } else {
                            popover = argo.Popover({
                                elem: argo.id('dialog'),
                                title: 'Message',
                                content: '<b style="display:block;text-align: center">' + 'EMV process failed: ' + retCode + '</b>'
                            });

                            setTimeout(function () {
                                popover.close();
                                goHome({code: 'EMV FAIL', msg: 'EMV process failed:'+retCode});
                            }, 3000);
                        }
                    });
                }
            });

            emv.addListener('finishRf', function () {
                console.nativeLog('finishRf======================================================================');
                nymph.sys.media.beep(nymph.sys.media.BeepMode.NORMAL);
                emvProcessData.card.release();
            });

            emv.addListener('closePinPad', function () {
                console.nativeLog('closePinPad=====================================================');
                pinPad.close();
            });
        }

        function initEmv() {
            try {
                //emv.switchDebug('REAL_TIME', {target: 'CONSOLE'});
                emv.init();
                emv.manageAidList(emv.ListOperation.CLEAR);
                var aids = emvData.aidList;
                aids.forEach(function (value) {
                    emv.manageAidList(emv.ListOperation.ADD, value);
                });

                // Set default params.
                // for Pay Pass, countryCode = 0056, curCode = 0978
                emvData.defaultBasicParam.countryCode = '0056';
                emvData.defaultBasicParam.curCode = '0978';
                emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, {value: emvData.defaultBasicParam});
                emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, {value: emvData.defaultPbocParam});
                emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, {value: emvData.defaultVisaParam});
                emv.manageParams(emv.KernelId.MASTER, emv.ListOperation.ADD, {value: emvData.defaultMasterParam});
                emvData.basicParamList.forEach(function (value) {
                    emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, value);
                });
                emvData.visaParamList.forEach(function (value) {
                    emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, value);
                });
                emvData.pbocParamList.forEach(function (value) {
                    emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, value);
                });
                emvData.masterParamList.forEach(function (value) {
                    emv.manageParams(emv.KernelId.MASTER, emv.ListOperation.ADD, value);
                });

                // Set public key index lists.
                emv.updateCaIndexList('A000000333', '0203050880575861626364656609');
                emv.updateCaIndexList('A000000003', '010708095153929495969799');
                //argo.addLog('EMV initialization completed.');
            } catch (err) {
                argo.addLog('Failed to initialize EMV: ' + err.message);
            }
        }

        function startEmv() {
            emvProcessData = {};
            console.nativeLog('start emv=================================');
            var startData = new emv.StartData();
            startData.pseFlag = emv.PseFlag.PSE_AID;
            var gpo = new emv.Gpo();
            gpo.amount = 1;
            gpo.otherAmount = 0;
            gpo.transDate = '161024';
            gpo.transTime = '172500';
            gpo.trace = 1234;
            gpo.serviceType = emv.ServiceType.GOOD;
            gpo.gacFlag = emv.GacFlag.NON;
            startData.gpo = gpo;
            startData.purpose = emv.StartPurpose.NORMAL;
            emvProcessData.startData = startData;

            bindEmvEvents();
            try {
                emv.startProcess(startData);
            } catch (err) {
                argo.addLog('Failed to start emv process: ' + JSON.stringify(err));
            }
        }

        function goHome(err){
            /***** Value Added ***
             *  When the transaction finished[Success/Fail/Cancel], check whether it is invoked by value added app.
             *  if yes, then send response to the value added app.
             */
            if(argo.transData && argo.transData.valAddTraceNo) {
                switch (err.code) {
                    case '00':
                        /***** Value Added ***
                         * If value added app invoke, send response to value added app
                         */
                        var result = {
                            transId: argo.transData.transId,
                            resultCode: nymph.app.callTransResultCode.SUCCESS,
                            resultMsg: nymph.app.callTransResultMsg.SUCCESS,
                            transData: {
                                resCode: '00',
                                resDesc: 'Transaction Success',
                                valAddTraceNo: argo.transData.valAddTraceNo,
                                amt: '123',
                                cardNo: '6214855511118555',
                                date: '0101',
                                time: '121010'
                            }
                        };
                        nymph.app.callTransResult(result);
                        return;
                    case 'CANCEL':
                        /***** Value Added ***
                         * If value added app invoke, send response to value added app
                         */
                        var result = {
                            transId: argo.transData.transId,
                            resultCode: nymph.app.callTransResultCode.SUCCESS,
                            resultMsg: nymph.app.callTransResultMsg.SUCCESS,
                            transData: {
                                resCode: 'CANCEL',
                                resDesc: 'User Cancel',
                                valAddTraceNo: argo.transData.valAddTraceNo
                            }
                        };
                        nymph.app.callTransResult(result);
                        return;
                    default:
                        /***** Value Added ***
                         * If value added app invoke, send response to value added app
                         */
                        var result = {
                            transId: argo.transData.transId,
                            resultCode: nymph.app.callTransResultCode.SUCCESS,
                            resultMsg: nymph.app.callTransResultMsg.SUCCESS,
                            transData: {
                                resCode: err ? err.code : null,
                                resDesc: err ? err.msg : null,
                                valAddTraceNo: argo.transData.valAddTraceNo
                            }
                        };
                        nymph.app.callTransResult(result);
                        return;

                }
            }
            argo.router.go('initiator');
        }

        return {
            startEmv: startEmv,
            initEmv: initEmv,
            getEmvProcessData: getEmvProcessData
        };
    })();
})();