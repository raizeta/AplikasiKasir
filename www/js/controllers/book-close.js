angular.module('starter')
.controller('CloseBookCtrl',['$ionicHistory','ToastService','OpenCloseBookCombFac','OpenCloseBookLiteFac','SummaryLiteFac','UtilService','ConstructorService','StorageService','$cordovaDialogs','$filter','$ionicLoading','$ionicHistory','$ionicModal','$timeout','$scope','$state',
function($ionicHistory,ToastService,OpenCloseBookCombFac,OpenCloseBookLiteFac,SummaryLiteFac,UtilService,ConstructorService,StorageService,$cordovaDialogs,$filter,$ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state)
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        if($ionicHistory.forwardView())
        {
            $scope.viewtoshow  = {valuechoose:'HISTORY'};   
        }
        else
        {
            $scope.viewtoshow  = {valuechoose:'TUTUPBUKU'};    
        }
        
        $scope.screenbesar = UtilService.CheckScreenSize();
        window.addEventListener("orientationchange", function() 
        {
            $scope.screenbesar = UtilService.CheckScreenSize(screen);
            $scope.$apply();
        }, false);
                     
        $scope.profileops     = StorageService.get('advanced-profile');
        var parameters        = UtilService.GetParameters();
        
        parameters.STATUS     = 1;
        OpenCloseBookLiteFac.GetOpenCloseBookWithStatus(parameters)
        .then(function(responseclosebook)
        {
            $scope.listclosebook = responseclosebook;
        })
        .then(function()
        {
            parameters.STATUS     = 2;
            OpenCloseBookLiteFac.GetOpenCloseBookWithStatus(parameters)
            .then(function(responseclosebook)
            {
                if(responseclosebook.length > 0)
                {
                    $scope.belumopen        = false;
                    $scope.dataclosebook    = angular.copy(responseclosebook[responseclosebook.length - 1]);
                    parameters.STATUS       = 1;
                    SummaryLiteFac.SumTransHeaderCompletePerShift(parameters)
                    .then(function(response)
                    {
                        console.log(response);
                        if(angular.isArray(response) && response.length > 0)
                        {
                            
                            $scope.dataclosebook.SELLCASH       += response[0].TOTALPENJUALAN;
                            $scope.dataclosebook.TOTALDONASI    += response[0].TOTALDONASI;
                            if(response.length > 1)
                            {
                                $scope.dataclosebook.TOTALREFUND    += response[1].TOTALPENJUALAN;
                            }
                            else
                            {
                                $scope.dataclosebook.TOTALREFUND    += 0;
                            }   
                        }
                        $scope.dataclosebook.PEMASUKAN          = Number($scope.dataclosebook.SELLCASH) + Number($scope.dataclosebook.ADDCASH) + Number($scope.dataclosebook.CASHINDRAWER) + Number($scope.dataclosebook.TOTALDONASI);
                        $scope.dataclosebook.TOTALCASH          = Number($scope.dataclosebook.PEMASUKAN) - Number($scope.dataclosebook.TOTALREFUND);
                        $scope.dataclosebook.TOTALCASH_ACTUAL   = $scope.dataclosebook.TOTALCASH;
                        $scope.dataclosebook.TGL_CLOSE          = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                        $scope.dataclosebook.STATUS             = 1;
                        $scope.dataclosebook.IS_ONSERVER        = 0;
                    });    
                }
                else
                {
                    $scope.belumopen  = true;
                    ToastService.ShowToast('Nothing To Close.Kamu Harus Melakukan Open Book Terlebih Dahulu','success');
                }
            },
            function(error)
            {
                console.log(error);
            });
        },
        function(error)
        {
            console.log(error);
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });
    });

    $scope.submitclosebook = function()
    {
        $cordovaDialogs.confirm('Apakah Kamu Yakin Akan Melakukan Tutup Buku?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $ionicLoading.show
                ({
                    noBackdrop:false,
                    hideOnStateChange:true,
                    template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
                });

                OpenCloseBookLiteFac.UpdateOpenCloseBook($scope.dataclosebook)
                .then(function(responseclosebook)
                {
                    $scope.listclosebook.unshift($scope.dataclosebook);
                    $scope.sudahclose = true;
                    $cordovaDialogs.alert("Close Book Sukses.")  
                })
                .then(function()
                {
                    // var printtemplate = TemplatePrintService.PrintCloseBookTemplate($scope.dataclosebook,$scope.profileops);
                    // NymphPrinterService.printReceipt(printtemplate);
                },
                function(error)
                {
                    console.log(error);
                })
                .finally(function()
                {
                    $ionicLoading.hide();
                });

                OpenCloseBookLiteFac.GetSetoranBookByOpenCloseID($scope.dataclosebook)
                .then(function(responsegetbyid)
                {
                    if(responsegetbyid.length > 0)
                    {
                        var setoran = ConstructorService.SetoranConstructor($scope.dataclosebook);
                        OpenCloseBookLiteFac.UpdateSetoranBook(setoran)
                        .then(function(responsecreatesetoran)
                        {
                            console.log(responsecreatesetoran);
                        },
                        function(error)
                        {
                            console.log(error);
                        });
                    }
                    else
                    {
                        var setoran = ConstructorService.SetoranConstructor($scope.dataclosebook);
                        OpenCloseBookLiteFac.CreateSetoranBook(setoran)
                        .then(function(responsecreatesetoran)
                        {
                            setoran.ID_LOCAL = responsecreatesetoran.ID_LOCAL;
                            console.log(responsecreatesetoran);
                        },
                        function(error)
                        {
                            console.log(error);
                        });
                    }   
                });
            }
        });
        
    }
}])

.controller('CloseBookDetailCtrl',['$ionicLoading','OpenCloseBookLiteFac','$stateParams','$scope','StorageService',
function($ionicLoading,OpenCloseBookLiteFac,$stateParams,$scope,StorageService)
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        OpenCloseBookLiteFac.GetOpenCloseBookByOpenCloseID($stateParams.closebook_id)
        .then(function(response)
        {
            $scope.dataclosebook            = response[0];
            $scope.dataclosebook.PEMASUKAN  = Number($scope.dataclosebook.SELLCASH) + Number($scope.dataclosebook.ADDCASH) + Number($scope.dataclosebook.CASHINDRAWER) + Number($scope.dataclosebook.TOTALDONASI);
            $scope.dataclosebook.TOTALCASH  = Number($scope.dataclosebook.PEMASUKAN) - Number($scope.dataclosebook.TOTALREFUND);
        })
    });

    $scope.printclosebookhistory = function()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            duration:500,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });
        // var printtemplate = TemplatePrintService.PrintCloseBookTemplate($scope.dataclosebook,$scope.profileops);
        // NymphPrinterService.printReceipt(printtemplate);

    }

}])
