/**
 * Created by lilin01 on 2015/11/3.
 */
/* jshint -W117 */
argo.initiatorService = (function () {
    'use strict';
    var nymph = require('nymph');

    function showTime() {
        var obj = argo.id('time'),
            date = new Date(),
            hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
            minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

        obj.innerHTML = hours + ':' + minutes;
    }

    function showNav() {
        var nav = argo.id('nav'),
            container = argo.id('content');
        if (argo.hasClass(nav, 'show')) {
            argo.delClass(nav, 'show');
            argo.delClass(container, 'show');
            //argo.delEvent(document,'touchmove', argo.clearTouch);
        } else {
            argo.addClass(nav, 'show');
            argo.addClass(container, 'show');
            //argo.addEvent(document, 'touchmove', argo.clearTouch);

        }
    }


    function route() {
        argo.router = argo.Router();
        argo.router.configure({
            'pay': {
                url: '/pay',
                template: 'components/pay/pay.html',
                controller: argo.payController
            }
        });
        argo.router.go('pay');
    }

    function init() {
        //var navBtn = argo.id('btn-nav');
        //argo.addEvent(navBtn, 'click', showNav);
        nymph.sys.deviceStatus.init();
        nymph.app.start({businessId: '00000001'}, function (err, result)
        {
            if (err)
            {
                argo.addLog('App sign-in failed:' + JSON.stringify(err));
            }
            else
            {
                argo.emvService.initEmv();
            }
        });
    }

    function execute(db, query, binding)
    {
            db.transaction(function (tx)
            {
                  tx.executeSql(query, binding, function (tx, result)
                  {
                      console.log(result);
                  },
                  function (transaction, error)
                  {
                      console.log(error);
                  });
            });
    }

    return {
        time: showTime,
        init: init,
        route: route,
        execute:execute
    };

})();
