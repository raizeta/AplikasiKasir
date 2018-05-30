/* jshint -W117 */
argo.hermesTestWifi = (function () {
    'use strict';

    var nymph = require('nymph'), wifiManager, wifiList,
        connectivityManager = nymph.comm.connectivityManager,
        NetworkType = connectivityManager.NetworkType;

    wifiManager = connectivityManager.getNetworkManager(NetworkType.WIFI);

    function open() {
        connectivityManager.open(NetworkType.WIFI, function (err) {
            if (err) {
                argo.addLog('Failed to open wifi.')
            } else {
                argo.addLog('wifi opened.')
            }
        })
    }

    function close() {
        connectivityManager.close(NetworkType.WIFI, function (err) {
            if (err) {
                argo.addLog('Failed to close wifi.')
            } else {
                argo.addLog('wifi closed.')
            }
        })
    }

    function getWifiList() {
        wifiManager.getWifiList(function (err, result) {
            if (err) {
                argo.addLog('Failed to get WIFI list.')
            } else {
                wifiList = result;
                argo.router.go('wifi', wifiList);
                // var wifiListString = '';
                // result.forEach(function (item) {
                //     wifiListString = wifiListString + '[' + JSON.stringify(item) + '] ';
                // });
            }
        });
    }

    function connectWifi(bssid) {
        // argo.addLog(bssid);
        var wifiToConnect = null;

        if (wifiList) {
            wifiList.forEach(function (wifi) {
                if (wifi.bssid === bssid) {
                    wifiToConnect = wifi;
                    argo.addLog('wifi to connect: ' + JSON.stringify(wifiToConnect));
                }
            });

            if (wifiToConnect !== null) {
                var popverContent;
                if (wifiToConnect.encryption === wifiManager.WifiEncryption.OPEN) {
                    popverContent = '<b style="display:block;text-align: center">No password</b>';
                } else {
                    popverContent = '<input type="password" name="" id="wifiPassword" placeholder="password" style="width: 100%; height: 42px" align="middle"/>';
                }
                var title = wifiToConnect.ssid;
                if (wifiToConnect.isConfigured) {
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
                                    argo.addLog('Failed to connect ' + wifiToConnect.ssid);
                                } else {
                                    argo.addLog(wifiToConnect.ssid + ' connected.');
                                    argo.id(btnDisconnecteId).removeAttribute('disabled');
                                }
                            });
                            argo.id(btnConnectId).disabled = 'disabled';
                        },
                        'disconnect': function () {
                            wifiManager.disconnect(function (err) {
                                if (err) {
                                    argo.addLog('Failed to disconnect.');
                                } else {
                                    argo.addLog('WIFI disconnected.');
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

    function getWifiInfo() {
        try {
            this.wifiInfo = wifiManager.getInfo();
        } catch (err) {
            argo.addLog('Failed to get info: ' + err.message);
            return;
        }
        if (this.wifiInfo) {
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
        } else {
            argo.addLog('WIFI not connected.')
        }
    }

    function configWifi() {
        try {
            this.wifiInfo = wifiManager.getInfo();
        } catch (err) {
            argo.addLog('Failed to get info: ' + err.message);
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
                                argo.addLog('Failed to set dhcp: ' + JSON.stringify(err));
                            } else {
                                argo.addLog('DCHP is set.')
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
                                argo.addLog('Failed to set static ip: ' + JSON.stringify(err));
                            } else {
                                argo.addLog('Static ip is set.')
                            }
                        });
                    },
                    'cancel': function () {
                        popover.close();
                    }
                }
            });
        } else {
            argo.addLog('WIFI not connected.')
        }
    }

    function getConfigList(){
        var list = wifiManager.getConfigList();
        for(var i= 0,l=list.length; i<l;i++){
            argo.addLog('ssid:'+list[i].ssid+',networkId:'+list[i].networkId)
        }
    }

    function isConfigExist(){
        var config = wifiManager.isConfigExist('LDRDTEST');
        argo.addLog('ssid:'+config.ssid+',networkId:'+config.networkId)
    }

    return {
        open: open,
        close: close,
        getWifiList: getWifiList,
        connectWifi: connectWifi,
        getWifiInfo: getWifiInfo,
        configWifi: configWifi,
        wifiList: wifiList,
        getConfigList: getConfigList,
        isConfigExist: isConfigExist
    };

    var a = [{
        "ssid": "BBBBBBBBBB",
        "bssid": "b8:86:87:41:55:19",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -31,
        "frequency": 2412,
        "timestamp": 83312336263,
        "channel": 1
    }, {
        "ssid": "ZhengmtWifi",
        "bssid": "4a:51:b7:07:36:22",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -42,
        "frequency": 2462,
        "timestamp": 83312336326,
        "channel": 11
    }, {
        "ssid": "CWN",
        "bssid": "00:0c:e6:02:19:c4",
        "encryption": "EAP",
        "capabilities": ["WPA2-EAP-CCMP", "ESS"],
        "level": -54,
        "frequency": 2412,
        "timestamp": 83312336409,
        "channel": 1
    }, {
        "ssid": "WAN_OF_LANDI",
        "bssid": "06:02:01:1f:07:43",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -54,
        "frequency": 2412,
        "timestamp": 83312336459,
        "channel": 1
    }, {
        "ssid": "LDRDTEST",
        "bssid": "06:01:01:1f:07:43",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -54,
        "frequency": 2412,
        "timestamp": 83312336479,
        "channel": 1
    }, {
        "ssid": "LD_GUEST",
        "bssid": "06:04:01:1f:07:43",
        "encryption": "OPEN",
        "capabilities": ["ESS"],
        "level": -54,
        "frequency": 2412,
        "timestamp": 83312336434,
        "channel": 1
    }, {
        "ssid": "!linzhen's-mac-pro",
        "bssid": "a4:5e:60:b7:b9:03",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -54,
        "frequency": 2462,
        "timestamp": 83312336382,
        "channel": 11
    }, {
        "ssid": "DESKTOP-1VMBUR6 0695",
        "bssid": "c8:ff:28:5c:86:6f",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "WPS", "ESS", "P2P"],
        "level": -56,
        "frequency": 2457,
        "timestamp": 83312336714,
        "channel": 10
    }, {
        "ssid": "Jwifi",
        "bssid": "c8:ff:28:5c:86:75",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -57,
        "frequency": 2457,
        "timestamp": 83312336654,
        "channel": 10
    }, {
        "ssid": "BreakWall_1_2.4G",
        "bssid": "cc:81:da:cf:7f:c0",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -58,
        "frequency": 2457,
        "timestamp": 83312336744,
        "channel": 10
    }, {
        "ssid": "ssdpos",
        "bssid": "08:57:00:69:1a:6a",
        "encryption": "PSK",
        "capabilities": ["WPA-PSK-CCMP+TKIP", "WPA2-PSK-CCMP+TKIP", "ESS"],
        "level": -62,
        "frequency": 2437,
        "timestamp": 83312337001,
        "channel": 6
    }, {
        "ssid": "LieBaoWiFi813",
        "bssid": "4e:34:88:4e:43:b9",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -62,
        "frequency": 2437,
        "timestamp": 83312336979,
        "channel": 6
    }, {
        "ssid": "ÕÅÐ¡ß÷µÄÍá»µ",
        "bssid": "74:df:bf:4b:94:89",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -62,
        "frequency": 2457,
        "timestamp": 83312336892,
        "channel": 10
    }, {
        "ssid": "Axiongxq",
        "bssid": "c8:ff:28:60:98:55",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -65,
        "frequency": 2457,
        "timestamp": 83312336915,
        "channel": 10
    }, {
        "ssid": "HG532e-SSID",
        "bssid": "78:6a:89:6f:ad:0c",
        "encryption": "PSK",
        "capabilities": ["WPA-PSK-CCMP", "WPA2-PSK-CCMP", "ESS"],
        "level": -65,
        "frequency": 2427,
        "timestamp": 83312336938,
        "channel": 4
    }, {
        "ssid": "TP-LINK_SS",
        "bssid": "b0:48:7a:3b:b2:36",
        "encryption": "PSK",
        "capabilities": ["WPA-PSK-CCMP", "WPA2-PSK-CCMP", "WPS", "ESS"],
        "level": -65,
        "frequency": 2442,
        "timestamp": 83312336859,
        "channel": 7
    }, {
        "ssid": "zhengenling",
        "bssid": "74:df:bf:48:88:5f",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -68,
        "frequency": 2457,
        "timestamp": 83312337067,
        "channel": 10
    }, {
        "ssid": "ruansj",
        "bssid": "74:df:bf:3b:3c:53",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -69,
        "frequency": 2457,
        "timestamp": 83312337041,
        "channel": 10
    }, {
        "ssid": "L519_95C6",
        "bssid": "78:52:62:2e:95:c6",
        "encryption": "PSK",
        "capabilities": ["WPA-PSK-CCMP+TKIP", "WPA2-PSK-CCMP+TKIP", "ESS"],
        "level": -72,
        "frequency": 2412,
        "timestamp": 83312337251,
        "channel": 1
    }, {
        "ssid": "AZHUL",
        "bssid": "e6:b3:18:8c:b7:cf",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -72,
        "frequency": 2462,
        "timestamp": 83240220884,
        "channel": 11
    }, {
        "ssid": "360BUY",
        "bssid": "90:94:e4:ca:9d:48",
        "encryption": "PSK",
        "capabilities": ["WPA-PSK-CCMP+TKIP", "WPA2-PSK-CCMP+TKIP", "WPS", "ESS"],
        "level": -73,
        "frequency": 2412,
        "timestamp": 83312337092,
        "channel": 1
    }, {
        "ssid": "landi",
        "bssid": "18:4f:32:09:b6:c3",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -79,
        "frequency": 2442,
        "timestamp": 83280228252,
        "channel": 7
    }, {
        "ssid": "Feixun",
        "bssid": "d8:42:ac:38:ea:09",
        "encryption": "OPEN",
        "capabilities": ["ESS"],
        "level": -80,
        "frequency": 2437,
        "timestamp": 83312337279,
        "channel": 6
    }, {
        "ssid": "12345",
        "bssid": "18:4f:32:09:b5:8d",
        "encryption": "PSK",
        "capabilities": ["WPA2-PSK-CCMP", "ESS"],
        "level": -81,
        "frequency": 2442,
        "timestamp": 83280228343,
        "channel": 7
    }];


})
();
