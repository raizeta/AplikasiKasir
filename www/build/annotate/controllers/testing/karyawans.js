angular.module('starter')
.controller('TestingKaryawansCtrl', ['KaryawansLiteFac', 'KaryawansCombFac', 'UtilService', '$ionicListDelegate', '$ionicModal', '$cordovaToast', '$cordovaDialogs', '$scope', '$filter', function(KaryawansLiteFac,KaryawansCombFac,UtilService,$ionicListDelegate,$ionicModal,$cordovaToast,$cordovaDialogs,$scope,$filter) 
{
	var parameters = UtilService.GetParameters();
	KaryawansCombFac.GetKaryawans(parameters)
	.then(function(responseserver)
	{
		  $scope.datakaryawans = responseserver;
	},
	function(error)
	{
		  console.log(error);
	});

  $scope.modalnewkaryawanopen   = function()
  {
      $ionicModal.fromTemplateUrl('templates/control/karyawans/modalnewkaryawan.html', 
      {
          scope: $scope,
          animation: 'animated zoomInUp',
          hideDelay:1020,
          backdropClickToClose: false,
          hardwareBackButtonClose: false
      })
      .then(function(modal) 
      {
          KaryawansLiteFac.GetMaxKaryawanID(parameters.STORE_ID)
          .then(function(newkaryawanid)
          {
              $scope.newkaryawan                 = {};
              $scope.newkaryawan.KARYAWAN_ID     = newkaryawanid;
              $scope.newkaryawan.ACCESS_GROUP    = parameters.ACCESS_GROUP;
              $scope.newkaryawan.STORE_ID        = parameters.STORE_ID;
              $scope.newkaryawan.TGL_SAVE        = $filter('date')(new Date(),'yyyy-MM-dd');
              $scope.newkaryawan.STATUS          = 1;
          });

          var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.newkaryawanmodal);
          if(resultcheckmodal)
          {
              $scope.newkaryawanmodal  = modal;
              $scope.newkaryawanmodal.show();
          }
      });
  }
  
  $scope.modalnewkaryawansubmit = function() 
  {
      KaryawansLiteFac.CreateKaryawans($scope.newkaryawan)
      .then(function(responsesetkaryawan)
      {
          $scope.newkaryawan.ID_LOCAL = responsesetkaryawan.ID_LOCAL;
          $scope.datakaryawans.unshift($scope.newkaryawan);  
          $scope.newkaryawanmodal.remove();
          $cordovaToast.show('Penambahan Karyawan Berhasil.', 'long', 'bottom');
      },
      function(error)
      {
          $cordovaToast.show('Penambahan Karyawan Gagal.Periksa Form Inputan Karyawan Dengan Teliti', 'long', 'bottom');
      });
  };

  $scope.modalnewkaryawanclose = function() 
  {
      $scope.newkaryawanmodal.remove();
  };


  $scope.modalupdatekaryawanopen   = function(detailkaryawan,indexkaryawan)
  {
      $ionicModal.fromTemplateUrl('templates/control/karyawans/modalupdatekaryawan.html', 
      {
          scope: $scope,
          animation: 'animated zoomInUp',
          hideDelay:1020,
          backdropClickToClose: false,
          hardwareBackButtonClose: false
      })
      .then(function(modal) 
      {
          $scope.datakaryawansebelumdiupdate         = angular.copy(detailkaryawan);
          $scope.updatekaryawan                      = angular.copy(detailkaryawan);
          $scope.indexkaryawan                       = angular.copy(indexkaryawan);

          var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalupdatekaryawan);
          if(resultcheckmodal)
          {
              $scope.modalupdatekaryawan  = modal;
              $scope.modalupdatekaryawan.show();
          }
      });
  }
  
  $scope.modalupdatekaryawansubmit = function() 
  {
      if(!_.isEqual($scope.datakaryawansebelumdiupdate, $scope.updatekaryawan))
      {
          $scope.updatekaryawan.TGL_SAVE = $filter('date')(new Date(),'yyyy-MM-dd');
          KaryawansLiteFac.UpdateKaryawans($scope.updatekaryawan)
          .then(function(resgetkaryawan)
          {
              $scope.datakaryawans[$scope.indexkaryawan] = $scope.updatekaryawan;
              $scope.modalupdatekaryawan.remove();
              $cordovaToast.show('Pengubahan Data Karyawan Berhasil.', 'long', 'bottom');
          },
          function(error)
          {
              $cordovaToast.show('Pengubahan Data Karyawan Gagal.Periksa Form Inputan Anda.', 'long', 'bottom');
          });
      }
      else
      {
          $cordovaToast.show('Tidak Ada Data Yang Berubah.', 'long', 'bottom'); 
      }
      
  };

  $scope.modalupdatekaryawanclose = function() 
  {
      $scope.modalupdatekaryawan.remove();
  };

	$scope.modaldeletekaryawanopen = function(karyawan,indexkaryawan)
	{
		  $cordovaDialogs.confirm('Apakah Kamu Yakin Akan Menghapus '+ karyawan.NAMA_DPN +' ?',karyawan.NAMA_DPN, ['Delete','Cancel'])
    	.then(function(buttonIndex) 
    	{
      		var btnIndex = buttonIndex;
      		if(buttonIndex == 1)
      		{
              KaryawansLiteFac.DeleteKaryawans(karyawan)
              .then(function(resdeletecustomer)
              {
                  $ionicListDelegate.closeOptionButtons();
                  $scope.datakaryawans.splice(indexkaryawan,1);
                  $cordovaToast.show('Karyawan Telah Berhasil Di Delete!', 'long', 'bottom');
              },
              function(error)
              {
                  $cordovaToast.show('Karyawan Gagal Di Delete!', 'long', 'bottom');
              });  	
      		}
    	});
	}
   
}]);