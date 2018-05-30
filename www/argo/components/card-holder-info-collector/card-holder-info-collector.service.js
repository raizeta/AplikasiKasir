(function () {
    'use strict';
    argo.cardHolderInfoCollectorService = {};
    var nymph = require('nymph'),
        emv = nymph.pay.emv,
        cardReader = nymph.dev.cardReader;

    function cancel() {
        var emvProcessData = argo.emvService.getEmvProcessData();
        if (emvProcessData.hasOwnProperty('record')) {
            emv.stopProcess();
        } else {
            cardReader.stopAcquireCard();
        }
    }

    function confirm() {
        emv.eventResponse({readRecord: {isBlack: false, accumulatedAmount: 123}});
    }

    argo.cardHolderInfoCollectorService.cancel = cancel;
    argo.cardHolderInfoCollectorService.confirm = confirm;
})();