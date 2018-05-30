/**
 * Created by lilin01 on 2015/11/19.
 */
/* jshint -W117 */
argo.payController = function () {
    'use strict';
    var warp = argo.id('content'),
        //ev = 'ontouchstart' in window ? 'touchend' : 'click';
        ev = 'click',
        btnSumbimt = argo.id('submitForm');
    argo.delEvent(btnSumbimt, ev, argo.payService.postForm);
    argo.addEvent(btnSumbimt, ev, argo.payService.postForm);


};