/**
 * Created by lilin01 on 2015/11/17.
 */
/* jshint -W117 */
(function ()
{
    'use strict';
    argo.Router = function () {

        if (!(this instanceof argo.Router)) {
            return new argo.Router();
        }
        this.routemap = [];
        this.init();
    };
    argo.Router.prototype.start = function () {
        var hash = decodeURI(window.location.hash).substr(1),
            reg,
            route;
        for (var routeIndex in this.routemap) {
            route = this.routemap[routeIndex];
            reg = new RegExp(route.url, 'i');
            if (hash.match(reg)) {
                this.display(routeIndex);
            }
        }
    };
    argo.Router.prototype.configure = function (routes) {
        for (var route in routes) {
            this.routemap[route] = {
                url: routes[route].url,
                template: routes[route].template,
                controller: routes[route].controller
            };
        }
        console.nativeLog(this);
        return this;
    };
    argo.Router.prototype.display = function (routeIndex) {
        var route = this.routemap[routeIndex];
        if (route.template) {
            argo.ajax({
                url: route.template,
                type: 'GET',
                dataType: 'html',
                success: function (res) {
                    var view = argo.id('view'),
                        content = argo.id('content'),
                        nav = argo.id('nav');
                    view.innerHTML = res;
                    if (argo.hasClass(nav, 'show') && argo.hasClass(content, 'show')) {
                        argo.delClass(nav, 'show');
                        argo.delClass(content, 'show');
                    }
                    if (route.controller && typeof route.controller === 'function') {
                        route.controller();
                    } else {
                        console.log('No controller method');
                    }
                },
                error: function (err) {
                    console.nativeLog(err);
                }
            });
        } else {
            if (route.controller && typeof route.controller === 'function') {
                route.controller();
            }
        }
    };
    argo.Router.prototype.go = function (routeIndex, options) {
        var hash = this.routemap[routeIndex].url;
        this.options = options || null;
        window.location.hash = hash;
    };
    argo.Router.prototype.init = function () {
        var _this = this;
        argo.addEvent(window, 'hashchange', function () {
            _this.start();
        });
        this.start();
    };
})();


