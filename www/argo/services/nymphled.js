angular.module('starter')
.service('NymphLedService', function()
{
    var nymph   = require('nymph');
    var led     = nymph.sys.led;
    var isRedOn = false, isBlueOn = false, isGreenOn = false, isYellowOn = false;

    var turnOnAll = function ()
    {
        led.on([led.Light.RED, led.Light.GREEN, led.Light.BLUE, led.Light.YELLOW]);
        isBlueOn = true;
        isGreenOn = true;
        isYellowOn = true;
        isRedOn = true;
    }

    var turnOffAll = function()
    {
        led.off([led.Light.RED, led.Light.GREEN, led.Light.BLUE, led.Light.YELLOW]);
        isBlueOn = false;
        isGreenOn = false;
        isYellowOn = false;
        isRedOn = false;
    }

    var operateRedLed   = function()
    {
        if (isRedOn)
        {
            led.off([led.Light.RED]);
            isRedOn = false;
        }
        else
        {
            led.on([led.Light.RED]);
            isRedOn = true;
        }
    }

    var operateGreenLed     = function()
    {
        if (isGreenOn)
        {
            led.off([led.Light.GREEN]);
            isGreenOn = false;
        }
        else
        {
            led.on([led.Light.GREEN]);
            isGreenOn = true;
        }
    }

    var operateYellowLed    = function()
    {
        if (isYellowOn)
        {
            led.off([led.Light.YELLOW]);
            isYellowOn = false;
        }
        else
        {
            led.on([led.Light.YELLOW]);
            isYellowOn = true;
        }
    }

    var operateBlueLed  = function()
    {
        if (isBlueOn)
        {
            led.off([led.Light.BLUE]);
            isBlueOn = false;
        }
        else
        {
            led.on([led.Light.BLUE]);
            isBlueOn = true;
        }
    }

    var operateBlueRedLed   = function()
    {
        led.off([led.Light.RED, led.Light.GREEN, led.Light.BLUE, led.Light.YELLOW]);
        led.on([led.Light.RED, led.Light.BLUE]);
        isBlueOn = true;
        isGreenOn = false;
        isYellowOn = false;
        isRedOn = true;
    }


    var operateOnlineLed  = function()
    {

        led.on([led.Light.BLUE]);
        led.off([led.Light.RED]);
        isBlueOn = true;
        isRedOn = false;
    }

    var operateOfflineLed  = function()
    {

        led.off([led.Light.BLUE]);
        led.on([led.Light.RED]);
        isBlueOn = false;
        isRedOn = true;
    }


    return {
      turnOnAll: turnOnAll,
      turnOffAll: turnOffAll,
      operateRedLed: operateRedLed,
      operateGreenLed: operateGreenLed,
      operateYellowLed: operateYellowLed,
      operateBlueLed: operateBlueLed,
      operateBlueRedLed: operateBlueRedLed,
      operateOnlineLed:operateOnlineLed,
      operateOfflineLed:operateOfflineLed
    };
});