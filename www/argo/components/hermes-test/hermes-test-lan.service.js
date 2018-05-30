/* jshint -W117 */
argo.hermesTestLan = (function () {
    'use strict';

    var nymph = require('nymph'), lanManager,
        connectivityManager = nymph.comm.connectivityManager,
        NetworkType = connectivityManager.NetworkType;

    lanManager = connectivityManager.getNetworkManager(NetworkType.LAN);

    function open() {
        connectivityManager.open(NetworkType.LAN, function (err) {
            if (err) {
                argo.addLog('Failed to open lan.');
            } else {
                argo.addLog('lan opened.');
            }
        });
    }

    function configLanTest() {

        var lanParam = {
            localIp: '172.22.10.54',
            gateway: '172.22.10.1',
            mask: '255.255.255.0',
            dns1: '10.10.16.66',
            dns2: '10.10.16.17',
            isDhcp: false
        };
        //var param = {
        //    lan: lanParam
        //};
        var popverContent = '<input id="staticIp" placeholder="static ip" style="width: 100%; height: 38px" align="middle"/>' +
            '<input id="gateway" placeholder="gateway" style="width: 100%; height: 38px" align="middle"/>' +
            '<input id="netmask" placeholder="netmask" style="width: 100%; height: 38px" align="middle"/>' +
            '<input id="dns1" placeholder="dns1" style="width: 100%; height: 38px" align="middle"/>' +
            '<input id="dns2" placeholder="dns2" style="width: 100%; height: 38px" align="middle"/>';
        var popover = argo.Popover({
            elem: argo.id('dialog'),
            title: 'LAN Config',
            content: popverContent,
            button: {
                'dhcp': function () {
                    lanParam.isDhcp = true;
                    lanManager.config(lanParam, function (err) {
                        if (err) {
                            argo.addLog('Failed to test of the lan config.')
                        } else {
                            argo.addLog('the lan config complete.')
                        }
                    });
                    popover.close();
                },
                'static' : function () {
                    lanParam.localIp = argo.id('staticIp').value;
                    lanParam.gateway = argo.id('gateway').value;
                    lanParam.mask = argo.id('netmask').value;
                    lanParam.dns1 = argo.id('dns1').value;
                    lanParam.dns2 = argo.id('dns2').value;
                    //connectivityManager.config(NetworkType.LAN, param, function (err) {
                    lanManager.config(lanParam, function (err) {
                        if (err) {
                            argo.addLog('Failed to test of the lan config.')
                        } else {
                            argo.addLog('the lan config complete.')
                        }
                    });
                    popover.close();
                },
                'cancel' : function () {
                    popover.close();
                }
            }
        });

    }

    function getLanInfo() {
        try {
            this.lanInfo = lanManager.getInfo();
        } catch (err) {
            argo.addLog('Failed to get info: ' + err.message);
            return;
        }
        if (this.lanInfo) {
            var popverContent = '<table style="font-size: 12px"><tr><td style="font-weight: bold">IP: </td><td>' + this.lanInfo.localIp + '</td></tr>'+
                '<tr><td style="font-weight: bold">MAC: </td><td colspan="3">' + this.lanInfo.mac + '</td></tr>'+
                '<tr><td style="font-weight: bold">Gateway: </td><td colspan="3">' + this.lanInfo.gateway + '</td></tr>'+
                '<tr><td style="font-weight: bold">Netmask: </td><td colspan="3">' + this.lanInfo.mask + '</td></tr>'+
                '<tr><td style="font-weight: bold">DNS1: </td><td colspan="3">' + this.lanInfo.dns1 + '</td></tr>' +
                '<tr><td style="font-weight: bold">DNS2: </td><td colspan="3">' + this.lanInfo.dns2 + '</td></tr></table>';
            var popover = argo.Popover({
                elem: argo.id('dialog'),
                title: 'LAN info',
                content: popverContent,
                button: {
                    'close' : function () {
                        popover.close();
                    }
                }
            });
        } else {
            argo.addLog('LAN not connected.')
        }
    }

    function close() {
        connectivityManager.close(NetworkType.LAN, function (err) {
            if (err) {
                argo.addLog('Failed to close lan.')
            } else {
                argo.addLog('lan closed.')
            }
        });
    }

    return {
        open: open,
        close: close,
        configLanTest:configLanTest,
        getLanInfo:getLanInfo
    };
})();
