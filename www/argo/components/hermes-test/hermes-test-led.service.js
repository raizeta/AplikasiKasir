/* jshint -W117 */
argo.hermesTestLed = (function () {
    'use strict';

    var nymph = require('nymph'),
        led = nymph.sys.led,
        isRedOn = false, isBlueOn = false, isGreenOn = false, isYellowOn = false;

    function turnOnAll() {
        led.on([led.Light.RED, led.Light.GREEN, led.Light.BLUE, led.Light.YELLOW]);
        isBlueOn = true;
        isGreenOn = true;
        isYellowOn = true;
        isRedOn = true;
    }

    function turnOffAll() {
        led.off([led.Light.RED, led.Light.GREEN, led.Light.BLUE, led.Light.YELLOW]);
        isBlueOn = false;
        isGreenOn = false;
        isYellowOn = false;
        isRedOn = false;
    }

    function operateRedLed() {
        if (isRedOn) {
            led.off([led.Light.RED]);
            isRedOn = false;
        } else {
            led.on([led.Light.RED]);
            isRedOn = true;
        }
    }

    function operateGreenLed() {
        if (isGreenOn) {
            led.off([led.Light.GREEN]);
            isGreenOn = false;
        } else {
            led.on([led.Light.GREEN]);
            isGreenOn = true;
        }
    }

    function operateYellowLed() {
        if (isYellowOn) {
            led.off([led.Light.YELLOW]);
            isYellowOn = false;
        } else {
            led.on([led.Light.YELLOW]);
            isYellowOn = true;
        }
    }

    function operateBlueLed() {
        if (isBlueOn) {
            led.off([led.Light.BLUE]);
            isBlueOn = false;
        } else {
            led.on([led.Light.BLUE]);
            isBlueOn = true;
        }
    }

    function operateBlueRedLed() {
        led.off([led.Light.RED, led.Light.GREEN, led.Light.BLUE, led.Light.YELLOW]);
        led.on([led.Light.RED, led.Light.BLUE]);
        isBlueOn = true;
        isGreenOn = false;
        isYellowOn = false;
        isRedOn = true;
    }


    return {
        turnOnAll: turnOnAll,
        turnOffAll: turnOffAll,
        operateRedLed: operateRedLed,
        operateGreenLed: operateGreenLed,
        operateYellowLed: operateYellowLed,
        operateBlueLed: operateBlueLed,
        operateBlueRedLed: operateBlueRedLed
    };
})();
