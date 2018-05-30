angular.module('starter')
.service('NymphWifiService',['ToastService',function(ToastService)
{
    var nymph = require('nymph'), wifiList;
    var connectivityManager = nymph.comm.connectivityManager;
    var NetworkType = connectivityManager.NetworkType;
    var wifiManager = connectivityManager.getNetworkManager(NetworkType.WIFI);

    function openWifi()
    {
        connectivityManager.open(NetworkType.WIFI, function (err)
        {
            if (err)
            {
                ToastService.ShowToast('Failed to open wifi.','error');

            }
            else
            {
                ToastService.ShowToast('wifi opened.','success')
            }
        })
    }

    function closeWifi()
    {
        connectivityManager.close(NetworkType.WIFI, function (err)
        {
            if (err)
            {
                ToastService.ShowToast('Failed to close wifi.','error')
            }
            else
            {
                ToastService.ShowToast('wifi closed.','success')
            }
        })
        }

    function getWifiList()
    {
        wifiManager.getWifiList(function (err, result)
        {
            if (err)
            {
                ToastService.ShowToast('Failed to get WIFI list.','error')
            }
            else
            {
                wifiList = result;
                argo.router.go('wifi', wifiList);
            }
        });
    }

    function connectWifi(bssid)
    {
        // ToastService.ShowToast(bssid,'success');
        var wifiToConnect = null;

        if (wifiList)
        {
            wifiList.forEach(function (wifi)
            {
                if (wifi.bssid === bssid)
                {
                    wifiToConnect = wifi;
                    ToastService.ShowToast('wifi to connect: ' + JSON.stringify(wifiToConnect),'success');
                }
            });

            if (wifiToConnect !== null)
            {
                var popverContent;
                if (wifiToConnect.encryption === wifiManager.WifiEncryption.OPEN)
                {
                    popverContent = '<b style="display:block;text-align: center">No password</b>';
                }
                else
                {
                    popverContent = '<input type="password" name="" id="wifiPassword" placeholder="password" style="width: 100%; height: 42px" align="middle"/>';
                }
                var title = wifiToConnect.ssid;
                if (wifiToConnect.isConfigured)
                {
                    title = title + '(configured)';
                }
                var popover = argo.Popover({
                    elem: argo.id('dialog'),
                    title: title,
                    content: popverContent,
                    button: {
                        'connect': function () {
                            var connectOptions = {ssid: wifiToConnect.ssid, encryption: wifiToConnect.encryption};
                            if (wifiToConnect.encryption !== wifiManager.WifiEncryption.OPEN) {
                                if (argo.id('wifiPassword').value) {
                                    connectOptions.password = argo.id('wifiPassword').value;
                                }
                            }
                            wifiManager.connect(connectOptions, function (err) {
                                if (err) {
                                    argo.id(btnConnectId).removeAttribute('disabled');
                                    ToastService.ShowToast('Failed to connect ' + wifiToConnect.ssid,'error');
                                } else {
                                    ToastService.ShowToast(wifiToConnect.ssid + ' connected.','success');
                                    argo.id(btnDisconnecteId).removeAttribute('disabled');
                                }
                            });
                            argo.id(btnConnectId).disabled = 'disabled';
                        },
                        'disconnect': function () {
                            wifiManager.disconnect(function (err) {
                                if (err) {
                                    ToastService.ShowToast('Failed to disconnect.','error');
                                } else {
                                    ToastService.ShowToast('WIFI disconnected.','success');
                                    argo.id(btnDisconnecteId).disabled = 'disabled';
                                    argo.id(btnConnectId).removeAttribute('disabled');
                                }
                            });
                        },
                        'cancel': function () {
                            popover.close();
                        }
                    }
                });
                this.wifiInfo = wifiManager.getInfo();
                var btnConnectId = 'popBtn-connect', btnDisconnecteId = 'popBtn-disconnect';
                if (this.wifiInfo && this.wifiInfo.bssid === wifiToConnect.bssid) {
                    // this wifi already connected
                    argo.id(btnConnectId).disabled = 'disabled';
                    argo.id(btnDisconnecteId).removeAttribute('disabled');
                } else {
                    argo.id(btnDisconnecteId).disabled = 'disabled';
                    argo.id(btnConnectId).removeAttribute('disabled');
                }
            }
        }
    }

    function getWifiInfo()
    {
        try
        {
            this.wifiInfo = wifiManager.getInfo();
        }
        catch (err)
        {
            ToastService.ShowToast('Failed to get info: ' + err.message,'error');
            return;
        }
        if (this.wifiInfo)
        {
            var popverContent = '<table style="font-size: 12px"><tr><td style="font-weight: bold">IP Assignment: </td><td>' + this.wifiInfo.ipAssignment + '</td><td style="font-weight: bold">Encryption: </td><td>' + this.wifiInfo.encryption + '</td></tr>' +
                '<tr><td style="font-weight: bold">SSID: </td><td colspan="3">' + this.wifiInfo.ssid + '</td></tr>' +
                '<tr><td style="font-weight: bold">BSSID: </td><td colspan="3">' + this.wifiInfo.bssid + '</td></tr>' +
                '<tr><td style="font-weight: bold">MAC: </td><td colspan="3">' + this.wifiInfo.mac + '</td></tr>' +
                '<tr><td style="font-weight: bold" width="35%">RSSI: </td><td width="15%">' + this.wifiInfo.rssi + '</td><td width="35%" style="font-weight: bold">Speed: </td><td width="15%">' + this.wifiInfo.speed + 'Mbps</td></tr>' +
                '<tr><td style="font-weight: bold">IP: </td><td isHiddencolspan="3">' + this.wifiInfo.ip + '</td></tr>' +
                '<tr><td style="font-weight: bold">Gateway: </td><td colspan="3">' + this.wifiInfo.gateway + '</td></tr>' +
                '<tr><td style="font-weight: bold">Netmask: </td><td colspan="3">' + this.wifiInfo.netmask + '</td></tr>' +
                '<tr><td style="font-weight: bold">DNS1: </td><td colspan="3">' + this.wifiInfo.dns1 + '</td></tr>' +
                '<tr><td style="font-weight: bold">DNS2: </td><td colspan="3">' + this.wifiInfo.dns2 + '</td></tr></table>';
            var popover = argo.Popover({
                elem: argo.id('dialog'),
                title: 'WIFI info',
                content: popverContent,
                button: {
                    'close': function () {
                        popover.close();
                    }
                }
            });
        }
        else
        {
            ToastService.ShowToast('WIFI not connected.','success')
        }
    }

    function configWifi() {
        try {
            this.wifiInfo = wifiManager.getInfo();
        } catch (err) {
            ToastService.ShowToast('Failed to get info: ' + err.message,'error');
            return;
        }
        if (this.wifiInfo) {
            var popverContent = '<input id="staticIp" placeholder="static ip" style="width: 100%; height: 38px" align="middle"/>' +
                '<input id="gateway" placeholder="gateway" style="width: 100%; height: 38px" align="middle"/>' +
                '<input id="netmask" placeholder="netmask" style="width: 100%; height: 38px" align="middle"/>' +
                '<input id="dns1" placeholder="dns1" style="width: 100%; height: 38px" align="middle"/>' +
                '<input id="dns2" placeholder="dns2" style="width: 100%; height: 38px" align="middle"/>';
            var popover = argo.Popover({
                elem: argo.id('dialog'),
                title: this.wifiInfo.ssid,
                content: popverContent,
                button: {
                    'dhcp': function () {
                        wifiManager.config({dhcp: true}, function (err) {
                            if (err) {
                                ToastService.ShowToast('Failed to set dhcp: ' + JSON.stringify(err),'error');
                            } else {
                                ToastService.ShowToast('DCHP is set.','success')
                            }
                        });
                    },
                    'static': function () {
                        var ip = argo.id('staticIp').value,
                            gateway = argo.id('gateway').value,
                            netmask = argo.id('netmask').value,
                            dns1 = argo.id('dns1').value,
                            dns2 = argo.id('dns2').value;
                        wifiManager.config({
                            staticIpConfiguration: {
                                ip: ip,
                                gateway: gateway,
                                netmask: netmask,
                                dns1: dns1,
                                dns2: dns2
                            }
                        }, function (err) {
                            if (err) {
                                ToastService.ShowToast('Failed to set static ip: ' + JSON.stringify(err),'error');
                            } else {
                                ToastService.ShowToast('Static ip is set.','success')
                            }
                        });
                    },
                    'cancel': function () {
                        popover.close();
                    }
                }
            });
        } else {
            ToastService.ShowToast('WIFI not connected.','success')
        }
    }

    function getConfigList()
    {
        var list = wifiManager.getConfigList();
        for(var i= 0,l=list.length; i<l;i++)
        {
            ToastService.ShowToast('ssid:'+list[i].ssid+',networkId:'+list[i].networkId,'success')
        }
    }

    function isConfigExist()
    {
        var config = wifiManager.isConfigExist('LDRDTEST');
        ToastService.ShowToast('ssid:'+config.ssid+',networkId:'+config.networkId,'success')
    }

        return {
            openWifi: openWifi,
            closeWifi: closeWifi,
            getWifiList: getWifiList,
            connectWifi: connectWifi,
            getWifiInfo: getWifiInfo,
            configWifi: configWifi,
            wifiList: wifiList,
            getConfigList: getConfigList,
            isConfigExist: isConfigExist
        };
}])