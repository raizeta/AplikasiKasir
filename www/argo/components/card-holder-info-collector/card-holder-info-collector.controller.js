/**
 * Created by lilin01 on 2015/11/24.
 */
(function () {
    'use strict';
    /* jshint -W117 */
    argo.cardHolderInfoCollectorController = function () {
        var ev = 'click',
            btnCancel = argo.id('cancel'),
            btnConfirm = argo.id('confirm');
        argo.emvService.initEmv();
        argo.emvService.startEmv();
        argo.addEvent(btnCancel, ev, argo.cardHolderInfoCollectorService.cancel);
        argo.addEvent(btnConfirm, ev, argo.cardHolderInfoCollectorService.confirm);
    };
})();