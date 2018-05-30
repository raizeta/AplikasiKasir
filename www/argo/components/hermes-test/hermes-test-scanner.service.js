/**
 * Created by guosx on 2016/08/02.
 */
/* jshint -W117 */
argo.hermesTestScanner = (function () {
    'use strict';

    var nymph = require('nymph');

    function openScanner() {
        try
        {
            nymph.dev.scanner.open();
            argo.addLog('open scanner success');
        }
        catch (e)
        {
            argo.addLog('open scanner fail:' + JSON.stringify(e.message));
        }
    }

    function initScannerFront() {
        var cfg = {
            scannerType: 0
        };
        try {
            nymph.dev.scanner.init(cfg);
            argo.addLog('init scanner success');
        } catch (e) {
            argo.addLog('init scanner fail:' + JSON.stringify(e.message));
        }
    }

    function initScannerBack()
    {
        var cfg = {scannerType: 1};
        try
        {
            nymph.dev.scanner.init(cfg);
        }
        catch (e)
        {
            argo.addLog('init scanner fail:' + JSON.stringify(e));
        }
    }

    function startScan()
    {
        nymph.dev.scanner.startScan(10, function (err, result)
        {
            if (err)
            {
                argo.addLog('scan fail:' + JSON.stringify(err));
            }
            else
            {

                argo.addLog('scan success,result=' + result);
            }
        });
    }

    function stopScan()
    {
        try
        {
            nymph.dev.scanner.stopScan();
            argo.addLog('stop scan success');
        }
        catch (e)
        {
            argo.addLog('stop scan fail:' + JSON.stringify(e));
        }
    }

    function closeScanner() {
        try {
            nymph.dev.scanner.close();
            argo.addLog('close scanner success');
        } catch (e) {
            argo.addLog('close scanner fail��' + JSON.stringify(e));
        }
    }

    return {
        openScanner: openScanner,
        initScannerFront: initScannerFront,
        initScannerBack: initScannerBack,
        startScan: startScan,
        stopScan: stopScan,
        closeScanner: closeScanner
    };
})();
