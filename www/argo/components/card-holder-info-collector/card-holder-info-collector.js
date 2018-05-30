/**
 * Created by lilin01 on 2015/11/24.
 */
(function () {
    'use strict';
    /* jshint -W117 */
    if (!argo.router) {
        argo.router = new argo.Router();
    }
    argo.router.configure({
        'card-holder-info-collector': {
            url: '/card-holder-info-collector',
            template: 'components/card-holder-info-collector/card-holder-info-collector.html',
            controller: argo.cardHolderInfoCollectorController
        }
    });
})();