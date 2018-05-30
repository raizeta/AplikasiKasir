angular.module('starter')
.controller('OpenBookCtrl',['ToastService','OpenCloseBookCombFac','OpenCloseBookLiteFac','UtilService','ConstructorService','StorageService','$cordovaDialogs','$filter','$ionicLoading','$ionicHistory','$timeout','$scope','$state','$location', 
function(ToastService,OpenCloseBookCombFac,OpenCloseBookLiteFac,UtilService,ConstructorService,StorageService,$cordovaDialogs,$filter,$ionicLoading,$ionicHistory,$timeout,$scope,$state,$location) 
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        $scope.screenbesar = UtilService.CheckScreenSize();
        window.addEventListener("orientationchange", function() 
        {
            $scope.screenbesar = UtilService.CheckScreenSize(screen);
            $scope.$apply();
        }, false);

        var parameters      = UtilService.GetParameters();
        $scope.profileops   = StorageService.get('advanced-profile');
        console.log($scope.profileops);
        OpenCloseBookCombFac.GetOpenCloseBook(parameters)
        .then(function(responseopenbook)
        {
            if(responseopenbook.length == 0)
            {
                $scope.openbookdata                     = ConstructorService.OpenCloseBookConstructor();
                $scope.openbookdata.OPENCLOSE_ID        = parameters.STORE_ID + '.' + $filter('date')(new Date(),'yyMMddHHmmss');
                $scope.openbookdata.SPLIT_OPENCLOSE_ID  = $scope.openbookdata.OPENCLOSE_ID.split('.')[2];
                $scope.openbookdata.TGL_INPUT           = $filter('date')(new Date(),'yyyy-MM-dd');
                $scope.openbookdata.NM_DEPAN            = $scope.profileops.PROFILE.NM_DEPAN;    
            }
            else
            {
                parameters.STATUS = 2;
                OpenCloseBookLiteFac.GetOpenCloseBookWithStatus(parameters)
                .then(function(responsehasopenclosebook)
                {
                    if(angular.isArray(responsehasopenclosebook) && responsehasopenclosebook.length > 0)
                    {
                        $scope.openbookdata             = responsehasopenclosebook[responsehasopenclosebook.length-1];
                        $scope.openbookdata.TGL_INPUT   = $filter('date')(new Date(),'yyyy-MM-dd');
                        $scope.openbookdata.NM_DEPAN    = $scope.profileops.PROFILE.NM_DEPAN;
                        $scope.sudahopen                = true;
                        var parameters                  = UtilService.GetParameters();
                        parameters.OPENCLOSE_ID         = $scope.openbookdata.OPENCLOSE_ID;
                        StorageService.set('basic-parameters',parameters);

                        ToastService.ShowToast('Kamu Sudah Melakukan Buka Buka.Fitur Dapat Anda Akses Kembali Setelah Melakukan Tutup Buku.','success');
                    }
                    else
                    {
                        $scope.openbookdata                     = ConstructorService.OpenCloseBookConstructor();
                        var parameters                          = UtilService.GetParameters();
                        $scope.openbookdata.OPENCLOSE_ID        = parameters.STORE_ID + '.' + $filter('date')(new Date(),'yyMMddHHmmss');
                        $scope.openbookdata.SPLIT_OPENCLOSE_ID  = $scope.openbookdata.OPENCLOSE_ID.split('.')[2];
                        $scope.openbookdata.TGL_INPUT           = $filter('date')(new Date(),'yyyy-MM-dd');
                        $scope.openbookdata.NM_DEPAN            = $scope.profileops.PROFILE.NM_DEPAN;
                    }
                },
                function(error)
                {
                    console.log(error);
                });  
            }
        },
        function(error)
        {
            console.log(error);
        });
    });

    $scope.openbooksubmit = function()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        OpenCloseBookLiteFac.CreateOpenCloseBook($scope.openbookdata)
        .then(function(responseopenclosebook)
        {
            $scope.openbookdata.ID_LOCAL    = responseopenclosebook.ID_LOCAL;
            $scope.sudahopen                = true;
            $cordovaDialogs.alert("Open Book Sukses");
        },
        function(error)
        {
            console.log(error);
        })
        .finally(function()
        {
            $ionicLoading.hide();
        }); 
    }
}])
.controller('CloseBookCtrl',['ToastService','OpenCloseBookCombFac','OpenCloseBookLiteFac','SummaryLiteFac','UtilService','ConstructorService','StorageService','$cordovaDialogs','$filter','$ionicLoading','$ionicHistory','$ionicModal','$timeout','$scope','$state', 
function(ToastService,OpenCloseBookCombFac,OpenCloseBookLiteFac,SummaryLiteFac,UtilService,ConstructorService,StorageService,$cordovaDialogs,$filter,$ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state)
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        $scope.screenbesar = UtilService.CheckScreenSize();
        window.addEventListener("orientationchange", function() 
        {
            $scope.screenbesar = UtilService.CheckScreenSize(screen);
            $scope.$apply();
        }, false);
                     
        $scope.profileops     = StorageService.get('advanced-profile');
        var parameters          = UtilService.GetParameters();
        parameters.STATUS       = 2;
        OpenCloseBookLiteFac.GetOpenCloseBookWithStatus(parameters)
        .then(function(responseclosebook)
        {
            if(responseclosebook.length > 0)
            {
                $scope.belumopen        = false;
                $scope.dataclosebook    = angular.copy(responseclosebook[responseclosebook.length - 1]);
                console.log($scope.dataclosebook);
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
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });
    });

    $scope.submitclosebook = function()
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
            $scope.sudahclose = true;
            $cordovaDialogs.alert("Close Book Sukses.")  
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
        })
        
    }
}])

.controller('SetoranCtrl',['OpenCloseBookCombFac','OpenCloseBookLiteFac','StoresCombFac','ConstructorService','UtilService','$ionicPopup','$cordovaDialogs','$filter','$ionicLoading','$ionicHistory','$ionicModal','$timeout','$scope','$state','$cordovaCamera', 
function(OpenCloseBookCombFac,OpenCloseBookLiteFac,StoresCombFac,ConstructorService,UtilService,$ionicPopup,$cordovaDialogs,$filter,$ionicLoading,$ionicHistory,$ionicModal,$timeout,$scope,$state,$cordovaCamera)
{
    $scope.$on('$ionicView.beforeEnter', function()
    {        
        $scope.screenbesar      = UtilService.CheckScreenSize();
        window.addEventListener("orientationchange", function() 
        {
            $scope.screenbesar = UtilService.CheckScreenSize(screen);
            $scope.$apply();
        }, false);

        var parameters = UtilService.GetParameters();
        OpenCloseBookCombFac.GetSetoranBook(parameters)
        .then(function(responsegetsetorans)
        {
            console.log(responsegetsetorans);
            $scope.datasetorans = responsegetsetorans;
            if (responsegetsetorans.length > 0)
            {
                $scope.showdetail($scope.datasetorans[0])  
            }
        });
    });

    //Function Work When Screen Large
    $scope.showdetail   = function(setoran)
    {
        // $scope.setoran = null;
        if (!$scope.isGroupShown(setoran)) 
        {
            $scope.shownGroup = setoran;
            $ionicLoading.show
            ({
                template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
                noBackdrop:true
            })
            .then(function()
            {
                $scope.setoran = setoran;  
            })
            .finally(function()
            {
                $ionicLoading.show({template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',duration: 100});
            });
        }
    }

    //Function Work When Screen Small
    $scope.showmodadetailsetoran   = function(setoran)
    {
        $scope.shownGroup = setoran;
        $ionicModal.fromTemplateUrl('templates/openclosebook/modaldetailsetoran.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
        }).then(function(modal) 
        {
            $scope.setoran              = angular.copy(setoran);
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modaldetailsetoran);
            if(resultcheckmodal)
            {
                $scope.modaldetailsetoran   = modal;
                $scope.modaldetailsetoran.show();
            }
            
        });  
    }

    $scope.closemodaldetailsetoran = function()
    {
        $scope.modaldetailsetoran.remove();
    }
    $scope.isGroupShown = function(datatoshow) 
    {
        return $scope.shownGroup === datatoshow;
    };

    $scope.fotobuktisetoran = function()
    {
        if($scope.setoran.STATUS == 2)
        {
            document.addEventListener("deviceready", function () 
            {
                var options = UtilService.CameraOptions();
                $cordovaCamera.getPicture(options)
                .then(function (imageData) 
                {
                    $ionicLoading.show
                    ({
                      template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner>',
                      noBackdrop:true
                    })
                    .then(function()
                    {
                        $scope.setoran.STORAN_IMAGE = 'data:image/jpeg;base64,' + imageData;
                        $scope.setoran.STATUS       = 1;
                        $scope.setoran.SISA_STORAN  = Number($scope.setoran.TOTALCASH) - Number($scope.setoran.NOMINAL_STORAN);
                        $scope.setoran.TGL_STORAN   = $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss');
                        OpenCloseBookLiteFac.UpdateSetoranBook($scope.setoran)
                        .then(function(responsesetoran)
                        {
                            $cordovaDialogs.alert("Bukti Setoran Telah Berhasil Diupload Ke Server","Berhasil");
                            $scope.disablesubmit    = true;
                        })
                        .then(function()
                        {
                            var index = _.findIndex($scope.datasetorans,{'SPLIT_OPENCLOSE_ID':$scope.setoran.SPLIT_OPENCLOSE_ID});
                            $scope.datasetorans[index] = $scope.setoran;
                        },
                        function(errorsetoran)
                        {
                            console.log(errorsetoran);
                        })
                        .finally(function()
                        {
                            $ionicLoading.hide();
                        });
                    });
                });
            }, false);
            
        }
        else
        {
            $scope.showmodalimage();
        }
    }

    $scope.showmodalimage = function() 
    {
        $ionicModal.fromTemplateUrl('templates/openclosebook/modalimage.html', 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            $scope.modalimage = modal;
            $scope.modalimage.show();
        });
    }

    $scope.closemodalimage = function() 
    {
        $scope.modalimage.remove()
    };
}])
