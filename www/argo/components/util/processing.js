/**
 * Created by lilin01 on 2015/11/23.
 */
(function () {
    'use strict';
    /* jshint -W117 */
    if (!argo.router) {
        argo.router = new argo.Router();
    }
    argo.router.configure({
        'processing': {
            url: '/processing',
            template: 'components/util/processing.html',
        }
    });

})();