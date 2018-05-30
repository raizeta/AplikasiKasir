/**
 * Created by lilin01 on 2015/11/23.
 */
(function () {
    'use strict';
    /* jshint -W117 */
    if (!argo.router) {
        argo.router = new argo.Router();
    }
    console.nativeLog('Config pay');
    argo.router.configure({});
    argo.router.configure({
        'pay': {
            url: '/pay',
            template: 'components/pay/pay.html',
            controller: argo.payController
        },
        'paySuccess': {
            url: '/paySuccess',
            template: 'components/pay/success.html',
            controller: argo.paySuccessController
        }
    });

})();