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
