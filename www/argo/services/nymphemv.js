angular.module('starter')
.service('NymphEmvService',['$ionicLoading','ToastService',function($ionicLoading,ToastService)
{
    var nymph = require('nymph');
    var emvProcessData = {};
    var emv = nymph.pay.emv;
    var cardReader = nymph.dev.cardReader;
    var pinPadHelper = argo.pinPadHelper;
    var pinPad = argo.pinPadHelper.pinPadInstance;
    var media = nymph.sys.media;
    var Buffer = nymph.buffer.Buffer;
    var emvData = nymph.pay.emvData;
    var nymphEncoding = nymph.util.encoding;

        function bindEmvEvents()
        {
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
            emv.removeAllListeners('balance');

            emv.addListener('waitForCard', function (flag)
            {
                if (flag === 'TRY_AGAIN')
                {
                    // Release the previous card instance first.
                    if (emvProcessData.card)
                    {
                        emvProcessData.card.release();
                    }
                }


                $ionicLoading.show
                ({
                    noBackdrop:false,
                    hideOnStateChange:true,
                    template: '<p class="item-icon-left"><span class="title">Waiting For CPU Card</span><ion-spinner icon="lines"/></p>',
                })

                cardReader.waitForCard(
                [{
                    type: cardReader.CardType.CPUCARD,
                    slot: cardReader.SlotType.ICC1
                },
                {
                    type: cardReader.CardType.CPUCARD,
                    slot: cardReader.SlotType.RF
                }],
                {isEmv: true},
                function (err, card)
                {
                    console.log(card);
                    $ionicLoading.hide();
                    if (err)
                    {
                        switch (err.code)
                        {
                            case nymph.error.CANCELLED:
                                // Handle the cancelling.
                                argo.addLog('Waiting for card cancelled');
                                break;
                            default: // Handle other errors.
                                argo.addLog('Failed to get card:' + JSON.stringify(err));
                                break;
                        }
                    }
                    else
                    {
                        emvProcessData.card = card;
                        argo.addLog('Got card: ' + JSON.stringify(card));
                    }
                });
            });
            emv.addListener('selApp', function (candAidList, isReSelect)
            {
                argo.addLog('emv selApp event, candidate aid list: ' + JSON.stringify(candAidList) + ', reSelect: ' + isReSelect);
                // todo: Let user choose aid. For test, we choose the first aid.
                var selectedAid = candAidList[0];
                try {
                    // No need to response to emv after get logs.
                    switch (emvProcessData.startData.purpose)
                    {
                        case 'ECLOG':
                            var ecLogs = emv.getLogs(selectedAid.aid, 'EC');
                            ecLogs.forEach(function (log, index)
                            {
                                argo.addLog('EC log: ' + log.toString());
                            });
                            return;
                        case 'ICLOG':
                            var icLogs = emv.getLogs(selectedAid.aid, 'IC');
                            icLogs.forEach(function (log, index)
                            {
                                argo.addLog('IC log: ' + log.toString());
                            });
                            return;
                    }
                }
                catch (err)
                {
                    argo.addLog('Failed to get logs: ' + JSON.stringify(err));
                    return;
                }

                emv.eventResponse({selApp: selectedAid.aid});
            });
            emv.addListener('balance', function (balance)
            {
                argo.addLog('Got balance: ' + balance / 100);
            });
            emv.addListener('finalSelection', function (aid, kernelId, pid)
            {
                argo.addLog('emv finalSelection event, aid: ' + nymphEncoding.bufferToHexString(aid) + ',EMV kernelId: ' + kernelId + ', pid: ' + pid);

                // var balance = emv.getBalance();
                // argo.addLog('Got balance: ' + balance);

                var gpo = new emv.Gpo();
                gpo.amount = 1;
                gpo.otherAmount = 0;
                gpo.transDate = '150824';
                gpo.transTime = '172500';
                gpo.trace = 1234;
                gpo.serviceType = emv.ServiceType.GOOD;
                gpo.gacFlag = emv.GacFlag.NON;
                emv.eventResponse({finalSelection: gpo});
            });
            emv.addListener('readRecord', function (record)
            {
                argo.addLog('emv readRecord event, record: ' + JSON.stringify(record));
                // Set public key.
                var ridBuf = new Buffer(5);
                if (!record.aid)
                {
                    record.aid = emv.getTlv('4F');
                }
                record.aid.copy(ridBuf, 0, 0, ridBuf.length);
                var pubKey = emvData.getPubKey(ridBuf, record.pubKeyIndex);
                try
                {
                    emv.setCaPubKey(record.algorithm, pubKey);
                }
                catch (err) {
                    argo.addLog('Failed to set key: ' + JSON.stringify(err));
                    // Continue, EMV core decides whether to stop.
                }
                // todo: you can display card number or inquiry blacklist here if you need.
                emvProcessData.record = record;
                try
                {
                    emv.eventResponse({readRecord: {isBlack: false, accumulatedAmount: 10000}});
                }
                catch (err) {
                    argo.addLog('Failed to response to emv:' + JSON.stringify(err));
                }
            });
            emv.addListener('cardHolderInputPin', function (isOnlinePin, leftTimes)
            {
                argo.addLog('emv cardHolderInputPin event, isOnlinePin: ' + isOnlinePin + ', leftTimes:' + leftTimes);

                var scope = [0, 4, 6, 8];
                argo.pinPadHelper.pinLength = 0;
                argo.pinPadHelper.scope = scope;
                pinPad.removeAllListeners();
                pinPad.on('keypress', function (keycode) {
                    pinPadHelper.onKeyPress(keycode);
                });
                pinPad.open();
                if (isOnlinePin)
                {
                    var onlinePinOptions =
                    {
                        lengthLimit: scope,
                        pan: emvProcessData.record.pan,
                        allowZeroLength: false,
                        completeTimeout: 600,
                        keypressTimeout: 10
                    };
                    pinPad.inputOnlinePin(pinPadHelper.pinKey, onlinePinOptions, function (err, pinBlock)
                    {
                        pinPad.close();
                        if (err)
                        {
                            switch (err.code)
                            {
                                case nymph.error.CANCELLED:
                                    argo.addLog('Pin Pad input cancelled.');
                                    emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.CANCEL});
                                    break;
                                default :
                                    argo.addLog('Pin Pad input error: ' + JSON.stringify(err));
                                    emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.NO});
                                    break;
                            }
                        }
                        else
                        {
                            argo.addLog('Pin Pad input succeed.');
                            emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.YES});
                        }
                    });
                } else
                {
                    var offlinePinOptions =
                    {
                        lengthLimit: scope,
                        allowZeroLength: false,
                        completeTimeout: 600,
                        keypressTimeout: 10
                    };
                    pinPad.inputOfflinePin(offlinePinOptions, function (err, pinBlock)
                    {
                        if (err)
                        {
                            switch (err.code)
                            {
                                case nymph.error.CANCELLED:
                                    argo.addLog('Pin Pad input cancelled.');
                                    emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.CANCEL});
                                    break;
                                default :
                                    argo.addLog('Pin Pad input error: ' + JSON.stringify(err));
                                    emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.NO});
                                    break;
                            }
                        }
                        else
                        {
                            argo.addLog('Pin Pad input succeed.');
                            emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.YES});
                        }
                    });
                }
            });
            emv.addListener('certVerify', function (certType, certNo)
            {
                argo.addLog('emv certVerify event,certype: ' + certType + ', certNo: ' + certNo);
                emv.eventResponse({certVerify: emv.ConfirmResult.YES});
            });
            emv.addListener('onlineProc', function (transData)
            {
                argo.addLog('emv onlineProc event, transData: ' + JSON.stringify(transData));
                var hostData = new emv.HostData();
                hostData.state = 'SUCCESS';
                hostData.arc = [0x30, 0x30];
                hostData.authFlag = true;
                var field55 = nymphEncoding.hexStringToBuffer('9A031503179F21031056289F02060000000000109F03060000000000009F1A0201565F2A0201569F4E14CEEFC1F7B2E2CAD4C9CCBBA700000000000000009C01199F36022D10');
                hostData.field55 = field55;
                emv.eventResponse({onlineProc: hostData});
            });
            emv.addListener('finishRf', function ()
            {
                media.beep(media.BeepMode.NORMAL);
                emvProcessData.card.release();
            });
            emv.addListener('closePinPad', function ()
            {
                try
                {
                    pinPad.close();
                }
                catch (error)
                {
                    argo.addLog('Failed to close pin pad: ' + JSON.stringify(error));
                }
            });
            emv.addListener('finish', function (retCode, transData)
            {
                argo.addLog('emv finish, retCode: ' + retCode + ', transData: ' + JSON.stringify(transData));
                if (emvProcessData.card)
                {
                    $ionicLoading.show
                    ({
                        noBackdrop:false,
                        hideOnStateChange:true,
                        template: '<p class="item-icon-left"><span class="title">Please take your card</span><ion-spinner icon="lines"/></p>',
                    })
                    cardReader.waitForCardTaken(emvProcessData.card, function (err)
                    {
                        $ionicLoading.hide();
                        if (err)
                        {
                            argo.addLog('Result of taking card: ' + JSON.stringify(err));
                        }
                        else
                        {
                            argo.addLog('Card is taken.');
                        }
                    });
                }
            });
        }

        /**
         * Initialize EMV
         */
        function initEmv()
        {
            try {
                //emv.switchDebug('REAL_TIME', {target: 'CONSOLE'});
                emv.init();
                emv.manageAidList(emv.ListOperation.CLEAR);
                var aids = emvData.aidList;
                aids.forEach(function (value)
                {
                    emv.manageAidList(emv.ListOperation.ADD, value);
                });

                var defaultBasicParam=new emv.BasicParams();
                defaultBasicParam.floorLimit=501;
                defaultBasicParam.randomLimit=101;
                defaultBasicParam.randomPercent=31;
                defaultBasicParam.randomPercentMax=91;
                defaultBasicParam.termCap='E061C8';


                emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, {value: emvData.defaultBasicParam});
                emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, {value: emvData.defaultPbocParam});
                emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, {value: emvData.defaultVisaParam});
                emv.manageParams(emv.KernelId.MASTER, emv.ListOperation.ADD, {value: emvData.defaultMasterParam});
                emvData.basicParamList.forEach(function (value)
                {
                    emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, value);
                });
                emvData.visaParamList.forEach(function (value)
                {
                    emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, value);
                });
                emvData.pbocParamList.forEach(function (value)
                {
                    emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, value);
                });
                emvData.masterParamList.forEach(function (value)
                {
                    emv.manageParams(emv.KernelId.MASTER, emv.ListOperation.ADD, value);
                });

                // Set valid index lists of public keys.
                // rid: public key id, 5 bytes, 'A000000333', etc., means [0xA0, 0x00, 0x00, 0x03, 0x33]. It is the first 5 bytes of aid.
                // index list: '0203050880575861626364656609', etc., means [0x02, 0x03, 0x05, 0x08, 0x80, 0x57, 0x58, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x09]
                emv.updateCaIndexList('A000000333', '0203050880575861626364656609');
                emv.updateCaIndexList('A000000003', '010708095153929495969799');
                argo.addLog('EMV initialization completed.');
            }
            catch (err)
            {
                argo.addLog('Failed to initialize EMV: ' + err.message);
            }
        }

        function startEmvTest()
        {
            emvProcessData = {};

            var startData = new emv.StartData();
            startData.pseFlag = emv.PseFlag.PSE_AID;
            var gpo = new emv.Gpo();
            gpo.amount = 1;
            gpo.otherAmount = 0;
            gpo.transDate = '070824';
            gpo.transTime = '172500';
            gpo.trace = 1234;
            gpo.serviceType = emv.ServiceType.GOOD;
            gpo.gacFlag = emv.GacFlag.NON;
            startData.gpo = gpo;
            startData.purpose = emv.StartPurpose.NORMAL;
            emvProcessData.startData = startData;
            bindEmvEvents();
            try
            {
                emv.startProcess(startData);
            }
            catch (err)
            {
                ToastService.ShowToast('Failed to start EMV process: ' + JSON.stringify(err),'error');
            }
        }

        function getBalanceTest()
        {
            emvProcessData = {};

            var startData = new emv.StartData();
            startData.pseFlag = emv.PseFlag.PSE_AID;
            var gpo = new emv.Gpo();
            gpo.amount = 1;
            gpo.otherAmount = 0;
            gpo.transDate = '070824';
            gpo.transTime = '172500';
            gpo.trace = 1234;
            gpo.serviceType = emv.ServiceType.GOOD;
            gpo.gacFlag = emv.GacFlag.NON;
            startData.gpo = gpo;
            startData.purpose = emv.StartPurpose.BALANCE;
            emvProcessData.startData = startData;
            try
            {
                emv.startProcess(startData);
            }
            catch (err)
            {
                ToastService.ShowToast('Failed to start EMV process: ' + JSON.stringify(err),'error');
            }
        }

        function getContactIcLogsTest() {
            emvProcessData = {};

            var startData = new emv.StartData();
            startData.pseFlag = emv.PseFlag.PSE_AID;
            var gpo = new emv.Gpo();
            gpo.amount = 1;
            gpo.otherAmount = 0;
            gpo.transDate = '070824';
            gpo.transTime = '172500';
            gpo.trace = 1234;
            gpo.serviceType = emv.ServiceType.GOOD;
            gpo.gacFlag = emv.GacFlag.NON;
            startData.gpo = gpo;
            startData.purpose = emv.StartPurpose.ICLOG;
            emvProcessData.startData = startData;
            try {
                emv.startProcess(startData);
            } catch (err) {
                argo.addLog('Failed to start EMV process: ' + JSON.stringify(err));
            }
        }

        function getContactEcLogsTest() {
            emvProcessData = {};

            var startData = new emv.StartData();
            startData.pseFlag = emv.PseFlag.PSE_AID;
            var gpo = new emv.Gpo();
            gpo.amount = 1;
            gpo.otherAmount = 0;
            gpo.transDate = '070824';
            gpo.transTime = '172500';
            gpo.trace = 1234;
            gpo.serviceType = emv.ServiceType.GOOD;
            gpo.gacFlag = emv.GacFlag.NON;
            startData.gpo = gpo;
            startData.purpose = emv.StartPurpose.ECLOG;
            emvProcessData.startData = startData;
            try {
                emv.startProcess(startData);
            } catch (err) {
                argo.addLog('Failed to start EMV process: ' + JSON.stringify(err));
            }
        }

        function getRfIcLogsTest() {
            emvProcessData = {};

            var startData = new emv.StartData();
            startData.pseFlag = emv.PseFlag.PSE_AID;
            var gpo = new emv.Gpo();
            gpo.amount = 1;
            gpo.otherAmount = 0;
            gpo.transDate = '070824';
            gpo.transTime = '172500';
            gpo.trace = 1234;
            gpo.serviceType = emv.ServiceType.GOOD;
            gpo.gacFlag = emv.GacFlag.NON;
            startData.gpo = gpo;
            startData.purpose = emv.StartPurpose.ICLOG;
            emvProcessData.startData = startData;
            try {
                emv.startProcess(startData);
            } catch (err) {
                argo.addLog('Failed to start EMV process: ' + JSON.stringify(err));
            }
        }

        function getRfEcLogsTest() {
            emvProcessData = {};

            var startData = new emv.StartData();
            startData.pseFlag = emv.PseFlag.PSE_AID;
            var gpo = new emv.Gpo();
            gpo.amount = 1;
            gpo.otherAmount = 0;
            gpo.transDate = '070824';
            gpo.transTime = '172500';
            gpo.trace = 1234;
            gpo.serviceType = emv.ServiceType.GOOD;
            gpo.gacFlag = emv.GacFlag.NON;
            startData.gpo = gpo;
            startData.purpose = emv.StartPurpose.ECLOG;
            emvProcessData.startData = startData;
            try {
                emv.startProcess(startData);
            } catch (err) {
                argo.addLog('Failed to start EMV process: ' + JSON.stringify(err));
            }
        }

        function emvConfig()
        {
            try
            {
                emv.config({
                    base: emvData.defaultBasicParam,
                    pboc: emvData.defaultPbocParam,
                    visa: emvData.defaultVisaParam,
                    ddol: '9F3704',
                    tdol: '9F0802'
                });
                argo.addLog('EMV config finished.');
            }
            catch (err)
            {
                argo.addLog('Failed to config EMV: ' + JSON.stringify(err));
            }
        }

        function emvGetInfo()
        {
            try
            {
                var info = emv.getInfo();
                ToastService.ShowToast('EMV info: ' + JSON.stringify(info),'success');
            }
            catch (err)
            {
                ToastService.ShowToast('Failed to get EMV info: ' + JSON.stringify(err),'error');
            }
        }

        return {
            initEmv: initEmv,
            startEmvTest: startEmvTest,
            getBalanceTest: getBalanceTest,
            getContactIcLogsTest: getContactIcLogsTest,
            getContactEcLogsTest: getContactEcLogsTest,
            getRfIcLogsTest: getRfIcLogsTest,
            getRfEcLogsTest: getRfEcLogsTest,
            emvConfig: emvConfig,
            emvGetInfo: emvGetInfo
        };
}])