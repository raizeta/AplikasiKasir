/* jshint -W117 */
argo.hermesTestOther = (function () {
    'use strict';

    var nymph = require('nymph'),
        app = nymph.app;

    function getTerminalInfo() {
        try {
            var info = app.getTerminalInfo();
            argo.addLog('Terminal information：' + JSON.stringify(info));
        } catch (err) {
            argo.addLog('Failed to get terminal information：' + JSON.stringify(err));
        }
    }

    function setDatetime() {
        try {
            // YYYYMMDDHHMMSS
            var date = new Date("2016-08-03 12:12:12");
            app.setDateTime(date);
        } catch (err) {
            argo.addLog('Failed to set datetime：' + JSON.stringify(err));
        }
    }

    function start() {
        app.start(function (err) {
            if (err) {
                argo.addLog('Failed to start：' + JSON.stringify(err));
            } else {
                argo.addLog('Start completed.');
            }
        });
    }

    function stop() {
        app.stop(function (err) {
            if (err) {
                argo.addLog('Failed to stop：' + JSON.stringify(err));
            } else {
                argo.addLog('Stop completed.');
            }
        });
    }

    return {
        getTerminalInfo: getTerminalInfo,
        setDatetime: setDatetime,
        start: start,
        stop: stop
    };
})();
