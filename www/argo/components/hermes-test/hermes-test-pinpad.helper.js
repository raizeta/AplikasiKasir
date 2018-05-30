/* jshint -W117 */
argo.pinPadHelper = (function () {
    'use strict';

    var nymph = require('nymph'),
        // PCI 配置：groupId = 0，kapIndex = 0，masterIndex = 1
        masterIndex = 1,
        pinIndex = 2,
        macIndex = 4,
        desIndex = 3,
        pinLength = 0,
        scope = [],
        pinPadInstance = new nymph.dev.pinPad.PinPad(nymph.dev.pinPad.PinPadType.IPP, {
            managerId: 0x01,
            //APAC owner to use the configuration
            groupId: 0x03,
            kapIndex: 0x01
        }),
        pinKey = new nymph.dev.pinPad.Key({
            index: pinIndex,
            type: nymph.dev.pinPad.KeyType.PIN,
            algorithm: nymph.dev.pinPad.KeyAlgorithm.TDES
        }),
        macKey = new nymph.dev.pinPad.Key({
            index: macIndex,
            type: nymph.dev.pinPad.KeyType.MAC
        }),
        masterKey = new nymph.dev.pinPad.Key({
            index: masterIndex,
            type: nymph.dev.pinPad.KeyType.MASTER
        });

    function onKeyPress(keyCode) {
        var pin = '';
        argo.addLog('keyCode = ' + keyCode);
        switch (keyCode) {
            // Key Enter
            case 13:
                if (scope.indexOf(pinLength)) {
                    argo.addLog('PIN Length = ' + pinLength);
                } else {
                    argo.addLog('PIN length is invalid!');
                }
                break;

            // Cancel
            case 27:
                argo.addLog('PIN input cancelled.');
                return;

            // Clear
            case 101:
                pin = pin.substr(0, pin.length - 1);
                pinLength--;
                break;
            default:
                pin += String.fromCharCode(keyCode);
                pinLength++;
        }
    }

    return {
        onKeyPress: onKeyPress,
        masterKey: masterKey,
        macKey: macKey,
        pinKey: pinKey,
        pinPadInstance: pinPadInstance,
        masterIndex: 1,
        pinIndex: 2,
        macIndex: 4,
        desIndex: 3,
        pinLength: pinLength,
        scope: scope,
    };
})();
