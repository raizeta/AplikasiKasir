/* jshint -W117 */
argo.hermesTestSerialPort = (function () {
    'use strict';

    var nymph = require('nymph'),
        serialPort = nymph.comm.serialPort,
        SerialPort = serialPort.SerialPort;
    var sp = new SerialPort(serialPort.PortName.USBD);

    function openUsb() {
        try {
            sp.open();
            argo.addLog('USB opened.')
        } catch (err) {
            argo.addLog('Failed to open USB: ' + JSON.stringify(err));
        }
    }

    function closeUsb() {
        try {
            sp.close();
            argo.addLog('USB closed.')
        } catch (err) {
            argo.addLog('Failed to close USB: ' + JSON.stringify(err));
        }
    }

    function sendDataToUsb() {
        try {
            var data = '01020304';
            sp.write(data, function (err) {
                if (err) {
                    argo.addLog('Failed to send data to USB:' + err.message)
                } else {
                    argo.addLog('data sent.');
                }
            });
        } catch (err) {
            argo.addLog('Failed to send data to USB: ' + err.message);
        }
    }

    function readDataFromUsb() {
        try {
            sp.read(100, function (err, data) {
                if (err) {
                    argo.addLog('Failed to read data from USB: ' +err.message);
                } else {
                    if (data) {
                        argo.addLog('Receive data from USB: ' + nymph.util.encoding.bufferToHexString(data));
                    } else {
                        argo.addLog('No data recieved.');
                    }
                }
            });
        } catch (err) {
            argo.addLog('Failed to read data from USB: ' +err.message);
        }
    }

    function sendDataToUsbTimeout() {
        try {
            var data = '01020304';
            sp.write(data, 10000, function (err) {
                if (err) {
                    argo.addLog('Failed to send data to USB:' + err.message)
                } else {
                    argo.addLog('data sent.');
                }
            });
        } catch (err) {
            argo.addLog('Failed to send data to USB: ' + err.message);
        }
    }

    function readDataFromUsbTimeout() {
        try {
            sp.read(100, 10000,function (err, data) {
                if (err) {
                    argo.addLog('Failed to read data from USB: ' +err.message);
                } else {
                    if (data) {
                        argo.addLog('Receive data from USB: ' + nymph.util.encoding.bufferToHexString(data));
                    } else {
                        argo.addLog('No data recieved.');
                    }
                }
            });
        } catch (err) {
            argo.addLog('Failed to read data from USB: ' +err.message);
        }
    }

    function flushUsb() {
        try {
            sp.flush();
            argo.addLog('USB flushed.');
        } catch (err) {
            argo.addLog('Failed to flush: ' +err.message);
        }
    }

    return {
        openUsb: openUsb,
        closeUsb: closeUsb,
        sendDataToUsb: sendDataToUsb,
        readDataFromUsb: readDataFromUsb,
        sendDataToUsbTimeout: sendDataToUsbTimeout,
        readDataFromUsbTimeout: readDataFromUsbTimeout,
        flushUsb: flushUsb
    };
})();
