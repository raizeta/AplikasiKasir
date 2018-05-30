angular.module('starter')
.filter('split', function() 
{
    return function(input, splitChar, splitIndex) 
    {
        // do some bounds checking here to ensure it has that index
        return input.split(splitChar)[splitIndex];
    }
})

.filter('sumByKey', function() 
{
    return function(data, key) 
    {
        if (typeof(data) === 'undefined' || typeof(key) === 'undefined') 
        {
            return 0;
        }

        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) 
        {
            sum += Number(data[i][key]);
        }

        return sum;
    };
})

.filter('sumArray', function() 
{
    return function(data) 
    {
        if (typeof(data) === 'undefined') 
        {
            return 0;
        }
        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) 
        {
            sum += Number(data[i]);
        }

        return sum;
    };
})

.filter('ktoNumber', ['$filter', function($filter) 
{

  var numberFilter = $filter('number');

  var dict = 
  {
    k: 1000,
    l: 100000
  };

  var regex = /^([-+]?[0-9]*\.?[0-9]+)([kl])$/;

  return function(val, fraction) 
  {
    var match;
    if(angular.isString(val) && (match = val.match(regex)) ) 
    {
      val = match[1] * dict[match[2]];
    }

    return val;

  };
}])

.filter("nrFormat", function() 
{
    return function(number) 
    {
        if (typeof(number) === 'undefined') 
        {
            return 0;
        }

        var abs;
        if (number !== void 0) 
        {
          abs = Math.abs(number);
          if (abs >= Math.pow(10, 12)) 
          {
            number = (number / Math.pow(10, 12)).toFixed(1) + " t";
          } 
          else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) 
          {
            number = (number / Math.pow(10, 9)).toFixed(1) + " b";
          } 
          else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) 
          {
            number = (number / Math.pow(10, 6)).toFixed(1) + " Juta";
          } 
          else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) 
          {
            number = (number / Math.pow(10, 3)).toFixed(1) + " Ribu";
          }
          return number;
        }
    };
});