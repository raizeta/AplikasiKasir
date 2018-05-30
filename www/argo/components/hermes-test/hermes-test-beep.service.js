/* jshint -W117 */
argo.hermesTestBeep = (function () {
    'use strict';

    var nymph = require('nymph'),
        media = nymph.sys.media;

    function beepNormal() {
        try {
            media.beep(media.BeepMode.NORMAL);
        } catch (err) {
            argo.addLog('Failed to beep: ' + JSON.stringify(err));
        }
    }

    function beepFail() {
        try {
            media.beep(media.BeepMode.FAIL);
        } catch (err) {
            argo.addLog('Failed to beep: ' + JSON.stringify(err));
        }
    }

    function beepInterval() {
        try {
            media.beep(media.BeepMode.INTERVAL);
        } catch (err) {
            argo.addLog('Failed to beep: ' + JSON.stringify(err));
        }
    }

    function beepTime() {
        try {
            media.beep(2000);
        } catch (err) {
            argo.addLog('Failed to beep: ' + JSON.stringify(err));
        }
    }


    return {
        beepTime: beepTime,
        beepInterval: beepInterval,
        beepFail: beepFail,
        beepNormal: beepNormal,
    };
})();
