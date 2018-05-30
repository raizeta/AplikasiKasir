/**
 * Created by lilin01 on 2015/11/26.
 */
(function () {
    'use strict';
    /* jshint -W117 */
    argo.pinPadService = (function () {
        var nymph = require('nymph'),
            masterIndex = 1,
            pinIndex = 2,
            macIndex = 4,
            desIndex = 3,
            pinPadInstance = new nymph.dev.pinPad.PinPad(nymph.dev.pinPad.PinPadType.IPP, {
                managerId: 0x01,
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

        function inputOnlinePin(cfg) {
            pinPadInstance.removeAllListeners();
            pinPadInstance.on('keypress', function (keycode) {
                    onKeypress(keycode);
                }
            );
            pinPadInstance.open();
            pinPadInstance.inputOnlinePin(pinKey, cfg, function (err, pinBlock) {
                pinPadInstance.close();
                if (err) {
                    argo.addLog('Online PIN Deal Failure:' + JSON.stringify(err));
                } else {
                    argo.addLog('Online PIN Deal Result:' + nymph.util.encoding.bufferToHexString(pinBlock));
                }
            });

            function onKeypress(keyCode) {
                var pin = '';
                switch (keyCode) {
                    // Key Enter
                    case 13:
                        if (scope.indexOf(pinLength)) {
                            argo.addLog('PIN Length = ' + pinLength);
                        } else {
                            argo.addLog('PIN Length is invalid!');
                        }
                        break;

                    // Cancel
                    case 27:
                        argo.addLog('Cancel Input PIN!');
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


        }


        return {
            inputOnlinePin: inputOnlinePin
        };
    })();
})();