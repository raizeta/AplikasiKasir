/**
 * Created by lilin01 on 2015/11/3.
 */

(function () {
    'use strict';
    /* jshint -W117 */
    argo.initiatorService.time();
    argo.initiatorService.init();
    if (window.cordova)
    {
        var db = window.openDatabase("rasasayang.db", "1.0", "Your App", 2000000000000);
        argo.initiatorService.execute(db, 'CREATE TABLE IF NOT EXISTS Tbl_Stores (ID_LOCAL INTEGER PRIMARY KEY AUTOINCREMENT,TGL_SAVE TEXT,ACCESS_GROUP TEXT,STORE_ID TEXT,STORE_NM TEXT,ACCESS_ID TEXT,UUID TEXT,PLAYER_ID TEXT,PROVINCE_ID INTEGER,PROVINCE_NM TEXT,CITY_ID INTEGER,CITY_NAME TEXT,ALAMAT TEXT,PIC TEXT,TLP TEXT,FAX TEXT,STATUS INTEGER,START TEXT, END TEXT,DCRP_DETIL TEXT,INDUSTRY_ID INTEGER,INDUSTRY_NM TEXT,INDUSTRY_GRP_ID INTEGER,INDUSTRY_GRP_NM TEXT,LONGITUDE TEXT,LATITUDE TEXT)');

    }
    else
    {
        console.log("Cordova Tidak Aktif");
    }

    if (!argo.router) {
        argo.router = new argo.Router();
    }
    argo.router.configure({
        'initiator': {
            url: '/initiator',
            template: 'components/initiator/initiator.html',
        }
    });

    var showLogPag = argo.id('btn-log'),
        logPage = argo.id('log-pag'),
        logList = argo.id('log-list'),
        btnGoHome = argo.id('goHome'),
        btnClear = argo.id('logClear');
    argo.addEvent(showLogPag, 'click', function () {
        console.log(logPage.style.visibility);
        logPage.style.visibility = 'visible';
    });
    argo.addEvent(btnGoHome, 'click', function () {
        logPage.style.visibility = 'hidden';
    });
    argo.addEvent(btnClear, 'click', function () {
        logList.innerHTML = '';
    });
    var btn = argo.id('back');
    argo.addEvent(btn, 'click', function () {
        var emvProcessData = argo.emvService.getEmvProcessData();
        if (JSON.stringify(emvProcessData) !== '{}') {
            // 说明有启动了 EMV 流程
            argo.cardHolderInfoCollectorService.cancel();
        }
        console.nativeLog('window.location.hash: '+ window.location.hash);
        if (window.location.hash === '#/wifi') {
            argo.router.go('hermes-test');
        } else {
            argo.router.go('initiator');
        }
    });

    checkStartType();


    /***** Value Added ***
     * Judge the start type whether it is external invoke
     * @returns {*}
     */
    function checkStartType(){
        var nymph = require('nymph'), address, index, callParams;
        address = location.toString();
        index = address.indexOf('call-trans/');
        if(index > -1){
            callParams = address.substr(index + 11);
            callParams = decodeURIComponent(callParams);
            callParams = JSON.parse(callParams);
            console.log('***************** checkparam '+JSON.stringify(callParams));

            try {
                checkParams(callParams);
            } catch (err){
                console.log('***************** checkparam error='+JSON.stringify(err));
                // If check params error then return the result to external app
                var valAddTraceNo = '', result;

                if(callParams && callParams.transData){
                    valAddTraceNo = callParams.transData.valAddTraceNo;
                }
                result = {
                    transId: callParams.transId,
                    resultCode: err?err.code:null,
                    resultMsg: err?err.msg:null,
                    transData: {
                        valAddTraceNo: valAddTraceNo
                    }
                };
                nymph.app.callTransResult(result);
            }
        } else {
            // If it is no value added app invoke, then into normal step
            argo.router.go('initiator');
        }

        /***** Value Added ***
         * Check the transId and transData
         * @param {Object} params value added params
         * @param {String} params.transId  trans name
         * @param {String} params.transData trans data
         * @returns {boolean} isContinue whether to continue execute transaction
         */
        function checkParams(params) {
            //Check value added app params
            if(!(params && params.transId && params.transData && params.transData.valAddTraceNo)){
                throw {code: nymphApp.callTransResultCode.PARAM_ERROR,
                    msg: nymphApp.callTransResultMsg.PARAM_ERROR};
            }

            // Check whether the trans support
            switch (params.transId.toUpperCase()) {
                case 'SALE':

                    argo.transData = {
                        transId: params.transId,
                        valAddTraceNo: params.transData.valAddTraceNo,
                        isValAddPrint: params.transData.isValAddPrint
                    };
                    argo.payService.postForm();
                    break;
                case 'VALADDINQUIRY':

                    /***** Value Added ***
                     * Inquiry transaction result
                     *  success: Send transaction detail to value added app.
                     *  fail: Send error message to value added app.
                     */
                    var valAddTraceNo = localStorage.getItem('valAddTraceNo'), result;
                    if(valAddTraceNo === params.transData.valAddTraceNo){
                        result = {
                            transId: params.transId,
                            resultCode: nymph.app.callTransResultCode.SUCCESS,
                            resultMsg: nymph.app.callTransResultMsg.SUCCESS,
                            transData: {
                                resCode: '00',
                                resDesc: 'Transaction Success',
                                valAddTraceNo: params.transData.valAddTraceNo,
                                amt: '123',
                                cardNo: '6214855511118555',
                                date: '0101',
                                time: '121010'
                            }
                        };
                        nymph.app.callTransResult(result);
                    } else {
                        result = {
                            transId: '',
                            resultCode: nymph.app.callTransResultCode.SUCCESS,
                            resultMsg: nymph.app.callTransResultMsg.SUCCESS,
                            transData: {
                                resCode: '25',
                                resDesc: 'Transaction Record No Found',
                                valAddTraceNo: params.transData.valAddTraceNo
                            }
                        };
                        nymph.app.callTransResult(result);
                    }
                    break;
                default :
                    throw {code: nymph.app.callTransResultCode.NO_EXIT_TRANS,
                        msg: nymph.app.callTransResultMsg.NO_EXIT_TRANS};
            }
        }
    }
})();