/**
 * Created by lilin01 on 2015/11/17.
 */
(function () {
    'use strict';
    /* jshint -W117 */
    argo.Popover = function (options) {
        if (!(this instanceof argo.Popover)) {
            return new argo.Popover(options);
        }
        this.docWidth = document.documentElement.clientWidth;
        this.docHeight = document.documentElement.clientHeight;
        this.bodyHeight = document.body.clientHeight;
        this.elem = options.elem || {};
        this.title = options.title || 'tip';
        this.content = options.content || '';
        this.callback = options.callback || null;
        this.button = options.button || null;
        this.btnClose = argo.id('dialog-close') || null;
        this.configure();
        this.pop();

    };
    argo.Popover.prototype.configure = function () {
        argo.id('title').innerHTML = this.title;
        argo.id('dialog-body').innerHTML = this.content;
        argo.id('button-bar').innerHTML = '';
        if (this.btnClose) {
            argo.addEvent(this.btnClose, 'click', this.close, this);
        }
        if (this.button) {
            for (var key in this.button) {
                var btn = document.createElement('button'),
                    style = key === 'cancel' ? 'button btn-cancel' : 'button btn-submit';
                btn.type = 'button';
                btn.className = style;
                btn.innerHTML = key;
                btn.id = 'popBtn-' + key;
                argo.addEvent(btn, 'click', this.button[key]);
                argo.id('button-bar').appendChild(btn);
            }
        }
    };
    argo.Popover.prototype.pop = function () {
        argo.addEvent(window, 'touchmove', argo.clearTouch);
        this.elem.style.display = 'block';
        var top = (this.docHeight - this.elem.offsetHeight) / 2 + document.body.scrollTop;
        var left = (this.docWidth - this.elem.offsetWidth ) / 2;
        this.elem.style.top = top + 'px';
        this.elem.style.left = left + 'px';
        if (argo.bg) {
            this.bg = argo.bg;
        } else {
            this.bg = document.createElement('div');
            this.bg.id = 'wBg';
            argo.addClass(this.bg, 'bg');
            document.body.appendChild(this.bg);
            argo.bg = this.bg;
        }
        this.bg.style.height = this.bodyHeight + 'px';
        this.bg.style.display = 'block';
    };
    argo.Popover.prototype.close = function () {
        if (arguments.length > 1) {
            var _this = arguments[1];
            if (_this.elem) {
                _this.elem.style.display = 'none';
            }
            _this.bg.style.display = 'none';
        } else {
            this.elem.style.display = 'none';
            this.bg.style.display = 'none';
        }
        argo.delEvent(window, 'touchmove', argo.clearTouch);
    };
})();
