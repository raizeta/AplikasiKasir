angular.module('starter')
.controller('AbsensiCtrl',['$cordovaGeolocation','ToastService','KaryawansCombFac','KaryawansLiteFac','KaryawansFac','UtilService','StorageService','ConstructorService','$ionicPopup','$filter','$scope','$state','$location','$timeout','$ionicLoading','$ionicModal','$ionicHistory','$cordovaCamera', 
function($cordovaGeolocation,ToastService,KaryawansCombFac,KaryawansLiteFac,KaryawansFac,UtilService,StorageService,ConstructorService,$ionicPopup,$filter,$scope,$state,$location,$timeout,$ionicLoading,$ionicModal,$ionicHistory,$cordovaCamera) 
{
    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        $scope.$apply();
    }, false);
    $scope.$on('$ionicView.beforeEnter', function()
    {
        var options = {maximumAge:0,timeout:10000, enableHighAccuracy: true};
        $cordovaGeolocation.getCurrentPosition(options)
        .then(function(result)
        {
            var currentLocation         = {};
            currentLocation.LATITUDE    = result.coords.latitude;
            currentLocation.LONGITUDE   = result.coords.longitude;
            currentLocation.statusgps   = "Bekerja";
            $scope.currentLocation      = currentLocation;
        },
        function(err)
        {
            var currentLocation           = {};
            currentLocation.LATITUDE      = 0;
            currentLocation.LONGITUDE     = 0;
            currentLocation.statusgps     = 'Undefined';
            if(err)
            {
                if(err.code == 1 || err.code == "1")
                {
                    currentLocation.statusgps   = "EC:1";
                }
                else if(err.code == 2 || err.code == "2")
                {
                    currentLocation.statusgps   = "EC:2";
                }
                else if(err.code == 3 || err.code == "3")
                {
                    currentLocation.statusgps   = "Timeout Expired";
                }
            }
            $scope.currentLocation    = currentLocation;
            ToastService.ShowToast('Posisi GPS Saat Ini Tidak Tersedia. Error ' + currentLocation.statusgps,'error');
        });

		var parameters = UtilService.GetParameters();
        KaryawansCombFac.GetKaryawans(parameters)
        .then(function(resgetkaryawan)
        {
            $scope.datakaryawans = resgetkaryawan;
        },
        function(error)
        {
            console.log(error)
        });
        $scope.namatokoyangaktive = parameters.STORE_NM;
	});

	$scope.openmodalabsensi	= function(karyawan)	
    {
    	$ionicModal.fromTemplateUrl('templates/employe/modalabsensi.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $ionicLoading.show
	        ({
	            noBackdrop:false,
	            hideOnStateChange:true,
	            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
	        });
            $scope.dataemployedetail	= angular.copy(karyawan);
            var parameters 				= UtilService.GetParameters();
            parameters.KARYAWAN_ID 		= $scope.dataemployedetail.KARYAWAN_ID;
            KaryawansCombFac.GetKaryawanAbsensis(parameters)
			.then(function(responsegetabsensi)
			{
				if(angular.isArray(responsegetabsensi) && responsegetabsensi.length > 0)
				{
					var len = responsegetabsensi.length;
					if(responsegetabsensi[len - 1].STATUS == 0)
					{
						$scope.disablemasuk 	= true;
						$scope.disablekeluar	= false;
					}
					else
					{
						$scope.disablemasuk 	= true;
						$scope.disablekeluar	= true;
						$scope.notifikasiabsensi();
					}
				}
				else
				{
					$scope.disablemasuk 	= false;
					$scope.disablekeluar	= true;
				}
			})
            .then(function()
            {
                var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalabsensi);
                if(resultcheckmodal)
                {
                    $scope.modalabsensi  = modal;
                    $scope.modalabsensi.show();
                }
            })
			.finally(function()
			{
				$ionicLoading.hide();
			});
        });
    }
    
    $scope.closemodalabsensi = function()
    {
    	$scope.modalabsensi.remove();
    }
    
    $scope.funcabsensi 	= function(masukataukeluar)
	{

		var datatosave 			= ConstructorService.AbsensiContructor($scope.dataemployedetail);
		datatosave.LATITUDE     = $scope.currentLocation.LATITUDE;
		datatosave.LONGITUDE 	= $scope.currentLocation.LONGITUDE;
		datatosave.STATUS	    = masukataukeluar;
        datatosave.DCRP_DETIL   = 'ABSENSI MASUK';

        if(masukataukeluar == 1)
        {
            datatosave.DCRP_DETIL   = 'ABSENSI KELUAR';    
        }

         document.addEventListener("deviceready", function ()
         {
             var options = UtilService.CameraOptions();
             $cordovaCamera.getPicture(options)
             .then(function (imageData)
             {
                datatosave.ABSEN_IMAGE	= 'data:image/jpeg;base64,' + imageData;
                $ionicLoading.show
                ({
                    template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
                })
                .then(function()
                {
                	KaryawansLiteFac.CreateKaryawanAbsensis(datatosave)
			        .then(function(responsesetabsensi)
			        {
			        	if(masukataukeluar == 0)
			        	{
			        		$scope.disablemasuk  = true;
			        		$scope.disablekeluar = false;
                            ToastService.ShowToast('Terima Kasih.Absensi Berhasil Tersimpan.','success');
			        	}
			        	else
			        	{
			        		$scope.disablemasuk  = true;
			        		$scope.disablekeluar = true;
			        		$scope.notifikasiabsensi();
			        	}
			        },
			        function(errorsetabsensi)
			        {
			        	ToastService.ShowToast('Absensi Gagal Tersimpan.','success');
			        })
			        .finally(function()
		        	{
		        		$ionicLoading.show({template: 'Loading',duration: 500});
		        	});
                });
             });
         }, true);

	}

	$scope.notifikasiabsensi 	= function()
	{
		$ionicModal.fromTemplateUrl('templates/employe/notifikasiabsensi.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:500,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.notifikasiabsensimodal);
            if(resultcheckmodal)
            {
                $scope.notifikasiabsensimodal  = modal;
                $scope.notifikasiabsensimodal.show();
            }

        });
	}

	$scope.tutupnotifikasi = function()
	{
		if($scope.modalabsensi)
		{
			$scope.modalabsensi.remove();
		}
		$scope.notifikasiabsensimodal.remove();
	}
}])

.controller('LaporanAbsensiDailyCtrl',['KaryawansCombFac','StoresCombFac','StoresFac','UtilService','$ionicPopup','$filter','$scope','$timeout','$ionicLoading','$ionicModal', 
function(KaryawansCombFac,StoresCombFac,StoresFac,UtilService,$ionicPopup,$filter,$scope,$timeout,$ionicLoading,$ionicModal) 
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
        StoresCombFac.GetStores(parameters)
        .then(function(resgetstores)
        {
            $scope.stores       = resgetstores;
            // $scope.stores.push({'STORE_NM':'SEMUA TOKO','STORE_ID':parameters.ACCESS_GROUP + '.00000'});
            $scope.store        = resgetstores[0];
        });
    });
    $scope.openstorepopup = function (store) 
    {
        $scope.choiceview   = store;
        $scope.choice       = {STORE_ID:$scope.choiceview.STORE_ID};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/popupstore.html',
          title: 'PILIH TOKO?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                $scope.choice = angular.copy($scope.choiceview);
            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var index           = _.findIndex($scope.stores,{'STORE_ID':$scope.choice.STORE_ID});
                var resultstore     = angular.copy($scope.stores[index]);
                $scope.store        = resultstore;
                $timeout(function() 
            	{
            		$scope.loaddataabsensidaily($scope.store);
            	}, 10);
            }
          }]
        });
    } 

   	$scope.loaddataabsensidaily = function(datastore)
   	{
	    var parameters 			= UtilService.GetParameters();
	    parameters.TGL 			= parameters.TGL_SAVE;
	    if(datastore)
	    {
	    	parameters.STORE_ID = datastore.STORE_ID;
	    }

		StoresFac.GetLaporanAbsensi(parameters)
		.then(function(response)
		{
			$scope.databasensikaryawan = response;
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
	$scope.loaddataabsensidaily();

    $scope.openmodalposisiabsensi = function(LATITUDE,LONGITUDE)    
    {
        $ionicModal.fromTemplateUrl('templates/employe/modalposisiabsensi.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalposisiabsensi);
            if(resultcheckmodal)
            {
                $scope.longitude           = angular.copy(LONGITUDE);
                $scope.latitude            = angular.copy(LATITUDE);
                $scope.modalposisiabsensi  = modal;
                $scope.modalposisiabsensi.show();
            }
        });
    }
    
    $scope.closemodalposisiabsensi = function()
    {
        $scope.modalposisiabsensi.remove();
    }
}])

.controller('LaporanAbsensiMonthlyCtrl',['KaryawansCombFac','StoresCombFac','StoresFac','UtilService','$ionicPopup','$filter','$scope','$timeout','$ionicLoading','$ionicModal', 
function(KaryawansCombFac,StoresCombFac,StoresFac,UtilService,$ionicPopup,$filter,$scope,$timeout,$ionicLoading,$ionicModal) 
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
        StoresCombFac.GetStores(parameters)
        .then(function(resgetstores)
        {
            $scope.stores       = resgetstores;
            // $scope.stores.push({'STORE_NM':'SEMUA TOKO','STORE_ID':parameters.ACCESS_GROUP + '.00000'});
            $scope.store        = resgetstores[0];
        });
    });
    $scope.openstorepopup = function (store) 
    {
        $scope.choiceview   = store;
        $scope.choice       = {STORE_ID:$scope.choiceview.STORE_ID};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/popupstore.html',
          title: 'PILIH TOKO?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                $scope.choice = angular.copy($scope.choiceview);
            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var index           = _.findIndex($scope.stores,{'STORE_ID':$scope.choice.STORE_ID});
                var resultstore     = angular.copy($scope.stores[index]);
                $scope.store        = resultstore;
                $timeout(function() 
                {
                    $scope.loaddataabsensimonthly($scope.store);
                }, 10);
            }
          }]
        });
    } 

    $scope.loaddataabsensimonthly = function(datastore)
    {
        var parameters          = UtilService.GetParameters();
        parameters.BULAN        = $filter('date')(new Date(parameters.TGL_SAVE),'MM');
        if(datastore)
        {
            parameters.STORE_ID = datastore.STORE_ID;
        }

        StoresFac.GetLaporanAbsensi(parameters)
        .then(function(response)
        {
            var parents = UtilService.MakeUnflatterArray(response,'TGL')
            $scope.databasensikaryawan = parents;
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
    $scope.loaddataabsensimonthly();

    $scope.openmodalposisiabsensi = function(LATITUDE,LONGITUDE)    
    {
        $ionicModal.fromTemplateUrl('templates/employe/modalposisiabsensi.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalposisiabsensi);
            if(resultcheckmodal)
            {
                $scope.longitude           = angular.copy(LONGITUDE);
                $scope.latitude            = angular.copy(LATITUDE);
                $scope.modalposisiabsensi  = modal;
                $scope.modalposisiabsensi.show();
            }
        });
    }
    
    $scope.closemodalposisiabsensi = function()
    {
        $scope.modalposisiabsensi.remove();
    }
}])

.controller('LaporanAbsensiPerKaryawanCtrl',['KaryawansCombFac','StoresCombFac','StoresFac','UtilService','$ionicPopup','$filter','$scope','$timeout','$ionicLoading','$ionicModal', 
function(KaryawansCombFac,StoresCombFac,StoresFac,UtilService,$ionicPopup,$filter,$scope,$timeout,$ionicLoading,$ionicModal) 
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
        StoresCombFac.GetStores(parameters)
        .then(function(resgetstores)
        {
            $scope.stores       = resgetstores;
            // $scope.stores.push({'STORE_NM':'SEMUA TOKO','STORE_ID':parameters.ACCESS_GROUP + '.00000'});
            $scope.store        = resgetstores[0];
        });
    });
    $scope.openstorepopup = function (store) 
    {
        $scope.choiceview   = store;
        $scope.choice       = {STORE_ID:$scope.choiceview.STORE_ID};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/popupstore.html',
          title: 'PILIH TOKO?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                $scope.choice = angular.copy($scope.choiceview);
            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var index           = _.findIndex($scope.stores,{'STORE_ID':$scope.choice.STORE_ID});
                var resultstore     = angular.copy($scope.stores[index]);
                $scope.store        = resultstore;
            }
          }]
        });
    } 

    var parameters = UtilService.GetParameters();
    KaryawansCombFac.GetKaryawans(parameters)
    .then(function(resgetkaryawan)
    {
        $scope.datakaryawans = resgetkaryawan;
    });

    $scope.openmodallaporanabsensi = function(karyawan)
    {
    	$ionicModal.fromTemplateUrl('templates/employe/modallaporanabsensiperkaryawan.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $ionicLoading.show
	        ({
	            noBackdrop:false,
	            hideOnStateChange:true,
	            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
	        });

	        var parameters 			= UtilService.GetParameters();
	    	parameters.TGL 			= parameters.TGL_SAVE;
	    	parameters.KARYAWAN_ID	= karyawan.KARYAWAN_ID;
	    	StoresFac.GetLaporanAbsensi(parameters)
	    	.then(function(response)
	    	{
	    		$scope.datakaryawan 	   = karyawan;
	    		$scope.databasensikaryawan = response;
	    	},
	    	function(error)
	    	{
	    		console.log(error);
	    	})
	    	.finally(function()
    		{
    			$ionicLoading.hide();
    		});

	    	var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalbsensiperkaryawan);
	        if(resultcheckmodal)
	        {
	            $scope.modalbsensiperkaryawan  = modal;
	            $scope.modalbsensiperkaryawan.show();
	        }
	    });
    }

    $scope.closemodallaporanabsensi = function(karyawan)
    {
    	$scope.modalbsensiperkaryawan.remove();
    }
    
}])
