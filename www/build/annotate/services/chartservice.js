angular.module('starter')
.service('ChartService',['$window', function($window)
{
    var GetPieChartOptions = function()
    {
      var headerchart = {
                            type: 'pieChart',
                            height: 350,
                            x: function(d){return d.label;},
                            y: function(d){return d.value;},
                            showLabels: true,
                            duration: 500,
                            labelThreshold: 0.01,
                            labelSunbeamLayout: true,
                            labelType:'value',
                            donut:false,
                            valueFormat: function(d){return d3.format(',.0f')(d);},
                        }
      return headerchart;
    }

    var GetBarHorizontalOptions = function()
    {
        var headerchart = {
                          type: 'multiBarHorizontalChart',
                          height: 350,
                          x: function(d){return d.label;},
                          y: function(d){return d.value;},
                          showControls: true,
                          showValues: true,
                          valueFormat: function(d){return d3.format(',.0f')(d);},
                          duration: 500,
                          xAxis: {
                              showMaxMin: false
                          },

                          yAxis: {
                              axisLabel: 'Qty',
                              tickValues:'',
                              tickFormat: function(d)
                              {
                                  return d3.format(',.0f')(d);
                              }
                          }
                      }
        return headerchart;
    }

    var GetBarVerticalOptions  = function()
    {
        var options = {
                chart: {
                    type: 'discreteBarChart',
                    height: 350,
                    width:null,
                    margin:{left:0},
                  
                    x: function(d){return d.label;},
                    y: function(d){return d.value ;},
                    showValues: true,
                    valueFormat: function(d){
                        return d3.format(',.0f')(d);
                    },
                    duration: 500,
                    xAxis: {
                        axisLabel: 'Produk',
                        valueFormat: function(d){
                        return d3.format(',.0f')(d);
                    },
                    },
                    showYAxis:false,
                }
            };
        return options;
    }

    var GetDummyData = function()
    {
        var data = 
        [
          {
              jumlahtransaksiyangdibayarkanmelalui: [
                  {
                      "label" : "TUNAI" ,
                      "value" : 32
                  } ,
                  {
                      "label" : "KARTU DEBIT" ,
                      "value" : 100
                  } ,
                  {
                      "label" : "KARTU KREDIT" ,
                      "value" : 120
                  } 
              ]
          },
          {
              totalrupiahtransaksiyangdibayarkanmelalui: [
                  {
                      "label" : "TUNAI" ,
                      "value" : 12000000
                  } ,
                  {
                      "label" : "KARTU DEBIT" ,
                      "value" : 30000000
                  } ,
                  {
                      "label" : "KARTU KREDIT" ,
                      "value" : 5000000
                  } 
              ]
          },
          {
              top5quantityprodukyangterjual: [
                  {
                      "label" : "Product A" ,
                      "value" : 10
                  } ,
                  {
                      "label" : "Product B" ,
                      "value" : 50
                  } ,
                  {
                      "label" : "Product C" ,
                      "value" : 100
                  },
                  {
                      "label" : "Product D" ,
                      "value" : 200
                  },
                  {
                      "label" : "Product E" ,
                      "value" : 500
                  } 
              ]
          },
          {
              top5quantitykalihargaproduct: [
                  {
                      "label" : "Product A" ,
                      "value" : 10000
                  } ,
                  {
                      "label" : "Product B" ,
                      "value" : 50000
                  } ,
                  {
                      "label" : "Product C" ,
                      "value" : 100000
                  },
                  {
                      "label" : "Product D" ,
                      "value" : 200000
                  },
                  {
                      "label" : "Product E" ,
                      "value" : 500000
                  } 
              ]
          },
          {
              daylyproductyangterjual: [
                  {
                      "namaproduct" : "Product A" ,
                      "qty_product" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product B" ,
                      "qty_product" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product C" ,
                      "qty_product" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product D" ,
                      "qty_product" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product E" ,
                      "qty_product" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product F" ,
                      "qty_product" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  } 
              ]
          },
          {
              sisastockdaylyberjalan: [
                  {
                      "namaproduct" : "Product A" ,
                      "sisa_stock" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product B" ,
                      "sisa_stock" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product C" ,
                      "sisa_stock" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product D" ,
                      "sisa_stock" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product E" ,
                      "sisa_stock" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  },
                  {
                      "namaproduct" : "Product F" ,
                      "sisa_stock" : 10,
                      "harga_product" : 10000,
                      "sub_total" : 10 * 10000
                  } 
              ]
          }
        ]

        return data;
    }
   return {
      GetPieChartOptions:GetPieChartOptions,
      GetBarHorizontalOptions:GetBarHorizontalOptions,
      GetBarVerticalOptions:GetBarVerticalOptions,
      GetDummyData:GetDummyData
   }
}]);