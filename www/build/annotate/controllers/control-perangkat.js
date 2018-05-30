angular.module('starter')
.controller('ControlPerangkatCtrl',['PerangkatsFac','StoresCombFac','ToastService','$ionicPopup','$cordovaDialogs','StorageService','UtilService','$ionicModal','$ionicLoading','$scope','$filter','$timeout', 
function(PerangkatsFac,StoresCombFac,ToastService,$ionicPopup,$cordovaDialogs,StorageService,UtilService,$ionicModal,$ionicLoading,$scope,$filter,$timeout) 
{
	$scope.viewtoshow = {'valuechoose':'PEMBAYARAN'};
    
    $scope.screenbesar = UtilService.CheckScreenSize();
    window.addEventListener("orientationchange", function() 
    {
        $scope.screenbesar = UtilService.CheckScreenSize(screen);
        $scope.$apply();
    }, false);
    
    $scope.myActiveSlide        = 1;
    $scope.jumlahsaldodompet    = {'nominal':100000};
	$scope.loadstores = function()
	{
		var parameters = UtilService.GetParameters();
        StoresCombFac.GetStores(parameters)
        .then(function(resgetstores)
        {
            $scope.datastores = resgetstores;
            $timeout(function() 
            {
                $scope.detailstore($scope.datastores[0]); 
            }, 10);
        })  	
	}
	$scope.loadstores();


	$scope.detailstore 	= function(datastore)
	{
		$scope.datadetail 	= datastore;
        
		if (!$scope.isGroupShown(datastore)) 
	    {
	        $scope.shownGroup = datastore;
            $ionicLoading.show
            ({
                noBackdrop:false,
                hideOnStateChange:true,
                template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
                duration:300
            });
	    }

        var parameters          = UtilService.GetParameters();
        parameters.STORE_ID     = datastore.STORE_ID;

        PerangkatsFac.GetPerangkats(parameters)
        .then(function(responseperangkat)
        {
            $scope.dataperangkat    = responseperangkat;
        },
        function(error)
        {
            console.log(error);
        });

        PerangkatsFac.GetPakets(parameters)
        .then(function(responseperangkat)
        {
            $scope.datapaketperangkat = responseperangkat;
        },
        function(error)
        {
            console.log(error);
        });

        PerangkatsFac.GetPaymentMethods(parameters)
        .then(function(responseperangkat)
        {
            // console.log(responseperangkat)
        },
        function(error)
        {
            console.log(error);
        });
	}

    $scope.openstorepopup = function (datastores)
    {
        var profileadvanc   = StorageService.get('advanced-profile');
        $scope.stores       = $scope.datastores;
        $scope.choiceview   = datastores;
        $scope.choice       = {STORE_ID:$scope.choiceview.STORE_ID};
        $ionicPopup.confirm({
          templateUrl: 'templates/sales/popupstore.html',
          title: 'PILIH STORE?',
          scope: $scope,
          cssClass: 'animated bounceIn',
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
                var index           = _.findIndex($scope.datastores,{'STORE_ID':$scope.choice.STORE_ID});
                var result          = angular.copy($scope.datastores[index]);
                $scope.detailstore(result);
            }
          }]
        });
    }

    $scope.modalbayariuranopen   = function(perangkat,indexperangkat)
    {
        $ionicModal.fromTemplateUrl('templates/control/perangkat/modalbayariuranperangkat.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.iuranyangharusdibayar                        = angular.copy(perangkat);

            $scope.iuranyangharusdibayar.PAKET_GROUP            = perangkat.PAKET_ATRIBUT.PAKET_GROUP;
            $scope.iuranyangharusdibayar.PAKET_ID               = perangkat.PAKET_ATRIBUT.PAKET_ID;
            $scope.iuranyangharusdibayar.PAKET_NM               = perangkat.PAKET_ATRIBUT.PAKET_NM;
            $scope.iuranyangharusdibayar.PAKET_DURATION         = perangkat.PAKET_ATRIBUT.PAKET_DURATION;
            $scope.iuranyangharusdibayar.PAKET_DURATION_BONUS   = perangkat.PAKET_ATRIBUT.PAKET_DURATION_BONUS;
            $scope.iuranyangharusdibayar.HARGA_BULAN            = perangkat.PAKET_ATRIBUT.HARGA_BULAN;
            $scope.iuranyangharusdibayar.HARGA_HARI             = perangkat.PAKET_ATRIBUT.HARGA_HARI;
            $scope.iuranyangharusdibayar.HARGA_PAKET            = perangkat.PAKET_ATRIBUT.HARGA_PAKET;
            $scope.iuranyangharusdibayar.HARGA_PAKET_HARI       = perangkat.PAKET_ATRIBUT.HARGA_PAKET_HARI;
            $scope.iuranyangharusdibayar.PAKET_STT              = perangkat.PAKET_ATRIBUT.PAKET_STT;
            $scope.iuranyangharusdibayar.PAKET_STT_NM           = perangkat.PAKET_ATRIBUT.PAKET_STT_NM;
            $scope.iuranyangharusdibayar.DATE_END_BEFORE_CHANGE = angular.copy($scope.iuranyangharusdibayar.DATE_END);
            if($scope.iuranyangharusdibayar.DATE_END_BEFORE_CHANGE)
            {
                $scope.mydate           = new Date($scope.iuranyangharusdibayar.DATE_END_BEFORE_CHANGE);
                var numberOfDaysToAdd   = $scope.iuranyangharusdibayar.PAKET_DURATION + $scope.iuranyangharusdibayar.PAKET_DURATION_BONUS;
                $scope.newdate          = $scope.mydate.setDate($scope.mydate.getDate() + numberOfDaysToAdd);
                $scope.iuranyangharusdibayar.DATE_END = $filter('date')(new Date($scope.newdate),'dd-MM-yyyy');
            }
            else
            {
                $scope.mydate           = new Date();
                var numberOfDaysToAdd   = $scope.iuranyangharusdibayar.PAKET_DURATION + $scope.iuranyangharusdibayar.PAKET_DURATION_BONUS;
                $scope.newdate          = $scope.mydate.setDate($scope.mydate.getDate() + numberOfDaysToAdd);
                $scope.iuranyangharusdibayar.DATE_END = $filter('date')(new Date($scope.newdate),'dd-MM-yyyy');
            }


            $scope.iuranyangharusdibayarsblmdiupdate            = angular.copy($scope.iuranyangharusdibayar)
            $scope.indexperangkat                               = angular.copy(indexperangkat);

            console.log($scope.iuranyangharusdibayar);

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalpembayaraniuran);
            if(resultcheckmodal)
            {
                $scope.modalpembayaraniuran  = modal;
                $scope.modalpembayaraniuran.show();
            }
        });
    }
    
    $scope.modalbayariuransubmit = function() 
    { 
        if($scope.jumlahsaldodompet.nominal < $scope.iuranyangharusdibayar.HARGA_PAKET)
        {
            alert("Saldo Tidak Mencukup.Lakukan Top Up Terlebih Dahulu");
        }
        else
        {
            $scope.iuranyangharusdibayar.KASIR_STT_NM   = 'ACTIVE';
            $scope.dataperangkat[$scope.indexperangkat] = $scope.iuranyangharusdibayar;
            ToastService.ShowToast('Pembayaran Perangkat Berhasil.','success');
            $scope.modalpembayaraniuran.remove();
        }  
    };

    $scope.modalbayariuranclose = function() 
    {
        if(!_.isEqual($scope.iuranyangharusdibayarsblmdiupdate,$scope.iuranyangharusdibayar))
        {
            $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
            .then(function(buttonIndex) 
            {
                var btnIndex = buttonIndex;
                if(buttonIndex == 1)
                {
                    $scope.modalpembayaraniuran.remove();
                }
            });
        }
        else
        {
            $scope.modalpembayaraniuran.remove();  
        }
    };

    $scope.pilihpaketperangkat = function(productunitsselected)
    {
        console.log($scope.iuranyangharusdibayar);
        if($scope.iuranyangharusdibayar)
        {
            $scope.choicepaketperangkat = {'PAKET_ID':$scope.iuranyangharusdibayar.PAKET_ID}; 
        }
        else
        {
            $scope.choicepaketperangkat = {'PAKET_ID':undefined};
        }
        
        $ionicPopup.confirm({
          templateUrl: 'templates/control/perangkat/popuppaketperangkat.html',
          title: 'PILIH PAKET PERANGKAT?',
          scope: $scope,
          buttons: [
          {
            text: 'Cancel',
            type: 'button-assertive',
            onTap: function (e) 
            {
                
            }
          },
          {
            text: 'Yes',
            type: 'button-positive',
            onTap: function (e) 
            {
                var index = _.findIndex($scope.datapaketperangkat,{'PAKET_ID':$scope.choicepaketperangkat.PAKET_ID});
                var paketyangdipilih                                = $scope.datapaketperangkat[index];

                $scope.iuranyangharusdibayar.PAKET_GROUP            = paketyangdipilih.PAKET_GROUP;
                $scope.iuranyangharusdibayar.PAKET_ID               = paketyangdipilih.PAKET_ID;
                $scope.iuranyangharusdibayar.PAKET_NM               = paketyangdipilih.PAKET_NM;
                $scope.iuranyangharusdibayar.PAKET_DURATION         = paketyangdipilih.PAKET_DURATION;
                $scope.iuranyangharusdibayar.PAKET_DURATION_BONUS   = paketyangdipilih.PAKET_DURATION_BONUS;
                $scope.iuranyangharusdibayar.HARGA_BULAN            = paketyangdipilih.HARGA_BULAN;
                $scope.iuranyangharusdibayar.HARGA_HARI             = paketyangdipilih.HARGA_HARI;
                $scope.iuranyangharusdibayar.HARGA_PAKET            = paketyangdipilih.HARGA_PAKET;
                $scope.iuranyangharusdibayar.HARGA_PAKET_HARI       = paketyangdipilih.HARGA_PAKET_HARI;
                $scope.iuranyangharusdibayar.PAKET_STT              = paketyangdipilih.PAKET_STT;
                $scope.iuranyangharusdibayar.PAKET_STT_NM           = paketyangdipilih.PAKET_STT_NM;

                if($scope.iuranyangharusdibayar.DATE_END_BEFORE_CHANGE)
                {
                    $scope.mydate           = new Date($scope.iuranyangharusdibayar.DATE_END_BEFORE_CHANGE);
                    var numberOfDaysToAdd   = $scope.iuranyangharusdibayar.PAKET_DURATION + $scope.iuranyangharusdibayar.PAKET_DURATION_BONUS;
                    $scope.newdate          = $scope.mydate.setDate($scope.mydate.getDate() + numberOfDaysToAdd);
                    $scope.iuranyangharusdibayar.DATE_END = $filter('date')(new Date($scope.newdate),'dd-MM-yyyy');
                }
                else
                {
                    
                    $scope.mydate           = new Date();
                    var numberOfDaysToAdd   = $scope.iuranyangharusdibayar.PAKET_DURATION + $scope.iuranyangharusdibayar.PAKET_DURATION_BONUS;
                    $scope.newdate          = $scope.mydate.setDate($scope.mydate.getDate() + numberOfDaysToAdd);
                    $scope.iuranyangharusdibayar.DATE_END = $filter('date')(new Date($scope.newdate),'dd-MM-yyyy');
                } 
            }
          }]
        });
    }

    /** AWAL DARI PERANGKAT CRUD FUNCTION **/
    $scope.modalnewperangkatopen   = function()
    {
        $ionicModal.fromTemplateUrl('templates/control/perangkat/modalnewperangkat.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var parameters          = UtilService.GetParameters();
            $scope.newperangkat     = {PERANGKAT_UUID:'84e4948fb680e655',ACCESS_ID:parameters.ACCESS_ID,STORE_ID:parameters.STORE_ID,STORE_NM:parameters.STORE_NM};
            var resultcheckmodal    = UtilService.CheckModalExistOrNot($scope.newperangkatmodal);
            if(resultcheckmodal)
            {
                $scope.newperangkatmodal   = modal;
                $scope.newperangkatmodal.show();
            }
        });
    }
    
    $scope.modalnewperangkatsubmit = function() 
    {
        $scope.newperangkatmodal.remove();
        PerangkatsFac.CreatePerangkats($scope.newperangkat)
        .then(function(response)
        {
            $scope.dataperangkat.unshift(response);
            ToastService.ShowToast('Perangkat Berhasil Ditambahkan','success');
        },
        function(error)
        {
            ToastService.ShowToast('Perangkat Gagal Ditambahkan','error');
        })  
    };

    $scope.modalnewperangkatclose = function() 
    {
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.newperangkatmodal.remove();
            }
        });

    };

    $scope.modalupdateperangkatopen   = function(perangkat,indexperangkat)
    {
        $ionicModal.fromTemplateUrl('templates/control/perangkat/modalupdateperangkat.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            $scope.updateperangkat                      = angular.copy(perangkat);
            $scope.dataperangkatsblmdiupdate            = angular.copy(perangkat)
            $scope.indexperangkat                       = angular.copy(indexperangkat);

            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.updateperangkatmodal);
            if(resultcheckmodal)
            {
                $scope.updateperangkatmodal  = modal;
                $scope.updateperangkatmodal.show();
            }
        });
    }
    
    $scope.modalupdateperangkatsubmit = function() 
    {        
        if(!_.isEqual($scope.dataperangkatsblmdiupdate,$scope.updateperangkat))
        {
            
        }   
    };

    $scope.modalupdateperangkatclose = function() 
    {
        $cordovaDialogs.confirm('Data Tidak Akan Tersimpan. Apakah Kamu Yakin Untuk Keluar?', ['Yakin','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
                $scope.updateperangkatmodal.remove();
            }
        });
    };
/** AKHIR DARI PERANGKAT CRUD FUNCTION **/

	

	$scope.isGroupShown = function(datatoshow) 
	{
		return $scope.shownGroup === datatoshow;
	};	
}])