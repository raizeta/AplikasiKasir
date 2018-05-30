angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
    

    $stateProvider.state('tab.refundtransaksi', 
    {
          url: "/refund/transaksi",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/refund/transaksi.html",
                  controller:'RefundTransaksiCtrl'
              }
          },
    });

    $stateProvider.state('tab.refundproduk', 
    {
          url: "/refund/produk",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/refund/product.html",
                  controller:'RefundProductCtrl'
              }
          },
    });
    
});
