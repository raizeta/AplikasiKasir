angular.module('starter')
.service('NymphGprsService',['ToastService',function(ToastService)
{
    var nymph = require('nymph');
    var connectivityManager = nymph.comm.connectivityManager;
    var NetworkType = connectivityManager.NetworkType;
    var gprsManager = connectivityManager.getNetworkManager(NetworkType.GPRS);

    function openGprs()
    {
        connectivityManager.open(NetworkType.GPRS, function (err)
        {
            if (err)
            {
                ToastService.ShowToast('Failed to open GPRS, Error='+JSON.stringify(err),'error');
            }
            else
            {
                ToastService.ShowToast('GPRS opened.','success');
            }
        })
    }

    function closeGprs()
    {
        connectivityManager.close(NetworkType.GPRS, function (err)
        {
            if (err)
            {
                ToastService.ShowToast('Failed to close GPRS, Error='+JSON.stringify(err),'error');
            }
            else
            {
                ToastService.ShowToast('GPRS closed.','success');
            }
        })
    }

    function setDefaultAPN()
    {
        var options = {
            name: 'CDMA',
            apn: 'CDMA',
            user: 'CDMA',
            password: 'CDMA'
        };
        gprsManager.setDefaultAPN(options, function (err)
        {
            if (err)
            {
                ToastService.ShowToast('setDefaultAPN fail, APN=' + JSON.stringify(options) + ',Error=' + JSON.stringify(err),'error');
            }
            else
            {
                ToastService.ShowToast('setDefaultAPN success, APN=' + JSON.stringify(options),'success');
            }
        });
    }

    function getDefaultAPN()
    {
        gprsManager.getDefaultAPN(function (err, result)
        {
            if (err)
            {
                ToastService.ShowToast('getDefaultAPN fail, Error=' + JSON.stringify(err),'error');
            }
            else
            {
                ToastService.ShowToast('getDefaultAPN success, APN=' + JSON.stringify(result),'success');
            }
        });
    }

    return {
        openGprs: openGprs,
        closeGprs: closeGprs,
        setDefaultAPN: setDefaultAPN,
        getDefaultAPN: getDefaultAPN
    };
}])