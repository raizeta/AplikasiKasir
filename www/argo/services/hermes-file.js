{
    "app":[function(require,module,exports){
    'use strict';
    var hermes = require('hermes'),
        DateFormat = require('date-format'),
        nymphError = require('error');

    /**
     * # 应用程序框架（模块名：app）
     * @class nymph.app
     * @singleton
     */
    var app = {
      // 插件ID。
      PLUGINID: '20e1b6eb8c9aadd6e657eda4fafaaada',

      instanceId: hermes.NULL,

      info: {},

      /**
       * @method start
       * 启动系统，做一些初始化。
       *
       *     // 不需要参数的初始化。
       *     var app = require('nymph-app');
       *     app.start(function (err) {
       *       if (err) {
       *         // 初始化失败的处理。
       *         console.warn(err.code + ' ' + err.message);
       *       }
       *     });
       *
       *     // 需要参数的初始化。
       *     // app.start({businessId : '123456'}, function (err) {
       *     //  if (err) {
       *     //    // 初始化失败的处理。
       *     //    console.warn(err.code + ' ' + err.message);
       *     //  }
       *     // });
       *
       * @param {Object} param (Optional) 初始化相关参数（可选）。
       * @param {String} param.businessId 商用 ID 号。
       * @param {Function} callback 处理此方法执行结果的回调函数。
       * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
       * @param {String} callback.err.code 错误码
       * @param {String} callback.err.message 错误消息。
       * @param {Object} callback.result 启动结果。
       * @param {Boolean} callback.result.isEmvInitialized EMV 是否已初始化。
       * @member nymph.app
       */
      start: function (param, callback) {
        var self = this;
        // 调整参数。
        if (typeof param === 'function') {
          callback = param;
          param = {};
        }
        hermes.exec(self.PLUGINID, self.instanceId, 'start', [param], function (err, result) {
          if (err) {
            err.code = self.getError(err.innerCode);
            callback.call(self, err);
          } else {
            callback.call(self, null, result);
          }
        });
      },

      /**
       * @method stop
       * 停止系统。
       *
       * @param {Function} callback 处理此方法执行结果的回调函数。
       * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
       * @member nymph.app
       */
      stop: function (callback) {
        var self = this;
        hermes.exec(self.PLUGINID, self.instanceId, 'stop', function (err) {
          if (err) {
            err.code = self.getError(err.innerCode);
            callback.call(self, err);
          } else {
            callback.call(self, null);
          }
        });
      },

        /**
         * @method getProcessInfo
         * 获取进程信息
         *
         * @return {Object} 进程相关信息。
         * @return {Number} return.totalStorage 总存储空间，单位 byte
         * @return {Number} return.freeStorage 可用存储空间，单位 byte
         * @return {Number} return.appTotalSize 当前应用总大小，单位 byte
         * @return {Number} return.cacheSize 当前应用cache大小，单位 byte
         * @return {Number} return.dataSize 当前应用data大小，单位 byte
         * @return {Number} return.codeSize 当前应用code大小，单位 byte
         * @return {Number} return.totalMemory 总内存，单位 byte
         * @return {Number} return.freeMemory  可用内存，单位 byte
         * @return {Number} return.currentMemory  当前应用占用内存，单位 byte
         * @throws {nymph.error.NymphError} 如果获取终端信息有错误发生，将会抛出异常。
         * @member nymph.app
         */
        getProcessInfo: function () {
            var key, self = this, result, errorCode, info;
            result = hermes.exec(self.PLUGINID, self.instanceId, 'getProcessInfo');
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to get process information.', innerCode: result.innerCode};
            }
            info = result.data;
            return info;
        },

        /**
       * @method getTerminalInfo
       * 获取终端相关信息。
       *
       *     var app = require('nymph-app');
       *     try {
       *       var terminalInfo = app.getTerminalInfo();
       *     } catch (err) {
       *       // 获取信息失败的处理。
       *       console.error(err.code + ' ' + err.message);
       *     }
       *
       * @return {Object} 终端相关信息。
       * @return {String} return.vendor 厂商名称。
       * @return {String} return.model 机具型号。
       * @return {String} return.osVersion 系统版本号。
       * @return {String} return.sn 序列号。
       * @return {String} return.sdkVersion SDK 版本号。
       * @throws {nymph.error.NymphError} 如果获取终端信息有错误发生，将会抛出异常。
       * @member nymph.app
       */
      getTerminalInfo: function () {
        var key, self = this, result, errorCode, info;
        result = hermes.exec(self.PLUGINID, self.instanceId, 'getTerminalInfo');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: 'Failed to get terminal information.', innerCode: result.innerCode};
        }
        info = result.data;
        return info;
      },

      /**
       * @method setDateTime
       * 设置系统当前日期和时间。
       *
       *     var app = require('nymph-app');
       *     try {
       *       var date = new Date("2014-03-12 12:12:12");
       *       app.setDateTime(date);
       *     } catch (err) {
       *       // 设置日期和时间失败的处理。
       *       console.error(err.code + ' ' + err.message);
       *     }
       *
       * @param {String/Date} date 要设置的日期和时间。可传入一个 Date 类型的对象，也可传入格式为 'YYYYMMDDHHMMSS' 的字符串。
       * @throws {nymph.error.NymphError} 如果设置系统当前时间和日期有错误发生，将会抛出异常。
       * @member nymph.app
       */
      setDateTime: function (date) {
        var dateString, result, errorCode, dateFormat;
        if (typeof date === 'string') {
          dateString = date;
        } else {
          try {
            dateFormat = new DateFormat();
            dateString = dateFormat.format(date, dateFormat.DEFAULT_DATETIME_FORMAT2);
          } catch (err) {
            throw {code: nymphError.PARAM_ERR, message: 'The parameter date should be an instance of Date or a string of YYYYMMDDHHMMSS format.'};
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'setDateTime', [dateString]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: 'Failed to set system date time.', innerCode: result.innerCode};
        }
      },

      /**
       * @method showKeyBoard
       * 显示\隐藏系统软键盘。
       * @param {Boolean} isShow 是否显示系统软键盘，true 显示，false 隐藏。
       * @member nymph.app
       */
      showKeyBoard: function (isShow) {
        var result, errorCode;
        result = hermes.exec(this.PLUGINID, this.instanceId, 'showKeyBoard', [isShow]);
        errorCode = this.getError(result.innerCode);
        console.log('设置系统软键盘结果：' + JSON.stringify(result));
        if (errorCode !== nymphError.SUCCESS) {
          var errMsg = 'soft keyboard.';
          throw {code: errorCode, message: isShow ? 'Display' + errMsg : 'Hide' + errMsg, innerCode: result.innerCode};
        }
      },

      /**
       * @ignore
       * @method getVersion
       * 获取系统版本号。
       * @member nymph.app
       */
      getVersion: function () {

      },

        /**
         * @method gotoAndroidAPNUI
         * 跳转到安卓原生的APN设置界面。
         * @member nymph.app
         */
        gotoAndroidAPNUI: function () {
            var self = this, result, errorCode;
            result = hermes.exec(self.PLUGINID, self.instanceId, 'gotoAndroidAPNUI');
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to gotoAndroidAPNUI.', innerCode: result.innerCode};
            }
        },


        /**
         * @method rebootSystem
         * 重启安卓系统。
         * @member nymph.app
         */
        rebootSystem: function () {
            var self = this, result, errorCode;
            result = hermes.exec(self.PLUGINID, self.instanceId, 'rebootSystem');
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to rebootSystem.', innerCode: result.innerCode};
            }
        },

        /**
         * @method Call Transaction Result
         * @param {Object} params
         * @param {String} params.transId
         * @param {String} params.resultCode
         * @param {Object} params.transData
         * @param {Object} params.transData
         * @param {Object} params.transData.resCode
         * @param {Object} params.transData.resDesc
         * @param {Object} params.transData.merchantName
         * @param {Object} params.transData.merchantNo
         * @param {Object} params.transData.terminalNo
         * @param {Object} params.transData.operNo
         * @param {Object} params.transData.amt
         * @param {Object} params.transData.batchNo
         * @param {Object} params.transData.traceNo
         * @param {Object} params.transData.refNo
         * @param {Object} params.transData.authNo
         * @param {Object} params.transData.expDate
         * @param {Object} params.transData.cardNo
         * @param {Object} params.transData.cardIssuerCode
         * @param {Object} params.transData.cardAcquirerCode
         * @param {Object} params.transData.cardInputType
         * @param {Object} params.transData.transChnName
         * @param {Object} params.transData.transEngName
         * @param {Object} params.transData.date
         * @param {Object} params.transData.time
         * @param {Object} params.transData.memInfo
         * @param {Object} params.transData.isReprint
         * @param {Object} params.transData.vendor
         * @param {Object} params.transData.cardOrg
         * @param {Object} params.transData.serviceNo
         * @param {Object} params.transData.model
         * @param {Object} params.transData.version
         * @param {Object} params.transData.qrCode
         * @param {Object} params.transData.eSignJpeg
         * @param {Object} params.transData.ARQC
         * @param {Object} params.transData.UnprNo
         * @param {Object} params.transData.ATC
         * @param {Object} params.transData.TVR
         * @param {Object} params.transData.TSI
         * @param {Object} params.transData.AID
         * @param {Object} params.transData.AIP
         * @param {Object} params.transData.APPLAB
         * @param {Object} params.transData.APPNAME
         * @param {Object} params.transData.CVM
         * @param {Object} params.transData.TermCap
         * @param {Object} params.transData.IAD
         * @param {Object} params.transData.CSN
         * @member nymph.app
         */
        callTransResult: function (params) {
            var self = this, result, errorCode;

            if(!params) {
                throw {code: 139, message: this.getError(139)};
            }

            if (Number(params.resultCode) === 0 && !params.transData) {
                throw {code: 139, message: this.getError(139)};
            }

            result = hermes.exec(self.PLUGINID, self.instanceId, 'callTransResult', [params]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to callTransResult.', innerCode: result.innerCode};
            }
        },

      /**
       * @method exit
       * 退出应用。
       * 注：在退出应用之前，请先调用 {@link nymph.app#stop stop} 停止底层服务。
       * @member nymph.app
       */
      exit: function () {
        var self = this, result, errorCode;
        result = hermes.exec(self.PLUGINID, self.instanceId, 'exit');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: 'Failed to exit app.', innerCode: result.innerCode};
        }
      },

        listDevices: function(callback) {
            var self = this, errorCode;
            console.nativeLog('lins APP:进入listDevices');
    /*        result = hermes.exec(self.PLUGINID, self.instanceId, 'listDevices');
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to listDevices.', innerCode: result.innerCode};
            }
      */
            hermes.exec(self.PLUGINID, this.instanceId, 'listDevices', [], function (err,datas) {
                var data;
                console.nativeLog('lins: datas = ' + JSON.stringify(datas));
                if (err) {
                    err.code = self.getError(err.innerCode);
                    callback.call(self, err);
                } else {

       //             for (var i in datas) {
       //                 console.nativeLog('lins(' + i + '): data = ' + JSON.stringify(datas[i]));
       //             }

                    //     使用slice将类数组的对象转成数组.

                  //  var result2 = Array.prototype.slice.call(datas);
                   // console.nativeLog('lins: result2 = ' + JSON.stringify(result2));


                    for (var i in datas)
                        if (datas[i])
                        {
                            console.nativeLog('lins(' + i + '): data = ' + JSON.stringify(datas[i]) + 'XdevName = ' +
                            datas[i].devName + ' Xstatus = ' + datas[i].status + ' Xdata = ' + datas[i].data);
                        }

                    var result = [];
                    var max;
                    for(var i = 0, max = datas.length; i < max; i++){
                        if (datas[i]){
                            result.push(datas[i]);
                        }
                    }for (var i in datas)
                        if (datas[i])
                        {
                            console.nativeLog('lins(' + i + '): data = ' + JSON.stringify(datas[i]) + 'XdevName = ' + datas[i].devName + ' Xstatus = ' + datas[i].status + ' Xdata = ' + datas[i].data);
                        }

                    var result = [];
                    for(var i=0 ; i<datas.length; i++){
                        if (datas[i]){
                            result.push(datas[i]);
                        }
                    }
                    console.nativeLog('lins: result = ' + JSON.stringify(result));

                    callback.call(self, null);
                }
            })
        },
      getError: function (innerCode) {
        switch (innerCode) {
          default:
            return nymphError.getError(innerCode);
        }
      },

      callTransResultCode: {
        SUCCESS: 0,
        NO_EXIT_TRANS: -1,
        PARAM_ERROR: -2
      },
      callTransResultMsg: {
        SUCCESS: 'Success',
        NO_EXIT_TRANS: 'No Exit Transaction',
        PARAM_ERROR: 'Parameters Error'
      }

    };

    hermes.addJsPluginInstance(app.PLUGINID, app);
    module.exports = app;

    },{"date-format":"date-format","error":"error","hermes":"hermes"}],
    "autotest":[function(require,module,exports){
    'use strict';

    var hermes = require('hermes');
    var nymphError = require('error');

    /**
     * # JS测试框架自动测试（模块名：autotest）
     * @class nymph.autotest.autotest
     * @singleton
     */
    var autotest = {
        /**
         * 插件名称。
         */
        PLUGINID: '4921f9eff026222accd949943b0e0101',


        /**
         * 输入自动输pin数据
         * @param pinData  输入的pindata数据
         *
         *
         * pinInput("111111");
         */
        pinInput: function (pinData) {
            return  hermes.exec(this.PLUGINID, hermes.NULL, 'pinInput', [pinData]);
        },

        /**
         * 输入自动输磁道数据
         * @param trk1，trk2，trk3 输入的磁道数据
         */
        writeMagCardNum: function (trk1,trk2,trk3) {
            return  hermes.exec(this.PLUGINID, hermes.NULL, 'magcardData', [trk1,trk2,trk3]);
        },

        /**
         * 清空磁道数据
         * @param 清空输入的磁道数据
         */
        setMagcardOff: function () {
            return  hermes.exec(this.PLUGINID, hermes.NULL, 'magcardOFF', []);
        },

        /**
         * 写入的日志到文件中
         * @param msg  日志
         *
         */
        writeLog: function (msg) {
            return  hermes.exec(this.PLUGINID, hermes.NULL, 'writeLog', [msg]);
        },

        /**
         * 写入的日志到文件中
         * @param msg  日志
         *
         */
        clearLog: function () {
            return  hermes.exec(this.PLUGINID, hermes.NULL, 'clearLog', []);
        },

        /**
         * 环境初始化
         */
        initEnv: function () {
            hermes.exec(this.PLUGINID, hermes.NULL, 'initEnv', []);
        },

        /**
         * @ignore
         * @param {Number} innerCode 底层上传的返回码
         * @returns {String} 返回码对应的字符串
         */
        getError: function (innerCode) {
            console.nativeLog('getError:' + innerCode);
            return nymphError.getError(innerCode);
        }

    };

    hermes.addJsPluginInstance(autotest.PLUGINID, autotest);

    module.exports = autotest;

    },{"error":"error","hermes":"hermes"}],
    "buffer":[function(require,module,exports){
    (function (global){
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    /* eslint-disable no-proto */

    'use strict'

    var base64 = require('base64-js')
    var ieee754 = require('ieee754')
    var isArray = require('isarray')

    exports.Buffer = Buffer
    exports.SlowBuffer = SlowBuffer
    exports.INSPECT_MAX_BYTES = 50

    /**
     * If `Buffer.TYPED_ARRAY_SUPPORT`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Use Object implementation (most compatible, even IE6)
     *
     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
     * Opera 11.6+, iOS 4.2+.
     *
     * Due to various browser bugs, sometimes the Object implementation will be used even
     * when the browser supports typed arrays.
     *
     * Note:
     *
     *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
     *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
     *
     *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
     *
     *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
     *     incorrect length in some situations.

     * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
     * get the Object implementation, which is slower but behaves correctly.
     */
    Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
      ? global.TYPED_ARRAY_SUPPORT
      : typedArraySupport()

    /*
     * Export kMaxLength after typed array support is determined.
     */
    exports.kMaxLength = kMaxLength()

    function typedArraySupport () {
      try {
        var arr = new Uint8Array(1)
        arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
        return arr.foo() === 42 && // typed array instances can be augmented
            typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
            arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
      } catch (e) {
        return false
      }
    }

    function kMaxLength () {
      return Buffer.TYPED_ARRAY_SUPPORT
        ? 0x7fffffff
        : 0x3fffffff
    }

    function createBuffer (that, length) {
      if (kMaxLength() < length) {
        throw new RangeError('Invalid typed array length')
      }
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = new Uint8Array(length)
        that.__proto__ = Buffer.prototype
      } else {
        // Fallback: Return an object instance of the Buffer class
        if (that === null) {
          that = new Buffer(length)
        }
        that.length = length
      }

      return that
    }

    /**
     * The Buffer constructor returns instances of `Uint8Array` that have their
     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
     * returns a single octet.
     *
     * The `Uint8Array` prototype remains unmodified.
     */

    function Buffer (arg, encodingOrOffset, length) {
      if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
        return new Buffer(arg, encodingOrOffset, length)
      }

      // Common case.
      if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
          throw new Error(
            'If encoding is specified then the first argument must be a string'
          )
        }
        return allocUnsafe(this, arg)
      }
      return from(this, arg, encodingOrOffset, length)
    }

    Buffer.poolSize = 8192 // not used by this implementation

    // TODO: Legacy, not needed anymore. Remove in next major version.
    Buffer._augment = function (arr) {
      arr.__proto__ = Buffer.prototype
      return arr
    }

    function from (that, value, encodingOrOffset, length) {
      if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number')
      }

      if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return fromArrayBuffer(that, value, encodingOrOffset, length)
      }

      if (typeof value === 'string') {
        return fromString(that, value, encodingOrOffset)
      }

      return fromObject(that, value)
    }

    /**
     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
     * if value is a number.
     * Buffer.from(str[, encoding])
     * Buffer.from(array)
     * Buffer.from(buffer)
     * Buffer.from(arrayBuffer[, byteOffset[, length]])
     **/
    Buffer.from = function (value, encodingOrOffset, length) {
      return from(null, value, encodingOrOffset, length)
    }

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      Buffer.prototype.__proto__ = Uint8Array.prototype
      Buffer.__proto__ = Uint8Array
      if (typeof Symbol !== 'undefined' && Symbol.species &&
          Buffer[Symbol.species] === Buffer) {
        // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
        Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true
        })
      }
    }

    function assertSize (size) {
      if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be a number')
      } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative')
      }
    }

    function alloc (that, size, fill, encoding) {
      assertSize(size)
      if (size <= 0) {
        return createBuffer(that, size)
      }
      if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpretted as a start offset.
        return typeof encoding === 'string'
          ? createBuffer(that, size).fill(fill, encoding)
          : createBuffer(that, size).fill(fill)
      }
      return createBuffer(that, size)
    }

    /**
     * Creates a new filled Buffer instance.
     * alloc(size[, fill[, encoding]])
     **/
    Buffer.alloc = function (size, fill, encoding) {
      return alloc(null, size, fill, encoding)
    }

    function allocUnsafe (that, size) {
      assertSize(size)
      that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
      if (!Buffer.TYPED_ARRAY_SUPPORT) {
        for (var i = 0; i < size; ++i) {
          that[i] = 0
        }
      }
      return that
    }

    /**
     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
     * */
    Buffer.allocUnsafe = function (size) {
      return allocUnsafe(null, size)
    }
    /**
     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
     */
    Buffer.allocUnsafeSlow = function (size) {
      return allocUnsafe(null, size)
    }

    function fromString (that, string, encoding) {
      if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8'
      }

      if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding')
      }

      var length = byteLength(string, encoding) | 0
      that = createBuffer(that, length)

      var actual = that.write(string, encoding)

      if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        that = that.slice(0, actual)
      }

      return that
    }

    function fromArrayLike (that, array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0
      that = createBuffer(that, length)
      for (var i = 0; i < length; i += 1) {
        that[i] = array[i] & 255
      }
      return that
    }

    function fromArrayBuffer (that, array, byteOffset, length) {
      array.byteLength // this throws if `array` is not a valid ArrayBuffer

      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('\'offset\' is out of bounds')
      }

      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('\'length\' is out of bounds')
      }

      if (byteOffset === undefined && length === undefined) {
        array = new Uint8Array(array)
      } else if (length === undefined) {
        array = new Uint8Array(array, byteOffset)
      } else {
        array = new Uint8Array(array, byteOffset, length)
      }

      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = array
        that.__proto__ = Buffer.prototype
      } else {
        // Fallback: Return an object instance of the Buffer class
        that = fromArrayLike(that, array)
      }
      return that
    }

    function fromObject (that, obj) {
      if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0
        that = createBuffer(that, len)

        if (that.length === 0) {
          return that
        }

        obj.copy(that, 0, 0, len)
        return that
      }

      if (obj) {
        if ((typeof ArrayBuffer !== 'undefined' &&
            obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
          if (typeof obj.length !== 'number' || isnan(obj.length)) {
            return createBuffer(that, 0)
          }
          return fromArrayLike(that, obj)
        }

        if (obj.type === 'Buffer' && isArray(obj.data)) {
          return fromArrayLike(that, obj.data)
        }
      }

      throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
    }

    function checked (length) {
      // Note: cannot use `length < kMaxLength()` here because that fails when
      // length is NaN (which is otherwise coerced to zero.)
      if (length >= kMaxLength()) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                             'size: 0x' + kMaxLength().toString(16) + ' bytes')
      }
      return length | 0
    }

    function SlowBuffer (length) {
      if (+length != length) { // eslint-disable-line eqeqeq
        length = 0
      }
      return Buffer.alloc(+length)
    }

    Buffer.isBuffer = function isBuffer (b) {
      return !!(b != null && b._isBuffer)
    }

    Buffer.compare = function compare (a, b) {
      if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        throw new TypeError('Arguments must be Buffers')
      }

      if (a === b) return 0

      var x = a.length
      var y = b.length

      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i]
          y = b[i]
          break
        }
      }

      if (x < y) return -1
      if (y < x) return 1
      return 0
    }

    Buffer.isEncoding = function isEncoding (encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true
        default:
          return false
      }
    }

    Buffer.concat = function concat (list, length) {
      if (!isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }

      if (list.length === 0) {
        return Buffer.alloc(0)
      }

      var i
      if (length === undefined) {
        length = 0
        for (i = 0; i < list.length; ++i) {
          length += list[i].length
        }
      }

      var buffer = Buffer.allocUnsafe(length)
      var pos = 0
      for (i = 0; i < list.length; ++i) {
        var buf = list[i]
        if (!Buffer.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers')
        }
        buf.copy(buffer, pos)
        pos += buf.length
      }
      return buffer
    }

    function byteLength (string, encoding) {
      if (Buffer.isBuffer(string)) {
        return string.length
      }
      if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
          (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
        return string.byteLength
      }
      if (typeof string !== 'string') {
        string = '' + string
      }

      var len = string.length
      if (len === 0) return 0

      // Use a for loop to avoid recursion
      var loweredCase = false
      for (;;) {
        switch (encoding) {
          case 'ascii':
          case 'latin1':
          case 'binary':
            return len
          case 'utf8':
          case 'utf-8':
          case undefined:
            return utf8ToBytes(string).length
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return len * 2
          case 'hex':
            return len >>> 1
          case 'base64':
            return base64ToBytes(string).length
          default:
            if (loweredCase) return utf8ToBytes(string).length // assume utf8
            encoding = ('' + encoding).toLowerCase()
            loweredCase = true
        }
      }
    }
    Buffer.byteLength = byteLength

    function slowToString (encoding, start, end) {
      var loweredCase = false

      // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
      // property of a typed array.

      // This behaves neither like String nor Uint8Array in that we set start/end
      // to their upper/lower bounds if the value passed is out of range.
      // undefined is handled specially as per ECMA-262 6th Edition,
      // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
      if (start === undefined || start < 0) {
        start = 0
      }
      // Return early if start > this.length. Done here to prevent potential uint32
      // coercion fail below.
      if (start > this.length) {
        return ''
      }

      if (end === undefined || end > this.length) {
        end = this.length
      }

      if (end <= 0) {
        return ''
      }

      // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
      end >>>= 0
      start >>>= 0

      if (end <= start) {
        return ''
      }

      if (!encoding) encoding = 'utf8'

      while (true) {
        switch (encoding) {
          case 'hex':
            return hexSlice(this, start, end)

          case 'utf8':
          case 'utf-8':
            return utf8Slice(this, start, end)

          case 'ascii':
            return asciiSlice(this, start, end)

          case 'latin1':
          case 'binary':
            return latin1Slice(this, start, end)

          case 'base64':
            return base64Slice(this, start, end)

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return utf16leSlice(this, start, end)

          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = (encoding + '').toLowerCase()
            loweredCase = true
        }
      }
    }

    // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
    // Buffer instances.
    Buffer.prototype._isBuffer = true

    function swap (b, n, m) {
      var i = b[n]
      b[n] = b[m]
      b[m] = i
    }

    Buffer.prototype.swap16 = function swap16 () {
      var len = this.length
      if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits')
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1)
      }
      return this
    }

    Buffer.prototype.swap32 = function swap32 () {
      var len = this.length
      if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits')
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3)
        swap(this, i + 1, i + 2)
      }
      return this
    }

    Buffer.prototype.swap64 = function swap64 () {
      var len = this.length
      if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits')
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7)
        swap(this, i + 1, i + 6)
        swap(this, i + 2, i + 5)
        swap(this, i + 3, i + 4)
      }
      return this
    }

    Buffer.prototype.toString = function toString () {
      var length = this.length | 0
      if (length === 0) return ''
      if (arguments.length === 0) return utf8Slice(this, 0, length)
      return slowToString.apply(this, arguments)
    }

    Buffer.prototype.equals = function equals (b) {
      if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
      if (this === b) return true
      return Buffer.compare(this, b) === 0
    }

    Buffer.prototype.inspect = function inspect () {
      var str = ''
      var max = exports.INSPECT_MAX_BYTES
      if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
        if (this.length > max) str += ' ... '
      }
      return '<Buffer ' + str + '>'
    }

    Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
      if (!Buffer.isBuffer(target)) {
        throw new TypeError('Argument must be a Buffer')
      }

      if (start === undefined) {
        start = 0
      }
      if (end === undefined) {
        end = target ? target.length : 0
      }
      if (thisStart === undefined) {
        thisStart = 0
      }
      if (thisEnd === undefined) {
        thisEnd = this.length
      }

      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index')
      }

      if (thisStart >= thisEnd && start >= end) {
        return 0
      }
      if (thisStart >= thisEnd) {
        return -1
      }
      if (start >= end) {
        return 1
      }

      start >>>= 0
      end >>>= 0
      thisStart >>>= 0
      thisEnd >>>= 0

      if (this === target) return 0

      var x = thisEnd - thisStart
      var y = end - start
      var len = Math.min(x, y)

      var thisCopy = this.slice(thisStart, thisEnd)
      var targetCopy = target.slice(start, end)

      for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i]
          y = targetCopy[i]
          break
        }
      }

      if (x < y) return -1
      if (y < x) return 1
      return 0
    }

    // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
    //
    // Arguments:
    // - buffer - a Buffer to search
    // - val - a string, Buffer, or number
    // - byteOffset - an index into `buffer`; will be clamped to an int32
    // - encoding - an optional encoding, relevant is val is a string
    // - dir - true for indexOf, false for lastIndexOf
    function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
      // Empty buffer means no match
      if (buffer.length === 0) return -1

      // Normalize byteOffset
      if (typeof byteOffset === 'string') {
        encoding = byteOffset
        byteOffset = 0
      } else if (byteOffset > 0x7fffffff) {
        byteOffset = 0x7fffffff
      } else if (byteOffset < -0x80000000) {
        byteOffset = -0x80000000
      }
      byteOffset = +byteOffset  // Coerce to Number.
      if (isNaN(byteOffset)) {
        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
        byteOffset = dir ? 0 : (buffer.length - 1)
      }

      // Normalize byteOffset: negative offsets start from the end of the buffer
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset
      if (byteOffset >= buffer.length) {
        if (dir) return -1
        else byteOffset = buffer.length - 1
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0
        else return -1
      }

      // Normalize val
      if (typeof val === 'string') {
        val = Buffer.from(val, encoding)
      }

      // Finally, search either indexOf (if dir is true) or lastIndexOf
      if (Buffer.isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) {
          return -1
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
      } else if (typeof val === 'number') {
        val = val & 0xFF // Search for a byte value [0-255]
        if (Buffer.TYPED_ARRAY_SUPPORT &&
            typeof Uint8Array.prototype.indexOf === 'function') {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
          }
        }
        return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
      }

      throw new TypeError('val must be string, number or Buffer')
    }

    function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
      var indexSize = 1
      var arrLength = arr.length
      var valLength = val.length

      if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase()
        if (encoding === 'ucs2' || encoding === 'ucs-2' ||
            encoding === 'utf16le' || encoding === 'utf-16le') {
          if (arr.length < 2 || val.length < 2) {
            return -1
          }
          indexSize = 2
          arrLength /= 2
          valLength /= 2
          byteOffset /= 2
        }
      }

      function read (buf, i) {
        if (indexSize === 1) {
          return buf[i]
        } else {
          return buf.readUInt16BE(i * indexSize)
        }
      }

      var i
      if (dir) {
        var foundIndex = -1
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
          } else {
            if (foundIndex !== -1) i -= i - foundIndex
            foundIndex = -1
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
        for (i = byteOffset; i >= 0; i--) {
          var found = true
          for (var j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false
              break
            }
          }
          if (found) return i
        }
      }

      return -1
    }

    Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1
    }

    Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
    }

    Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
    }

    function hexWrite (buf, string, offset, length) {
      offset = Number(offset) || 0
      var remaining = buf.length - offset
      if (!length) {
        length = remaining
      } else {
        length = Number(length)
        if (length > remaining) {
          length = remaining
        }
      }

      // must be an even number of digits
      var strLen = string.length
      if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

      if (length > strLen / 2) {
        length = strLen / 2
      }
      for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16)
        if (isNaN(parsed)) return i
        buf[offset + i] = parsed
      }
      return i
    }

    function utf8Write (buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
    }

    function asciiWrite (buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length)
    }

    function latin1Write (buf, string, offset, length) {
      return asciiWrite(buf, string, offset, length)
    }

    function base64Write (buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length)
    }

    function ucs2Write (buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
    }

    Buffer.prototype.write = function write (string, offset, length, encoding) {
      // Buffer#write(string)
      if (offset === undefined) {
        encoding = 'utf8'
        length = this.length
        offset = 0
      // Buffer#write(string, encoding)
      } else if (length === undefined && typeof offset === 'string') {
        encoding = offset
        length = this.length
        offset = 0
      // Buffer#write(string, offset[, length][, encoding])
      } else if (isFinite(offset)) {
        offset = offset | 0
        if (isFinite(length)) {
          length = length | 0
          if (encoding === undefined) encoding = 'utf8'
        } else {
          encoding = length
          length = undefined
        }
      // legacy write(string, encoding, offset, length) - remove in v0.13
      } else {
        throw new Error(
          'Buffer.write(string, encoding, offset[, length]) is no longer supported'
        )
      }

      var remaining = this.length - offset
      if (length === undefined || length > remaining) length = remaining

      if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds')
      }

      if (!encoding) encoding = 'utf8'

      var loweredCase = false
      for (;;) {
        switch (encoding) {
          case 'hex':
            return hexWrite(this, string, offset, length)

          case 'utf8':
          case 'utf-8':
            return utf8Write(this, string, offset, length)

          case 'ascii':
            return asciiWrite(this, string, offset, length)

          case 'latin1':
          case 'binary':
            return latin1Write(this, string, offset, length)

          case 'base64':
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length)

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return ucs2Write(this, string, offset, length)

          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = ('' + encoding).toLowerCase()
            loweredCase = true
        }
      }
    }

    Buffer.prototype.toJSON = function toJSON () {
      return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
      }
    }

    function base64Slice (buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf)
      } else {
        return base64.fromByteArray(buf.slice(start, end))
      }
    }

    function utf8Slice (buf, start, end) {
      end = Math.min(buf.length, end)
      var res = []

      var i = start
      while (i < end) {
        var firstByte = buf[i]
        var codePoint = null
        var bytesPerSequence = (firstByte > 0xEF) ? 4
          : (firstByte > 0xDF) ? 3
          : (firstByte > 0xBF) ? 2
          : 1

        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint

          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 0x80) {
                codePoint = firstByte
              }
              break
            case 2:
              secondByte = buf[i + 1]
              if ((secondByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
                if (tempCodePoint > 0x7F) {
                  codePoint = tempCodePoint
                }
              }
              break
            case 3:
              secondByte = buf[i + 1]
              thirdByte = buf[i + 2]
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
                if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                  codePoint = tempCodePoint
                }
              }
              break
            case 4:
              secondByte = buf[i + 1]
              thirdByte = buf[i + 2]
              fourthByte = buf[i + 3]
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
                if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                  codePoint = tempCodePoint
                }
              }
          }
        }

        if (codePoint === null) {
          // we did not generate a valid codePoint so insert a
          // replacement char (U+FFFD) and advance only 1 byte
          codePoint = 0xFFFD
          bytesPerSequence = 1
        } else if (codePoint > 0xFFFF) {
          // encode to utf16 (surrogate pair dance)
          codePoint -= 0x10000
          res.push(codePoint >>> 10 & 0x3FF | 0xD800)
          codePoint = 0xDC00 | codePoint & 0x3FF
        }

        res.push(codePoint)
        i += bytesPerSequence
      }

      return decodeCodePointsArray(res)
    }

    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
    // the lowest limit is Chrome, with 0x10000 args.
    // We go 1 magnitude less, for safety
    var MAX_ARGUMENTS_LENGTH = 0x1000

    function decodeCodePointsArray (codePoints) {
      var len = codePoints.length
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
      }

      // Decode in chunks to avoid "call stack size exceeded".
      var res = ''
      var i = 0
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        )
      }
      return res
    }

    function asciiSlice (buf, start, end) {
      var ret = ''
      end = Math.min(buf.length, end)

      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 0x7F)
      }
      return ret
    }

    function latin1Slice (buf, start, end) {
      var ret = ''
      end = Math.min(buf.length, end)

      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i])
      }
      return ret
    }

    function hexSlice (buf, start, end) {
      var len = buf.length

      if (!start || start < 0) start = 0
      if (!end || end < 0 || end > len) end = len

      var out = ''
      for (var i = start; i < end; ++i) {
        out += toHex(buf[i])
      }
      return out
    }

    function utf16leSlice (buf, start, end) {
      var bytes = buf.slice(start, end)
      var res = ''
      for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
      }
      return res
    }

    Buffer.prototype.slice = function slice (start, end) {
      var len = this.length
      start = ~~start
      end = end === undefined ? len : ~~end

      if (start < 0) {
        start += len
        if (start < 0) start = 0
      } else if (start > len) {
        start = len
      }

      if (end < 0) {
        end += len
        if (end < 0) end = 0
      } else if (end > len) {
        end = len
      }

      if (end < start) end = start

      var newBuf
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end)
        newBuf.__proto__ = Buffer.prototype
      } else {
        var sliceLen = end - start
        newBuf = new Buffer(sliceLen, undefined)
        for (var i = 0; i < sliceLen; ++i) {
          newBuf[i] = this[i + start]
        }
      }

      return newBuf
    }

    /*
     * Need to make sure that buffer isn't trying to write out of bounds.
     */
    function checkOffset (offset, ext, length) {
      if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
      if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
    }

    Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)

      var val = this[offset]
      var mul = 1
      var i = 0
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul
      }

      return val
    }

    Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) {
        checkOffset(offset, byteLength, this.length)
      }

      var val = this[offset + --byteLength]
      var mul = 1
      while (byteLength > 0 && (mul *= 0x100)) {
        val += this[offset + --byteLength] * mul
      }

      return val
    }

    Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 1, this.length)
      return this[offset]
    }

    Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length)
      return this[offset] | (this[offset + 1] << 8)
    }

    Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length)
      return (this[offset] << 8) | this[offset + 1]
    }

    Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)

      return ((this[offset]) |
          (this[offset + 1] << 8) |
          (this[offset + 2] << 16)) +
          (this[offset + 3] * 0x1000000)
    }

    Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)

      return (this[offset] * 0x1000000) +
        ((this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        this[offset + 3])
    }

    Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)

      var val = this[offset]
      var mul = 1
      var i = 0
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul
      }
      mul *= 0x80

      if (val >= mul) val -= Math.pow(2, 8 * byteLength)

      return val
    }

    Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) checkOffset(offset, byteLength, this.length)

      var i = byteLength
      var mul = 1
      var val = this[offset + --i]
      while (i > 0 && (mul *= 0x100)) {
        val += this[offset + --i] * mul
      }
      mul *= 0x80

      if (val >= mul) val -= Math.pow(2, 8 * byteLength)

      return val
    }

    Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 1, this.length)
      if (!(this[offset] & 0x80)) return (this[offset])
      return ((0xff - this[offset] + 1) * -1)
    }

    Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length)
      var val = this[offset] | (this[offset + 1] << 8)
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    }

    Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length)
      var val = this[offset + 1] | (this[offset] << 8)
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    }

    Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)

      return (this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16) |
        (this[offset + 3] << 24)
    }

    Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)

      return (this[offset] << 24) |
        (this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        (this[offset + 3])
    }

    Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)
      return ieee754.read(this, offset, true, 23, 4)
    }

    Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length)
      return ieee754.read(this, offset, false, 23, 4)
    }

    Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 8, this.length)
      return ieee754.read(this, offset, true, 52, 8)
    }

    Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 8, this.length)
      return ieee754.read(this, offset, false, 52, 8)
    }

    function checkInt (buf, value, offset, ext, max, min) {
      if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
      if (offset + ext > buf.length) throw new RangeError('Index out of range')
    }

    Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1
        checkInt(this, value, offset, byteLength, maxBytes, 0)
      }

      var mul = 1
      var i = 0
      this[offset] = value & 0xFF
      while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF
      }

      return offset + byteLength
    }

    Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset | 0
      byteLength = byteLength | 0
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1
        checkInt(this, value, offset, byteLength, maxBytes, 0)
      }

      var i = byteLength - 1
      var mul = 1
      this[offset + i] = value & 0xFF
      while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF
      }

      return offset + byteLength
    }

    Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
      if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
      this[offset] = (value & 0xff)
      return offset + 1
    }

    function objectWriteUInt16 (buf, value, offset, littleEndian) {
      if (value < 0) value = 0xffff + value + 1
      for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
        buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
          (littleEndian ? i : 1 - i) * 8
      }
    }

    Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
      } else {
        objectWriteUInt16(this, value, offset, true)
      }
      return offset + 2
    }

    Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 8)
        this[offset + 1] = (value & 0xff)
      } else {
        objectWriteUInt16(this, value, offset, false)
      }
      return offset + 2
    }

    function objectWriteUInt32 (buf, value, offset, littleEndian) {
      if (value < 0) value = 0xffffffff + value + 1
      for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
        buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
      }
    }

    Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = (value >>> 24)
        this[offset + 2] = (value >>> 16)
        this[offset + 1] = (value >>> 8)
        this[offset] = (value & 0xff)
      } else {
        objectWriteUInt32(this, value, offset, true)
      }
      return offset + 4
    }

    Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 24)
        this[offset + 1] = (value >>> 16)
        this[offset + 2] = (value >>> 8)
        this[offset + 3] = (value & 0xff)
      } else {
        objectWriteUInt32(this, value, offset, false)
      }
      return offset + 4
    }

    Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1)

        checkInt(this, value, offset, byteLength, limit - 1, -limit)
      }

      var i = 0
      var mul = 1
      var sub = 0
      this[offset] = value & 0xFF
      while (++i < byteLength && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1
        }
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
      }

      return offset + byteLength
    }

    Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1)

        checkInt(this, value, offset, byteLength, limit - 1, -limit)
      }

      var i = byteLength - 1
      var mul = 1
      var sub = 0
      this[offset + i] = value & 0xFF
      while (--i >= 0 && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1
        }
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
      }

      return offset + byteLength
    }

    Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
      if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
      if (value < 0) value = 0xff + value + 1
      this[offset] = (value & 0xff)
      return offset + 1
    }

    Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
      } else {
        objectWriteUInt16(this, value, offset, true)
      }
      return offset + 2
    }

    Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 8)
        this[offset + 1] = (value & 0xff)
      } else {
        objectWriteUInt16(this, value, offset, false)
      }
      return offset + 2
    }

    Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff)
        this[offset + 1] = (value >>> 8)
        this[offset + 2] = (value >>> 16)
        this[offset + 3] = (value >>> 24)
      } else {
        objectWriteUInt32(this, value, offset, true)
      }
      return offset + 4
    }

    Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
      value = +value
      offset = offset | 0
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
      if (value < 0) value = 0xffffffff + value + 1
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 24)
        this[offset + 1] = (value >>> 16)
        this[offset + 2] = (value >>> 8)
        this[offset + 3] = (value & 0xff)
      } else {
        objectWriteUInt32(this, value, offset, false)
      }
      return offset + 4
    }

    function checkIEEE754 (buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError('Index out of range')
      if (offset < 0) throw new RangeError('Index out of range')
    }

    function writeFloat (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4)
      return offset + 4
    }

    Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert)
    }

    Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert)
    }

    function writeDouble (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8)
      return offset + 8
    }

    Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert)
    }

    Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert)
    }

    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
    Buffer.prototype.copy = function copy (target, targetStart, start, end) {
      if (!start) start = 0
      if (!end && end !== 0) end = this.length
      if (targetStart >= target.length) targetStart = target.length
      if (!targetStart) targetStart = 0
      if (end > 0 && end < start) end = start

      // Copy 0 bytes; we're done
      if (end === start) return 0
      if (target.length === 0 || this.length === 0) return 0

      // Fatal error conditions
      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
      }
      if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
      if (end < 0) throw new RangeError('sourceEnd out of bounds')

      // Are we oob?
      if (end > this.length) end = this.length
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start
      }

      var len = end - start
      var i

      if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start]
        }
      } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
        // ascending copy from start
        for (i = 0; i < len; ++i) {
          target[i + targetStart] = this[i + start]
        }
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, start + len),
          targetStart
        )
      }

      return len
    }

    // Usage:
    //    buffer.fill(number[, offset[, end]])
    //    buffer.fill(buffer[, offset[, end]])
    //    buffer.fill(string[, offset[, end]][, encoding])
    Buffer.prototype.fill = function fill (val, start, end, encoding) {
      // Handle string cases:
      if (typeof val === 'string') {
        if (typeof start === 'string') {
          encoding = start
          start = 0
          end = this.length
        } else if (typeof end === 'string') {
          encoding = end
          end = this.length
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0)
          if (code < 256) {
            val = code
          }
        }
        if (encoding !== undefined && typeof encoding !== 'string') {
          throw new TypeError('encoding must be a string')
        }
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
          throw new TypeError('Unknown encoding: ' + encoding)
        }
      } else if (typeof val === 'number') {
        val = val & 255
      }

      // Invalid ranges are not set to a default, so can range check early.
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index')
      }

      if (end <= start) {
        return this
      }

      start = start >>> 0
      end = end === undefined ? this.length : end >>> 0

      if (!val) val = 0

      var i
      if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
          this[i] = val
        }
      } else {
        var bytes = Buffer.isBuffer(val)
          ? val
          : utf8ToBytes(new Buffer(val, encoding).toString())
        var len = bytes.length
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len]
        }
      }

      return this
    }

    // HELPER FUNCTIONS
    // ================

    var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

    function base64clean (str) {
      // Node strips out invalid characters like \n and \t from the string, base64-js does not
      str = stringtrim(str).replace(INVALID_BASE64_RE, '')
      // Node converts strings with length < 2 to ''
      if (str.length < 2) return ''
      // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
      while (str.length % 4 !== 0) {
        str = str + '='
      }
      return str
    }

    function stringtrim (str) {
      if (str.trim) return str.trim()
      return str.replace(/^\s+|\s+$/g, '')
    }

    function toHex (n) {
      if (n < 16) return '0' + n.toString(16)
      return n.toString(16)
    }

    function utf8ToBytes (string, units) {
      units = units || Infinity
      var codePoint
      var length = string.length
      var leadSurrogate = null
      var bytes = []

      for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i)

        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (!leadSurrogate) {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              continue
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
              continue
            }

            // valid lead
            leadSurrogate = codePoint

            continue
          }

          // 2 leads in a row
          if (codePoint < 0xDC00) {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            leadSurrogate = codePoint
            continue
          }

          // valid surrogate pair
          codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        }

        leadSurrogate = null

        // encode utf8
        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break
          bytes.push(codePoint)
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break
          bytes.push(
            codePoint >> 0x6 | 0xC0,
            codePoint & 0x3F | 0x80
          )
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break
          bytes.push(
            codePoint >> 0xC | 0xE0,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          )
        } else if (codePoint < 0x110000) {
          if ((units -= 4) < 0) break
          bytes.push(
            codePoint >> 0x12 | 0xF0,
            codePoint >> 0xC & 0x3F | 0x80,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          )
        } else {
          throw new Error('Invalid code point')
        }
      }

      return bytes
    }

    function asciiToBytes (str) {
      var byteArray = []
      for (var i = 0; i < str.length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF)
      }
      return byteArray
    }

    function utf16leToBytes (str, units) {
      var c, hi, lo
      var byteArray = []
      for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break

        c = str.charCodeAt(i)
        hi = c >> 8
        lo = c % 256
        byteArray.push(lo)
        byteArray.push(hi)
      }

      return byteArray
    }

    function base64ToBytes (str) {
      return base64.toByteArray(base64clean(str))
    }

    function blitBuffer (src, dst, offset, length) {
      for (var i = 0; i < length; ++i) {
        if ((i + offset >= dst.length) || (i >= src.length)) break
        dst[i + offset] = src[i]
      }
      return i
    }

    function isnan (val) {
      return val !== val // eslint-disable-line no-self-compare
    }

    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{"base64-js":76,"ieee754":183,"isarray":106}],
    "card-reader":[function(require,module,exports){
    /**
     * #  卡管理类（模块名：card-reader）
     *
     * @class nymph.dev.cardReader
     * @singleton
     * 本模块提供了各种卡的公共操作部分，具体卡的操作请查看各类卡内的定义。
     *
     * 例：
     *     //获取读卡器
     *     var cardReader = require('cardReader');
     *
     */
    'use strict';

    // 引用模块内部部件。
    var CardType = require('./card-type'),
        SlotType = require('./Slot-type'),
        ic = require('./ic/ic-card'),
        magcard = require('./mag/magcard'),
        CpuCard = ic.CpuCard,
        Magcard = magcard.Magcard,
        M1Card = ic.M1Card,
        Sim4442Card = ic.Sim4442Card,

    // 引用外部模块。
        nymphError = require('error'),
        Error = require('error').NymphError,
        hermes = require('hermes'),
        emv = require('emv'),
        when = require('when');

    var cardReader = {
        /**
         * 单实例对象没有实例 ID
         * @ignore
         */
        instanceId: hermes.NULL,

        PLUGINID: '000334baf882b1e1a2f33f17cdc5ab87',

        /**
         * isReading 是否已启动获取卡片。
         * @type {Boolean}
         * @ignore
         */
        isAcquiring: false,

        /**
         * @method stopAcquireCard
         * 停止获取卡片。
         *
         * **若此前有调用了 {@link nymph.dev.cardReader#waitForCard waitForCard}，且 {@link nymph.dev.cardReader#waitForCard waitForCard} 的回调函数还未执行，此时调用 {@link nymph.dev.cardReader#stopAcquireCard stopAcquireCard}方法将触发 {@link nymph.dev.cardReader#waitForCard waitForCard} 还未执行的回调函数，并产生“CANCELLED”的通知。**
         *
         *     try {
         *       cardReader.stopAcquireCard();
         *     } catch (err) {
         *       // 停止获取卡片失败的处理。
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.cardReader
         */
        stopAcquireCard: function () {
            // 停止获取卡片操作。
            var result, errorCode;

            if (!this.isAcquiring) {
                // 如果当前并没有在请求获取卡片，则无需让底层停止获取卡片。
                return;
            }

            result = hermes.exec(this.PLUGINID, this.instanceId, 'stopAcquireCard');
            errorCode = this.getError(result.innerCode, null);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to stop acquiring card.', innerCode: result.innerCode};
            }
            this.isAcquiring = false;
        },

        /**
         * @method waitForCard
         * 获取需要等待用户刷卡/挥卡/插卡的卡片。
         * 调用此接口后，进入等待用户刷卡/挥卡/插卡的状态：
         * - 如果调用此接口之前有启动 EMV 流程，则在获取到支持 EMV 的卡的时候自动继续 EMV 流程处理，直到 EMV 处理完相关操作后回调。
         * - 如果在调用此接口之前没有启动 EMV 流程，一旦用户进行了刷卡/挥卡/插卡的动作，就返回一个该操作获取到的卡实例。
         *
         * **一般情况下，只要指定要获取的卡片类型和卡槽类型，各类卡使用默认参数即可。**
         *
         *     var cardReader = require('card-reader');
         *     var nymphError = reuqire('error'); // 一些通用的返回码
         *     cardReader.waitForCard([{type: cardReader.CardType.MAGCARD, slot: cardReader.SlotType.SWIPE}, {type: cardReader.CardType.CPUCARD, slot: cardReader.SlotType.ICC1}], function (err, card) {
         *       if (err) {
         *         // 获取卡片失败的处理。
         *         switch (err.code) {
         *         case cardReader.NO_CARD:
         *             // 没有获取到卡片的处理。
         *             break;
         *         case cardReader.TYPE_ERR:
         *             // 卡片类型错误的处理。当未匹配到用户传入的卡片类型的卡时，会出现此错误。
         *             break;
         *         case nymphError.ERROR:
         *             // 获取卡片时出错的处理，如卡片上电失败等。
         *             break;
         *         case nymphError.CANCELLED:
         *             // 取消获取卡片的处理。
         *             break;
         *         }
         *       } else {
         *         // 获取卡片成功的处理。
         *         // card：{Object} 当前卡片对象。当不再使用当前卡片了，需要调用 `card.release()` 来释放卡片。
         *         // 如果是通过插卡或者挥卡获取到的卡片对象，还必须调用 {@link nymph.dev.cardReader#waitForCardTaken waitForCardTaken} 来提示并确认用户已取走卡片。
         *       }
         *     });
         *
         * **特殊情况下，接触式 IC 卡需要指定给卡片上电的电压模式和上电模式。**
         *
         *     cardReader.waitForCard([{type: cardReader.CardType.MAGCARD, slot: cardReader.SlotType.SWIPE}, {type: cardReader.CardType.CPUCARD, slot: cardReader.SlotType.ICC1, options: {volMode : cardReader.VolMode.VOL18, powerMode : cardReader.PowerMode.TCRMODE}}], function (err, card) {
         *       if (err) {
         *         // 获取卡片失败的处理。
         *         switch (err.code) {
         *         case cardReader.NO_CARD:
         *             // 没有获取到卡片的处理。
         *             break;
         *         case cardReader.TYPE_ERR:
         *             // 卡片类型错误的处理。当未匹配到用户传入的卡片类型的卡时，会出现此错误。
         *             break;
         *         case nymphError.ERROR:
         *             // 获取卡片时出错的处理，如卡片上电失败等。
         *             break;
         *         case nymphError.CANCELLED:
         *             // 取消获取卡片的处理。
         *             break;
         *         }
         *       } else {
         *         // 获取卡片成功的处理。
         *         // card：{Object} 当前卡片对象。当不再使用当前卡片了，需要调用 `card.release()` 来释放卡片。
         *         // 如果是通过插卡或者挥卡获取到的卡片对象，还必须调用 `waitForCardTaken` 来提示并确认用户已取走卡片。
         *       }
         *     });
         *
         * @param {Object[]} cards 要获取的卡片配置。此方法将会同时打开要获取的卡槽等待卡片，并返回第一个有卡的卡槽。
         *
         * 每一个卡片配置对象包含以下内容：
         *
         * - type：卡片类型
         * - slot：卡槽类型
         * - options：卡片参数。不同的卡片类型需要传入的卡片参数不同：
         *     - 当 type = {@link nymph.dev.cardReader.CardType#MAGCARD MAGCARD} 时的卡片参数：
         *         - lrcFlag：LRC 开关。值为 true 时采用 LRC 进行校验，false 不采用 LRC 进行校验。
         *         - enableTrack1：是否读取 1 磁道信息。默认为 true（读取磁道一）。
         *         - enableTrack2：是否读取 2 磁道信息。默认为 true（读取磁道二）。
         *         - enableTrack3：是否读取 3 磁道信息。默认为 true（读取磁道三）。
         *     - 当 type = {@link nymph.dev.cardReader.CardType#CPUCARD CPUCARD} ，slot = {@link nymph.dev.cardReader.SlotType#ICC1 ICC1}，{@link nymph.dev.cardReader.SlotType#ICC2 ICC2}，{@link nymph.dev.cardReader.SlotType#ICC3 ICC3} 时的卡片参数：
         *         - volMode：电压模式。取值参见 {@link nymph.dev.cardReader.ic.VolMode VolMode}
         *         - powerMode：电源模式。取值参见 {@link nymph.dev.cardReader.ic.PowerMode PowerMode}
         *
         * @param {Object} [options] 获取各类卡片需要的公共参数（可选）。
         * @param {Number} options.timeout 获取卡片超时时间。以秒（s）为单位。默认为永不超时。
         * @param {Boolean} options.isEmv 是否为 EMV 流程中请求卡片。如果没有启动 emv，但是此参数设置为 true，则会回调参数错误。
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         * @param {Object} callback.card 当前卡片对象。
         * @member nymph.dev.cardReader
         */
        waitForCard: function (cards, options, callback) {
            var cb, err = new Error(), self = this, isParamErr = false;
            if (!cards && !options && !callback) {
                // 用户一个参数都没有传进来，此时无法回调错误出去，只能抛异常
                err.code = nymphError.PARAM_ERR;
                err.message = 'Please specify cards and callback at least.';
                throw err;
            }

            if (typeof cards !== 'function' && typeof options !== 'function' && typeof callback !== 'function') {
                err.code = nymphError.PARAM_ERR;
                err.message = 'Please specify callback.';
                throw err;
            }

            if(cards === null || typeof cards === 'undefined' || cards.constructor !== Array){
                err.code = nymphError.PARAM_ERR;
                err.message = 'Please check the first parameter(cards).Make sure you have passed in an array of cards.';
                if (typeof cards === 'function') {
                    callback = cards;
                } else if(typeof  options === 'function') {
                    callback = options;
                } else if (typeof  callback === 'function'){
                } else {
                    // 第一个参数必须为 cards 数组
                    throw err;
                }
                callback.call(self, err);
                return;
            }

            // 调整参数。
            if (typeof options === 'function') {
                // 用户传入的 callback 在第二个参数
                callback = options;
                options = {};
            } else {
                if (typeof callback !== 'function') {
                    err.code = nymphError.PARAM_ERR;
                    err.message = 'The third parameter should be a function.';
                    throw err;
                }

                if (!options.hasOwnProperty('isEmv') && !options.hasOwnProperty('timeout')) {
                    err.code = nymphError.PARAM_ERR;
                    err.message = 'The second parameter(options) is invalid!';
                    callback.call(self, err);
                    return;
                }

                if (options.hasOwnProperty('isEmv')) {
                    // 如果并没有启动 EMV 流程，则此参数不应该传入 true
                    if (options.isEmv && !emv.isStarted) {
                        err.code = nymphError.PARAM_ERR;
                        err.message = 'EMV process did not start, you should not set isEmv true.';
                        callback.call(self, err);
                        return;
                    }
                }
            }

            if (self.isAcquiring) {
                err.code = nymphError.DEVICE_USED;
                err.message = 'Already acquiring for card, please stop last request first.';
                callback.call(self, err);
                return;
            }

            cards.forEach(function (card, index) {
                if (!card.hasOwnProperty('type') || !card.hasOwnProperty('slot')) {
                    err.code = nymphError.PARAM_ERR;
                    err.message = 'Please specify card type and slot.';
                    isParamErr = true;
                }

                switch (card.slot) {
                    case self.SlotType.SWIPE:
                        if (card.type !== self.CardType.MAGCARD) {
                            err.code = nymphError.PARAM_ERR;
                            err.message = 'Slot ' + card.slot + ' can not read ' + card.type;
                            isParamErr = true;
                            return;
                        }
                        break;
                    case self.SlotType.ICC1:
                    case self.SlotType.ICC2:
                    case self.SlotType.ICC3:
                        if (card.type !== self.CardType.CPUCARD &&
                            card.type !== self.CardType.SLE44X2 &&
                            card.type !== self.CardType.SLE44X8 &&
                            card.type !== self.CardType.AT24CXX &&
                            card.type !== self.CardType.AT88SC102 &&
                            card.type !== self.CardType.AT88SC1604 &&
                            card.type !== self.CardType.AT88SC1608){
                            err.code = nymphError.PARAM_ERR;
                            err.message = 'Slot ' + card.slot + ' can not read ' + card.type;
                            isParamErr = true;
                            return;
                        }
                        break;
                    case self.SlotType.PSAM1:
                    case self.SlotType.PSAM2:
                    case self.SlotType.PSAM3:
                        if (card.type !== self.CardType.CPUCARD) {
                            err.code = nymphError.PARAM_ERR;
                            err.message = 'Slot ' + card.slot + ' can not read ' + card.type;
                            isParamErr = true;
                            return;
                        }
                        break;
                    case self.SlotType.RF:
                    case self.SlotType.RF_EX:
                        if (card.type !== self.CardType.CPUCARD &&
                            card.type !== self.CardType.M1CARD &&
                            card.type !== self.CardType.ACARD &&
                            card.type !== self.CardType.BCARD){
                            err.code = nymphError.PARAM_ERR;
                            err.message = 'Slot ' + card.slot + ' can not read ' + card.type;
                            isParamErr = true;
                            return;
                        }
                        break;
                    default:
                        err.code = nymphError.PARAM_ERR;
                        err.message = 'Not support this kind of slot: ' + card.slot;
                        isParamErr = true;
                        return;
                }

                if(card.hasOwnProperty('options')){
                    var cardOptions = card.options;
                    if (cardOptions.hasOwnProperty('volMode')){
                        switch (cardOptions.volMode){
                            case self.ic.VolMode.VOL18:
                            case self.ic.VolMode.VOL3:
                            case self.ic.VolMode.VOL5:
                                break;
                            default:
                                err.code = nymphError.PARAM_ERR;
                                err.message = 'Can not support volMode: ' + cardOptions.volMode;
                                isParamErr = true;
                                return;
                        }
                    }
                    if (cardOptions.hasOwnProperty('powerMode')){
                        switch (cardOptions.powerMode){
                            case self.ic.PowerMode.EMVMODE:
                            case self.ic.PowerMode.MODE384:
                            case self.ic.PowerMode.MODE192:
                            case self.ic.PowerMode.ISOMODE:
                            case self.ic.PowerMode.SHBMODE:
                            case self.ic.PowerMode.MODE576:
                            case self.ic.PowerMode.TCRMODE:
                                break;
                            default:
                                err.code = nymphError.PARAM_ERR;
                                err.message = 'Can not support powerMode: ' + cardOptions.powerMode;
                                isParamErr = true;
                                return;
                        }
                    }
                }
            });

            if (isParamErr) {
                callback.call(self, err);
                return;
            }

            // 检测卡片是否在位/寻卡。
            // 接触式 IC 卡初始化。
            // 上电。
            self.isAcquiring = true;

            // card 包含以下内容：
            // card.type：当前卡片类型
            // card.slot：当前卡槽类型
            // card.options：当前卡片参数
            // card.data：不同的卡返回的数据不同：
            // - 磁条卡返回一个 tracks 对象，该对象包含 {track1，track2，track3}，每个磁道数据包含 flag、data（base64字符串）、errMsg
            // - M1 卡返回卡片序列号
            // - 其他卡根据情况返回数据。
            cb = function (err, card) {
                self.isAcquiring = false;
                var asyncCard = null;
                if (!err) {
                    // 获取卡片成功，根据卡片类型创建卡片实例。
                    switch (card.type) {
                        case CardType.CPUCARD:
                            // 接触式和非接触式 CPU 卡都是 CpuCard 的实例。
                            asyncCard = new CpuCard(card);
                            break;
                        case CardType.MAGCARD:
                            asyncCard = new Magcard(card);
                            break;
                        case CardType.M1CARD:
                            asyncCard = new M1Card(card);
                            break;
                        case CardType.SLE44X2:
                            asyncCard = new Sim4442Card(card);
                            break;
                        default:
                            err = new Error();
                            err.code = self.TYPE_ERR;
                            err.message = 'Not support this kind of card: ' + card.type;
                            break;
                    }

                    if (asyncCard !== null) {
                        asyncCard.init(function (error) {
                            if (error) {
                                callback.call(self, error ,asyncCard);
                            } else {
                                callback.call(self, null, asyncCard);
                            }
                        });
                    }
                } else {
                    if (card) {
                        err.code = self.getError(err.innerCode, card.slot);
                    } else {
                        err.code = self.getError(err.innerCode, null);
                    }
                    err.card = card;
                    callback.call(self, err);
                }
            };

            // 本机有哪些卡槽是由配置表设置的，底层的轮询操作可以从配置表获取卡槽列表后进行轮询操作的。
            hermes.exec(self.PLUGINID, this.instanceId, 'waitForCard', [cards, options], cb.bind(self));
        },

        /**
         * @method getFixedCards
         * 获取常在位的卡片实例。
         * 此接口与 {@link nymph.dev.cardReader#waitForCard} 的区别在于：此接口无需等待用户刷卡、插卡的动作，调用此接口可即时获得常在位的一个或者多个卡片实例。
         *
         * **一般情况下，只要指定要获取的卡片类型，各类卡使用默认参数即可。**
         *
         *     var cardReader = require('card-reader');
         *     cardReader.getFixedCards([{type: cardReader.CardType.CPUCARD, slot: cardReader.SlotType.PSAM1}, {type: cardReader.CardType.CPUCARD, slot: cardReader.SlotType.PSAM2}], function (err, cards) {
         *         if (err) {
         *             // 错误处理
         *         } else {
         *             // 获取到了各个卡片实例
         *            cards.forEach(function (card,index){
         *              if (!card.hasOwnProperty('acquireErr')) {
         *                 // 说明获取该卡片实例失败，失败信息参见 acquireErr。
         *              } else {
         *                 // 获取该卡片实例成功，可对卡片进行相关操作。
         *                 // 使用完卡片实例后，请调用 `card.release()` 释放卡片。
         *              }
         *            });
         *         }
         *     });
         *
         * **特殊情况下，接触式 IC 卡需要指定给卡片上电的电压模式和上电模式。**
         *
         *     var cardReader = require('card-reader');
         *     cardReader.getFixedCards([{type: cardReader.CardType.CPUCARD, slot: cardReader.SlotType.PSAM1, options: {volMode : cardReader.VolMode.VOL18, powerMode : cardReader.PowerMode.TCRMODE}}, {type: cardReader.CardType.CPUCARD, slot: cardReader.SlotType.PSAM2}], function (err, cards) {
         *         if (err) {
         *             // 错误处理
         *         } else {
         *             // 获取到了各个卡片实例
         *            cards.forEach(function (card,index){
         *              if (!card.hasOwnProperty('acquireErr')) {
         *                 // 说明获取该卡片实例失败，失败信息参见 acquireErr。
         *              } else {
         *                 // 获取该卡片实例成功，可对卡片进行相关操作。
         *                 // 使用完卡片实例后，请调用 `card.release()` 释放卡片。
         *              }
         *            });
         *         }
         *     });
         *
         * @param {Object[]} cards 要获取的卡片配置。此方法对传入的卡片类型按顺序进行轮询，并返回第一个匹配成功的卡对象。
         *
         * 每一个卡片配置对象包含以下内容：
         *
         * - type：卡片类型
         * - slot：卡槽类型
         * - options：卡片参数。不同的卡片类型需要传入的卡片参数不同：
         *     - 当 type = {@link nymph.dev.cardReader.CardType#CPUCARD CPUCARD} ，slot = {@link nymph.dev.cardReader.SlotType} 时的卡片参数：
         *         - volMode：电压模式。取值参见 {@link nymph.dev.cardReader.ic.VolMode VolMode}
         *         - powerMode：电源模式。取值参见 {@link nymph.dev.cardReader.ic.PowerMode PowerMode}
         *
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         * @param {Object} callback.cards 获取到的卡片对象。如果某个卡片获取失败，则返回的该卡片对象会有一个 acquireErr 属性。
         * @member nymph.dev.cardReader
         */
        getFixedCards: function (cards, callback) {
            var resultCards = [], self = this, result, errorCode, pList = [], err = new Error();
            if (!cards && !callback) {
                // 用户一个参数都没有传进来，此时无法回调错误出去，只能抛异常
                err.code = nymphError.PARAM_ERR;
                err.message = 'Please pass in cards and callback!';
                throw err;
            }
            if (cards === null || typeof cards === 'undefined' || cards.constructor !== Array || cards.length === 0) {
                err.code = nymphError.PARAM_ERR;
                err.message = 'Please check the first parameter(cards).Make sure you have passed in an array of cards.';
                if (typeof cards === 'function') {
                    callback = cards;
                }  else if (typeof  callback === 'function'){
                } else {
                    // 第一个参数必须为 cards 数组
                    throw err;
                }
                callback.call(self, err);
                return;
            }
            if (typeof callback !== 'function') {
                err.code = nymphError.PARAM_ERR;
                err.message = 'Please make sure you have passed in callback.';
                if (typeof cards === 'function') {
                    callback = cards;
                } else {
                    throw err;
                }
                callback.call(self, err);
                return;
            }
            for (var i = 0; i < cards.length; i++) {
                var cardInfo = cards[i], card = null;
                if (!cardInfo.hasOwnProperty('type') || !cardInfo.hasOwnProperty('slot')) {
                    err.code = nymphError.PARAM_ERR;
                    err.message = 'Please specify card type and slot.';
                    callback.call(self, err);
                    return;
                }

                switch (cardInfo.slot) {
                    case SlotType.PSAM1:
                    case SlotType.PSAM2:
                    case SlotType.PSAM3:
                        if (cardInfo.type !== self.CardType.CPUCARD) {
                            err.code = nymphError.PARAM_ERR;
                            err.message = 'Not support this kind of card:' + cardInfo.type;
                            callback.call(self, err);
                            return;
                        }
                        break;
                    default:
                        err.code = nymphError.PARAM_ERR;
                        err.message = 'Not support this kind of slot:' + cardInfo.slot;
                        callback.call(self, err);
                        return;
                }
                if(cardInfo.hasOwnProperty('options')){
                    var cardOptions = cardInfo.options;
                    if (cardOptions.hasOwnProperty('volMode')){
                        switch (cardOptions.volMode){
                            case self.ic.VolMode.VOL18:
                            case self.ic.VolMode.VOL3:
                            case self.ic.VolMode.VOL5:
                                break;
                            default:
                                err.code = nymphError.PARAM_ERR;
                                err.message = 'Not support this volMode:' + cardOptions.volMode;
                                callback.call(self, err);
                                return;
                        }
                    }
                    if (cardOptions.hasOwnProperty('powerMode')){
                        switch (cardOptions.powerMode){
                            case self.ic.PowerMode.EMVMODE:
                            case self.ic.PowerMode.MODE384:
                            case self.ic.PowerMode.MODE192:
                            case self.ic.PowerMode.ISOMODE:
                            case self.ic.PowerMode.SHBMODE:
                            case self.ic.PowerMode.MODE576:
                            case self.ic.PowerMode.TCRMODE:
                                break;
                            default:
                                err.code = nymphError.PARAM_ERR;
                                err.message = 'Not support this powerMode:' + cardOptions.powerMode;
                                resultCards.push(cardInfo);
                                callback.call(self, err);
                                return;
                        }
                    }
                }
                if (!cardInfo.hasOwnProperty('acquireErr')) {
                    // 如果没有 acquireErr，说明是允许获取的卡片
                    result = hermes.exec(self.PLUGINID, this.instanceId, 'initSlot', [cardInfo]);
                    errorCode = self.getError(result.innerCode, cardInfo);
                    if (errorCode !== nymphError.SUCCESS) {
                        cardInfo.acquireErr = {code: errorCode, message: 'Failed to get PSAM card.'};
                        resultCards.push(cardInfo);
                    } else {
                        card = new CpuCard(cardInfo);
                        pList.push(self.initCardPromise(card, resultCards));
                    }
                }
            }
            if (pList.length > 0) {
                when.all(pList).then(function () {
                    callback.call(self, null, resultCards);
                }, function (err) {
                    callback.call(self, err);
                });
            } else {
                callback.call(self, null, resultCards);
            }
        },

        /**
         * @ignore
         */
        initCardPromise: function (card, cards) {
            var defered = when.defer();

            card.init(function (err) {
                if (err) {
                    card.acquireErr = err;
                }
                cards.push(card);
                defered.resolve();
            });

            return defered.promise;
        },

        /**
         * @method isCardIn
         * 检测 IC 卡 是否还在位。
         *
         *     try {
         *         // icCard 为通过 {@link nymph.dev.cardReader#waitForCard waitForCard} 接口回调返回的 IC 卡实例。
         *         var isCardIn = cardReader.isCardIn(icCard);
         *         if (isCardIn) {
         *             // 当前操作卡在位的处理
         *         } else {
         *             // 当前操作卡不在位的处理
         *         }
         *     } catch (err) {
         *         // 异常处理
         *     }
         *
         * @param {Object} card 需要判断是否还在位的卡实例。
         * @return {Boolean} 卡是否在位
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.cardReader
         */
        isCardIn: function (card) {
            // 检测卡槽中是否有卡。
            var result, errorCode;
            if (!card) {
                throw {code: nymphError.PARAM_ERR, message: 'Please pass in the card you want to check.'};
            }
            if (!card.hasOwnProperty('instanceId')) {
                throw {code: nymphError.PARAM_ERR, message: 'Please perform waiting for card first.'};
            }
            result = hermes.exec(this.PLUGINID, this.instanceId, 'isCardIn', [card.instanceId, card.type, card.slot]);
            errorCode = this.getError(result.innerCode, card.slot);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Check card existence failed', innerCode: result.innerCode};
            }
            return result.data;
        },

        /**
         * @method waitForCardTaken
         * 等待取卡。
         * 此方法在释放了卡片以后调用，调用此方法后，如果用户已经取走卡了，会立即完成回调。如果用户还未取走卡片，则会一直等待用户取卡，直到用户取走卡片以后回调，以此来确保用户在交易完成以后有取走卡片。
         *
         *     // cpuCard 为通过 {@link nymph.dev.cardReader#waitForCard waitForCard} 接口回调返回的接触式 IC 卡实例。
         *     cardReader.waitForCardTaken(cpuCard, function (err) {
         *         if (err) {
         *             // 等待取卡出错处理
         *         } else {
         *             // 用户已经取走卡片
         *         }
         *     });
         *
         * @param {Object} card 通过 {@link nymph.dev.cardReader#waitForCard waitForCard} 取到的卡片对象。
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         * @member nymph.dev.cardReader
         */
        waitForCardTaken: function (card, callback) {
            var self = this;

            if(typeof callback !== 'function') {
                if (typeof card === 'function') {
                    callback = card;
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please make sure that callback is the last parameter!'});
                    return;
                } else {
                    throw {code: nymphError.PARAM_ERR, message: 'Please make sure you have passed in callback!'};
                }
            }

            if(!card || !card.hasOwnProperty('slot')) {
                callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please make sure you have passed in a valid card instance.'});
                return;
            }
            hermes.exec(self.PLUGINID, self.instanceId, 'waitForCardTaken', [card], function (err) {
                if (err) {
                    err.code = self.getError(err.innerCode, card.slot);
                    callback.call(self, err);
                } else {
                    callback.call(self, null);
                }
            });
        },

        /**
         * @ignore
         * @param {Number} innerCode 底层上传的返回码
         * @return {String} 返回码对应的字符串
         */
        getError: function (innerCode, slot) {
            // todo 完善 error。
            var self = this;
            switch (innerCode) {
                case -6000: // IC 读卡器基础错误码
                    return self.IC_CARDREADER_BASE_ERR;
                case -6999: // IC 读卡器其他错误码
                    return self.IC_CARDREADER_OTHER_ERR;
                case -10000: // 卡类基础错误
                    return self.CARD_BASE_ERR;
                default:
                    var code;
                    if (slot === SlotType.SWIPE) {
                        code = Magcard.prototype.getError(innerCode);
                        if (code !== nymphError.UNKNOWN) {
                            return code;
                        }
                    } else {
                        code = ic.ErrorCode.getError(innerCode);
                        if (code !== nymphError.UNKNOWN) {
                            return code;
                        }

                        code = CpuCard.prototype.getError(innerCode);
                        if (code !== nymphError.UNKNOWN) {
                            return code;
                        }

                        code = M1Card.prototype.getError(innerCode);
                        if (code !== nymphError.UNKNOWN) {
                            return code;
                        }
                    }

                    return nymphError.getError(innerCode);
            }
        },
    };

    /**
     * # 读卡器错误码
     * @class nymph.dev.cardReader.ErrorCode
     */
    var ErrorCode = {
        /**
         * @property {String} [IC_CARDREADER_BASE_ERR='IC_CARDREADER_BASE_ERR'] IC 读卡器基础错误。
         * @member nymph.dev.cardReader.ErrorCode
         */
        IC_CARDREADER_BASE_ERR: 'IC_CARDREADER_BASE_ERR',

        /**
         * @property {String} [IC_CARDREADER_OTHER_ERR='IC_CARDREADER_OTHER_ERR'] IC 读卡器其他错误。
         * @member nymph.dev.cardReader.ErrorCode
         */
        IC_CARDREADER_OTHER_ERR: 'IC_CARDREADER_OTHER_ERR',

        /**
         * @property {String} [CARD_BASE_ERR='CARD_BASE_ERR'] 卡类基础错误。
         * @member nymph.dev.cardReader.ErrorCode
         */
        CARD_BASE_ERR: 'CARD_BASE_ERR'
    };

    /**
     * # 卡片状态
     * @class nymph.dev.cardReader.CardStatus
     */
    var CardStatus = {
        /**
         * @property {String} [NO_EMV='NO_EMV'] 卡片没有被 EMV 流程受理。
         * @member  nymph.dev.cardReader.CardStatus
         */
        NO_EMV: 'NO_EMV',

        /**
         * @property {String} [EMV_PROCESSING='EMV_PROCESSING'] 卡片已被 EMV 流程受理。
         * @member  nymph.dev.cardReader.CardStatus
         */
        EMV_PROCESSING: 'EMV_PROCESSING',

        /**
         * @property {String} [EMV_FAILED='EMV_FAILED'] 流程受理卡片失败。
         * @member  nymph.dev.cardReader.CardStatus
         */
        EMV_FAILED: 'EMV_FAILED',

        /**
         * @property {String} [EMV_FINISHED='EMV_FINISHED'] 流程受理卡片结束。
         * @member  nymph.dev.cardReader.CardStatus
         */
        EMV_FINISHED: 'EMV_FINISHED'
    };

    /**
     * @property {nymph.dev.cardReader.ErrorCode} ErrorCode 错误码。
     * @member nymph.dev.cardReader
     */
    cardReader.ErrorCode = ErrorCode;

    /**
     * @property {nymph.dev.cardReader.CardStatus} CardStatus 卡片状态。
     * @member nymph.dev.cardReader
     */
    cardReader.CardStatus = CardStatus;

    /**
     * @property {nymph.dev.cardReader.CardType} CardType 卡类型枚举。
     * @member nymph.dev.cardReader
     */
    cardReader.CardType = require('./card-type');

    /**
     * @property {nymph.dev.cardReader.SlotType} SlotType 卡槽类型枚举。
     * @member nymph.dev.cardReader
     */
    cardReader.SlotType = require('./slot-type');

    /**
     * @property {nymph.dev.cardReader.magcard} magcard 包括磁条卡及相关类。
     * @member nymph.dev.cardReader
     */
    cardReader.magcard = magcard;

    /**
     * @property {nymph.dev.cardReader.ic} ic 包括 IC 卡各种卡类及相关类。
     * @member nymph.dev.cardReader
     */
    cardReader.ic = ic;

    hermes.addEventSupport(cardReader);
    module.exports = cardReader;

    },{"./Slot-type":29,"./card-type":30,"./ic/ic-card":33,"./mag/magcard":40,"./slot-type":42,"emv":"emv","error":"error","hermes":"hermes","when":296}],
    "connectivity-manager":[function(require,module,exports){
    'use strict';

    /**
     * # 通讯管理类（模块名：connectivityManager）
     * @class nymph.comm.connectivityManager
     * @singleton
     * 本模块主要负责通讯方式的建立和管理。
     */

    // 引用外部模块。
    var nymphError = require('error'),
        Error = require('error').NymphError,
        hermes = require('hermes');

    // 引用模块内部部件。
    var gprsManager = require('./gprs/gprs-manager');
    var wifiManager = require('./wifi/wifi-manager');
    var ethManager = require('./ethernet/ethernet-adapter');

    var connectivityManager = {
      instanceId: hermes.NULL,

      /**
       * 插件名称。
       */
      PLUGINID: '4d35c6e75fa260890572a8fe4631b0a2',

      /**
       * 通讯参数。
       */
      commParam: null,

      /**
       * 当前网络（最后一次打开的网络类型）
       */
      currentNetwork: null,

      /**
       * 是否支持同时打开多种网络
       */
      isSupportMultiNetwork: false,

      /**
       * @method dnsResolve 不使用
       * DNS域名解析为IP地址
       *
       * @param {String} domain 域名
       * @return {String} 如果解析成功返回映射的 IP 地址，失败返回 null
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      dnsResolve: function (domain) {
        var result, errorCode;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'dnsResolve', [domain]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: 'DNS 域名解析失败。', innerCode: result.innerCode};
        }

        return result.data;
      },

      /**
       * @method preConnect 不使用
       * 预拨号。
       *
       * modem 进行非阻塞拨号，2G/3G 进行非阻塞连接 PPP。
       * @param {Function} callback 处理此方法执行结果的回调函数。
       * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
       */
      preConnect: function (callback) {
      },

      /**
       * @method open
       * 打开设备
       *
       * @param {nymph.comm.connectivityManager.NetworkType} networkType 要打开的网络类型。
       *
       * @param {Function} callback 处理此方法执行结果的回调函数。
       * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
       */
      open: function (networkType, callback) {
        var self = this, actualParam = {};
        switch (networkType) {
            case self.NetworkType.GPRS:
            case self.NetworkType.LAN:
            case self.NetworkType.WIFI:
              break;
            default:
              callback.call(self, {code: nymphError.PARAM_ERR, message: 'Not support this network:' + networkType});
              return;
        }
          hermes.exec(self.PLUGINID, self.instanceId, 'open', [networkType], function (err) {
              if (err) {
                  err.code = self.getError(err.innerCode);
                  callback.call(self, err);
              } else {
                  self.currentNetwork = networkType;
                  callback.call(self, null);
              }
          });
      },

      /**
       * @method getNetworkManager
       * 获取指定通讯方式的管理器用来做该通讯方式特有的操作。
       * @param {nymph.comm.connectivityManager.NetworkType} networkType 要获取的网络类型。
       * @return {Object} 获取到的网络管理器。
       */
      getNetworkManager: function (networkType) {
          var self = this;
           switch (networkType) {
               case self.NetworkType.GPRS:
                   return gprsManager;
               case self.NetworkType.WIFI:
                   // 目前只有 WIFI 有需要特有操作的管理器。
                   return wifiManager;
               case self.NetworkType.LAN:
                   // 目前只有以太网有需要特有操作的管理器，目前以太网模块暂时没有特有操作，先预留
                   return ethManager;
               default:
                   return {};
           }
       },

      /**
       * @method config 不使用
       * 设置网络参数。
       *
       * @param {nymph.comm.connectivityManager.NetworkType} networkType 要设置的网络类型。
       *
       * @param {Object} param 通讯参数。
       * @param {Object} param.gprs GPRS 网络参数
       * @param {String} param.gprs.apn APN
       * @param {String} param.gprs.password 密码
       * @param {String} param.gprs.userName 用户名
       *
       * @param {Object} param.lan 有线网络参数（以太网接口需要os版本3.9.0以上支持）
       * @param {String} param.lan.dns1 DNS 地址
       * @param {String} param.lan.dns2 DNS 地址
       * @param {String} param.lan.gateway 网关地址
       * @param {String} param.lan.localIp 本地 IP
       * @param {String} param.lan.mask 网络掩码
       * @param {Boolean} param.lan.isDhcp 是否使用 DHCP 服务（如果设置成true，就不会去配置静态IP、网关、掩码、dns这些参数）
       *
       * @param {Object} param.wifi WIFI 网络参数
       * @param {String} param.lan.dns1 DNS 地址
       * @param {String} param.lan.dns2 DNS 地址
       * @param {String} param.lan.gateway 网关地址
       * @param {String} param.lan.localIp 本地 IP
       * @param {String} param.lan.mask 网络掩码
       * @param {Boolean} param.lan.isDhcp 是否使用 DHCP 服务
       *
       * @param {Function} callback 处理此方法执行结果的回调函数。
       * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
       */
       config: function (networkType, param, callback){
          var self = this;

          hermes.exec(self.PLUGINID, self.instanceId, 'config', [networkType, param], function (err) {
              if (err) {
                  err.code = self.getError(err.innerCode);
                  callback.call(self, err);
              } else {
                  callback.call(self, null);
              }
          });
       },

        /**
         * @method connect 不使用
         * 按照 config 设置好的网络参数，连接指定网络。
          * @param {nymph.comm.connectivityManager.NetworkType} networkType 要打开的网络类型。
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         */
       connect: function (networkType, callback) {
           var self = this;

           hermes.exec(self.PLUGINID, self.instanceId, 'connect', [networkType], function (err) {
               if (err) {
                   err.code = self.getError(err.innerCode);
                   callback.call(self, err);
               } else {
                   self.currentNetwork = networkType;
                   callback.call(self, null);
               }
           });
       },

      /**
       * @method close
       * 关闭设备。
       *
       * @param {nymph.comm.connectivityManager.NetworkType} networkType 要关闭的网络类型。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      close: function (networkType, callback) {
        var self = this;

        hermes.exec(self.PLUGINID, self.instanceId, 'close', [networkType], function (err) {
          if (err) {
            err.code = self.getError(err.innerCode);
            callback.call(self, err);
          } else {
            self.currentNetwork = null;
            callback.call(self, null);
          }
        });
      },

      /**
       * @method ping 不使用
       * 检测网络连通性，利用 ping 做 2-3 次 icmp 检测包的发送接收
       *
       * @param {String} serverIp 检测对端 IP 或者域名。
       * @param {Number} timeout 超时时间（单位：秒）。
       * @param {Function} callback 处理此方法执行结果的回调函数。
       * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
       * @param {Number} callback.retCode 检测通道结果。
       */
      ping: function (serverIp, timeout, callback) {
        var self = this;

        hermes.exec(self.PLUGINID, self.instanceId, 'ping', [serverIp, timeout], function (err) {
          if (err) {
            err.code = self.getError(err.innerCode);
            callback.call(self, err);
          } else {
            callback.call(self, null);
          }
        });
      },

      getError: function (innerCode) {
        var ErrorCode = this.ErrorCode;
        switch (innerCode) {
          case -9000:
          case -9001:
            return nymphError.ERROR;
          case -9002:
            return ErrorCode.CABLE_NOT_INSERTED;
          case -9003:
            return nymphError.PARAM_ERR;
          case -9004:
            return ErrorCode.APN_ERR;
          case -9005:
            return ErrorCode.NO_SIM;
          case -9999:
            return nymphError.OTHER_ERR;
          default:
            return nymphError.getError(innerCode);
        }
      }
    };

    var ErrorCode = {
        /**
         * 网线没插
         */
        CABLE_NOT_INSERTED: 'CABLE_NOT_INSERTED',

        /**
         * APN 错误
         */
        APN_ERR: 'APN_ERR',

        /**
         * 没有 sim 卡
         */
        NO_SIM: 'NO_SIM',
    };

    /**
     * 网络类型
     * @class nymph.comm.connectivityManager.NetworkType
     */
    var NetworkType = {
      /**
       * GPRS
       */
      GPRS: 'GPRS',

      /**
       * LAN
       */
      LAN: 'LAN',

      /**
       * WIFI
       */
      WIFI: 'WIFI'
    };

    /**
     * @property {nymph.comm.connectivityManager.ErrorCode} ErrorCode 错误码。
     * @member nymph.comm.connectivityManager
     */
    connectivityManager.ErrorCode = ErrorCode;

    /**
     * @property {nymph.comm.connectivityManager.NetworkType} NetworkType 网络类型。
     * @member nymph.comm.connectivityManager
     */
    connectivityManager.NetworkType = NetworkType;

    hermes.addJsPluginInstance(connectivityManager.PLUGINID, connectivityManager);

    module.exports = connectivityManager;

    },{"./ethernet/ethernet-adapter":26,"./gprs/gprs-manager":27,"./wifi/wifi-manager":28,"error":"error","hermes":"hermes"}],
    "console-patch":[function(require,module,exports){
    'use strict';

    var consolePatch = function () {
      return {
        log: prepareLogFn(window.console.log, 'LOG'),
        info: prepareLogFn(window.console.info, 'INFO'),
        warn: prepareLogFn(window.console.warn, 'WARN'),
        debug: prepareLogFn(window.console.debug, 'DEBUG'),
        error: prepareLogFn(window.console.error, 'ERROR')
      }
    };
    function prepareLogFn(logFn, level) {
      return function () {
        try {
          var args = Array.prototype.slice.call(arguments),
            now = new Date();

          // prepend a timestamp and optional classname to the original output message
          args[0] = now + ' - ' + 'hermes-app' + args[0];
          //发送日志消息给服务器
          if (window.socket) {
            window.socket.emit('log', {'source': 'APP', 'time': now, 'level': level, 'message': arguments});
          }
          logFn.apply(window.console, args);
        }
        catch (error) {
          window.console.error("LogDecorator ERROR: " + error);
        }
      }
    }

    module.exports = consolePatch;

    },{}],
    "crypto-js":[function(require,module,exports){
    ;(function (root, factory, undef) {
        if (typeof exports === "object") {
            // CommonJS
            module.exports = exports = factory(require("./core"), require("./x64-core"), require("./lib-typedarrays"), require("./enc-utf16"), require("./enc-base64"), require("./md5"), require("./sha1"), require("./sha256"), require("./sha224"), require("./sha512"), require("./sha384"), require("./sha3"), require("./ripemd160"), require("./hmac"), require("./pbkdf2"), require("./evpkdf"), require("./cipher-core"), require("./mode-cfb"), require("./mode-ctr"), require("./mode-ctr-gladman"), require("./mode-ofb"), require("./mode-ecb"), require("./pad-ansix923"), require("./pad-iso10126"), require("./pad-iso97971"), require("./pad-zeropadding"), require("./pad-nopadding"), require("./format-hex"), require("./aes"), require("./tripledes"), require("./rc4"), require("./rabbit"), require("./rabbit-legacy"));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy"], factory);
        }
        else {
            // Global (browser)
            root.CryptoJS = factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        return CryptoJS;

    }));
    },{"./aes":115,"./cipher-core":116,"./core":117,"./enc-base64":118,"./enc-utf16":119,"./evpkdf":120,"./format-hex":121,"./hmac":122,"./lib-typedarrays":123,"./md5":124,"./mode-cfb":125,"./mode-ctr":127,"./mode-ctr-gladman":126,"./mode-ecb":128,"./mode-ofb":129,"./pad-ansix923":130,"./pad-iso10126":131,"./pad-iso97971":132,"./pad-nopadding":133,"./pad-zeropadding":134,"./pbkdf2":135,"./rabbit":137,"./rabbit-legacy":136,"./rc4":138,"./ripemd160":139,"./sha1":140,"./sha224":141,"./sha256":142,"./sha3":143,"./sha384":144,"./sha512":145,"./tripledes":146,"./x64-core":147}],
    "date-format":[function(require,module,exports){
    'use strict';

    /**
     * @class nymph.util.dateFormat
     * @singleton
     *
     * 此JS文件是格式化JS中日期时间的工具类，其中包含了传入日期对象Date，格式化成想要的格式，<br>
     * 或者传入字符串格式的时间，此字符串日期对应的格式可以转换为相应的日期对象，<br>
     * 可以计算两个日期之间的差值
     *
     * y: 表示年
     * M：表示一年中的月份 1~12
     * d: 表示月份中的天数 1~31
     * H：表示一天中的小时数 00~23
     * m: 表示小时中的分钟数 00~59
     * s: 表示分钟中的秒数   00~59
     */

    var DateFormat = function(){
      this.initialize();
    };

    DateFormat.prototype = {
      //定义一些常用的日期格式的常量
      DEFAULT_DATE_FORMAT: 'yyyy-MM-dd',
      DEFAULT_MONTH_FORMAT: 'yyyy-MM',
      DEFAULT_YEAR_FORMAT: 'yyyy',
      DEFAULT_TIME_FORMAT: 'HH:mm:ss',
      DEFAULT_DATETIME_FORMAT1: 'yyyy-MM-dd HH:mm:ss',
      DEFAULT_DATETIME_FORMAT2: 'yyyyMMddHHmmss',
      DEFAULT_YEAR: 'YEAR',
      DEFAULT_MONTH: 'MONTH',
      DEFAULT_DATE: 'DATE',


      //初始化当前日期
      initialize: function(){
        this.curDate = new Date();
      },

      /**
       * @method formatCurrentDate
       * 根据给定的日期时间格式，格式化当前日期
       * @param {String} strFormat 格式化字符串， 如："yyyy-MM-dd" ,默认：yyyy-MM-dd HH:mm:ss
       * @return {String} 返回根据给定格式的字符串表示的时间日期格式<br>
       *         若给定的格式不符合规定则返回原字符串格式
       */
      formatCurrentDate: function(strFormat){
        var tempFormat = strFormat === undefined? this.DEFAULT_DATETIME_FORMAT1: strFormat;
        var dates = this.getDateObject(this.curDate);
        if(/(y+)/.test(tempFormat)){
          var fullYear = this.curDate.getFullYear() + '';
          var year = RegExp.$1.length === 4? fullYear: fullYear.substr(4 - RegExp.$1.length);
          tempFormat = tempFormat.replace(RegExp.$1, year);
        }
        for(var i in dates){
          if(new RegExp('(' + i + ')').test(tempFormat)){
            var target = RegExp.$1.length === 1? dates[i]: ('0' + dates[i]).substr(('' + dates[i]).length - 1);
            tempFormat = tempFormat.replace(RegExp.$1, target);
          }
        }
        return tempFormat;
      },


      /**
       * @method format
       * 根据给定的格式，把给定的时间进行格式化
       * @param {Date} date 要格式化的日期
       * @param {String} strFormat 要得到的日期的格式的格式化字符串，如：'yyyy-MM-dd'，默认：yyyy-MM-dd HH:mm:ss
       * @return {String} 根据规定格式的时间格式
       */
      format: function(date, strFormat){
        if(typeof date === 'undefined'){
          this.curDate = new Date();
        }else if(!(date instanceof Date)){
          this.debug(date + '你输入的不是日期类型');
          return date;
        }else{
          this.curDate = date;
        }
        return this.formatCurrentDate(strFormat);
      },

      /**
       * @method parseDate
       * 根据给定的格式对给定的字符串日期时间进行解析，
       * @param {String} strDate 要解析的日期的字符串表示,此参数只能是字符串形式的日期，否则返回当前系统日期
       * @param {String} strFormat 解析给定日期的格式, 如果输入的strDate的格式为{Date.parse()}方法支持的格式，<br>
       *         则可以不传入，否则一定要传入与strDate对应的格式, 若不传入格式则返回当期系统日期。
       * @return {Date} 返回解析后的Date类型的时间<br>
       *        若不能解析则返回当前日期<br>
       *        若给定为时间格式 则返回的日期为 1970年1月1日的日期
       *
       * bug: 此方法目前只能实现类似'yyyy-MM-dd'格式的日期的转换，<br>
       *       而'yyyyMMdd'形式的日期，则不能实现
       */

      parseDate: function(strDate, strFormat){
        if(typeof strDate !== 'string'){
          return new Date();
        }
        var longTime = Date.parse(strDate);
        if(isNaN(longTime)){
          if(typeof strFormat === 'undefined'){
            this.debug('请输入日期的格式');
            return new Date();
          }
          var tmpDate = new Date();
          var regFormat = /(\w{4})|(\w{2})|(\w{1})/g;
          var regDate = /(\d{4})|(\d{2})|(\d{1})/g;
          var formats = strFormat.match(regFormat);
          var dates = strDate.match(regDate);
          if(typeof formats !== 'undefined' && typeof dates !== 'undefined' && formats.length === dates.length){
            for(var i = 0; i < formats.length; i++){
              var format = formats[i];
              if(format === 'yyyy'){
                tmpDate.setFullYear(parseInt(dates[i], 10));
              }else if(format === 'yy'){
                var prefix = (tmpDate.getFullYear() + '').substring(0, 2);
                var year = (parseInt(dates[i], 10) + '').length === 4? parseInt(dates[i], 10): prefix + (parseInt(dates[i], 10) + '00').substring(0, 2);
                var tmpYear = parseInt(year, 10);
                tmpDate.setFullYear(tmpYear);
              }else if(format === 'MM' || format === 'M'){
                tmpDate.setMonth(parseInt(dates[i], 10) - 1);
              }else if(format === 'dd' || format === 'd'){
                tmpDate.setDate(parseInt(dates[i], 10));
              }else if(format === 'HH' || format === 'H'){
                tmpDate.setHours(parseInt(dates[i], 10));
              }else if(format === 'mm' || format === 'm'){
                tmpDate.setMinutes(parseInt(dates[i], 10));
              }else if(format === 'ss' || format === 's'){
                tmpDate.setSeconds(parseInt(dates[i], 10));
              }
            }
            return tmpDate;
          }
          return tmpDate;
        }else{
          return new Date(longTime);
        }
      },

      /**
       * @method compareTo
       * 比较两个日期的差距
       * @param date1 Date类型的时间
       * @param date2 Date 类型的时间
       * @param isFormat boolean 是否对得出的时间进行格式化,<br>
       *       false:返回毫秒数，true：返回格式化后的数据
       * @return 返回两个日期之间的毫秒数 或者是格式化后的结果
       */
      compareTo: function(date1, date2, isFormat){
        var len = arguments.length;
        var tmpdate1 = new Date();
        var tmpdate2 = new Date();
        if(len === 1){
          tmpdate1 = date1;
        }else if(len >= 2){
          tmpdate1 = date1;
          tmpdate2 = date2;
        }
        if(!(tmpdate1 instanceof Date) || !(tmpdate2 instanceof Date)){
          //alert("请输入正确的参数！");
          return 0;
        }else{
          var time1 = tmpdate1.getTime();
          var time2 = tmpdate2.getTime();
          var time = Math.max(time1, time2) - Math.min(time1, time2);
          if(!isNaN(time) && time > 0){
            if(isFormat){
              var date = new Date(time);
              var result = {};
              /*result += (date.getFullYear() - 1970) > 0? (date.getFullYear() - 1970) + "年":"";
               result += (date.getMonth() - 1) > 0? (date.getMonth() - 1) + "月": "";
               result += (date.getDate() - 1) > 0? (date.getDate() - 1) + "日": "";
               result += (date.getHours() - 8) > 0? (date.getHours() - 1) + "小时": "";
               result += date.getMinutes() > 0? date.getMinutes() + "分钟": "";
               result += date.getSeconds() > 0? date.getSeconds() + "秒": "";*/
              result.year   = (date.getFullYear() - 1970) > 0? (date.getFullYear() - 1970): '0';
              result.month  = (date.getMonth() - 1) > 0? (date.getMonth() - 1): '0';
              result.day    = (date.getDate() - 1) > 0? (date.getDate() - 1): '0';
              result.hour   = (date.getHours() - 8) > 0? (date.getHours() - 1): '0';
              result.minute = date.getMinutes() > 0? date.getMinutes(): '0';
              result.second = date.getSeconds() > 0? date.getSeconds(): '0';
              return result;
            }else {
              return time;
            }
          }else{
            return 0;
          }
        }
      },

      /**
       * @method calculateMonth
       * 按月份进行加减 计算规则如下：<br>
       *   1、如果传入的日期的日数值小于对应月份总天数且小于计算的新的月份的总天数，则日为当前日数值，月份为新计算的月份<br>
       *   2、如果传入的日期的月份总天数大于等于新计算得到的月份的总天数，则日为新计算月份的最后一天，月份为新计算的月份<br>
       *   3、如果传入的日期的月份总天数小于新计算得到的月份的总天数，则日为新计算月份的最后一天，月份为新计算的月份<br>
       * @param {Date} date 日期
       * @param {Number} amount 月份加减的数值 负值代表减月，正值代表加月
       * @return {Date} 返回计算后的日期
       */
      calculateMonth: function(date, amount){
        if(undefined === date || !(date instanceof Date) ){
          return date;
        }
        if(typeof amount !== 'number'){
          return date;
        }
        var _month = date.getMonth();
        var _day = date.getDate();
        var _newMonth = parseInt((_month + amount) % 12); //根据传入的数值和日期月份计算出新的月份
        var _newYear = date.getFullYear() + parseInt((_month + amount) / 12); //根据传入的数值和日期计算出新的年份
        //START 当传入的数值为负值时重新计算新的月份和年份
        if(amount < 0){
          _newYear = date.getFullYear() - parseInt((12 - amount) / 12);
          _newMonth = parseInt((12 + (_month + amount)));
        }
        //END
        var _oldMonthDay = this.getMonthDays(date.getFullYear(), _month); //根据传入的日期年份和月份获取对应月份的总天数
        var mouthDays = this.getMonthDays(_newYear, _newMonth);  //根据计算出的新的年份和月份获取对应月份的总天数
        date.setFullYear(_newYear);
        if((_day < _oldMonthDay && _day < mouthDays)){
          date.setDate(_day);
          date.setMonth(_newMonth);
        }else if(mouthDays <= _oldMonthDay){
          date.setDate(mouthDays);
          date.setMonth(_newMonth);
        }else{
          date.setMonth(_newMonth);
          date.setDate(mouthDays);
        }
        return date;
      },

      /**
       * @method isLeapYear
       * 判断是否为闰年
       * @param {Number} year 要判断的年份
       * @return {Boolean} 是：true, 否：false
       */
      isLeapYear: function(year){
        var _year = year + '';
        if(!(/^\d{4}$/.test(_year))){
          return false;
        }
        _year = _year * 1;
        var is4 = (_year % 4 === 0) && (_year % 100 !== 0); //能被4整除，且不能被100整除
        var is400 = _year % 400 === 0; //能被400整除
        return is4 || is400;
      },

      /**
       * @method getMonthDays
       * 获取给定月份的天数,JS中获取的月份是从0开始计算
       * @param {Number} year 要判断的月份所在年份
       * @param {Number} month 给定月份
       * @return {Number} 给定月份的天数
       */
      getMonthDays: function(year, month){
        var _newMonth = month;
        //1,3,5,7,8,10,12月份为31天
        if(0 === _newMonth || 2 === _newMonth || 4 === _newMonth || 6 === _newMonth || 7 === _newMonth || 9 === _newMonth || 11 === _newMonth){
          return 31;
        }else if(3 === _newMonth || 5 === _newMonth || 8 === _newMonth || 10 === _newMonth){//4,6,9,11月份为30天
          return 30;
        }else{
          return (this.isLeapYear(year)? 29: 28); //2月份闰年29天,平年28天
        }
      },

      /**
       * @method getDateObject
       * 根据给定的日期得到日期的月，日，时，分和秒的对象
       * @param {Date} date 给定的日期 date为非Date类型， 则获取当前日期
       * @return {Object} 有给定日期的月、日、时、分和秒组成的对象
       */
      getDateObject: function(date){
        if(!(date instanceof Date)){
          date = new Date();
        }
        return {
          'M+' : date.getMonth() + 1,
          'd+' : date.getDate(),
          'H+' : date.getHours(),
          'm+' : date.getMinutes(),
          's+' : date.getSeconds()
        };
      },

      /**
       * @method debug
       *在控制台输出日志
       *@param {String} message 要输出的日志信息
       */
      debug: function(message){
        if(!window.console){
          window.console = {};
          window.console.log = function(){
            return;
          };
        }
        window.console.log(message + ' ');
      }
    };

    module.exports = DateFormat;

    },{}],
    "device-status":[function(require,module,exports){
    'use strict';

    //引用外部模块
    var hermes = require('hermes'),
        nymphError = require('error'),
        Error = require('error').NymphError;

    //var deviceStatus= {};
    /**
     * # 设备状态（模块名：device-status）
     * @class nymph.sys.deviceStatus
     * @singleton
     */


    //var DeviceStatus = function(){
    //    this.instanceId= hermes.NULL;
    //};

    //DeviceStatus.prototype = {
    var deviceStatus = {
        /**
         * 插件ID。
         */
        PLUGINID: '95203a8a9ccaba6d239ad9075b08d27d',

        //constructor: DeviceStatus,

        instanceId: hermes.NULL,

        bindEvents: function () {
            var self = this;

            /**
             * @event onchanged
             * 设备状态变化时。
             * @param {String} devName 设备名称：printer-打印机 cardreader-读卡器 pinpad-密码键盘 scanner-扫描枪 emv-EMV
             * @param {String} status 设备状态：closed-未打开 opened-打开 activated-激活状态 failed-打开或者关闭异常状态
             * @param {Number} data 设备状态数据：目前待定
             *
             *
             * @member nymph.sys.deviceStatus
             */
            self.addListener('onchanged', function (devName, status, data) {
                self.emit('changed', devName, status, data);
            });

        },

        unBindEvents: function () {
            var self = this;
            self.removeAllListeners('onchanged');
        },

        /**
         * @method init
         * 初始化插件,(返回instanceID),使用本模块必须先调用本方法
         *
         *     try {
       *         deviceStatus.create();
       *     } catch (err) {
       *         // 创建失败的处理
       *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.sys.deviceStatus
         */
        init: function () {
            // 如果重复打开，则抛出异常。
            if (this.instanceId !== hermes.NULL) {
                var error = new Error();
                error.code = this.PLUGIN_CREATE;
                error.message = 'Plugin already created.';

                throw error;
            }
            var result, errorCode;
            result  = hermes.exec(this.PLUGINID, this.instanceId, 'init', []);

            console.log('createPlugin 的结果：' + JSON.stringify(result));
            errorCode = this.getError(result.innerCode);
            console.log('createPlugin errorCode:' + errorCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to create Device Status.', innerCode: result.innerCode};
            }
            console.log('createPlugin instanceId:' + result.data);
            this.instanceId = result.data;

        },

        /**
         * @property {String} [PLUGIN_CREATE='PLUGIN_CREATE'] 插件已经创建。
         * @member nymph.sys.deviceStatus
         */
        PLUGIN_CREATE: 'PLUGIN_CREATE',

        /**
         * @property {String} [CREATE_INSTANCE_FAIL='CREATE_INSTANCE_FAIL'] 创建实例失败。
         * @member nymph.sys.deviceStatus
         */
        CREATE_INSTANCE_FAIL:'CREATE_INSTANCE_FAIL',

        /**
         * @ignore
         * @param {Number} innerCode 底层上传的返回码
         * @returns {String} 返回码对应的字符串
         */
        getError: function (innerCode) {
            var self = this;
            switch (innerCode) {
                case -1:
                    return nymphError.ERROR;
                case 6:
                    return self.CREATE_INSTANCE_FAIL;
                default:
                    return nymphError.getError(innerCode);
            }
        }
    };
    //deviceStatus.DeviceStatus = DeviceStatus;
    hermes.addEventSupport(deviceStatus);
    hermes.addJsPluginInstance(deviceStatus.PLUGINID, deviceStatus);
    deviceStatus.bindEvents();
    module.exports = deviceStatus;


    },{"error":"error","hermes":"hermes"}],
    "emv-data":[function(require,module,exports){
    'use strict';

    var pubKeys, aids, defaultBasicParam, defaultPbocParam, defaultVisaParam, defaultMasterParam,
        basicParamList = [],
        visaParamList = [],
        pbocParamList = [],
        masterParamList = [],
        pubKeys = [],
        Buffer = require('buffer').Buffer,
        encoding = require('nymph-encoding'),
        emv = require('emv'),
        hermes = require('hermes'),
        emvData = {};

    var pubKey1 = new emv.PubKeyRsa();
    pubKey1.rid = new Buffer([0xA0, 0x00, 0x00, 0x99, 0x99]);
    pubKey1.index = 0xE1;
    pubKey1.mod = new Buffer([0x99, 0xC5, 0xB7, 0x0A, 0xA6, 0x1B, 0x4F, 0x4C, 0x51, 0xB6,
        0xF9, 0x0B, 0x0E, 0x3B, 0xFB, 0x7A, 0x3E, 0xE0, 0xE7, 0xDB,
        0x41, 0xBC, 0x46, 0x68, 0x88, 0xB3, 0xEC, 0x8E, 0x99, 0x77,
        0xC7, 0x62, 0x40, 0x7E, 0xF1, 0xD7, 0x9E, 0x0A, 0xFB, 0x28,
        0x23, 0x10, 0x0A, 0x02, 0x0C, 0x3E, 0x80, 0x20, 0x59, 0x3D,
        0xB5, 0x0E, 0x90, 0xDB, 0xEA, 0xC1, 0x8B, 0x78, 0xD1, 0x3F,
        0x96, 0xBB, 0x2F, 0x57, 0xEE, 0xDD, 0xC3, 0x0F, 0x25, 0x65,
        0x92, 0x41, 0x7C, 0xDF, 0x73, 0x9C, 0xA6, 0x80, 0x4A, 0x10,
        0xA2, 0x9D, 0x28, 0x06, 0xE7, 0x74, 0xBF, 0xA7, 0x51, 0xF2,
        0x2C, 0xF3, 0xB6, 0x5B, 0x38, 0xF3, 0x7F, 0x91, 0xB4, 0xDA,
        0xF8, 0xAE, 0xC9, 0xB8, 0x03, 0xF7, 0x61, 0x0E, 0x06, 0xAC,
        0x9E, 0x6B]);
    pubKey1.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey1);

    var pubKey2 = new emv.PubKeyRsa();
    pubKey2.rid = new Buffer([0xA0, 0x00, 0x00, 0x99, 0x99]);
    pubKey2.index = 0xE2;
    pubKey2.mod = new Buffer([0xBD, 0x23, 0x2E, 0x34, 0x8B, 0x11, 0x8E, 0xB3, 0xF6, 0x44,
        0x6E, 0xF4, 0xDA, 0x6C, 0x3B, 0xAC, 0x9B, 0x2A, 0xE5, 0x10,
        0xC5, 0xAD, 0x10, 0x7D, 0x38, 0x34, 0x32, 0x55, 0xD2, 0x1C,
        0x4B, 0xDF, 0x49, 0x52, 0xA4, 0x2E, 0x92, 0xC6, 0x33, 0xB1,
        0xCE, 0x4B, 0xFE, 0xC3, 0x9A, 0xFB, 0x6D, 0xFE, 0x14, 0x7E,
        0xCB, 0xB9, 0x1D, 0x68, 0x1D, 0xAC, 0x15, 0xFB, 0x0E, 0x19,
        0x8E, 0x9A, 0x7E, 0x46, 0x36, 0xBD, 0xCA, 0x10, 0x7B, 0xCD,
        0xA3, 0x38, 0x4F, 0xCB, 0x28, 0xB0, 0x6A, 0xFE, 0xF9, 0x0F,
        0x09, 0x9E, 0x70, 0x84, 0x51, 0x1F, 0x3C, 0xC0, 0x10, 0xD4,
        0x34, 0x35, 0x03, 0xE1, 0xE5, 0xA6, 0x72, 0x64, 0xB4, 0x36,
        0x7D, 0xAA, 0x9A, 0x39, 0x49, 0x49, 0x92, 0x72, 0xE9, 0xB5,
        0x02, 0x2F]);
    pubKey2.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey2);

    var pubKey3 = new emv.PubKeyRsa();
    pubKey3.rid = new Buffer([0xA0, 0x00, 0x00, 0x99, 0x99]);
    pubKey3.index = 0xE3;
    pubKey3.mod = new Buffer([0xBC, 0x01, 0xE1, 0x22, 0x23, 0xE1, 0xA4, 0x1E, 0x88, 0xBF,
        0xFA, 0x80, 0x10, 0x93, 0xC5, 0xF8, 0xCE, 0xC5, 0xCD, 0x05,
        0xDB, 0xBD, 0xBB, 0x78, 0x7C, 0xE8, 0x72, 0x49, 0xE8, 0x80,
        0x83, 0x27, 0xC2, 0xD2, 0x18, 0x99, 0x1F, 0x97, 0xA1, 0x13,
        0x1E, 0x8A, 0x25, 0xB0, 0x12, 0x2E, 0xD1, 0x1E, 0x70, 0x9C,
        0x53, 0x3E, 0x88, 0x86, 0xA1, 0x25, 0x9A, 0xDD, 0xFD, 0xCB,
        0xB3, 0x96, 0x60, 0x4D, 0x24, 0xE5, 0x05, 0xA2, 0xD0, 0xB5,
        0xDD, 0x03, 0x84, 0xFB, 0x00, 0x02, 0xA7, 0xA1, 0xEB, 0x39,
        0xBC, 0x8A, 0x11, 0x33, 0x9C, 0x7A, 0x94, 0x33, 0xA9, 0x48,
        0x33, 0x77, 0x61, 0xBE, 0x73, 0xBC, 0x49, 0x7B, 0x8E, 0x58,
        0x73, 0x6D, 0xA4, 0x63, 0x65, 0x38, 0xAD, 0x28, 0x2D, 0x3C,
        0xD3, 0xDB]);
    pubKey3.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey3);

    var pubKey4 = new emv.PubKeyRsa();
    pubKey4.rid = new Buffer([0xA0, 0x00, 0x00, 0x99, 0x99]);
    pubKey4.index = 0xE4;
    pubKey4.mod = new Buffer([0xCB, 0xF2, 0xE4, 0x0F, 0x08, 0x36, 0xC9, 0xA5, 0xE3, 0x90,
        0xA3, 0x7B, 0xE3, 0xB8, 0x09, 0xBD, 0xF5, 0xD7, 0x40, 0xCB,
        0x1D, 0xA3, 0x8C, 0xFC, 0x05, 0xD5, 0xF8, 0xD6, 0xB7, 0x74,
        0x5B, 0x5E, 0x9A, 0x3F, 0xA6, 0x96, 0x1E, 0x55, 0xFF, 0x20,
        0x41, 0x21, 0x08, 0x52, 0x5E, 0x66, 0xB9, 0x70, 0xF9, 0x02,
        0xF7, 0xFF, 0x43, 0x05, 0xDD, 0x83, 0x2C, 0xD0, 0x76, 0x3E,
        0x3A, 0xA8, 0xB8, 0x17, 0x3F, 0x84, 0x77, 0x71, 0x00, 0xB1,
        0x04, 0x7B, 0xD1, 0xD7, 0x44, 0x50, 0x93, 0x12, 0xA0, 0x93,
        0x2E, 0xD2, 0x5F, 0xED, 0x52, 0xA9, 0x59, 0x43, 0x07, 0x68,
        0xCC, 0xD9, 0x02, 0xFD, 0x8C, 0x8A, 0xD9, 0x12, 0x3E, 0x6A,
        0xDD, 0xB3, 0xF3, 0x4B, 0x92, 0xE7, 0x92, 0x4D, 0x72, 0x9C,
        0xB6, 0x47, 0x35, 0x33, 0xAE, 0x2B, 0x2B, 0x55, 0xBF, 0x0E,
        0x44, 0x96, 0x4F, 0xDE, 0xA8, 0x44, 0x01, 0x17]);
    pubKey4.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey4);

    var pubKey5 = new emv.PubKeyRsa();
    pubKey5.rid = new Buffer([0xA0, 0x00, 0x00, 0x99, 0x99]);
    pubKey5.index = 0xE5;
    pubKey5.mod = new Buffer([0xD4, 0xFD, 0xAE, 0x94, 0xDE, 0xDB, 0xEC, 0xC6, 0xD2, 0x0D,
        0x38, 0xB0, 0x1E, 0x91, 0x82, 0x6D, 0xC6, 0x95, 0x43, 0x38,
        0x37, 0x99, 0x17, 0xB2, 0xBB, 0x8A, 0x6B, 0x36, 0xB5, 0xD3,
        0xB0, 0xC5, 0xED, 0xA6, 0x0B, 0x33, 0x74, 0x48, 0xBA, 0xFF,
        0xEB, 0xCC, 0x3A, 0xBD, 0xBA, 0x86, 0x9E, 0x8D, 0xAD, 0xEC,
        0x6C, 0x87, 0x01, 0x10, 0xC4, 0x2F, 0x5A, 0xAB, 0x90, 0xA1,
        0x8F, 0x4F, 0x86, 0x7F, 0x72, 0xE3, 0x38, 0x6F, 0xFC, 0x7E,
        0x67, 0xE7, 0xFF, 0x94, 0xEB, 0xA0, 0x79, 0xE5, 0x31, 0xB3,
        0xCF, 0x32, 0x95, 0x17, 0xE8, 0x1C, 0x5D, 0xD9, 0xB3, 0xDC,
        0x65, 0xDB, 0x5F, 0x90, 0x43, 0x19, 0x0B, 0xE0, 0xBE, 0x89,
        0x7E, 0x5F, 0xE4, 0x8A, 0xDF, 0x5D, 0x3B, 0xFA, 0x05, 0x85,
        0xE0, 0x76, 0xE5, 0x54, 0xF2, 0x6E, 0xC6, 0x98, 0x14, 0x79,
        0x7F, 0x15, 0x66, 0x9F, 0x4A, 0x25, 0x5C, 0x13]);
    pubKey5.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey5);

    var pubKey6 = new emv.PubKeyRsa();
    pubKey6.rid = new Buffer([0xA0, 0x00, 0x00, 0x99, 0x99]);
    pubKey6.index = 0xE6;
    pubKey6.mod = new Buffer([0xEB, 0xF9, 0xFA, 0xEC, 0xC3, 0xE5, 0xC3, 0x15, 0x70, 0x96,
        0x94, 0x66, 0x47, 0x75, 0xD3, 0xFB, 0xDA, 0x5A, 0x50, 0x4D,
        0x89, 0x34, 0x4D, 0xD9, 0x20, 0xC5, 0x56, 0x96, 0xE8, 0x91,
        0xD9, 0xAB, 0x62, 0x25, 0x98, 0xA9, 0xD6, 0xAB, 0x8F, 0xBF,
        0x35, 0xE4, 0x59, 0x9C, 0xAB, 0x7E, 0xB2, 0x2F, 0x95, 0x69,
        0x92, 0xF8, 0xAB, 0x2E, 0x65, 0x35, 0xDE, 0xCB, 0x6B, 0x57,
        0x6F, 0xA0, 0x67, 0x5F, 0x97, 0xC2, 0x3D, 0xD4, 0xC3, 0x74,
        0xA6, 0x6E, 0x6A, 0xF4, 0x19, 0xC9, 0xD2, 0x04, 0xD0, 0xB9,
        0xF9, 0x3C, 0x08, 0xD7, 0x89, 0xD6, 0x38, 0x05, 0x66, 0x0F,
        0xBB, 0x62, 0x9D, 0xF1, 0xB4, 0x88, 0xCF, 0xA1, 0xD7, 0xA1,
        0x3E, 0x9B, 0x72, 0x94, 0x37, 0xEE, 0xAF, 0xE7, 0x18, 0xEF,
        0xA8, 0x59, 0x34, 0x8B, 0xA0, 0xD7, 0x68, 0x12, 0xA9, 0x9F,
        0x31, 0xCD, 0x36, 0x4F, 0x2A, 0x4F, 0xD4, 0x2F]);
    pubKey6.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey6);

    var pubKey7 = new emv.PubKeyRsa();
    pubKey7.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x25]);
    pubKey7.index = 0x60;
    pubKey7.mod = 'A8EE74EDEF3C0DCA5102FF9B5707975FF67B60D64B5E7322D48DE9D3BB6153F63512A091B606DD8FD5F6A14588324EF8827844C7FFC0BAB2334AE5207770078B69CDC3F2C666CF69E28E16E1816714C4DF313BEF539CC01DA9DD2D6F47DE4F247C500B561C099166AD4FC16DF12DFB684AC48D35CDD2C47A13A86A5A162306F64E33B092AB74EDA71A4091D96E3DAA47';
    pubKey7.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey7);

    var pubKey8 = new emv.PubKeyRsa();
    pubKey8.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x25]);
    pubKey8.index = 0x61;
    pubKey8.mod = '86C7254665E17CE6934DF7D082569F208D1CC1AD8E9FB2FE23E3D7467BE50B4F874F906ADF2280EC9D204F6D10C037A23CE5FD8283C9ED47D1C669ABDD7C1CB356C70BCDC44E5C8AE231555F7B786AC9C3155BCD51F28EFBC1B33CC87277049219B2C890952736C4713487111678911D9F42E08074CF524E65D721D727F054E6B5E85EC92B3EB59FFEE926DD6C314DF555C94AD487A99B67CB7C7BA5E46A5B813DDB918B8E3E0423F4302A58686D1263C0BACA9E82068C493289E3E6936ECA5F9F77E06B0D6FBDA718818B835020098C671C5DD7E9B8E8E841D2DF32EE94A7F4748484CA44108AB241A5263BA1FF00D51360DDDC749D30A1';
    pubKey8.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey8);

    var pubKey9 = new emv.PubKeyRsa();
    pubKey9.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x04]);
    pubKey9.index = 0xFE;
    pubKey9.mod = new Buffer([0xE7, 0x63, 0x17, 0x96, 0x51, 0x75, 0xA0, 0x8B, 0xEE, 0x51, 0x0F, 0x58, 0x83, 0x0E, 0x87, 0xB2, 0x62, 0xC7, 0x0D, 0x52,
        0x98, 0x03, 0x24, 0x5F, 0xA8, 0xB8, 0x8E, 0x0C, 0x75, 0x35, 0x62, 0xDE, 0x7A, 0xEB, 0x5A, 0x9E, 0x3E, 0x6C, 0x1A, 0x98,
        0xE9, 0x4D, 0x8D, 0xB7, 0xC3, 0x14, 0x07, 0xDA, 0xC5, 0xD0, 0x71, 0xE0, 0x6B, 0x80, 0xB0, 0x9E, 0x14, 0x6F, 0x22, 0xDB,
        0x85, 0xF1, 0xD7, 0x2D, 0x1E, 0xA1, 0x8D, 0x22, 0x60, 0x00, 0x32, 0xC6, 0xDD, 0x40, 0xE3, 0x71, 0x4D, 0x5A, 0xDA, 0x7D,
        0xE9, 0xD7, 0xD0, 0x1E, 0x88, 0x39, 0x1F, 0x89, 0x31, 0x56, 0xD6, 0xF4, 0xBF, 0x13, 0xE9, 0x06, 0x35, 0x59, 0xDA, 0x07,
        0x86, 0xDE, 0x9B, 0xDE, 0x6B, 0x1C, 0x9B, 0x0B, 0xB9, 0x68, 0xED, 0xDE, 0x07, 0x14, 0x5A, 0xBF, 0x87, 0x7B, 0x93, 0x16,
        0x82, 0xCC, 0xB1, 0xFB, 0x80, 0x07, 0x28, 0x72, 0x4D, 0x04, 0xAF, 0x24, 0x1E, 0x28, 0x27, 0xE0, 0xFA, 0x1F, 0x62, 0x59,
        0x19, 0x14, 0xFF, 0x25]);
    pubKey9.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey9);

    var pubKey10 = new emv.PubKeyRsa();
    pubKey10.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x04]);
    pubKey10.index = 0xFC;
    pubKey10.mod = new Buffer([0xB3, 0x29, 0x6C, 0x91, 0xF4, 0x79, 0x5B, 0xD9, 0x71, 0x12, 0x60, 0x69, 0x03, 0x40, 0x7B, 0x6E, 0xFF, 0x3A, 0xB3, 0x92,
        0x46, 0xE9, 0x10, 0x95, 0xE5, 0x1D, 0x17, 0x86, 0x7D, 0xA4, 0xAD, 0xE5, 0x9A, 0x48, 0xBE, 0x2F, 0xE9, 0xB5, 0x27, 0x10,
        0x28, 0x3D, 0x3D, 0x32, 0x26, 0x0E, 0x2C, 0x7D, 0x24, 0x72, 0x14, 0xC5, 0x7D, 0x46, 0xAA, 0x64, 0x65, 0xE4, 0x7E, 0x0A,
        0x4B, 0x3F, 0xFA, 0xAD, 0x8A, 0x7F, 0x6A, 0x19, 0x07, 0x55, 0xBC, 0xCF, 0xE3, 0xF3, 0xFB, 0x39, 0x89, 0xA9, 0xF6, 0xB1,
        0xC9, 0xE1, 0x84, 0x5B, 0xCC, 0xCA, 0xD6, 0xF2, 0x0B, 0x1D, 0xAC, 0x60, 0x33, 0x60, 0x02, 0x34, 0xE8, 0x1D, 0xAC, 0x41,
        0x53, 0x21, 0x2B, 0x0F, 0x76, 0x0C, 0x23, 0x09, 0x91, 0x92, 0xAA, 0x6C, 0x4C, 0x90, 0x83, 0xBE, 0xFF, 0xD9, 0xA7, 0x9D,
        0x2A, 0x27, 0xB0, 0x8F, 0xEC, 0xC8, 0xE5, 0xD4, 0x37, 0xD6, 0xC6, 0x85, 0x50, 0xA8, 0x39, 0xB1, 0x29, 0x41, 0x51, 0xDA,
        0xBA, 0x9D, 0x9C, 0xB2, 0xF1, 0x60, 0xF6, 0x0F, 0x74, 0x92, 0x89, 0xF5, 0x00, 0xC8, 0xC7, 0xF3, 0x34, 0xBD, 0x20, 0xEB,
        0xAC, 0x4A, 0xB1, 0x09, 0xCF, 0x3C, 0x18, 0x2F, 0x1B, 0x78, 0x1C, 0x7C, 0x09, 0x7A, 0x79, 0x03, 0x53, 0x07, 0x46, 0xC4,
        0x49, 0xB9, 0x9E, 0x39, 0xE4, 0xDB, 0x64, 0x93, 0xDD, 0x2A, 0x02, 0xE3, 0x7C, 0x62, 0xAE, 0x8B, 0xC9, 0xA7, 0x47, 0x0E,
        0xCC, 0xCF, 0x8D, 0xC0, 0x6A, 0x18, 0xC3, 0x3C, 0xD2, 0x4B, 0x30, 0xD5, 0x6F, 0x25, 0xD2, 0x75, 0x5C, 0xE8, 0x2A, 0xA4,
        0xDE, 0x4D, 0x2E, 0xAE, 0xC0, 0x77, 0x50, 0xA0, 0x3D, 0xB7, 0x5E, 0xBD, 0x0D, 0x8E, 0xBC, 0x9F, 0x2A, 0x1D, 0x85, 0xA0,
        0xD2, 0x52, 0xEF, 0xF4, 0x03, 0x29, 0xBE, 0x05]);
    pubKey10.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey10);

    var pubKey11 = new emv.PubKeyRsa();
    pubKey11.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x04]);
    pubKey11.index = 0xFD;
    pubKey11.mod = new Buffer([0xC9, 0x48, 0x5D, 0xBE, 0xB5, 0xE4, 0x04, 0x15, 0xD1, 0xB3, 0x97, 0x52, 0x4F, 0x47, 0x68, 0x5F, 0x30, 0x6C, 0xFD, 0xC4,
        0x99, 0xD4, 0xE2, 0xE7, 0xD0, 0xCB, 0xAF, 0x22, 0x2C, 0xFA, 0x81, 0x84, 0xBD, 0x11, 0x1D, 0xAE, 0xED, 0xC9, 0xCC, 0x6E,
        0xC8, 0x54, 0x0C, 0x3F, 0x72, 0x71, 0xEA, 0x99, 0x90, 0x11, 0x9C, 0xC5, 0xC4, 0x31, 0x80, 0x50, 0x1D, 0x9F, 0x45, 0x25,
        0x2D, 0x68, 0x35, 0x05, 0x3F, 0xAE, 0x35, 0x69, 0x6A, 0xE8, 0xCD, 0x67, 0xA3, 0x25, 0x64, 0x74, 0x49, 0xCF, 0x5E, 0x59,
        0x4D, 0xA8, 0xF6, 0x27, 0x20, 0x9F, 0x7F, 0x03, 0xAE, 0x8D, 0x6D, 0xFC, 0x0D, 0xB3, 0xE7, 0x9E, 0x28, 0xE4, 0x15, 0xDF,
        0x29, 0xA5, 0xB5, 0x7D, 0x68, 0x14, 0x85, 0x6C, 0xC3, 0x0A, 0x96, 0xDA, 0x5B, 0x88, 0x90, 0x36, 0x3E, 0x50, 0x7F, 0xCB,
        0x2E, 0x28, 0x3D, 0xA1, 0xEB, 0xB5, 0xF1, 0x8E, 0x8E, 0x24, 0x10, 0x2B, 0x7D, 0x01, 0x92, 0xBB, 0x8E, 0x35, 0xA4, 0xF7,
        0xCD, 0x05, 0xA4, 0x35]);
    pubKey11.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey11);

    var pubKey12 = new emv.PubKeyRsa();
    pubKey12.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x04]);
    pubKey12.index = 0xFB;
    pubKey12.mod = new Buffer([0x9B, 0x17, 0x06, 0x03, 0xA4, 0x89, 0xC7, 0x54, 0x6C, 0x45, 0xDA, 0x57, 0xB8, 0xFF, 0xD1, 0xDB, 0x20, 0x61, 0x24, 0x0F,
        0x0E, 0x8C, 0x6D, 0x1F, 0x9A, 0xBD, 0xC6, 0xB2, 0x65, 0xAA, 0x89, 0x11, 0x91, 0x5C, 0x1A, 0x4E, 0xAB, 0xD8, 0xD0, 0xED,
        0x47, 0x55, 0xD1, 0xB9, 0x02, 0xBA, 0x06, 0xFE, 0x5A, 0x64, 0x5B, 0x78, 0x6C, 0xD2, 0x41, 0x29, 0x55, 0x17, 0xD4, 0x4E,
        0xF1, 0xA7, 0xC2, 0x5D, 0x75, 0xAF, 0xE0, 0xEB, 0x28, 0x06, 0x6E, 0x4D, 0x69, 0xFE, 0xE7, 0xAB, 0xAF, 0xDD, 0x5E, 0xEB,
        0x23, 0x0F, 0x14, 0xE4, 0x02, 0xC9, 0x84, 0x08, 0x25, 0xFA, 0x77, 0xEA, 0xD1, 0x2B, 0x5F, 0x1C, 0x54, 0x94, 0x70, 0x1D,
        0xE1, 0x89, 0x7F, 0x65, 0xFE, 0x6B, 0xF1, 0x06, 0xD4, 0x75, 0x45, 0xEB, 0xF7, 0x0C, 0xE7, 0xC1, 0x58, 0x06, 0x8C, 0x61,
        0xF0, 0x77, 0x35, 0x34, 0xDB, 0x74, 0x2A, 0xB8, 0x3C, 0x28, 0x03, 0x8C, 0x14, 0x94, 0xF1, 0x59, 0x05, 0xD0, 0xAD, 0x17,
        0xCF, 0x1B, 0xD3, 0x8D]);
    pubKey12.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey12);

    var pubKey13 = new emv.PubKeyRsa();
    pubKey13.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x04]);
    pubKey13.index = 0xFA;
    pubKey13.mod = new Buffer([
        0xA9, 0x0F, 0xCD, 0x55, 0xAA, 0x2D, 0x5D, 0x99, 0x63, 0xE3, 0x5E, 0xD0, 0xF4, 0x40, 0x17, 0x76, 0x99, 0x83, 0x2F, 0x49,
        0xC6, 0xBA, 0xB1, 0x5C, 0xDA, 0xE5, 0x79, 0x4B, 0xE9, 0x3F, 0x93, 0x4D, 0x44, 0x62, 0xD5, 0xD1, 0x27, 0x62, 0xE4, 0x8C,
        0x38, 0xBA, 0x83, 0xD8, 0x44, 0x5D, 0xEA, 0xA7, 0x41, 0x95, 0xA3, 0x01, 0xA1, 0x02, 0xB2, 0xF1, 0x14, 0xEA, 0xDA, 0x0D,
        0x18, 0x0E, 0xE5, 0xE7, 0xA5, 0xC7, 0x3E, 0x0C, 0x4E, 0x11, 0xF6, 0x7A, 0x43, 0xDD, 0xAB, 0x5D, 0x55, 0x68, 0x3B, 0x14,
        0x74, 0xCC, 0x06, 0x27, 0xF4, 0x4B, 0x8D, 0x30, 0x88, 0xA4, 0x92, 0xFF, 0xAA, 0xDA, 0xD4, 0xF4, 0x24, 0x22, 0xD0, 0xE7,
        0x01, 0x35, 0x36, 0xC3, 0xC4, 0x9A, 0xD3, 0xD0, 0xFA, 0xE9, 0x64, 0x59, 0xB0, 0xF6, 0xB1, 0xB6, 0x05, 0x65, 0x38, 0xA3,
        0xD6, 0xD4, 0x46, 0x40, 0xF9, 0x44, 0x67, 0xB1, 0x08, 0x86, 0x7D, 0xEC, 0x40, 0xFA, 0xAE, 0xCD, 0x74, 0x0C, 0x00, 0xE2,
        0xB7, 0xA8, 0x85, 0x2D]);
    pubKey13.exponent = new Buffer([0x03]);
    pubKeys.push(pubKey13);

    var pubKey14 = new emv.PubKeyRsa();
    pubKey14.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x04]);
    pubKey14.index = 0xFF;
    pubKey14.mod = new Buffer([0xF6, 0x9D, 0xBB, 0x5E, 0x15, 0x98, 0x3E, 0xAE, 0x3C, 0xCF, 0x31, 0xCF, 0x4E, 0x47, 0x09, 0x8C, 0x2F, 0xC1, 0x6F, 0x97,
        0xA0, 0xC7, 0x10, 0xF8, 0x47, 0x77, 0xEF, 0xA9, 0x96, 0x22, 0xD8, 0x65, 0x02, 0xB1, 0x38, 0x72, 0x8A, 0xB1, 0x2E, 0x34,
        0x81, 0xA8, 0x4D, 0x20, 0xE0, 0x14, 0xAD, 0x2D, 0x63, 0x4D, 0x28, 0x36, 0xF2, 0x7F, 0x29, 0x49, 0x24, 0xB8, 0x95, 0xA8,
        0x7F, 0x91, 0xF8, 0x1B, 0x81, 0x69, 0xD4, 0xDF, 0xDA, 0xD8, 0xD7, 0xCB, 0xD7, 0x41, 0x80, 0x4C, 0xD6, 0x1B, 0x46, 0x7C,
        0x7A, 0x9A, 0xCF, 0xEC, 0xEB, 0x71, 0x18, 0x8C, 0xAA, 0x73, 0xA9, 0x07, 0x54, 0x76, 0x99, 0xD4, 0x5C, 0x9C, 0x7D, 0x20,
        0x98, 0xAC, 0x29, 0x66, 0x26, 0x64, 0x17, 0xF6, 0x65, 0xA4, 0x6B, 0xDD, 0x01, 0x2C, 0x09, 0x7D, 0xBD, 0x33, 0xD1, 0xD1,
        0x1A, 0xFF, 0x6E, 0xC8, 0xA9, 0xC0, 0xAD, 0x81, 0x4A, 0x65, 0xB4, 0x82, 0x62, 0xCA, 0x01, 0x16, 0x36, 0x07, 0x9A, 0x32,
        0x8C, 0x1A, 0xAE, 0xB7]);
    pubKey14.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey14);

    var pubKey15 = new emv.PubKeyRsa();
    pubKey15.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x04]);
    pubKey15.index = 0xF3;
    pubKey15.mod = new Buffer([0x98, 0xF0, 0xC7, 0x70, 0xF2, 0x38, 0x64, 0xC2, 0xE7, 0x66, 0xDF, 0x02, 0xD1, 0xE8, 0x33, 0xDF,
        0xF4, 0xFF, 0xE9, 0x2D, 0x69, 0x6E, 0x16, 0x42, 0xF0, 0xA8, 0x8C, 0x56, 0x94, 0xC6, 0x47, 0x9D,
        0x16, 0xDB, 0x15, 0x37, 0xBF, 0xE2, 0x9E, 0x4F, 0xDC, 0x6E, 0x6E, 0x8A, 0xFD, 0x1B, 0x0E, 0xB7,
        0xEA, 0x01, 0x24, 0x72, 0x3C, 0x33, 0x31, 0x79, 0xBF, 0x19, 0xE9, 0x3F, 0x10, 0x65, 0x8B, 0x2F,
        0x77, 0x6E, 0x82, 0x9E, 0x87, 0xDA, 0xED, 0xA9, 0xC9, 0x4A, 0x8B, 0x33, 0x82, 0x19, 0x9A, 0x35,
        0x0C, 0x07, 0x79, 0x77, 0xC9, 0x7A, 0xFF, 0x08, 0xFD, 0x11, 0x31, 0x0A, 0xC9, 0x50, 0xA7, 0x2C,
        0x3C, 0xA5, 0x00, 0x2E, 0xF5, 0x13, 0xFC, 0xCC, 0x28, 0x6E, 0x64, 0x6E, 0x3C, 0x53, 0x87, 0x53,
        0x5D, 0x50, 0x95, 0x14, 0xB3, 0xB3, 0x26, 0xE1, 0x23, 0x4F, 0x9C, 0xB4, 0x8C, 0x36, 0xDD, 0xD4,
        0x4B, 0x41, 0x6D, 0x23, 0x65, 0x40, 0x34, 0xA6, 0x6F, 0x40, 0x3B, 0xA5, 0x11, 0xC5, 0xEF, 0xA3]);
    pubKey15.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey15);

    var pubKey16 = new emv.PubKeyRsa();
    pubKey16.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey16.index = 0x99;
    pubKey16.mod = 'AB79FCC9520896967E776E64444E5DCDD6E13611874F3985722520425295EEA4BD0C2781DE7F31CD3D041F565F747306EED62954B17EDABA3A6C5B85A1DE1BEB9A34141AF38FCF8279C9DEA0D5A6710D08DB4124F041945587E20359BAB47B7575AD94262D4B25F264AF33DEDCF28E09615E937DE32EDC03C54445FE7E382777';
    pubKey16.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey16.hash = '4ABFFD6B1C51212D05552E431C5B17007D2F5E6D';
    pubKeys.push(pubKey16);

    var pubKey17 = new emv.PubKeyRsa();
    pubKey17.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey17.index = 0x95;
    pubKey17.mod = 'BE9E1FA5E9A803852999C4AB432DB28600DCD9DAB76DFAAA47355A0FE37B1508AC6BF38860D3C6C2E5B12A3CAAF2A7005A7241EBAA7771112C74CF9A0634652FBCA0E5980C54A64761EA101A114E0F0B5572ADD57D010B7C9C887E104CA4EE1272DA66D997B9A90B5A6D624AB6C57E73C8F919000EB5F684898EF8C3DBEFB330C62660BED88EA78E909AFF05F6DA627B';
    pubKey17.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey17.hash = 'EE1511CEC71020A9B90443B37B1D5F6E703030F6';
    pubKeys.push(pubKey17);

    var pubKey18 = new emv.PubKeyRsa();
    pubKey18.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey18.index = 0x92;
    pubKey18.mod = '996AF56F569187D09293C14810450ED8EE3357397B18A2458EFAA92DA3B6DF6514EC060195318FD43BE9B8F0CC669E3F844057CBDDF8BDA191BB64473BC8DC9A730DB8F6B4EDE3924186FFD9B8C7735789C23A36BA0B8AF65372EB57EA5D89E7D14E9C7B6B557460F10885DA16AC923F15AF3758F0F03EBD3C5C2C949CBA306DB44E6A2C076C5F67E281D7EF56785DC4D75945E491F01918800A9E2DC66F60080566CE0DAF8D17EAD46AD8E30A247C9F';
    pubKey18.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey18.hash = '429C954A3859CEF91295F663C963E582ED6EB253';
    pubKeys.push(pubKey18);

    var pubKey19 = new emv.PubKeyRsa();
    pubKey19.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey19.index = 0x09;
    pubKey19.mod = '9D912248DE0A4E39C1A7DDE3F6D2588992C1A4095AFBD1824D1BA74847F2BC4926D2EFD904B4B54954CD189A54C5D1179654F8F9B0D2AB5F0357EB642FEDA95D3912C6576945FAB897E7062CAA44A4AA06B8FE6E3DBA18AF6AE3738E30429EE9BE03427C9D64F695FA8CAB4BFE376853EA34AD1D76BFCAD15908C077FFE6DC5521ECEF5D278A96E26F57359FFAEDA19434B937F1AD999DC5C41EB11935B44C18100E857F431A4A5A6BB65114F174C2D7B59FDF237D6BB1DD0916E644D709DED56481477C75D95CDD68254615F7740EC07F330AC5D67BCD75BF23D28A140826C026DBDE971A37CD3EF9B8DF644AC385010501EFC6509D7A41';
    pubKey19.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey19.hash = '1FF80A40173F52D7D27E0F26A146A1C8CCB29046';
    pubKeys.push(pubKey19);

    var pubKey20 = new emv.PubKeyRsa();
    pubKey20.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey20.index = 0x08;
    pubKey20.mod = 'D9FD6ED75D51D0E30664BD157023EAA1FFA871E4DA65672B863D255E81E137A51DE4F72BCC9E44ACE12127F87E263D3AF9DD9CF35CA4A7B01E907000BA85D24954C2FCA3074825DDD4C0C8F186CB020F683E02F2DEAD3969133F06F7845166ACEB57CA0FC2603445469811D293BFEFBAFAB57631B3DD91E796BF850A25012F1AE38F05AA5C4D6D03B1DC2E568612785938BBC9B3CD3A910C1DA55A5A9218ACE0F7A21287752682F15832A678D6E1ED0B';
    pubKey20.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey20.hash = '20D213126955DE205ADC2FD2822BD22DE21CF9A8';
    pubKeys.push(pubKey20);

    var pubKey21 = new emv.PubKeyRsa();
    pubKey21.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey21.index = 0x07;
    pubKey21.mod = 'A89F25A56FA6DA258C8CA8B40427D927B4A1EB4D7EA326BBB12F97DED70AE5E4480FC9C5E8A972177110A1CC318D06D2F8F5C4844AC5FA79A4DC470BB11ED635699C17081B90F1B984F12E92C1C529276D8AF8EC7F28492097D8CD5BECEA16FE4088F6CFAB4A1B42328A1B996F9278B0B7E3311CA5EF856C2F888474B83612A82E4E00D0CD4069A6783140433D50725F';
    pubKey21.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey21.hash = 'B4BC56CC4E88324932CBC643D6898F6FE593B172';
    pubKeys.push(pubKey21);

    var pubKey22 = new emv.PubKeyRsa();
    pubKey22.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey22.index = 0x01;
    pubKey22.mod = 'C696034213D7D8546984579D1D0F0EA519CFF8DEFFC429354CF3A871A6F7183F1228DA5C7470C055387100CB935A712C4E2864DF5D64BA93FE7E63E71F25B1E5F5298575EBE1C63AA617706917911DC2A75AC28B251C7EF40F2365912490B939BCA2124A30A28F54402C34AECA331AB67E1E79B285DD5771B5D9FF79EA630B75';
    pubKey22.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey22.hash = 'D34A6A776011C7E7CE3AEC5F03AD2F8CFC5503CC';
    pubKeys.push(pubKey22);

    var pubKey23 = new emv.PubKeyRsa();
    pubKey23.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey23.index = 0x50;
    pubKey23.mod = new Buffer([0xD1, 0x11, 0x97, 0x59, 0x00, 0x57, 0xB8, 0x41, 0x96, 0xC2, 0xF4, 0xD1, 0x1A, 0x8F, 0x3C, 0x05, 0x40, 0x8F, 0x42, 0x2A,
        0x35, 0xD7, 0x02, 0xF9, 0x01, 0x06, 0xEA, 0x5B, 0x01, 0x9B, 0xB2, 0x8A, 0xE6, 0x07, 0xAA, 0x9C, 0xDE, 0xBC, 0xD0, 0xD8,
        0x1A, 0x38, 0xD4, 0x8C, 0x7E, 0xBB, 0x00, 0x62, 0xD2, 0x87, 0x36, 0x9E, 0xC0, 0xC4, 0x21, 0x24, 0x24, 0x6A, 0xC3, 0x0D,
        0x80, 0xCD, 0x60, 0x2A, 0xB7, 0x23, 0x8D, 0x51, 0x08, 0x4D, 0xED, 0x46, 0x98, 0x16, 0x2C, 0x59, 0xD2, 0x5E, 0xAC, 0x1E,
        0x66, 0x25, 0x5B, 0x4D, 0xB2, 0x35, 0x25, 0x26, 0xEF, 0x09, 0x82, 0xC3, 0xB8, 0xAD, 0x3D, 0x1C, 0xCE, 0x85, 0xB0, 0x1D,
        0xB5, 0x78, 0x8E, 0x75, 0xE0, 0x9F, 0x44, 0xBE, 0x73, 0x61, 0x36, 0x6D, 0xEF, 0x9D, 0x1E, 0x13, 0x17, 0xB0, 0x5E, 0x5D,
        0x0F, 0xF5, 0x29, 0x0F, 0x88, 0xA0, 0xDB, 0x47]);
    pubKey23.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey23);

    var pubKey24 = new emv.PubKeyRsa();
    pubKey24.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey24.index = 0x51;
    pubKey24.mod = new Buffer([0xDB, 0x5F, 0xA2, 0x9D, 0x1F, 0xDA, 0x8C, 0x16, 0x34, 0xB0, 0x4D, 0xCC, 0xFF, 0x14, 0x8A, 0xBE, 0xE6, 0x3C, 0x77, 0x20,
        0x35, 0xC7, 0x98, 0x51, 0xD3, 0x51, 0x21, 0x07, 0x58, 0x6E, 0x02, 0xA9, 0x17, 0xF7, 0xC7, 0xE8, 0x85, 0xE7, 0xC4, 0xA7,
        0xD5, 0x29, 0x71, 0x0A, 0x14, 0x53, 0x34, 0xCE, 0x67, 0xDC, 0x41, 0x2C, 0xB1, 0x59, 0x7B, 0x77, 0xAA, 0x25, 0x43, 0xB9,
        0x8D, 0x19, 0xCF, 0x2C, 0xB8, 0x0C, 0x52, 0x2B, 0xDB, 0xEA, 0x0F, 0x1B, 0x11, 0x3F, 0xA2, 0xC8, 0x62, 0x16, 0xC8, 0xC6,
        0x10, 0xA2, 0xD5, 0x8F, 0x29, 0xCF, 0x33, 0x55, 0xCE, 0xB1, 0xBD, 0x3E, 0xF4, 0x10, 0xD1, 0xED, 0xD1, 0xF7, 0xAE, 0x0F,
        0x16, 0x89, 0x79, 0x79, 0xDE, 0x28, 0xC6, 0xEF, 0x29, 0x3E, 0x0A, 0x19, 0x28, 0x2B, 0xD1, 0xD7, 0x93, 0xF1, 0x33, 0x15,
        0x23, 0xFC, 0x71, 0xA2, 0x28, 0x80, 0x04, 0x68, 0xC0, 0x1A, 0x36, 0x53, 0xD1, 0x4C, 0x6B, 0x48, 0x51, 0xA5, 0xC0, 0x29,
        0x47, 0x8E, 0x75, 0x7F]);
    pubKey24.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey24.hash = 'B9D248075A3F23B522FE45573E04374DC4995D71';
    pubKeys.push(pubKey24);

    var pubKey25 = new emv.PubKeyRsa();
    pubKey25.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey25.index = 0x53;
    pubKey25.mod = new Buffer([0xBC, 0xD8, 0x37, 0x21, 0xBE, 0x52, 0xCC, 0xCC, 0x4B, 0x64, 0x57, 0x32, 0x1F, 0x22, 0xA7, 0xDC, 0x76, 0x9F, 0x54, 0xEB,
        0x80, 0x25, 0x91, 0x3B, 0xE8, 0x04, 0xD9, 0xEA, 0xBB, 0xFA, 0x19, 0xB3, 0xD7, 0xC5, 0xD3, 0xCA, 0x65, 0x8D, 0x76, 0x8C,
        0xAF, 0x57, 0x06, 0x7E, 0xEC, 0x83, 0xC7, 0xE6, 0xE9, 0xF8, 0x1D, 0x05, 0x86, 0x70, 0x3E, 0xD9, 0xDD, 0xDA, 0xDD, 0x20,
        0x67, 0x5D, 0x63, 0x42, 0x49, 0x80, 0xB1, 0x0E, 0xB3, 0x64, 0xE8, 0x1E, 0xB3, 0x7D, 0xB4, 0x0E, 0xD1, 0x00, 0x34, 0x4C,
        0x92, 0x88, 0x86, 0xFF, 0x4C, 0xCC, 0x37, 0x20, 0x3E, 0xE6, 0x10, 0x6D, 0x5B, 0x59, 0xD1, 0xAC, 0x10, 0x2E, 0x2C, 0xD2,
        0xD7, 0xAC, 0x17, 0xF4, 0xD9, 0x6C, 0x39, 0x8E, 0x5F, 0xD9, 0x93, 0xEC, 0xB4, 0xFF, 0xDF, 0x79, 0xB1, 0x75, 0x47, 0xFF,
        0x9F, 0xA2, 0xAA, 0x8E, 0xEF, 0xD6, 0xCB, 0xDA, 0x12, 0x4C, 0xBB, 0x17, 0xA0, 0xF8, 0x52, 0x81, 0x46, 0x38, 0x71, 0x35,
        0xE2, 0x26, 0xB0, 0x05, 0xA4, 0x74, 0xB9, 0x06, 0x2F, 0xF2, 0x64, 0xD2, 0xFF, 0x8E, 0xFA, 0x36, 0x81, 0x4A, 0xA2, 0x95,
        0x00, 0x65, 0xB1, 0xB0, 0x4C, 0x0A, 0x1A, 0xE9, 0xB2, 0xF6, 0x9D, 0x4A, 0x4A, 0xA9, 0x79, 0xD6, 0xCE, 0x95, 0xFE, 0xE9,
        0x48, 0x5E, 0xD0, 0xA0, 0x3A, 0xEE, 0x9B, 0xD9, 0x53, 0xE8, 0x1C, 0xFD, 0x1E, 0xF6, 0xE8, 0x14, 0xDF, 0xD3, 0xC2, 0xCE,
        0x37, 0xAE, 0xFA, 0x38, 0xC1, 0xF9, 0x87, 0x73, 0x71, 0xE9, 0x1D, 0x6A, 0x5E, 0xB5, 0x9F, 0xDE, 0xDF, 0x75, 0xD3, 0x32,
        0x5F, 0xA3, 0xCA, 0x66, 0xCD, 0xFB, 0xA0, 0xE5, 0x71, 0x46, 0xCC, 0x78, 0x98, 0x18, 0xFF, 0x06, 0xBE, 0x5F, 0xCC, 0x50,
        0xAB, 0xD3, 0x62, 0xAE, 0x4B, 0x80, 0x99, 0x6D]);
    pubKey25.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey25);

    var pubKey26 = new emv.PubKeyRsa();
    pubKey26.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey26.index = 0x54;
    pubKey26.mod = new Buffer([0xC6, 0xDD, 0xC0, 0xB7, 0x64, 0x5F, 0x7F, 0x16, 0x28, 0x6A, 0xB7, 0xE4, 0x11, 0x66, 0x55, 0xF5,
        0x6D, 0xD0, 0xC9, 0x44, 0x76, 0x60, 0x40, 0xDC, 0x68, 0x66, 0x4D, 0xD9, 0x73, 0xBD, 0x3B, 0xFD,
        0x4C, 0x52, 0x5B, 0xCB, 0xB9, 0x52, 0x72, 0xB6, 0xB3, 0xAD, 0x9B, 0xA8, 0x86, 0x03, 0x03, 0xAD,
        0x08, 0xD9, 0xE8, 0xCC, 0x34, 0x4A, 0x40, 0x70, 0xF4, 0xCF, 0xB9, 0xEE, 0xAF, 0x29, 0xC8, 0xA3,
        0x46, 0x08, 0x50, 0xC2, 0x64, 0xCD, 0xA3, 0x9B, 0xBE, 0x3A, 0x7E, 0x7D, 0x08, 0xA6, 0x9C, 0x31,
        0xB5, 0xC8, 0xDD, 0x9F, 0x94, 0xDD, 0xBC, 0x92, 0x65, 0x75, 0x8C, 0x0E, 0x73, 0x99, 0xAD, 0xCF,
        0x43, 0x62, 0xCA, 0xEE, 0x45, 0x8D, 0x41, 0x4C, 0x52, 0xB4, 0x98, 0x27, 0x48, 0x81, 0xB1, 0x96,
        0xDA, 0xCC, 0xA7, 0x27, 0x3F, 0x68, 0x7F, 0x2A, 0x65, 0xFA, 0xEB, 0x80, 0x9D, 0x4B, 0x2A, 0xC1,
        0xD3, 0xD1, 0xEF, 0xB4, 0xF6, 0x49, 0x03, 0x22, 0x31, 0x8B, 0xD2, 0x96, 0xD1, 0x53, 0xB3, 0x07,
        0xA3, 0x28, 0x3A, 0xB4, 0xE5, 0xBE, 0x6E, 0xBD, 0x91, 0x03, 0x59, 0xA8, 0x56, 0x5E, 0xB9, 0xC4,
        0x36, 0x0D, 0x24, 0xBA, 0xAC, 0xA3, 0xDB, 0xFE, 0x39, 0x3F, 0x3D, 0x6C, 0x83, 0x0D, 0x60, 0x3C,
        0x6F, 0xC1, 0xE8, 0x34, 0x09, 0xDF, 0xCD, 0x80, 0xD3, 0xA3, 0x3B, 0xA2, 0x43, 0x81, 0x3B, 0xBB,
        0x4C, 0xEA, 0xF9, 0xCB, 0xAB, 0x6B, 0x74, 0xB0, 0x01, 0x16, 0xF7, 0x2A, 0xB2, 0x78, 0xA8, 0x8A,
        0x01, 0x1D, 0x70, 0x07, 0x1E, 0x06, 0xCA, 0xB1, 0x40, 0x64, 0x64, 0x38, 0xD9, 0x86, 0xD4, 0x82,
        0x81, 0x62, 0x4B, 0x85, 0xB3, 0xB2, 0xEB, 0xB9, 0xA6, 0xAB, 0x3B, 0xF2, 0x17, 0x8F, 0xCC, 0x30,
        0x11, 0xE7, 0xCA, 0xF2, 0x48, 0x97, 0xAE, 0x7D]);
    pubKey26.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey26);

    var pubKey27 = new emv.PubKeyRsa();
    pubKey27.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey27.index = 0x96;
    pubKey27.mod = new Buffer([0xB7, 0x45, 0x86, 0xD1, 0x9A, 0x20, 0x7B, 0xE6, 0x62, 0x7C, 0x5B, 0x0A, 0xAF, 0xBC, 0x44, 0xA2, 0xEC, 0xF5, 0xA2, 0x94, 0x2D, 0x3A, 0x26,
        0xCE, 0x19, 0xC4, 0xFF, 0xAE, 0xEE, 0x92, 0x05, 0x21, 0x86, 0x89, 0x22, 0xE8, 0x93, 0xE7, 0x83, 0x82, 0x25, 0xA3, 0x94, 0x7A, 0x26, 0x14,
        0x79, 0x6F, 0xB2, 0xC0, 0x62, 0x8C, 0xE8, 0xC1, 0x1E, 0x38, 0x25, 0xA5, 0x6D, 0x3B, 0x1B, 0xBA, 0xEF, 0x78, 0x3A, 0x5C, 0x6A, 0x81, 0xF3,
        0x6F, 0x86, 0x25, 0x39, 0x51, 0x26, 0xFA, 0x98, 0x3C, 0x52, 0x16, 0xD3, 0x16, 0x6D, 0x48, 0xAC, 0xDE, 0x8A, 0x43, 0x12, 0x12, 0xFF, 0x76,
        0x3A, 0x7F, 0x79, 0xD9, 0xED, 0xB7, 0xFE, 0xD7, 0x6B, 0x48, 0x5D, 0xE4, 0x5B, 0xEB, 0x82, 0x9A, 0x3D, 0x47, 0x30, 0x84, 0x8A, 0x36, 0x6D,
        0x33, 0x24, 0xC3, 0x02, 0x70, 0x32, 0xFF, 0x8D, 0x16, 0xA1, 0xE4, 0x4D, 0x8D]);
    pubKey27.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey27);

    var pubKey28 = new emv.PubKeyRsa();
    pubKey28.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey28.index = 0x57;
    pubKey28.mod = new Buffer([0x94, 0x2B, 0x7F, 0x2B, 0xA5, 0xEA, 0x30, 0x73, 0x12, 0xB6, 0x3D, 0xF7, 0x7C, 0x52, 0x43, 0x61,
        0x8A, 0xCC, 0x20, 0x02, 0xBD, 0x7E, 0xCB, 0x74, 0xD8, 0x21, 0xFE, 0x7B, 0xDC, 0x78, 0xBF, 0x28,
        0xF4, 0x9F, 0x74, 0x19, 0x0A, 0xD9, 0xB2, 0x3B, 0x97, 0x13, 0xB1, 0x40, 0xFF, 0xEC, 0x1F, 0xB4,
        0x29, 0xD9, 0x3F, 0x56, 0xBD, 0xC7, 0xAD, 0xE4, 0xAC, 0x07, 0x5D, 0x75, 0x53, 0x2C, 0x1E, 0x59,
        0x0B, 0x21, 0x87, 0x4C, 0x79, 0x52, 0xF2, 0x9B, 0x8C, 0x0F, 0x0C, 0x1C, 0xE3, 0xAE, 0xED, 0xC8,
        0xDA, 0x25, 0x34, 0x31, 0x23, 0xE7, 0x1D, 0xCF, 0x86, 0xC6, 0x99, 0x8E, 0x15, 0xF7, 0x56, 0xE3]);
    pubKey28.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey28);

    var pubKey29 = new emv.PubKeyRsa();
    pubKey29.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey29.index = 0x58;
    pubKey29.mod = new Buffer([0x99, 0x55, 0x2C, 0x4A, 0x1E, 0xCD, 0x68, 0xA0, 0x26, 0x01, 0x57, 0xFC, 0x41, 0x51, 0xB5, 0x99,
        0x28, 0x37, 0x44, 0x5D, 0x3F, 0xC5, 0x73, 0x65, 0xCA, 0x56, 0x92, 0xC8, 0x7B, 0xE3, 0x58, 0xCD,
        0xCD, 0xF2, 0xC9, 0x2F, 0xB6, 0x83, 0x75, 0x22, 0x84, 0x2A, 0x48, 0xEB, 0x11, 0xCD, 0xFF, 0xE2,
        0xFD, 0x91, 0x77, 0x0C, 0x72, 0x21, 0xE4, 0xAF, 0x62, 0x07, 0xC2, 0xDE, 0x40, 0x04, 0xC7, 0xDE,
        0xE1, 0xB6, 0x27, 0x6D, 0xC6, 0x2D, 0x52, 0xA8, 0x7D, 0x2C, 0xD0, 0x1F, 0xBF, 0x2D, 0xC4, 0x06,
        0x5D, 0xB5, 0x28, 0x24, 0xD2, 0xA2, 0x16, 0x7A, 0x06, 0xD1, 0x9E, 0x6A, 0x0F, 0x78, 0x10, 0x71,
        0xCD, 0xB2, 0xDD, 0x31, 0x4C, 0xB9, 0x44, 0x41, 0xD8, 0xDC, 0x0E, 0x93, 0x63, 0x17, 0xB7, 0x7B,
        0xF0, 0x6F, 0x51, 0x77, 0xF6, 0xC5, 0xAB, 0xA3, 0xA3, 0xBC, 0x6A, 0xA3, 0x02, 0x09, 0xC9, 0x72,
        0x60, 0xB7, 0xA1, 0xAD, 0x3A, 0x19, 0x2C, 0x9B, 0x8C, 0xD1, 0xD1, 0x53, 0x57, 0x0A, 0xFC, 0xC8,
        0x7C, 0x3C, 0xD6, 0x81, 0xD1, 0x3E, 0x99, 0x7F, 0xE3, 0x3B, 0x39, 0x63, 0xA0, 0xA1, 0xC7, 0x97,
        0x72, 0xAC, 0xF9, 0x91, 0x03, 0x3E, 0x1B, 0x83, 0x97, 0xAD, 0x03, 0x41, 0x50, 0x0E, 0x48, 0xA2,
        0x47, 0x70, 0xBC, 0x4C, 0xBE, 0x19, 0xD2, 0xCC, 0xF4, 0x19, 0x50, 0x4F, 0xDB, 0xF0, 0x38, 0x9B,
        0xC2, 0xF2, 0xFD, 0xCD, 0x4D, 0x44, 0xE6, 0x1F]);
    pubKey29.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey29);

    var pubKey30 = new emv.PubKeyRsa();
    pubKey30.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey30.index = 0x94;
    pubKey30.mod = new Buffer([0xD1, 0xBE, 0x39, 0x61, 0x5F, 0x39, 0x5A, 0xC9, 0x33, 0x7E, 0x33, 0x07, 0xAA, 0x5A, 0x7A, 0xC3, 0x5E, 0xAE, 0x00, 0x36, 0xBF, 0x20, 0xB9,
        0x2F, 0x9A, 0x45, 0xD1, 0x90, 0xB2, 0xF4, 0x61, 0x6A, 0xBF, 0x9D, 0x34, 0x0C, 0xBF, 0x5F, 0xBB, 0x3A, 0x2B, 0x94, 0xBD, 0x8F, 0x2F, 0x97,
        0x7C, 0x0A, 0x10, 0xB9, 0x0E, 0x59, 0xD4, 0x20, 0x1A, 0xA3, 0x26, 0x69, 0xE8, 0xCB, 0xE7, 0x53, 0xF5, 0x36, 0x11, 0x9D, 0xF4, 0xFB, 0x5E,
        0x63, 0xCE, 0xD8, 0x7F, 0x11, 0x53, 0xCE, 0x91, 0x4B, 0x12, 0x4F,
        0x3E, 0x6B, 0x64, 0x8C, 0xD5, 0xC9, 0x76, 0x55, 0xF7, 0xAB, 0x4D, 0xF6, 0x26, 0x07, 0xC9, 0x5D, 0xA5, 0x05, 0x17, 0xAB, 0x8B, 0xE3, 0x83,
        0x66, 0x72, 0xD1, 0xC7, 0x1B, 0xCD, 0xE9, 0xBA, 0x72, 0x93, 0xFF, 0x34, 0x82, 0xF1, 0x24, 0xF8, 0x66, 0x91, 0x13, 0x0A, 0xB0, 0x81, 0x77,
        0xB0, 0x2F, 0x45, 0x9C, 0x02, 0x5A, 0x1F, 0x3D, 0xFF, 0xE0, 0x88, 0x4C, 0xE7, 0x81, 0x22, 0x54, 0x2E, 0xA1, 0xC8, 0xEA, 0x09, 0x2B, 0x55,
        0x2B, 0x58, 0x69, 0x07, 0xC8, 0x3A, 0xD6, 0x5E, 0x0C, 0x6F, 0x91,
        0xA4, 0x00, 0xE4, 0x85, 0xE1, 0x11, 0x92, 0xAA, 0x4C, 0x17, 0x1C, 0x5A, 0x1E, 0xF5, 0x63, 0x81, 0xF4, 0xD0, 0x91, 0xCC, 0x7E, 0xF6, 0xBD,
        0x86, 0x04, 0xCB, 0xC4, 0xC7, 0x4D, 0x5D, 0x77, 0xFF, 0xA0, 0x7B, 0x64, 0x1D, 0x53, 0x99, 0x8C, 0xDB, 0x5C, 0x21, 0xB7, 0xBC, 0x65, 0xE0,
        0x82, 0xA6, 0x51, 0x3F, 0x42, 0x4A, 0x4B, 0x25, 0x2E, 0x0D, 0x77, 0xFA, 0x40, 0x56, 0x98, 0x6A, 0x0A, 0xB0, 0xCD, 0xA6, 0x15, 0x5E, 0xD9,
        0xA8, 0x83, 0xC6, 0x9C, 0xC2, 0x99, 0x2D, 0x49, 0xEC, 0xBD, 0x47,
        0x97, 0xDD, 0x28, 0x64, 0xFF, 0xC9, 0x6B, 0x8D]);
    pubKey30.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey30);

    var pubKey31 = new emv.PubKeyRsa();
    pubKey31.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x03]);
    pubKey31.index = 0x97;
    pubKey31.mod = new Buffer([0xAF, 0x07, 0x54, 0xEA, 0xED, 0x97, 0x70, 0x43, 0xAB, 0x6F, 0x41, 0xD6, 0x31, 0x2A, 0xB1, 0xE2, 0x2A, 0x68, 0x09, 0x17, 0x5B, 0xEB, 0x28,
        0xE7, 0x0D, 0x5F, 0x99, 0xB2, 0xDF, 0x18, 0xCA, 0xE7, 0x35, 0x19, 0x34, 0x1B, 0xBB, 0xD3, 0x27, 0xD0,
        0xB8, 0xBE, 0x9D, 0x4D, 0x0E, 0x15, 0xF0, 0x7D, 0x36, 0xEA, 0x3E, 0x3A, 0x05, 0xC8, 0x92, 0xF5, 0xB1, 0x9A, 0x3E, 0x9D, 0x34, 0x13, 0xB0,
        0xD9, 0x7E, 0x7A, 0xD1, 0x0A, 0x5F, 0x5D, 0xE8, 0xE3, 0x88, 0x60, 0xC0, 0xAD, 0x00, 0x4B, 0x1E, 0x06, 0xF4, 0x04, 0x0C, 0x29, 0x5A, 0xCB,
        0x45, 0x7A, 0x78, 0x85, 0x51, 0xB6, 0x12, 0x7C, 0x0B, 0x29]);
    pubKey31.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey31);

    var pubKey31 = new emv.PubKeyRsa();
    pubKey31.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x65]);
    pubKey31.index = 0x02;
    pubKey31.mod = new Buffer([0xBB, 0x7F, 0x51, 0x98, 0x3F, 0xD8, 0x70, 0x7F, 0xD6, 0x22, 0x7C, 0x23, 0xDE, 0xF5, 0xD5, 0x37,
        0x7A, 0x5A, 0x73, 0x7C, 0xEF, 0x3C, 0x52, 0x52, 0xE5, 0x78, 0xEF, 0xE1, 0x36, 0xDF, 0x87, 0xB5,
        0x04, 0x73, 0xF9, 0x34, 0x1F, 0x16, 0x40, 0xC8, 0xD2, 0x58, 0x03, 0x4E, 0x14, 0xC1, 0x69, 0x93,
        0xFC, 0xE6, 0xC6, 0xB8, 0xC3, 0xCE, 0xEB, 0x65, 0xFC, 0x8F, 0xBC, 0xD8, 0xEB, 0x77, 0xB3, 0xB0,
        0x5A, 0xC7, 0xC4, 0xD0, 0x9E, 0x0F, 0xA1, 0xBA, 0x2E, 0xFE, 0x87, 0xD3, 0x18, 0x4D, 0xB6, 0x71,
        0x8A, 0xE4, 0x1A, 0x7C, 0xAD, 0x89, 0xB8, 0xDC, 0xE0, 0xFE, 0x80, 0xCE, 0xB5, 0x23, 0xD5, 0xD6,
        0x47, 0xF9, 0xDB, 0x58, 0xA3, 0x1D, 0x2E, 0x71, 0xAC, 0x67, 0x7E, 0x67, 0xFA, 0x6E, 0x75, 0x82,
        0x07, 0x36, 0xC9, 0x89, 0x37, 0x61, 0xEE, 0x4A, 0xCD, 0x11, 0xF3, 0x1D, 0xBD, 0xC3, 0x49, 0xEF]);
    pubKey31.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey31);

    var pubKey32 = new emv.PubKeyRsa();
    pubKey32.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x65]);
    pubKey32.index = 0x03;
    pubKey32.mod = new Buffer([0xC9, 0xE6, 0xC1, 0xF3, 0xC6, 0x94, 0x9A, 0x8A, 0x42, 0xA9,
        0x1F, 0x8D, 0x02, 0x24, 0x13, 0x2B, 0x28, 0x65, 0xE6, 0xD9,
        0x53, 0xA5, 0xB5, 0xA5, 0x4C, 0xFF, 0xB0, 0x41, 0x24, 0x39,
        0xD5, 0x4A, 0xEB, 0xA7, 0x9E, 0x9B, 0x39, 0x9A, 0x6C, 0x10,
        0x46, 0x84, 0xDF, 0x3F, 0xB7, 0x27, 0xC7, 0xF5, 0x59, 0x84,
        0xDB, 0x7A, 0x45, 0x0E, 0x6A, 0xA9, 0x17, 0xE1, 0x10, 0xA7,
        0xF2, 0x34, 0x3A, 0x00, 0x24, 0xD2, 0x78, 0x5D, 0x9E, 0xBE,
        0x09, 0xF6, 0x01, 0xD5, 0x92, 0x36, 0x2F, 0xDB, 0x23, 0x77,
        0x00, 0xB5, 0x67, 0xBA, 0x14, 0xBB, 0xE2, 0xA6, 0xD3, 0xD2,
        0x3C, 0xF1, 0x27, 0x0B, 0x3D, 0xD8, 0x22, 0xB5, 0x49, 0x65,
        0x49, 0xBF, 0x88, 0x49, 0x48, 0xF5, 0x5A, 0x0D, 0x30, 0x83,
        0x48, 0xC4, 0xB7, 0x23, 0xBA, 0xFB, 0x6A, 0x7F, 0x39, 0x75,
        0xAC, 0x39, 0x7C, 0xAD, 0x3C, 0x5D, 0x0F, 0xC2, 0xD1, 0x78,
        0x71, 0x6F, 0x5E, 0x8E, 0x79, 0xE7, 0x5B, 0xEB, 0x1C, 0x84,
        0xFA, 0x20, 0x2F, 0x80, 0xE6, 0x80, 0x69, 0xA9, 0x84, 0xE0,
        0x08, 0x70, 0x6B, 0x30, 0xC2, 0x12, 0x30, 0x54, 0x56, 0x20,
        0x15, 0x40, 0x78, 0x79, 0x25, 0xE8, 0x6A, 0x8B, 0x28, 0xB1,
        0x29, 0xA1, 0x1A, 0xF2, 0x04, 0xB3, 0x87, 0xCB, 0x6E, 0xE4,
        0x3D, 0xB5, 0x3D, 0x15, 0xA4, 0x6E, 0x13, 0x90, 0x1B, 0xEB,
        0xD5, 0xCE, 0xCF, 0x48, 0x54, 0x25, 0x1D, 0x9E, 0x98, 0x75,
        0xB1, 0x6E, 0x82, 0xAD, 0x1C, 0x59, 0x38, 0xA9, 0x72, 0x84,
        0x2C, 0x8F, 0x1A, 0x42, 0xEB, 0xB5, 0xAE, 0x53, 0x36, 0xB0,
        0x4F, 0xF3, 0xDA, 0x8B, 0x8D, 0xFB, 0xE6, 0x06, 0xFC, 0xA8,
        0xB9, 0x08, 0x4E, 0xE0, 0x5B, 0xF6, 0x79, 0x50, 0xBA, 0x89,
        0x89, 0x7C, 0xD0, 0x89, 0xF9, 0x24, 0xDB, 0xCD]);
    pubKey32.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey32);

    var pubKey33 = new emv.PubKeyRsa();
    pubKey33.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey33.index = 0x02;
    pubKey33.mod = new Buffer([0xA3, 0x76, 0x7A, 0xBD, 0x1B, 0x6A, 0xA6, 0x9D, 0x7F, 0x3F, 0xBF, 0x28, 0xC0, 0x92, 0xDE, 0x9E, 0xD1, 0xE6, 0x58, 0xBA,
        0x5F, 0x09, 0x09, 0xAF, 0x7A, 0x1C, 0xCD, 0x90, 0x73, 0x73, 0xB7, 0x21, 0x0F, 0xDE, 0xB1, 0x62, 0x87, 0xBA, 0x8E, 0x78,
        0xE1, 0x52, 0x9F, 0x44, 0x39, 0x76, 0xFD, 0x27, 0xF9, 0x91, 0xEC, 0x67, 0xD9, 0x5E, 0x5F, 0x4E, 0x96, 0xB1, 0x27, 0xCA,
        0xB2, 0x39, 0x6A, 0x94, 0xD6, 0xE4, 0x5C, 0xDA, 0x44, 0xCA, 0x4C, 0x48, 0x67, 0x57, 0x0D, 0x6B, 0x07, 0x54, 0x2F, 0x8D,
        0x4B, 0xF9, 0xFF, 0x97, 0x97, 0x5D, 0xB9, 0x89, 0x15, 0x15, 0xE6, 0x6F, 0x52, 0x5D, 0x2B, 0x3C, 0xBE, 0xB6, 0xD6, 0x62,
        0xBF, 0xB6, 0xC3, 0xF3, 0x38, 0xE9, 0x3B, 0x02, 0x14, 0x2B, 0xFC, 0x44, 0x17, 0x3A, 0x37, 0x64, 0xC5, 0x6A, 0xAD, 0xD2,
        0x02, 0x07, 0x5B, 0x26, 0xDC, 0x2F, 0x9F, 0x7D, 0x7A, 0xE7, 0x4B, 0xD7, 0xD0, 0x0F, 0xD0, 0x5E, 0xE4, 0x30, 0x03, 0x26,
        0x63, 0xD2, 0x7A, 0x57]);
    pubKey33.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey33);

    var pubKey34 = new emv.PubKeyRsa();
    pubKey34.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey34.index = 0x03;
    pubKey34.mod = new Buffer([0xB0, 0x62, 0x7D, 0xEE, 0x87, 0x86, 0x4F, 0x9C, 0x18, 0xC1, 0x3B, 0x9A, 0x1F, 0x02, 0x54, 0x48, 0xBF, 0x13, 0xC5, 0x83,
        0x80, 0xC9, 0x1F, 0x4C, 0xEB, 0xA9, 0xF9, 0xBC, 0xB2, 0x14, 0xFF, 0x84, 0x14, 0xE9, 0xB5, 0x9D, 0x6A, 0xBA, 0x10, 0xF9,
        0x41, 0xC7, 0x33, 0x17, 0x68, 0xF4, 0x7B, 0x21, 0x27, 0x90, 0x7D, 0x85, 0x7F, 0xA3, 0x9A, 0xAF, 0x8C, 0xE0, 0x20, 0x45,
        0xDD, 0x01, 0x61, 0x9D, 0x68, 0x9E, 0xE7, 0x31, 0xC5, 0x51, 0x15, 0x9B, 0xE7, 0xEB, 0x2D, 0x51, 0xA3, 0x72, 0xFF, 0x56,
        0xB5, 0x56, 0xE5, 0xCB, 0x2F, 0xDE, 0x36, 0xE2, 0x30, 0x73, 0xA4, 0x4C, 0xA2, 0x15, 0xD6, 0xC2, 0x6C, 0xA6, 0x88, 0x47,
        0xB3, 0x88, 0xE3, 0x95, 0x20, 0xE0, 0x02, 0x6E, 0x62, 0x29, 0x4B, 0x55, 0x7D, 0x64, 0x70, 0x44, 0x0C, 0xA0, 0xAE, 0xFC,
        0x94, 0x38, 0xC9, 0x23, 0xAE, 0xC9, 0xB2, 0x09, 0x8D, 0x6D, 0x3A, 0x1A, 0xF5, 0xE8, 0xB1, 0xDE, 0x36, 0xF4, 0xB5, 0x30,
        0x40, 0x10, 0x9D, 0x89, 0xB7, 0x7C, 0xAF, 0xAF, 0x70, 0xC2, 0x6C, 0x60, 0x1A, 0xBD, 0xF5, 0x9E, 0xEC, 0x0F, 0xDC, 0x8A,
        0x99, 0x08, 0x91, 0x40, 0xCD, 0x2E, 0x81, 0x7E, 0x33, 0x51, 0x75, 0xB0, 0x3B, 0x7A, 0xA3, 0x3D]);
    pubKey34.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey34);

    var pubKey35 = new emv.PubKeyRsa();
    pubKey35.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey35.index = 0x05;
    pubKey35.mod = '97CF8BAD30CAE0F9A89285454DDDE967AAFBCD4BC0B78F29ECB1005286F15F6D7532A9C476607C73FF7424316DFC741894AA52EDBAF909719C7B53448343B45CF2F00A8ABFB78CEEBE848933AAED97DBE84F0730F34FB1AA1528D3D6EC75B73252A30D0C717518BE36458ADD0FBF854C65497F3F54084154B60F51561361EE8E85F742A54005524CB00FEBC334276E0E63DAD86C079A9A3DF5DD32BECADE1AB2B71F5F0A0E95A4000D01F1044A578AAD92E9FDE92E3C6AA3DCD4913DFA5552537E7DE75E241FAED455D76CB8FCAFEED3FD6DAB24D7A9C32852F866C751D7710F494A0DF11B67FAECDD87A9A4E2CC44F6F27E46E3C0CCCD0F';
    pubKey34.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey35);

    var pubKey36 = new emv.PubKeyRsa();
    pubKey36.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey36.index = 0x08;
    pubKey36.mod = new Buffer([0xB6, 0x16, 0x45, 0xED, 0xFD, 0x54, 0x98, 0xFB, 0x24, 0x64, 0x44, 0x03, 0x7A, 0x0F, 0xA1, 0x8C,
        0x0F, 0x10, 0x1E, 0xBD, 0x8E, 0xFA, 0x54, 0x57, 0x3C, 0xE6, 0xE6, 0xA7, 0xFB, 0xF6, 0x3E, 0xD2,
        0x1D, 0x66, 0x34, 0x08, 0x52, 0xB0, 0x21, 0x1C, 0xF5, 0xEE, 0xF6, 0xA1, 0xCD, 0x98, 0x9F, 0x66,
        0xAF, 0x21, 0xA8, 0xEB, 0x19, 0xDB, 0xD8, 0xDB, 0xC3, 0x70, 0x6D, 0x13, 0x53, 0x63, 0xA0, 0xD6,
        0x83, 0xD0, 0x46, 0x30, 0x4F, 0x5A, 0x83, 0x6B, 0xC1, 0xBC, 0x63, 0x28, 0x21, 0xAF, 0xE7, 0xA2,
        0xF7, 0x5D, 0xA3, 0xC5, 0x0A, 0xC7, 0x4C, 0x54, 0x5A, 0x75, 0x45, 0x62, 0x20, 0x41, 0x37, 0x16,
        0x96, 0x63, 0xCF, 0xCC, 0x0B, 0x06, 0xE6, 0x7E, 0x21, 0x09, 0xEB, 0xA4, 0x1B, 0xC6, 0x7F, 0xF2,
        0x0C, 0xC8, 0xAC, 0x80, 0xD7, 0xB6, 0xEE, 0x1A, 0x95, 0x46, 0x5B, 0x3B, 0x26, 0x57, 0x53, 0x3E,
        0xA5, 0x6D, 0x92, 0xD5, 0x39, 0xE5, 0x06, 0x43, 0x60, 0xEA, 0x48, 0x50, 0xFE, 0xD2, 0xD1, 0xBF]);
    pubKey36.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey36);

    var pubKey37 = new emv.PubKeyRsa();
    pubKey37.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey37.index = 0x80;
    pubKey37.mod = new Buffer([0xCC, 0xDB, 0xA6, 0x86, 0xE2, 0xEF, 0xB8, 0x4C, 0xE2, 0xEA, 0x01, 0x20, 0x9E, 0xEB, 0x53, 0xBE,
        0xF2, 0x1A, 0xB6, 0xD3, 0x53, 0x27, 0x4F, 0xF8, 0x39, 0x1D, 0x70, 0x35, 0xD7, 0x6E, 0x21, 0x56,
        0xCA, 0xED, 0xD0, 0x75, 0x10, 0xE0, 0x7D, 0xAF, 0xCA, 0xCA, 0xBB, 0x7C, 0xCB, 0x09, 0x50, 0xBA,
        0x2F, 0x0A, 0x3C, 0xEC, 0x31, 0x3C, 0x52, 0xEE, 0x6C, 0xD0, 0x9E, 0xF0, 0x04, 0x01, 0xA3, 0xD6,
        0xCC, 0x5F, 0x68, 0xCA, 0x5F, 0xCD, 0x0A, 0xC6, 0x13, 0x21, 0x41, 0xFA, 0xFD, 0x1C, 0xFA, 0x36,
        0xA2, 0x69, 0x2D, 0x02, 0xDD, 0xC2, 0x7E, 0xDA, 0x4C, 0xD5, 0xBE, 0xA6, 0xFF, 0x21, 0x91, 0x3B,
        0x51, 0x3C, 0xE7, 0x8B, 0xF3, 0x3E, 0x68, 0x77, 0xAA, 0x5B, 0x60, 0x5B, 0xC6, 0x9A, 0x53, 0x4F,
        0x37, 0x77, 0xCB, 0xED, 0x63, 0x76, 0xBA, 0x64, 0x9C, 0x72, 0x51, 0x6A, 0x7E, 0x16, 0xAF, 0x85]);
    pubKey37.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey37);


    var pubKey38 = new emv.PubKeyRsa();
    pubKey38.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey38.index = 0x61;
    pubKey38.mod = '834D2A387C5A5F176EF3E66CAAF83F194B15AAD2470C78C77D6EB38EDAE3A2F9BA1623F6A58C892CC925632DFF48CE954B21A53E1F1E4366BE403C279B90027CBC72605DB6C79049B8992CB4912EFA270BECAB3A7CEFE05BFA46E4C7BBCF7C7A173BD988D989B32CB79FAC8E35FBE1860E7EA9F238A92A3593552D03D1E38601';
    pubKey38.exponent = new Buffer([0x03]);
    pubKey38.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey38);

    var pubKey39 = new emv.PubKeyRsa();
    pubKey39.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey39.index = 0x62;
    pubKey39.mod = 'B5CDD1E5368819FC3EA65B80C68117BBC29F9096EBD217269B583B0745E0C16433D54B8EF387B1E6CDDAED4923C39E370E5CADFE041773023A6BC0A033B0031B0048F18AC159773CB6695EE99F551F414883FB05E52640E893F4816082241D7BFA3640960003AD7517895C50E184AA956367B7BFFC6D8616A7B57E2D447AB3E1';
    pubKey39.exponent = new Buffer([0x01, 0x00, 0x01]);
    pubKey39.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey39);

    var pubKey40 = new emv.PubKeyRsa();
    pubKey40.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey40.index = 0x63;
    pubKey40.mod = '867ECA26A57472DEFB6CA94289312BA39C63052518DC480B6ED491ACC37C028846F4D7B79AFAEEFA07FB011DAA46C06021E932D501BF52F2834ADE3AC7689E94B248B28F3FE2803669DEDA000988DA1249F9A891558A05A1E5A7BD2C282FE18D204189A9994D4ADD86C0CE50952ED8BCEC0CE633679188285E51E1BED840FCBFC10953939AF49DB90048912E48B44181';
    pubKey40.exponent = new Buffer([0x03]);
    pubKey40.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey40);

    var pubKey41 = new emv.PubKeyRsa();
    pubKey41.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey41.index = 0x64;
    pubKey41.mod = '91123ECF0230E3CB245C88DDFA3EE57BC58ED00B367B3875FCB79548872680F601E8C839AC0721BAB3B89ED21607281C8919BF726266EAB848502AD874B5107A4E654EF6D37773343F461435C86E4A8F866FB18C7CBA497B426290C38D196E2AFF33C0906F9296F297E156DC602A5E653CA1168F1109261114BF7BE8127A3E8007191830134299395CE2B322228667B76E072EB7FD5D0FB3A83E8AD1D7F6FD81';
    pubKey41.exponent = new Buffer([0x03]);
    pubKey41.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey41);

    var pubKey42 = new emv.PubKeyRsa();
    pubKey42.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey42.index = 0x65;
    pubKey42.mod = '81BA1E6B9F671CFC848CA2ACD8E17AF406B4D329D1ECA5D01BC094A87C30AF49867944C632E8185074655FA535AD8CA42A83B41AAAEA859F432FA0B818E72DC07ED3F77FB318A475A261C0760A156E5DDC157AE8B79BA72D89D69FFF754619E928F1516A2A72C0F86B09B8EA25F86DC5A48EBC5A16F83FBA8FC4E3A98278912249F4E079BCBC06E7BED9AED397879D279ED91925394901260949BCCE6FA1169798A2715DAE32988BEFBE9621AE15E0C1';
    pubKey42.exponent = new Buffer([0x01, 0x00, 0x01]);
    pubKey42.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey42);

    var pubKey43 = new emv.PubKeyRsa();
    pubKey43.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey43.index = 0x66;
    pubKey43.mod = '7F5A3945794D6B15F5F26B4A21A63A5EF35540D8C8C099151F2279780A5C18A317703C98632E804D25576A7B460C05061E03975E50FBD7495B3ADC8E425E53DF76FA40B035E87F69ABF8765A52523F3B1A39B19528B002239015FADBA5921051';
    pubKey43.exponent = new Buffer([0x01, 0x00, 0x01]);
    pubKey43.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey43);

    var pubKey44 = new emv.PubKeySm();
    pubKey44.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey44.index = 0x57;
    pubKey44.mod = 'E8105E77861FD2EB727C84E36D3D4A5666BD0ADCE8781F0145D3D82D72B92748E22D5404C6C41F3EC8B790DE2F61CF29FAECB168C79F5C8666762D53CC26A460';
    pubKey44.expDate = '20201231';
    pubKeys.push(pubKey44);

    var pubKey45 = new emv.PubKeySm();
    pubKey45.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey45.index = 0x58;
    pubKey45.mod = 'FFC2B1513320C275411DBADD2188203F7B62519F8C7BA98EF8AA9FD6D2E475984E383C3E12784B42B066960EEA0C8FC8099E14128055D67A666CCA5A058C26A4';
    pubKey45.expDate = '20201231';
    pubKeys.push(pubKey45);

    var pubKey46 = new emv.PubKeyRsa();
    pubKey46.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey46.index = 0x85;
    pubKey46.mod = 'C9242EC6030F10E5225E722AA17D9DC894299233AEC3219B950D4F243AF530FA13E3A31AFAA0D4BF4DE562B6B4C3108AEBBC6CB080F90770D532F241BC153641E1BF72F9DC1B08933B9BF77403F6A0FB5777BAA4C9BE91574BBBFB521342A20386790512221F477FBC53FF1B6533A015815435410EC272F0A34EA0735C43967D7E46FBA766EC00CED59B6715E3412D6FB8A934BF9D1497A24A6252C52D7586FD66A450FB5D2B4484EC923061439622BC0535316CD4231C13C627BF4D2EDE102C802464658F1B9D7FF23A3698510FA90D0C3164942FB359255CD823CB2635B3F167FBDFC900641B970D602A2771A7F4F94DF6D34BE8BBBB2669012D';
    pubKey46.exponent = new Buffer([0x03]);
    pubKey46.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey46);

    var pubKey47 = new emv.PubKeyRsa();
    pubKey47.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey47.index = 0x84;
    pubKey47.mod = 'F9EA5503CFE43038596C720645A94E0154793DE73AE5A935D1FB9D0FE77286B61261E3BB1D3DFEC547449992E2037C01FF4EFB88DA8A82F30FEA3198D5D1675247A1626E9CFFB4CD9E31399990E43FCA77C744A93685A260A20E6A607F3EE3FAE2ABBE99678C9F19DFD2D8EA76789239D13369D7D2D56AF3F2793068950B5B808C462571662D4364B30A2582959DB238333BADACB442F9516B5C336C8A613FE014B7D773581AE10FDF7BDB2669012D';
    pubKey47.exponent = new Buffer([0x03]);
    pubKey47.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey47);

    var pubKey48 = new emv.PubKeyRsa();
    pubKey48.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey48.index = 0xC0;
    pubKey48.mod = 'C7CDB6F2A3FE80A8834CDDDD326E1082AA2288F47C464D57B34718193431711A44119148055044CFE3313708BED0C98E1C589B0F53CF6D7E829FCD906D21A90FD4CB6BAF13110C4685107C27E00981DB29DC0AC186E6D701577F23865626244E1F9B2CD1DDFCB9E899B41F5084D8CCC178A7C3F4546CF93187106FAB055A7AC67DF62E778CB88823BA58CF7546C2B09F';
    pubKey48.exponent = new Buffer([0x01, 0x00, 0x01]);
    pubKey48.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey48);

    var pubKey49 = new emv.PubKeyRsa();
    pubKey49.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey49.index = 0xC1;
    pubKey49.mod = '92F083CBE46F8DCC0C04E498BA9952BA9D4C09C80DD277E579F07E45772846FA43DD3AB31CC6B08DD18695715949FB108E53A071D393A7FDDBF9C5FB0B0507138797317480FC48D633ED38B401A451443AD7F15FACDA45A62ABE24FF6343ADD0909EA8389348E54E26F842880D1A69F9214368BA30C18DE5C5E0CB9253B5ABC55FB6EF0A738D927494A30BBF82E340285363B6FAA15673829DBB210E710DA58EE9E578E7CE55DC812AB7D6DCCE0E3B1AE179D664F3356EB951E3C91A1CBBF6A7CA8D0C7EC9C6AF7A4941C5051099B9784E56C9162067B8C3B15C5FA4480A645CD2526A69C80BA8EF361BE2AA9417DEFCE35B62B0C9CF097D';
    pubKey49.exponent = new Buffer([0x01, 0x00, 0x01]);
    pubKey49.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey49);

    var pubKey50 = new emv.PubKeyRsa();
    pubKey50.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey50.index = 0x87;
    pubKey50.mod = new Buffer([0x94, 0x2B, 0x7F, 0x2B, 0xA5, 0xEA, 0x30, 0x73, 0x12, 0xB6, 0x3D, 0xF7, 0x7C, 0x52, 0x43, 0x61,
        0x8A, 0xCC, 0x20, 0x02, 0xBD, 0x7E, 0xCB, 0x74, 0xD8, 0x21, 0xFE, 0x7B, 0xDC, 0x78, 0xBF, 0x28,
        0xF4, 0x9F, 0x74, 0x19, 0x0A, 0xD9, 0xB2, 0x3B, 0x97, 0x13, 0xB1, 0x40, 0xFF, 0xEC, 0x1F, 0xB4,
        0x29, 0xD9, 0x3F, 0x56, 0xBD, 0xC7, 0xAD, 0xE4, 0xAC, 0x07, 0x5D, 0x75, 0x53, 0x2C, 0x1E, 0x59,
        0x0B, 0x21, 0x87, 0x4C, 0x79, 0x52, 0xF2, 0x9B, 0x8C, 0x0F, 0x0C, 0x1C, 0xE3, 0xAE, 0xED, 0xC8,
        0xDA, 0x25, 0x34, 0x31, 0x23, 0xE7, 0x1D, 0xCF, 0x86, 0xC6, 0x99, 0x8E, 0x15, 0xF7, 0x56, 0xE3]);
    pubKey50.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey50);

    var pubKey51 = new emv.PubKeyRsa();
    pubKey51.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey51.index = 0x88;
    pubKey51.mod = new Buffer([0x99, 0x55, 0x2C, 0x4A, 0x1E, 0xCD, 0x68, 0xA0, 0x26, 0x01, 0x57, 0xFC, 0x41, 0x51, 0xB5, 0x99,
        0x28, 0x37, 0x44, 0x5D, 0x3F, 0xC5, 0x73, 0x65, 0xCA, 0x56, 0x92, 0xC8, 0x7B, 0xE3, 0x58, 0xCD,
        0xCD, 0xF2, 0xC9, 0x2F, 0xB6, 0x83, 0x75, 0x22, 0x84, 0x2A, 0x48, 0xEB, 0x11, 0xCD, 0xFF, 0xE2,
        0xFD, 0x91, 0x77, 0x0C, 0x72, 0x21, 0xE4, 0xAF, 0x62, 0x07, 0xC2, 0xDE, 0x40, 0x04, 0xC7, 0xDE,
        0xE1, 0xB6, 0x27, 0x6D, 0xC6, 0x2D, 0x52, 0xA8, 0x7D, 0x2C, 0xD0, 0x1F, 0xBF, 0x2D, 0xC4, 0x06,
        0x5D, 0xB5, 0x28, 0x24, 0xD2, 0xA2, 0x16, 0x7A, 0x06, 0xD1, 0x9E, 0x6A, 0x0F, 0x78, 0x10, 0x71,
        0xCD, 0xB2, 0xDD, 0x31, 0x4C, 0xB9, 0x44, 0x41, 0xD8, 0xDC, 0x0E, 0x93, 0x63, 0x17, 0xB7, 0x7B,
        0xF0, 0x6F, 0x51, 0x77, 0xF6, 0xC5, 0xAB, 0xA3, 0xA3, 0xBC, 0x6A, 0xA3, 0x02, 0x09, 0xC9, 0x72,
        0x60, 0xB7, 0xA1, 0xAD, 0x3A, 0x19, 0x2C, 0x9B, 0x8C, 0xD1, 0xD1, 0x53, 0x57, 0x0A, 0xFC, 0xC8,
        0x7C, 0x3C, 0xD6, 0x81, 0xD1, 0x3E, 0x99, 0x7F, 0xE3, 0x3B, 0x39, 0x63, 0xA0, 0xA1, 0xC7, 0x97,
        0x72, 0xAC, 0xF9, 0x91, 0x03, 0x3E, 0x1B, 0x83, 0x97, 0xAD, 0x03, 0x41, 0x50, 0x0E, 0x48, 0xA2,
        0x47, 0x70, 0xBC, 0x4C, 0xBE, 0x19, 0xD2, 0xCC, 0xF4, 0x19, 0x50, 0x4F, 0xDB, 0xF0, 0x38, 0x9B,
        0xC2, 0xF2, 0xFD, 0xCD, 0x4D, 0x44, 0xE6, 0x1F]);
    pubKey51.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey51);

    var pubKey52 = new emv.PubKeyRsa();
    pubKey52.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey52.index = 0x53;
    pubKey52.mod = new Buffer([0xBC, 0xD8, 0x37, 0x21, 0xBE, 0x52, 0xCC, 0xCC, 0x4B, 0x64, 0x57, 0x32, 0x1F, 0x22, 0xA7, 0xDC, 0x76, 0x9F, 0x54, 0xEB,
        0x80, 0x25, 0x91, 0x3B, 0xE8, 0x04, 0xD9, 0xEA, 0xBB, 0xFA, 0x19, 0xB3, 0xD7, 0xC5, 0xD3, 0xCA, 0x65, 0x8D, 0x76, 0x8C,
        0xAF, 0x57, 0x06, 0x7E, 0xEC, 0x83, 0xC7, 0xE6, 0xE9, 0xF8, 0x1D, 0x05, 0x86, 0x70, 0x3E, 0xD9, 0xDD, 0xDA, 0xDD, 0x20,
        0x67, 0x5D, 0x63, 0x42, 0x49, 0x80, 0xB1, 0x0E, 0xB3, 0x64, 0xE8, 0x1E, 0xB3, 0x7D, 0xB4, 0x0E, 0xD1, 0x00, 0x34, 0x4C,
        0x92, 0x88, 0x86, 0xFF, 0x4C, 0xCC, 0x37, 0x20, 0x3E, 0xE6, 0x10, 0x6D, 0x5B, 0x59, 0xD1, 0xAC, 0x10, 0x2E, 0x2C, 0xD2,
        0xD7, 0xAC, 0x17, 0xF4, 0xD9, 0x6C, 0x39, 0x8E, 0x5F, 0xD9, 0x93, 0xEC, 0xB4, 0xFF, 0xDF, 0x79, 0xB1, 0x75, 0x47, 0xFF,
        0x9F, 0xA2, 0xAA, 0x8E, 0xEF, 0xD6, 0xCB, 0xDA, 0x12, 0x4C, 0xBB, 0x17, 0xA0, 0xF8, 0x52, 0x81, 0x46, 0x38, 0x71, 0x35,
        0xE2, 0x26, 0xB0, 0x05, 0xA4, 0x74, 0xB9, 0x06, 0x2F, 0xF2, 0x64, 0xD2, 0xFF, 0x8E, 0xFA, 0x36, 0x81, 0x4A, 0xA2, 0x95,
        0x00, 0x65, 0xB1, 0xB0, 0x4C, 0x0A, 0x1A, 0xE9, 0xB2, 0xF6, 0x9D, 0x4A, 0x4A, 0xA9, 0x79, 0xD6, 0xCE, 0x95, 0xFE, 0xE9,
        0x48, 0x5E, 0xD0, 0xA0, 0x3A, 0xEE, 0x9B, 0xD9, 0x53, 0xE8, 0x1C, 0xFD, 0x1E, 0xF6, 0xE8, 0x14, 0xDF, 0xD3, 0xC2, 0xCE,
        0x37, 0xAE, 0xFA, 0x38, 0xC1, 0xF9, 0x87, 0x73, 0x71, 0xE9, 0x1D, 0x6A, 0x5E, 0xB5, 0x9F, 0xDE, 0xDF, 0x75, 0xD3, 0x32,
        0x5F, 0xA3, 0xCA, 0x66, 0xCD, 0xFB, 0xA0, 0xE5, 0x71, 0x46, 0xCC, 0x78, 0x98, 0x18, 0xFF, 0x06, 0xBE, 0x5F, 0xCC, 0x50,
        0xAB, 0xD3, 0x62, 0xAE, 0x4B, 0x80, 0x99, 0x6D]);
    pubKey52.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey52);

    var pubKey53 = new emv.PubKeyRsa();
    pubKey53.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey53.index = 0x54;
    pubKey53.mod = new Buffer([0xC6, 0xDD, 0xC0, 0xB7, 0x64, 0x5F, 0x7F, 0x16, 0x28, 0x6A, 0xB7, 0xE4, 0x11, 0x66, 0x55, 0xF5,
        0x6D, 0xD0, 0xC9, 0x44, 0x76, 0x60, 0x40, 0xDC, 0x68, 0x66, 0x4D, 0xD9, 0x73, 0xBD, 0x3B, 0xFD,
        0x4C, 0x52, 0x5B, 0xCB, 0xB9, 0x52, 0x72, 0xB6, 0xB3, 0xAD, 0x9B, 0xA8, 0x86, 0x03, 0x03, 0xAD,
        0x08, 0xD9, 0xE8, 0xCC, 0x34, 0x4A, 0x40, 0x70, 0xF4, 0xCF, 0xB9, 0xEE, 0xAF, 0x29, 0xC8, 0xA3,
        0x46, 0x08, 0x50, 0xC2, 0x64, 0xCD, 0xA3, 0x9B, 0xBE, 0x3A, 0x7E, 0x7D, 0x08, 0xA6, 0x9C, 0x31,
        0xB5, 0xC8, 0xDD, 0x9F, 0x94, 0xDD, 0xBC, 0x92, 0x65, 0x75, 0x8C, 0x0E, 0x73, 0x99, 0xAD, 0xCF,
        0x43, 0x62, 0xCA, 0xEE, 0x45, 0x8D, 0x41, 0x4C, 0x52, 0xB4, 0x98, 0x27, 0x48, 0x81, 0xB1, 0x96,
        0xDA, 0xCC, 0xA7, 0x27, 0x3F, 0x68, 0x7F, 0x2A, 0x65, 0xFA, 0xEB, 0x80, 0x9D, 0x4B, 0x2A, 0xC1,
        0xD3, 0xD1, 0xEF, 0xB4, 0xF6, 0x49, 0x03, 0x22, 0x31, 0x8B, 0xD2, 0x96, 0xD1, 0x53, 0xB3, 0x07,
        0xA3, 0x28, 0x3A, 0xB4, 0xE5, 0xBE, 0x6E, 0xBD, 0x91, 0x03, 0x59, 0xA8, 0x56, 0x5E, 0xB9, 0xC4,
        0x36, 0x0D, 0x24, 0xBA, 0xAC, 0xA3, 0xDB, 0xFE, 0x39, 0x3F, 0x3D, 0x6C, 0x83, 0x0D, 0x60, 0x3C,
        0x6F, 0xC1, 0xE8, 0x34, 0x09, 0xDF, 0xCD, 0x80, 0xD3, 0xA3, 0x3B, 0xA2, 0x43, 0x81, 0x3B, 0xBB,
        0x4C, 0xEA, 0xF9, 0xCB, 0xAB, 0x6B, 0x74, 0xB0, 0x01, 0x16, 0xF7, 0x2A, 0xB2, 0x78, 0xA8, 0x8A,
        0x01, 0x1D, 0x70, 0x07, 0x1E, 0x06, 0xCA, 0xB1, 0x40, 0x64, 0x64, 0x38, 0xD9, 0x86, 0xD4, 0x82,
        0x81, 0x62, 0x4B, 0x85, 0xB3, 0xB2, 0xEB, 0xB9, 0xA6, 0xAB, 0x3B, 0xF2, 0x17, 0x8F, 0xCC, 0x30,
        0x11, 0xE7, 0xCA, 0xF2, 0x48, 0x97, 0xAE, 0x7D]);
    pubKey53.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey53);

    var pubKey54 = new emv.PubKeyRsa();
    pubKey54.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey54.index = 0x96;
    pubKey54.mod = new Buffer([0xB7, 0x45, 0x86, 0xD1, 0x9A, 0x20, 0x7B, 0xE6, 0x62, 0x7C, 0x5B, 0x0A, 0xAF, 0xBC, 0x44, 0xA2, 0xEC, 0xF5, 0xA2, 0x94, 0x2D, 0x3A, 0x26,
        0xCE, 0x19, 0xC4, 0xFF, 0xAE, 0xEE, 0x92, 0x05, 0x21, 0x86, 0x89, 0x22, 0xE8, 0x93, 0xE7, 0x83, 0x82, 0x25, 0xA3, 0x94, 0x7A, 0x26, 0x14,
        0x79, 0x6F, 0xB2, 0xC0, 0x62, 0x8C, 0xE8, 0xC1, 0x1E, 0x38, 0x25, 0xA5, 0x6D, 0x3B, 0x1B, 0xBA, 0xEF, 0x78, 0x3A, 0x5C, 0x6A, 0x81, 0xF3,
        0x6F, 0x86, 0x25, 0x39, 0x51, 0x26, 0xFA, 0x98, 0x3C, 0x52, 0x16, 0xD3, 0x16, 0x6D, 0x48, 0xAC, 0xDE, 0x8A, 0x43, 0x12, 0x12, 0xFF, 0x76,
        0x3A, 0x7F, 0x79, 0xD9, 0xED, 0xB7, 0xFE, 0xD7, 0x6B, 0x48, 0x5D, 0xE4, 0x5B, 0xEB, 0x82, 0x9A, 0x3D, 0x47, 0x30, 0x84, 0x8A, 0x36, 0x6D,
        0x33, 0x24, 0xC3, 0x02, 0x70, 0x32, 0xFF, 0x8D, 0x16, 0xA1, 0xE4, 0x4D, 0x8D]);
    pubKey54.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey54);

    var pubKey55 = new emv.PubKeyRsa();
    pubKey55.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey55.index = 0x50;
    pubKey55.mod = new Buffer([0xD1, 0x11, 0x97, 0x59, 0x00, 0x57, 0xB8, 0x41, 0x96, 0xC2, 0xF4, 0xD1, 0x1A, 0x8F, 0x3C, 0x05, 0x40, 0x8F, 0x42, 0x2A,
        0x35, 0xD7, 0x02, 0xF9, 0x01, 0x06, 0xEA, 0x5B, 0x01, 0x9B, 0xB2, 0x8A, 0xE6, 0x07, 0xAA, 0x9C, 0xDE, 0xBC, 0xD0, 0xD8,
        0x1A, 0x38, 0xD4, 0x8C, 0x7E, 0xBB, 0x00, 0x62, 0xD2, 0x87, 0x36, 0x9E, 0xC0, 0xC4, 0x21, 0x24, 0x24, 0x6A, 0xC3, 0x0D,
        0x80, 0xCD, 0x60, 0x2A, 0xB7, 0x23, 0x8D, 0x51, 0x08, 0x4D, 0xED, 0x46, 0x98, 0x16, 0x2C, 0x59, 0xD2, 0x5E, 0xAC, 0x1E,
        0x66, 0x25, 0x5B, 0x4D, 0xB2, 0x35, 0x25, 0x26, 0xEF, 0x09, 0x82, 0xC3, 0xB8, 0xAD, 0x3D, 0x1C, 0xCE, 0x85, 0xB0, 0x1D,
        0xB5, 0x78, 0x8E, 0x75, 0xE0, 0x9F, 0x44, 0xBE, 0x73, 0x61, 0x36, 0x6D, 0xEF, 0x9D, 0x1E, 0x13, 0x17, 0xB0, 0x5E, 0x5D,
        0x0F, 0xF5, 0x29, 0x0F, 0x88, 0xA0, 0xDB, 0x47]);
    pubKey55.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey55);

    var pubKey56 = new emv.PubKeyRsa();
    pubKey56.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey56.index = 0x51;
    pubKey56.mod = new Buffer([0xDB, 0x5F, 0xA2, 0x9D, 0x1F, 0xDA, 0x8C, 0x16, 0x34, 0xB0, 0x4D, 0xCC, 0xFF, 0x14, 0x8A, 0xBE, 0xE6, 0x3C, 0x77, 0x20,
        0x35, 0xC7, 0x98, 0x51, 0xD3, 0x51, 0x21, 0x07, 0x58, 0x6E, 0x02, 0xA9, 0x17, 0xF7, 0xC7, 0xE8, 0x85, 0xE7, 0xC4, 0xA7,
        0xD5, 0x29, 0x71, 0x0A, 0x14, 0x53, 0x34, 0xCE, 0x67, 0xDC, 0x41, 0x2C, 0xB1, 0x59, 0x7B, 0x77, 0xAA, 0x25, 0x43, 0xB9,
        0x8D, 0x19, 0xCF, 0x2C, 0xB8, 0x0C, 0x52, 0x2B, 0xDB, 0xEA, 0x0F, 0x1B, 0x11, 0x3F, 0xA2, 0xC8, 0x62, 0x16, 0xC8, 0xC6,
        0x10, 0xA2, 0xD5, 0x8F, 0x29, 0xCF, 0x33, 0x55, 0xCE, 0xB1, 0xBD, 0x3E, 0xF4, 0x10, 0xD1, 0xED, 0xD1, 0xF7, 0xAE, 0x0F,
        0x16, 0x89, 0x79, 0x79, 0xDE, 0x28, 0xC6, 0xEF, 0x29, 0x3E, 0x0A, 0x19, 0x28, 0x2B, 0xD1, 0xD7, 0x93, 0xF1, 0x33, 0x15,
        0x23, 0xFC, 0x71, 0xA2, 0x28, 0x80, 0x04, 0x68, 0xC0, 0x1A, 0x36, 0x53, 0xD1, 0x4C, 0x6B, 0x48, 0x51, 0xA5, 0xC0, 0x29,
        0x47, 0x8E, 0x75, 0x7F]);
    pubKey56.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    pubKey56.hash = 'B9D248075A3F23B522FE45573E04374DC4995D71';
    pubKeys.push(pubKey56);

    var pubKey57 = new emv.PubKeyRsa();
    pubKey57.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey57.index = 0xE1;
    pubKey57.mod = new Buffer([0x99, 0xC5, 0xB7, 0x0A, 0xA6, 0x1B, 0x4F, 0x4C, 0x51, 0xB6,
        0xF9, 0x0B, 0x0E, 0x3B, 0xFB, 0x7A, 0x3E, 0xE0, 0xE7, 0xDB,
        0x41, 0xBC, 0x46, 0x68, 0x88, 0xB3, 0xEC, 0x8E, 0x99, 0x77,
        0xC7, 0x62, 0x40, 0x7E, 0xF1, 0xD7, 0x9E, 0x0A, 0xFB, 0x28,
        0x23, 0x10, 0x0A, 0x02, 0x0C, 0x3E, 0x80, 0x20, 0x59, 0x3D,
        0xB5, 0x0E, 0x90, 0xDB, 0xEA, 0xC1, 0x8B, 0x78, 0xD1, 0x3F,
        0x96, 0xBB, 0x2F, 0x57, 0xEE, 0xDD, 0xC3, 0x0F, 0x25, 0x65,
        0x92, 0x41, 0x7C, 0xDF, 0x73, 0x9C, 0xA6, 0x80, 0x4A, 0x10,
        0xA2, 0x9D, 0x28, 0x06, 0xE7, 0x74, 0xBF, 0xA7, 0x51, 0xF2,
        0x2C, 0xF3, 0xB6, 0x5B, 0x38, 0xF3, 0x7F, 0x91, 0xB4, 0xDA,
        0xF8, 0xAE, 0xC9, 0xB8, 0x03, 0xF7, 0x61, 0x0E, 0x06, 0xAC,
        0x9E, 0x6B]);
    pubKey57.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey57);

    var pubKey58 = new emv.PubKeyRsa();
    pubKey58.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey58.index = 0xE2;
    pubKey58.mod = new Buffer([0xBD, 0x23, 0x2E, 0x34, 0x8B, 0x11, 0x8E, 0xB3, 0xF6, 0x44,
        0x6E, 0xF4, 0xDA, 0x6C, 0x3B, 0xAC, 0x9B, 0x2A, 0xE5, 0x10,
        0xC5, 0xAD, 0x10, 0x7D, 0x38, 0x34, 0x32, 0x55, 0xD2, 0x1C,
        0x4B, 0xDF, 0x49, 0x52, 0xA4, 0x2E, 0x92, 0xC6, 0x33, 0xB1,
        0xCE, 0x4B, 0xFE, 0xC3, 0x9A, 0xFB, 0x6D, 0xFE, 0x14, 0x7E,
        0xCB, 0xB9, 0x1D, 0x68, 0x1D, 0xAC, 0x15, 0xFB, 0x0E, 0x19,
        0x8E, 0x9A, 0x7E, 0x46, 0x36, 0xBD, 0xCA, 0x10, 0x7B, 0xCD,
        0xA3, 0x38, 0x4F, 0xCB, 0x28, 0xB0, 0x6A, 0xFE, 0xF9, 0x0F,
        0x09, 0x9E, 0x70, 0x84, 0x51, 0x1F, 0x3C, 0xC0, 0x10, 0xD4,
        0x34, 0x35, 0x03, 0xE1, 0xE5, 0xA6, 0x72, 0x64, 0xB4, 0x36,
        0x7D, 0xAA, 0x9A, 0x39, 0x49, 0x49, 0x92, 0x72, 0xE9, 0xB5,
        0x02, 0x2F]);
    pubKey58.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey58);

    var pubKey59 = new emv.PubKeyRsa();
    pubKey59.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey59.index = 0xE3;
    pubKey59.mod = new Buffer([0xBC, 0x01, 0xE1, 0x22, 0x23, 0xE1, 0xA4, 0x1E, 0x88, 0xBF,
        0xFA, 0x80, 0x10, 0x93, 0xC5, 0xF8, 0xCE, 0xC5, 0xCD, 0x05,
        0xDB, 0xBD, 0xBB, 0x78, 0x7C, 0xE8, 0x72, 0x49, 0xE8, 0x80,
        0x83, 0x27, 0xC2, 0xD2, 0x18, 0x99, 0x1F, 0x97, 0xA1, 0x13,
        0x1E, 0x8A, 0x25, 0xB0, 0x12, 0x2E, 0xD1, 0x1E, 0x70, 0x9C,
        0x53, 0x3E, 0x88, 0x86, 0xA1, 0x25, 0x9A, 0xDD, 0xFD, 0xCB,
        0xB3, 0x96, 0x60, 0x4D, 0x24, 0xE5, 0x05, 0xA2, 0xD0, 0xB5,
        0xDD, 0x03, 0x84, 0xFB, 0x00, 0x02, 0xA7, 0xA1, 0xEB, 0x39,
        0xBC, 0x8A, 0x11, 0x33, 0x9C, 0x7A, 0x94, 0x33, 0xA9, 0x48,
        0x33, 0x77, 0x61, 0xBE, 0x73, 0xBC, 0x49, 0x7B, 0x8E, 0x58,
        0x73, 0x6D, 0xA4, 0x63, 0x65, 0x38, 0xAD, 0x28, 0x2D, 0x3C,
        0xD3, 0xDB]);
    pubKey59.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey59);

    var pubKey60 = new emv.PubKeyRsa();
    pubKey60.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey60.index = 0xE4;
    pubKey60.mod = new Buffer([0xCB, 0xF2, 0xE4, 0x0F, 0x08, 0x36, 0xC9, 0xA5, 0xE3, 0x90,
        0xA3, 0x7B, 0xE3, 0xB8, 0x09, 0xBD, 0xF5, 0xD7, 0x40, 0xCB,
        0x1D, 0xA3, 0x8C, 0xFC, 0x05, 0xD5, 0xF8, 0xD6, 0xB7, 0x74,
        0x5B, 0x5E, 0x9A, 0x3F, 0xA6, 0x96, 0x1E, 0x55, 0xFF, 0x20,
        0x41, 0x21, 0x08, 0x52, 0x5E, 0x66, 0xB9, 0x70, 0xF9, 0x02,
        0xF7, 0xFF, 0x43, 0x05, 0xDD, 0x83, 0x2C, 0xD0, 0x76, 0x3E,
        0x3A, 0xA8, 0xB8, 0x17, 0x3F, 0x84, 0x77, 0x71, 0x00, 0xB1,
        0x04, 0x7B, 0xD1, 0xD7, 0x44, 0x50, 0x93, 0x12, 0xA0, 0x93,
        0x2E, 0xD2, 0x5F, 0xED, 0x52, 0xA9, 0x59, 0x43, 0x07, 0x68,
        0xCC, 0xD9, 0x02, 0xFD, 0x8C, 0x8A, 0xD9, 0x12, 0x3E, 0x6A,
        0xDD, 0xB3, 0xF3, 0x4B, 0x92, 0xE7, 0x92, 0x4D, 0x72, 0x9C,
        0xB6, 0x47, 0x35, 0x33, 0xAE, 0x2B, 0x2B, 0x55, 0xBF, 0x0E,
        0x44, 0x96, 0x4F, 0xDE, 0xA8, 0x44, 0x01, 0x17]);
    pubKey60.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey60);

    var pubKey61 = new emv.PubKeyRsa();
    pubKey61.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey61.index = 0xE5;
    pubKey61.mod = new Buffer([0xD4, 0xFD, 0xAE, 0x94, 0xDE, 0xDB, 0xEC, 0xC6, 0xD2, 0x0D,
        0x38, 0xB0, 0x1E, 0x91, 0x82, 0x6D, 0xC6, 0x95, 0x43, 0x38,
        0x37, 0x99, 0x17, 0xB2, 0xBB, 0x8A, 0x6B, 0x36, 0xB5, 0xD3,
        0xB0, 0xC5, 0xED, 0xA6, 0x0B, 0x33, 0x74, 0x48, 0xBA, 0xFF,
        0xEB, 0xCC, 0x3A, 0xBD, 0xBA, 0x86, 0x9E, 0x8D, 0xAD, 0xEC,
        0x6C, 0x87, 0x01, 0x10, 0xC4, 0x2F, 0x5A, 0xAB, 0x90, 0xA1,
        0x8F, 0x4F, 0x86, 0x7F, 0x72, 0xE3, 0x38, 0x6F, 0xFC, 0x7E,
        0x67, 0xE7, 0xFF, 0x94, 0xEB, 0xA0, 0x79, 0xE5, 0x31, 0xB3,
        0xCF, 0x32, 0x95, 0x17, 0xE8, 0x1C, 0x5D, 0xD9, 0xB3, 0xDC,
        0x65, 0xDB, 0x5F, 0x90, 0x43, 0x19, 0x0B, 0xE0, 0xBE, 0x89,
        0x7E, 0x5F, 0xE4, 0x8A, 0xDF, 0x5D, 0x3B, 0xFA, 0x05, 0x85,
        0xE0, 0x76, 0xE5, 0x54, 0xF2, 0x6E, 0xC6, 0x98, 0x14, 0x79,
        0x7F, 0x15, 0x66, 0x9F, 0x4A, 0x25, 0x5C, 0x13]);
    pubKey61.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey61);

    var pubKey62 = new emv.PubKeyRsa();
    pubKey62.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey62.index = 0xE6;
    pubKey62.mod = new Buffer([0xEB, 0xF9, 0xFA, 0xEC, 0xC3, 0xE5, 0xC3, 0x15, 0x70, 0x96,
        0x94, 0x66, 0x47, 0x75, 0xD3, 0xFB, 0xDA, 0x5A, 0x50, 0x4D,
        0x89, 0x34, 0x4D, 0xD9, 0x20, 0xC5, 0x56, 0x96, 0xE8, 0x91,
        0xD9, 0xAB, 0x62, 0x25, 0x98, 0xA9, 0xD6, 0xAB, 0x8F, 0xBF,
        0x35, 0xE4, 0x59, 0x9C, 0xAB, 0x7E, 0xB2, 0x2F, 0x95, 0x69,
        0x92, 0xF8, 0xAB, 0x2E, 0x65, 0x35, 0xDE, 0xCB, 0x6B, 0x57,
        0x6F, 0xA0, 0x67, 0x5F, 0x97, 0xC2, 0x3D, 0xD4, 0xC3, 0x74,
        0xA6, 0x6E, 0x6A, 0xF4, 0x19, 0xC9, 0xD2, 0x04, 0xD0, 0xB9,
        0xF9, 0x3C, 0x08, 0xD7, 0x89, 0xD6, 0x38, 0x05, 0x66, 0x0F,
        0xBB, 0x62, 0x9D, 0xF1, 0xB4, 0x88, 0xCF, 0xA1, 0xD7, 0xA1,
        0x3E, 0x9B, 0x72, 0x94, 0x37, 0xEE, 0xAF, 0xE7, 0x18, 0xEF,
        0xA8, 0x59, 0x34, 0x8B, 0xA0, 0xD7, 0x68, 0x12, 0xA9, 0x9F,
        0x31, 0xCD, 0x36, 0x4F, 0x2A, 0x4F, 0xD4, 0x2F]);
    pubKey62.exponent = new Buffer([0x01, 0x00, 0x01]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey62);

    var pubKey63 = new emv.PubKeyRsa();
    pubKey63.rid = new Buffer([0xA0, 0x00, 0x00, 0x01, 0x52]);
    pubKey63.index = 0xD0;
    pubKey63.mod = 'D05C2A09D09C9031366EC092BCAC67D4B1B4F88B10005E1FC45C1B483AE7EB86FF0E884A19C0595A6C34F06386D776A21D620FC9F9C498ADCA00E66D129BCDD4789837B96DCC7F09DA94CCAC5AC7CFC07F4600DF78E493DC1957DEBA3F4838A4B8BD4CEFE4E4C6119085E5BB21077341C568A21D65D049D666807C39C401CDFEE7F7F99B8F9CB34A8841EA62E83E8D63';
    pubKey63.exponent = new Buffer([0x01, 0x00, 0x01]);
    pubKey63.expDate = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey63);

    var pubKey64 = new emv.PubKeyRsa();
    pubKey64.rid = new Buffer([0xA0, 0x00, 0x00, 0x01, 0x52]);
    pubKey64.index = 0xD1;
    pubKey64.mod = 'A71AF977C1079304D6DFF3F665AB6DB3FBDFA1B170287AC6D7BC0AFCB7A202A4C815E1FC2E34F75A052564EE2148A39CD6B0F39CFAEF95F0294A86C3198E349FF82EECE633D50E5860A15082B4B342A90928024057DD51A2401D781B67AE7598D5D1FF26A441970A19A3A58011CA19284279A85567D3119264806CAF761122A71FC0492AC8D8D42B036C394FC494E03B43600D7E02CB5267755ACE64437CFA7B475AD40DDC93B8C9BCAD63801FC492FD251640E41FD13F6E231F56F97283447AB44CBE11910DB3C75243784AA9BDF57539C31B51C9F35BF8BC2495762881255478264B792BBDCA6498777AE9120ED935BB3E8BEA3EAB13D9';
    pubKey64.exponent = new Buffer([0x01, 0x00, 0x01]);
    pubKey64.hash = '20301231';
    //pubKey.hash = '';
    pubKeys.push(pubKey64);

    var pubKey65 = new emv.PubKeyRsa();
    pubKey65.rid = new Buffer([0xA0, 0x00, 0x00, 0x00, 0x04]);
    pubKey65.index = 0xF8;
    //pubKey65.mod = new Buffer([0xA1, 0xF5, 0xE1, 0xC9, 0xBD, 0x86, 0x50, 0xBD, 0x43, 0xAB, 0x6E, 0xE5, 0x6B, 0x89, 0x1E, 0xF7,
    //    0x45, 0x9C, 0x0A, 0x24, 0xFA, 0x84, 0xF9, 0x12, 0x7D, 0x1A, 0x6C, 0x79, 0xD4, 0x93, 0x0F, 0x6D,
    //    0xB1, 0x85, 0x2E, 0x25, 0x10, 0xF1, 0x8B, 0x61, 0xCD, 0x35, 0x4D, 0xB8, 0x3A, 0x35, 0x6B, 0xD1,
    //    0x90, 0xB8, 0x8A, 0xB8, 0xDF, 0x04, 0x28, 0x4D, 0x02, 0xA4, 0x20, 0x4A, 0x7B, 0x6C, 0xB7, 0xC5,
    //    0x55, 0x19, 0x77, 0xA9, 0xB3, 0x63, 0x79, 0xCA, 0x3D, 0xE1, 0xA0, 0x8E, 0x69, 0xF3, 0x01, 0xC9,
    //    0x5C, 0xC1, 0xC2, 0x05, 0x06, 0x95, 0x92, 0x75, 0xF4, 0x17, 0x23, 0xDD, 0x5D, 0x29, 0x25, 0x29,
    //    0x05, 0x79, 0xE5, 0xA9, 0x5B, 0x0D, 0xF6, 0x32, 0x3F, 0xC8, 0xE9, 0x27, 0x3D, 0x6F, 0x84, 0x91,
    //    0x98, 0xC4, 0x99, 0x62, 0x09, 0x16, 0x6D, 0x9B, 0xFC, 0x97, 0x3C, 0x36, 0x1C, 0xC8, 0x26, 0xE1]);
    pubKey65.mod = new Buffer([0x90,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x12,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x48,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x10,
        0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x98,0x00,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x06,0x60,0x00,
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x55]);
    pubKey65.exponent = new Buffer([0x03]);
    //pubKey.expDate = '';
    //pubKey.hash = '';
    pubKeys.push(pubKey65);

    var pubKey66 = new emv.PubKeyRsa();
    pubKey66.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
    pubKey66.index = 0xFE;
    pubKey66.mod = 'C469BF4F82F1FA41A6287A592750DB700B0C6CE26C83397E45A2E476CFD3DD666C6D70A8471D9BED927D43852489D6ACEE88B279F1E3C936CD80423D52509F2BB421F37A42E542F282718315CC8B63DF172B43267336029EECDD245C6119A0FEFB48F218BAAA84AA5B94CC73B9515312080510480F08EE20DCC00A73FAB745332DEFEEB11FB3B9AE0A6B3BAB59B73AD5';
    pubKey66.exponent = new Buffer([0x03]);
    //pubKey66.hash = '20301231';
    pubKeys.push(pubKey66);


    aids = [];
    aids.push({
        aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09],
        partSlt: true
    });
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x99, 0x90, 0x90], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x03], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x04], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x05], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x06], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x04, 0x10, 0x10], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x65, 0x10, 0x10], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x25, 0x01, 0x05, 0x01], partSlt: true});
    //aid.push({aid: [0xA1, 0x22, 0x33, 0x44, 0x55], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x02], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x01, 0x52, 0x30, 0x10], partSlt: true});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x99, 0x99, 0x01], partSlt: false});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x07], partSlt: false});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03], partSlt: false});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10], partSlt: false});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x09, 0x08, 0x07, 0x06, 0x05, 0x04], partSlt: false});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x02], partSlt: false});
    aids.push({aid: [0xA0, 0x00, 0x00, 0x00, 0x04, 0x30, 0x60], partSlt: false});

    defaultBasicParam = new emv.BasicParams();
    defaultBasicParam.floorLimit = 500;
    defaultBasicParam.randomLimit = 100;
    defaultBasicParam.randomPercent = 30;
    defaultBasicParam.randomPercentMax = 90;

    defaultPbocParam = new emv.PbocParams();
    defaultPbocParam.isSupportECash = false;
    defaultPbocParam.isSupportSM = true;
    defaultPbocParam.transProp = '26060000';
    defaultPbocParam.ecLimit = 500;
    defaultPbocParam.rfTransLimit = 100000;
    defaultPbocParam.rfCvmLimit = 200;
    defaultPbocParam.rfFloorLimit = 500;

    defaultVisaParam = new emv.VisaParams();
    defaultVisaParam.rcp = getRcp(false, true, true, true, true, true);
    defaultVisaParam.transProp = '26004000';
    defaultVisaParam.rfTransLimit = 3000;// 超过此限额，不能做非接交易
    defaultVisaParam.rfFloorLimit = 2000;// 超过此限额，需要联机，不能做脱机交易
    defaultVisaParam.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    defaultVisaParam.cvn17Flag = true;
    defaultVisaParam.track1Flag = true;
    defaultVisaParam.track2Flag = true;

    defaultMasterParam = new emv.MasterParams();
    defaultMasterParam.mode = emv.MasterMode.MAG_EMV;
    defaultMasterParam.balanceFlag = emv.MasterBalanceFlag.BOTH;
    defaultMasterParam.recovery = false;
    defaultMasterParam.cdv = false;
    defaultMasterParam.rfTransLimit = 4000;// 超过此限额，不能做非接交易
    defaultMasterParam.rfFloorLimit = 2000;// 超过此限额，需要联机，不能做脱机交易
    defaultMasterParam.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    defaultMasterParam.rfTransLimitCdv = 3000;// 超过此限额，需要持卡人验证
    defaultMasterParam.cvmCapReq = 0xF8;
    defaultMasterParam.cvmCapNoReq = 0xA8;
    defaultMasterParam.cvmCapMagReq = 0xF0;
    defaultMasterParam.cvmCapMagNoReq = 0xF0;

    var masterParam1 = new emv.MasterParams();
    masterParam1.mode = emv.MasterMode.MAG_EMV;
    masterParam1.balanceFlag = emv.MasterBalanceFlag.BOTH;
    masterParam1.recovery = false;
    masterParam1.cdv = false;
    masterParam1.rfTransLimit = 4001;// 超过此限额，不能做非接交易
    masterParam1.rfFloorLimit = 2001;// 超过此限额，需要联机，不能做脱机交易
    masterParam1.rfCvmLimit = 1001;// 超过此限额，需要持卡人验证
    masterParam1.rfTransLimitCdv = 3001;// 超过此限额，需要持卡人验证
    masterParam1.cvmCapReq = 0xF8;
    masterParam1.cvmCapNoReq = 0xA8;
    masterParam1.cvmCapMagReq = 0xF0;
    masterParam1.cvmCapMagNoReq = 0xF0;
    masterParamList.push({key: [0xA0, 0x00, 0x00, 0x00, 0x99, 0x90], value: masterParam1});

    var masterParam2 = new emv.MasterParams();
    masterParam2.mode = emv.MasterMode.MAG_EMV;
    masterParam2.balanceFlag = emv.MasterBalanceFlag.BOTH;
    masterParam2.recovery = false;
    masterParam2.cdv = false;
    masterParam2.rfTransLimit = 4002;// 超过此限额，不能做非接交易
    masterParam2.rfFloorLimit = 2002;// 超过此限额，需要联机，不能做脱机交易
    masterParam2.rfCvmLimit = 1002;// 超过此限额，需要持卡人验证
    masterParam2.rfTransLimitCdv = 3002;// 超过此限额，需要持卡人验证
    masterParam2.cvmCapReq = 0xF8;
    masterParam2.cvmCapNoReq = 0xA8;
    masterParam2.cvmCapMagReq = 0xF0;
    masterParam2.cvmCapMagNoReq = 0xF0;
    masterParamList.push({key: [0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01], value: masterParam2});

    var masterParam3 = new emv.MasterParams();
    masterParam3.mode = emv.MasterMode.MAG_EMV;
    masterParam3.balanceFlag = emv.MasterBalanceFlag.BOTH;
    masterParam3.recovery = false;
    masterParam3.cdv = false;
    masterParam3.rfTransLimit = 4003;// 超过此限额，不能做非接交易
    masterParam3.rfFloorLimit = 2003;// 超过此限额，需要联机，不能做脱机交易
    masterParam3.rfCvmLimit = 1003;// 超过此限额，需要持卡人验证
    masterParam3.rfTransLimitCdv = 3003;// 超过此限额，需要持卡人验证
    masterParam3.cvmCapReq = 0xF8;
    masterParam3.cvmCapNoReq = 0xA8;
    masterParam3.cvmCapMagReq = 0xF0;
    masterParam3.cvmCapMagNoReq = 0xF0;
    masterParamList.push({key: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x08], value: masterParam3});

    var basicParam1 = new emv.BasicParams();
    basicParam1.floorLimit = 501;
    basicParam1.randomLimit = 101;
    basicParam1.randomPercent = 31;
    basicParam1.randomPercentMax = 91;
    basicParamList.push({key: [0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01, 0x01], value: basicParam1});

    var basicParam2 = new emv.BasicParams();
    basicParam2.floorLimit = 502;
    basicParam2.randomLimit = 102;
    basicParam2.randomPercent = 32;
    basicParam2.randomPercentMax = 92;
    basicParamList.push({key: [0xA0, 0x00, 0x00, 0x00, 0x99, 0x90], value: basicParam2});

    var basicParam3 = new emv.BasicParams();
    basicParam3.floorLimit = 503;
    basicParam3.randomLimit = 103;
    basicParam3.randomPercent = 33;
    basicParam3.randomPercentMax = 93;
    basicParam3.countryCode = '0840';
    basicParam3.curCode = '0840';
    basicParamList.push({key: [0xA0, 0x00, 0x00, 0x00, 0x03, 0x10, 0x10, 0x08], value: basicParam3});

    var pbocParam1 = new emv.PbocParams();
    pbocParam1.isSupportECash = false;
    pbocParam1.isSupportSM = true;
    pbocParam1.transProp = '26060000';
    pbocParam1.ecLimit = 501;
    pbocParam1.rfTransLimit = 100001;
    pbocParam1.rfCvmLimit = 201;
    pbocParam1.rfFloorLimit = 501;
    pbocParamList.push({key: [0xA0, 0x00, 0x00, 0x03, 0x33, 0x01, 0x01], value: pbocParam1});

    var pbocParam2 = new emv.PbocParams();
    pbocParam2.isSupportECash = false;
    pbocParam2.isSupportSM = true;
    pbocParam2.transProp = '26060000';
    pbocParam2.ecLimit = 502;
    pbocParam2.rfTransLimit = 100002;
    pbocParam2.rfCvmLimit = 202;
    pbocParam2.rfFloorLimit = 502;
    pbocParamList.push({key: [0xA0, 0x00, 0x00, 0x00, 0x99, 0x90], value: pbocParam2});

    var pbocParam3 = new emv.PbocParams();
    pbocParam3.isSupportECash = false;
    pbocParam3.isSupportSM = true;
    pbocParam3.transProp = '26060000';
    pbocParam3.ecLimit = 501;
    pbocParam3.rfTransLimit = 100001;
    pbocParam3.rfCvmLimit = 201;
    pbocParam3.rfFloorLimit = 501;
    pbocParamList.push({key: [0xA0, 0x00, 0x00, 0x00, 0x03], value: pbocParam3});

    // CLM.D.016.00_04Change
    var visaParam1 = new emv.VisaParams();
    visaParam1.rcp = getRcp(false, true, true, true, false, true);
    visaParam1.transProp = '26004000';
    visaParam1.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    //visaParam1.rfFloorLimit = 500;// 超过此限额，需要联机，不能做脱机交易
    visaParam1.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    visaParam1.cvn17Flag = true;
    visaParam1.track1Flag = true;
    visaParam1.track2Flag = true;
    visaParamList.push({key: '04', value: visaParam1});

    // CLQ.D.015.00/01_04、CLQ.D.017.00_04、CLQ.D.018/019.00_04
    //var visaParam1 = new emv.VisaParams();
    //visaParam1.rcp = getRcp(false, true, true, true, true, true);
    //visaParam1.transProp = '26004000';
    //visaParam1.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    //visaParam1.rfFloorLimit = 5000;// 超过此限额，需要联机，不能做脱机交易
    //visaParam1.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    //visaParam1.cvn17Flag = true;
    //visaParam1.track1Flag = true;
    //visaParam1.track2Flag = true;
    //visaParamList.push({key: '04', value: visaParam1});

    //// CLQ.D.016.00_04Change
    //var visaParam1 = new emv.VisaParams();
    //visaParam1.rcp = getRcp(false, true, true, true, false, true);
    //visaParam1.transProp = '26004000';
    //visaParam1.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    ////visaParam1.rfFloorLimit = 500;// 超过此限额，需要联机，不能做脱机交易
    //visaParam1.rfCvmLimit = 1500;// 超过此限额，需要持卡人验证
    //visaParam1.cvn17Flag = true;
    //visaParam1.track1Flag = true;
    //visaParam1.track2Flag = true;
    //visaParamList.push({key: '04', value: visaParam1});

    // CLQ.D.015.00/01_01
    var visaParam2 = new emv.VisaParams();
    visaParam2.rcp = getRcp(false, false, false, true, true, true);
    visaParam2.transProp = '26004000';
    visaParam2.rfTransLimit = 2000;// 超过此限额，不能做非接交易
    visaParam2.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    visaParam2.rfCvmLimit = 500;// 超过此限额，需要持卡人验证
    visaParam2.cvn17Flag = true;
    visaParam2.track1Flag = true;
    visaParam2.track2Flag = true;
    visaParamList.push({key: '01', value: visaParam2});

    // CLQ.D.016.00/01
    //var visaParam2 = new emv.VisaParams();
    //visaParam2.rcp = getRcp(true, true, false, true, true, true);
    //visaParam2.transProp = '26004000';
    //visaParam2.rfTransLimit = 3000;// 超过此限额，不能做非接交易
    //visaParam2.rfFloorLimit = 2000;// 超过此限额，需要联机，不能做脱机交易
    //visaParam2.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    //visaParam2.cvn17Flag = true;
    //visaParam2.track1Flag = true;
    //visaParam2.track2Flag = true;
    //visaParamList.push({key: '01', value: visaParam2});

    //// CLQ.D.016.01_01Change
    //var visaParam2 = new emv.VisaParams();
    //visaParam2.rcp = getRcp(false, false, false, false, true, true);
    //visaParam2.transProp = '26004000';
    ////visaParam2.rfTransLimit = 2000;// 超过此限额，不能做非接交易
    //visaParam2.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    //visaParam2.rfCvmLimit = 500;// 超过此限额，需要持卡人验证
    //visaParam2.cvn17Flag = true;
    //visaParam2.track1Flag = true;
    //visaParam2.track2Flag = true;
    //visaParamList.push({key: '01', value: visaParam2});

    // CLQ.D.016.00_01Change、CLQ.D.017.00_01、CLQ.D.018/019.00_01
    //var visaParam2 = new emv.VisaParams();
    //visaParam2.rcp = getRcp(false, false, false, true, true, true);
    //visaParam2.transProp = '26004000';
    //visaParam2.rfTransLimit = 2000;// 超过此限额，不能做非接交易
    //visaParam2.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    //visaParam2.rfCvmLimit = 500;// 超过此限额，需要持卡人验证
    //visaParam2.cvn17Flag = true;
    //visaParam2.track1Flag = true;
    //visaParam2.track2Flag = true;
    //visaParamList.push({key: '01', value: visaParam2});

    // CLQ.D.015.00/01_02、CLQ.D.016.00_02Change、CLQ.D.017.00_02、CLQ.D.018/019.00_02
    var visaParam3 = new emv.VisaParams();
    visaParam3.rcp = getRcp(false, true, true, false, true, true);
    visaParam3.transProp = '26004000';
    //visaParam3.rfTransLimit = 2000;// 超过此限额，不能做非接交易
    visaParam3.rfFloorLimit = 100000;// 超过此限额，需要联机，不能做脱机交易
    visaParam3.rfCvmLimit = 50000;// 超过此限额，需要持卡人验证
    visaParam3.cvn17Flag = true;
    visaParam3.track1Flag = true;
    visaParam3.track2Flag = true;
    visaParamList.push({key: '02', value: visaParam3});

    // CLQ.D.015.00/01_03、CLQ.D.017.00_03、CLQ.D.018/019.00_03
    var visaParam4 = new emv.VisaParams();
    visaParam4.rcp = getRcp(false, true, true, true, true, true);
    visaParam4.transProp = '26004000';
    visaParam4.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam4.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    visaParam4.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    visaParam4.cvn17Flag = true;
    visaParam4.track1Flag = true;
    visaParam4.track2Flag = true;
    visaParamList.push({key: '03', value: visaParam4});

    //// CLQ.D.016.00_03Change
    //var visaParam4 = new emv.VisaParams();
    //visaParam4.rcp = getRcp(false, true, true, true, true, false);
    //visaParam4.transProp = '26004000';
    //visaParam4.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    //visaParam4.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    ////visaParam4.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    //visaParam4.cvn17Flag = true;
    //visaParam4.track1Flag = true;
    //visaParam4.track2Flag = true;
    //visaParamList.push({key: '03', value: visaParam4});

    // CLQ.D.016.01_02Change
    var visaParam5 = new emv.VisaParams();
    visaParam5.rcp = getRcp(false, true, true, false, true, false);
    visaParam5.transProp = '26004000';
    //visaParam5.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam5.rfFloorLimit = 100000;// 超过此限额，需要联机，不能做脱机交易
    //visaParam5.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    visaParam5.cvn17Flag = true;
    visaParam5.track1Flag = true;
    visaParam5.track2Flag = true;
    visaParamList.push({key: '02112233445566779900AABBCCDDEEFF', value: visaParam5});

    // CLQ.D.016.01_03Change
    var visaParam6 = new emv.VisaParams();
    visaParam6.rcp = getRcp(false, true, true, false, true, true);
    visaParam6.transProp = '26004000';
    //visaParam6.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam6.rfFloorLimit = 100000;// 超过此限额，需要联机，不能做脱机交易
    visaParam6.rfCvmLimit = 100000;// 超过此限额，需要持卡人验证
    visaParam6.cvn17Flag = true;
    visaParam6.track1Flag = true;
    visaParam6.track2Flag = true;
    visaParamList.push({key: '05112233445566', value: visaParam6});

    // CLQ.D.016.01_04Change
    var visaParam6 = new emv.VisaParams();
    visaParam6.rcp = getRcp(false, true, true, false, false, false);
    visaParam6.transProp = '26004000';
    //visaParam6.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    //visaParam6.rfFloorLimit = 100000;// 超过此限额，需要联机，不能做脱机交易
    //visaParam6.rfCvmLimit = 100000;// 超过此限额，需要持卡人验证
    visaParam6.cvn17Flag = true;
    visaParam6.track1Flag = true;
    visaParam6.track2Flag = true;
    visaParamList.push({key: '06AA', value: visaParam6});

    // CLQ.D.017.01
    var visaParam7 = new emv.VisaParams();
    visaParam7.rcp = getRcp(false, true, true, false, true, true);
    visaParam7.transProp = '26004000';
    //visaParam7.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam7.rfFloorLimit = 3000;// 超过此限额，需要联机，不能做脱机交易
    visaParam7.rfCvmLimit = 3000;// 超过此限额，需要持卡人验证
    visaParam7.cvn17Flag = true;
    visaParam7.track1Flag = true;
    visaParam7.track2Flag = true;
    visaParamList.push({key: 'FFFFAF', value: visaParam7});

    // CLQ.D.020.00_01
    var visaParam8 = new emv.VisaParams();
    visaParam8.rcp = getRcp(false, false, false, true, true, true);
    visaParam8.transProp = '26004000';
    visaParam8.rfTransLimit = 20000;// 超过此限额，不能做非接交易
    visaParam8.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    visaParam8.rfCvmLimit = 500;// 超过此限额，需要持卡人验证
    visaParam8.cvn17Flag = true;
    visaParam8.track1Flag = true;
    visaParam8.track2Flag = true;
    visaParamList.push({key: '10', value: visaParam8});

    // CLQ.D.020.00_01
    var visaParam9 = new emv.VisaParams();
    visaParam9.rcp = getRcp(false, true, true, false, true, true);
    visaParam9.transProp = '26004000';
    //visaParam9.rfTransLimit = 20000;// 超过此限额，不能做非接交易
    visaParam9.rfFloorLimit = 100000;// 超过此限额，需要联机，不能做脱机交易
    visaParam9.rfCvmLimit = 50000;// 超过此限额，需要持卡人验证
    visaParam9.cvn17Flag = true;
    visaParam9.track1Flag = true;
    visaParam9.track2Flag = true;
    visaParamList.push({key: '110840', value: visaParam9});

    // CLQ.D.020.00_03
    var visaParam10 = new emv.VisaParams();
    visaParam10.rcp = getRcp(false, true, true, true, true, true);
    visaParam10.transProp = '26004000';
    visaParam10.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam10.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    visaParam10.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    visaParam10.cvn17Flag = true;
    visaParam10.track1Flag = true;
    visaParam10.track2Flag = true;
    visaParamList.push({key: '1508400840404550', value: visaParam10});

    // CLQ.D.020.00_04
    var visaParam11 = new emv.VisaParams();
    visaParam11.rcp = getRcp(false, true, false, true, true, true);
    visaParam11.transProp = '26004000';
    visaParam11.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam11.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    visaParam11.rfCvmLimit = 1000;// 超过此限额，需要持卡人验证
    visaParam11.cvn17Flag = true;
    visaParam11.track1Flag = true;
    visaParam11.track2Flag = true;
    visaParamList.push({key: '19084008406677889900AABBCCDDEEFF', value: visaParam11});

    // CLQ.D.020.01_01
    var visaParam12 = new emv.VisaParams();
    visaParam12.rcp = getRcp(false, true, false, true, true, true);
    visaParam12.transProp = '26004000';
    visaParam12.rfTransLimit = 5000;// 超过此限额，不能做非接交易
    visaParam12.rfFloorLimit = 1000;// 超过此限额，需要联机，不能做脱机交易
    visaParam12.rfCvmLimit = 3000;// 超过此限额，需要持卡人验证
    visaParam12.cvn17Flag = true;
    visaParam12.track1Flag = true;
    visaParam12.track2Flag = true;
    visaParamList.push({key: '20', value: visaParam12});

    // CLQ.D.020.01_02
    var visaParam13 = new emv.VisaParams();
    visaParam13.rcp = getRcp(true, true, true, false, true, true);
    visaParam13.transProp = '26004000';
    //visaParam13.rfTransLimit = 500;// 超过此限额，不能做非接交易
    visaParam13.rfFloorLimit = 100000;// 超过此限额，需要联机，不能做脱机交易
    visaParam13.rfCvmLimit = 100000;// 超过此限额，需要持卡人验证
    visaParam13.cvn17Flag = true;
    visaParam13.track1Flag = true;
    visaParam13.track2Flag = true;
    visaParamList.push({key: '210124', value: visaParam13});

    // CLQ.D.020.01_03
    var visaParam14 = new emv.VisaParams();
    visaParam14.rcp = getRcp(false, true, true, true, true, true);
    visaParam14.transProp = '26004000';
    visaParam14.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam14.rfFloorLimit = 10000;// 超过此限额，需要联机，不能做脱机交易
    visaParam14.rfCvmLimit = 10000;// 超过此限额，需要持卡人验证
    visaParam14.cvn17Flag = true;
    visaParam14.track1Flag = true;
    visaParam14.track2Flag = true;
    visaParamList.push({key: '2501240124607080', value: visaParam14});

    // CLQ.D.020.01_04
    var visaParam15 = new emv.VisaParams();
    visaParam15.rcp = getRcp(true, true, true, false, true, true);
    visaParam15.transProp = '26004000';
    //visaParam15.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam15.rfFloorLimit = 3000;// 超过此限额，需要联机，不能做脱机交易
    visaParam15.rfCvmLimit = 2000;// 超过此限额，需要持卡人验证
    visaParam15.cvn17Flag = true;
    visaParam15.track1Flag = true;
    visaParam15.track2Flag = true;
    visaParamList.push({key: '29012401246655443322AABBCCDDEEFF', value: visaParam15});

    // CLQ.D.020.02_01
    var visaParam16 = new emv.VisaParams();
    visaParam16.rcp = getRcp(true, true, true, true, true, true);
    visaParam16.transProp = '26004000';
    visaParam16.rfTransLimit = 3300;// 超过此限额，不能做非接交易
    visaParam16.rfFloorLimit = 9900;// 超过此限额，需要联机，不能做脱机交易
    visaParam16.rfCvmLimit = 5700;// 超过此限额，需要持卡人验证
    visaParam16.cvn17Flag = true;
    visaParam16.track1Flag = true;
    visaParam16.track2Flag = true;
    visaParamList.push({key: '30', value: visaParam16});

    // CLQ.D.020.02_02
    var visaParam17 = new emv.VisaParams();
    visaParam17.rcp = getRcp(true, false, false, true, true, true);
    visaParam17.transProp = '26004000';
    visaParam17.rfTransLimit = 72200;// 超过此限额，不能做非接交易
    visaParam17.rfFloorLimit = 54300;// 超过此限额，需要联机，不能做脱机交易
    visaParam17.rfCvmLimit = 19100;// 超过此限额，需要持卡人验证
    visaParam17.cvn17Flag = true;
    visaParam17.track1Flag = true;
    visaParam17.track2Flag = true;
    visaParamList.push({key: '320978', value: visaParam17});

    // CLQ.D.020.02_03
    var visaParam18 = new emv.VisaParams();
    visaParam18.rcp = getRcp(false, true, true, true, true, true);
    visaParam18.transProp = '26004000';
    visaParam18.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    visaParam18.rfFloorLimit = 10000;// 超过此限额，需要联机，不能做脱机交易
    visaParam18.rfCvmLimit = 10000;// 超过此限额，需要持卡人验证
    visaParam18.cvn17Flag = true;
    visaParam18.track1Flag = true;
    visaParam18.track2Flag = true;
    visaParamList.push({key: '3609780250556677', value: visaParam18});

    // CLQ.D.020.02_04
    var visaParam19 = new emv.VisaParams();
    visaParam19.rcp = getRcp(true, true, true, false, false, true);
    visaParam19.transProp = '26004000';
    //visaParam19.rfTransLimit = 10000;// 超过此限额，不能做非接交易
    //visaParam19.rfFloorLimit = 10000;// 超过此限额，需要联机，不能做脱机交易
    visaParam19.rfCvmLimit = 2000;// 超过此限额，需要持卡人验证
    visaParam19.cvn17Flag = true;
    visaParam19.track1Flag = true;
    visaParam19.track2Flag = true;
    visaParamList.push({key: '39082608266655443322FFEEDDCCBBAA', value: visaParam19});

    // CLQ.D.020.03_01
    var visaParam20 = new emv.VisaParams();
    visaParam20.rcp = getRcp(false, false, false, true, true, true);
    visaParam20.transProp = '26004000';
    visaParam20.rfTransLimit = 20000;// 超过此限额，不能做非接交易
    visaParam20.rfFloorLimit = 30000;// 超过此限额，需要联机，不能做脱机交易
    visaParam20.rfCvmLimit = 15000;// 超过此限额，需要持卡人验证
    visaParam20.cvn17Flag = true;
    visaParam20.track1Flag = true;
    visaParam20.track2Flag = true;
    visaParamList.push({key: '40', value: visaParam20});

    // CLQ.D.020.03_02
    var visaParam21 = new emv.VisaParams();
    visaParam21.rcp = getRcp(true, false, false, true, true, true);
    visaParam21.transProp = '26004000';
    visaParam21.rfTransLimit = 5400;// 超过此限额，不能做非接交易
    visaParam21.rfFloorLimit = 4400;// 超过此限额，需要联机，不能做脱机交易
    visaParam21.rfCvmLimit = 8200;// 超过此限额，需要持卡人验证
    visaParam21.cvn17Flag = true;
    visaParam21.track1Flag = true;
    visaParam21.track2Flag = true;
    visaParamList.push({key: '4207', value: visaParam21});

    function getRcp(statusCheck, zeroCheck, option, transLimitActive, floorLimitActive, cmvLimitActive) {
        var rcp = 0x00;
        if (statusCheck) {
            rcp = rcp | 0x80;
        }

        if (zeroCheck) {
            rcp = rcp | 0x40;
        }

        if (option) {
            rcp = rcp | 0x20;
        }

        if (transLimitActive) {
            rcp = rcp | 0x10;
        }

        if (cmvLimitActive) {
            rcp = rcp | 0x08;
        }

        if (floorLimitActive) {
            rcp = rcp | 0x04;
        }

        return [rcp, 0x00];
    }

    function getPubKey(rid, index) {
        for (var i = 0, max = pubKeys.length; i < max; i++) {
            if (rid.compare(pubKeys[i].rid) === 0 && index === pubKeys[i].index) {
                return pubKeys[i];
            }
        }
        console.log('未找到 rid：' + encoding.bufferToHexString(rid) + '，caIndex：' + index);
        return null;
    }

    function initEmv() {
        //emv.switchDebug('REAL_TIME', {target: 'CONSOLE'});
        emv.init();
        emv.manageAidList(emv.ListOperation.CLEAR);
        aids.forEach(function(aid){
            emv.manageAidList(emv.ListOperation.ADD, aid);
        });

        // 设置默认参数
        emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, {value: defaultBasicParam});
        emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, {value: defaultPbocParam});
        emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, {value: defaultVisaParam});
        emv.manageParams(emv.KernelId.MASTER, emv.ListOperation.ADD, {value: defaultMasterParam});
        basicParamList.forEach(function (value) {
            emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, value);
        });
        visaParamList.forEach(function (value) {
            emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, value);
        });
        pbocParamList.forEach(function (value) {
            emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, value);
        });
        masterParamList.forEach(function (value) {
            emv.manageParams(emv.KernelId.MASTER, emv.ListOperation.ADD, value);
        });

        // 设置支持的公钥
        emv.updateCaIndexList('A000000333', '0203050880575861626364656609FE');// rid :公钥id 5个字节，aid的前五个字节；索引0x02 0x03
        emv.updateCaIndexList('A000000003', '010708095153929495969799');
    }
    function initEmvIntegration() {
        //emv.switchDebug('REAL_TIME', {target: 'CONSOLE'});
        emv.init();
        emv.manageAidList(emv.ListOperation.CLEAR);
        aids.forEach(function(aid){
            emv.manageAidList(emv.ListOperation.ADD, aid);
        });

        // 设置默认参数
        emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, {value: defaultBasicParam});
        emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, {value: defaultPbocParam});
        emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, {value: defaultVisaParam});
        emv.manageParams(emv.KernelId.MASTER, emv.ListOperation.ADD, {value: defaultMasterParam});
        basicParamList.forEach(function (value) {
            emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, value);
        });
        visaParamList.forEach(function (value) {
            emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, value);
        });
        pbocParamList.forEach(function (value) {
            emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, value);
        });
        masterParamList.forEach(function (value) {
            emv.manageParams(emv.KernelId.MASTER, emv.ListOperation.ADD, value);
        });

        // 设置支持的公钥
        emv.updateCaIndexList('A000000333', '0203050880575861626364656609FE');// rid :公钥id 5个字节，aid的前五个字节；索引0x02 0x03
        emv.updateCaIndexList('A000000003', '010708095153929495969799');
        emv.updateCaIndexList('A000000004', 'FEFCFDFBFAFFF3F8');
    }
    emvData.pubKeyList = pubKeys;
    emvData.aidList = aids;
    emvData.getPubKey = getPubKey;
    emvData.basicParamList = basicParamList;
    emvData.visaParamList = visaParamList;
    emvData.pbocParamList = pbocParamList;
    emvData.masterParamList = masterParamList;
    emvData.defaultBasicParam = defaultBasicParam;
    emvData.defaultPbocParam = defaultPbocParam;
    emvData.defaultVisaParam = defaultVisaParam;
    emvData.defaultMasterParam = defaultMasterParam;
    emvData.initEmv = initEmv;
    emvData.initEmvIntegration = initEmvIntegration;
    emvData.getRcp = getRcp;
    module.exports = emvData;

    },{"buffer":"buffer","emv":"emv","hermes":"hermes","nymph-encoding":"nymph-encoding"}],
    "emv":[function(require,module,exports){
    'use strict';
    /**
     * # EMV 内核（模块名：emv）
     * @class nymph.pay.emv
     * @singleton
     * 本模块为 EMV 入口模块，通过 `requrie('emv')` 的方式获取，包含以下两部分内容：
     *
     * - EMV 提供的 API。
     * - 所有与 EMV 相关的类和对象。
     *
     */
    // 引用外部模块。
    var nymphError = require('error'),
        hermes = require('hermes'),
        Buffer = require('buffer').Buffer,
        encoding = require('nymph-encoding'),
        tools = require('tools'),

    // 引用模块内部部件。
        BasicParams = require('./basic-params'),
        CandidateAid = require('./candidate-aid'),
        EcLog = require('./ec-log'),
        Gpo = require('./gpo'),
        HostData = require('./host-data'),
        IcLog = require('./ic-log'),
        InitialData = require('./initial-data'),
        MasterParams = require('./master-params'),
        PbocParams = require('./pboc-params'),
        PubKeyRsa = require('./pub-key-rsa'),
        PubKeySm = require('./pub-key-sm'),
        PubKeySmGroup = require('./pub-key-sm-group'),
        RecCert = require('./rec-cert'),
        Record = require('./record'),
        StartData = require('./start-data'),
        TransData = require('./trans-data'),
        VisaParams = require('./visa-params');

    var emv = {
      PLUGINID: 'b0d6d9960172b67b8577dc19eb0429b6',

      instanceId: hermes.NULL,

      isStarted: false,

      bindEvents: function () {
        var self = this;

        /**
         * @event waitForCard
         * 等待卡。
         * 收到此事件，处理完后可用 {@link nymph.pay.emv#eventResponse eventResponse} 方法进行响应，使 EMV 流程继续。
         * @param {String} flag
         *
         * - 'NORMAL'：首次请求卡
         * - 'TRY_AGAIN'：再次请求卡
         *
         * @member nymph.pay.emv
         */
        self.addListener('emvWaitForCard', function (flag) {
          self.emit('waitForCard', flag);
        });

        /**
         * @event selApp
         * 应用选择事件。
         * 收到此事件，处理完后可用 {@link nymph.pay.emv#eventResponse eventResponse} 方法进行响应，使 EMV 流程继续。
         * @param {nymph.pay.emv.CandidateAid[]} aidList 候选 AID 列表。
         * @param {Boolean} isReSelect 是否重新选择。
         * @member nymph.pay.emv
         */
        self.addListener('emvSelApp', function (aidListInfo) {
          var i, aid, tempAid, key,
              candAidList = [],
              aidList = aidListInfo.aidCandList;
          for (i = 0; i<aidList.length; i++) {
            candAidList.push(CandidateAid.unpack(aidList[i]));
          }
          self.emit('selApp', candAidList, aidListInfo.reSelectFlag);
        });

        /**
         * @event finalSelection
         * 最终选择。
         * 收到此事件，处理完后可用 {@link nymph.pay.emv#eventResponse eventResponse} 方法进行响应，使 EMV 流程继续。
         * @param {Object} aid 已选择的 AID，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         * @param {nymph.pay.emv.KernelId} kernelId EMV 内核类型
         * @param {Object} pid 应用 ID，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         * @param {Object} params 已经设置给内核的交易相关参数（基础参数/PBOC 参数/VISA 参数/Master 参数等）。
         * @member nymph.pay.emv
         */
        self.addListener('emvFinalSelection', function (aid, kernelId, pid, params) {
          var pidBuf, key, actualBase, actualPboc, actualVisa,
              aidBuf = new Buffer(aid, 'base64');
          if (pid) {
            pidBuf = new Buffer(pid, 'base64');
          }  else {
            pidBuf = null;
          }

          if (params) {
            if (params.base) {
              params.base = BasicParams.unpack(params.base);
            }
            if (params.pboc) {
              params.pboc = PbocParams.unpack(params.pboc);
            }
            if (params.visa) {
              params.visa = VisaParams.unpack(params.visa);
            }
            if (params.master) {
              params.master = MasterParams.unpack(params.master);
            }
          } else {
            params = null;
          }

          self.emit('finalSelection', aidBuf, kernelId, pidBuf, params);
        });

        /**
         * @event readRecord
         * 读记录。
         * 收到此事件，处理完后可用 {@link nymph.pay.emv#eventResponse eventResponse} 方法进行响应，使 EMV 流程继续。
         * 收到此事件代表读卡片记录已完成，可根据提供的主账号、公钥索引等信息做相关操作，例如：
         *
         * - 设置公钥
         * - 显示或确认卡号
         * - 查询黑名单
         *
         * @param {nymph.pay.emv.Record} record 读卡片记录返回数据
         * @member nymph.pay.emv
         */
        self.addListener('emvReadRecord', function (record) {
          self.emit('readRecord', Record.unpack(record));
        });

        /**
         * @event cardHolderInputPin
         * 持卡人输 Pin 事件。
         * 收到此事件，处理完后可用 {@link nymph.pay.emv#eventResponse eventResponse} 方法进行响应，使 EMV 流程继续。
         * @param {Boolean} isOnlinePin 是否是联机 PIN。
         * @param {Number} leftTimes 脱机 PIN 剩余尝试次数。
         * @member nymph.pay.emv
         */
        self.addListener('emvCardHolderInputPin', function (isOnlinePin, leftTimes) {
          self.emit('cardHolderInputPin', isOnlinePin, leftTimes);
        });

        /**
         * @event certVerify
         * 证件验证事件。
         * 收到此事件后可用 {@link nymph.pay.emv#eventResponse eventResponse} 方法进行响应，使 EMV 流程继续。
         * @param {nymph.pay.emv.CertType} certType 证件类型。
         * @param {String} certNo 证件号码。
         * @member nymph.pay.emv
         */
        self.addListener('emvCertVerify', function (certType, certNo) {
          self.emit('certVerify', certType, certNo);
        });

        /**
         * @event onlineProc
         * 联机事件。
         * 收到此事件，处理完后可用 {@link nymph.pay.emv#eventResponse eventResponse} 方法进行响应，使 EMV 流程继续。
         * @param {nymph.pay.emv.TransData} transData 联机请求参数
         * @member nymph.pay.emv
         */
        self.addListener('emvOnlineProc', function (transData) {
          self.emit('onlineProc', TransData.unpack(transData));
        });

        /**
         * @event finish
         * 交易结束事件。收到此事件后无需对 EMV 内核做进一步的响应。
         * @param {String} retCode EMV 流程结果。
         * @param {nymph.pay.emv.TransData} transData 交易数据。
         * @member nymph.pay.emv
         */
        self.addListener('emvFinish', function (retCode, transData) {
          var code = self.getReturnCode(retCode);
          if (code === nymphError.UNKNOWN) {
            code = self.getError(retCode);
            if (code === nymphError.UNKNOWN) {
              // 因为从主控传上来的是有符号的整型，要先将有符号的整型转换成无符号的，再转成 16 进制字符串。
              retCode = retCode >>> 0;
              code = retCode.toString(16);
            }
          }
          self.isStarted = false;
          self.emit('finish', code, TransData.unpack(transData));
        });

        /**
         * @event closePinPad
         * 关闭密码键盘事件。主要用户脱机 PIN 验证后通知关闭密码键盘。
         * @member nymph.pay.emv
         */
        self.addListener('emvClosePinPad', function () {
          self.emit('closePinPad');
        });

        /**
         * @event balance
         * 获取到余额事件。
         * @param {Number} balance 余额。
         * @member nymph.pay.emv
         */
        self.addListener('emvBalance', function (balance) {
          self.emit('balance', balance);
        });

        /**
         * @event data
         * 数据事件。收到此事件只需对数据进行处理，无需对 EMV 内核做进一步的响应。
         * @param {nymph.pay.emv.Ins} ins 数据类型。
         * @param {Object} data 不同的 ins，传出来的 data 会不同。
         *
         * - ins = 'SET_TORN'，data 为 [Buffer](https://nodejs.org/api/buffer.html)。
         * - ins = 'DEL_TORN'，data 为 [Buffer](https://nodejs.org/api/buffer.html)。
         * - ins = 'DISPLAY'，data 为包含以下信息的对象：
         *   - messageId：{String}
         *   - flag：{String}
         *   - message：{String}
         *
         * @member nymph.pay.emv
         */
        /**
         * @event finishRf
         * 非接卡结束事件
         * 收到此事件表示 RF 卡已经使用完毕，可以被释放掉了。
         * @member nymph.pay.emv
         */
        self.addListener('emvData', function (ins, data) {
          switch(ins) {
            case self.Ins.SET_TORN:
            case self.Ins.DEL_TORN:
              self.emit('data', ins, new Buffer(data, 'base64'));
              break;
            case self.Ins.DISPLAY:
              self.emit('data', ins, data);
              break;
            case self.Ins.CLOSE_RF:
              self.emit('finishRf');
              break;
          }
        });

        /**
         * @event requestData
         * 请求数据。收到此事件后可用 {@link nymph.pay.emv#eventResponse eventResponse} 方法进行响应，使 EMV 流程继续。
         * @param {nymph.pay.emv.Ins} ins 请求的数据类型。
         * @member nymph.pay.emv
         */
        self.addListener('emvDataRequest', function (ins) {
          self.emit('dataRequest', ins);
        });

        /**
         * @event tlvData
         * 内核发出交易相关的 TLV 数据。收到此事件后可对 TLV 数据进行解析，然后可以使用 {@link nymph.pay.emv#stopProcess stopProcess} 结束流程，也可以使用{@link nymph.pay.emv#eventResponse eventResponse} 方法设置 requestData 的值使流程继续。
         * @param {Object} data TLV 数据。
         * @member nymph.pay.emv
         */
        self.addListener('emvTlvData', function (data) {
          if (data) {
            data = new Buffer(data, 'base64');
          }
          self.emit('tlvData', data);
        });
      },

      /**
       * @method switchDebug
       * @ignore
       * 设置日志模式。不开放给用户使用。
       *
       *     var emv = reuqire('emv');
       *     try {
       *         // 设置实时输出 EMV 日志到控制台
       *         emv.switchDebug('REAL_TIME', {target: 'CONSOLE'});
       *
       *         // 设置实时输出 EMV 日志到串口
       *         // emv.switchDebug('REAL_TIME', {target: 'COM', params: {com: 'USBD'}});
       *     } catch (err) {
       *         // 设置日志模式失败的处理。
       *     }
       *
       *
       * @param {String} mode 日志模式，有以下几种：
       *
       * - 'CLOSE'：关闭日志
       * - 'AFTER_TRADE'：交易完成之后
       * - 'REAL_TIME'：交易过程中实时输出
       *
       * @param {Object} options 日志输出途径。包含以下参数：
       *
       * - target：可以输出到文件、串口
       *   - 'FILE'
       *   - 'COM'
       *   - 'CONSOLE'
       *   - 'NONE'：关闭日志时为此项
       * - params：不同 target 的参数不同：
       *   - COM 方式参数：
       *     - com：串口号
       *   - FILE 方式参数：
       *     - filePath：文件路径
       * @member nymph.pay.emv
       */
      switchDebug: function (mode, options){
        var result, errorCode;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'switchDebug', [mode, options]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to set debug mode.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method init
       * 初始化 EMV。启动应用后执行一次即可。
       *
       *     var emv = reuqire('emv');
       *     try {
       *         emv.init();
       *     } catch (err) {
       *         // EMV 初始化失败的处理。
       *     }
       *
       * @param {nymph.pay.emv.InitialData} [cfg] EMV 初始化参数（目前没有可进行配置的初始化参数）。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      init: function (cfg) {
        var result, errorCode, actualCfg = {};
        if (cfg) {
          actualCfg = cfg;
        }
        result = hermes.exec(this.PLUGINID, this.instanceId, 'init', [actualCfg]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to initialize EMV.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method config
       * 此方法用于手动设置 EMV 参数。
       *
       *     // 以下参数可根据需要进行设置
       *     var basicParam = new emv.BasicParams();
       *     basicParam.termType = 0x22; // 可不设置，默认值为 0x22
       *     basicParam.termCap = new Buffer([0xE0, 0xF1, 0xC8]); // 可不设置，默认值为 [0xE0, 0xF1, 0xC8]
       *     basicParam.additionalTermCap = new Buffer([0x6F, 0x00, 0xF0, 0xF0, 0x01]); // 可不设置，默认值为 [0x6F, 0x00, 0xF0, 0xF0, 0x01]
       *     basicParam.countryCode = new Buffer([0x01, 0x56]); // 可不设置，默认值为 [0x01, 0x56]
       *     basicParam.curCode = new Buffer([0x01, 0x56]); // 可不设置，默认值为 [0x01, 0x56]
       *     basicParam.tacDefault = new Buffer([0xFF, 0xFF, 0xFF, 0xFF, 0xFF]); // 可不设置，默认值为 [0x00, 0x00, 0x00, 0x00, 0x00]
       *     basicParam.tacDenial = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00]); // 可不设置，默认值为 [0x00, 0x00, 0x00, 0x00, 0x00]
       *     basicParam.tacOnline = new Buffer([0xFF, 0xFF, 0xFF, 0xFF, 0xFF]); // 可不设置，默认值为 [0x00, 0x00, 0x00, 0x00, 0x00]
       *     basicParam.floorLimit = 500;
       *     basicParam.randomLimit = 100;
       *     basicParam.randomPercent = 30;
       *     basicParam.randomPercentMax = 90;
       *
       *     var pbocParam = new emv.PbocParams();
       *     pbocParam.isSupportECash = true;
       *     pbocParam.isSupportSM = true;
       *     pbocParam.transProp = '26060000';
       *     pbocParam.ecLimit = 500;
       *     pbocParam.rfTransLimit = 100000;
       *     pbocParam.rfCvmLimit = 200;
       *     pbocParam.rfFloorLimit = 500;
       *
       *     var visaParam = new emv.VisaParams();
       *     //visaParams.rcp 缺省不设置
       *     visaParam.transProp = '26060000';
       *     visaParam.rfTransLimit = 100000;// 超过此限额，不能做非接交易
       *     visaParam.rfCvmLimit = 200;// 超过此限额，需要持卡人验证
       *     visaParam.rfFloorLimit = 500;// 超过此限额，需要联机，不能做脱机交易
       *     visaParam.cvn17Flag = true;
       *     visaParam.track1Flag = true;
       *     visaParam.track2Flag = true;
       *
       *     try {
       *         // 可以一次只设置一个参数
       *         emv.config({base: basicParam});
       *         // 也可以一次设置多个参数
       *         // emv.config({base: basicParam, pboc: pbocParam, visa: visaParam});
       *     } catch (err) {
       *         // 设置失败的处理
       *     }
       *
       * @param {Object} options 要设置的 EMV 交易相关参数。
       * @param {nymph.pay.emv.BasicParams} [options.base] 基本参数
       * @param {nymph.pay.emv.PbocParams} [options.pboc] PBOC 接触与非接交易参数
       * @param {nymph.pay.emv.VisaParams} [options.visa] VISA 非接交易参数
       * @param {nymph.pay.emv.MasterParams} [options.master] MASTER 交易参数
       * @member nymph.pay.emv
       */
      config: function (options) {
        var result, errorCode, key, actualOptions = {}, temp, tempKey, param;

        if (!options) {
          throw {code: nymphError.PARAM_ERR, message: 'options can not be null or undefined!'};
        }

        for (key in options) {
          if (options.hasOwnProperty(key)) {
            if (options[key]) {
              switch (key) {
                case 'base':
                  if (typeof options[key] !== 'object') {
                    throw {code: nymphError.PARAM_ERR, message: key + ' param should be an object!'};
                  }
                  actualOptions[key] = BasicParams.pack(options[key]);
                  break;
                case 'pboc':
                  if (typeof options[key] !== 'object') {
                    throw {code: nymphError.PARAM_ERR, message: key + ' param should be an object!'};
                  }
                  actualOptions[key] = PbocParams.pack(options[key]);
                  break;
                case 'visa':
                  if (typeof options[key] !== 'object') {
                    throw {code: nymphError.PARAM_ERR, message: key + ' param should be an object!'};
                  }
                  actualOptions[key] = VisaParams.pack(options[key]);
                  break;
                case 'master':
                  if (typeof options[key] !== 'object') {
                    throw {code: nymphError.PARAM_ERR, message: key + ' param should be an object!'};
                  }
                  actualOptions[key] = MasterParams.pack(options[key]);
                  break;
              }
            }
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'config', [actualOptions]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to config.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method getInfo
       * 获取 EMV 信息。
       *
       *     try {
       *         var info = emv.getInfo();
       *     } catch (err) {
       *         // 失败的处理。
       *     }
       *
       * @return {Object} 获取到的 EMV 信息。
       * @return {String} return.version EMV 版本
       * @member nymph.pay.emv
       */
      getInfo: function () {
        var result, errorCode, info;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'getEmvInfo');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to get EMV information.', innerCode: result.innerCode};
          }
        }

        info = result.data;
        return info;
      },

      /**
       * @method getTlv
       * 读取单个 TLV 数据元
       *
       *     try {
       *         // 参数为 16 进制字符串
       *         var value = emv.getTlv('9F12');
       *
       *         // 参数为 Array 类型
       *         // var value = emv.getTlv([0x9F, 0x12]);
       *
       *         // 参数为 Buffer 类型
       *         // var tag = new Buffer([0x9F, 0x12]);
       *         // var value = emv.getTlv(tag);
       *     } catch (err) {
       *         // 失败的处理。
       *     }
       *
       * @param {Object/String/Array} tag 待读取的 TAG，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
       * @return {Object} 获取到的 VALUE，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      getTlv: function (tag) {
        var result, errorCode, actualTag;

        try {
          actualTag = tools.toBase64(tag);
        } catch (err) {
          if (err) {
            throw {code: nymphError.PARAM_ERR, message: 'Invalid tag: ' + err.message};
          } else {
            throw {code: nymphError.PARAM_ERR, message: 'Invalid tag!'};
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'getTlv', [actualTag]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          // if (result.hasOwnProperty('message')) {
          //   throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          // } else {
          //   throw {code: errorCode, message: 'Failed to get TLV.', innerCode: result.innerCode};
          // }
          return null;
        }

        if (result.data) {
          return new Buffer(result.data, 'base64');
        } else {
          return null;
        }
      },

      /**
       * @method setTlv
       * 设置单个 TLV 数据元
       *
       *     try {
       *         // 参数为 16 进制字符串
       *         emv.setTlv(emv.KernelId.EMV, {tag: 'DF06', value: '7C00'});
       *
       *         // 参数为 Array 类型
       *         // emv.setTlv(emv.KernelId.EMV, {tag: [0xDF, 0x06], value: [0x7C, 0x00]});
       *
       *         // 参数为 Buffer 类型
       *         // var tag = new Buffer([0xDF, 0x06]);
       *         // var value = new Buffer([0x7C, 0x00]);
       *         // emv.setTlv(emv.KernelId.EMV, {tag: tag, value: value});
       *     } catch (err) {
       *         // 失败的处理。
       *     }
       *
       * @param {nymph.pay.emv.KernelId} kernelId EMV 内核类型
       * @param {Object} tlv 要进行设置的 TLV 数据元。
       * @param {Object/String/Array} tlv.tag 待设置的 TAG，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
       * @param {Object/String/Array} [tlv.value] tag 值（0-255 个 byte 字节），数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
       * 如果 value 为空，则表示清空此 tag
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      setTlv: function (kernelId, tlv) {
        var result, errorCode, actualTlv = {};
        if(!kernelId || !tlv) {
          throw {code: nymphError.PARAM_ERR, message: 'kernelId and tlv are both required!'};
        }

        switch (kernelId) {
          case this.KernelId.AMEX:
          case this.KernelId.EMV:
          case this.KernelId.EMV_CONTACTLESS:
          case this.KernelId.JCB:
          case this.KernelId.MASTER:
          case this.KernelId.PBOC:
          case this.KernelId.VISA:
            break;
          default:
            throw {code: nymphError.PARAM_ERR, message: 'kernelId must be an item of emv.KernelId!'};
        }

        try {
          actualTlv.tag = tools.toBase64(tlv.tag);
          if (tlv.value) {
            actualTlv.value = tools.toBase64(tlv.value);
          }
        } catch (err) {
          if (err) {
            throw {code: nymphError.PARAM_ERR, message: 'invalid tlv:' + err.message};
          } else {
            throw {code: nymphError.PARAM_ERR, message: 'invalid tlv!'};
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'setTlv', [kernelId, actualTlv]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to set TLV.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method setTlvList
       * 设置 TLV 数据元列表
       *
       *     try {
       *         // 参数为 16 进制字符串
       *         emv.setTlvList(emv.KernelId.EMV, 'DF067C00');
       *
       *         // 参数为 Array 类型
       *         // emv.setTlvList(emv.KernelId.EMV, [0xDF, 0x06, 0x7C, 0x00]);
       *
       *         // 参数为 Buffer 类型
       *         // var tlvList = new Buffer([0xDF, 0x06, 0x7C, 0x00]);
       *         // emv.setTlvList(emv.KernelId.EMV, tlvList);
       *     } catch (err) {
       *         // 失败的处理。
       *     }
       *
       * @param {nymph.pay.emv.KernelId} kernelId EMV 内核类型
       * @param {Object/String/Array} tlvList 待设置的 TLV 数据元列表。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      setTlvList: function (kernelId, tlvList) {
        var result, errorCode, actualTlvList;

        if(!kernelId || !tlvList) {
          throw {code: nymphError.PARAM_ERR, message: 'kernelId and tlvList are both required!'};
        }

        switch (kernelId) {
          case this.KernelId.AMEX:
          case this.KernelId.EMV:
          case this.KernelId.EMV_CONTACTLESS:
          case this.KernelId.JCB:
          case this.KernelId.MASTER:
          case this.KernelId.PBOC:
          case this.KernelId.VISA:
            break;
          default:
            throw {code: nymphError.PARAM_ERR, message: 'kernelId must be an item of emv.KernelId!'};
        }

        try{
          actualTlvList = tools.toBase64(tlvList);
        } catch (err) {
          if (err) {
            throw {code: nymphError.PARAM_ERR, message: 'invalid tlvList: ' + err.message};
          } else {
            throw {code: nymphError.PARAM_ERR, message: 'invalid tlvList!'};
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'setTlvList', [kernelId, actualTlvList]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to set TLV list.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method updateCaIndexList
       * 根据 RID，更新对应的 CA 公钥索引列表。（做非接 EMV 交易时需要更新）
       *
       * - 当 rid 和 indexList 参数都为空时，将清除已经保存的所有公钥索引列表。
       * - 当 rid 不为空，indexList 为空时，将会把此 rid 从公钥索引列表里面删除。
       *
       *     try {
       *         // 参数为 16 进制字符串
       *         emv.updateCaIndexList('A000000333', '02030508805758616263646566');
       *
       *         // 参数为 Array 类型
       *         // emv.updateCaIndexList([0xA0, 0x00, 0x00, 0x03, 0x33], [0x02, 0x03, 0x05, 0x08, 0x80, 0x57, 0x58, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66]);
       *
       *         // 参数为 Buffer 类型
       *         // var rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
       *         // var caIndexList = new Buffer([0x02, 0x03, 0x05, 0x08, 0x80, 0x57, 0x58, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66]);
       *         // emv.updateCaIndexList(rid, caIndexList);
       *     } catch (err) {
       *         // 失败的处理。
       *     }
       *
       * ** 请在 EMV 交易之前更新 CA 公钥索引列表，否则交易过程会出现公钥找不到或者验证失败的错误。**
       * @param {Object/String/Array} [rid] RID（5 个 byte 字节），数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)。
       * @param {Object/String/Array} [indexList] 索引列表（0-50 个 byte 字节），数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      updateCaIndexList: function (rid, indexList) {
        var result, errorCode, actualRid, actualIndexList;

        try {
          if (rid) {
            actualRid = tools.toBase64(rid);
          } else {
            // rid 为空时，indexList 必须为空，否则无法进行设置。
            if (indexList) {
              throw {code: nymphError.PARAM_ERR, message: 'rid is required!'};
            }
          }
        } catch (err) {
          if (err) {
            throw {code: nymphError.PARAM_ERR, message: 'invalid rid: ' + err.message};
          } else {
            throw {code: nymphError.PARAM_ERR, message: 'invalid rid!'};
          }
        }

        try {
          if (indexList) {
            actualIndexList = tools.toBase64(indexList);
          } else {
            actualIndexList = null;
          }
        } catch (err) {
          if (err) {
            throw {code: nymphError.PARAM_ERR, message: 'invalid indexList: ' + err.message};
          } else {
            throw {code: nymphError.PARAM_ERR, message: 'invalid indexList!'};
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'updateCaIndexList', [actualRid, actualIndexList]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to update CA public key index list.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method manageParams
       * 管理各种 EMV 参数，以便在 EMV 交易过程中能够获取到所需的参数。
       *
       *     try {
       *         var defaultBasicParam = new emv.BasicParams();
       *         // defaultBasicParam 的各项参数赋值可参考 {@link nymph.pay.emv#config config()} 方法的示例代码。
       *
       *         var defaultPbocParam = new emv.PbocParams();
       *         // defaultPbocParam 的各项参数赋值可参考 {@link nymph.pay.emv#config config()} 方法的示例代码。
       *
       *         var defaultVisaParam = new emv.VisaParams();
       *         // defaultVisaParam 的各项参数赋值可参考 {@link nymph.pay.emv#config config()} 方法的示例代码。
       *
       *         // 当最后一个参数 param 没有 key 的时候，设置的是 EMV 默认参数
       *         emv.manageParams(emv.KernelId.EMV, emv.ListOperation.ADD, {value: defaultBasicParam});
       *         emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, {value: defaultPbocParam});
       *         emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, {value: defaultVisaParam});
       *
       *         var pbocParam = new emv.PbocParams();
       *         // pbocParam 的各项参数赋值可参考 {@link nymph.pay.emv#config config()} 方法的示例代码。
       *         // pboc 参数的 key 是 aid，当最后一个参数 param 有 key 的时候，往指定类型的参数列表中添加一个参数
       *         emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.ADD, {key: 'A0000000031010', value: pbocParam});
       *
       *         var visaParam = new emv.VisaParams();
       *         // visaParam 的各项参数赋值可参考 {@link nymph.pay.emv#config config()} 方法的示例代码。
       *         // visa 参数的 key 是 pid，当最后一个参数 param 有 key 的时候，往指定类型的参数列表中添加一个参数
       *         emv.manageParams(emv.KernelId.VISA, emv.ListOperation.ADD, {key:'0001', value: visaParam});
       *
       *         // 当 operation 为 'CLEAR' 的时候，清除指定类型的所有参数
       *         emv.manageParams(emv.KernelId.EMV, emv.ListOperation.CLEAR);
       *         emv.manageParams(emv.KernelId.PBOC, emv.ListOperation.CLEAR);
       *         emv.manageParams(emv.KernelId.VISA, emv.ListOperation.CLEAR);
       *     } catch (err) {
       *         // 设置失败的处理
       *     }
       *
       * @param {nymph.pay.emv.KernelId} kernelId 要设置的参数类型。
       * @param {nymph.pay.emv.ListOperation} operation 列表操作。
       * @param {Object} param 要设置的参数。
       * @param {Object/String/Array} param.key 参数索引。如果 key 为空，则设置默认参数。数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
       * @param {nymph.pay.emv.PbocParams/nymph.pay.emv.VisaParams/nymph.pay.emv.BasicParams/nymph.pay.emv.MasterParams} param.value 参数信息。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      manageParams: function (kernelId, operation, param) {
        var result, errorCode, actualParam = {}, tempParam, temp;

        switch (kernelId) {
          case this.KernelId.EMV:
            tempParam = BasicParams;
            break;
          case this.KernelId.MASTER:
            tempParam = MasterParams;
            break;
          case this.KernelId.PBOC:
            tempParam = PbocParams;
            break;
          case this.KernelId.VISA:
            tempParam = VisaParams;
            break;
          case this.KernelId.AMEX:
          case this.KernelId.EMV_CONTACTLESS:
          case this.KernelId.JCB:
            throw {code: nymphError.PARAM_ERR, message: 'Not support this kernel yet:' + kernelId};
          default:
            throw {code: nymphError.PARAM_ERR, message: 'kernelId must be an item of emv.KernelId!'};
        }

        switch (operation) {
          case this.ListOperation.ADD:
            if (param) {
              if (param.value) {
                actualParam.value = tempParam.pack(param.value);
              } else {
                throw {code: nymphError.PARAM_ERR, message: 'The value of param can not be null.'};
              }
            } else {
              throw {code: nymphError.PARAM_ERR, message: 'Please transfer param.'};
            }
            break;
          case this.ListOperation.CLEAR:
          case this.ListOperation.REMOVE:
            break;
          default:
            throw {code: nymphError.PARAM_ERR, message: 'invalid operation!'};
        }

        if (param && param.key) {
          try {
            actualParam.key = tools.toBase64(param.key);
          } catch (err) {
            if (err) {
              throw {code: nymphError.PARAM_ERR, message: 'invalid param key: ' + err.message};
            } else {
              throw {code: nymphError.PARAM_ERR, message: 'invalid param key!'};
            }
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'manageParams', [kernelId, operation, actualParam]);

        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to manage parameters.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method manageAidList
       * 管理 AID 列表，可添加、删除一个 AID，也可以清除整个 AID 列表。
       * ** 请在 EMV 交易之前设置 AID，否则交易过程会出现 AID 找不到的错误。**
       *
       *     try {
       *         var aidBuf = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
       *
       *         // 清除 AID 列表
       *         emv.manageAidList(emv.ListOperation.CLEAR);
       *
       *         // 删除一个 AID（参数是 16 进制字符串）
       *         emv.manageAidList(emv.ListOperation.REMOVE, {aid: 'A000000333'});
       *
       *         // 删除一个 AID（参数是 Array）
       *         emv.manageAidList(emv.ListOperation.REMOVE, {aid: [0xA0, 0x00, 0x00, 0x03, 0x33]});
       *
       *         // 删除一个 AID（参数是 Buffer）
       *         emv.manageAidList(emv.ListOperation.REMOVE, {aid: aidBuf});
       *
       *         // 添加一个 AID（参数是 16 进制字符串）
       *         emv.manageAidList(emv.ListOperation.ADD, {aid: 'A000000333', partSlt: true});
       *
       *         // 添加一个 AID（参数是 Array）
       *         emv.manageAidList(emv.ListOperation.ADD, {aid: [0xA0, 0x00, 0x00, 0x03, 0x33], partSlt: true});
       *
       *         // 添加一个 AID（参数是 Buffer）
       *         emv.manageAidList(emv.ListOperation.ADD, {aid: aidBuf, partSlt: true});
       *     } catch (err) {
       *         // 失败的处理
       *     }
       *
       * @param {nymph.pay.emv.ListOperation} operation 列表操作。
       * @param {Object} aidItem 要操作的 AID。当清除列表时无需传入此参数。
       * @param {Object/String/Array} aidItem.aid AID（5-16 个 byte 字节），数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
       * @param {Boolean} aidItem.partSlt 部分选择标识，默认值为 false。
       *
       * - true：支持
       * - false：不支持（默认值）
       *
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      manageAidList: function (operation, aidItem) {
        var result, errorCode, key, actualAidItem = {}, tempBuf;

        switch (operation) {
          case this.ListOperation.ADD:
          case this.ListOperation.CLEAR:
          case this.ListOperation.REMOVE:
            break;
          default:
            throw {code: nymphError.PARAM_ERR, message: 'invalid operation!'};
        }

        if (operation !== this.ListOperation.CLEAR) {
          if (!aidItem) {
            throw {code: nymphError.PARAM_ERR, message: 'aidItem required!'};
          }
          if (!aidItem.hasOwnProperty('aid')) {
            throw {code: nymphError.PARAM_ERR, message: 'aidItem should have aid!'};
          }

          if (!Buffer.isBuffer(aidItem.aid)) {
              if (aidItem.aid.constructor === Array) {
                  actualAidItem.aid = new Buffer(aidItem.aid);
              } else {
                  try {
                      actualAidItem.aid = encoding.hexStringToBuffer(aidItem.aid);
                  } catch (e) {
                      throw {
                          code: nymphError.PARAM_ERR,
                          message: JSON.stringify(aidItem.aid) + ' is not a valid hex string!'
                      };
                  }
              }

              if (actualAidItem.aid === null) {
                  throw {
                      code: nymphError.PARAM_ERR,
                      message: JSON.stringify(aidItem.aid) + ' can not be converted to a buffer!'
                  };
              }
          } else {
              actualAidItem.aid = aidItem.aid;
          }

          if (actualAidItem.aid.length < 5 || actualAidItem.aid.length > 16) {
              throw {code: nymphError.PARAM_ERR, message: 'AID should be a buffer of length between [5-16].'};
          }
          actualAidItem.aid = actualAidItem.aid.toString('base64');

          if (operation === this.ListOperation.ADD) {
            if (!aidItem.hasOwnProperty('partSlt')) {
              throw {code: nymphError.PARAM_ERR, message: 'Please specify whether the AID support part selection:'+aidItem.aid};
            }
            actualAidItem.partSlt = aidItem.partSlt;
          } else {
            if (!aidItem.hasOwnProperty('partSlt')) {
              actualAidItem.partSlt = false;
            } else {
              actualAidItem.partSlt = aidItem.partSlt;
            }
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'manageAidList', [operation, actualAidItem]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to manage AID list.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method manageRecCert
       * 回收公钥证书管理。
       * ** 请在 EMV 交易之前进行更新，否则 EMV 交易过程会出现公钥过期，验证失败的错误。**
       * @param {nymph.pay.emv.ListOperation} operation 列表操作。
       * @param {nymph.pay.emv.RecCert} recCert 要进行操作的公钥。如果是清空操作，无需传入此参数。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      manageRecCert: function (operation, recCert) {
        var result, errorCode, key, actualRecCert = {};

        switch (operation) {
          case this.ListOperation.CLEAR:
            break;
          case this.ListOperation.ADD:
          case this.ListOperation.REMOVE:
            if (!recCert) {
              throw {code: nymphError.PARAM_ERR, message: 'recCert is required when operation is ADD or REMOVE.'};
            }
            break;
          default:
            throw {code: nymphError.PARAM_ERR, message: 'invalid operation!'};
        }

        if (recCert) {
          if (typeof recCert !== 'object') {
            throw {code: nymphError.PARAM_ERR, message: 'invalid recCert!'};
          }
          for (key in recCert) {
            if (recCert.hasOwnProperty(key)){
              if (key === 'rid' || key === 'sn') {
                actualRecCert[key] = tools.toBase64(recCert[key]);
              } else {
                actualRecCert[key] = recCert[key];
              }
            }
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'manageRecCert', [operation, actualRecCert]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to recycle public key certificate.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @ignore
       * @method checkOtherCards
       * 在 EMV 交易过程卡的优先级为：磁条卡 > 接触式 IC 卡 > 非接触式 IC 卡。因此需要在交易开始之前设置是否监听其他卡槽。
       * @param {Object} options
       * @param {Boolean} options.checkMag 是否监听磁条卡槽。true-是，false-否。
       * @param {Boolean} options.checkIc 是否监听接触式 IC 卡槽。true-是，false-否。
       */
      checkOtherCards: function (options) {
        var result, errorCode;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'checkOtherCards', [options]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to set other cards listener.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method startProcess
       * 启动 EMV 流程。
       *
       *     try {
       *         var startData = new emv.StartData();
       *         startData.pseFlag = emv.PseFlag.PSE_AID;
       *         var gpo = new emv.Gpo();
       *         gpo.amount = 1;
       *         gpo.otherAmount = 0;
       *         gpo.transDate = 150824;
       *         gpo.transTime = 172500;
       *         gpo.trace = 1234;
       *         gpo.serviceType = emv.ServiceType.GOOD;
       *         gpo.gacFlag = emv.GacFlag.NON;
       *         startData.gpo = gpo;
       *         startData.purpose = emv.StartPurpose.NORMAL;
       *         // 要对 EMV 的各个事件进行监听处理，事件绑定请参见 {@link nymph.pay.emv#eventResponse eventResponse()} 方法的示例代码。
       *         emv.bindEvents();
       *         // 启动 EMV 流程
       *         emv.startProcess(startData);
       *     } catch (err) {
       *         // 失败的处理
       *     }
       *
       * @fires waitForCard
       * @param {nymph.pay.emv.StartData} startData EMV 交易流程数据
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      startProcess: function (startData) {
        var result, errorCode, actualStartData;

        if (!startData) {
          throw {code: nymphError.PARAM_ERR, message:'startData is required!'};
        }
        if (typeof startData !== 'object') {
          throw {code: nymphError.PARAM_ERR, message:'startData is invalid!'};
        }

        try {
          actualStartData = StartData.pack(startData);
        } catch (err) {
          if (err) {
            throw {code: nymphError.PARAM_ERR, message: 'invalid startData:' + err.message};
          } else {
            throw {code: nymphError.PARAM_ERR, message: 'invalid startData!'};
          }
        }


        result = hermes.exec(this.PLUGINID, this.instanceId, 'startProcess', [actualStartData]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to start EMV process.', innerCode: result.innerCode};
          }
        } else {
          this.isStarted = true;
        }
      },

      /**
       * @method setCaPubKey
       * 此方法为 EMV 流程过程中进行 CA 公钥数据的设置。
       *
       *     try {
       *         // 设置 RSA 算法公钥
       *         var pubKey1 = new emv.PubKeyRsa();
       *         pubKey1.rid = new Buffer([0xA0, 0x00, 0x00, 0x99, 0x99]);
       *         pubKey1.index = 0xE1;
       *         pubKey1.mod = new Buffer([0x99, 0xC5, 0xB7, 0x0A, 0xA6, 0x1B, 0x4F, 0x4C, 0x51, 0xB6,
       *           0xF9, 0x0B, 0x0E, 0x3B, 0xFB, 0x7A, 0x3E, 0xE0, 0xE7, 0xDB,
       *           0x41, 0xBC, 0x46, 0x68, 0x88, 0xB3, 0xEC, 0x8E, 0x99, 0x77,
       *           0xC7, 0x62, 0x40, 0x7E, 0xF1, 0xD7, 0x9E, 0x0A, 0xFB, 0x28,
       *           0x23, 0x10, 0x0A, 0x02, 0x0C, 0x3E, 0x80, 0x20, 0x59, 0x3D,
       *           0xB5, 0x0E, 0x90, 0xDB, 0xEA, 0xC1, 0x8B, 0x78, 0xD1, 0x3F,
       *           0x96, 0xBB, 0x2F, 0x57, 0xEE, 0xDD, 0xC3, 0x0F, 0x25, 0x65,
       *           0x92, 0x41, 0x7C, 0xDF, 0x73, 0x9C, 0xA6, 0x80, 0x4A, 0x10,
       *           0xA2, 0x9D, 0x28, 0x06, 0xE7, 0x74, 0xBF, 0xA7, 0x51, 0xF2,
       *           0x2C, 0xF3, 0xB6, 0x5B, 0x38, 0xF3, 0x7F, 0x91, 0xB4, 0xDA,
       *           0xF8, 0xAE, 0xC9, 0xB8, 0x03, 0xF7, 0x61, 0x0E, 0x06, 0xAC,
       *           0x9E, 0x6B]);
       *         pubKey1.exponent = new Buffer([0x03]);
       *         //pubKey1.expDate 根据需要设置
       *         //pubKey1.hash 根据需要设置
       *         emv.setCaPubKey('RSA', pubKey1);
       *
       *         // 设置 SM 算法公钥
       *         var pubKey2 = new emv.PubKeySm();
       *         pubKey2.rid = new Buffer([0xA0, 0x00, 0x00, 0x03, 0x33]);
       *         pubKey2.index = 0x57;
       *         pubKey2.mod = 'E8105E77861FD2EB727C84E36D3D4A5666BD0ADCE8781F0145D3D82D72B92748E22D5404C6C41F3EC8B790DE2F61CF29FAECB168C79F5C8666762D53CC26A460';
       *         pubKey2.expDate = '20201231';
       *         emv.setCaPubKey('SM', pubKey1);
       *     } catch (err) {
       *         // 失败的处理
       *     }
       *
       * @param {String} algorithmType 公钥算法类型
       *
       * - 'SM'：SM 算法
       * - 'RSA'：RSA 算法
       *
       * @param {nymph.pay.emv.PubKeySm/nymph.pay.emv.PubKeyRsa} pubKey CA 公钥数据。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      setCaPubKey: function (algorithmType, pubKey) {
        var result, errorCode, actualPubKey, temp;

        if (algorithmType !== 'SM' && algorithmType !== 'RSA') {
          throw {code: nymphError.PARAM_ERR, message: 'Not support: ' + algorithmType};
        }

        if (!pubKey) {
          throw {code: nymphError.PARAM_ERR, message: 'pubKey is required!'};
        }

        if (algorithmType === 'SM') {
          temp = PubKeySm;
        } else {
          temp = PubKeyRsa;
        }
        try {
          actualPubKey = temp.pack(pubKey);
        } catch (err) {
          if (err) {
            throw {code: nymphError.PARAM_ERR, message: 'invalid pubKey: ' + err.message};
          } else {
            throw {code: nymphError.PARAM_ERR, message: 'invalid pubKey! '};
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'setCaPubKey', [algorithmType, actualPubKey]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to set CA public key.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method getDataApdu
       * 此方法为 EMV 流程中收到 `finalSelection` 事件后使用 APDU 命令方式获取卡片数据元。
       * @param {Object/String/Array} tag 数据元标签。第一个字节为 p1，第二个字节为 p2，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
       * @return {Object} tag 的值。数据类型为 [Buffer](https://nodejs.org/api/buffer.html)
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      getDataApdu: function (tag) {
        var result, errorCode, data;
        result = hermes.exec(this.PLUGINID, this.instanceId, 'getDataApdu', [tools.toBase64(tag)]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to get data apdu.', innerCode: result.innerCode};
          }
        }
        data = new Buffer(result.data, 'base64');
        return data;
      },

      /**
       * @method getBalance
       * 此方法为 EMV 流程中收到 `finalSelection` 事件后获取电子现金余额。
       *
       *     try {
       *         var balance = emv.getBalance();
       *     } catch (err) {
       *         // 失败的处理
       *     }
       *
       * @return {Number} 电子现金余额，以分为单位的整数，如 1111 表示 11.11 元
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      getBalance: function () {
        var result, errorCode, balance;
        result = hermes.exec(this.PLUGINID, this.instanceId, 'getBalance');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to get EC balance.', innerCode: result.innerCode};
          }
        }
        return result.data;
      },

      /**
       * @method getLogs
       * 此方法用于 EMV 流程中收到 `selApp` 事件后获取日志，获取日志后 EMV 流程会结束，产生 `finish` 事件。
       *
       *     try {
       *         var icLogs = getLogs('A0000003330101', 'IC');
       *         icLogs.forEach(function (log, index) {
       *             // 对每个 log 的处理。
       *         });
       *
       *         var ecLogs = getLogs('A0000003330101', 'EC');
       *         ecLogs.forEach(function (log, index) {
       *             // 对每个 log 的处理。
       *         });
       *     } catch (err) {
       *         // 失败的处理
       *     }
       *
       * @param {Object/String/Array} aid 已选中的 AID（不超过 16 个 byte 字节），数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
       * @param {String} logType 日志类型。
       *
       * - 'IC'：获取IC卡卡片交易日志
       * - 'EC'：获取IC卡卡片圈存日志
       *
       * @return {nymph.pay.emv.IcLog[]/nymph.pay.emv.EcLog[]} 日志列表
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      getLogs: function (aid, logType) {
        var result, errorCode, i, logs = [], tempLogs, actualAid;
        if (!aid || !logType) {
          throw {code: nymphError.PARAM_ERR, message: 'aid and logType are both required!'};
        }

        try {
          actualAid = tools.toBase64(aid);
        } catch (err) {
          if (err) {
            throw {code: nymphError.PARAM_ERR, message:  'Invalid aid: ' + err.message};
          } else {
            throw {code: nymphError.PARAM_ERR, message: 'Invalid aid!'};
          }
        }

        if (logType !== 'IC' && logType !== 'EC') {
          throw {code: nymphError.PARAM_ERR, message: 'invalid logType!'};
        }
        result = hermes.exec(this.PLUGINID, this.instanceId, 'getLogs', [actualAid, logType]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to get card logs.', innerCode: result.innerCode};
          }
        }

        if (result.data) {
          tempLogs = result.data;
          tempLogs.forEach(function(item,index){
            var log, unpackedLog;
            if (logType === 'IC') {
              log = IcLog;
            } else {
              log = EcLog;
            }

            unpackedLog = log.unpack(item);
            logs.push(unpackedLog);
          });
        }

        return logs;
      },

      /**
       * @method eventResponse
       * EMV 事件响应。当收到 EMV 的事件以后，需要调用此方法来进行响应，让 EMV 流程正常继续下去。
       *
       *     // 一次只对一个事件进行响应，以下示例代码将所有事件响应列出。
       *     function bindEmvEvents() {
       *         emv.addListener('waitForCard', function (flag) {
       *             // 根据需要进行弹框等操作提示用户插卡或者挥卡
       *             // 获取卡。
       *             cards.waitForCard([{
       *               type: cards.CardType.CPUCARD,
       *               slot: cards.SlotType.ICC1
       *             },{
       *               type: cards.CardType.CPUCARD,
       *               slot: cards.SlotType.RF
       *             }], function (err, card) {
       *             	  if (err) {
       *                    switch (err.code) {
       *                    case nymphError.CANCELLED:
       *                      // 取消读卡的处理。
       *                      break;
       *                    default: // 其他错误情况。
       *                      break;
       *                    }
       *                 } else {
       *                     // 保存卡实例
       *                }
       *             });
       *         });
       *         emv.addListener('selApp', function (candAidList, isReSelect) {
       *             // 根据需要弹框让用户选择
       *             // 以下示例代码选择第 1 个 AID 来让 EMV 流程继续
       *             var selectedAid = candAidList[0];
       *             try {
       *                 // 做了获取日志操作以后就不用再 response 给 emv 内核。
       *                 switch (emvProcessData.startData.purpose) {
       *                   case 'ECLOG':
       *                     var ecLogs = emv.getLogs(selectedAid.aid, 'EC');
       *                     ecLogs.forEach(function (log, index) {
       *                       // 对每个 log 进行操作
       *                     });
       *                     return;
       *                   case 'ICLOG':
       *                     var icLogs = emv.getLogs(selectedAid.aid, 'IC');
       *                     icLogs.forEach(function (log, index) {
       *                       // 对每个 log 进行操作
       *                     });
       *                     return;
       *               }
       *             } catch (err) {
       *                 // 获取日志失败的处理
       *                 return;
       *             }
       *
       *             // 让 EMV 流程继续下去
       *             emv.eventResponse({selApp: selectedAid.aid});
       *         });
       *         emv.addListener('finalSelection', function (aid, kernelId, pid, params) {
       *           	// 根据需要对 EMV 参数进行设置
       *           	params.base.tacDenial = [0xFF, 0x00, 0x00, 0x00, 0x00];
         *          emv.config({base: params.base});
       *
       *            // 获取余额（可选）
       *            try {
       *                 var balance = emv.getBalance();
       *            } catch (err) {
       *                 // 可以主动调用 `stopProcess` 方法结束 EMV 流程。也可以不做处理，让内核继续下去
       *            }
       *
       *            // 如果 GPO 参数与启动流程时候一样没有变化，则此处直接传入空让 EMV 流程继续
       *            emv.eventResponse({finalSelection: null});
       *            // 如果 GPO 参数与启动流程时候不一样，比如交易金额发生变化，则传入新的 GPO 参数让 EMV 流程继续
       *            //var gpo = new emv.Gpo();
       *            //gpo.amount = 2;
       *            //emv.eventResponse({finalSelection: gpo});
       *         });
       *
       *         emv.addListener('finishRf', function () {
       *            	// 蜂鸣
       *             media.beep(media.BeepMode.NORMAL);
       *             // 收到此事件，说明后续 EMV 流程不再需要非接卡片，此时可将卡片释放掉。
       *             card.release();
       *         });
       *
       *         emv.addListener('readRecord', function (record) {
       *             // 设置公钥
       *             var ridBuf = new Buffer(5);
       *             record.aid.copy(ridBuf, 0, 0, ridBuf.length);
       *             // 从公钥列表中找出所需的公钥，进行设置。其中，公钥列表是应用从后台下载或者自行维护的一个列表。
       *             // 以下示例代码是从 emvData 中的公钥列表，由 RID 和 index 唯一确定出一个公钥。
       *             var pubKey = emvData.getPubKey(ridBuf, record.pubKeyIndex);
       *             if (pubKey) {
       *               try {
       *                 emv.setCaPubKey(record.algorithm, pubKey);
       *               } catch (err) {
       *                 // 可以主动调用 `stopProcess` 方法结束 EMV 流程。也可以不做处理，让内核决定是否要继续流程
       *               }
       *             }
       *
       *             // 根据需要显示确认卡号、查询黑名单
       *             // 让 EMV 流程继续下去
       *             emv.eventResponse({readRecord: {isBlack: false, accumulatedAmount: 10000}});
       *         });
       *
       *         emv.addListener('cardHolderInputPin', function (isOnlinePin, leftTimes) {
       *             if (isOnlinePin) {
       *                 // 调用密码键盘的 `inputOnlinePin()` 方法（调用的示例代码请参见 {@link nymph.dev.pinPad.PinPad#inputOnlinePin inputOnlinePin()}），让用户输入密码，并将结果传递给 EMV。
       *                 emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.YES}); // 用户确认密码输入
       *                 // emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.CANCEL}); // 用户取消密码输入/用户没有输密码直接按确认
       *                 // emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.NO}); // 密码输入出错
       *             } else {
       *                 // 调用密码键盘的 `inputOfflinePin()` 方法（调用的示例代码请参见 {@link nymph.dev.pinPad.PinPad#inputOfflinePin inputOfflinePin()}），让用户输入密码，并将结果传递给 EMV。
       *                 emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.YES}); // 用户确认密码输入
       *                 // emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.CANCEL}); // 用户取消密码输入/用户没有输密码直接按确认
       *                 // emv.eventResponse({cardHolderInputPin: emv.ConfirmResult.NO}); // 密码输入出错
       *             }
       *         });
       *
       *         emv.addListener('certVerify', function (certType, certNo) {
       *             // 根据需要进行弹框等操作让用户确认证件信息
       *             // 让 EMV 流程继续下去
       *             emv.eventResponse({certVerify: emv.ConfirmResult.YES});
       *         });
       *         emv.addListener('onlineProc', function (transData) {
       *         	   // 与后台进行联机
       *         	   // 将与后台联机的结果传递给 EMV。以下为示例代码，实际开发时请将后台返回的数据赋值给 hostData。
       *             var hostData = new emv.HostData();
       *             hostData.state = 'SUCCESS';
       *             hostData.arc = [0x30, 0x30];
       *             hostData.authFlag = true;
       *             var field55 = nymphEncoding.hexStringToBuffer('9A031503179F21031056289F02060000000000109F03060000000000009F1A0201565F2A0201569F4E14CEEFC1F7B2E2CAD4C9CCBBA700000000000000009C01199F36022D10');
       *             hostData.field55 = field55;
       *             // 让 EMV 流程继续下去
       *             emv.eventResponse({onlineProc: hostData});
       *         });
       *         emv.addListener('finish', function (retCode, transData) {
       *             // 根据需要进行弹框等操作提示用户取卡
       *            cards.waitForCardTaken(card, function (err) {
       *                // 取卡结果处理
       *           });
       *         });
       *     }
       *
       * @param {Object} params 事件响应参数。不同的事件，响应的参数不一样。
       *
       * @param {Object} params.selApp 选择应用事件响应参数，值为用户选择的 AID，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)
       *
       * @param {nymph.pay.emv.Gpo} params.finalSelection 最终选择事件响应参数。如果与启动流程时候的 GPO 参数一致，可直接设置为 null。
       *
       * @param {Object} params.readRecord 读卡片记录事件响应参数。
       * @param {Boolean} params.readRecord.isBlack 是否黑名单账号：false-否，true-是
       * @param {Number} params.readRecord.accumulatedAmount 同一张卡片连续几笔脱机交易的累积金额。以分为单位的整数，如 1111 表示 11.11 元。
       *
       * @param {nymph.pay.emv.ConfirmResult} params.certVerify 证件验证事件响应参数。
       *
       * @param {nymph.pay.emv.ConfirmResult} params.cardHolderInputPin 输 PIN 事件响应参数。
       *
       * @param {nymph.pay.emv.HostData} params.onlineProc 联机处理事件响应参数。
       *
       * @param {Object/String/Array} params.requestData EMV 内核请求数据事件响应参数。TLV 列表的 buffer 数据。
       *
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       * @member nymph.pay.emv
       */
      eventResponse: function (params) {
        var result, errorCode, key, actualParams = {};
        if (!params) {
          throw {code: nymphError.PARAM_ERR, message: 'params is required!'};
        }
        if (typeof params !== 'object'){
          throw {code: nymphError.PARAM_ERR, message: 'params should be an object!'};
        }

        for (key in params) {
          if (params.hasOwnProperty(key)) {
            switch (key) {
              case 'selApp':
                actualParams[key] = tools.toBase64(params[key]);
                break;
              case 'readRecord':
                actualParams[key] = {};
                actualParams[key].accumulatedAmount = params[key].accumulatedAmount;
                actualParams[key].isBlack = params[key].isBlack;
                break;
              case 'finalSelection':
                if (params[key] === null) {
                  actualParams[key] = {};
                } else {
                  actualParams[key] = Gpo.pack(params[key]);
                }
                break;
              case 'onlineProc':
                actualParams[key] = HostData.pack(params[key]);
                break;
              case 'requestData':
                actualParams[key] = tools.toBase64(params[key]);
                break;
              default:
                actualParams[key] = params[key];
                break;
            }
          }
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'eventResponse', [actualParams]);
        errorCode = this.getError(result.innerCode);
        // console.log('eventResponse actualParams:' + JSON.stringify(actualParams));
        // console.log('eventResponse result:' + JSON.stringify(result));
        // console.log('eventResponse errorCode:' + JSON.stringify(errorCode));
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to response to EMV.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method clean
       * 清理内核交易数据
       *
       *     try {
       *         emv.clean();
       *     } catch (err) {
       *         // 失败的处理
       *     }
       * @member nymph.pay.emv
       */
      clean: function () {
        var result, errorCode;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'clean');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to clean EMV transaction data.', innerCode: result.innerCode};
          }
        }
      },

      /**
       * @method stopProcess
       * 此方法用于主动停止 EMV 流程。停止结果由 finish 事件传出。
       * @param {nymph.error.NymphError} reason 停止 EMV 流程的原因。
       * @member nymph.pay.emv
       */
      stopProcess: function (reason) {
        var self = this,
            actualReason = 'STOP';
        if (reason) {
          actualReason = reason;
        }
        hermes.exec(self.PLUGINID, self.instanceId, 'stopProcess', [actualReason]);
      },

      /**
       * @ignore
       * 此方法用于将指定类型的参数转换成 TLV 格式的 buffer。
       * @param {String} type EMV 内核类型。
       * @param {Object} param 要转换成 TLV 的参数。
       * @returns {Object}  TLV 格式的 buffer。
       */
      getTlvData: function (type, param) {
        var result, errorCode, temp, key, actualParam;
        switch (type) {
          case 'EMV':
            actualParam = BasicParams.pack(param);
            break;
          case 'PBOC':
            actualParam = PbocParams.pack(param);
            break;
          case 'VISA':
            actualParam = VisaParams.pack(param);
            break;
          case 'MASTER':
            actualParam = MasterParams.pack(param);
            break;
          case 'START_DATA':
            actualParam = StartData.pack(param);
            break;
          case 'GPO':
            temp = new Gpo();
            actualParam = Gpo.pack(param);
            break;
          case 'TERMINAL_MANAGE':
          case 'AID':
          case 'CARDHOLDER_VERIFY_RESULT':
            actualParam = param;
            break;
          case 'HOST_DATA':
            actualParam = HostData.pack(param);
            break;
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'getTlvData', [type, actualParam]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to get param TLV data.', innerCode: result.innerCode};
          }
        }

        if (result.data) {
          return new Buffer(result.data, 'base64');
        } else {
          return null;
        }
      },

      /**
       * @ignore
       * 此方法用于获取所有的参数（测试使用）。
       * @returns {Object}  所有的参数。
       */
      getParams: function () {
        var result, errorCode;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'getParams');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          if (result.hasOwnProperty('message')) {
            throw {code: errorCode, message: result.message, innerCode: result.innerCode};
          } else {
            throw {code: errorCode, message: 'Failed to get params.', innerCode: result.innerCode};
          }
        }
        return result.data;
      },

      /**
       * @ignore
       * @param {Number} innerCode 底层上传的返回码
       * @returns {String} 返回码对应的字符串
       * @member nymph.pay.emv
       */
      getError: function (innerCode) {
        var ErrorCode = this.ErrorCode;
        switch (innerCode) {
          case -8000:
            return ErrorCode.EMV_BASE_ERR;
          case -8001: // AID 长度错误或为空
            return ErrorCode.EMV_INVALID_AID;
          case -8002: // 动作标识错误。
            return ErrorCode.EMV_INVALID_OPERATION;
          case -8003: // AID 存储空间已满（ 当前内核最多支持 25 个 AID）
            return ErrorCode.EMV_AID_LIST_FULL;
          case -8004: // 部分选择标识错误
            return ErrorCode.EMV_PART_SELECT_ERR;
          case -8005: // CA 公钥索引列表已满（当前内核最多可支持 6 组不同 RID 公钥索引列表）
            return ErrorCode.EMV_CA_INDEX_LIST_FULL;
          case -8006: // 参数错误， RID 为空
            return ErrorCode.EMV_RID_NULL;
          case -8007: // 公钥索引列表长度超过最大值
            return ErrorCode.EMV_CA_INDEX_LIST_LEN_EXCEED;
          case -8008: // 公钥 Hash 值校验失败
            return ErrorCode.EMV_CA_HASH_FAILED;
          case -8009: // 公钥数据格式错，请严格按照公钥结构定义的数据格式设置公钥数据
            return ErrorCode.EMV_CA_DATA_ERR;
          case -8010: // 回收证书列表空间已满
            return ErrorCode.EMV_REC_CERT_LIST_FULL;
          case -8011: // 添加的回收证书已经存在，重复添加
            return ErrorCode.EMV_REC_CERT_ALREADY_EXIST;
          case -8012: // 参数错误，回收证书指针为空
            return ErrorCode.EMV_REC_CERT_NULL;
          case -8013: // 参数错误， DOL 值域及其长度指针为空
            return ErrorCode.EMV_DOL_NULL;
          case -8014: // 参数错误， DOL 类型错误
            return ErrorCode.EMV_DOL_TYPE_ERR;
          case -8015: // 设置 DOL 长度超过最大长度
            return ErrorCode.EMV_DOL_LEN_EXCEED;
          case -8016: // DOL 数据格式错误
            return ErrorCode.EMV_DOL_DATA_ERR;
          case -8017: // EMV 工作线程忙碌中，请稍后再尝试
            return ErrorCode.EMV_BUSY;
          case -8018: // 信号标识错误， 交易未激活不能发送 NEXT 信号
            return ErrorCode.EMV_PROCESS_NOT_STARTED;
          case -8019: // 参数数据不符合 TLV 格式
            return ErrorCode.EMV_PARAM_NOT_TLV;
          case -8020: // 信号标识错误，未定义的信号标识 XX
            return ErrorCode.EMV_UNSUPPORTED_CMD;
          case -8021: // 信号参数长度错误
            return ErrorCode.EMV_CMD_PARAM_LEN_ERR;
          case -8022: // 参数错误
            return ErrorCode.EMV_TLV_PARAM_ERR;
          case -8023: // IC 卡数据元标签，不可设置
            return ErrorCode.EMV_UNSUPPORTED_IC_TAG;
          case -8024: // 不可识别内核类型
            return ErrorCode.EMV_UNKNOWN_KERNEL;
          case -8025: // 数据格式错误
            return ErrorCode.EMV_DATA_ERR;
          case -8026: // 该标签未被赋值
            return ErrorCode.EMV_TAG_NOT_SET;
          case -8027: // 不可识别标签
            return ErrorCode.EMV_UNKNOWN_TAG;
          case -8028: // 标签错误
            return ErrorCode.EMV_TAG_ERR;
          case -8029: // 卡片不支持 IC 日志获取
            return ErrorCode.EMV_CARD_NOT_SUPPORT_IC_LOG;
          case -8030: // 卡片不支持 EC 日志获取
            return ErrorCode.EMV_CARD_NOT_SUPPORT_EC_LOG;
          case -8031: // 请尝试其他通信界面
            return ErrorCode.EMV_OTHER_INTERFACE;
          case -8999: // 其他异常错误
            return ErrorCode.EMV_OTHER_ERR;
          default:
            return nymphError.getError(innerCode);
        }
      },

      /**
       * @ignore
       * @param {Number} retCode EMV 交易结果码
       * @returns {String} 返回码对应的字符串
       * @member nymph.pay.emv
       */
      getReturnCode: function (retCode) {
        var self = this;
        switch (retCode) {
          case 0xEE01:
            return self.ReturnCode.BUSY; // EMV 工作线程忙碌中，请稍候再尝试
          case 0xEE02:
          case 0xF1A7E001:
            return self.ReturnCode.NO_APP; // 终端卡片应用未匹配， 无候选应用
          case 0xEE03:
            return self.ReturnCode.NO_PUB_KEY; // 非接小额支付，检测到未设置交易公钥
          case 0xEE04:
            return self.ReturnCode.EXPIRY; // 卡片应用过期，交易终止
          case 0xEE06:
            return self.ReturnCode.FLASH_CARD; // 非接快速支付，发生闪卡
          case 0xEE07:
            return self.ReturnCode.STOP; // STOP 信号请求终止，交易主动退出
          case 0xEE08:
            return self.ReturnCode.REPOWER_ICC; // 卡片通讯错误
          case 0xEE09:
            return self.ReturnCode.REFUSE_SERVICE; // 卡片不允许服务
          case 0xEE0A:
            return self.ReturnCode.CARD_LOCK; // 卡片锁定(SW=6A81)
          case 0xEE0B:
            return self.ReturnCode.APP_LOCK; // 应用锁定(SW=6283)
          case 0xEE0C:
            return self.ReturnCode.EXCEED_CTLMT; // 交易金额超过非接限额
          case 0xEE0D:
            return self.ReturnCode.GPO_6985; // GPO 卡片返回 6985
          case 0xEE0E:
            return self.ReturnCode.GAC_6985; // Generate AC 卡片返回 6985
          default:
            return nymphError.UNKNOWN;
        }
      },
    };

    /**
     * # EMV 错误码
     * @class nymph.pay.emv.ErrorCode
     */
    var ErrorCode = {
      /**
       * @property {String} [EMV_BASE_ERR='EMV_BASE_ERR'] 基础错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_BASE_ERR: 'EMV_BASE_ERR',

      /**
       * @property {String} [EMV_INVALID_AID='EMV_INVALID_AID'] AID 长度错误或者 AID 为空。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_INVALID_AID: 'EMV_INVALID_AID',

      /**
       * @property {String} [EMV_INVALID_OPERATION='EMV_INVALID_OPERATION'] 动作标识错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_INVALID_OPERATION: 'EMV_INVALID_OPERATION',

      /**
       * @property {String} [EMV_AID_LIST_FULL='EMV_AID_LIST_FULL'] AID 存储空间已满（ 当前内核最多支持 25 个 AID）。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_AID_LIST_FULL: 'EMV_AID_LIST_FULL',

      /**
       * @property {String} [EMV_PART_SELECT_ERR='EMV_PART_SELECT_ERR'] 部分选择标识错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_PART_SELECT_ERR: 'EMV_PART_SELECT_ERR',

      /**
       * @property {String} [EMV_CA_INDEX_LIST_FULL='EMV_CA_INDEX_LIST_FULL'] CA 公钥索引列表已满（当前内核最多可支持 6 组不同 RID 公钥索引列表）。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_CA_INDEX_LIST_FULL: 'EMV_CA_INDEX_LIST_FULL',

      /**
       * @property {String} [EMV_RID_NULL='EMV_RID_NULL'] 参数错误， RID 为空。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_RID_NULL: 'EMV_RID_NULL',

      /**
       * @property {String} [EMV_CA_INDEX_LIST_LEN_EXCEED='EMV_CA_INDEX_LIST_LEN_EXCEED'] 公钥索引列表长度超过最大值。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_CA_INDEX_LIST_LEN_EXCEED: 'EMV_CA_INDEX_LIST_LEN_EXCEED',

      /**
       * @property {String} [EMV_CA_HASH_FAILED='EMV_CA_HASH_FAILED'] 公钥 Hash 值校验失败。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_CA_HASH_FAILED: 'EMV_CA_HASH_FAILED',

      /**
       * @property {String} [EMV_CA_DATA_ERR='EMV_CA_DATA_ERR'] 公钥数据格式错，请严格按照公钥结构定义的数据格式设置公钥数据。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_CA_DATA_ERR: 'EMV_CA_DATA_ERR',

      /**
       * @property {String} [EMV_REC_CERT_LIST_FULL='EMV_REC_CERT_LIST_FULL'] 回收证书列表空间已满。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_REC_CERT_LIST_FULL: 'EMV_REC_CERT_LIST_FULL',

      /**
       * @property {String} [EMV_REC_CERT_ALREADY_EXIST='EMV_REC_CERT_ALREADY_EXIST'] 添加的回收证书已经存在，重复添加。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_REC_CERT_ALREADY_EXIST: 'EMV_REC_CERT_ALREADY_EXIST',

      /**
       * @property {String} [EMV_REC_CERT_NULL='EMV_REC_CERT_NULL'] 参数错误，回收证书指针为空。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_REC_CERT_NULL: 'EMV_REC_CERT_NULL',

      /**
       * @property {String} [EMV_DOL_NULL='EMV_DOL_NULL'] 参数错误， DOL 值域及其长度指针为空。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_DOL_NULL: 'EMV_DOL_NULL',

      /**
       * @property {String} [EMV_DOL_TYPE_ERR='EMV_DOL_TYPE_ERR'] 参数错误， DOL 类型错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_DOL_TYPE_ERR: 'EMV_DOL_TYPE_ERR',

      /**
       * @property {String} [EMV_DOL_LEN_EXCEED='EMV_DOL_LEN_EXCEED'] 设置 DOL 长度超过最大长度。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_DOL_LEN_EXCEED: 'EMV_DOL_LEN_EXCEED',

      /**
       * @property {String} [EMV_DOL_DATA_ERR='EMV_DOL_DATA_ERR'] DOL 数据格式错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_DOL_DATA_ERR: 'EMV_DOL_DATA_ERR',

      /**
       * @property {String} [EMV_BUSY='EMV_BUSY'] EMV 工作线程忙碌中，请稍后再尝试。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_BUSY: 'EMV_BUSY',

      /**
       * @property {String} [EMV_PROCESS_NOT_STARTED='EMV_PROCESS_NOT_STARTED'] 信号标识错误， 交易未激活不能发送 NEXT 信号。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_PROCESS_NOT_STARTED: 'EMV_PROCESS_NOT_STARTED',

      /**
       * @property {String} [EMV_PARAM_NOT_TLV='EMV_PARAM_NOT_TLV'] 参数数据不符合 TLV 格式。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_PARAM_NOT_TLV: 'EMV_PARAM_NOT_TLV',

      /**
       * @property {String} [EMV_UNSUPPORTED_CMD='EMV_UNSUPPORTED_CMD'] 信号标识错误，未定义的信号标识 XX。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_UNSUPPORTED_CMD: 'EMV_UNSUPPORTED_CMD',

      /**
       * @property {String} [EMV_CMD_PARAM_LEN_ERR='EMV_CMD_PARAM_LEN_ERR'] 信号参数长度错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_CMD_PARAM_LEN_ERR: 'EMV_CMD_PARAM_LEN_ERR',

      /**
       * @property {String} [EMV_TLV_PARAM_ERR='EMV_TLV_PARAM_ERR'] 参数错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_TLV_PARAM_ERR: 'EMV_TLV_PARAM_ERR',

      /**
       * @property {String} [EMV_UNSUPPORTED_IC_TAG='EMV_UNSUPPORTED_IC_TAG'] IC 卡数据元标签，不可设置。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_UNSUPPORTED_IC_TAG: 'EMV_UNSUPPORTED_IC_TAG',

      /**
       * @property {String} [EMV_UNKNOWN_KERNEL='EMV_UNKNOWN_KERNEL'] 不可识别内核类型。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_UNKNOWN_KERNEL: 'EMV_UNKNOWN_KERNEL',

      /**
       * @property {String} [EMV_DATA_ERR='EMV_DATA_ERR'] 数据格式错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_DATA_ERR: 'EMV_DATA_ERR',

      /**
       * @property {String} [EMV_TAG_NOT_SET='EMV_TAG_NOT_SET'] 该标签未被赋值。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_TAG_NOT_SET: 'EMV_TAG_NOT_SET',

      /**
       * @property {String} [EMV_UNKNOWN_TAG='EMV_UNKNOWN_TAG'] 不可识别标签。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_UNKNOWN_TAG: 'EMV_UNKNOWN_TAG',

      /**
       * @property {String} [EMV_TAG_ERR='EMV_TAG_ERR'] 标签错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_TAG_ERR: 'EMV_TAG_ERR',

      /**
       * @property {String} [EMV_CARD_NOT_SUPPORT_IC_LOG='EMV_CARD_NOT_SUPPORT_IC_LOG'] 卡片不支持 IC 日志获取。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_CARD_NOT_SUPPORT_IC_LOG: 'EMV_CARD_NOT_SUPPORT_IC_LOG',

      /**
       * @property {String} [EMV_CARD_NOT_SUPPORT_EC_LOG='EMV_CARD_NOT_SUPPORT_EC_LOG'] 卡片不支持 EC 日志获取。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_CARD_NOT_SUPPORT_EC_LOG: 'EMV_CARD_NOT_SUPPORT_EC_LOG',

      /**
       * @property {String} [EMV_OTHER_INTERFACE='EMV_OTHER_INTERFACE'] 请尝试其他通信界面。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_OTHER_INTERFACE: 'EMV_OTHER_INTERFACE',

      /**
       * @property {String} [EMV_OTHER_ERR='EMV_OTHER_ERR'] 其他错误。
       * @member nymph.pay.emv.ErrorCode
       */
      EMV_OTHER_ERR: 'EMV_OTHER_ERR',
    };

    /**
     * # EMV 内核类型
     * @class nymph.pay.emv.KernelId
     */
    var KernelId = {
      /**
       * @property {String} [EMV='EMV'] 接触EMV标准流程
       * @member nymph.pay.emv.KernelId
       */
      EMV: 'EMV',

      /**
       * @property {String} [EMV_CONTACTLESS='EMV_CONTACTLESS'] 非接EMV kernel（暂未支持）
       * @member nymph.pay.emv.KernelId
       */
      EMV_CONTACTLESS: 'EMV_CONTACTLESS',

      /**
       * @property {String} [MASTER='MASTER'] MASTER
       * @member nymph.pay.emv.KernelId
       */
      MASTER: 'MASTER',

      /**
       * @property {String} [VISA='VISA'] VISA
       * @member nymph.pay.emv.KernelId
       */
      VISA: 'VISA',

      /**
       * @property {String} [AMEX='AMEX'] AMEX（暂未支持）
       * @member nymph.pay.emv.KernelId
       */
      AMEX: 'AMEX',

      /**
       * @property {String} [JCB='JCB'] JCB（暂未支持）
       * @member nymph.pay.emv.KernelId
       */
      JCB: 'JCB',

      /**
       * @property {String} [PBOC='PBOC'] PBOC
       * @member nymph.pay.emv.KernelId
       */
      PBOC: 'PBOC'
    };

    /**
     * # EMV 流程返回码
     * @class nymph.pay.emv.ProcessReturnCode
     */
    var ProcessReturnCode = {
      /**
       * @property {String} [BUSY='BUSY'] EMV 工作线程正工作中，请稍候再尝试
       * @member nymph.pay.emv.ProcessReturnCode
       */
      BUSY: 'BUSY',

      /**
       * @property {String} [NO_APP='NO_APP'] 终端 AID 列表为空或者卡片与终端 AID 不匹配，无候选应用
       * @member nymph.pay.emv.ProcessReturnCode
       */
      NO_APP: 'NO_APP',

      /**
       * @property {String} [NO_PUB_KEY='NO_PUB_KEY'] 非接小额支付，检测到未设置交易公钥，交易终止
       * @member nymph.pay.emv.ProcessReturnCode
       */
      NO_PUB_KEY: 'NO_PUB_KEY',

      /**
       * @property {String} [EXPIRY='EXPIRY'] 卡片应用过期，交易终止
       * @member nymph.pay.emv.ProcessReturnCode
       */
      EXPIRY: 'EXPIRY',

      /**
       * @property {String} [FLASH_CARD='FLASH_CARD'] 非接快速支付，发生闪卡，交易终止，请执行补救措施
       * @member nymph.pay.emv.ProcessReturnCode
       */
      FLASH_CARD: 'FLASH_CARD',

      /**
       * @property {String} [STOP='STOP'] STOP 信号请求终止，交易主动退出
       * @member nymph.pay.emv.ProcessReturnCode
       */
      STOP: 'STOP',

      /**
       * @property {String} [REPOWER_ICC='REPOWER_ICC'] 对卡片重新上电并开始交易（不重新输入金额）
       * @member nymph.pay.emv.ProcessReturnCode
       */
      REPOWER_ICC: 'REPOWER_ICC',

      /**
       * @property {String} [REFUSE_SERVICE='REFUSE_SERVICE'] 卡片不允许服务
       * @member nymph.pay.emv.ProcessReturnCode
       */
      REFUSE_SERVICE: 'REFUSE_SERVICE',

      /**
       * @property {String} [CARD_LOCK='CARD_LOCK'] 卡片锁定 (SW6A81)
       * @member nymph.pay.emv.ProcessReturnCode
       */
      CARD_LOCK: 'CARD_LOCK',

      /**
       * @property {String} [APP_LOCK='APP_LOCK'] 应用锁定 (SW6283)
       * @member nymph.pay.emv.ProcessReturnCode
       */
      APP_LOCK: 'APP_LOCK',

      /**
       * @property {String} [EXCEED_CTLMT='EXCEED_CTLMT'] 交易金额超过非接限额
       * @member nymph.pay.emv.ProcessReturnCode
       */
      EXCEED_CTLMT: 'EXCEED_CTLMT',

      /**
       * @property {String} [GPO_6985='GPO_6985'] GPO 卡片返回 6985
       * @member nymph.pay.emv.ProcessReturnCode
       */
      GPO_6985: 'GPO_6985',

      /**
       * @property {String} [GAC_6985='GAC_6985'] Generate AC 卡片返回 6985
       * @member nymph.pay.emv.ProcessReturnCode
       */
      GAC_6985: 'GAC_6985'
    };

    /**
     * # 内核指令
     * @class nymph.pay.emv.Ins
     */
    var Ins = {
      /**
       * @property {String} [SET_TORN='SET_TORN']
       * 发送闪卡交易数据
       * data 为 TLV buffer
       * @member nymph.pay.emv.Ins
       */
      SET_TORN: 'SET_TORN',

      /**
       * @property {String} [DEL_TORN='DEL_TORN']
       * 通知删除闪卡记录
       * data 为 TLV buffer，包含主账号和主账户序列号
       * @member nymph.pay.emv.Ins
       */
      DEL_TORN: 'DEL_TORN',

      /**
       * @property {String} [DISPLAY='DISPLAY']
       * 发送交互显示信息
       * data ：
       * - messageId：{String}
       * - flag：{String}
       * - message：{String}
       * @member nymph.pay.emv.Ins
       */
      DISPLAY: 'DISPLAY',

      /**
       * @property {String} [CLOSE_RF='CLOSE_RF']
       * 通知关闭射频载波
       * @member nymph.pay.emv.Ins
       */
      CLOSE_RF: 'CLOSE_RF',

      /**
       * @property {String} [GET_TORN='GET_TORN']
       * 获取闪卡交易数据
       * data 为 TLV buffer，包含主账号和主账户序列号
       * @member nymph.pay.emv.Ins
       */
      GET_TORN: 'GET_TORN'
    };

    /**
     * # 列表操作选项
     * @class nymph.pay.emv.ListOperation
     */
    var ListOperation = {
      /**
       * @property {String} [ADD='ADD'] 添加一个列表元素
       * @member nymph.pay.emv.ListOperation
       */
      ADD: 'ADD',

      /**
       * @property {String} [REMOVE='REMOVE'] 移除一个列表元素
       * @member nymph.pay.emv.ListOperation
       */
      REMOVE: 'REMOVE',

      /**
       * @property {String} [CLEAR='CLEAR'] 清空列表
       * @member nymph.pay.emv.ListOperation
       */
      CLEAR: 'CLEAR'
    };

    /**
     * # 确认结果
     * @class nymph.pay.emv.ConfirmResult
     */
    var ConfirmResult = {
      /**
       * @property {String} [YES='YES'] 确认
       * @member nymph.pay.emv.ConfirmResult
       */
      YES: 'YES',

      /**
       * @property {String} [NO='NO'] 否认
       * @member nymph.pay.emv.ConfirmResult
       */
      NO: 'NO',

      /**
       * @property {String} [CANCEL='CANCEL'] 取消
       * @member nymph.pay.emv.ConfirmResult
       */
      CANCEL: 'CANCEL'
    };

    /**
     * # 证件类型
     * @class nymph.pay.emv.CertType
     */
    var CertType = {
      /**
       * @property {String} [PERSON_ID='PERSON_ID'] 身份证
       * @member nymph.pay.emv.CertType
       */
      PERSON_ID: 'PERSON_ID',

      /**
       * @property {String} [MILITARY_ID='MILITARY_ID'] 军官证
       * @member nymph.pay.emv.CertType
       */
      MILITARY_ID: 'MILITARY_ID',

      /**
       * @property {String} [PASSPORT='PASSPORT'] 护照
       * @member nymph.pay.emv.CertType
       */
      PASSPORT: 'PASSPORT',

      /**
       * @property {String} [ENTRY_PERMIT='PASSPORT'] 入境证
       * @member nymph.pay.emv.CertType
       */
      ENTRY_PERMIT: 'ENTRY_PERMIT',

      /**
       * @property {String} [TEMP_ID='TEMP_ID'] 临时身份证
       * @member nymph.pay.emv.CertType
       */
      TEMP_ID: 'TEMP_ID',

      /**
       * @property {String} [OTHER='OTHER'] 其它证件
       * @member nymph.pay.emv.CertType
       */
      OTHER: 'OTHER'
    };

    /**
     * @property {nymph.pay.emv.ErrorCode} ErrorCode EMV 错误码
     * @member nymph.pay.emv
     */
    emv.ErrorCode = ErrorCode;

    /**
     * @property {nymph.pay.emv.BasicParams} BasicParams EMV 交易基本参数
     * @member nymph.pay.emv
     */
    emv.BasicParams = BasicParams;

    /**
     * @property {nymph.pay.emv.CandidateAid} CandidateAid AID 候选项
     * @member nymph.pay.emv
     */
    emv.CandidateAid = CandidateAid;

    /**
     * @property {nymph.pay.emv.EcLog} EcLog IC 卡片圈存日志
     * @member nymph.pay.emv
     */
    emv.EcLog = EcLog;

    /**
     * @property {nymph.pay.emv.Gpo} Gpo GPO 参数
     * @member nymph.pay.emv
     */
    emv.Gpo = Gpo;

    /**
     * @property {nymph.pay.emv.HostData} HostData EMV 交易数据
     * @member nymph.pay.emv
     */
    emv.HostData = HostData;

    /**
     * @property {nymph.pay.emv.IcLog} IcLog IC 卡片交易日志
     * @member nymph.pay.emv
     */
    emv.IcLog = IcLog;

    /**
     * @property {nymph.pay.emv.InitialData} InitialData EMV 终端初始化参数
     * @member nymph.pay.emv
     */
    emv.InitialData = InitialData;

    /**
     * @property {nymph.pay.emv.MasterParams} MasterParams MASTER 交易参数
     * @member nymph.pay.emv
     */
    emv.MasterParams = MasterParams;

    /**
     * @property {nymph.pay.emv.PbocParams} PbocParams PBOC 接触与非接交易参数
     * @member nymph.pay.emv
     */
    emv.PbocParams = PbocParams;

    /**
     * @property {nymph.pay.emv.PubKeyRsa} PubKeyRsa RSA 算法公钥
     * @member nymph.pay.emv
     */
    emv.PubKeyRsa = PubKeyRsa;

    /**
     * @property {nymph.pay.emv.PubKeySm} PubKeySm SM 算法公钥
     * @member nymph.pay.emv
     */
    emv.PubKeySm = PubKeySm;

    /**
     * @property {nymph.pay.emv.PubKeySmGroup} PubKeySmGroup 椭圆曲线参数
     * @member nymph.pay.emv
     */
    emv.PubKeySmGroup = PubKeySmGroup;

    /**
     * @property {nymph.pay.emv.RecCert} RecCert 回收公钥证书
     * @member nymph.pay.emv
     */
    emv.RecCert = RecCert;

    /**
     * @property {nymph.pay.emv.Record} Record 读卡片记录返回数据
     * @member nymph.pay.emv
     */
    emv.Record = Record;

    /**
     * @property {nymph.pay.emv.StartData} StartData EMV 流程启动数据
     * @member nymph.pay.emv
     */
    emv.StartData = StartData;

    /**
     * @property {nymph.pay.emv.TransData} TransData EMV 交易数据
     * @member nymph.pay.emv
     */
    emv.TransData = TransData;

    /**
     * @property {nymph.pay.emv.VisaParams} VisaParams VISA 非接交易参数
     * @member nymph.pay.emv
     */
    emv.VisaParams = VisaParams;

    /**
     * @property {nymph.pay.emv.KernelId} KernelId EMV 内核类型
     * @member nymph.pay.emv
     */
    emv.KernelId = KernelId;

    /**
     * @property {nymph.pay.emv.FlowType} FlowType 交易流程类型
     * @member nymph.pay.emv
     */
    emv.FlowType = TransData.FlowType;

    /**
     * @property {nymph.pay.emv.ServiceType} ServiceType 服务类型
     * @member nymph.pay.emv
     */
    emv.ServiceType = Gpo.ServiceType;

    /**
     * @property {nymph.pay.emv.GacFlag} GacFlag GAC 控制标识
     * @member nymph.pay.emv
     */
    emv.GacFlag = Gpo.GacFlag;

    /**
     * @property {nymph.pay.emv.AcType} AcType 交易结果
     * @member nymph.pay.emv
     */
    emv.AcType = TransData.AcType;

    /**
     * @property {nymph.pay.emv.ProcessReturnCode} ProcessReturnCode 交易返回码
     * @member nymph.pay.emv
     */
    emv.ReturnCode = ProcessReturnCode;

    /**
     * @property {nymph.pay.emv.Ins} Ins 内核指令
     * @member nymph.pay.emv
     */
    emv.Ins = Ins;

    /**
     * @property {nymph.pay.emv.Cvm} Cvm 持卡人验证类型
     * @member nymph.pay.emv
     */
    emv.Cvm = TransData.Cvm;

    /**
     * @property {nymph.pay.emv.ListOperation} ListOperation 列表操作选项
     * @member nymph.pay.emv
     */
    emv.ListOperation = ListOperation;

    /**
     * @property {nymph.pay.emv.ConfirmResult} ConfirmResult 确认结果
     * @member nymph.pay.emv
     */
    emv.ConfirmResult = ConfirmResult;

    /**
     * @property {nymph.pay.emv.StartPurpose} StartPurpose 流程目的
     * @member nymph.pay.emv
     */
    emv.StartPurpose = StartData.StartPurpose;

    /**
     * @property {nymph.pay.emv.PseFlag} PseFlag 应用选择路径
     * @member nymph.pay.emv
     */
    emv.PseFlag = StartData.PseFlag;

    /**
     * @property {nymph.pay.emv.Interface} Interface 交互界面
     * @member nymph.pay.emv
     */
    emv.Interface = StartData.Interface;

    /**
     * @property {nymph.pay.emv.CertType} CertType 证件类型
     * @member nymph.pay.emv
     */
    emv.CertType = CertType;

    /**
     * @property {nymph.pay.emv.MasterMode} MasterMode Master 流程类型
     * @member nymph.pay.emv
     */
    emv.MasterMode = MasterParams.MasterMode;

    /**
     * @property {nymph.pay.emv.MasterBalanceFlag} MasterBalanceFlag Master 读取余额标识
     * @member nymph.pay.emv
     */
    emv.MasterBalanceFlag = MasterParams.MasterBalanceFlag;

    hermes.addEventSupport(emv);
    hermes.addJsPluginInstance(emv.PLUGINID, emv);
    emv.bindEvents();
    module.exports = emv;

    },{"./basic-params":44,"./candidate-aid":45,"./ec-log":46,"./gpo":47,"./host-data":48,"./ic-log":49,"./initial-data":50,"./master-params":51,"./pboc-params":52,"./pub-key-rsa":53,"./pub-key-sm":55,"./pub-key-sm-group":54,"./rec-cert":56,"./record":57,"./start-data":58,"./trans-data":59,"./visa-params":60,"buffer":"buffer","error":"error","hermes":"hermes","nymph-encoding":"nymph-encoding","tools":"tools"}],
    "error":[function(require,module,exports){
    'use strict';

    /**
     * # nymph 错误模块（模块名：error）
     * @class nymph.error
     * @singleton
     * 本模块为错误入口模块，通过 `requrie('error')` 的方式获取，包含以下两部分内容：
     *
     * - 错误类。
     * - 所有与错误相关的类和对象。
     */
    var error = {
        /**
         * @property {String} [SUCCESS='SUCCESS'] 操作成功。
         * @member nymph.error
         */
        SUCCESS: 'SUCCESS',

        /**
         * @property {String} [ERROR='ERROR'] 操作失败。
         * @member nymph.error
         */
        ERROR: 'ERROR',

        /**
         * @property {String} [UNKNOWN='UNKNOWN'] 未知错误。
         * @member nymph.error
         */
        UNKNOWN: 'UNKNOWN',

        /**
         * @property {String} [PARAM_ERR='PARAM_ERR'] 参数错误。
         * @member nymph.error
         */
        PARAM_ERR: 'PARAM_ERR',

        /**
         * @property {String} [DEVICE_USED='DEVICE_USED'] 设备已经打开。
         * @member nymph.error
         */
        DEVICE_USED: 'DEVICE_USED',

        /**
         * @property {String} [DEVICE_NOT_AVAILABLE='DEVICE_NOT_AVAILABLE'] 设备不存在或无法使用。
         * @member nymph.error
         */
        DEVICE_NOT_AVAILABLE: 'DEVICE_NOT_AVAILABLE',

        /**
         * @property {String} [TIMEOUT='TIMEOUT'] 超时
         * @member nymph.error
         */
        TIMEOUT: 'TIMEOUT',

        /**
         * @property {String} [CANCELLED='CANCELLED'] 取消
         * @member nymph.error
         */
        CANCELLED: 'CANCELLED',

        /**
         * @property {String} [NO_PERMISSION='NO_PERMISSION'] 不允许的操作
         * @member nymph.error
         */
        NO_PERMISSION: 'NO_PERMISSION',

        /**
         * @property {String} [SDK_EXCEPTION='SDK_EXCEPTION'] SDK 异常错误
         * @member nymph.error
         */
        SDK_EXCEPTION: 'SDK_EXCEPTION',

        /**
         * @property {String} [SERVICE_EXCEPTION='SERVICE_EXCEPTION'] service 异常错误
         * @member nymph.error
         */
        SERVICE_EXCEPTION: 'SERVICE_EXCEPTION',

        /**
         * @property {String} [CREATE_INSTANCE_FAILED='CREATE_INSTANCE_FAILED'] 创建实例失败
         * @member nymph.error
         */
        CREATE_INSTANCE_FAILED: 'CREATE_INSTANCE_FAILED',

        /**
         * @property {String} [INSTANCE_NOT_FOUND='INSTANCE_NOT_FOUND'] 实例未找到
         * @member nymph.error
         */
        INSTANCE_NOT_FOUND: 'INSTANCE_NOT_FOUND',

        /**
         * @property {String} [COMMAND_NOT_SUPPORT='COMMAND_NOT_SUPPORT'] 不支持的命令
         * @member nymph.error
         */
        COMMAND_NOT_SUPPORT: 'COMMAND_NOT_SUPPORT',

        /**
         * @property {String} [OTHER_ERR='OTHER_ERR'] 其他异常错误
         * @member nymph.error
         */
        OTHER_ERR: 'OTHER_ERR',

        /**
         * @property {String} [COMM_ERR='COMM_ERR'] 通讯错误。
         * @member nymph.error
         */
        COMM_ERR: 'COMM_ERR',

        getError: function (innerCode) {
            switch (innerCode) {
                case 0:
                    return this.SUCCESS;
                case -1: // 银商
                case 0x01: // EM_ERROR：错误
                case 0x8F: // EM_FAILED：操作失败
                    return this.ERROR;
                case -2: // 银商
                case 0x8B: // EM_ERRPARAM
                    return this.PARAM_ERR;
                case -3: // 银商
                case 0x8A: // EM_TIMEOUT
                    return this.TIMEOUT;
                case -4: // 银商：设备未登入
                case 0x8D: // EM_DEVICE_DISABLE：设备禁止使用
                    return this.DEVICE_NOT_AVAILABLE;
                case 0x89: // EM_DEVICE_USED
                    return this.DEVICE_USED;
                case 0x1B: // EM_ABOLISH
                    return this.CANCELLED;
                case 0x86: // EM_NOTPERMIT：不允许的操作
                    return this.NO_PERMISSION;
                case -5: // 适配层
                    return this.SDK_EXCEPTION;
                case -6: // 适配层
                    return this.CREATE_INSTANCE_FAILED;
                case -7: // 适配层
                    return this.INSTANCE_NOT_FOUND;
                case -8: // 适配层
                    return this.COMMAND_NOT_SUPPORT;
                case 0x8E: // EM_ALLOCERR：内存分配失败
                case 0x8C: // EM_ERRHANDLE：句柄错误
                case 0x87: // EM_NOTEXIST：不存在
                case 0x88: // EM_ALREADY_EXIST：已经存在
                    return this.OTHER_ERR;
                default:
                    return this.UNKNOWN;
            }
        }
    };

    /**
     * # nymph 错误类
     * @class nymph.error.NymphError
     * @extends Error
     */
    var NymphError = function (code, message, innerCode) {
        /**
         * @property {String} code 根据错误码值转换来的错误。
         * @member nymph.error.NymphError
         */
        this.code = code;

        /**
         * @property {Number} innerCode 从底层上传的错误码值。
         * @member nymph.error.NymphError
         */
        this.innerCode = innerCode;

        /**
         * @property {String} message 错误信息。
         * @member nymph.error.NymphError
         */
        this.message = message;
    };

    NymphError.prototype = {

        //插件ID。
        PLUGINID: 'a4518a84f7bdc672aa093d3d9369625d',

        constructor: NymphError
    };

    /**
     * @property {nymph.error.NymphError} NymphError 错误类
     * @member nymph.error
     */
    error.NymphError = NymphError;
    module.exports = error;

    },{}],
    "hermes":[function(require,module,exports){
    'use strict';

    /**
     *  Hermes 通信 Android 平台的实现。
     *  @class hermes
     */
    var hermes = require('./hermes.js');

    // hermesNative 为 Native 对象。
    var hermesNative = window.hermesNative || undefined;

    if(hermesNative) {
      hermes.callNativePluginFunction = function (pluginId, instanceId, functionName, params) {
        if (!params || params.length === 0) {
          params = null;
        } else {
          params = JSON.stringify(params);
        }

        try {
            var result = hermesNative.exec(pluginId, instanceId, functionName, params);
            return JSON.parse(result);
        } catch (err) {
            return {innerCode: 1, message: 'HermesNative exception.'};
        }
      };

      hermesNative.callbackFromNative = function (callbackId, params) {
        return hermes.onNativeCallback(callbackId, params);
      };

      hermesNative.eventFromNative = function(jsPluginInstanceId, eventName, parameters) {
        return hermes.onNativeEvent(jsPluginInstanceId, eventName, parameters);
      };
    }

    module.exports = hermes;

    },{"./hermes.js":1}],
    "iso8583":[function(require,module,exports){
    exports.ISO8583 = require('./lib/iso8583');
    exports.converter = require('./lib/util/converter');
    exports.tlv = require('./lib/util/tlv');

    },{"./lib/iso8583":2,"./lib/util/converter":23,"./lib/util/tlv":24}],
    "led":[function(require,module,exports){
    'use strict';

    var hermes = require('hermes'),
        nymphError = require('error');
    /**
     * # Led 灯类（模块名：led）
     * Led 灯主要用于指示非接模块状态。为了节能，只有在需要用到 Led 灯的时候才打开，使用结束后要关闭 Led 灯。
     * @class nymph.sys.led
     * @singleton
     */
    var led = {
      /**
       * 插件ID。
       */
      PLUGINID: '6b2737ce9f519efcf3b368eb86a383d4',

      instanceId: hermes.NULL,

      /**
       * @method on
       * 打开指定的 LED 灯。
       *
       *     var led = require('led');
       *
       *     // 打开红色 LED 灯。
       *     led.on([led.Light.RED]);
       *
       * @param {nymph.sys.led.Light[]} lights 要打开的 lED 灯，可指定打开多种颜色的 LED 灯。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      on: function (lights) {
        var self = this, result, errorCode;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'on', [lights]);
        errorCode = self.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: '打开 LED 灯失败', innerCode: result.innerCode};
        }
      },

      /**
       * @method off
       * 关闭指定的 LED 灯。
       *
       *     var led = require('led');
       *
       *     // 关闭红色 LED 灯。
       *     led.off([led.Light.RED]);
       *
       * @param {nymph.sys.led.Light[]} lights 要关闭的 lED 灯，可指定关闭多种颜色的 LED 灯。
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      off: function (lights) {
        var self = this, result, errorCode;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'off', [lights]);
        errorCode = self.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: '关闭 LED 灯失败', innerCode: result.innerCode};
        }
      },

      getError: function (innerCode) {
        switch (innerCode) {
          default:
            return nymphError.getError(innerCode);
        }
      },
    };

    /**
     * LED 灯。
     * @class nymph.sys.led.Light
     */
    var Light = {
      /**
       * RED
       */
      RED: 'RED',

      /**
       * GREEN
       */
      GREEN: 'GREEN',

      /**
       * YELLOW
       */
      YELLOW: 'YELLOW',

      /**
       * BLUE
       */
      BLUE: 'BLUE'
    };

    /**
     * Led 灯枚举
     * @class nymph.sys.led.Light
     */
    led.Light = Light;

    hermes.addJsPluginInstance(led.PLUGINID, led);
    module.exports = led;

    },{"error":"error","hermes":"hermes"}],
    "media":[function(require,module,exports){
    'use strict';
    var hermes = require('hermes'),
        nymphError = require('error');
    /**
     * # 多媒体类（模块名：media）
     * @class nymph.sys.media
     * @singleton
     */
    var media = {
      /**
       * 插件ID。
       */
      PLUGINID: 'cc24531fe7d65a0f1b57a9eb44c8675a',

      instanceId: hermes.NULL,

      /**
       * @method beep
       * 蜂鸣。
       *
       *     var media = require('media');
       *     // 按照默认蜂鸣配置进行蜂鸣，即正常蜂鸣。
       *     media.beep();
       *
       *     // 失败蜂鸣。
       *     media.beep(media.BeepMode.FAIL);
       *     // 蜂鸣 100 毫秒。
       *     media.beep(100);
       *
       * @param {nymph.sys.media.BeepMode/Number} option (Optional) 蜂鸣模式或者蜂鸣时间（以毫秒为单位），默认为正常蜂鸣。
       */
      beep: function (option) {
        var self = this, result, errorCode, beepMode = self.BeepMode.NORMAL;

        if (option) {
          beepMode = option;
          if (typeof beepMode === 'string') {
            result = hermes.exec(this.PLUGINID, this.instanceId, 'beepMode', [beepMode]);
          } else {
            result = hermes.exec(this.PLUGINID, this.instanceId, 'beepTime', [beepMode]);
          }
        } else {
          result = hermes.exec(this.PLUGINID, this.instanceId, 'beepMode', [beepMode]);
        }

        errorCode = self.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: '蜂鸣失败', innerCode: result.innerCode};
        }
      },

      /**
       * 间歇蜂鸣。
       * @param {Number} beepTime 每次蜂鸣的时间，单位为毫秒（ms）。
       * @param {Number} intervalTime 两次蜂鸣的间歇时间，单位为毫秒（ms）。
       * @param {Number} times 蜂鸣次数。
       */
      beepInterval: function (beepTime, intervalTime, times) {
        var self = this, result, errorCode;
        result = hermes.exec(this.PLUGINID, this.instanceId, 'beepInterval', [beepTime, intervalTime, times]);
        errorCode = self.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: '蜂鸣失败', innerCode: result.innerCode};
        }
      },

      /**
       * @method playAudio
       * 播放指定路径下的音频。
       *
       *     // 播放 audio 文件夹下的 voice.mp3。
       *     nymph.sys.media.playAudio('audio\voice.mp3');
       *
       * @param {String} path 要播放的音频。
       */
      playAudio: function (path) {
      },

      /**
       * @method stopAudio
       * 停止正在播放的音频。
       *
       *     nymph.sys.media.stopAudio();
       *
       */
      stopAudio: function () {
      },

      getError: function (innerCode) {
        switch (innerCode) {
          default:
            return nymphError.getError(innerCode);
        }
      },
    };

    /**
     * 蜂鸣类型
     * @class nymph.sys.media.BeepMode
     */
    var BeepMode = {
      /**
       * NORMAL
       */
      NORMAL: 'NORMAL',

      /**
       * SUCCESS
       */
      SUCCESS: 'SUCCESS',

      /**
       * FAIL
       */
      FAIL: 'FAIL',

      /**
       * INTERVAL
       */
      INTERVAL: 'INTERVAL',

      /**
       * ERROR
       */
      ERROR: 'ERROR'
    };

    /**
     * @property {nymph.sys.media.BeepMode} BeepMode 蜂鸣类型。
     * @member nymph.sys.media
     */
    media.BeepMode = BeepMode;

    hermes.addJsPluginInstance(media.PLUGINID, media);
    module.exports = media;

    },{"error":"error","hermes":"hermes"}],
    "native-console":[function(require,module,exports){
    'use strict';

    var hermes = require('hermes');
    var nymphError = require('error');
    /**
     * @class nymph.console
     * @singleton
     *
     * 控制台。
     *
     * 同时向浏览器控制台和 Qt 或者 Android 控制台输出日志。'nymph.util.console'对象只提供`log`方法用于日志输出，并且已覆盖`window.console.log`，可以通过`console.log`输出日志。
     */
    var nymphConsole = {
      /**
       * 输出日志级别。
       * @experimental
       */
      level: 'debug',

      /**
       * 单实例对象没有实例 ID
       */
      instanceId: hermes.NULL,

      enable: true,

      /**
       * 插件 ID。
       */
      PLUGINID: '54cf34ff83e240c6ac07f0709a00475e',

      /**
       * @event logged(message)
       * @experimental
       * 日志输出事件。
       */

      /**
       * 将指定的日志打印到控制台。
       *
       * @param {Function} [callback] 函调。可选。
       * @param {nymph.error.NymphError} callback.err 错误。
       * @param {Array} callback.parameters 回调参数。
       * @param {Object/String} message 日志信息。
       */
      nativeLog: function (message, callback) {
        if (this.enable) {
          window.console.info(message);
          if (callback) {
            hermes.exec(this.PLUGINID, this.instanceId, 'log', [message], callback.bind(this));
          } else {
            hermes.exec(this.PLUGINID, this.instanceId, 'log', [message]);
          }
        }
      },

      /**
       * 启动\禁用日志。
       * @param {Boolean} enable 是否打开日志。
       */
      enableNativeLog: function (enable) {
        var result =  hermes.exec(this.PLUGINID, this.instanceId, 'enableNativeLog', [enable]);
        var errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: enable ? 'Failed to enable log.' : 'Failed to disable log.', innerCode: result.innerCode};
        }
        this.enable = enable;
      },

      getLevel: function () {
        return hermes.exec(this.PLUGINID, this.instanceId, 'getLevel');
      },

      mockEvent: function () {
        return hermes.exec(this.PLUGINID, this.instanceId, 'mockEvent');
      },

      getInfo: function () {
        return {
          name: 'nymph-console',
          version: '0.0.1'
        };
      },

      /**
       * @ignore
       * @param {Number} innerCode 底层上传的返回码
       * @returns {String} 返回码对应的字符串
       */
      getError: function (innerCode) {
        switch (innerCode) {
          default:
            return nymphError.getError(innerCode);
        }
      },

      meta: {
        name: 'nymph-console',
        version: '0.0.1'
      }
    };

    hermes.addEventSupport(nymphConsole);

    // 修改 window.console
    hermes.mixin(console, nymphConsole);

    hermes.addJsPluginInstance(nymphConsole.PLUGINID, console);

    module.exports = console;

    },{"error":"error","hermes":"hermes"}],
    "nymph-encoding":[function(require,module,exports){
    'use strict';

    var Buffer = require('buffer').Buffer;

    /**
     * # 数据编码及解码（模块名：encoding）
     * @class nymph.util.encoding
     * @singleton
     * @experimental 规范尚未制定完成！
     */
    var encoding = {
      /**
       * @method asc2bcd ASCII码转BCD码
       */
      asc2bcd: function () {

      },

      /**
       * @method bcd2asc BCD码转ASCII码
       */
      bcd2asc: function () {

      },

      /**
       * @method int2bcd int型数据转BCD码
       */
      int2bcd: function () {

      },

      /**
       * @method bcd2int BCD码转int型
       */
      bcd2int: function () {

      },

      /**
       * @method gbk2utf8 GBK 编码转 UTF-8 编码
       */
      gbk2utf8: function () {

      },

      /**
       * @method utf82gbk UTF-8 编码转 GBK 编码
       */
      utf82gbk: function () {

      },

      /**
       * @method hexStringToBuffer 把十六进制字符串转换成 Buffer 数组。
       * 如：“01FACB”转换成[0x01, 0xFA, 0xCB]
       */
      hexStringToBuffer: function (str) {
        var pos = 0;
        var len = str.length;
        if (len % 2 !== 0) {
          return null;
        }
        len /= 2;
        var hexA = [];
        for (var i = 0; i < len; i++) {
          var s = str.substr(pos, 2);
          var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
      }
      return new Buffer(hexA);
      },

      /**
       * @method bufferToHexString 把 Buffer 转换成十六进制字符串。
       * 如：[0x01, 0xFA, 0xCB]转换成“01FACB”
       */
      bufferToHexString: function (arr) {
        var str = "";
        for (var i = 0; i < arr.length; i++) {
          var tmp = arr[i].toString(16);
          if (tmp.length == 1) {
            tmp = "0" + tmp;
          }
          str += tmp;
        }
        return str;
      }
    };

    module.exports = encoding;

    },{"buffer":"buffer"}],
    "nymph":[function(require,module,exports){
    (function(){
      'use strict';
      var nymph = {
        reg : function(str){
          var arr = str.split('.'),
               obj = nymph;
          for(var i = ( arr[0] === 'nymph' ) ? 1 : 0; i<arr.length; i++){
            obj[arr[i]] = obj[arr[i]] || {};
            obj = obj[arr[i]];
          }
        },
        del : function(str){
          var arr = str.split('.'),
               obj = nymph;
          arr.forEach(function(elem, idx, arr){
            if(typeof obj[arr[idx]] === 'undefined'){
              return;
            }else if(arr.length === idx+1){
              delete  nymph[arr[idx]];
              return;
            } else{
              nymph = nymph[arr[idx]];
            }
          });
        }
      };

      nymph.reg('buffer');
      nymph.reg('cryptoJs');
      nymph.reg('comm');
      nymph.reg('dev');
      nymph.reg('error');
      nymph.reg('pay');
      nymph.reg('sys');
      nymph.reg('util');
      nymph.reg('app');
      nymph.reg('console');
      // nymph.reg('gaia');
      // nymph.reg('dlf');
      nymph.reg('testlib');


      nymph.buffer = require('buffer');
      nymph.cryptoJs = require('crypto-js');
      nymph.dev.cardReader = require('card-reader');
      nymph.dev.pinPad = require('pin-pad');
      nymph.dev.printer = require('printer');
      nymph.pay.emv = require('emv');
      nymph.pay.emvData = require('emv-data');
      // nymph.sys.power = require('power');
      nymph.sys.led = require('led');
      nymph.sys.media = require('media');
      nymph.comm.connectivityManager = require('connectivity-manager');
      // nymph.comm.modem = require('modem');
      // nymph.comm.cell = require('cell');
      // nymph.comm.ethernet = require('ethernet');
      // nymph.comm.communication = require('communication');
      nymph.error = require('error');
      nymph.app = require('app');
      // nymph.util.promisehelper = require('promise-helper');
      // nymph.console.consolePatch = require('console-patch');
      nymph.console.nativeConsole = require('native-console');
      nymph.iso8583 = require('iso8583');
      // nymph.gaia = require('gaia');
      // nymph.dlf = require('dlf');
      nymph.util.encoding = require('nymph-encoding');
      nymph.util.tools = require('tools');
      nymph.util.dateFormat = require('date-format');
      nymph.testlib.testlib = require('testlib');
      nymph.sys.deviceStatus = require('device-status');
      nymph.sys.signaturePad = require('signature-pad');
      nymph.dev.scanner = require('scanner');
      nymph.comm.serialPort = require('serial-port');
      module.exports = nymph;

    })();

    },{"app":"app","buffer":"buffer","card-reader":"card-reader","connectivity-manager":"connectivity-manager","crypto-js":"crypto-js","date-format":"date-format","device-status":"device-status","emv":"emv","emv-data":"emv-data","error":"error","iso8583":"iso8583","led":"led","media":"media","native-console":"native-console","nymph-encoding":"nymph-encoding","pin-pad":"pin-pad","printer":"printer","scanner":"scanner","serial-port":"serial-port","signature-pad":"signature-pad","testlib":"testlib","tools":"tools"}],
    "pin-pad":[function(require,module,exports){
    'use strict';

    /**
     * # 密码键盘（模块名：pin-pad）
     * @class nymph.dev.pinPad
     * @singleton
     * 本模块为密码键盘的入口模块，通过 `requrie('pin-pad')` 的方式获取，包含以下两部分内容：
     *
     * - 密码键盘类。
     * - 所有与密码键盘相关的类和对象。
     *
     */

    // 引用模块内部部件。
    var Kap = require('./kap'),

    // 引用外部模块。
        hermes = require('hermes'),
        Buffer = require('buffer').Buffer,
        encoding = require('nymph-encoding'),
        tools = require('tools'),
        nymphError = require('error'),
        Error = require('error').NymphError,


        pinPad = {};

    /**
     * # 密码键盘类
     * @class nymph.dev.pinPad.PinPad
     *
     * 具体操作流程及代码示例请参见[“密码键盘开发指南”](#!/guide/pinpad)。
     *
     * @constructor
     *
     * 创建一个新的密码键盘实例。
     *
     *
     * 如下：
     *
     *     // 获取密码键盘入口模块。
     *     var pinPad = require('pin-pad');
     *
     *     // 获取密码键盘类。
     *     var PinPad = pinPad.PinPad;
     *
     *     // 创建一个密码键盘实例。
     *     var pinPadInstance = new PinPad(pinPad.PinPadType.IPP, {
     *         managerId: 0x01,
     *         groupId: 0x01,
     *         kapIndex: 0x01
     *     });
     *
     *     // 获取与密码键盘相关的类。
     *     var KeySystem = pinPad.KeySystem;
     *
     * @param {nymph.dev.pinPad.PinPadType} devName 设备标识，唯一标识和打开一个密码键盘设备。
     * @param {Object} options 初始化配置参数。由于不同厂商的密钥体可能不同，可以加入自定义参数。以下为根据联迪的密钥体系设置的参数：
     * @param {Number} managerId 管理者的唯一标号。
     * @param {Number} groupId KAP 组的唯一标识。
     * @param {Number} options.kapIndex 机构下对应的密钥存储区（KAP区）索引。
     *
     */
    var PinPad = function (devName, options) {
        if (!devName || (typeof devName !== 'string') || ((devName !== PinPadType.IPP)&&(devName !== PinPadType.EPP))) {
            throw {code: nymphError.PARAM_ERR, message: 'devName error'};
        }
        if (!options || (typeof options !=='object')) {
            throw {code: nymphError.PARAM_ERR, message: 'options error'};
        }
        if(options.managerId === undefined || options.groupId === undefined || options.kapIndex === undefined ||
            options.managerId === null || options.groupId === null || options.kapIndex === null ||
            (typeof options.managerId !== 'number') || (typeof options.groupId !== 'number') || (typeof options.kapIndex !== 'number') ||
            (true === isNaN(options.managerId)) || (true === isNaN(options.groupId)) || (true === isNaN(options.kapIndex))){
            throw {code: nymphError.PARAM_ERR, message: 'managerId,groupId,kapIndex error'};
        }
        // todo localStorage 没有 get 方法错误？
        //this.devName = localStorage.get('pinpad.devName') || devName;
        /**
         * @property {nymph.dev.pinPad.PinPadType} devName 设备名称。
         * @member nymph.dev.pinPad.PinPad
         */
        this.devName = devName;
        /**
         * @property {Number} managerId 管理者的唯一标号。
         * @member nymph.dev.pinPad.PinPad
         */
        this.managerId = options.managerId;
        /**
         * @property {Number} groupId KAP 组的唯一标识。
         * @member nymph.dev.pinPad.PinPad
         */
        this.groupId = options.groupId;
        /**
         * @property {Number} kapIndex 机构下对应的密钥存储区索引。
         * @member nymph.dev.pinPad.PinPad
         */
        this.kapIndex = options.kapIndex;

        this.instanceId = hermes.NULL;

        this.isInputting = false;
    };

    /**
     * # 密码键盘密钥格式
     * @class nymph.dev.pinPad.KeyFormat
     */
    var KeyFormat = {
        /**
         * @property {Number} [NORMAL=0] 一般的密文密钥格式。
         * @member nymph.dev.pinPad.KeyFormat
         */
        NORMAL: 0,
        /**
         * @property {Number} [ICBC=1] ICBC 的定制格式。
         * @member nymph.dev.pinPad.KeyFormat
         */
        ICBC: 1,
        /**
         * @property {Number} [TR31TR31=2] 规范定义的 密文密钥格式。
         * @member nymph.dev.pinPad.KeyFormat
         */
        TR31TR31: 2,
        /**
         * @property {Number} [TCBC=4] 规范定义的 密文密钥格式(定义为4和底层赋值保持一致)。
         * @member nymph.dev.pinPad.KeyFormat
         */
        TCBC: 4

    };

    /**
     * # PIN 算法类型
     * @class nymph.dev.pinPad.PinMode
     */
    var PinMode = {
        /**
         * @property {String} [ISO9564='ISO9564FMT0'] ISO9564FMT0。
         * @member nymph.dev.pinPad.PinMode
         */
        ISO9564FMT0: 'ISO9564FMT0',

        /**
         * @property {String} [ISO9564FMT1='ISO9564FMT1'] ISO9564FMT1。
         * @member nymph.dev.pinPad.PinMode
         */
        ISO9564FMT1: 'ISO9564FMT1',
        /**
         * @property {String} [ISO9564FMT2='ISO9564FMT2'] ISO9564FMT2。
         * @member nymph.dev.pinPad.PinMode
         */
        ISO9564FMT2: 'ISO9564FMT2',
        /**
         * @property {String} [ISO9564FMT3='ISO9564FMT3'] ISO9564FMT3。
         * @member nymph.dev.pinPad.PinMode
         */
        ISO9564FMT3: 'ISO9564FMT3'
    };

    /**
     * # 密钥体系
     * @class nymph.dev.pinPad.KeySystem
     */
    var KeySystem = {
        /**
         * @property {Number} [MKSK=0] MKSK。
         * @member nymph.dev.pinPad.KeySystem
         */
        MKSK: 0,
        /**
         * @property {Number} [DUKPT=1] DUKPT。
         * @member nymph.dev.pinPad.KeySystem
         */
        DUKPT: 1,
        /**
         * @property {Number} [FIXED=2] FIXED。
         * @member nymph.dev.pinPad.KeySystem
         */
        FIXED: 2

    };

    /**
     * # 密码键盘加解密算法
     * @class nymph.dev.pinPad.Algorithm
     */
    var KeyAlgorithm = {
        /**
         * @property {String} [DES='D'] 单 DES。
         * @member nymph.dev.pinPad.Algorithm
         */
        DES: 'D',
        /**
         * @property {String} [TDES='T'] 3 DES。
         * @member nymph.dev.pinPad.Algorithm
         */
        TDES: 'T',
        /**
         * @property {String} [SM4='SM4'] 国密算法。
         * @member nymph.dev.pinPad.Algorithm
         */
        SM4: 'SM4',
        /**
         * @property {String} [MAC_TDES_CBC='MAC_TDES_CBC'] mac计算是使用3des密钥做CBC算法。
         * @member nymph.dev.pinPad.Algorithm
         */
        MAC_TDES_CBC: 'MAC_TDES_CBC'

    };



    /**
     * # 密钥
     * @class nymph.dev.pinPad.Key
     * @cfg {Number} index [密钥组](#!/guide/pinpad-section-%E5%AF%86%E9%92%A5%E7%BB%84)索引。
     * @cfg {nymph.dev.pinPad.Algorithm} [algorithm=TDES] 密钥加密算法。
     * @cfg {nymph.dev.pinPad.KeyType} type 密钥类型。
     * @cfg {nymph.dev.pinPad.KeySystem} [system = MKSK] 密钥体系。
     * @cfg {Boolean}isSupportEPPDesKey [isSupportEPPDesKey = false] 支持外置密码键盘报文密钥下载（默认为不支持）。
     */
    var Key = function (cfg) {
        var isInside = false;
        this.algorithm = KeyAlgorithm.TDES;
        this.system = KeySystem.MKSK;
        this.isSupportEPPDesKey = false;
        if (cfg.hasOwnProperty('isSupportEPPDesKey')) {
            this.isSupportEPPDesKey = cfg.isSupportEPPDesKey;
        }

        if (cfg.hasOwnProperty('index')) {
            this.index = cfg.index;
        }

        if (cfg.hasOwnProperty('algorithm')) {
            isInside = false;
            var tmpAlgorithm;
            for(tmpAlgorithm in KeyAlgorithm){
                if(cfg.algorithm === KeyAlgorithm[tmpAlgorithm]){
                    isInside = true;
                    break;
                }
            }
            if(!isInside){
                throw {code: nymphError.PARAM_ERR, message: 'It does not inside the KeyAlgorithm'};
            }
            this.algorithm = cfg.algorithm;
        }

        if (cfg.hasOwnProperty('system')) {
            isInside = false;
            var tmpSystem;
            for(tmpSystem in KeySystem){
                if(cfg.system === KeySystem[tmpSystem]){
                    isInside = true;
                    break;
                }
            }
            if(!isInside){
                throw {code: nymphError.PARAM_ERR, message: 'It does not inside the KeySystem'};
            }
            this.system = cfg.system;
        }

        if (cfg.hasOwnProperty('type')) {
            isInside = false;
            var tmpType;
            for(tmpType in KeyType){
                if(cfg.type === KeyType[tmpType]){
                    isInside = true;
                    break;
                }
            }
            if(!isInside){
                throw {code: nymphError.PARAM_ERR, message: 'It does not inside the KeyType'};
            }
            this.type = cfg.type;
        } else {
            throw {code: nymphError.PARAM_ERR, message: 'Key type is required.'};
        }
    };

    PinPad.prototype = {
        constructor: PinPad,

        // 插件ID。
        PLUGINID: '91ce03e8ef2140c299653e77b5901d9c',

        bindEvents: function () {
            var self = this;

            /**
             * @event keypress
             * 输入pin操作中，当pinpad模块认为是可继续输入时，可以用这个返回键值
             * （注意只有在pinpad处于是‘可继续输入’状态才会返回键值，输入满位数按确认、按取消或者其他情况使pinpad状态改变了，就不会在这个事件中返回键值）。
             * @param {nymph.KeyMap} keyCode 按下的键盘。如果在密码键盘上输入 [0, 9]，明文状态下 keyCode 为各数字对应的值，密文状态下 keyCode 为 '*'。其他键值包括：
             *
             * - {@link nymph.KeyMap#KEY_ENTER} 按下回车键。
             * - {@link nymph.KeyMap#KEY_CANCEL} 按下取消键，表示清除当前输入密码的内容。
             * - {@link nymph.KeyMap#KEY_CLEAR} 按下回退键。
             * @member nymph.dev.pinPad.PinPad
             */
            self.addListener('pinPadKeypress', function (keyCode) {
                self.emit('keypress', keyCode);
            });

            /**
             * @event close
             * 关闭密码键盘事件。
             */
            self.addListener('pinPadClose', function () {
                self.emit('close');
            });
        },

        unBindEvents: function () {
            var self = this;
            self.removeAllListeners('pinPadKeypress');
            self.removeAllListeners('pinPadClose');
        },

        /**
         * @method open
         * 打开密码键盘。
         *
         *     try {
         *         pinPadInstance.open();
         *     } catch (err) {
         *         // 打开失败的处理
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        open: function () {
            // 如果重复打开，则抛出异常。
            if (this.instanceId !== hermes.NULL) {
                var error = new Error();
                error.code = this.DEVICE_USED;
                error.message = 'Device already opened.';

                throw error;
            }
            this.kap = new Kap(this.instanceId, this.groupId, this.kapIndex);
            var result, errorCode, kapOptions = {
                instanceId: this.instanceId,
                groupId: this.groupId,
                kapIndex: this.kapIndex,
                managerId: this.managerId
            };

            //console.nativeLog('this.Kap = ' + JSON.stringify(this.kap));
            //console.nativeLog('kapOptions = ' + JSON.stringify(kapOptions));
            // 打开密码键盘模块操作。
            result = hermes.exec(this.PLUGINID, hermes.NULL, 'open', [this.devName, kapOptions]);

            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to open PIN Pad.', innerCode: result.innerCode};
            }

            this.instanceId = result.data;

            hermes.addJsPluginInstance(this.instanceId, this);
            // 先解绑再绑定，防止之前因为某些原因绑定了未解绑，导致重复绑定。
            this.unBindEvents();
            this.bindEvents();
        },

        /**
         * @method loadPlainKey
         * 下装明文密钥。
         *
         *     // 下装密钥之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     try {
         *         // 要下装的密钥数据类型可以是 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
         *         var keyData = '31313131313131313131313131313131';
         *         // var keyData = [0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31];
         *         // var keyData = new Buffer([0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31, 0x31]);
         *         var masterKey = new pinPad.Key({
         *           index: 1,
         *           type: pinPad.KeyType.MASTER
         *           algorithm: KeyAlgorithm.TDES,(国密使用KeyAlgorithm.SM4)
         *           system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *         });
         *         pinPadInstance.loadPlainKey(keyData, masterKey);
         *     } catch (err) {
         *         // 下装密钥失败的处理。
         *     }
         *
         * @param {Object/String/Array} data 明文密钥内容，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)，长度可为 8 个字节、16 个字节、24 个字节。
         * @param {nymph.dev.pinPad.Key} key 密钥属性,如果是使用国密算法请将key.algorithm属性设置为SM4(主密钥索引0到99，工作密钥索引0到7)
         * @param {Object} options (Optional) 其他配置。各厂商可以根据需要自由扩展参数。
         * @param {Object} options.passport (Optional) 认证信息。如果该参数不为空，则是用认证模式下载明文主密钥。参考教程中的 [下载明文密钥](#!/guide/pinpad-section-%E4%B8%8B%E8%BD%BD%E6%98%8E%E6%96%87%E5%AF%86%E9%92%A5)。
         * @param {Object} options.auth (Optional) 认证信息口令。
         * @param {String} options.auth.password1 (Optional) 认证信息口令1。
         * @param {String} options.auth.password2 (Optional) 认证信息口令2。
         * @param {String} [options.isTmsKey=false] 是否为 TMS 主密钥。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        loadPlainKey: function (data, key, options) {
            var result, errorCode, optionKey, actualOptions = {isTmsKey: false}, dataString, tempKey;

            if(!data || ((data.length%8 !== 0)&&(data.length%16 !== 0))){
                throw {code: nymphError.PARAM_ERR, message: 'data error'};
            }

            if(!key || !key.type) {
                throw {code: nymphError.PARAM_ERR, message: 'key error'};
            }

            //console.nativeLog('开始执行loadPlainKey的JS函数');
            dataString = tools.toBase64(data);
            if (options) {
                for (optionKey in options) {
                    if (options.hasOwnProperty(optionKey)) {
                        actualOptions[optionKey] = options[optionKey];
                    }
                }
            }

            //console.nativeLog('开始执行loadPlainKey的QT函数');
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'loadPlainKey', [dataString, tempKey, actualOptions]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to download plaintext key.', innerCode: result.innerCode};
            }
        },

        /**
         * @method loadEncryptedKey
         * 下装密文密钥。
         *
         * **下装密文密钥时，必须确保用于解密的明文主密钥存在，否则将导致失败。**
         *
         *     // 下装密钥之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     try {
         *         // 要下装的密钥数据类型可以是 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
         *         var keyData = 'B26EC468EB4D0D3D91AC29C3AEB92614';
         *         // var keyData = [0xB2, 0x6E, 0xC4, 0x68, 0xEB, 0x4D, 0x0D, 0x3D, 0x91, 0xAC, 0x29, 0xC3, 0xAE, 0xB9, 0x26, 0x14];
         *         // var keyData = new Buffer([0xB2, 0x6E, 0xC4, 0x68, 0xEB, 0x4D, 0x0D, 0x3D, 0x91, 0xAC, 0x29, 0xC3, 0xAE, 0xB9, 0x26, 0x14]);
         *         var pinKey = new pinPad.Key({
         *           index: 1,
         *           type: pinPad.KeyType.PIN,
         *           algorithm: pinPad.KeyAlgorithm.TDES,(国密使用KeyAlgorithm.SM4)
         *           system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *         });
         *         var masterKey = new pinPad.Key({
         *           index: 1,
         *           type: pinPad.KeyType.MASTER
         *         });
         *         pinPadInstance.loadEncryptedKey(keyData, pinKey, masterKey);
         *     } catch (err) {
         *         // 下装密钥失败的处理。
         *     }
         *
         * @param {Object/String/Array} data 密文密钥内容，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)，长度可为 8 个字节、16 个字节、24 个字节。
         * @param  {nymph.dev.pinPad.Key} key 密钥属性,如果是使用国密算法请将key.algorithm属性设置为SM4.(主密钥索引0到99，工作密钥索引0到7)
         * @param {nymph.dev.pinPad.Key} decryptionKey 解密密钥属性。
         * @param {Object} options (Optional)  其他配置。
         * @param {nymph.dev.pinPad.KeyFormat} [options.keyFormat=NORMAL] 密钥格式。
         * @param {Boolean} [options.isTmsKey=false] 是否为 TMS 主密钥。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        loadEncryptedKey: function (data, key, decryptionKey, options) {
            var result, errorCode, optionKey, dataString, tempKey,
                actualOptions = {
                    isTmsKey: false,
                    keyFormat: KeyFormat.NORMAL,
                    kapIndex: this.kapIndex
                };
            if(!data || ((data.length%8 !== 0)&&(data.length%16 !== 0))){
                throw {code: nymphError.PARAM_ERR, message: 'data error'};
            }

            if(!key || !key.type) {
                throw {code: nymphError.PARAM_ERR, message: 'key error'};
            }

            //console.nativeLog('开始执行loadEncryptedKey的JS函数');
            dataString = tools.toBase64(data);

            if (options) {
                for (optionKey in options) {
                    if (options.hasOwnProperty(optionKey)) {
                        actualOptions[optionKey] = options[optionKey];
                    }
                }
            }
            //console.nativeLog('开始执行loadEncryptedKey的QT函数');
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'loadEncryptedKey', [dataString, tempKey, decryptionKey, actualOptions]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to download encrypted key.', innerCode: result.innerCode};
            }
        },


        /**
         * @method loadDukptInitKsn
         * 将指定的 key 加载为 DUKPT initial key, 同时指定对应的 Key Serial Number.。
         * 这个接口针对的是DUKPT密钥管理体系下的应用，MKSK体系的用不到这个接口
         *
         *
         *     try {
         *         // 要下装的KSN可以是 16 进制字符串，相当于10字节长度/Array/[Buffer](https://nodejs.org/api/buffer.html)
         *         var ksnData = 'B26EC468EB4D0D3D91AC';
         *         // var ksnData = [0xB2, 0x6E, 0xC4, 0x68, 0xEB, 0x4D, 0x0D, 0x3D, 0x91, 0xAC];
         *        // var keyData = new Buffer([0xB2, 0x6E, 0xC4, 0x68, 0xEB, 0x4D, 0x0D, 0x3D, 0x91, 0xAC]);
         *         var keyindex = new pinPad.Key({
         *           index: 1(索引值必须传入，其他属性在这个方法中没有用到，可以不传)
         *         });
         *
         *         pinPadInstance.loadDukptInitKsn(ksnData, keyindex);
         *     } catch (err) {
         *         // 设置KSN失败处理
         *     }
         *
         * @param {Object/String/Array} ksnData KSN数据内容，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)，长度可为 10 个字节。
         * @param  {nymph.dev.pinPad.Key} key 密钥属性,索引值必须传入，其他属性在这个方法中没有用到，可以不传.(索引0到99)。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        loadDukptInitKsn: function (ksnData, key) {
            var result, errorCode, dataString;

            if(ksnData === null || ksnData === undefined) {
                throw {code: nymphError.PARAM_ERR, message: 'ksnData error'};
            }

            if(!key || key.index === undefined || typeof key.index !== 'number' || key.index > 99 ) {
                throw {code: nymphError.PARAM_ERR, message: 'key or key.index error'};
            }

            //console.nativeLog('开始执行loadDukptInitKey的JS函数');
            dataString = tools.toBase64(ksnData);

            result = hermes.exec(this.PLUGINID, this.instanceId, 'loadDukptInitKsn', [dataString, key]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to loadDukptInitKsn.', innerCode: result.innerCode};
            }

        },

        /**
         * @method getDukptCurKsn
         * 读取指定的 DUKPT 实现实例的 KSN
         * 这个接口针对的是DUKPT密钥管理体系下的应用，MKSK体系的用不到这个接口
         *
         *
         *     try {
         *
         *         var keyindex = new pinPad.Key({
         *           index: 1//索引值必须传入，其他属性在这个方法中没有用到，可以不传
         *         });
         *         var curKsn = pinPadInstance.getDukptCurKsn(keyindex);
         *
         *     } catch (err) {
         *         // 执行失败处理
         *     }
         *
         * @param  {nymph.dev.pinPad.Key} key 密钥属性,索引值必须传入，其他属性在这个方法中没有用到，可以不传.(索引0到99)。
         * @return {Object} 当前KSN，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        getDukptCurKsn: function (key) {
            var result, errorCode;

            if(!key || key.index === undefined || typeof key.index !== 'number' || key.index > 99 ) {
                throw {code: nymphError.PARAM_ERR, message: 'key or key.index error'};
            }

            //console.nativeLog('开始执行getDukptCurKsn的JS函数');
            result = hermes.exec(this.PLUGINID, this.instanceId, 'getDukptCurKsn', [key]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to getDukptCurKsn.', innerCode: result.innerCode};
            }

            if (result.data) {
                return new Buffer(result.data, 'base64');
            }
            return null;
        },

        /**
         * @method getAccessableKapIds
         * 获取 当前应用可访问 KAP 的 ID 列表.
         * 这个接口提供给有kap访问权限限制的应用使用，这些应用请在创建pinpad实例之前先获取一下可以访问的kap区，以免后续访问密码键盘失败
         *
         *     try {
         *          //假设预期的kapid为2个
         *         var expectedKapsNum = 2;
         *         //假设为内置密码键盘
         *         var pinpadType = 'IPP'；
         *         //返回一个KAP数组，里面包含属相kap.groupId和kap.index
         *         var kapIds = getAccessableKapIds(expectedKapsNum,pinpadType);
         *         //返回的实际kapid个数可能与预期的不同，这个需要调用者自己判断
         *         if(kapIds.length === 2){
         *         var pinpad_1 = new PinPad();
         *         var pinpad_2 = new PinPad();
         *         pinpad_1.groupId = kapIds[0].groupId;
         *         pinpad_1.kapIndex = kapIds[0].index;
         *         pinpad_2.groupId = kapIds[1].groupId;
         *         pinpad_2.kapIndex = kapIds[1].index;
         *         }
         *     } catch (err) {
         *         // 执行失败处理
         *     }
         *
         * @param  {Number} expectedKapsNum 预期返回的kap区数量。
         * @param  {nymph.dev.pinPad.PinPadType} pinpadType 密码键盘类型（内置还是外置）。
         * @return {Object} 返回的Kap区ID数组。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        getAccessableKapIds: function (expectedKapsNum,pinpadType){
            var result, errorCode, kapList;
            if(!expectedKapsNum || typeof expectedKapsNum !== 'number'){
                throw {code: nymphError.PARAM_ERR, message: 'expected Kaps Num error'};
            }
            if(!pinpadType || (pinpadType !== PinPadType.EPP && pinpadType !== PinPadType.IPP)){
                throw {code: nymphError.PARAM_ERR, message: 'pinpadType error'};
            }
            result = hermes.exec(this.PLUGINID, this.instanceId, 'getAccessableKapIds', [expectedKapsNum,pinpadType]);
            errorCode = this.getError(result.innerCode);

            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to getAccessableKapIds.', innerCode: result.innerCode};
            }

            if(result.data){
                kapList = result.data;
            }
            return kapList;
        },

        /**
         * @method increaseDukptKsn
         * 实现当前的KSN自增
         * 这个接口针对的是DUKPT密钥管理体系下的应用，MKSK体系的用不到这个接口
         *
         *
         *     try {
         *
         *         var keyindex = new pinPad.Key({
         *           index: 1(索引值必须传入，其他属性在这个方法中没有用到，可以不传)
         *         });
         *         pinPadInstance.increaseDukptKsn(keyindex);
         *
         *     } catch (err) {
         *         // 执行失败处理
         *     }
         *
         * @param  {nymph.dev.pinPad.Key} key 密钥属性,索引值必须传入，其他属性在这个方法中没有用到，可以不传.(索引0到99)。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        increaseDukptKsn: function (key) {
            var result, errorCode;

            if(!key || key.index === undefined || typeof key.index !== 'number' || key.index > 99 ) {
                throw {code: nymphError.PARAM_ERR, message: 'key or key.index error'};
            }

            //console.nativeLog('开始执行increaseDukptKsn的JS函数');
            result = hermes.exec(this.PLUGINID, this.instanceId, 'increaseDukptKsn', [key]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to increaseDukptKsn.', innerCode: result.innerCode};
            }

        },




        /**
         * @method isValid
         * 校验密钥是否合法。
         *
         *     // 校验密钥之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     // 校验已下装的 工作 密钥是否合法
         *     var key = new pinPad.Key({
         *         index: 1,
         *         type: pinPad.KeyType.PIN
         *         algorithm: pinPad.KeyAlgorithm.TDES,(国密使用KeyAlgorithm.SM4)
         *         system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *     });
         *     var options = {masterKeyIndex: 1};
         *     // 用于检查密钥的数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
         *     var bufferCheckValue = 'B26EC468EB4D0D3D91AC29C3AEB92614';
         *     // var bufferCheckValue = [0xB2, 0x6E, 0xC4, 0x68, 0xEB, 0x4D, 0x0D, 0x3D, 0x91, 0xAC, 0x29, 0xC3, 0xAE, 0xB9, 0x26, 0x14];
         *     // var bufferCheckValue = new Buffer([0xB2, 0x6E, 0xC4, 0x68, 0xEB, 0x4D, 0x0D, 0x3D, 0x91, 0xAC, 0x29, 0xC3, 0xAE, 0xB9, 0x26, 0x14]);
         *     try {
         *         var result = pinPadInstance.isValid(key, bufferCheckValue, options);
         *         if (result) {
         *             // 密钥合法
         *         } else {
         *             // 密钥不合法
         *         }
         *     } catch (e) {
         *         // 校验失败的处理
         *     }
         *
         * @param  {nymph.dev.pinPad.Key} key 密钥属性,如果是使用国密算法请将key.algorithm属性设置为SM4.
         * @param  {Object/String/Array} checkValue 用于校验密钥的数组（如报文中的 CHACK VALUE 域），数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)。
         * @param  {Object} options (Optional) 选项。
         * @return {Boolean} 密钥是否合法。
         * @member nymph.dev.pinPad.PinPad
         */
        isValid: function (key, checkValue, options) {
            var result, errorCode, checkValueBuf, kcv, kcvTmp, tempKey;

            //console.log('进入isValid函数（JS层）');
            if(!key || (typeof key !== 'object')){
                throw {code: nymphError.PARAM_ERR, message: 'key do not exist or error'};
            }

            if(!key.hasOwnProperty('type') || !key.index || (typeof key.index !== 'number')){
                throw {code: nymphError.PARAM_ERR, message: 'key.type and key.index do not exist or error'};
            }

            if(!checkValue || (typeof checkValue === 'number')){
                throw {code: nymphError.PARAM_ERR, message: 'checkValue do not exist or error'};
            }

            if (Buffer.isBuffer(checkValue)) {
                checkValueBuf = checkValue;
            } else {
                if (checkValue.constructor === Array) {
                    checkValueBuf = new Buffer(checkValue);
                } else {
                    try {
                        checkValueBuf = encoding.hexStringToBuffer(checkValue);
                    } catch (e) {
                        throw {
                            code: nymphError.PARAM_ERR,
                            message: JSON.stringify(checkValue) + 'should be hexadecimal string.'
                        };
                    }
                }
            }

            //console.nativeLog('进入isValid函数（QT层）');
            //console.nativeLog('key = ' + JSON.stringify(key));
            //console.nativeLog('options = ' + JSON.stringify(options));
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'calculateCheckValue', [tempKey, options]);
            errorCode = this.getError(result.innerCode);
            //console.nativeLog('进入isValid函数（QT层返回）' + errorCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to verify key.', innerCode: result.innerCode};
            }

            if (result.data) {
                kcv = new Buffer(result.data, 'base64');
                console.log('原result.data = ' + JSON.stringify(result.data));
                console.log('生成的kcv码(bcd转hex) = ' +  encoding.bufferToHexString(kcv));
            } else {
                throw {code: nymphError.ERROR, message: 'Failed to get KCV.'};
            }
            //国密的checkvalue返回的是8字节，只比较传进来的位数
            if(checkValueBuf.length < kcv.length){
                kcvTmp = kcv.slice(0,checkValueBuf.length);
            }else{
                kcvTmp = kcv;
            }
            if (checkValueBuf.compare(kcvTmp) === 0) {
                //console.log('kcv compare返回成功');
                return true;
            } else {
                //console.log('kcv compare返回失败');
                return false;
            }
        },

        /**
         * @method getKCV
         * 获取KCV
         *
         *     // 获取之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     // 获取对应密钥的KCV
         *     var key = new pinPad.Key({
         *         index: 1,
         *         type: pinPad.KeyType.MASTER
         *         system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *     });
         *
         *     try {
         *         var result = pinPadInstance.getKCV(key);
         *
         *     } catch (e) {
         *         // 校验失败的处理
         *     }
         *
         * @param  {nymph.dev.pinPad.Key} key 密钥属性,如果是使用国密算法请将key.algorithm属性设置为SM4.
         * @return {String} KCV值。
         * @member nymph.dev.pinPad.PinPad
         */
        getKCV: function (key) {
            var result, errorCode, checkValueBuf, kcv, kcvTmp, tempKey;

            //console.log('进入isValid函数（JS层）');
            if(!key || (typeof key !== 'object')){
                throw {code: nymphError.PARAM_ERR, message: 'key do not exist or error'};
            }

            if(!key.hasOwnProperty('type') || !key.index || (typeof key.index !== 'number')){
                throw {code: nymphError.PARAM_ERR, message: 'key.type and key.index do not exist or error'};
            }

            //console.nativeLog('进入isValid函数（QT层）');
            //console.nativeLog('key = ' + JSON.stringify(key));
            //console.nativeLog('options = ' + JSON.stringify(options));
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'calculateCheckValue', [tempKey]);
            errorCode = this.getError(result.innerCode);
            //console.nativeLog('进入isValid函数（QT层返回）' + errorCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to verify key.', innerCode: result.innerCode};
            }

            if (result.data) {
                kcv = new Buffer(result.data, 'base64');
                console.log('生成的kcv码(bcd转hex) = ' +  encoding.bufferToHexString(kcv));
                return encoding.bufferToHexString(kcv);
            } else {
                throw {code: nymphError.ERROR, message: 'Failed to get KCV.'};
            }

        },

        /**
         * @method calculateMac
         * 计算 MAC。
         *
         *     // 计算 MAC 之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     var macKey = new pinPad.Key({
         *         index: 2,
         *         type: pinPad.KeyType.MAC,
         *         algorithm : pinPad.KeyAlgorithm.DES,(国密使用KeyAlgorithm.SM4)
         *         system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *     });
         *     var options = {
         *         masterKeyIndex: 1,
         *         mode: pinPad.MacMode.ECB,
         *         algorithm: pinPad.MacAlgorithm.ISO9797
         *     };
         *     // 用于 MAC 计算的数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
         *     var data = '0102030405060708abcdefABCDEF0102';
         *     // var data = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF, 0x01, 0x02];
         *     // var data = new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF, 0x01, 0x02]);
         *     try {
         *         var result = pinPadInstance.calculateMac(data, macKey, options);
         *     } catch (e) {
         *         // 计算 MAC 失败的处理
         *     }
         *
         * @param  {Object/String/Array} data 参与计算 MAC 的数据。data 为原始数据，不用补足 8 的倍数。数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)。
         * @param  {nymph.dev.pinPad.Key} key 密钥属性,如果是使用国密算法请将key.algorithm属性设置为SM4.
         * @param  {Object} options 选项。
         * @param {Number} options.masterKeyIndex 主密钥索引。当用来做 MAC 运算的密钥是密文的时候，需要指定解密该密钥的主密钥索引。
         * @param {Object} [options.initVctData=[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]] 初始向量数据，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         * @param {nymph.dev.pinPad.MacAlgorithm} [options.algorithm] MAC 算法。
         * @param {nymph.dev.pinPad.MacMode} options.mode MAC 工作模式。(在单DES情形下，0 = ECB, 1=CBC, 2=X99。）
         * @return {Object} MAC 后的数据，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        calculateMac: function (data, key, options) {
            var result, optionKey, errorCode, dataString, actualOptions, tempKey, initVctDataBuffer = new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
            actualOptions = {initVctData: initVctDataBuffer.toString('base64')};

            //console.nativeLog('进入calculateMac函数（JS层）进程1');
            dataString = tools.toBase64(data);

            if(!data){
                throw {code: nymphError.PARAM_ERR, message: 'data do not exist'};
            }



            if( !key || !key.hasOwnProperty('algorithm')){
                throw {code: nymphError.PARAM_ERR, message: 'key has not algorithm'};
            }

            if(!options){
                throw {code: nymphError.PARAM_ERR, message: 'options do not exist or error'};
            }

            if(options.mode){
                if((options.mode !== 0)&&(options.mode !== 1)&&(options.mode !== 2)){
                    throw {code: nymphError.PARAM_ERR, message: 'options.MacMode error'};
                }
            }

            //console.nativeLog('进入calculateMac函数（JS层）进程2');
            if (options) {
                for (optionKey in options) {
                    if (options.hasOwnProperty(optionKey)) {
                        if (optionKey === 'initVctData') {
                            if (Buffer.isBuffer(options.initVctData)) {
                                actualOptions[optionKey] = options.initVctData.toString('base64');
                            } else {
                                throw {code: nymphError.PARAM_ERR, message: 'Initial vector data should be a Buffer.'};
                            }
                        } else {
                            actualOptions[optionKey] = options[optionKey];
                        }
                    }
                }
            }

            //console.nativeLog('进入calculateMac函数（JS层）进程3');
            if (actualOptions.mode === null && typeof actualOptions.mode === 'undefined') {
                throw {code: nymphError.PARAM_ERR, message: 'Please specify MAC work mode(ECB/CBC)!'};
            }
            //console.nativeLog('dataString(base64) = ' + dataString);
            //console.nativeLog('key = ' + JSON.stringify(key));
            //console.nativeLog('actualOptions = ' + JSON.stringify(actualOptions));
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'calculateMac', [dataString, tempKey, actualOptions]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to calculate MAC.', innerCode: result.innerCode};
            }

            if (result.data) {
                return new Buffer(result.data, 'base64');
            }
            return null;
        },

        /**
         * @method encrypt
         * 加密。
         *
         *     // 加密之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     // 使用 PIN 密钥对数据进行加密。
         *     var key = new pinPad.Key({
         *         index: 1,
         *         type: pinPad.KeyType.PIN
         *         algorithm: KeyAlgorithm.TDES,(国密使用KeyAlgorithm.SM4)
         *         system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *     });
         *     var options = {
         *         masterKeyIndex: 1
         *     };
         *     // 用于加密的数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
         *     var data = '0102030405060708abcdefABCDEF0102';
         *     // var data = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF, 0x01, 0x02];
         *     // var data = new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF, 0x01, 0x02]);
         *     try {
         *         var result = pinPadInstance.encrypt(data, key, options);
         *     } catch (e) {
         *         // 加密失败的处理
         *     }
         *
         * @param  {Object/String/Array} data 需要加密的数据，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)。
         * @param  {nymph.dev.pinPad.Key} key 加密使用的密钥属性，如果是使用国密算法请将key.algorithm属性设置为SM4(工作密钥索引0到7)
         * @param {Object} options (Optional) 加密其他选项。
         * @param {Object/String/Array} options.keyData (Optional) 密钥数据明文，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)，长度可为 8 位、16 位、24 位。
         *                                                         这是用来做临时加密运算的，即调用者传入明文密钥、数据，接口返回加密结果，若该密钥已存在于密码键盘上，则无需传入密钥数据，国密算法时这个用法失效
         * @param {nymph.dev.pinPad.DesMode} options.desMode (Optional) des算法模式，可以不填写，默认为ECB模式
         * @return {Object} 加密后的数据，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        encrypt: function (data, key, options) {
            var result, errorCode, optionKey, dataString, tempKey, actualOptions = {isTmsKey: false};
            if(!data){
                throw {code: nymphError.PARAM_ERR, message: 'data error'};
            }
            //console.nativeLog('进入encrypt函数（JS层）进程1');
            dataString = tools.toBase64(data);
            if(!key){
                throw {code: nymphError.PARAM_ERR, message: 'key error'};
            }
            //console.nativeLog('进入encrypt函数（JS层）进程2');
            // 调整参数。
            if (options) {
                actualOptions.desMode = DesMode.TECB;
                for (optionKey in options) {
                    if (options.hasOwnProperty(optionKey)) {
                        if (optionKey === 'keyData') {
                            if(((options[optionKey].length !== 8)&&(options[optionKey].length !== 16)&&(options[optionKey].length !== 24))){
                                throw {code: nymphError.PARAM_ERR, message: 'keyData length error'};
                            }else{
                                actualOptions[optionKey] = tools.toBase64(options[optionKey]);
                            }
                        } else if(optionKey === 'desMode'){
                            if((options[optionKey] !== DesMode.TECB) && (options[optionKey] !== DesMode.TCBC)){
                                throw {code: nymphError.PARAM_ERR, message: 'des Mode error'};
                            }else{
                                actualOptions[optionKey] = options[optionKey];
                            }
                        } else {
                            actualOptions[optionKey] = options[optionKey];
                        }
                    }
                }
            } else {
                actualOptions.desMode = DesMode.TECB;
            }
            //console.nativeLog('进入encrypt函数（JS层）进程3');
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'encrypt', [dataString, tempKey, actualOptions]);
            errorCode = this.getError(result.innerCode);
            //console.nativeLog('进入encrypt函数（JS层）进程4');
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to encrypt.', innerCode: result.innerCode};
            }
            //console.nativeLog('进入encrypt函数（JS层）运行成功');
            if (result.data) {
                return new Buffer(result.data, 'base64');
            }
            return null;
        },

        /**
         * @method encryptMagTrackData
         * 加密磁道数据。
         *
         *     // 加密之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *
         *     var key = new pinPad.Key({
         *         index: 1,
         *         type: pinPad.KeyType.TRACK,
         *         algorithm: KeyAlgorithm.TDES,(国密使用KeyAlgorithm.SM4)
         *         system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *     });
         *
         *     // 用于加密的数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
         *     var data = '0102030405060708abcdefABCDEF0102';
         *     // var data = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF, 0x01, 0x02];
         *     // var data = new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF, 0x01, 0x02]);
         *     try {
         *         var result = pinPadInstance.encryptMagTrackData(data, key, options);
         *     } catch (e) {
         *         // 加密失败的处理
         *     }
         *
         * @param  {Object/String/Array} data 需要加密的磁道数据，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)。
         * @param  {nymph.dev.pinPad.Key} key 加密使用的密钥属性，如果是使用国密算法请将key.algorithm属性设置为SM4(工作密钥索引0到7)
         * @param {Object} options (Optional) 加密其他选项。
         * @param {nymph.dev.pinPad.DesMode} options.desMode (Optional) des算法模式，可以不填写，默认为ECB模式
         * @return {Object} 加密后的数据，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        encryptMagTrackData: function (data, key, options) {
            var result, errorCode, optionKey, dataString, tempKey, actualOptions = {isTmsKey: false};
            if(!data){
                throw {code: nymphError.PARAM_ERR, message: 'data error'};
            }
            //console.nativeLog('进入encrypt函数（JS层）进程1');
            dataString = tools.toBase64(data);
            if(!key){
                throw {code: nymphError.PARAM_ERR, message: 'key error'};
            }
            //console.nativeLog('进入encrypt函数（JS层）进程2');
            // 调整参数。
            if (options) {
                actualOptions.desMode = DesMode.TECB;
                for (optionKey in options) {
                    if (options.hasOwnProperty(optionKey)) {
                        if(optionKey === 'desMode'){
                            if((options[optionKey] !== DesMode.TECB) && (options[optionKey] !== DesMode.TCBC)){
                                throw {code: nymphError.PARAM_ERR, message: 'des Mode error'};
                            }else{
                                actualOptions[optionKey] = options[optionKey];
                            }
                        } else {
                            actualOptions[optionKey] = options[optionKey];
                        }
                    }
                }
            } else {
                actualOptions.desMode = DesMode.TECB;
            }
            //console.nativeLog('进入encryptMagTrackData函数（JS层）进程3');
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'encryptMagTrackData', [dataString, tempKey, actualOptions]);
            errorCode = this.getError(result.innerCode);
            //console.nativeLog('进入encryptMagTrackData函数（JS层）进程4');
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to encryptMagTrackData.', innerCode: result.innerCode};
            }
            //console.nativeLog('进入encryptMagTrackData函数（JS层）运行成功');
            if (result.data) {
                return new Buffer(result.data, 'base64');
            }
            return null;
        },

        /**
         * @method decrypt
         * 解密。
         *
         *     // 解密之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     // 使用 PIN 密钥对数据进行解密。
         *     var key = new pinPad.Key({
         *         index: 1,
         *         type: pinPad.KeyType.PIN
         *         algorithm: KeyAlgorithm.TDES(国密使用KeyAlgorithm.SM4)
         *         system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *     });
         *     var options = {
         *         masterKeyIndex: 1
         *     };
         *     // 用于解密的数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
         *     var data = '0102030405060708abcdefABCDEF0102';
         *     // var data = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF, 0x01, 0x02];
         *     // var data = new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0xab, 0xcd, 0xef, 0xAB, 0xCD, 0xEF, 0x01, 0x02]);
         *     try {
         *         var result = pinPadInstance.decrypt(data, key, options);
         *     } catch (e) {
         *         // 解密失败的处理
         *     }
         *
         * @param  {Object/String/Array} data 需要解密的数据，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)。
         * @param  {nymph.dev.pinPad.Key} key 解密使用的密钥属性，如果是使用国密算法请将key.algorithm属性设置为SM4(工作密钥索引0到7)
         * @param {Object} options (Optional) 解密其他选项。
         * @param {Object/String/Array} options.keyData (Optional) 密钥数据，数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)，长度可为 8 位、16 位、24 位。
         *                                                          这是用来做临时解密运算的，即调用者传入明文密钥、数据，接口返回解密结果，若该密钥已存在于密码键盘上，则无需传入密钥数据，国密算法时这个用法失效
         ** @param {nymph.dev.pinPad.DesMode} options.desMode (Optional) des算法模式，可以不填写，默认为ECB模式
         * @return {Object} 解密后的数据，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        decrypt: function (data, key, options) {
            var result, errorCode, optionKey, dataString, tempKey,actualOptions = {isTmsKey: false};
            if(!data){
                throw {code: nymphError.PARAM_ERR, message: 'data error'};
            }
            //console.nativeLog('进入decrypt函数（JS层）进程1');
            dataString = tools.toBase64(data);
            if(!key){
                throw {code: nymphError.PARAM_ERR, message: 'key error'};
            }
            //console.nativeLog('进入decrypt函数（JS层）进程2');
            // 调整参数。
            if (options) {
                actualOptions.desMode = DesMode.TECB;
                for (optionKey in options) {
                    if (options.hasOwnProperty(optionKey)) {
                        if (optionKey === 'keyData') {
                            if(((options[optionKey].length !== 8)&&(options[optionKey].length !== 16)&&(options[optionKey].length !== 24))){
                                throw {code: nymphError.PARAM_ERR, message: 'keyData length error'};
                            }else{
                                actualOptions[optionKey] = tools.toBase64(options[optionKey]);
                            }
                        } else if(optionKey === 'desMode'){
                            if((options[optionKey] !== DesMode.TECB) && (options[optionKey] !== DesMode.TCBC)){
                                throw {code: nymphError.PARAM_ERR, message: 'des Mode error'};
                            }else{
                                actualOptions[optionKey] = options[optionKey];
                            }
                        } else {
                            actualOptions[optionKey] = options[optionKey];
                        }
                    }
                }
            } else {
                actualOptions.desMode = DesMode.TECB;
            }
            //console.nativeLog('进入decrypt函数（JS层）进程3');
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'decrypt', [dataString, tempKey, actualOptions]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to decrypt.', innerCode: result.innerCode};
            }
            //console.nativeLog('进入decrypt函数（JS层）运行成功');
            if (result.data) {
                return new Buffer(result.data, 'base64');
            }
            return null;
        },

        /**
         * @method doesKeyExist
         * 检查指定密钥是否存在。
         *
         *     // 检查指定密钥是否存在之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     // 检查 PIN 密钥是否存在。
         *     var key = new pinPad.Key({
         *         index: 1,
         *         type: pinPad.KeyType.PIN
         *         system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *     });
         *     try {
         *         var result = pinPadInstance.doesKeyExist(key);
         *         if (result) {
         *             // 密钥存在
         *         } else {
         *             // 密钥不存在
         *         }
         *     } catch (e) {
         *         // 检查指定密钥是否存在失败的处理
         *     }
         *
         * @param  {nymph.dev.pinPad.Key} key 密钥属性。(工作密钥索引0到7)
         * @return {Boolean} 指定密钥是否存在。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        doesKeyExist: function (key) {
            var result, errorCode,tempKey;
            if(!key || (typeof key !== 'object')){
                throw {code: nymphError.PARAM_ERR, message: 'key error'};
            }
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'doesKeyExist', [tempKey]);
            errorCode = this.getError(result.innerCode);
            if ((errorCode !== nymphError.SUCCESS)&&(result.innerCode !== 39)) {
                throw {code: errorCode, message: 'Failed to check the key.', innerCode: result.innerCode};
            }

            if (result.data) {
                //console.nativeLog('指定密钥的信息 = ' + JSON.stringify(result.data));
                return true;
            }else if(result.innerCode === 39){
                return false;
            }

        },

        /**
         * @method deleteKey
         * 删除指定的密钥。
         * @private
         *
         *     // 删除指定的密钥之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     // 删除 PIN 密钥。
         *     var key = new pinPad.Key({
         *         index: 1,
         *         type: pinPad.KeyType.PIN
         *         system:KeySystem.MKSK(这个值默认值为MKSK，不传就默认为MKSK)
         *     });
         *     try {
         *         pinPadInstance.deleteKey(key);
         *     } catch (e) {
         *         // 删除 PIN 密钥失败的处理
         *     }
         *
         * @param  {nymph.dev.pinPad.Key} key 密钥属性。(工作密钥索引0到7)
         * @member nymph.dev.pinPad.PinPad
         */
        deleteKey: function (key) {
            var result, errorCode,tempKey;
            if(!key || (typeof key !== 'object')){
                throw {code: nymphError.PARAM_ERR, message: 'key error'};
            }
            tempKey = new Key(key);
            result = hermes.exec(this.PLUGINID, this.instanceId, 'deleteKey', [tempKey]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to delete the key.', innerCode: result.innerCode};
            }
        },

        /**
         * @method inputOnlinePin
         * 输入联机 PIN。
         *
         *     // 输入联机 PIN 之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     var options = {
         *       lengthLimit:[4, 8],
         *       pan: '123456789012345678',
         *       completeTimeout: 600,
         *       keypressTimeout: 10
         *     };
         *
         *     var pinKey = new pinPad.Key({
         *         system: pinPad.KeySystem.MKSK,(可以不传，不传为默认值，默认值为MKSK)
         *         type: pinPad.KeyType.PIN,
         *         algorithm: pinPad.KeyAlgorithm.TDES,(国密使用KeyAlgorithm.SM4)
         *         index: 2
         *     });
         *
         *     // 移除所有监听器
         *     pinPadInstance.removeAllListeners();
         *
         *     pinPadInstance.on('keypress', function (keycode) {
         *     switch (keyCode) {
         *        // 不同 keyCode 的处理
         *     });
         *
         *     pinPadInstance.inputOnlinePin(pinKey, options, function(err, pinBlock){
         *         pinPadInstance.close();
         *         if (err) {
         *            // 输入 pin 出错的处理
         *         } else {
         *           // 输入 pin 成功的处理
         *         }
         *     });
         *
         * @param  {nymph.dev.pinPad.Key} key 密钥属性。`key.type` 默认为 `pinPad.Type.PIN`，如果是使用国密算法请将key.algorithm属性设置为SM4
         * @param {Object} options 输入联机 PIN 时需要的参数。
         * @param {String} [options.pan=null] 完整的主账号。
         * @param {Number} options.completeTimeout (Optional) PIN 输入的超时时间，值应为 300 - 600,最大值为 600s。单位为秒。
         * @param {Number} options.keypressTimeout (Optional) 两次 PIN 按键动作之间的超时时间，值应为 1- 300,最大为 300s。单位为秒。

         * @param {Array} [options.lengthLimit] 支持的PIN长度（数组），数组内容不大于12且不小于4（可为0值）。
         * @param {Boolean} [options.allowCancelFromPinPad=true]  禁止从 PIN Pad 按取消键取消 PIN 输入。用于有触摸屏或者上位机的场景。
         * @param {Boolean} [options.autoComplete=true]  当 PIN 长度达到指定长度时，自动完成 PIN 输入过程。用于有触摸屏或者上位机的场景。
         * @param {Boolean} [options.allowInjectKey=true]  是否允许上位机按取消键结束交易，以干涉 PIN 输入过程。用于有触摸屏或者上位机的场景。
         * @param {nymph.dev.pinPad.PinMode} [pinMode=ISO9564FMT0] PIN 算法类型。
         * @fires keypress
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         * @param {Object} callback.pinBlock 密码密文，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)，长度为 8 位。当密码为空时，pinBlock 为 null。
         * @member nymph.dev.pinPad.PinPad
         */
        inputOnlinePin: function (key, options, callback) {
            var self = this, optionKey, result,errorCode ,tempKey,dataLenStr = '', actualOptions = {},
                err = new Error();
            if(!callback || (typeof callback !== 'function')){
                throw {code: nymphError.PARAM_ERR, message: 'callback do not exist or error'};
            }
            if (self.isInputting) {
                err.code = nymphError.DEVICE_USED;
                err.message = 'Already executing PIN input, please wait until this PIN input finished.';
                callback.call(self, err);
                return;
            }

            if(!key || (typeof key !== 'object')){
                err.code = nymphError.PARAM_ERR;
                err.message = 'key do not exist or error';
                callback.call(self, err);
                self.isInputting = false;
                return;
            }

            if(!key.hasOwnProperty('system') || !key.index || (typeof key.index !== 'number')){
                err.code = nymphError.PARAM_ERR;
                err.message = 'key.system and key.index do not exist or error';
                callback.call(self, err);
                self.isInputting = false;
                return;
            }

            if (!options){
                err.code = nymphError.PARAM_ERR;
                err.message = 'options do not exist';
                callback.call(self, err);
                return;
            }

            if ((options.completeTimeout) && (typeof options.completeTimeout === 'number')) {
                if (options.completeTimeout > 600 || options.completeTimeout < 300) {
                    err.code = nymphError.PARAM_ERR;
                    err.message = 'The timeout of PIN input should between 300s and 600s(including 300s and 600s).';
                    callback.call(self, err);
                    self.isInputting = false;
                    return;
                }
            }else{
                err.code = nymphError.PARAM_ERR;
                err.message = 'options.completeTimeout error';
                callback.call(self, err);
                self.isInputting = false;
                return;
            }

            if ((options.keypressTimeout) && (typeof options.completeTimeout === 'number')) {
                if (options.keypressTimeout > 300 || options.keypressTimeout < 1) {
                    err.code = nymphError.PARAM_ERR;
                    err.message = 'The timeout between two key presses shoud between 1s and 300s(including 1s and 300s).';
                    callback.call(self, err);
                    self.isInputting = false;
                    return;
                }
            }else{
                err.code = nymphError.PARAM_ERR;
                err.message = 'options.keypressTimeout error';
                callback.call(self, err);
                self.isInputting = false;
                return;
            }

            if (!options.hasOwnProperty('allowCancelFromPinPad')) {
                options.allowCancelFromPinPad = true;
            }
            /*    if (!options.hasOwnProperty('autoComplete')) {
             options.autoComplete = true;
             }
             */
            if (!options.hasOwnProperty('allowInjectKey')) {
                options.allowInjectKey = true;
            }

            if (!options.pinMode) {
                options.pinMode = PinMode.ISO9564FMT0;
            }

            if (!options.pan || (typeof options.pan !== 'string')){
                err.code = nymphError.PARAM_ERR;
                err.message = 'options.pan error';
                callback.call(self, err);
                self.isInputting = false;
                return;
            }
            //console.nativeLog('@@@@  options[lengthLimit] = ' +  options['lengthLimit']);
            // 调整参数。
            if (options && (typeof options === 'object')) {
                for (optionKey in options) {
                    if (options.hasOwnProperty(optionKey)) {
                        if ((optionKey === 'lengthLimit')) {
                            if((options.lengthLimit)&& (options.lengthLimit instanceof Array)){
                                //console.nativeLog('@@@@  options[lengthLimit] step 1 = ' +optionKey);
                                for (var i = 0; i <= 12; i++) {
                                    //console.nativeLog('@@@@  options[lengthLimit] step 2(i) = ' + i);
                                    for (var j in options.lengthLimit) {
                                        if((options.lengthLimit[j]>12||options.lengthLimit[j]<4)&&(options.lengthLimit[j] !== 0 )){
                                            err.code = nymphError.PARAM_ERR;
                                            err.message = 'options.lengthLimit error,i<4 or i>12';
                                            callback.call(self, err);
                                            self.isInputting = false;
                                            return;
                                        }
                                        //console.nativeLog('@@@@  options[lengthLimit] step 3(j) = ' + j + ' data = ' + options['lengthLimit'][j]);
                                        if (i === options.lengthLimit[j]) {
                                            if (i === 0 || (i >= 4 && i <= 9)) {
                                                dataLenStr = dataLenStr + '0' + i;
                                            }
                                            else if (i === 10) {
                                                dataLenStr = dataLenStr + '0' + 'a';
                                            }
                                            else if (i === 11) {
                                                dataLenStr = dataLenStr + '0' + 'b';
                                            }
                                            else if (i === 12) {
                                                dataLenStr = dataLenStr + '0' + 'c';
                                            }else{
                                                err.code = nymphError.PARAM_ERR;
                                                err.message = 'options.lengthLimit error,i<4 or i>12';
                                                callback.call(self, err);
                                                self.isInputting = false;
                                                return;
                                            }
                                            //console.nativeLog('@@@@  options[lengthLimit] step 4(dataLenStr) = ' + dataLenStr);
                                            break;
                                        }

                                    }
                                }
                                //console.nativeLog('@@@@  options[lengthLimit] step 5(dataLenStr) = ' + dataLenStr);
                                actualOptions[optionKey] = tools.toBase64(encoding.hexStringToBuffer(dataLenStr));
                                //console.nativeLog('@@@@  options[lengthLimit] step 6(dataLenStr) = ' +  actualOptions['lengthLimit']);
                            }
                            else {
                                err.code = nymphError.PARAM_ERR;
                                err.message = 'options.lengthLimit type error';
                                callback.call(self, err);
                                self.isInputting = false;
                                return;
                            }
                        } else {
                            actualOptions[optionKey] = options[optionKey];
                        }
                    }
                }
            }else{
                err.code = nymphError.PARAM_ERR;
                err.message = 'options do not exist';
                callback.call(self, err);
                self.isInputting = false;
                return;
            }

            self.isInputting = true;
            //console.nativeLog('actualOptions[lengthLimit] step 7 (bufferToHexString) = ' + actualOptions['lengthLimit']);
            tempKey = new Key(key);
            //console.nativeLog('进入inputOnlinePin函数（JS层）进程2');
            result = hermes.exec(self.PLUGINID, this.instanceId, 'inputOnlinePin', [tempKey, actualOptions], function (error, pinBlock) {
                //console.nativeLog('进入inputOnlinePin函数（JS层）进程3');
                self.isInputting = false;
                if (error) {
                    err.code = self.getError(error.innerCode);
                    err.message = 'inputOnlinePin return fail:'+err.code;
                    //console.nativeLog('inputOnlinePin函数（JS层）进程4，err.code = ' + err.code);
                    callback.call(self, err);
                } else {
                    // 底层送上来的已经是 8 个字节密文
                    if (pinBlock === 0) {
                        //console.nativeLog('inputOnlinePin函数（JS层）进程4，pinBlock = NULL');
                        callback.call(self, null, null);
                    } else {
                        //console.nativeLog('inputOnlinePin函数（JS层）进程4，返回的pinBlock长度： ' + pinBlock.length);
                        var pinOriginalBuffer = new Buffer(pinBlock, 'base64');
                        //console.nativeLog('inputOnlinePin函数（JS层）进程4，返回的pinBlock = ' + encoding.bufferToHexString(pinOriginalBuffer));
                        //var pinOriginalString = pinOriginalBuffer.toString('ascii');
                        //var pinBuffer = encoding.hexStringToBuffer(pinOriginalString);
                        callback.call(self, null, pinOriginalBuffer);
                    }
                }
            });
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                err.code = errorCode;
                err.message = 'inputOnlinePin return fail:'+errorCode;
                self.isInputting = false;
                callback.call(self, err);
                return;
            }
        },

        /**
         * @method inputOfflinePin
         * 输入脱机 Pin。
         *
         *     // 输入脱机 PIN 之前要先执行成功 {@link nymph.dev.pinPad.PinPad#open open}。
         *     var options = {
         *       lengthLimit: [4, 8],
         *       completeTimeout: 600,
         *       keypressTimeout: 10
         *     };
         *
         *     // 移除所有监听器
         *     pinPadInstance.removeAllListeners();
         *
         *     pinPadInstance.on('keypress', function (keycode) {
         *     switch (keyCode) {
         *        // 不同 keyCode 的处理
         *     });
         *
         *     pinPadInstance.inputOfflinePin(options, function(err, pinBlock){
         *         pinPadInstance.close();
         *         if (err) {
         *            // 输入 pin 出错的处理
         *         } else {
         *           // 输入 pin 成功的处理
         *         }
         *     });
         *
         * @param {Object} options (Optional) 输入脱机 PIN 时需要的参数。
         * @param {Boolean} [options.lengthLimit] 支持的PIN长度（数组），数组内容不大于12且不小于4（可为0值）。
         * @param {Number} options.completeTimeout (Optional) PIN 输入的超时时间，值应为 300 - 600,最大值为 600s。单位为秒。
         * @param {Number} options.keypressTimeout (Optional) 两次 PIN 按键动作之间的超时时间，值应为 1- 300,最大为 300s。单位为秒。
         * @fires keypress
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         * @param {Object} callback.pinBlock 成功返回全零.
         * @member nymph.dev.pinPad.PinPad
         */
        inputOfflinePin: function (options, callback) {
            var self = this, optionKey, result, errorCode,dataLenStr = '', actualOptions = {},
                err = new Error();
            if(!callback || (typeof callback !== 'function')){
                throw {code: nymphError.PARAM_ERR, message: 'callback do not exist or error'};
            }
            if (self.isInputting) {
                err.code = nymphError.DEVICE_USED;
                err.message = 'Already executing PIN input, please wait until this PIN input finished.';
                callback.call(self, err);
                return;
            }
            if (!options){
                err.code = nymphError.PARAM_ERR;
                err.message = 'options do not exist';
                callback.call(self, err);
                return;
            }

            if (options.completeTimeout && (typeof options.completeTimeout === 'number')) {
                if (options.completeTimeout > 600 || options.completeTimeout < 300) {
                    err.code = nymphError.PARAM_ERR;
                    err.message = 'The timeout of PIN input should between 300s and 600s(including 300s and 600s).';
                    callback.call(self, err);
                    self.isInputting = false;
                    return;
                }
            }else{
                err.code = nymphError.PARAM_ERR;
                err.message = 'options.completeTimeout error';
                callback.call(self, err);
                return;
            }

            if (options.keypressTimeout && (typeof options.completeTimeout === 'number')) {
                if (options.keypressTimeout > 300 || options.keypressTimeout < 1) {
                    err.code = nymphError.PARAM_ERR;
                    err.message = 'The timeout between two key presses shoud between 1s and 300s(including 1s and 300s).';
                    callback.call(self, err);
                    self.isInputting = false;
                    return;
                }
            }else{
                err.code = nymphError.PARAM_ERR;
                err.message = 'options.completeTimeout error';
                callback.call(self, err);
                return;
            }

            //console.nativeLog('进入inputOfflinePin函数（JS层）进程2');

            //console.nativeLog('@@@@  options[lengthLimit] = ' +  options['lengthLimit']);
            // 调整参数。
            if (options && (typeof options === 'object')) {
                for (optionKey in options) {
                    if (options.hasOwnProperty(optionKey)) {
                        if (optionKey === 'lengthLimit') {
                            if((options.lengthLimit)&& (options.lengthLimit instanceof Array)){
                                //console.nativeLog('@@@@  options[lengthLimit] step 1 = ' +optionKey);
                                for (var i = 0; i <= 12; i++) {
                                    //console.nativeLog('@@@@  options[lengthLimit] step 2(i) = ' + i);
                                    for (var j in options.lengthLimit) {
                                        if((options.lengthLimit[j]<4 || options.lengthLimit[j]>12)&&(options.lengthLimit[j] !== 0 )){
                                            err.code = nymphError.PARAM_ERR;
                                            err.message = 'options.lengthLimit error,i<4 or i>12';
                                            callback.call(self, err);
                                            return;
                                        }
                                        //console.nativeLog('@@@@  options[lengthLimit] step 3(j) = ' + j + ' data = ' + options['lengthLimit'][j]);
                                        if (i === options.lengthLimit[j]) {
                                            if (i === 0 || (i >= 4 && i <= 9)) {
                                                dataLenStr = dataLenStr + '0' + i;
                                            }
                                            else if (i === 10) {
                                                dataLenStr = dataLenStr + '0' + 'a';
                                            }
                                            else if (i === 11) {
                                                dataLenStr = dataLenStr + '0' + 'b';
                                            }
                                            else if (i === 12) {
                                                dataLenStr = dataLenStr + '0' + 'c';
                                            }else{
                                                err.code = nymphError.PARAM_ERR;
                                                err.message = 'options.lengthLimit error,i<4 or i>12';
                                                callback.call(self, err);
                                                return;
                                            }
                                            //console.nativeLog('@@@@  options[lengthLimit] step 4(dataLenStr) = ' + dataLenStr);
                                            break;
                                        }

                                    }
                                }
                                //console.nativeLog('@@@@  options[lengthLimit] step 5(dataLenStr) = ' + dataLenStr);
                                actualOptions[optionKey] = tools.toBase64(encoding.hexStringToBuffer(dataLenStr));
                                //console.nativeLog('@@@@  options[lengthLimit] step 6(dataLenStr) = ' +  actualOptions['lengthLimit']);
                            }else{
                                err.code = nymphError.PARAM_ERR;
                                err.message = 'options.lengthLimit type error';
                                callback.call(self, err);
                                return;
                            }

                        } else {
                            actualOptions[optionKey] = options[optionKey];
                        }
                    }
                }
            }else{
                err.code = nymphError.PARAM_ERR;
                err.message = 'options do not exist';
                callback.call(self, err);
                return;
            }

            self.isInputting = true;
            result = hermes.exec(self.PLUGINID, this.instanceId, 'inputOfflinePin', [actualOptions], function (error, pinBlock) {
                //console.nativeLog('进入inputOfflinePin函数（JS层）进程3');
                self.isInputting = false;
                if (error) {
                    err.code = self.getError(error.innerCode);
                    err.message = 'inputOfflinePin return fail:'+err.code;
                    //console.nativeLog('inputOfflinePin函数（JS层）进程4，err.code = ' + err.code);
                    callback.call(self, err);
                } else {
                    // 底层送上来的已经是 8 个字节密文
                    if (pinBlock === 0) {
                        //console.nativeLog('inputOfflinePin函数（JS层）进程4，pinBlock = NULL');
                        callback.call(self, null, null);
                    } else {
                        var pinOriginalBuffer = new Buffer(pinBlock, 'base64');
                        //console.nativeLog('inputOfflinePin函数（JS层）进程4，返回的pinBlock = ' + encoding.bufferToHexString(pinOriginalBuffer));
                        //var pinOriginalString = pinOriginalBuffer.toString('ascii');
                        //var pinBuffer = encoding.hexStringToBuffer(pinOriginalString);
                        callback.call(self, null, pinOriginalBuffer);
                    }
                }
            });
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                err.code = errorCode;
                err.message = 'inputOfflinePin return fail:'+errorCode;
                self.isInputting = false;
                callback.call(self, err);
                return;
            }
        },

        /**
         * @method downloadMkeyFromMasterPos
         * 从母pos下载主密钥，调用这个接口可以不用new或者open（这个接口仅对海外市场使用）
         *
         *     try {
         *         pinPadInstance.downloadMkeyFromMasterPos(callback);
         *     } catch (e) {
         *
         *     }
         *
         * @param {Function} callback 回调操作，
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        downloadMkeyFromMasterPos: function (callback) {
            var result, errorCode,self = this,err = new Error();
            console.log('pinpad.js downloadMkeyFromMasterPos');
            if (self.isInputting) {
                throw {code: nymphError.DEVICE_USED, message: 'AlReady waiting for master key. Please wait or cancel!'};
            }
            if(!callback){
                throw {code: nymphError.PARAM_ERR, message: 'callback do not exist or error'};
            }

            hermes.exec(this.PLUGINID, this.instanceId, 'downloadMkeyFromMasterPos', [] ,function(error){
                self.isInputting = false;
                if (error) {
                    errorCode = self.getError(error.innerCode);
                    err.code = errorCode;
                    err.message = 'downloadMkeyFromMasterPos return fail:'+errorCode;
                    self.isInputting = false;
                    callback.call(self, err);
                } else {
                    callback.call(self, null);
                }
            });
        },

        /**
         * @method cancelDownloadMkeyFromMasterPos
         * 取消从母pos下载主密钥，调用这个接口可以不用open（这个接口仅对海外市场使用）
         *
         *     try {
         *         pinPadInstance.cancelDownloadMkeyFromMasterPos();
         *     } catch (e) {
         *
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        cancelDownloadMkeyFromMasterPos: function () {
            var result, errorCode,self = this;

            result = hermes.exec(this.PLUGINID, this.instanceId, 'cancelDownloadMkeyFromMasterPos', []);
            errorCode = this.getError(result.innerCode);
            self.isInputting = false;
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to cancelDownloadMkeyFromMasterPos.', innerCode: result.innerCode};
            }
        },

        /**
         * @method cancelInputPin
         * 取消 PIN 输入。
         *
         *     try {
         *         pinPadInstance.cancelInputPin();
         *     } catch (e) {
         *         // 取消 PIN 输入失败的处理
         *     }
         *
         * @param {Boolean} [isQuit=true] 是否是用户主动退出
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        cancelInputPin: function (isQuit) {
            var result, errorCode;

            if (!this.isInputting) {
                // 用户没有请求输入联机 pin，则无需通知底层取消
                throw {code: nymphError.ERROR, message: 'Do not input pin!'};
            }

            if (isQuit === null || typeof isQuit === 'undefined' || typeof isQuit !== 'boolean') {
                // 默认为用户主动退出
                isQuit = true;
            }

            result = hermes.exec(this.PLUGINID, this.instanceId, 'cancelInputPin', [isQuit]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to cancel PIN input.', innerCode: result.innerCode};
            }else {
                //输pin标准设置为false，否则在close时会重复调用cancelInputPin影响close
                this.isInputting = false;
            }
        },

        /**
         * @method display
         * 在外置密码键盘上显示内容。
         *
         * ** 该接口只对外置密码键盘有效。**
         *
         *     try {
         *         // 清空第一行内容
         *         pinPadInstance.display(1);
         *
         *         // 在第一行显示 message
         *         pinPadInstance.display(1， '显示消息内容');
         *     } catch (e) {
         *         // 在外置密码键盘上显示内容失败的处理
         *     }
         *
         * @param  {Number} lineNumber 行号。取值范围为 [1, 2]。
         * @param  {String} message 显示的内容。当 message 字符串为空格符时(' ')，可清空该行内容。(当输入字符串超过 16 字节时, 只显示前 16 字节)
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        display: function (lineNumber, message) {
            var result, errorCode;
            // message长度为0，则抛出异常。
            if(!lineNumber || (typeof lineNumber !== 'number')){
                throw {code: nymphError.PARAM_ERR, message: 'lineNumber miss'};
            }
            if (!message || message === '') {
                throw {code: nymphError.PARAM_ERR, message: 'Param miss'};
            }
            result = hermes.exec(this.PLUGINID, this.instanceId, 'display', [lineNumber, message]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {
                    code: errorCode,
                    message: 'Failed to display message on external PIN pad.',
                    innerCode: result.innerCode
                };
            }
        },

        /**
         * @method clearScreen
         * 清空外置密码键盘上显示的内容。
         *
         * ** 该接口只对外置密码键盘有效。**
         *
         *     try {
         *         pinPadInstance.clearScreen(1);
         *     } catch (e) {
         *         // 清空外置密码键盘上显示的内容失败的处理
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        clearScreen: function () {
            var result, errorCode;

            result = hermes.exec(this.PLUGINID, this.instanceId, 'clearScreen', []);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {
                    code: errorCode,
                    message: 'Failed to clear messages on the external PIN pad.',
                    innerCode: result.innerCode
                };
            }
        },

        /**
         * @method beep
         * 让外置密码键盘鸣叫指定时间。
         *
         * ** 该接口只对外置密码键盘有效。**
         *
         *     try {
         *         // 蜂鸣 1 s
         *         pinPadInstance.beep(1000);
         *     } catch (e) {
         *         // 蜂鸣失败的处理
         *     }
         *
         * @param {Number} msec 蜂鸣的时间，单位为毫秒。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        beep: function (msec) {
            var result, errorCode;
            if(!msec || typeof msec !== 'number'){
                throw {code: nymphError.PARAM_ERR, message: 'msec miss'};
            }
            result = hermes.exec(this.PLUGINID, this.instanceId, 'beep', [msec]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to beep on external PIN pad.', innerCode: result.innerCode};
            }
        },

        /**
         * @method getRandom
         * 获取 8 字节随机数。
         *
         *     try {
         *        // 获取 8 字节的随机数
         *        var random = pinPadInstance.getRandom();
         *     } catch (e) {
         *         // 获取失败的处理
         *     }
         *
         * @return {Object} 8 字节随机数，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        getRandom: function () {
            var result, errorCode;
            result = hermes.exec(this.PLUGINID, this.instanceId, 'getRandom', []);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to get random data.', innerCode: result.innerCode};
            }

            return new Buffer(result.data, 'base64');
        },

        /**
         * @method close
         * 关闭密码键盘。
         *
         *     try {
         *        pinPadInstance.close();
         *     } catch (e) {
         *         // 关闭失败的处理
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        close: function () {
            var result, errorCode;
            if (this.isInputting) {
                this.cancelInputPin();
            }
            result = hermes.exec(this.PLUGINID, this.instanceId, 'close', []);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to close PIN pad.', innerCode: result.innerCode};
            }

            if (this.instanceId !== hermes.NULL) {
                hermes.removeJsPluginInstance(this.instanceId);
            }

            this.instanceId = hermes.NULL;
            this.unBindEvents();
        },

        /**
         * @method format
         * 格式化密码键盘。
         * @private
         *
         * ** 请谨慎使用该接口。** 物理设备上的所有密钥数据，配置信息都将被擦除。注：'用户序列号' 不会被清除。
         *
         *     try {
         *        pinPadInstance.format();
         *     } catch (e) {
         *         // 格式化失败的处理
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        format: function () {
            var result, errorCode;

            result = hermes.exec(this.PLUGINID, this.instanceId, 'format', []);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to format PIN pad.', innerCode: result.innerCode};
            }
        },
        /**
         * @property {Number} FOPTBV_ENCRYPTED_BY_PUBLIC_KEY mFmtOfPin 的有效取值之一, 表征送 IC 卡校验的 PIN 经公钥加密的密文形态.
         * @member nymph.dev.pinPad.PinPad
         */
        FOPTBV_ENCRYPTED_BY_PUBLIC_KEY: 1,

        /**
         * @property {Number} FOPTBV_PLAIN_TEXT mFmtOfPin 的有效取值之一, 表征送 IC 卡校验的 PIN 是明文形态.
         * @member nymph.dev.pinPad.PinPad
         */
        FOPTBV_PLAIN_TEXT: 0,

        /**
         * @property {Number} VCF_DEFAULT 目前唯一支持的 mVerifyCmdFmt 的取值
         * @member nymph.dev.pinPad.PinPad
         */
        VCF_DEFAULT: 0,

        /**
         * @property {Number} PEUK_EXP_BYTE_LEN PEUK 的 指数 buffer 的 字节长度.
         * @member nymph.dev.pinPad.PinPad
         */
        PEUK_EXP_BYTE_LEN: 128,

        /**
         * @property {Number} PEUK_EXPIRED_DATA_LEN 公钥失效期长度.
         * @member nymph.dev.pinPad.PinPad
         */
        PEUK_EXPIRED_DATA_LEN: 4,

        /**
         * @property {Number} PEUK_HASH_BYTE_LEN PEUK 校验 hash 的字节长度.
         * @member nymph.dev.pinPad.PinPad
         */
        PEUK_HASH_BYTE_LEN: 20,

        /**
         * @property {Number} PEUK_MOD_BYTE_LEN PEUK 模 buffer 的字节长度.
         * @member nymph.dev.pinPad.PinPad
         */
        PEUK_MOD_BYTE_LEN: 256,
        /**
         * @method verifyOfflinePin
         * 验证脱机pin。
         *
         * **下装密文密钥时，必须确保用于解密的明文主密钥存在，否则将导致失败。**
         *
         *
         * @param {Object} options (Optional)  认证操作的配置。
         * @param {Number} options.icCardToken   提供给 pinpad 物理设备的, 用来索引目标 IC 卡设备的 token.
         * @param {Number} options.fmtOfPin   指定将送 IC 卡验证的 PIN block 的形式, 密文 or 明文. 有效的取值是 FOPTBV_PLAIN_TEXT 或者 FOPTBV_ENCRYPTED_BY_PUBLIC_KEY.
         * @param {Object} options.random   8 字节随机数, 仅仅在要提交 密文 PIN 的时候有效.
         * @param {Number} options.verifyCmdFmt    指定将送 IC 卡的 "PIN 校验 APDU 报文" 的具体格式类型.(目前唯一支持的 mVerifyCmdFmt 的取值为VCF_DEFAULT)
         * @param {Object} options.pinKey    用于对 PIN 加密的公钥数据, 仅仅在要提交 密文 PIN 的时候有效, 即 mFmtOfPin 是 FOPTBV_ENCRYPTED_BY_PUBLIC_KEY.
         * @param {Object} options.pinKey.exp    公钥指数. 长度不超过 PEUK_EXP_BYTE_LEN
         * @param {Object} options.pinKey.expiredDate     公钥失效期, YY YY MM DD，首字节暂无需设置. 长度必须是 PEUK_EXPIRED_DATA_LEN.
         * @param {Object} options.pinKey.hash     公钥校验和, 用于定期检查, 可不赋值. 长度必须是 PEUK_HASH_BYTE_LEN.
         * @param {Number} options.pinKey.hasHash     公钥校验和是否存在.1 表示存在，0不存在
         * @param {Number} options.pinKey.index     公钥索引.
         * @param {Object} options.pinKey.mod     公钥的模. 长度不超过 PEUK_MOD_BYTE_LEN.
         * @param {Object} options.pinKey.rid     RID
         * @param {Number} verifyMode (verifyMode)  模式，默认为0，便于后续功能扩展。
         * @return {Object} 认证结果
         * @return {Number} .apduRet IC 卡对 PIN 校验命令的 应答.
         * @return {Number} .sw1 PIN 校验命令的 SW1.
         * @return {Number} .sw2 PIN 校验命令的 SW2.
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         * @member nymph.dev.pinPad.PinPad
         */
        verifyOfflinePin: function (options, verifyMode) {
            var result, errorCode;
            var optionAttribute, actualOptions = {};
            if (verifyMode === null || typeof verifyMode === 'undefined') {
                // 默认模式
                verifyMode = 0;
            }

            if(!options){
                throw {code: nymphError.PARAM_ERR, message: 'options do not exist'};
            }

            if(!options.hasOwnProperty('fmtOfPin') || (options.fmtOfPin !== this.FOPTBV_ENCRYPTED_BY_PUBLIC_KEY) && (options.fmtOfPin !== this.FOPTBV_PLAIN_TEXT)){
                throw {code: nymphError.PARAM_ERR, message: 'options.fmtOfPin do not exist'};
            }

            if(options.verifyCmdFmt !== 0){
                throw {code: nymphError.PARAM_ERR, message: 'options.verifyCmdFmt error'};
            }

            if(!options.icCardToken || isNaN(options.icCardToken ) || (typeof (options.icCardToken )) !== 'number'){
                throw {code: nymphError.PARAM_ERR, message: 'options.icCardToken error'};
            }

            if(options.fmtOfPin === this.FOPTBV_ENCRYPTED_BY_PUBLIC_KEY){
                if(!options.random || (options.random.length !== 8)){
                    throw {code: nymphError.PARAM_ERR, message: 'options.random error'};
                }

                if(!(options.pinKey) || (typeof (options.pinKey) !== 'object')){
                    throw {code: nymphError.PARAM_ERR, message: 'options.pinKey error'};
                }

                if(!(options.pinKey.hasHash) || ((options.pinKey.hasHash !== 0) && (options.pinKey.hasHash !== 1))){
                    throw {code: nymphError.PARAM_ERR, message: 'options.pinKey.hasHash error'};
                }

                if(options.pinKey.hasHash === 1){
                    if(!(options.pinKey.hash) || options.pinKey.hash.length !== this.PEUK_HASH_BYTE_LEN){
                        throw {code: nymphError.PARAM_ERR, message: 'options.pinKey.hash error'};
                    }
                }

                if(!(options.pinKey.mod) || options.pinKey.mod.length > this.PEUK_MOD_BYTE_LEN){
                    throw {code: nymphError.PARAM_ERR, message: 'options.pinKey.mod error'};
                }

                if(!(options.pinKey.exp) || options.pinKey.exp.length > this.PEUK_EXP_BYTE_LEN){
                    throw {code: nymphError.PARAM_ERR, message: 'options.pinKey.exp error'};
                }

                if(!(options.pinKey.expiredDate) || options.pinKey.expiredDate.length !== this.PEUK_EXPIRED_DATA_LEN){
                    throw {code: nymphError.PARAM_ERR, message: 'options.pinKey.expiredDate error'};
                }
            }

            if (options && (typeof options === 'object')) {
                for (optionAttribute in options) {
                    if (options.hasOwnProperty(optionAttribute)) {
                        if (optionAttribute === 'random') {
                            if (Buffer.isBuffer(options.random)) {
                                actualOptions[optionAttribute] = options.random.toString('base64');
                            } else {
                                throw {code: nymphError.PARAM_ERR, message: 'Initial vector data should be a Buffer.'};
                            }
                        } else if (optionAttribute === 'pinKey') {
                            var mPinKeyOptions = options[optionAttribute], mPinKeyActualOptions = {}, mPinKeyOptionKey;
                            for (mPinKeyOptionKey in mPinKeyOptions) {
                                if (mPinKeyOptions.hasOwnProperty(mPinKeyOptionKey)) {
                                    if (mPinKeyOptionKey === 'rid' || mPinKeyOptionKey === 'mod' || mPinKeyOptionKey === 'exp' ||
                                        mPinKeyOptionKey === 'expiredDate' || mPinKeyOptionKey === 'hash') {
                                        if (Buffer.isBuffer(mPinKeyOptions[mPinKeyOptionKey])) {
                                            mPinKeyActualOptions[mPinKeyOptionKey] = mPinKeyOptions[mPinKeyOptionKey].toString('base64');
                                        } else {
                                            throw {
                                                code: nymphError.PARAM_ERR,
                                                message: 'Initial vector data should be a Buffer.'
                                            };
                                        }
                                    }
                                    else{
                                        mPinKeyActualOptions[mPinKeyOptionKey] = mPinKeyOptions[mPinKeyOptionKey];
                                    }
                                }
                            }
                            actualOptions[optionAttribute] = mPinKeyActualOptions;

                        } else {
                            actualOptions[optionAttribute] = options[optionAttribute];
                        }
                    }
                }
            }else{
                throw {code: nymphError.PARAM_ERR, message: 'options error'};
            }

            result = hermes.exec(this.PLUGINID, this.instanceId, 'verifyOfflinePin', [verifyMode, actualOptions]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to verifyOffLinePin PIN pad.', innerCode: result.innerCode};
            }
            return result.data;
        },

        /**
         * @ignore
         * @param {Number} innerCode 底层上传的返回码
         * @returns {String} 返回码对应的字符串
         */
        getError: function (innerCode) {
            var self = this;
            switch (innerCode) {
                case -7000:
                case 0x20:
                    return ErrorCode.PINPAD_BASE_ERR;
                case -7001:// 密钥不存在
                case 0x27: //EM_pinpad_NO_SUCH_KEY: 无指定密钥
                    return ErrorCode.PINPAD_NO_SUCH_KEY;
                case -7002:
                    return ErrorCode.PINPAD_KEY_INDEX_ERR; // 密钥索引错，参数索引不在范围内
                case -7003:
                    return ErrorCode.PINPAD_DERIVE_ERR; // 密钥写入时，源密钥的层次比目的密钥低
                case -7004:
                    return ErrorCode.PINPAD_CHECK_KEY_FAILED; // 密钥验证失败
                case -7005://  没输入 PIN
                case 0x2B: // EM_pinpad_NO_PIN_ENTERED，输入PIN 时，PINPAD 直接按确认退出，表示无PIN
                    return ErrorCode.PINPAD_NO_PIN_ENTERED;
                case -7006: // 取消输入PIN
                case 0x1B: // EM_ABOLISH，取消
                    return ErrorCode.PINPAD_INPUT_CANCELLED;
                case -7007:
                    return ErrorCode.PINPAD_WAIT_INTERVAL; // 函数调用小于最小间隔时间
                case -7008:
                    return ErrorCode.PINPAD_CHECK_MODE_ERR; // KCV模式错，不支持
                case -7009: // 无权使用该密钥，当出现密钥标签不对，或者写入密钥时，源密钥类型的值大于目的密钥类型，都会返回该密钥
                    return ErrorCode.PINPAD_NO_RIGHT_USE;
                case -7010:
                    return ErrorCode.PINPAD_KEY_TYPE_ERR; // 密钥类型错误
                case -7011:
                    return ErrorCode.PINPAD_EXPECTED_LEN_ERR; // 期望 PIN 的长度字符串错
                case -7012:
                    return ErrorCode.PINPAD_DST_KEY_INDEX_ERR; // 目的密钥索引错，不在范围内
                case -7013:
                    return ErrorCode.PINPAD_SRC_KEY_INDEX_ERR; // 源密钥索引错，不在范围内
                case -7014:
                    return ErrorCode.PINPAD_KEY_LEN_ERR; // 密钥长度错
                case -7015: // 输入 PIN 超时
                case 0x23: // EM_pinpad_TIME_OUT，超时
                    return ErrorCode.PINPAD_INPUT_TIMEOUT;
                case -7016:
                    return ErrorCode.PINPAD_NO_ICC; // IC 卡不存在
                case -7017:
                    return ErrorCode.PINPAD_ICC_NOT_INITIALIZED; // IC 卡未初始化
                case -7019: // 指针参数非法为空
                    return ErrorCode.PINPAD_PARAM_PTR_NULL;
                case -7018:
                    return ErrorCode.PINPAD_GROUP_INDEX_ERR; // DUKPT 组索引号错
                case -7020:
                    return ErrorCode.PINPAD_LOCKED; // PED 已锁
                case -7021: // PED 通用错误
                    return ErrorCode.PINPAD_RET_ERR;
                case -7022:// 没有空闲的缓冲
                case 0x22: // EM_pinpad_NO_ENOUGH_SPACE，空间不足
                    return ErrorCode.PINPAD_NOMORE_BUF;
                case -7023:// 需要取得高级权限
                case 0x3E: // EM_pinpad_PERMISSION_DENY，应用程序 没有 API 要求的 permission
                    return ErrorCode.PINPAD_NEED_PERMISSION;
                case -7024: // DUKPT 已经溢出
                case 0x2C: // EM_pinpad_DUKPT_COUNTER_OVERFLOW，DUKPT 计数器溢出
                    return ErrorCode.PINPAD_DUKPT_OVERFLOW;
                case -7025:
                    return ErrorCode.PINPAD_KCV_CHECK_FAILED; // KCV 校验失败
                case -7026:
                    return ErrorCode.PINPAD_SRC_KEY_TYPE_ERR; // 源密钥类型错
                case -7027: // 命令不支持
                case 0x25: // EM_pinpad_UNSUPPORTED_FUNC，U3 当前 PINPAD 版本不支持的功能。
                    return ErrorCode.PINPAD_UNSUPPORTED_CMD;
                case -7028: // 通讯错误
                case 0x24: // EM_pinpad_COMM_ERR，对外置 pinpad 通讯错误
                    return ErrorCode.PINPAD_COMM_ERR;
                case -7029:
                    return ErrorCode.PINPAD_NO_UAPUK; // 没有用户认证公钥
                case -7030: // 取系统敏感服务失败
                case 0x29: // EM_pinpad_FAIL_TO_AUTH，U3 敏感服务认证错误
                    return ErrorCode.PINPAD_ADMIN_ERR;
                case -7031:
                    return ErrorCode.PINPAD_DOWNLOAD_DISACTIVE; // PED 处于下载非激活状态
                case -7032:
                    return ErrorCode.PINPAD_KCV_ODD_CHECK_FAILED; // KCV 奇校验失败
                case -7033:
                    return ErrorCode.PINPAD_PED_DATA_RW_FAILED; // 读取 PED 数据失败
                case -7034:
                    return ErrorCode.PINPAD_ICC_CMD_ERR; // 卡操作错误(脱机明文、密文密码验证)
                case -7035:
                    return ErrorCode.PINPAD_INPUT_CLEAR; // 用户按CLEAR键退出输入 PIN
                case -7036:
                    return ErrorCode.PINPAD_NO_FREE_FLASH; // PED 存储空间不足
                case -7037: // DUKPT KSN 需要先加 1
                case 0x50: // EM_pinpad_DUKPT_KSN_NEED_INC，DUKPT 交易前 "没有" 自加 KSN
                    return ErrorCode.PINPAD_DUKPT_KSN_NEED_INC;
                case -7038:
                    return ErrorCode.PINPAD_KCV_MODE_ERR; // KCV MODE 错误
                case -7039:
                    return ErrorCode.PINPAD_DUKPT_NO_KCV; // NO KCV
                case -7040: // 按FN/ATM4键取消PIN输入
                    return ErrorCode.PINPAD_PIN_BY_PASS_OR_FUN_KEY;
                case -7041:
                    return ErrorCode.PINPAD_MAC_ERR; // 数据 MAC 校验错
                case -7042:
                    return ErrorCode.PINPAD_CRC_ERR; // 数据 CRC 校验错
                case -7043:
                    return ErrorCode.PINPAD_TYPE_ERR; // 密码键盘类型错
                case -7999:
                case 0x02: // EM_pinpad_PINPAD_NOT_INIT，PINPAD模块未初始化
                case 0x21: // EM_pinpad_INVALID_ARGUMENT，无效实参
                case 0x26: // EM_pinpad_BUSY，PINPAD 底层忙(通常是 PIN 输入流程中), 无法服务当前 API 调用
                case 0x2E: // EM_pinpad_BAD_STATUS，pinpad 模块当前状态错误或者当前状态不支持该调用
                case 0x2F: // EM_pinpad_BAD_KEY_USAGE，试图在 key 的 "usage" 之外, 使用该 key
                case 0x30: // EM_pinpad_BAD_MODE_OF_KEY_USE，对 key 的使用方式错误. 比如用被限定只能用来加密的 key 来解密数据
                case 0x32: // EM_pinpad_NO_SUCH_KAP，pinpad 中没有指定的 KAP 实例
                case 0x33: // EM_pinpad_KAP_ALREADY_EXIST，指定的 (通常是待创建的) KAP 已经存在
                case 0x34: // EM_pinpad_ARGUMENT_CONFLICT，实参冲突, 可能是两个实参冲突, 也可能是一个实参中的两个成员冲突
                case 0x36: // EM_pinpad_REFER_TO_KEY_OUTSIDE_KAP，引用了目标 KAP 之外的 key, 或者在一个操作中同时引用了不同 KAP 中的 key
                case 0x3F: // EM_pinpad_ACCESSING_KAP_DENY，应用程序 没有 访问指定 KAP 的权限
                case 0x40: // EM_pinpad_ERR_WRONG_KAP_MODE，尝试在不兼容的 KAP mode 中调用 API.
                case 0x48: // EM_pinpad_PIN_ENTRY_TOO_FREQUENTLY，PIN 输入调用太频繁
                case 0x49: // EM_pinpad_DUKPT_NOT_INITED，当前 KAP 的 dukpt 机构尚未初始化
                case 0x4B: // EM_pinpad_ENC_KEY_FMT_TOO_SIMPLE，当前待载入的密文 key 的格式太简单, 低于当前 KAP 的配置
                case 0x4C: // EM_pinpad_SAME_KEY_VALUE_DETECTED，当前待载入(or 生成)的 key 和设备中已有的其他密钥取值相同，禁止下载
                case 0x4D: // EM_pinpad_KEYBUNDLE_ERR，当前待载入的密文 key 的打包内容错误
                case 0x4E: // EM_pinpad_ENCRYPT_MAG_TRACK_TOO_FREQUENTLY，调用磁道加密操作太频繁, 用于防穷举
                case 0x5C: // EM_pinpad_SERVER_DIED，AND 平台上, 后台的 pinpad_server died。但它通常会重启, 遇到本 err, 应用程序应关闭句柄, 复位应用流程
                case 0x5F: // EM_pinpad_AUTHENDATA_NOT_INITIALIZED，初始口令未设置
                    return ErrorCode.PINPAD_OTHER_ERR;
                default:
                    return nymphError.getError(innerCode);
            }
        },
    };

    /**
     * @method config
     * 设置密码键盘全局配置。
     * @param {Object} cfg
     * @param {nymph.dev.pinPad.PinPadType} cfg.pinPadType
     * @member nymph.dev.pinPad.PinPad
     */
    PinPad.config = function (cfg) {
        // 设置密码键盘的类型，当创建密码键盘的时候根据此配置创建实例。
        var type, result, errorCode;
        // todo 测 localStorage
        localStorage.setItem('pinpad.devName', cfg.pinPadType);

        // todo 其他设置
    };

    /**
     * # PIN Pad 错误码
     * @class nymph.dev.pinPad.PinPad.ErrorCode
     */
    var ErrorCode = {
        /**
         * @property {String} [PINPAD_BASE_ERR='PINPAD_BASE_ERR'] 密码键盘基础错误。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_BASE_ERR: 'PINPAD_BASE_ERR',

        /**
         * @property {String} [PINPAD_NO_SUCH_KEY='PINPAD_NO_SUCH_KEY'] 密钥不存在。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_NO_SUCH_KEY: 'PINPAD_NO_SUCH_KEY',

        /**
         * @property {String} [PINPAD_KEY_INDEX_ERR='PINPAD_KEY_INDEX_ERR'] 密钥索引错，参数索引不在范围内。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_KEY_INDEX_ERR: 'PINPAD_KEY_INDEX_ERR',

        /**
         * @property {String} [PINPAD_DERIVE_ERR='PINPAD_DERIVE_ERR'] 密钥写入时，源密钥的层次比目的密钥低。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_DERIVE_ERR: 'PINPAD_DERIVE_ERR',

        /**
         *  @property {String} [PINPAD_CHECK_KEY_FAILED='PINPAD_CHECK_KEY_FAILED'] 密钥验证失败。
         *  @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_CHECK_KEY_FAILED: 'PINPAD_CHECK_KEY_FAILED',

        /**
         * @property {String} [PINPAD_NO_PIN_ENTERED='PINPAD_NO_PIN_ENTERED'] 没输入 PIN。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_NO_PIN_ENTERED: 'PINPAD_NO_PIN_ENTERED',

        /**
         * @property {String} [PINPAD_INPUT_CANCELLED='PINPAD_INPUT_CANCELLED'] 取消输入 PIN。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_INPUT_CANCELLED: 'PINPAD_INPUT_CANCELLED',

        /**
         * @property {String} [PINPAD_WAIT_INTERVAL='PINPAD_WAIT_INTERVAL'] 函数调用小于最小间隔时间。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_WAIT_INTERVAL: 'PINPAD_WAIT_INTERVAL',

        /**
         * @property {String} [PINPAD_CHECK_MODE_ERR='PINPAD_CHECK_MODE_ERR'] KCV模式错，不支持。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_CHECK_MODE_ERR: 'PINPAD_CHECK_MODE_ERR',

        /**
         * @property {String} [PINPAD_NO_RIGHT_USE='PINPAD_NO_RIGHT_USE'] 无权使用该密钥，当出现密钥标签不对，或者写入密钥时，源密钥类型的值大于目的密钥类型，都会返回该密钥。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_NO_RIGHT_USE: 'PINPAD_NO_RIGHT_USE',

        /**
         * @property {String} [PINPAD_KEY_TYPE_ERR='PINPAD_KEY_TYPE_ERR'] 密钥类型错误。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_KEY_TYPE_ERR: 'PINPAD_KEY_TYPE_ERR',

        /**
         * @property {String} [PINPAD_EXPECTED_LEN_ERR='PINPAD_EXPECTED_LEN_ERR'] 期望 PIN 的长度字符串错。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_EXPECTED_LEN_ERR: 'PINPAD_EXPECTED_LEN_ERR',

        /**
         * @property {String} [PINPAD_DST_KEY_INDEX_ERR='PINPAD_DST_KEY_INDEX_ERR'] 目的密钥索引错，不在范围内。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_DST_KEY_INDEX_ERR: 'PINPAD_DST_KEY_INDEX_ERR',

        /**
         * @property {String} [PINPAD_SRC_KEY_INDEX_ERR='PINPAD_SRC_KEY_INDEX_ERR'] 源密钥索引错，不在范围内。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_SRC_KEY_INDEX_ERR: 'PINPAD_SRC_KEY_INDEX_ERR',

        /**
         * @property {String} [PINPAD_KEY_LEN_ERR='PINPAD_KEY_LEN_ERR'] 密钥长度错。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_KEY_LEN_ERR: 'PINPAD_KEY_LEN_ERR',

        /**
         * @property {String} [PINPAD_INPUT_TIMEOUT='PINPAD_INPUT_TIMEOUT'] 输入PIN超时。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_INPUT_TIMEOUT: 'PINPAD_INPUT_TIMEOUT',

        /**
         * @property {String} [PINPAD_NO_ICC='PINPAD_NO_ICC'] IC 卡不存在。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_NO_ICC: 'PINPAD_NO_ICC',

        /**
         * @property {String} [PINPAD_ICC_NOT_INITIALIZED='PINPAD_ICC_NOT_INITIALIZED'] IC 卡未初始化。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_ICC_NOT_INITIALIZED: 'PINPAD_ICC_NOT_INITIALIZED',

        /**
         * @property {String} [PINPAD_GROUP_INDEX_ERR='PINPAD_GROUP_INDEX_ERR'] DUKPT 组索引号错。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_GROUP_INDEX_ERR: 'PINPAD_GROUP_INDEX_ERR',

        /**
         * @property {String} [PINPAD_PARAM_PTR_NULL='PINPAD_PARAM_PTR_NULL'] 指针参数非法为空。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_PARAM_PTR_NULL: 'PINPAD_PARAM_PTR_NULL',

        /**
         * @property {String} [PINPAD_LOCKED='PINPAD_LOCKED'] PED 已锁。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_LOCKED: 'PINPAD_LOCKED',

        /**
         * @property {String} [PINPAD_RET_ERR='PINPAD_RET_ERR'] PED通用错误。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_RET_ERR: 'PINPAD_RET_ERR',

        /**
         * @property {String} [PINPAD_NOMORE_BUF='PINPAD_NOMORE_BUF'] 没有空闲的缓冲。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_NOMORE_BUF: 'PINPAD_NOMORE_BUF',

        /**
         * @property {String} [PINPAD_NEED_PERMISSION='PINPAD_NEED_PERMISSION'] 需要取得高级权限。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_NEED_PERMISSION: 'PINPAD_NEED_PERMISSION',

        /**
         * @property {String} [PINPAD_DUKPT_OVERFLOW='PINPAD_DUKPT_OVERFLOW'] DUKPT 已经溢出。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_DUKPT_OVERFLOW: 'PINPAD_DUKPT_OVERFLOW',

        /**
         * @property {String} [PINPAD_KCV_CHECK_FAILED='PINPAD_KCV_CHECK_FAILED'] KCV 校验失败。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_KCV_CHECK_FAILED: 'PINPAD_KCV_CHECK_FAILED',

        /**
         * @property {String} [PINPAD_SRC_KEY_TYPE_ERR='PINPAD_SRC_KEY_TYPE_ERR'] 源密钥类型错。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_SRC_KEY_TYPE_ERR: 'PINPAD_SRC_KEY_TYPE_ERR',

        /**
         * @property {String} [PINPAD_UNSUPPORTED_CMD='PINPAD_UNSUPPORTED_CMD'] 命令不支持。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_UNSUPPORTED_CMD: 'PINPAD_UNSUPPORTED_CMD',

        /**
         * @property {String} [PINPAD_COMM_ERR='PINPAD_COMM_ERR'] 通讯错误/对外置 pinpad 通讯错误。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_COMM_ERR: 'PINPAD_COMM_ERR',

        /**
         * @property {String} [PINPAD_NO_UAPUK='PINPAD_NO_UAPUK'] 没有用户认证公钥。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_NO_UAPUK: 'PINPAD_NO_UAPUK',

        /**
         * @property {String} [PINPAD_ADMIN_ERR='PINPAD_ADMIN_ERR'] 取系统敏感服务失败。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_ADMIN_ERR: 'PINPAD_ADMIN_ERR',

        /**
         * @property {String} [PINPAD_DOWNLOAD_DISACTIVE='PINPAD_DOWNLOAD_DISACTIVE'] PED 处于下载非激活状态。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_DOWNLOAD_DISACTIVE: 'PINPAD_DOWNLOAD_DISACTIVE',

        /**
         * @property {String} [PINPAD_KCV_ODD_CHECK_FAILED='PINPAD_KCV_ODD_CHECK_FAILED'] KCV 奇校验失败。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_KCV_ODD_CHECK_FAILED: 'PINPAD_KCV_ODD_CHECK_FAILED',

        /**
         * @property {String} [PINPAD_PED_DATA_RW_FAILED='PINPAD_PED_DATA_RW_FAILED'] 读取 PED 数据失败。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_PED_DATA_RW_FAILED: 'PINPAD_PED_DATA_RW_FAILED',

        /**
         * @property {String} [PINPAD_ICC_CMD_ERR='PINPAD_ICC_CMD_ERR'] 卡操作错误(脱机明文、密文密码验证)。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_ICC_CMD_ERR: 'PINPAD_ICC_CMD_ERR',

        /**
         * @property {String} [PINPAD_INPUT_CLEAR='PINPAD_INPUT_CLEAR'] 用户按CLEAR键退出输入 PIN。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_INPUT_CLEAR: 'PINPAD_INPUT_CLEAR',

        /**
         * @property {String} [PINPAD_NO_FREE_FLASH='PINPAD_NO_FREE_FLASH'] PED 存储空间不足。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_NO_FREE_FLASH: 'PINPAD_NO_FREE_FLASH',

        /**
         * @property {String} [PINPAD_DUKPT_KSN_NEED_INC='PINPAD_DUKPT_KSN_NEED_INC'] DUKPT KSN 需要先加 1。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_DUKPT_KSN_NEED_INC: 'PINPAD_DUKPT_KSN_NEED_INC',

        /**
         * @property {String} [PINPAD_KCV_MODE_ERR='PINPAD_KCV_MODE_ERR'] KCV MODE 错误。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_KCV_MODE_ERR: 'PINPAD_KCV_MODE_ERR',

        /**
         * @property {String} [PINPAD_DUKPT_NO_KCV='PINPAD_DUKPT_NO_KCV'] NO KCV。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_DUKPT_NO_KCV: 'PINPAD_DUKPT_NO_KCV',

        /**
         * @property {String} [PINPAD_PIN_BY_PASS_OR_FUN_KEY='PINPAD_PIN_BY_PASS_OR_FUN_KEY'] 按FN/ATM4键取消PIN输入。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_PIN_BY_PASS_OR_FUN_KEY: 'PINPAD_PIN_BY_PASS_OR_FUN_KEY',

        /**
         * @property {String} [PINPAD_MAC_ERR='PINPAD_MAC_ERR'] 数据 MAC 校验错。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_MAC_ERR: 'PINPAD_MAC_ERR',

        /**
         * @property {String} [PINPAD_CRC_ERR='PINPAD_CRC_ERR'] 数据 CRC 校验错。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_CRC_ERR: 'PINPAD_CRC_ERR',

        /**
         * @property {String} [PINPAD_TYPE_ERR='PINPAD_TYPE_ERR'] 密码键盘类型错。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_TYPE_ERR: 'PINPAD_TYPE_ERR',

        /**
         * @property {String} [PINPAD_OTHER_ERR='PINPAD_OTHER_ERR'] 密码键盘其他异常错误。
         * @member nymph.dev.pinPad.PinPad.ErrorCode
         */
        PINPAD_OTHER_ERR: 'PINPAD_OTHER_ERR',
    };

    /**
     * # 密码键盘类型
     * @class nymph.dev.pinPad.PinPadType
     */
    var PinPadType = {
        /**
         * @property {String} [IPP='IPP'] 内置密码键盘。
         * @member nymph.dev.pinPad.PinPadType
         */
        IPP: 'IPP',
        /**
         * @property {String} [EPP='COM_EPP'] 外置密码键盘。
         * @member nymph.dev.pinPad.PinPadType
         */
        EPP: 'COM_EPP'
    };


    /**
     * # 密码键盘密钥类型
     * @class nymph.dev.pinPad.KeyType
     */
    var KeyType = {
        /**
         * @property {String} [MASTER='master'] 明文主密钥。
         * @member nymph.dev.pinPad.KeyType
         */

        MASTER: 'master',
        /**
         * @property {String} [PIN='pin'] PIN Key。
         * @member nymph.dev.pinPad.KeyType
         */
        PIN: 'pin',
        /**
         * @property {String} [MAC='mac'] MAC Key。
         * @member nymph.dev.pinPad.KeyType
         */
        MAC: 'mac',

        /**
         * @property {String} [TRACK='track'] Track Key。
         * @member nymph.dev.pinPad.KeyType
         */
        TRACK: 'track',

        /**
         * @property {String} [DES='des'] DES Key。
         * @member nymph.dev.pinPad.KeyType
         */
        DES: 'des'
    };



    /**
     * # 密码键盘 MAC 算法
     * @class nymph.dev.pinPad.MacAlgorithm
     */
    var MacAlgorithm = {
        /**
         * @property {Number} [ISO9797=0x00]
         * @member nymph.dev.pinPad.MacAlgorithm
         */
        ISO9797: 0x00,
        /**
         * @property {Number} [AES=0x01]
         * @member nymph.dev.pinPad.MacAlgorithm
         */
        AES: 0x01
    };

    /**
     * # 密码键盘 MAC 工作模式
     * @class nymph.dev.pinPad.MacMode
     */
    var MacMode = {
        /**
         * @property {Number} [ECB=0x00]
         * @member nymph.dev.pinPad.MacMode
         */
        ECB: 0x00,
        /**
         * @property {Number} [CCB=0x01]
         * @member nymph.dev.pinPad.MacMode
         */
        CBC: 0x01,
        /**
         * @property {Number} [X99=0x02]
         * @member nymph.dev.pinPad.MacMode
         */
        X99: 0x02
    };

    /**
     * # des算法模式
     * @class nymph.dev.pinPad.DesMode
     */
    var DesMode = {
        /**
         * @property {Number} [TECB=0x00]
         * @member nymph.dev.pinPad.DesMode
         */
        TECB: 0x00,
        /**
         * @property {Number} [TCBC=0x01]
         * @member nymph.dev.pinPad.DesMode
         */
        TCBC: 0x01
    };

    /**
     * @property {nymph.dev.pinPad.PinPad.ErrorCode} ErrorCode 错误码。
     * @member nymph.dev.pinPad.PinPad
     */
    PinPad.ErrorCode = ErrorCode;

    /**
     * @property {nymph.dev.pinPad.PinMode} PinMode PIN 算法类型。
     * @member nymph.dev.pinPad
     */
    pinPad.PinMode = PinMode;


    /**
     * @property {nymph.dev.pinPad.PinPad} PinPad 密码键盘类。
     * @member nymph.dev.pinPad
     */
    pinPad.PinPad = PinPad;

    /**
     * @property {nymph.dev.pinPad.PinPadType} PinPadType 密码键盘类型。
     * @member nymph.dev.pinPad
     */
    pinPad.PinPadType = PinPadType;

    /**
     * @property {nymph.dev.pinPad.KeyFormat} KeyFormat 密码键盘密钥格式。
     * @member nymph.dev.pinPad
     */
    pinPad.KeyFormat = KeyFormat;

    /**
     * @property {nymph.dev.pinPad.KeyType} KeyType 密码键盘密钥类型。
     * @member nymph.dev.pinPad
     */
    pinPad.KeyType = KeyType;

    /**
     * @property {nymph.dev.pinPad.Algorithm} Algorithm 密码键盘加解密算法。
     * @member nymph.dev.pinPad
     */
    pinPad.KeyAlgorithm = KeyAlgorithm;

    /**
     * @property {nymph.dev.pinPad.MacAlgorithm} MacAlgorithm 密码键盘 MAC 算法。
     * @member nymph.dev.pinPad
     */
    pinPad.MacAlgorithm = MacAlgorithm;

    /**
     * @property {nymph.dev.pinPad.MacMode} MacMode 密码键盘 MAC 工作模式。
     * @member nymph.dev.pinPad
     */
    pinPad.MacMode = MacMode;

    /**
     * @property {nymph.dev.pinPad.DesMode} DesMode pinpad des mode。
     * @member nymph.dev.pinPad
     */
    pinPad.DesMode = DesMode;

    /**
     * @property {nymph.dev.pinPad.Key} Key 密钥。
     * @member nymph.dev.pinPad
     */
    pinPad.Key = Key;

    /**
     * @property {nymph.dev.pinPad.KeySystem} KeySystem 密钥体系。
     * @member nymph.dev.pinPad
     */
    pinPad.KeySystem = KeySystem;

    hermes.addEventSupport(PinPad.prototype);
    module.exports = pinPad;

    },{"./kap":43,"buffer":"buffer","error":"error","hermes":"hermes","nymph-encoding":"nymph-encoding","tools":"tools"}],
    "poster-detector":[function(require,module,exports){
    'use strict';

    /**
     * # 探测模拟前置模块
     * @class nymph.comm.posterDetector
     * 本模块用于搜索局域网内的模拟前置。
     */
    // 引用外部模块。
    var nymphError = require('error');
    var hermes = require('hermes');

    var posterDetector = {
        instanceId : hermes.NULL,
        PLUGINID : 'ddhsncui586987hfbd75j4ld9f8gjtm6',

        /**
         * @method detect
         * 搜索模拟前置
         *
         * @param {Function} callback 处理次方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         * @param {Array} callback.result 执行此方法返回的搜索结果。
         */
        detect : function(callback){
            var self = this;
            hermes.exec(this.PLUGINID, this.instanceId, 'detect', [], function(err, result){
                if(err){
                    err.code = self.getError(err.code);
                    callback.call(self,err);
                }else{
                    callback.call(self,null,result);
                }
            });
        },

        /**
         * @ignore
         * @param {Number} innerCode 底层上传的返回码
         * @returns {String} 返回码对应的字符串
         */
        getError : function(innerCode){
            switch(innerCode){
                default :
                    return nymphError.getError(innerCode);                                                                                                                                                                      nymphError.getError(innerCode);
            }
        }
    };

    module.exports = posterDetector;
    },{"error":"error","hermes":"hermes"}],
    "printer":[function(require,module,exports){
    'use strict';

    /**
     * # 打印机模块（模块名：printer）
     *
     * @class nymph.dev.printer
     * @singleton
     * 本模块为打印机入口模块，通过 `requrie('printer')` 的方式获取，包含以下两部分内容：
     *
     * - 打印机类：提供了和打印机相关的一些方法。
     * - 所有与打印机相关的类和对象。
     *
     * 如下：
     *
     *     // 获取打印机入口模块。
     *     var printer = require('printer');
     *
     *     // 获取打印机类。
     *     var Printer = printer.Printer;
     *
     *     // 创建一个打印机实例。
     *     var p = new Printer('PRINTER');
     *
     */

    /**
     * # 打印机类
     *
     * @class nymph.dev.printer.Printer
     *
     * @constructor
     * 打印机构造函数，具体操作流程及代码示例请参见[“打印机开发指南”](#!/guide/printer)。
     * @param {String} devId (Optional) 设备标识（可选），唯一标识和打开一个打印机设备。可以包含打印机类型及端口名，用于区分不同的打印机实例。
     */
    var printer = {},
        hermes = require('hermes'),
        nymphError = require('error');
    var Printer = function (devId) {
        /**
         * 设备句柄。
         * @private
         * @type {String}
         */
        this.instanceId = hermes.NULL;

        /**
         * @property {String} devId 打印机设备标识。
         * @member nymph.dev.printer.Printer
         */
        this.devId = devId;
    };
    Printer.prototype = {
        PLUGINID: '787fa8e7acfd4a3c9cb8cbcbfd6ffe1d',

        constructor: Printer,

        isPrinting: false,

        /**
         * @method open
         * 打开打印机。
         *
         *     // 获取打印机模块
         *     var printer = require('printer');
         *
         *     // 获取打印机模块的构造函数
         *     var Printer = printer.Printer;
         *
         *     // 创建一个打印机实例，目前打印机名称只有 'PRINTER'
         *     var p = new Printer('PRINTER');
         *     try {
         *       p.open();
         *     } catch (err) {
         *       // 打开打印机失败的处理。
         *       console.error(err.code + ' ' + err.message);
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         */
        open: function () {
            // 打开打印机。
            var result, errorCode, error;
            switch (this.devId){
                case 'PRINTER':
                    break;
                default:
                    error = new Error();
                    error.code = nymphError.PARAM_ERR;
                    error.message = 'Not support dev id : '+this.devId;
                    throw error;
            }

            // 如果重复打开，则抛出异常。
            if (this.instanceId !== hermes.NULL) {
                error = new Error();
                error.code = nymphError.DEVICE_USED;
                error.message = 'Device already opened.';
                throw error;
            }
            result = hermes.exec(this.PLUGINID, hermes.NULL, 'open', [this.devId]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to open printer.', innerCode: result.innerCode};
            }

            this.instanceId = result.data;

            // 注册插件。
            hermes.addJsPluginInstance(this.instanceId, this);
        },

        /**
         * @method close
         * 关闭打印机。
         *
         *     try {
         *       p.close();
         *     } catch (err) {
         *       // 关闭打印机失败的处理。
         *       console.error(err.code + ' ' + err.message);
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         */
        close: function () {
            var result, errorCode;
            this.isPrinting = false;
            result = hermes.exec(this.PLUGINID, this.instanceId, 'close', [this.instanceId]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to close printer.', innerCode: result.innerCode};
            }

            // 反注册
            if (this.instanceId !== hermes.NULL) {
                hermes.removeJsPluginInstance(this.instanceId);
            }

            this.instanceId = hermes.NULL;
        },

        /**
         * @method getInfo
         * 获取打印机相关信息。
         *
         *     try {
         *         var info = p.getInfo();
         *     } catch (err) {
         *         // 获取打印机信息失败的处理。
         *         console.error(err.code + ' ' + err.message);
         *     }
         *
         * @return {Object} 打印机相关信息。
         * @return {String} return.status 打印机状态。
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         */
        getInfo: function () {
            // 一些获取打印机相关信息的操作。
            var result, errorCode, statusString, info;
            result = hermes.exec(this.PLUGINID, this.instanceId, 'getPrinterInfo', []);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to get printer information.', innerCode: result.innerCode};
            }

            info = result.data;
            statusString = this.getError(info.status);
            if (statusString === nymphError.SUCCESS) {
                info.status = 'NORMAL';
            } else {
                info.status = statusString;
            }
            return info;
        },

        /**
         * @ignore
         * @method reset
         * 重置打印机(该功能暂不支持)
         *
         *     try {
         *         p.reset();
         *     } catch (err) {
         *         // 获取打印机信息失败的处理。
         *         console.error(err.code + ' ' + err.message);
         *     }
         *
         */
        reset: function () {
            var result, errorCode;
            result = hermes.exec(this.PLUGINID, this.instanceId, 'reset');
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to reset printer.', innerCode: result.innerCode};
            }
        },

        /**
         * @method printHtml
         * 打印 html 网页。默认打印宽度是 382 像素，打印高度没限制，sdk 内部使用分段打印方式。
         *
         *     var printInfo = {
         *          htmlString: '<div>This is html string.</div>'
         *     };
         *     p.printHtml(printInfo, function (err) {
         *       if (err) {
         *         // 打印出错处理
         *       } else {
         *         // 打印成功处理
         *       }
         *     });
         *
         * @param {Object} printInfo 打印信息
         * @param {String} printInfo.htmlString 打印数据字符串。
         * @param {Boolean} printInfo.feedAfterPrint 是否在打印完成后自动进纸以便用户撕下小票，true-打印完后自动进纸，false-打印完不自动进纸。默认为 true。
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         */
        printHtml: function (printInfo, callback) {
            var self = this;
            if(typeof callback !== 'function') {
                if (typeof printInfo === 'function') {
                    callback = printInfo;
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check the order of parameters, the first parameter should be printInfo, and the second parameter should be callback!'});
                    return;
                }
                throw {code: nymphError.PARAM_ERR, message: 'The second parameter should be a callback function!'};
            }

            if(printInfo){
                if (typeof printInfo === 'function') {
                    callback = printInfo;
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check the order of parameters, the first parameter should be printInfo, and the second parameter should be callback!'});
                    return;
                }

                if (!printInfo.hasOwnProperty('htmlString')) {
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'printInfo should have a html string!'});
                    return;
                }

                if(printInfo.htmlString === null) {
                    callback.call(self, {code:nymphError.PARAM_ERR, message: 'html string is null!'})
                }

                if (!printInfo.hasOwnProperty('feedAfterPrint')) {
                    printInfo.feedAfterPrint = true;
                }
            } else {
                callback.call(self, {code: nymphError.PARAM_ERR, message: 'printInfo should not be null or undefined!'});
                return;
            }

            if(self.isPrinting){
                callback.call(self, {code: nymphError.DEVICE_USED, message: 'The Printer is being use'});
                return;
            }
            self.isPrinting = true;

            hermes.exec(this.PLUGINID, this.instanceId, 'printHtml', [printInfo], function (err) {
                if (err) {
                    console.nativeLog('err.innerCode' + err.innerCode);
                    err.code = self.getError(err.innerCode);
                    console.nativeLog('err.innerCode' + err.innerCode);
                    callback.call(self, err);
                } else {
                    callback.call(self, null);
                }

                self.isPrinting = false;
            });
        },


        /**
         * @method feedPaper
         * 按指定单位的数量进纸/退纸。默认以“行”为单位进纸/退纸。
         *
         * - 进纸 1 行。
         *
         *     printer.feedPaper({value: 1}, function (err) {
         *         if (err) {
         *             // 进纸失败的处理
         *         } else {
         *             // 进纸成功的处理
         *         }
         *     });
         *
         * - 进纸 10 个像素。
         *
         *     printer.feedPaper({value: 10, unit: 'pixel'}, function (err) {
         *         if (err) {
         *             // 进纸失败的处理
         *         } else {
         *             // 进纸成功的处理
         *         }
         *     });
         *
         * - 退纸 1 行（不是所有设备都能支持退纸）。
         *
         *     printer.feedPaper({value: -1}, function (err) {
         *         if (err) {
         *             // 进纸失败的处理
         *         } else {
         *             // 进纸成功的处理
         *         }
         *     });
         *
         * - 退纸 10 个像素（不是所有设备都能支持退纸）。
         *
         *     printer.feedPaper({value: -10, unit: 'pixel'}, function (err) {
         *         if (err) {
         *             // 进纸失败的处理
         *         } else {
         *             // 进纸成功的处理
         *         }
         *     });
         *
         * @param {Object} options 进纸/退纸参数。
         * @param {Boolean} options.isIgnorePaperOut (Optional) 进纸时是否忽略缺纸（此参数部分平台不支持，目前安卓平台不支持）。
         *
         * - `true`：在进纸过程中不对纸量进行判断，即使当前是无纸状态，马达仍会转动。
         * - `false`：在进纸过程中会对纸量进行判断。默认值。
         *
         * @param {String} options.unit (Optional) 进纸/退纸的数量单位（可选）。
         *
         * 值|描述
         * -|-
         * 'line'|按行进纸/退纸（默认单位）
         * 'pixel'|按像素进纸/退纸
         * 'step'|按步进纸/退纸（暂不支持）
         * 'page'|按页进纸/退纸（暂不支持）
         * 'mm'|按毫米进纸/退纸（暂不支持）
         *
         * @param {Number} options.value 进纸/退纸的数量。值为正数，表示进纸；值为负数，表示退纸。
         *
         * - 当 unit 为 line 时，value 的范围 [-50, 50]。
         * - 当 unit 为 pixel 时，value 的范围 [-1200, 1200]。
         *
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         */
        feedPaper: function (options, callback) {
            var self = this,
                actualOptions = {isIgnorePaperOut: false, unit: 'line'};

            if(typeof callback !== 'function') {
                if (typeof options === 'function') {
                    callback = options;
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check the order of parameters, the first parameter should be options, and the second parameter should be callback!'});
                    return;
                }
                throw {code: nymphError.PARAM_ERR, message: 'The second parameter should be a callback function!'};
            }

            if(options){
                if (typeof options === 'function') {
                    callback = options;
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check the order of parameters, the first parameter should be options, and the second parameter should be callback!'});
                    return;
                }

                if (options.hasOwnProperty('isIgnorePaperOut')) {
                    actualOptions.isIgnorePaperOut = options.isIgnorePaperOut;
                }
                if (options.hasOwnProperty('unit')) {
                    if (options.unit !== 'line' && options.unit !== 'pixel') {
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Not support this unit:' + options.unit});
                        return;
                    }
                    actualOptions.unit = options.unit;
                }

                if (options.hasOwnProperty('value')) {
                    if (typeof options.value !== 'number') {
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'The value to feed must be a number!'});
                        return;
                    }
                    actualOptions.value = options.value;
                } else {
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please pass in the value to feed!'});
                    return;
                }
            } else {
                if (typeof callback === 'function') {
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'options should not be null or undefined!'});
                    return;
                } else {
                    throw {code: nymphError.PARAM_ERR, message: 'options is required as the first parameter, and the second parameter should be a callback function!'};
                }
            }
            if(self.isPrinting){
                callback.call(self, {code: nymphError.DEVICE_USED, message: 'The Printer is being use'});
                return;
            }
            self.isPrinting = true;
            hermes.exec(self.PLUGINID, self.instanceId, 'feedPaper', [actualOptions], function (err) {
                if (err) {
                    err.code = self.getError(err.innerCode);
                    callback.call(self, err);
                } else {
                    callback.call(self, null);
                }
                self.isPrinting = false;
            });
        },

        /**
         * @ignore
         * @param {Number} innerCode 底层上传的返回码
         * @return {String} 返回码对应的字符串
         */
        getError: function (innerCode) {
            switch (innerCode) {
                case -1000: // 打印机基础错误码
                    return ErrorCode.PRINTER_BASE_ERR;
                case -1001:
                    return ErrorCode.PRINTER_PRINT_FAILED; // 打印失败
                case -1002:
                    return ErrorCode.PRINTER_ADD_STRING_FAILED; // 设置字符串缓冲失败
                case -1003:
                    return ErrorCode.PRINTER_ADD_IMAGE_FAILED; // 设置图片缓冲失败
                case -1004: // 打印机忙
                case 0xF7:// EM_prn_BUSY，打印机处于忙状态
                    return ErrorCode.PRINTER_BUSY;
                case -1005: // 打印机缺纸
                case 0xF0: // EM_prn_PAPERENDED，缺纸，不能打印
                    return ErrorCode.PRINTER_OUT_OF_PAPER;
                case -1006:
                    return ErrorCode.PRINTER_WRONG_PACKAGE; // 打印数据包格式错
                case -1007: // 打印机故障
                case 0xF2: // EM_prn_HARDERR，硬件错误
                    return ErrorCode.PRINTER_FAULT;
                case -1008: // 打印机过热
                case 0xF3: // EM_prn_OVERHEAT，打印机过热
                    return ErrorCode.PRINTER_OVERHEAT;
                case -1009:
                    return ErrorCode.PRINTER_UNFINISHED; // 打印未完成
                case -1010:
                    return ErrorCode.PRINTER_NO_FONT_LIB; // 打印机未装字库
                case -1011:
                    return ErrorCode.PRINTER_OUT_OF_MEMORY; // 数据包过长
                case -1012:
                    return ErrorCode.PRINTER_NOT_SUPPORT;//暂不支持
                case -1999:
                case 0xE1: // EM_prn_LOWVOL，低压保护
                case 0xE3: // EM_prn_LOWTEMP，低温保护或AD出错
                case 0xE5: // EM_prn_COMMERR，手座机状态正常，但通讯失败
                case 0xF9: // EM_prn_ERRFORMAT，非法的属性名
                case 0xFA: // EM_prn_ERRVALUE，非法的属性值
                case 0xF5: // EM_prn_BUFOVERFLOW，缓冲模式下所操作的位置超出范围
                    return ErrorCode.PRINTER_OTHER_ERR; // 其他异常错误
                default:
                    return nymphError.getError(innerCode);
            }
        }
    };

    /**
     * # 打印机错误码
     * @class nymph.dev.printer.Printer.ErrorCode
     */
    var ErrorCode = {
        /**
         * @property {String} [PRINTER_NOT_SUPPORT = 'PRINTER_NOT_SUPPORT'] 暂不支持。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_NOT_SUPPORT: 'PRINTER_NOT_SUPPORT',

        /**
         * @property {String} [PRINTER_BASE_ERR = 'PRINTER_BASE_ERR'] 打印机模块基础错误。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_BASE_ERR: 'PRINTER_BASE_ERR',

        /**
         * @property {String} [PRINTER_PRINT_FAILED='PRINTER_PRINT_FAILED'] 打印失败。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_PRINT_FAILED: 'PRINTER_PRINT_FAILED',

        /**
         * @property {String} [PRINTER_ADD_STRING_FAILED='PRINTER_ADD_STRING_FAILED'] 添加打印文字失败。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_ADD_STRING_FAILED: 'PRINTER_ADD_STRING_FAILED',

        /**
         * @property {String} [PRINTER_ADD_IMAGE_FAILED='PRINTER_ADD_IMAGE_FAILED'] 添加打印图片失败。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_ADD_IMAGE_FAILED: 'PRINTER_ADD_IMAGE_FAILED',

        /**
         * @property {String} [PRINTER_BUSY='PRINTER_BUSY'] 打印机处于忙状态。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_BUSY: 'PRINTER_BUSY',

        /**
         * @property {String} [PRINTER_OUT_OF_PAPER='PRINTER_OUT_OF_PAPER'] 缺纸。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_OUT_OF_PAPER: 'PRINTER_OUT_OF_PAPER',

        /**
         * @property {String} [PRINTER_WRONG_PACKAGE='PRINTER_WRONG_PACKAGE'] 打印数据包格式错。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_WRONG_PACKAGE: 'PRINTER_WRONG_PACKAGE',

        /**
         * @property {String} [PRINTER_FAULT='PRINTER_FAULT'] 打印机故障。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_FAULT: 'PRINTER_FAULT',

        /**
         * @property {String} [PRINTER_OVERHEAT='PRINTER_OVERHEAT'] 打印机过热。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_OVERHEAT: 'PRINTER_OVERHEAT',

        /**
         * @property {String} [PRINTER_UNFINISHED='PRINTER_UNFINISHED'] 打印未完成。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_UNFINISHED: 'PRINTER_UNFINISHED',

        /**
         * @property {String} [PRINTER_NO_FONT_LIB='PRINTER_NO_FONT_LIB'] 打印机未装字库。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_NO_FONT_LIB: 'PRINTER_NO_FONT_LIB',

        /**
         * @property {String} [PRINTER_OUT_OF_MEMORY='PRINTER_OUT_OF_MEMORY'] 数据包过长。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_OUT_OF_MEMORY: 'PRINTER_OUT_OF_MEMORY',

        /**
         * @property {String} [PRINTER_OTHER_ERR='PRINTER_OTHER_ERR'] 其他异常错误。
         * @member nymph.dev.printer.Printer.ErrorCode
         **/
        PRINTER_OTHER_ERR: 'PRINTER_OTHER_ERR',
    };

    /**
     * @property {nymph.dev.printer.Printer} Printer 打印机类，用来创建该类的实例。
     * @member nymph.dev.printer
     */
    printer.Printer = Printer;

    /**
     * @property {nymph.dev.printer.Printer.ErrorCode} ErrorCode 错误码。
     * @member nymph.dev.printer
     */
    Printer.ErrorCode = ErrorCode;

    module.exports = printer;

    },{"error":"error","hermes":"hermes"}],
    "scanner":[function(require,module,exports){
    'use strict';

    /**
     * # 扫描头模块（模块名：scanner）
     *
     * @class nymph.dev.scanner
     * @singleton
     * 本模块为扫描头入口模块，通过 `requrie('scanner')` 的方式获取：
     *
     * 如下：
     *
     *     // 获取扫描头入口模块。
     *     var scanner = require('scanner');
     *
     *     try{
     *       scanner.open();
     *
     *       //可不设置init，默认为使用前置摄像头
     *       var cfg = {
     *         scannerType: 1
     *       }
     *       scanner.init(cfg);
     *
     *       scanner.startScan(10,function(err,data){
     *         if(err){
     *           //失败处理
     *         }else {
     *           //成功处理
     *         }
     *
     *         scanner.stopScan();
     *         scanner.close();
     *       });
     *
     *
     *     }catch(err) {
     *       //失败处理
     *       scanner.close();
     *     }
     */

    var hermes = require('hermes');
    var nymphError = require('error');
    var scanner = {
      /**
       * 设备句柄。
       * @private
       * @type {String}
       */
      instanceId : hermes.NULL,

      /**
       * 插件 ID。
       */
      PLUGINID: 'd130b9999005ba356b7a0290e59a7418',

      scannerUsed: false,

      /**
       * @method open
       * 打开扫描头。
       *
       *     // 获取扫描头入口模块。
       *     var scanner = require('scanner');
       *
       *     try {
       *       scanner.open();
       *     } catch (err) {
       *       // 打开扫描头失败的处理。
       *       console.error(err.code + ' ' + err.message);
       *     }
       *
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      open: function () {
        var result, errorCode;
        result = hermes.exec(this.PLUGINID, hermes.NULL, 'open');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: result.message, innerCode: result.innerCode};
        }

      },

      /**
       * @method close
       * 关闭扫描头。
       *
       *     // 获取扫描头入口模块。
       *     var scanner = require('scanner');
       *     try {
       *       scanner.close();
       *     } catch (err) {
       *       // 关闭扫描头失败的处理。
       *       console.error(err.code + ' ' + err.message);
       *     }
       *
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      close: function () {
        var result, errorCode;
        result = hermes.exec(this.PLUGINID, this.instanceId, 'close');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: result.message, innerCode: result.innerCode};
        }
      },

      /**
       * @method init
       * 初始化扫描头。
       *
       *     // Get scanner.
       *     var scanner = require('scanner');
       *     try {
       *       var cfg = {
       *          scannerType:1
       *       };
       *       scanner.init(cfg);
       *     } catch (err) {
       *       // 失败处理
       *       console.error(err.code + ' ' + err.message);
       *     }
       *
       * @param {Object} cfg 扫描头各项配置。
       * @param {Number} cfg.scannerType 0前置 1后置。
       *
       *  @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      init: function (cfg) {
        var result, errorCode;
        result = hermes.exec(this.PLUGINID, this.instanceId, 'init', [cfg]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: result.message, innerCode: result.innerCode};
        }
      },

      /**
       * @method startScan
       * 扫描。
       *
       *     // Get scanner.
       *     var scanner = require('scanner');
       *     scanner.startScan(30,function(err, data){
       *        if(err){
       *            // 失败处理
       *        } else {
       *            // 成功处理
       *        }
       *     });
       *
       * @param {Number} timeout 超时时间,单位秒。
       * @param {Function} callback 处理此方法执行结果的回调函数。
       * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
       * @param {String} callback.data 扫描结果
       */
      startScan: function (timeout, callback) {
        var self = this,err = {};

        if(typeof timeout !== 'number' || isNaN(timeout) || timeout < 0){
          throw {code: nymphError.PARAM_ERR, message: 'The first parameter should be a number!'};
        }
        if(typeof callback !== 'function'){
          throw {code: nymphError.PARAM_ERR, message: 'The second parameter should be a callback function!'};
        }

        if(this.scannerUsed){
          err.code = nymphError.DEVICE_USED;
          err.message = 'The scanner is being used!';
          callback.call(self,err);
          return;
        }
        this.scannerUsed = true;

        hermes.exec(this.PLUGINID, this.instanceId, 'startScan', [timeout], function (err, data) {
          if (err) {
            err.code = self.getError(err.innerCode);
            callback.call(self, err);
          } else {
            callback.call(self, null, data);
          }

          self.scannerUsed = false;

        });
      },

      /**
       * @ignore
       * @method stopScan
       * 停止扫描。
       * 该接口用于 startScan 后还未回调前强制停止扫描用的。
       * 不能在 startScan 后立即调用，需要加上一定的延迟时间，让扫描界面启动完成。
       *
       *     // Get scanner.
       *     var scanner = require('scanner');
       *     try {
       *       scanner.stopScan();
       *     } catch (err) {
       *       // 失败处理
       *       console.error(err.code + ' ' + err.message);
       *     }
       *
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      stopScan: function () {
        var result, errorCode;

        if(!this.scannerUsed){
          throw {code: nymphError.ERROR, message: 'The scanner is not start!'};
        }

        result = hermes.exec(this.PLUGINID, this.instanceId, 'stopScan');
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: result.message, innerCode: result.innerCode};
        }
      },

      /**
       * @method decode
       * 解码一维，二维码图片。
       *
       *     // Get scanner.
       *     var scanner = require('scanner');
       *     try {
       *       var data = {
       *         imageData: "image base64 string" ,
       *         width: 100,
       *         height: 100
       *       };
       *       var decodeData = scanner.decode(data);
       *     } catch (err) {
       *       // 失败处理
       *       console.error(err.code + ' ' + err.message);
       *     }
       *
       * @param {Object} data 图像相关参数
       * @param {String} data.imageData 图像数据，必须是灰度化后的图像数据，且必须是一个字节代表一个像素，格式为 Base64
       * @param {String} data.width 图像宽度
       * @param {String} data.height 图像高度
       * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
       */
      decode: function(data) {
        var result, errorCode;

        result = hermes.exec(this.PLUGINID, this.instanceId, 'decode', [data]);
        errorCode = this.getError(result.innerCode);
        if (errorCode !== nymphError.SUCCESS) {
          throw {code: errorCode, message: result.message, innerCode: result.innerCode};
        }
        return result.data;

      },

      /**
       * @ignore
       * @param {Number} innerCode 底层上传的返回码
       * @return {String} 返回码对应的字符串
       */
      getError: function (innerCode) {
        switch (innerCode) {
          case -2000: // 扫描头基础错误码
            return nymphError.ERROR;
          case -2001:
            return nymphError.CANCELED;
          case -2999:
            return nymphError.OTHER_ERR;
          default:
            return nymphError.getError(innerCode);
        }
      }
    };
    hermes.addJsPluginInstance(scanner.PLUGINID, scanner);
    module.exports = scanner;

    },{"error":"error","hermes":"hermes"}],
    "serial-port":[function(require,module,exports){
    (function (Buffer){
    'use strict';

    /**
     * # 串口（模块名：serialport）
     * @class nymph.comm.serialPort
     *
     * 本模块为串口入口模块，通过 `requrie('serialport')` 的方式获取，包含以下两个部分内容：
     *
     * - 串口类：提供了和串口相关的一些方法。
     * - 所有与串口相关的类和对象。
     *
     * 如下：
     *
     *     // 获取串口入口模块。
     *     var serialPort = require('serialport');
     *
     *     // 获取串口类。
     *     var SerialPort = serialPort.SerialPort;
     *
     *     // 获取串口配置类。
     *     var SerialPortCfg = serialPort.SerialPortCfg;
     *     var serialportCfg = new SerialPortCfg();
     *
     *     // 创建一个串口实例。
     *     var sp = new SerialPort('COM1', serialportCfg);
     *
     */

    /**
     * # 串口类
     *
     * @class nymph.comm.serialPort.SerialPort
     *
     * @constructor
     * 构造一个新的串口对象。
     * @param {nymph.comm.serialPort.PortName} portName 串口名称。
     * @param {nymph.comm.serialPort.SerialPortCfg} options (Optional) 串口配置。
     */
    var serialPort = {},
        hermes = require('hermes'),
        tools = require('tools'),
        nymphError = require('error');
    var SerialPort = function (portName, options) {
        var self = this;

        // 默认串口参数
        var cfg = new serialPort.SerialPortCfg();

        /**
         * @property {String} portName
         * 串口名称。
         */
        switch (portName) {
            case serialPort.PortName.COM1:
            case serialPort.PortName.COM2:
            case serialPort.PortName.USBD:
                self.portName = portName;
                break;
            default:
                throw {code: nymphError.PARAM_ERR, message:'Not support: ' + portName};
        }

        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    cfg[key] = options[key];
                }
            }
        }
        self.cfg = cfg;
        self.instanceId = hermes.NULL;
    };
    SerialPort.prototype = {
        PLUGINID: '3c7e14178cab972ead2467b0392f600b',

        constructor: SerialPort,

        /**
         * @method open
         * 打开串口。
         *
         *     try {
         *       sp.open();
         *     } catch (err) {
         *       //失败的处理
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         */
        open: function () {
            var result, errorCode;
            result = hermes.exec(this.PLUGINID, hermes.NULL, 'open', [this.portName, this.cfg]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to open ' + this.portName, innerCode: result.innerCode};
            }

            this.instanceId = result.data;

            // 注册插件。
            hermes.addJsPluginInstance(this.instanceId, this);
        },

        /**
         * @method write
         * 向串口发送数据。
         *
         *     var data = new Buffer([0x01, 0x02, 0x03, 0x04]);
         *     sp.write(data,function(err) {
         *        if (err) {
         *          // 失败的处理
         *        } else {
         *          // 成功的处理
         *        }
         *     });
         *
         * @param {Object/String/Array} data 要发送给串口的数据。数据类型可为 16 进制字符串/Array/[Buffer](https://nodejs.org/api/buffer.html)
         * @param {Number} timeout (Optional) 超时时间，单位为毫秒（ms）。默认为 0（不等待）。
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         */
        write: function (data, timeout, callback) {
            var self = this, result, errorCode, actualTimeout = 0, actualData;
            if (arguments.length === 1) {
                if (typeof data === 'function') {
                    callback = data;
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check parameters, at least pass in data and callback!'});
                    return;
                }
                throw {code: nymphError.PARAM_ERR, message: 'Please check parameters, at least pass in data and callback!'};
            }
            if (arguments.length === 2) {
                if (typeof timeout !== 'function') {
                    if (typeof data === 'function') {
                        callback = data;
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check parameters, callback is the last parameters!'});
                        return;
                    }
                    throw {code: nymphError.PARAM_ERR, message: 'Please check parameters, at least pass in data and callback!'};
                }
                callback = timeout;
                if(!data) {
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Invalid data!'});
                    return;
                }
            }
            if (arguments.length === 3) {
                if(typeof callback !== 'function') {
                    if (typeof data === 'function') {
                        callback = data;
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check the order of parameters, the first parameter should be data, and the second parameter should be timeout, the third parameter should be callback!'});
                        return;
                    }
                    if (typeof timeout === 'function') {
                        callback = timeout;
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check the order of parameters, the first parameter should be data, and the second parameter should be timeout, the third parameter should be callback!'});
                        return;
                    }
                    throw {code: nymphError.PARAM_ERR, message: 'The last parameter should be a callback function!'};
                }
                if (timeout) {
                    if (typeof timeout === 'number' && timeout > 0) {
                        actualTimeout = timeout;
                    } else {
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Invalid timeout!'});
                        return;
                    }
                }
                if(!data) {
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Invalid data!'});
                    return;
                }
            }

            try {
                actualData = tools.toBase64(data);
            } catch (err) {
                if (err) {
                    throw {code: nymphError.PARAM_ERR, message: 'invalid data:' + err.message};
                } else {
                    throw {code: nymphError.PARAM_ERR, message: 'invalid data!'};
                }
            }
            hermes.exec(this.PLUGINID, this.instanceId, 'write', [actualData, actualTimeout], function (err) {
                if (err) {
                    err.code = self.getError(err.innerCode);
                    callback.call(self, err);
                } else {
                    callback.call(self, null);
                }
            });
        },

        /**
         * @method read
         * 读串口数据。
         *
         *     sp.read(10000,10000, function(err, data) {
         *       if (err) {
         *         // 失败的处理
         *       } else {
         *         // 成功的处理，对收到的 data 进行处理
         *       }
         *     } );
         *
         * @param {Number} dataLen 期望接收的数据长度。
         * @param {Number} timeout (Optional) 超时时间，单位为毫秒（ms）。默认为 0（不等待）。
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         * @param {Object} callback.data 收到的串口数据。数据类型为 [Buffer](https://nodejs.org/api/buffer.html)。
         */
        read: function (dataLen, timeout, callback) {
            var result, errorCode, data = null, actualTimeout = 0, self = this;
            if (dataLen === 0) {
                return data;
            }
            if (arguments.length === 1) {
                if (typeof dataLen === 'function') {
                    callback = dataLen;
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check parameters, at least pass in dataLen and callback!'});
                    return;
                }
                throw {code: nymphError.PARAM_ERR, message: 'Please check parameters, at least pass in dataLen and callback!'};
            }
            if (arguments.length === 2) {
                if (typeof timeout !== 'function') {
                    if (typeof dataLen === 'function') {
                        callback = dataLen;
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check parameters, callback is the last parameters!'});
                        return;
                    }
                    throw {code: nymphError.PARAM_ERR, message: 'Please check parameters, at least pass in dataLen and callback!'};
                }
                callback = timeout;
                if (typeof dataLen !== 'number' || dataLen < 0) {
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Invalid dataLen!'});
                    return;
                }
            }
            if (arguments.length === 3) {
                if(typeof callback !== 'function') {
                    if (typeof dataLen === 'function') {
                        callback = dataLen;
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check the order of parameters, the first parameter should be dataLen, and the second parameter should be timeout, the third parameter should be callback!'});
                        return;
                    }
                    if (typeof timeout === 'function') {
                        callback = timeout;
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Please check the order of parameters, the first parameter should be dataLen, and the second parameter should be timeout, the third parameter should be callback!'});
                        return;
                    }
                    throw {code: nymphError.PARAM_ERR, message: 'The last parameter should be a callback function!'};
                }
                if (timeout) {
                    if (typeof timeout === 'number' && timeout > 0) {
                        actualTimeout = timeout;
                    } else {
                        callback.call(self, {code: nymphError.PARAM_ERR, message: 'Invalid timeout!'});
                        return;
                    }
                }
                if (typeof dataLen !== 'number' || dataLen < 0) {
                    callback.call(self, {code: nymphError.PARAM_ERR, message: 'Invalid dataLen!'});
                    return;
                }
            }
            hermes.exec(this.PLUGINID, this.instanceId, 'read', [dataLen, actualTimeout], function (err, dataReceived) {
                if (err) {
                    err.code = self.getError(err.innerCode);
                    callback.call(self, err);
                } else {
                    if (dataReceived) {
                        data = new Buffer(dataReceived, 'base64');
                    }
                    callback.call(self, null, data);
                }
            });
        },

        /**
         * @method flush
         * 清缓存。
         *
         *     try {
         *       sp.flush();
         *     } catch (err) {
         *       //失败的处理
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         */
        flush: function () {
            var result, errorCode;
            result = hermes.exec(this.PLUGINID, this.instanceId, 'flush');
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to flush ' + this.portName, innerCode: result.innerCode};
            }
        },

        /**
         * @method close
         * 关闭串口。
         *
         *     try {
         *       sp.close();
         *     } catch (err) {
         *       //失败的处理
         *     }
         *
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         */
        close: function () {
            var result, errorCode;
            if (this.instanceId == hermes.NULL) {
                // 若还未打开，无需去关闭。
                return;
            }
            result = hermes.exec(this.PLUGINID, this.instanceId, 'close');
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to close ' + this.portName, innerCode: result.innerCode};
            }
            // 反注册
            hermes.removeJsPluginInstance(this.instanceId);
            this.instanceId = hermes.NULL;
        },

        getError: function (innerCode) {
            switch (innerCode) {
                default:
                    return nymphError.getError(innerCode);
            }
        },
    };
    /**
     * # 串口错误码
     * @class nymph.comm.serialPort.SerialPort.ErrorCode
     */
    var ErrorCode = {

    };

    /**
     * # 串口配置
     * @class nymph.comm.serialPort.SerialPortCfg
     */
    var SerialPortCfg = function () {
        /**
         * @property {nymph.comm.serialPort.BaudRate} baudRate 波特率。默认为 115200。
         */
        this.baudRate = serialPort.BaudRate.BPS115200;

        /**
         * @property {nymph.comm.Parity} parity 奇偶校验。
         */
        this.parity = serialPort.Parity.NOPAR;

        /**
         * @property {nymph.comm.DataBits} dataBits 数据位。
         */
        this.dataBits = serialPort.DataBits.DB8;

        /**
         * @property {nymph.comm.StopBits} stopBits 停止位。
         */
        this.stopBits = serialPort.StopBits.SB1;
    };

    /**
     * # 串口名称
     * @class nymph.comm.serialPort.PortName
     */
    var PortName = {
        /**
         * @property {String} [COM1 = 'COM1'] 串口 1
         * @member nymph.comm.serialPort.PortName
         **/
        COM1: 'COM1',

        /**
         * @property {String} [COM2 = 'COM2'] 串口 2
         * @member nymph.comm.serialPort.PortName
         **/
        COM2: 'COM2',

        /**
         * @property {String} [USBD = 'USBD'] USBD 口
         * @member nymph.comm.serialPort.PortName
         **/
        USBD: 'USBD'
    };

    /**
     * # 波特率
     * @class nymph.comm.serialPort.BaudRate
     */
    var BaudRate = {
        /**
         * @property {Number} [BPS1200 = 1200] BPS1200
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS1200: 1200,

        /**
         * @property {Number} [BPS2400 = 2400] BPS2400
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS2400: 2400,

        /**
         * @property {Number} [BPS4800 = 4800] BPS4800
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS4800: 4800,

        /**
         * @property {Number} [BPS9600 = 9600] BPS9600
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS9600: 9600,

        /**
         * @property {Number} [BPS14400 = 14400] BPS14400
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS14400: 14400,

        /**
         * @property {Number} [BPS19200 = 19200] BPS19200
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS19200: 19200,

        /**
         * @property {Number} [BPS24000 = 24000] BPS24000
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS24000: 24000,

        /**
         * @property {Number} [BPS26400 = 26400] BPS26400
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS26400: 26400,

        /**
         * @property {Number} [BPS28800 = 28800] BPS28800
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS28800: 28800,

        /**
         * @property {Number} [BPS33600 = 33600] BPS33600
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS33600: 33600,

        /**
         * @property {Number} [BPS38400 = 38400] BPS38400
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS38400: 38400,

        /**
         * @property {Number} [BPS57600 = 57600] BPS57600
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS57600: 57600,

        /**
         * @property {Number} [BPS115200 = 115200] BPS115200
         * @member nymph.comm.serialPort.BaudRate
         */
        BPS115200: 115200,

        /**
         * @property {Number} [None = 0] None
         * @member nymph.comm.serialPort.BaudRate
         */
        NONE: 0
    };

    /**
     * # 奇偶校验
     * @class nymph.comm.serialPort.Parity
     */
    var Parity = {
        /**
         * @property {String} [NOPAR = 'NOPAR'] 无校验（缺省）
         * @member nymph.comm.serialPort.Parity.NOPAR
         **/
        NOPAR: 'NOPAR',

        /**
         * @property {String} [EVENPAR = 'EVENPAR'] 偶校验
         * @member nymph.comm.serialPort.Parity.EVENPAR
         **/
        EVENPAR: 'EVENPAR',

        /**
         * @property {String} [ODDPAR = 'ODDPAR'] 奇效验
         * @member nymph.comm.serialPort.Parity.ODDPAR
         **/
        ODDPAR: 'ODDPAR'
    };

    /**
     * # 数据位
     * @class nymph.comm.serialPort.DataBits
     */
    var DataBits = {
        /**
         * @property {Number} [DB7 = 7] 7 位数据位
         * @member nymph.comm.serialPort.DataBits.DB7
         **/
        DB7: 7,

        /**
         * @property {Number} [DB8 = 8] 8 位数据位（缺省）
         * @member nymph.comm.serialPort.DataBits.DB8
         **/
        DB8: 8
    };

    /**
     * # 停止位
     * @class nymph.comm.serialPort.StopBits
     */
    var StopBits = {
        /**
         * @property {Number} [SB1 = 1] 1 位停止位（缺省）
         * @member nymph.comm.serialPort.StopBits.SB1
         **/
        SB1: 1,

        /**
         * @property {Number} [SB15 = 1.5] 1.5 位停止位
         * @member nymph.comm.serialPort.StopBits.SB15
         **/
        SB15: 1.5,

        /**
         * @property {Number} [SB2 = 2] 2 位停止位
         * @member nymph.comm.serialPort.StopBits.SB2
         **/
        SB2: 2
    };

    /**
     * @property {nymph.comm.serialPort.PortName} PortName 串口名称。
     * @member nymph.comm.serialPort
     */
    serialPort.PortName = PortName;

    /**
     * @property {nymph.comm.serialPort.BaudRate} BaudRate 波特率。
     * @member nymph.comm.serialPort
     */
    serialPort.BaudRate = BaudRate;

    /**
     * @property {nymph.comm.serialPort.Parity} Parity 奇偶校验。
     * @member nymph.comm.serialPort
     */
    serialPort.Parity = Parity;

    /**
     * @property {nymph.comm.serialPort.DataBits} DataBits 数据位。
     * @member nymph.comm.serialPort
     */
    serialPort.DataBits = DataBits;

    /**
     * @property {nymph.comm.serialPort.StopBits} StopBits 停止位。
     * @member nymph.comm.serialPort
     */
    serialPort.StopBits = StopBits;

    /**
     * @property {nymph.comm.serialPort.SerialPortCfg} SerialPortCfg 串口配置类，用来创建该类的实例。
     * @member nymph.comm.serialPort
     */
    serialPort.SerialPortCfg = SerialPortCfg;

    /**
     * @property {nymph.comm.serialPort.SerialPort.ErrorCode} ErrorCode 错误码。
     * @member nymph.comm.serialPort.SerialPort
     */
    SerialPort.ErrorCode = ErrorCode;

    /**
     * @property {nymph.comm.serialPort.SerialPort} SerialPort 串口类，用来创建该类的实例。
     * @member nymph.comm.serialPort
     */
    serialPort.SerialPort = SerialPort;
    module.exports = serialPort;

    }).call(this,require("buffer").Buffer)
    },{"buffer":"buffer","error":"error","hermes":"hermes","tools":"tools"}],
    "signature-pad":[function(require,module,exports){
    (function (Buffer){
    'use strict';

    var hermes = require('hermes'),
        nymphError = require('error'),
        tools = require('tools'),
        encoding = require('nymph-encoding');
    /**
     * # 手写签名（模块名：signature-pad）
     * @class nymph.sys.signaturePad
     * @singleton
     */
    var signaturePad = {
        /**
         * 插件ID。
         */
        PLUGINID: '6cfb59823c2ca94fa8eb99ea68712ed0',

        instanceId: hermes.NULL,

        /**
         * @method startSignature
         * 显示手写签名板。输入成功后，可获得带有交易码水印并且压缩过的签名图片。
         *
         *     var signaturePad = require('signature-pad'),
         *         transCode = 34AC3289;
         *
         *     signaturePad.startSignature(transCode, function(err, result) {
         *     });
         *
         * @param {String} background 水印信息。
         * @param {Object} [options] 手写签名相关参数。
         * @param {Number} options.timeout 超时时间，单位为秒。若此值小于等于 0，则无超时限制。默认为无超时限制。
         * @param {nymph.sys.signaturePad.Rotation} options.rotation 旋转方向。如果没有传入此参数，则默认旋转方向自动。
         * @param {Number} options.reSignTimes 重签次数。若此值小于等于 0，则无重签次数限制。默认为无重签次数限制。
         * @param {Boolean} options.isResetTimeout 重签的时候是否重置超时时间。默认为不重置。
         * @param {Function} callback 处理此方法执行结果的回调函数。
         * @param {nymph.error.NymphError} callback.err 执行此方法过程中产生的错误。
         * @param {Object} callback.result
         * @param {String} callback.result.signatureData 经过处理后带有交易码水印的签名数据（HEX 字符串）。
         * @param {String} callback.result.picBase64 带有交易码水印的签名图片的 base64 字符串。
         * @member nymph.sys.signaturePad
         */
        startSignature: function (background, options, callback) {
            var self = this, result, errorCode, errCallback,
                actualOptions = {timeout: -1, rotation: self.Rotation.ROTATION_AUTO, reSignTimes: -1, isResetTimeout: false};

            if (!background){
                throw {code: nymphError.PARAM_ERR, message: 'Please at lease pass in transCode and callback!'};
            }

            if (typeof background !== 'string') {
                if (typeof background === 'function') {
                    errCallback = background;
                } else if (typeof options === 'function') {
                    errCallback = options;
                } else if (typeof callback === 'function'){
                    errCallback = callback;
                } else {
                    throw {code: nymphError.PARAM_ERR, message: 'Please at lease pass in transCode and callback!'};
                }
                errCallback.call(self, {code:nymphError.PARAM_ERR, message: 'transCode must be a string!'});
                return;
            }

            // 调整参数。
            if (typeof options === 'function') {
                callback = options;
            } else {
                if (options.hasOwnProperty('timeout')){
                    actualOptions.timeout = options.timeout;
                }
                if (options.hasOwnProperty('rotation')){
                    actualOptions.rotation = options.rotation;
                }
                if (options.hasOwnProperty('reSignTimes')){
                    actualOptions.reSignTimes = options.reSignTimes;
                }
                if (options.hasOwnProperty('isResetTimeout')){
                    actualOptions.isResetTimeout = options.isResetTimeout;
                }
            }

            hermes.exec(this.PLUGINID, this.instanceId, 'startSignature', [background, actualOptions], function(err, result) {
                if (err) {
                    err.code = self.getError(err.innerCode);
                    callback.call(self, err);
                } else {
                    if (result.signatureData) {
                        result.signatureData = encoding.bufferToHexString(new Buffer(result.signatureData, 'base64'));
                    }
                    callback.call(self, null, result);
                }
            });
        },

        /**
         * @method close
         * 强制关闭手写签名板。会触发签名板回调。
         * @member nymph.sys.signaturePad
         */
        close: function(){
            var self = this, result, errorCode;

            result = hermes.exec(this.PLUGINID, this.instanceId, 'close');
            errorCode = self.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to close signature pad.', innerCode: result.innerCode};
            }
        },

        getError: function (innerCode) {
            switch (innerCode) {
                case 2:
                    return nymphError.CANCELLED;
                case 1:
                    return nymphError.TIMEOUT;
                default:
                    return nymphError.getError(innerCode);
            }
        }
    };

    /**
     * 屏幕旋转方向。
     * @class nymph.sys.signaturePad.Rotation
     */
    var Rotation = {
        /**
         * 设为此值时，签名板会自动选择能够使其尽可能大的旋转方向。
         */
        ROTATION_AUTO: 'ROTATION_AUTO',

        /**
         * 设为此值时，签名板的旋转方向为横屏。
         */
        ROTATION_LANDSCAPE: 'ROTATION_LANDSCAPE',

        /**
         * 设为此值时，签名板的旋转方向为当前屏幕旋转方向，即不进行旋转。
         */
        ROTATION_NONE: 'ROTATION_NONE',

        /**
         * 设为此值时，签名板的旋转方向为竖屏。
         */
        ROTATION_PORTRAIT: 'ROTATION_PORTRAIT',

        /**
         * 设为此值时，签名板的旋转方向为反向横屏。
         */
        ROTATION_REVERSE_LANDSCAPE: 'ROTATION_REVERSE_LANDSCAPE',

        /**
         * 设为此值时，签名板的旋转方向为反向竖屏。
         */
        ROTATION_REVERSE_PORTRAIT: 'ROTATION_REVERSE_PORTRAIT'
    };

    /**
     * 旋转方向枚举
     * @class nymph.sys.signaturePad.Rotation
     */
    signaturePad.Rotation = Rotation;

    hermes.addJsPluginInstance(signaturePad.PLUGINID, signaturePad);
    module.exports = signaturePad;

    }).call(this,require("buffer").Buffer)
    },{"buffer":"buffer","error":"error","hermes":"hermes","nymph-encoding":"nymph-encoding","tools":"tools"}],
    "socket-io-client":[function(require,module,exports){
    'use strict';
    var socketIoClient = {};
    var socket, io = require('socket.io-client');
    socketIoClient.connect = function (ip, port) {
        socket = io.connect('http://'+ip+':'+port);
        socket.on('connect', function(){
            console.log('socket connected.');
        });
        socket.on('disconnect', function () {
            console.log('socket disconnected');
            socket = null;
        });
    };
    socketIoClient.changePic = function (picName) {
        if (socket) {
            if (picName) {
                socket.emit('change picture', {clientId: 'change', picName: picName});
            } else {
                console.log('changePic...');
                socket.emit('change picture', {clientId: 'change', picName: 'demo2.png'});
            }
        } else {
            throw {code: 'ERROR', message:'Please connect first!'};
        }
    };
    module.exports = socketIoClient;

    },{"socket.io-client":213}],
    "testlib":[function(require,module,exports){
    'use strict';
    var testlib = require('./testlib.js');
    var hermes = require('hermes');

    testlib.getInputs = function (modelId, apiId) {
        var tmp = hermes.exec(this.PLUGINID, hermes.NULL, 'getInputs', [modelId, apiId]);
        return tmp.data;
    };


    module.exports = testlib;


    },{"./testlib.js":61,"hermes":"hermes"}],
    "tmsStub":[function(require,module,exports){
    'use strict';

    /**
     * # TMS 桩函数模块（模块名：tmsStub）
     * @class nymph.pay.tmsStub
     * @singleton
     */
    // 引用外部模块。
    var nymphError = require('error');
    var hermes = require('hermes');
    var tmsStub = {
        PLUGINID: 'aafa296fc7a5bb788c5383ad91322702',

        instanceId: hermes.NULL,

        /**
         * @method setTimeOut
         * 设置 TMS 测试返回延迟时间
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         */
        setTimeOut: function (timeOut) {
            var result, errorCode;
            result = hermes.exec(this.PLUGINID, this.instanceId, 'setTimeOut', [{timeOut: timeOut}]);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to setTimeOut.', innerCode: result.innerCode};
            }
        },

        /**
         * @method getTimeOut
         * 获取 TMS 测试返回延迟时间
         * @throws {nymph.error.NymphError} 如果出错，将抛出异常。
         */
        getTimeOut: function () {
            var self = this, result, errorCode;
            result = hermes.exec(this.PLUGINID, this.instanceId, 'getTimeOut', []);
            errorCode = this.getError(result.innerCode);
            if (errorCode !== nymphError.SUCCESS) {
                throw {code: errorCode, message: 'Failed to getTimeOut.', innerCode: result.innerCode};
            } else {
                return result.data.timeOut;
            }
        },

        /**
         * @ignore
         * @param {Number} innerCode 底层上传的返回码
         * @returns {String} 返回码对应的字符串
         */
        getError: function (innerCode) {
            switch (innerCode) {
                default:
                    return nymphError.getError(innerCode);
            }
        }
    };
    module.exports = tmsStub;

    },{"error":"error","hermes":"hermes"}],
    "tools":[function(require,module,exports){
    'use strict';

    var Buffer = require('buffer').Buffer;
    var encoding = require('nymph-encoding');
    var nymphErr = require('error');

    /**
     * # 工具类（模块名：tools）
     * @class nymph.util.tools
     * @singleton
     * @experimental 规范尚未制定完成！
     */
    var tools = {
      /**
       * @method getAmountBuffer
       * 将金额转换成 6 字节 BCD 码。如 123 转换成 [0x00, 0x00, 0x00, 0x00, 0x01, 0x23]
       * @param {Number} amount 要转换的金额
       * @return {Object} 6 字节 BCD 码，数据类型为 [Buffer](https://nodejs.org/api/buffer.html)
       */
      getAmountBuffer: function (amount) {
        if (typeof  amount !== 'number') {
          throw {code: nymphErr.PARAM_ERR, message: 'Amount should be a number!'};
        }

        if (amount.toString().length > 12) {
          return null;
        }

        // 给金额补齐 12 位，左补 0。
        var amountString = this.padZeroLeft(amount, 12);

        // 金额转换成 6 字节 Buffer。
        var amountBuffer = encoding.hexStringToBuffer(amountString);
        console.log('tools amountBuffer:' + encoding.bufferToHexString(amountBuffer));
        return amountBuffer;
      },

      /**
       * @method padZeroLeft
       * 给一个整型数字左补 0
       * @param {Number} num 要进行左补 0 的数字
       * @param {Number} n 进行补 0 操作后的总长度
       * @return {String} 进行左补 0 操作后的字符串
       */
      padZeroLeft: function (num, n) {
        var len = num.toString().length;
        if (len > n) {
          throw {code: nymphErr.PARAM_ERR, message: '数字长度已超出预期长度。'};
        }
        while (len < n) {
          num = '0' + num;
          len++;
        }
        return num.toString();
      },

      /**
       * @method padStr
       * @param str 初始字符串
       * @param length 总长度
       * @param factor 填充字符
       * @param align 填充位置:left,right
       * @return {string}
       */
      padStr: function (str, length, factor, align) {
        if (!str) {
          str = '';
        }
        str = str.toString();
        if (isNaN(length)) {
          length = parseInt(length);
        }
        length = length - str.length + 1;
        var pad = new Array(length).join(factor);
        if (align === 'left') {
          str = pad + str;
        } else {
          str += pad;
        }
        return str;
      },

      /**
       * @method toBase64
       * 将 Buffer、16进制字符串、Array 类型的数据转成 Buffer 的 base64 字符串。
       * @param {Object/String/Array} data
       * @return {String}
       */
      toBase64: function (data) {
        if (data) {
          var tempBuf, result;
          if (Buffer.isBuffer(data)) {
            result = data.toString('base64');
          } else {
            if (data.constructor === Array) {
              tempBuf = new Buffer(data);
            } else {
              try {
                tempBuf = encoding.hexStringToBuffer(data);
              } catch (e) {
                throw {code: nymphErr.PARAM_ERR, message: JSON.stringify(data) + ' is not a hex string!'};
              }
            }

            if (tempBuf === null) {
              throw {code: nymphErr.PARAM_ERR, message: JSON.stringify(data) + ' can not be converted to a buffer!'};
            }
            result = tempBuf.toString('base64');
          }
          return result;
        } else {
          throw {code: nymphErr.PARAM_ERR, message: JSON.stringify(data) + ' can not be converted to a buffer!'};
        }
      }
    };

    module.exports = tools;

    },{"buffer":"buffer","error":"error","nymph-encoding":"nymph-encoding"}]
}