/* jshint -W117 */
argo.hermesTestGprs = (function () {
    'use strict';

    var nymph = require('nymph'), gprsManager,
        connectivityManager = nymph.comm.connectivityManager,
        NetworkType = connectivityManager.NetworkType;

    gprsManager = connectivityManager.getNetworkManager(NetworkType.GPRS);

    function open() {
        connectivityManager.open(NetworkType.GPRS, function (err) {
            if (err) {
                argo.addLog('Failed to open GPRS, Error='+JSON.stringify(err))
            } else {
                argo.addLog('GPRS opened.')
            }
        })
    }

    function close() {
        connectivityManager.close(NetworkType.GPRS, function (err) {
            if (err) {
                argo.addLog('Failed to close GPRS, Error='+JSON.stringify(err))
            } else {
                argo.addLog('GPRS closed.')
            }
        })
    }

    function setDefaultAPN() {
        var options = {
            name: 'CDMA',
            apn: 'CDMA',
            user: 'CDMA',
            password: 'CDMA'
        };
        gprsManager.setDefaultAPN(options, function (err) {
            if (err) {
                argo.addLog('setDefaultAPN fail, APN=' + JSON.stringify(options) + ',Error=' + JSON.stringify(err));
            } else {
                argo.addLog('setDefaultAPN success, APN=' + JSON.stringify(options));
            }
        });
    }

    function getDefaultAPN() {
        gprsManager.getDefaultAPN(function (err, result) {
            if (err) {
                argo.addLog('getDefaultAPN fail, Error=' + JSON.stringify(err));
            } else {
                argo.addLog('getDefaultAPN success, APN=' + JSON.stringify(result));
            }
        });
    }

    return {
        open: open,
        close: close,
        setDefaultAPN: setDefaultAPN,
        getDefaultAPN: getDefaultAPN
    };
})();
