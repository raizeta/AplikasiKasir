(function () {
    'use strict';
    /* jshint -W117 */
    argo.wifiController = function () {
        var wifiListStr = '';
        var warp = argo.id('content'),
            //ev = 'ontouchstart' in window ? 'touchstart' : 'click';
            ev = 'click';
        argo.delEvent(warp, ev, bingEvent);
        argo.addEvent(warp, ev, bingEvent);

        function bingEvent(e) {
            var elem = e.target;
            if (elem && elem.nodeName.toLowerCase() === 'a') {
                if (elem.id.indexOf("wifi_") >= 0) {
                    var bssid = elem.id.substring(5, elem.id.length);
                    argo.hermesTestWifi.connectWifi(bssid);
                }
            }
        }
        argo.router.options.forEach(function (wifi) {
            var wifiList = argo.id('wifiList'), id = 'wifi_' + wifi.bssid;
            var li = '<li><a href="javascript:;" id="' +id + '">' + wifi.ssid + '</a></li>';
            wifiListStr += li;
            wifiList.innerHTML = '<ul id="wifiList" class="list">' + wifiListStr + '</ul>';
            // console.nativeLog('wifi list innerHTML: ' + wifiList.innerHTML);
            window.scroll(0,0);
        });
    };
})();
