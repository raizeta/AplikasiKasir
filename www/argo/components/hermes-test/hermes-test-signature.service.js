/* jshint -W117 */
argo.hermesTestSignature = (function () {
    'use strict';

    var nymph = require('nymph'),
        signaturePad = nymph.sys.signaturePad,
        printer = new nymph.dev.printer.Printer('PRINTER');
    console.nativeLog('signaturePad:' + JSON.stringify(signaturePad));

    function showSignaturePadTimeout() {
        signaturePad.startSignature('A3F72456', {timeout: 100}, function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function showSignaturePadLandscape() {
        signaturePad.startSignature('B3F72456', {rotation: signaturePad.Rotation.ROTATION_LANDSCAPE}, function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function showSignaturePadNone() {
        signaturePad.startSignature('C3F72456', {rotation: signaturePad.Rotation.ROTATION_NONE}, function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function showSignaturePadPortrait() {
        signaturePad.startSignature('D3F72456', {rotation: signaturePad.Rotation.ROTATION_PORTRAIT}, function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function showSignaturePadLandscapeReverse() {
        signaturePad.startSignature('E3F72456', {rotation: signaturePad.Rotation.ROTATION_REVERSE_LANDSCAPE}, function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function showSignaturePadPortraitReverse() {
        signaturePad.startSignature('F3F72456', {rotation: signaturePad.Rotation.ROTATION_REVERSE_PORTRAIT}, function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function showSignaturePadTimeless() {
        signaturePad.startSignature('32465300', function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function closeSignaturePad() {
        signaturePad.startSignature('32465300', function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
        setTimeout(function () {
            signaturePad.close();
        }, 5000);
    }

    function showSignaturePadReSign3() {
        signaturePad.startSignature('42465300', {reSignTimes: 3}, function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function showSignaturePadReSignResetTimeout() {
        signaturePad.startSignature('52465300', {
            timeout: 100,
            reSignTimes: 3,
            isResetTimeout: true
        }, function (err, result) {
            if (err) {
                if (err.code === nymph.error.CANCELLED) {
                    argo.addLog('Signature pad cancelled.');
                } else {
                    argo.addLog('Show signature pad failed：' + JSON.stringify(err));
                }
            } else {
                printSignature(result);
            }
        });
    }

    function printSignature(result) {
        var actual = '<div><img src="data:image/png;base64,' + result.picBase64 + '" width="380" height="126"/></div>';
        var printInfo = {};
        try {
            printer.open();
        } catch (err) {
            console.log('open printer error：' + JSON.stringify(err));
            return;
        }
        printInfo = {
            htmlString: actual
        };
        printer.printHtml(printInfo, function (err) {
            printer.close();
            if (err) {
                console.log('Printing error:' + JSON.stringify(err));
            }
        });
    }

    return {
        showSignaturePadTimeout: showSignaturePadTimeout,
        showSignaturePadTimeless: showSignaturePadTimeless,
        showSignaturePadNone: showSignaturePadNone,
        showSignaturePadLandscape: showSignaturePadLandscape,
        showSignaturePadPortrait: showSignaturePadPortrait,
        showSignaturePadLandscapeReverse: showSignaturePadLandscapeReverse,
        showSignaturePadPortraitReverse: showSignaturePadPortraitReverse,
        showSignaturePadReSign3: showSignaturePadReSign3,
        showSignaturePadReSignResetTimeout: showSignaturePadReSignResetTimeout,
        closeSignaturePad: closeSignaturePad
    };
})();
