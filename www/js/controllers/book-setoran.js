angular.module('starter')
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
