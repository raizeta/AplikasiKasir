angular.module('starter')
.service('NymphCardService',['ToastService','$ionicPlatform','$rootScope','$ionicLoading',function(ToastService,$ionicPlatform,$rootScope,$ionicLoading)
{
        var asyncCards = [];
        var nymph = require('nymph');
//        var callback = function()
//        {
//            $ionicLoading.hide();
//            nymph.dev.cardReader.stopAcquireCard();
//            ToastService.ShowToast('Cancelled the card acquiring.','error');
//        };
//        var priority = 600;
//        var deregister = $ionicPlatform.registerBackButtonAction(callback, priority);
//        $rootScope.$on('$destroy', deregister)

        /**
         * stop acquiring card
         */
        function stopAcquireCard()
        {
            try
            {
                nymph.dev.cardReader.stopAcquireCard();

            } catch (err)
            {
                ToastService.ShowToast('Failed to stop acquiring a card: ' + JSON.stringify(err),'error');
            }
        }

        /**
         * swipe card
         */
        function acquireCardAsyncMag()
        {
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Please swipe card</span><ion-spinner icon="lines"/></p>',
            })
            nymph.dev.cardReader.waitForCard(
            [{
                type: nymph.dev.cardReader.CardType.MAGCARD,
                slot: nymph.dev.cardReader.SlotType.SWIPE
            }],
            function (err, card)
            {
                $ionicLoading.hide();
                if (err)
                {
                    // Failed to get the card.
                    switch (err.code)
                    {
                        case nymph.error.CANCELLED:
                            ToastService.ShowToast('Acquiring card cancelled.','error');
                            break;
                        default:
                            ToastService.ShowToast('Acquiring card failed:' + JSON.stringify(err),'error');
                            break;
                    }
                }
                else
                {
                    switch (card.type)
                    {
                        case nymph.dev.cardReader.CardType.MAGCARD:

                            var data = card.tracks[1].data.toString('utf8', 0, card.tracks[1].data.length);
                            var index = data.indexOf('=');
                            if (index > -1)
                            {
                                data = data.substring(0, index);
                            }
                            asyncCards.push(card);

                            var tracks = card.tracks;
                            var tracksLength = tracks.length;
                            var trackData = '';
                            for (var k = 0; k < tracksLength; k++)
                            {
                                if (tracks[k].flag === nymph.error.SUCCESS)
                                {
                                    trackData = trackData + 'track ' + (k + 1) + ', data:' + tracks[k].data.toString('ascii') + '. ';
                                }
                                else
                                {
                                    trackData = trackData + 'track  ' + (k + 1) + ' status:' + tracks[k].errMsg + '. ';
                                }
                            }
                            ToastService.ShowToast(trackData,'success');
                            break;
                        default:
                            ToastService.ShowToast('Only magcard can be obtained at present.','error');
                            break;
                    }
                }
            });
        }

        /**
         * Insert Card
         */
        function acquireCardAsyncIcc()
        {
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Please insert card</span><ion-spinner icon="lines"/></p>',
            });
            nymph.dev.cardReader.waitForCard(
            [{
                type: nymph.dev.cardReader.CardType.CPUCARD,
                slot: nymph.dev.cardReader.SlotType.ICC1
            }],
            function (err, card)
            {
                $ionicLoading.hide();
                if (err)
                {
                    switch (err.code)
                    {
                        case nymph.error.CANCELLED:
                            ToastService.ShowToast('Acquiring card cancelled.','error');
                            break;
                        default:
                            ToastService.ShowToast('Acquiring card failed:' + JSON.stringify(err),'error');
                            break;
                    }
                }
                else
                {
                    switch (card.type)
                    {
                        case nymph.dev.cardReader.CardType.CPUCARD:
                            if (card.slot === nymph.dev.cardReader.SlotType.RF)
                            {
                                ToastService.ShowToast('Only contact IC card can be obtained at present.','error');
                                return;
                            }
                            else
                            {
                                argo.addLog('Card inserted,a CPU card instance obtained.', function ()
                                {
                                    var bufSelectApp = new nymph.buffer.Buffer([0x00, 0xa4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01, 0x00]);
                                    card.communicate(bufSelectApp, function (err, result)
                                    {
                                        if (err)
                                        {
                                            argo.addLog('APDU communication error:' + JSON.stringify(err));
                                        }
                                        else
                                        {
                                            argo.addLog('APDU directive: ' + nymph.util.encoding.bufferToHexString(bufSelectApp) + ', result:' + nymph.util.encoding.bufferToHexString(result));
                                            asyncCards.push(card);
                                        }
                                    });
                                });
                            }
                            break;
                        default:
                            ToastService.ShowToast('Only contact IC card can be obtained at present.','error');
                            break;
                    }
                }
            });
        }

        /**
         * RF card
         */
        function acquireCardAsyncRf()
        {
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Please present card</span><ion-spinner icon="lines"/></p>',
            });
            nymph.dev.cardReader.waitForCard(
            [{
                type: nymph.dev.cardReader.CardType.CPUCARD,
                slot: nymph.dev.cardReader.SlotType.RF
            }],
            function (err, card)
            {
                $ionicLoading.hide();
                if (err)
                {
                    // Failed to get the card.
                    switch (err.code)
                    {
                        case nymph.error.CANCELLED:
                            ToastService.ShowToast('Acquiring card cancelled.','error');
                            break;
                        default:
                            ToastService.ShowToast('Acquiring cards failed:' + JSON.stringify(err),'error');
                            break;
                    }
                }
                else
                {
                    switch (card.type)
                    {
                        case nymph.dev.cardReader.CardType.CPUCARD:
                            if (card.slot === nymph.dev.cardReader.SlotType.RF)
                            {
                                console.log(JSON.stringify(card));
                                ToastService.ShowToast('Card presented,a CPU card instance obtained,power up data:' + nymph.util.encoding.bufferToHexString(card.powerUpData),'success');

                                var bufSelectApp = new nymph.buffer.Buffer([0x00, 0xa4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01, 0x00]);
                                asyncCards.push(card);
                                card.communicate(bufSelectApp, function (err, result)
                                {
                                    console.log(err);
                                    console.log(result);
                                    if (err)
                                    {
                                        ToastService.ShowToast('APDU communication error :' + JSON.stringify(err),'error');
                                    }
                                    else if(result)
                                    {
                                        ToastService.ShowToast('APDU directive: ' + nymph.util.encoding.bufferToHexString(bufSelectApp) + ', result:' + nymph.util.encoding.bufferToHexString(result),'success');

                                    }
                                    else
                                    {
                                        ToastService.ShowToast('APDU communication error','error');
                                    }
                                });

                            }
                            else
                            {
                                ToastService.ShowToast('Only contactless IC card can be obtained at present.','error');
                                return;
                            }
                            break;
                        default:
                            ToastService.ShowToast('Only contactless IC card can be obtained at present.','error');
                            break;
                    }
                }
            });
        }

        /**
         * Release Card
         */
        function releaseCard()
        {
            if (asyncCards.length === 0)
            {
                ToastService.ShowToast('Card instance was not found.','error');
                return;
            }
            else
            {
                asyncCards.forEach(function (card)
                {
                    try
                    {
                        argo.id('card').value = '';
                        card.release();
                        argo.addLog('{InstanceId:' + card.instanceId + ',slot:' + card.slot + '} Card has been released.', function ()
                        {
                            if (card.slot === nymph.dev.cardReader.SlotType.RF || card.slot === nymph.dev.cardReader.SlotType.ICC1 || card.slot === nymph.dev.cardReader.SlotType.ICC2 || card.slot === nymph.dev.cardReader.SlotType.ICC3) {
                                argo.addLog('Please take the card', function ()
                                {
                                    nymph.dev.cardReader.waitForCardTaken(card, function (err)
                                    {
                                        if (err)
                                        {
                                            ToastService.ShowToast('Waiting to take card failed:' + JSON.stringify(err),'error');
                                        }
                                        else
                                        {
                                            ToastService.ShowToast('User has removed card.','success');
                                        }
                                    });
                                });
                            }
                        });
                    }
                    catch (err)
                    {
                        ToastService.ShowToast(err.code + ' ' + err.message,'error');
                    }
                });
                asyncCards = [];
            }
        }

        /**
         * swipe / insert / RF card
         */
        function acquireCardAsync()
        {
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Please swipe/insert/present card</span><ion-spinner icon="lines"/></p>',
            });
            nymph.dev.cardReader.waitForCard(
            [{
                type: nymph.dev.cardReader.CardType.CPUCARD,
                slot: nymph.dev.cardReader.SlotType.ICC1
            },
            {
                type: nymph.dev.cardReader.CardType.MAGCARD,
                slot: nymph.dev.cardReader.SlotType.SWIPE
            },
            {
                type: nymph.dev.cardReader.CardType.CPUCARD,
                slot: nymph.dev.cardReader.SlotType.RF
            },
            {
                type: nymph.dev.cardReader.CardType.M1CARD,
                slot: nymph.dev.cardReader.SlotType.RF
            }],
            function (err, card)
            {
                $ionicLoading.hide();
                if (err)
                {
                    // Failed to get the card.
                    switch (err.code)
                    {
                        case nymph.error.CANCELLED:
                            ToastService.ShowToast('Acquiring card cancelled.','error');
                            break;
                        default:
                            ToastService.ShowToast('Acquiring cards failed:' + JSON.stringify(err),'error');
                            break;
                    }
                }
                else
                {
                    switch (card.type)
                    {
                        case nymph.dev.cardReader.CardType.MAGCARD:
                            var data = card.tracks[1].data.toString('utf8', 0, card.tracks[1].data.length);
                            var index = data.indexOf('=');
                            if (index > -1)
                            {
                                data = data.substring(0, index);
                            }
                            $rootScope.$broadcast('pembayaran-sukses',data);
                            asyncCards.push(card);
                            break;
                        case nymph.dev.cardReader.CardType.CPUCARD:
                            if (card.slot === nymph.dev.cardReader.SlotType.RF)
                            {
                                var data    = nymph.util.encoding.bufferToHexString(card.powerUpData);
                                $rootScope.$broadcast('pembayaran-sukses',data);
                            }
                            else
                            {
                                argo.addLog('Card inserted,a contact CPU card instance obtained.', function ()
                                {
                                    var bufSelectApp = new nymph.buffer.Buffer([0x00, 0xa4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01, 0x00]);
                                    card.communicate(bufSelectApp, function (err, result)
                                    {
                                        if (err)
                                        {
                                            ToastService.ShowToast('APDU communication error:' + JSON.stringify(err),'error');
                                        }
                                        else
                                        {
                                            $rootScope.$broadcast('pembayaran-sukses');
                                            var resultBuf = new nymph.buffer.Buffer(result, 'base64');
                                            ToastService.ShowToast('APDU directive: ' + nymph.util.encoding.bufferToHexString(bufSelectApp) + ', result:' + nymph.util.encoding.bufferToHexString(resultBuf),'success');
                                            asyncCards.push(card);
                                        }
                                    });
                                });
                            }
                            break;
                        case nymph.dev.cardReader.CardType.M1CARD:
                            argo.id('card').value = card.cardSn;
                            ToastService.ShowToast('Card presented, a M1 card instance obtained:' + card.cardSn,'success');
                            break;
                    }
                }
            });
        }

        /**
         * Is Card In
         */
        function isCardIn()
        {
            var card;
            if (asyncCards.length === 0)
            {
                ToastService.ShowToast('Please get card instance first.','error');
                return;
            }
            else
            {
                asyncCards.forEach(function (card)
                {
                    try
                    {
                        var isCardExist = nymph.dev.cardReader.isCardIn(card);
                        ToastService.ShowToast('{InstanceId:' + card.instanceId + ',slot:' + card.slot + '}is the card in :' + isCardExist,'success');
                    }
                    catch (err)
                    {
                        ToastService.ShowToast('{InstanceId:' + card.instanceId + ',slot:' + card.slot + '}check card in failed:' + JSON.stringify(err),'error');
                    }
                });
            }

        }

        /**
         * Obtain Fixed Card
         */
        function acquireCardSync()
        {
            argo.addLog('Get fixed cards', function ()
            {
                nymph.dev.cardReader.getFixedCards(
                [{
                    type: nymph.dev.cardReader.CardType.CPUCARD,
                    slot: nymph.dev.cardReader.SlotType.PSAM1
                },
                {
                    type: nymph.dev.cardReader.CardType.CPUCARD,
                    slot: nymph.dev.cardReader.SlotType.PSAM2,
                    options: {powerMode: nymph.dev.cardReader.ic.PowerMode.MODE384}
                }],
                function (err, cards)
                {
                    if (err)
                    {
                        ToastService.ShowToast('Failed to get PSAM card instances:' + JSON.stringify(err),'error');
                    } else
                    {
                        cards.forEach(function (card, index)
                        {
                            if (card.hasOwnProperty('acquireErr'))
                            {
                                // Failed to get the card. 'acquireErr' has more details about failure.
                                ToastService.ShowToast('Failed to get card instance.','error');
                            }
                            else
                            {
                                var bufGetRandom = new nymph.buffer.Buffer([0x00, 0x84, 0x00, 0x00, 0x08]);
                                card.communicate(bufGetRandom, function (err, result)
                                {
                                    if (err)
                                    {
                                        ToastService.ShowToast('instanceId:' + card.instanceId + ',slot:' + card.slot + ',APDU communication failed' + JSON.stringify(err),'error');
                                        asyncCards.push(card);
                                    }
                                    else
                                    {
                                        var resultBuf = new nymph.buffer.Buffer(result, 'base64');
                                        ToastService.ShowToast('instanceId:' + card.instanceId + ',slot:' + card.slot + ',APDU directive: ' + nymph.util.encoding.bufferToHexString(bufGetRandom) + 'result:' + nymph.util.encoding.bufferToHexString(resultBuf),'success');
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
}])