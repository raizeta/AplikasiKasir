angular.module('starter')
.service('NymphBeepService',['ToastService',function(ToastService)
{
    var nymph = require('nymph');
    var media = nymph.sys.media;

    function beepNormal()
    {
        try
        {
            media.beep(media.BeepMode.NORMAL);
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to beep: ' + JSON.stringify(err),'error');
        }
    }

    function beepFail()
    {
        try
        {
            media.beep(media.BeepMode.FAIL);
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to beep: ' + JSON.stringify(err),'error');
        }
    }

    function beepInterval()
    {
        try
        {
            media.beep(media.BeepMode.INTERVAL);
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to beep: ' + JSON.stringify(err),'error');
        }
    }

    function beepTime()
    {
        try
        {
            media.beep(2000);
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to beep: ' + JSON.stringify(err),'error');
        }
    }


    return {
        beepTime: beepTime,
        beepInterval: beepInterval,
        beepFail: beepFail,
        beepNormal: beepNormal,
    };
}])