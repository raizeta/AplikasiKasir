/**
 * Created by lilin01 on 2015/11/9.
 */
/* jshint -W117 */
argo.hermesTestCard = (function () {
    'use strict';

    var //asyncCard,
        asyncCards = [],
        nymph = require('nymph');

    /**
     * stop acquiring card
     */
    function stopAcquireCard() {
        try {
            nymph.dev.cardReader.stopAcquireCard();
        } catch (err) {
            argo.addLog('Failed to stop acquiring a card: ' + JSON.stringify(err));
        }
    }

    /**
     * swipe card
     */
    function acquireCardAsyncMag() {
        var popover = argo.Popover({
            elem: argo.id('dialog'),
            title: 'Card Handle',
            content: '<b style="display:block;text-align: center">Please swipe card</b>',
            button: {
                'cancel': function () {
                    nymph.dev.cardReader.stopAcquireCard();
                    popover.close();
                    argo.addLog('Cancelled the card acquiring.');
                }
            }
        });
        nymph.dev.cardReader.waitForCard([{
            type: nymph.dev.cardReader.CardType.MAGCARD,
            slot: nymph.dev.cardReader.SlotType.SWIPE
        }], function (err, card) {
            popover.close();
            if (err) {
                // Failed to get the card.
                switch (err.code) {
                    case nymph.error.CANCELLED:
                        argo.addLog('Acquiring card cancelled.');
                        break;
                    default:
                        argo.addLog('Acquiring card failed:' + JSON.stringify(err));
                        break;
                }
            } else {
                switch (card.type) {
                    case nymph.dev.cardReader.CardType.MAGCARD:
                        // Handle Track data.
                        var tracks, tracksLength,
                            data = card.tracks[1].data.toString('utf8', 0, card.tracks[1].data.length),
                            index = data.indexOf('=');
                        if (index > -1) {
                            data = data.substring(0, index);
                        }
                        asyncCards.push(card);
                        argo.addLog('A magnetic card obtained:', function () {
                            tracks = card.tracks;
                            tracksLength = tracks.length;
                            var trackData = '';
                            for (var k = 0; k < tracksLength; k++) {
                                if (tracks[k].flag === nymph.error.SUCCESS) {
                                    trackData = trackData + 'track ' + (k + 1) + ', data:' + tracks[k].data.toString('ascii') + '. ';
                                } else {
                                    trackData = trackData + 'track  ' + (k + 1) + ' status:' + tracks[k].errMsg + '. ';
                                }
                            }
                            argo.addLog(trackData);
                        });
                        break;
                    default:
                        argo.addLog('Only magcard can be obtained at present.');
                        break;
                }
            }
        });
    }

    /**
     * Insert Card
     */
    function acquireCardAsyncIcc() {
        var popover = argo.Popover({
            elem: argo.id('dialog'),
            title: 'Card Handle',
            content: '<b style="display:block;text-align: center">Please insert card</b>',
            button: {
                'cancel': function () {
                    nymph.dev.cardReader.stopAcquireCard();
                    popover.close();
                    argo.addLog('Cancelled the card acquiring.');
                }
            }
        });
        nymph.dev.cardReader.waitForCard([{
            type: nymph.dev.cardReader.CardType.CPUCARD,
            slot: nymph.dev.cardReader.SlotType.ICC1
        }], function (err, card) {
            popover.close();
            if (err) {
                switch (err.code) {
                    case nymph.error.CANCELLED:
                        argo.addLog('Acquiring card cancelled.');
                        break;
                    default:
                        argo.addLog('Acquiring card failed:' + JSON.stringify(err));
                        break;
                }
            } else {
                switch (card.type) {
                    case nymph.dev.cardReader.CardType.CPUCARD:
                        if (card.slot === nymph.dev.cardReader.SlotType.RF) {
                            argo.addLog('Only contact IC card can be obtained at present.');
                            return;
                        } else {
                            argo.addLog('Card inserted,a CPU card instance obtained.', function () {
                                var bufSelectApp = new nymph.buffer.Buffer([0x00, 0xa4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01, 0x00]);
                                card.communicate(bufSelectApp, function (err, result) {
                                    if (err) {
                                        argo.addLog('APDU communication error:' + JSON.stringify(err));
                                    } else {
                                        argo.addLog('APDU directive: ' + nymph.util.encoding.bufferToHexString(bufSelectApp) + ', result:' + nymph.util.encoding.bufferToHexString(result));
                                        asyncCards.push(card);
                                    }
                                });
                            });
                        }
                        break;
                    default:
                        argo.addLog('Only contact IC card can be obtained at present.');
                        break;
                }
            }
        });
    }

    /**
     * RF card
     */
    function acquireCardAsyncRf() {
        var popover = argo.Popover({
            elem: argo.id('dialog'),
            title: 'Card Handle',
            content: '<b style="display:block;text-align: center">Please present card</b>',
            button: {
                'cancel': function () {
                    nymph.dev.cardReader.stopAcquireCard();
                    popover.close();
                    argo.addLog('Acquiring card cancelled.');
                }
            }
        });
        nymph.dev.cardReader.waitForCard([{
            type: nymph.dev.cardReader.CardType.CPUCARD,
            slot: nymph.dev.cardReader.SlotType.RF
        }], function (err, card) {
            popover.close();
            if (err) {
                // Failed to get the card.
                switch (err.code) {
                    case nymph.error.CANCELLED:
                        argo.addLog('Acquiring card cancelled.');
                        break;
                    default:
                        argo.addLog('Acquiring cards failed:' + JSON.stringify(err));
                        break;
                }
            } else {
                switch (card.type) {
                    case nymph.dev.cardReader.CardType.CPUCARD:
                        if (card.slot === nymph.dev.cardReader.SlotType.RF) {
                            argo.addLog('Card presented,a CPU card instance obtained,power up data:' + nymph.util.encoding.bufferToHexString(card.powerUpData),
                            function ()
                            {
                                var bufSelectApp = new nymph.buffer.Buffer([0x00, 0xa4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01, 0x00]);
                                asyncCards.push(card);
                                card.communicate(bufSelectApp, function (err, result)
                                {
                                    if (err)
                                    {
                                        argo.addLog('APDU communication error :' + JSON.stringify(err));
                                    }
                                    else
                                    {
                                        argo.addLog('APDU directive: ' + nymph.util.encoding.bufferToHexString(bufSelectApp) + ', result:' + nymph.util.encoding.bufferToHexString(result),
                                        function () {
                                            //argo.id('card').value = card.cardSn;
                                        });
                                    }
                                });
                            });

                        } else {
                            argo.addLog('Only contactless IC card can be obtained at present.');
                            return;
                        }
                        break;
                    case nymph.dev.cardReader.CardType.M1CARD:
                        asyncCards.push(card);
                        argo.id('card').value = card.cardSn;
                        argo.addLog('Card presented,a M1 card instance obtained:' + card.cardSn, function () {
                            // Use TYPE-A key to authorize the sector 0.
                            var sectorNum = 0;
                            var key = new nymph.buffer.Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff]);
                            card.authority(nymph.dev.cardReader.ic.M1Card.KeyType.TYPEA, sectorNum, key);
                            argo.addLog('Authentication of section 0 succeed using Type A key.', function () {
                                // Read block 0 data of sector 0 (One sector has 4 blocks)
                                var blockNum = sectorNum * 4 + 0;
                                var blockData = card.readBlock(blockNum);
                                argo.addLog('The data length of number 0 block of section 0: ' + blockData.length + ',data:' + nymph.util.encoding.bufferToHexString(blockData));
                                blockNum = sectorNum * 4 + 1;
                                blockData = card.readBlock(blockNum);
                                argo.addLog('The data length of number 1 block of section 0: ' + blockData.length + ',data:' + nymph.util.encoding.bufferToHexString(blockData));

                                var initData = new nymph.buffer.Buffer([0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0x00, 0xff]);
                                card.writeBlock(blockNum, initData);
                                argo.addLog('Format the number 1 block of section 0 to data block, the initial vlue is 0.');

                                blockData = card.readBlock(blockNum);
                                argo.addLog('After writing, the data length of number 1 block of section 0 : ' + blockData.length + ',data:' + nymph.util.encoding.bufferToHexString(blockData));

                                blockNum = sectorNum * 4 + 2;
                                blockData = card.readBlock(blockNum);
                                argo.addLog('The data length of number 2 block of section 0: ' + blockData.length + ',data:' + nymph.util.encoding.bufferToHexString(blockData));
                                blockNum = sectorNum * 4 + 3;
                                blockData = card.readBlock(blockNum);
                                argo.addLog('The data length of number 3 block of section 0: ' + blockData.length + ',data:' + nymph.util.encoding.bufferToHexString(blockData));
                                //argo.id('card').value = card.cardSn;
                                //asyncCards.push(card);
                                //releaseCard();
                            });
                        });
                        break;
                    default:
                        argo.addLog('Only contactless IC card can be obtained at present.');
                        break;
                }
            }
        });
    }

    /**
     * Release Card
     */
    function releaseCard() {
        if (asyncCards.length === 0) {
            argo.addLog('Card instance was not found.');
            return;
        } else {
            console.log('asyncCards.length=======' + asyncCards.length);
            asyncCards.forEach(function (card) {
                console.log(card);
                try {
                    argo.id('card').value = '';
                    card.release();
                    argo.addLog('{InstanceId:' + card.instanceId + ',slot:' + card.slot + '} Card has been released.', function () {
                        if (card.slot === nymph.dev.cardReader.SlotType.RF || card.slot === nymph.dev.cardReader.SlotType.ICC1 || card.slot === nymph.dev.cardReader.SlotType.ICC2 || card.slot === nymph.dev.cardReader.SlotType.ICC3) {
                            argo.addLog('Please take the card', function () {
                                nymph.dev.cardReader.waitForCardTaken(card, function (err) {
                                    if (err) {
                                        argo.addLog('Waiting to take card failed:' + JSON.stringify(err));
                                    } else {
                                        argo.addLog('User has removed card.');
                                    }
                                });
                            });
                        }
                    });
                } catch (err) {
                    argo.addLog(err.code + ' ' + err.message);
                }
            });
            asyncCards = [];
        }
    }

    /**
     * swipe / insert / RF card
     */
    function acquireCardAsync() {
        var popover = argo.Popover({
            elem: argo.id('dialog'),
            title: 'Card Handle',
            content: '<b style="display:block;text-align: center">Please swipe/insert/present card</b>',
            button: {
                'cancel': function () {
                    nymph.dev.cardReader.stopAcquireCard();
                    popover.close();
                    argo.addLog('Acquiring card cancelled');
                }
            }
        });
        nymph.dev.cardReader.waitForCard([{
            type: nymph.dev.cardReader.CardType.CPUCARD,
            slot: nymph.dev.cardReader.SlotType.ICC1
        }, {
            type: nymph.dev.cardReader.CardType.MAGCARD,
            slot: nymph.dev.cardReader.SlotType.SWIPE
        }, {
            type: nymph.dev.cardReader.CardType.CPUCARD,
            slot: nymph.dev.cardReader.SlotType.RF
        }, {
            type: nymph.dev.cardReader.CardType.M1CARD,
            slot: nymph.dev.cardReader.SlotType.RF
        }], function (err, card) {
            popover.close();
            if (err) {
                // Failed to get the card.
                switch (err.code) {
                    case nymph.error.CANCELLED:
                        argo.addLog('Acquiring card cancelled.');
                        break;
                    default:
                        argo.addLog('Acquiring cards failed:' + JSON.stringify(err));
                        break;
                }
            } else {
                switch (card.type) {
                    case nymph.dev.cardReader.CardType.MAGCARD:
                        // Handle track data.
                        var data = card.tracks[1].data.toString('utf8', 0, card.tracks[1].data.length);
                        var index = data.indexOf('=');
                        if (index > -1) {
                            data = data.substring(0, index);
                        }
                        argo.id('card').value = data;
                        argo.addLog('user swiped card,a magnetic card instance obtained:' + data);
                        asyncCards.push(card);
                        break;
                    case nymph.dev.cardReader.CardType.CPUCARD:
                        if (card.slot === nymph.dev.cardReader.SlotType.RF) {
                            argo.addLog('Card presented,a contactless CPU card instance obtained.', function () {
                                var bufSelectApp = new nymph.buffer.Buffer([0x00, 0xa4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01, 0x00]);
                                card.communicate(bufSelectApp, function (err, result) {
                                    if (err) {
                                        argo.addLog('APDU communication error :' + JSON.stringify(err));
                                    } else {
                                        var resultBuf = new nymph.buffer.Buffer(result, 'base64');
                                        argo.addLog('APDU directive: ' + nymph.util.encoding.bufferToHexString(bufSelectApp) + ', result:' + nymph.util.encoding.bufferToHexString(resultBuf));
                                        asyncCards.push(card);
                                    }
                                });
                            });
                        } else {
                            argo.addLog('Card inserted,a contact CPU card instance obtained.', function () {
                                var bufSelectApp = new nymph.buffer.Buffer([0x00, 0xa4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01, 0x00]);
                                card.communicate(bufSelectApp, function (err, result) {
                                    if (err) {
                                        argo.addLog('APDU communication error:' + JSON.stringify(err));
                                    } else {
                                        var resultBuf = new nymph.buffer.Buffer(result, 'base64');
                                        argo.addLog('APDU directive: ' + nymph.util.encoding.bufferToHexString(bufSelectApp) + ', result:' + nymph.util.encoding.bufferToHexString(resultBuf));
                                        asyncCards.push(card);
                                    }
                                });
                            });
                        }
                        break;
                    case nymph.dev.cardReader.CardType.M1CARD:
                        argo.id('card').value = card.cardSn;
                        argo.addLog('Card presented, a M1 card instance obtained:' + card.cardSn);
                        break;
                }
            }
        });
    }

    /**
     * Is Card In
     */
    function isCardIn() {
        var card;
        if (asyncCards.length === 0) {
            argo.addLog('Please get card instance first.');
            return;
        } else {
            asyncCards.forEach(function (card) {
                try {
                    var isCardExist = nymph.dev.cardReader.isCardIn(card);
                    argo.addLog('{InstanceId:' + card.instanceId + ',slot:' + card.slot + '}is the card in :' + isCardExist);
                } catch (err) {
                    argo.addLog('{InstanceId:' + card.instanceId + ',slot:' + card.slot + '}check card in failed:' + JSON.stringify(err));
                }
            });
        }

    }

    /**
     * Obtain Fixed Card
     */
    function acquireCardSync() {
        argo.addLog('Get fixed cards', function () {
            nymph.dev.cardReader.getFixedCards([{
                type: nymph.dev.cardReader.CardType.CPUCARD,
                slot: nymph.dev.cardReader.SlotType.PSAM1
            }, {
                type: nymph.dev.cardReader.CardType.CPUCARD,
                slot: nymph.dev.cardReader.SlotType.PSAM2,
                options: {powerMode: nymph.dev.cardReader.ic.PowerMode.MODE384}
            }], function (err, cards) {
                if (err) {
                    argo.addLog('Failed to get PSAM card instances:' + JSON.stringify(err));
                } else {
                    cards.forEach(function (card, index) {
                        if (card.hasOwnProperty('acquireErr')) {
                            // Failed to get the card. 'acquireErr' has more details about failure.
                            argo.addLog('Failed to get card instance.');
                        } else {
                            var bufGetRandom = new nymph.buffer.Buffer([0x00, 0x84, 0x00, 0x00, 0x08]);
                            card.communicate(bufGetRandom, function (err, result) {
                                if (err) {
                                    argo.addLog('instanceId:' + card.instanceId + ',slot:' + card.slot + ',APDU communication failed' + JSON.stringify(err));
                                    asyncCards.push(card);
                                } else {
                                    var resultBuf = new nymph.buffer.Buffer(result, 'base64');
                                    argo.addLog('instanceId:' + card.instanceId + ',slot:' + card.slot + ',APDU directive: ' + nymph.util.encoding.bufferToHexString(bufGetRandom) + 'result:' + nymph.util.encoding.bufferToHexString(resultBuf));
                                    console.log('instanceId:' + card.instanceId + ',slot:' + card.slot + ',APDU directive: ' + nymph.util.encoding.bufferToHexString(bufGetRandom) + 'result:' + nymph.util.encoding.bufferToHexString(resultBuf));
                                    asyncCards.push(card);
                                }
                            });
                        }
                    });
                }
            });
        });
    }


    return {
        acquireCardAsyncMag: acquireCardAsyncMag,
        acquireCardAsyncIcc: acquireCardAsyncIcc,
        acquireCardAsyncRf: acquireCardAsyncRf,
        releaseCard: releaseCard,
        acquireCardAsync: acquireCardAsync,
        isCardIn: isCardIn,
        acquireCardSync: acquireCardSync,
        stopAcquireCard: stopAcquireCard
    };
})();
