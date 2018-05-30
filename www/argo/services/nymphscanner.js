angular.module('starter')
.service('NymphScannerService',['ToastService',function(ToastService)
{
    var nymph = require('nymph');
    function openScanner()
    {
        try
        {
            nymph.dev.scanner.open();
        }
        catch (e)
        {
            ToastService.ShowToast('Open Scanner Fail: ' + JSON.stringify(e.message),'error');
        }
    }

    function initScannerFront()
    {
        var cfg = {scannerType: 0};
        try
        {
            nymph.dev.scanner.init(cfg);
        }
        catch (e)
        {
            ToastService.ShowToast('Init Scanner Fail: ' + JSON.stringify(e.message),'error');
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
            ToastService.ShowToast('Init Scanner Fail: ' + JSON.stringify(e),'error');
        }
    }

    function startScan()
    {
        nymph.dev.scanner.startScan(10, function (err, result)
        {
            if (err)
            {
                ToastService.ShowToast('Scan Fail: ' + JSON.stringify(err),'error');
            }
            else
            {
                ToastService.ShowToast('Scan Success,Result= ' + result,'success');
            }
        });
    }

    function stopScan()
    {
        try
        {
            nymph.dev.scanner.stopScan();
        }
        catch (e)
        {
            ToastService.ShowToast('Stop Scan Fail: ' + JSON.stringify(e),'error');
        }
    }

    function closeScanner()
    {
        try
        {
            nymph.dev.scanner.close();
        }
        catch (e)
        {
            ToastService.ShowToast('Close Scanner Fail: ' + JSON.stringify(e),'error');
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
}])