(function () {
    'use strict';
    /* jshint -W117 */
    argo.router.configure({
        'wifi': {
            url: '/wifi',
            template: 'components/hermes-test/wifi/wifi.html',
            controller: argo.wifiController
        }
    });
})();