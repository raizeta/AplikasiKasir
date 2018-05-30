angular.module('starter')
.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) 
{
    $stateProvider.state('tab.accounting-summary', 
    {
          url: "/accounting-summary",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/accounting/summary.html",
                  controller:'AccountingSummaryCtrl'
              }
          },
    });

    $stateProvider.state('tab.accounting-transaksi', 
    {
          url: "/accounting-transaksi",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/accounting/transaksi.html",
                  controller:'AccountingTransaksiCtrl'
              }
          },
    });

    $stateProvider.state('tab.accounting-refund', 
    {
          url: "/accounting-refund",
          views: 
          {
              'view-content': 
              {
                  templateUrl: "templates/accounting/refund.html",
                  controller:'AccountingRefundCtrl'
              }
          },
    });
    
});
