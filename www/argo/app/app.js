/**
 * Created by lilin01 on 2015/10/23.
 */
'use strict';
var argo = {
    id: function (id) {
        return typeof (id) === 'string' ? document.getElementById(id) : id;
    },
    target: function (prt, tgName) {
        var wrp = typeof (prt) === 'string' ? argo.id(prt) : prt,
            childs = [],
            tgs = wrp.getElementsByTagName(tgName);
        for (var i = 0; i < tgs.length; i++) {
            if (tgs[i].parentNode === prt) {
                childs.push(tgs[i]);
            }
        }
        return childs;
    },
    next: function (obj) {
        return obj.nextSibling.nodeType === 1 ? obj.nextSibling : argo.next(obj.nextSibling);
    },
    addEvent: function (obj, type, fn, arg) {
        var ehd = !arg ? fn : function (e) {
                fn(e, arg);
            },
            elem = typeof obj === 'string' ? argo.id(obj) : obj;
        elem.addEventListener(type, ehd, false);
    },
    delEvent: function (obj, type, fn) {
        obj.removeEventListener(type, fn, false);
    },
    delAttr: function (obj, attr) {
        var oAttr;
        if (obj.getAttribute(attr)) {
            obj.removeAttribute(attr);
        } else if (obj.attributes[attr]) {
            obj.removeAttributeNode(obj.attributes[attr]);
        }
    },
    hasClass: function (obj, cn) {

        var reg = new RegExp('(\\s|^)' + cn + '(\\s|$)');
        return obj.className.match(reg);
    },
    delClass: function (obj, cn) {
        if (obj) {
            var cls = obj.getAttribute('class') || obj.getAttribute('className');
            if (cls) {
                if (new RegExp('^\\s*' + cn + '\\s*$').test(cls)) {
                    argo.delAttr(obj, 'className');
                    argo.delAttr(obj, 'class');
                } else {
                    obj.className = cls.replace(new RegExp('( ?|^)' + cn + '\\b'), '');
                }
            }
        }
    },
    addClass: function (obj, cn) {
        if (obj) {
            var cls = obj.getAttribute('class') || obj.getAttribute('className');
            if (cls !== null) {
                cn = cls.indexOf(cn) === -1 ? cls + ' ' + cn : cls;
            }
            obj.className = cn;
        }
    },
    ajax: function (options) {
        var xhr = new XMLHttpRequest(),
            //basePath = window.location.hostname+'/',
            url = options.url + '?t=' + Math.random(),
            type = options.type || 'POST',
            async = options.async || true,
            data = options.data || null,
            dataType = options.dataType,
            beforeSend = options.beforeSend,
            success = options.success,
            complete = options.complete,
            error = options.error,
            result = null;
        console.nativeLog('ajax url==========' + url);
        xhr.onreadystatechange = function () {
            switch (xhr.readyState) {
                case 0 :
                    console.nativeLog('Request not initialized.');
                    if (beforeSend) {
                        beforeSend();
                    }
                    break;
                case 1 :
                    console.nativeLog('Server connected.');
                    break;
                case 2 :
                    console.nativeLog(' Request received.');
                    break;
                case 3 :
                    console.nativeLog('Request is processing...');
                    break;
                case 4 :
                    console.nativeLog('Request completed, ready to response.' + xhr.status);
                    if (xhr.status === 200 || 0 === xhr.status) {
                        var respond = null;
                        if (dataType === 'xml') {
                            respond = xhr.responseXML;
                        } else if (dataType === 'json' || dataType === 'script') {
                            /* jshint -W061 */
                            respond = eval('(' + xhr.responseText + ')');
                        } else {
                            respond = xhr.responseText;
                        }
                        if (success) {
                            success(respond);
                            if (complete) {
                                complete();
                            }
                        }
                    } else {
                        if (error) {
                            error(xhr.status, xhr.statusText);
                        }
                    }
                    break;
            }
        };
        xhr.open(type, url, async);
        if (type === 'POST') {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        xhr.send(data);
    },
    addLog: function (str, callback) {
        var content = document.createElement('span');
        argo.logFunc = callback;
        if (argo.id('log')) {
            argo.log = argo.id('log');
        } else {
            var cls = document.createElement('a');
            cls.id = 'pop-close';
            /*jshint scripturl:true*/
            cls.href = 'javascript:;';
            cls.className = 'icon-cancel cls';
            argo.log = document.createElement('div');
            argo.log.id = 'log';
            argo.addClass(argo.log, 'tip');
            argo.log.appendChild(cls);
            argo.log.appendChild(content);
            document.body.appendChild(argo.log);
            argo.hideLog();
        }
        argo.target(argo.log, 'span')[0].innerHTML = str;
        console.log(str);
        if (argo.id('log-list')) {
            var oLi = document.createElement('li');
            oLi.innerHTML = str;
            argo.id('log-list').appendChild(oLi);
            //argo.id('log-list').push(oDiv);
        }

        if (argo.bg) {
            argo.bg.style.display = 'block';
        } else {
            argo.bg = document.createElement('div');
            argo.bg.id = 'wBg';
            argo.addClass(this.bg, 'bg');
            argo.bg.style.display = 'block';
            document.body.appendChild(argo.bg);
        }
        argo.bg.style.height = (window.innerHeight + document.body.scrollTop) + 'px';
        argo.log.style.display = 'block';
        argo.addEvent(window, 'touchmove', argo.clearTouch);
        if (argo.tm) {
            clearTimeout(argo.tm);
        }
        argo.tm = setTimeout(function () {
            argo.log.style.display = 'none';
            argo.bg.style.display = 'none';
            argo.delEvent(window, 'touchmove', argo.clearTouch);
            if (callback) {
                callback();
            }
        }, 5000);
    },
    hideLog: function () {
        argo.addEvent(argo.log, 'click', function (e) {
            if (e.target && e.target.nodeName.toLocaleLowerCase() === 'a') {
                if (argo.tm) {
                    clearTimeout(argo.tm);
                }
                argo.log.style.display = 'none';
                argo.bg.style.display = 'none';
                argo.delEvent(window, 'touchmove', argo.clearTouch);
            }
            if (argo.logFunc) {
                argo.logFunc();
            }
        });
    },
    clearTouch: function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else if (e.stopPropagation) {
            e.stopPropagation();
        }
        return false;
    },
    os: function () {
        var u = window.navigator.userAgent;
        if (u.indexOf('Windows') > -1) {
            return 'windows';
        } else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
            return 'android';
        } else if (u.indexOf('BB10') > -1) {
            return 'BB10';
        } else if (u.indexOf('IEMobile') > -1) {
            //windows phone
            return 'windows phone';
        }
    },
    hideItem: function (obj) {
        // Need to add this to the element first: style="display:none". For example:
        // <a href="javascript:;" id="back" style="display:none">back</a>
        obj.style.visibility = "hidden";
    },
    showItem: function (obj) {
        // Need to add this to the element first: style="display:none". For example:
        // <a href="javascript:;" id="back" style="display:none">back</a>
        obj.style.visibility = "visible";
    }
};
