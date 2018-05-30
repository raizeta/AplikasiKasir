angular.module('starter')
.service('UtilService', ['$window', '$q', '$http', '$filter', 'StorageService', function($window,$q,$http,$filter,StorageService) 
{
    var ApiUrl = function()
    {
      // return "http://labtest.kontrolgampang.com/";
      return "http://production.kontrolgampang.com/";
    }
    
    var DeleteKeyFromArrayObject = function(array,keytodelete)
    {
        angular.forEach(array,function(value,key)
        {
            delete value[keytodelete];
        })
        return array;
    }
    var ArrayChunk = function (arr, size) 
    {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) 
      {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    }

    var SerializeObject = function (objecttoserialize) 
    {
        var resultobjecttoserialize = {};
        function serializeObj(obj) 
        {
            // var result = [];
            // for (var property in obj) 
            // {
            //   result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
            // }
            // return result.join("&");

            var str = [];
            for (var key in obj) 
            {
                if (obj[key] instanceof Array) 
                {
                    for(var idx in obj[key])
                    {
                        var subObj = obj[key][idx];
                        for(var subKey in subObj)
                        {
                            str.push(encodeURIComponent(key) + "[" + idx + "][" + encodeURIComponent(subKey) + "]=" + encodeURIComponent(subObj[subKey]));
                        }
                    }
                }
                else 
                {
                    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
                }
            }
            return str.join("&");
        }
        
        var serialized = serializeObj(objecttoserialize); 
        var config = 
        {
            headers : 
            {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;application/json;charset=utf-8;'   
            }
        };
        resultobjecttoserialize.serialized   = serialized;
        resultobjecttoserialize.config       = config;

        return resultobjecttoserialize;
    }
    
    var SumPriceQtyWithCondition = function(items,price,qty,condition)
    {
        return items.reduce( function(a, b)
        {
            if(b[condition] == true)
            {
              if(b[price] == undefined || b[qty] == undefined)
              {
                  return a + 0;
              }
              else
              {
                  return a + (b[price] * b[qty]);
              }
            }
            else
            {
                return a + 0;
            }
            
        }, 0);
    }

    var SumPriceWithQty = function(items,price,qty)
    {
        return items.reduce( function(a, b)
        {
            if(b[price] == undefined || b[qty] == undefined)
            {
                return a + 0;
            }
            else
            {
                return a + (b[price] * b[qty]);
            }
        }, 0);
    }

    var SumPriceWithQtyWithPPN = function(items,price,qty,ppn)
    {
        return items.reduce( function(a,b)
        {
            if(b[price] == undefined || b[qty] == undefined)
            {
                return a + 0;
            }
            else
            {
                return a + (b[price] * b[qty]) + (b[price] * b[qty] * b[ppn] / 100);
            }
        }, 0);
    }

    var SumJustPriceOrQty = function(items, price)
    {
        return items.reduce( function(a, b)
        {
            if(b[price] == undefined)
            {
                return a + 0;
            }
            else
            {
                return a + b[price];
            }
        }, 0);
    }

    var JarakDuaTitik = function(longitude1,latitude1,longitude2,latitude2)
    {
        var thetalong      = (longitude1 - longitude2)*(Math.PI / 180); 
        var thetalat       = (latitude1 - latitude2)*(Math.PI / 180);
        var a = 0.5 - Math.cos(thetalat)/2 + Math.cos(latitude1 * Math.PI / 180) * Math.cos(latitude2 * Math.PI / 180) * (1 - Math.cos(thetalong))/2;
        var jarak = 12742 * Math.asin(Math.sqrt(a)) * 1000;
        return jarak;
    }

    var getTotalHariDalamSebulan = function(tanggalplan)
    {
      var date    = new Date(tanggalplan);
      var year    = date.getFullYear();
      var month   = date.getMonth() + 1;
      return new Date(year,month,0).getDate(); 
    }

    var SqliteToArray = function(sqliteresult)
    {
    	var panjang = sqliteresult.rows.length;
    	var response = [];
  		for(var i=0; i < panjang; i++)
  		{
  			response.push(sqliteresult.rows.item(i));
  		}
		  return response;
    }

    var SetGambarCheckinCheckout = function(dataagenda)
    {
        var datadariagenda = dataagenda;
        var databaru = [];
        angular.forEach(datadariagenda, function(value, key) 
        {
            if(value.CHECKIN_TIME)
            {
               if(value.CHECKOUT_TIME)
               {
                  value.imagecheckout = "asset/admin/dist/img/customer.jpg";
                  value.STSCHECK_IN   = 1;
                  value.STSCHECK_OUT  = 1;
               }
               else
               {
                  value.imagecheckout = "asset/admin/dist/img/customerlogo.jpg";
                  value.STSCHECK_IN   = 1;
                  value.STSCHECK_OUT  = 0;
               }
            }
            else
            {
               if(value.CHECKOUT_TIME)
               {
                  value.imagecheckout = "asset/admin/dist/img/customer.jpg";
                  value.STSCHECK_IN   = 1;
                  value.STSCHECK_OUT  = 1;
               }
               else
               {
                  value.imagecheckout = "asset/admin/dist/img/normal.jpg";
                  value.STSCHECK_IN   = 0;
                  value.STSCHECK_OUT  = 0;
               }
            }
            databaru.push(value);
        });
        return databaru;
    }

    var DiffTwoDateTime = function(datetime1,datetime2) 
    {
        var duration = Math.abs( new Date(datetime1) - new Date(datetime2) );
        var milliseconds = parseInt((duration%1000)/100)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    var StringPad   = function(stringtopad,pad) 
    {
        var stringtopad = "" + stringtopad;
        var ans = pad.substring(0, pad.length - stringtopad.length) + stringtopad;
        return ans;
    };

    var CameraOptions = function()
    {
        
        var options = {};
        options.quality             = 50;
        options.destinationType     = Camera.DestinationType.DATA_URL;
        options.sourceType          = Camera.PictureSourceType.CAMERA;
        options.allowEdit           = false;
        options.encodingType        = Camera.EncodingType.JPEG;
        options.targetWidth         = 500;
        options.targetHeight        = 500;
        options.popoverOptions      = CameraPopoverOptions;
        options.saveToPhotoAlbum    = false;
        options.correctOrientation  = true;
        return options;
    }

    var PembayaranFunc = function(totalpembayaran)
    {
        var yangdibayarkan      = [{'yangdibayar':totalpembayaran}]
        var berapakalidibagi1   = Math.floor(totalpembayaran / 1000);
        var berapakalidibagi2   = Math.floor(totalpembayaran / 2000);
        var berapakalidibagi3   = Math.floor(totalpembayaran / 5000);

        var sisabagi1           = Math.floor(totalpembayaran % 1000);
        var sisabagi2           = Math.floor(totalpembayaran % 2000);
        var sisabagi3           = Math.floor(totalpembayaran % 5000);

        var hasilbagi1          = (berapakalidibagi1 + 1) * 1000;
        var hasilbagi2          = (berapakalidibagi2 + 1) * 2000;
        var hasilbagi3          = (berapakalidibagi3 + 1) * 5000;

        var indexhasilbagi1         = _.findIndex(yangdibayarkan,{'yangdibayar':hasilbagi1});
        
    
        if(indexhasilbagi1 == -1)
        {
            yangdibayarkan.push({'yangdibayar': hasilbagi1});    
        }
        var indexhasilbagi2         = _.findIndex(yangdibayarkan,{'yangdibayar':hasilbagi2});
        if(indexhasilbagi2 == -1)
        {
            yangdibayarkan.push({'yangdibayar': hasilbagi2});    
        }
        var indexhasilbagi3         = _.findIndex(yangdibayarkan,{'yangdibayar':hasilbagi3});
        if(indexhasilbagi3 == -1)
        {
            yangdibayarkan.push({'yangdibayar': hasilbagi3});    
        }
        return yangdibayarkan;
    }

    var GenerateNomorTransaksi  = function(responselite,parameters)
    {
        var nomortransaksiyangaktif = StorageService.get('nomortransaksiyangaktif');
        if(nomortransaksiyangaktif)
        {
            var tgl       = nomortransaksiyangaktif.split('.')[4];
            var tglaktif  = tgl.substring(0,6);
            var tglskrng  = $filter('date')(new Date(),'yyMMdd');
            if(tglskrng == tglaktif)
            {
              return nomortransaksiyangaktif  
            }
            else
            {
                nomortransaksiyangaktif          = parameters.STORE_ID +'.'+ parameters.ACCESS_ID + '.' + parameters.UUID +'.' + $filter('date')(new Date(),'yyMMddHHmmss'); 
                StorageService.set('nomortransaksiyangaktif',nomortransaksiyangaktif);
                return nomortransaksiyangaktif; 
            }
          
        }
        else
        {
            nomortransaksiyangaktif          = parameters.STORE_ID +'.'+ parameters.ACCESS_ID + '.' + parameters.UUID +'.' + $filter('date')(new Date(),'yyMMddHHmmss'); 
            StorageService.set('nomortransaksiyangaktif',nomortransaksiyangaktif);
            return nomortransaksiyangaktif;
        }
        
    }

    var GenerateNomorTransaksiRefund  = function(parameters)
    {
        var nomortransaksiyangaktif          = parameters.STORE_ID +'.'+ parameters.ACCESS_ID + '.' + parameters.UUID +'.' + $filter('date')(new Date(),'yyMMddHHmmss'); 
        return nomortransaksiyangaktif;
    }

    var CheckScreenSize = function(screen)
    {
        var screenbesar = null;
        if(screen)
        {
          if(screen.width > 760)
          {
              screenbesar = true;
          }
          else
          {
              screenbesar = false;
          }
        }
        else
        {
          if($window.screen.width > 760)
          {
              screenbesar = true;
          }
          else
          {
            screenbesar = false;
          }
        }
        return screenbesar
    }

    var RenameKeyObject = function(objectresources,keyobjecttorename)
    {
        var b = {};
        _.each(objectresources, function(value, key) 
        {
            key     = keyobjecttorename[key] || key;
            b[key]  = value;
        });
        return b;
    }

    var GetParameters = function()
    {
        var profileadvanc       = StorageService.get('advanced-profile');
        var parameters          = StorageService.get('basic-parameters');
        
        if(parameters)
        {
            parameters.TGL_SAVE     = $filter('date')(new Date(),'yyyy-MM-dd');
            parameters.STORE_ID     = profileadvanc.STORES_ACTIVE.STORE_ID;
            parameters.STORE_NM     = profileadvanc.STORES_ACTIVE.STORE_NM;  
        }        
        return parameters;
    }

    var GetCoinsPembayaran = function()
    {
        var koins = [
                          {'nominal':100,'alias':'100','jumlah':0,'background':'#f44336'},
                          {'nominal':200,'alias':'200','jumlah':0,'background':'#514099'},
                          {'nominal':500,'alias':'500','jumlah':0,'background':'#33cd5f'},
                          {'nominal':1000,'alias':'1K','jumlah':0,'background':'#886aea'},
                          {'nominal':2000,'alias':'2K','jumlah':0,'background':'#444'},
                          {'nominal':5000,'alias':'5K','jumlah':0,'background':'#444'},
                          {'nominal':10000,'alias':'10K','jumlah':0,'background':'#f44336'},
                          {'nominal':20000,'alias':'20K','jumlah':0,'background':'#514099'},
                          {'nominal':50000,'alias':'50K','jumlah':0,'background':'#33cd5f'},
                          {'nominal':100000,'alias':'100K','jumlah':0,'background':'#886aea'}
                       ]
        return koins;
    }

    var SwitchStatus = function(valuestatus)
    {
        var resultstatus = 1;
        if(valuestatus == 'Deleted')
        {
          resultstatus = 3;
        }
        else if(valuestatus == 'Deactive' || valuestatus == 'Disable')
        {
          resultstatus = 0;
        }
        return resultstatus;
    }

    var CheckProperyObjectNullOrNotNull = function(object)
    {
        var result = false;
        angular.forEach(object,function(value,key)
        {
            if (value === null || value === "" || value == 0)
            {
              result = true; // Object  Memiliki Property Yang Kosong;
            }
        })
        return result;
    }

    var TwoArrayAsOneObject = function(datatoconvert)
    {
        var arraylabel        = datatoconvert.label;
        var arrayqty          = datatoconvert.value;
        var result = [];
        angular.forEach(arraylabel,function(value,key)
        {
            var newobject     = {};
            newobject.label   = value;
            newobject.value   = Number(arrayqty[key]);
            result.push(newobject);
        });
        return result;
    }

    var CheckModalExistOrNot = function(datamodal)
    {
        if(datamodal)
        {
            if(!datamodal._isShown)
            {
                return true;
            }
            else
            {
                return false;
            }  
        }
        else
        {
            return true
        }
    }

    var MakeUnflatterArray  = function(arraytoconvert,keyparent)
    {
        var parents = [];
        angular.forEach(arraytoconvert,function(value,key)
        {
            var index = _.findIndex(parents,{'dataparent':value[keyparent]});
            if(index < 0)
            {
                parent = {};
                parent.dataparent   = value.TGL;
                parent.datachildren = [];
                parent.datachildren.push(value);
                parents.push(parent);
            }
            else
            {
                parents[index].datachildren.push(value);
            }
            
        });
        return parents;
    }

    var CheckTypePembelian = function(datapembelian)
    {
        var result = null
        if(datapembelian.KELOMPOK == 'PAKET INTERNET' || datapembelian.KELOMPOK == 'PULSA REGULER')
        {
            result = 'PULSA';  
        }
        else if(datapembelian.KELOMPOK == 'PASCABAYAR')
        {
            result = 'PASCABAYAR';
        }
        else if(datapembelian.KELOMPOK == 'GAME ONLINE')
        {
            result = 'GAMEONLINE';
        }
        else if(datapembelian.KELOMPOK == 'PLN PREPAID')
        {
            result = 'PLNPREPAID';
        }
        else if(datapembelian.KELOMPOK == 'TV VOUCHER')
        {
            result = 'TVVOUCHER';
        }
        else
        {
            result = false;
        }

        return result
    }

    return {
      ArrayChunk:ArrayChunk,
      ApiUrl:ApiUrl,
      DeleteKeyFromArrayObject:DeleteKeyFromArrayObject,
      SumPriceQtyWithCondition:SumPriceQtyWithCondition,
      SerializeObject:SerializeObject,
      SumPriceWithQty:SumPriceWithQty,
      SumPriceWithQtyWithPPN:SumPriceWithQtyWithPPN,
      SumJustPriceOrQty:SumJustPriceOrQty,
      JarakDuaTitik:JarakDuaTitik,
      getTotalHariDalamSebulan:getTotalHariDalamSebulan,
      SqliteToArray:SqliteToArray,
      SetGambarCheckinCheckout:SetGambarCheckinCheckout,
      DiffTwoDateTime:DiffTwoDateTime,
      StringPad:StringPad,
      CameraOptions:CameraOptions,
      PembayaranFunc:PembayaranFunc,
      GenerateNomorTransaksi:GenerateNomorTransaksi,
      GenerateNomorTransaksiRefund:GenerateNomorTransaksiRefund,
      CheckScreenSize:CheckScreenSize,
      RenameKeyObject:RenameKeyObject,
      GetParameters:GetParameters,
      GetCoinsPembayaran:GetCoinsPembayaran,
      SwitchStatus:SwitchStatus,
      CheckProperyObjectNullOrNotNull:CheckProperyObjectNullOrNotNull,
      TwoArrayAsOneObject:TwoArrayAsOneObject,
      CheckModalExistOrNot:CheckModalExistOrNot,
      MakeUnflatterArray:MakeUnflatterArray,
      CheckTypePembelian:CheckTypePembelian
    };
}]);