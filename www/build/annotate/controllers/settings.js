angular.module('starter')
.controller('SettingCtrl',['$ionicActionSheet','SecuredFac','UtilService','StorageService','TemplateService','$ionicModal','$cordovaDialogs','$cordovaToast','$rootScope','$window','$scope','$state','$location','$timeout','$ionicLoading','$ionicHistory', 
function($ionicActionSheet,SecuredFac,UtilService,StorageService,TemplateService,$ionicModal,$cordovaDialogs,$cordovaToast,$rootScope,$window,$scope,$state,$location,$timeout,$ionicLoading,$ionicHistory) 
{
	$scope.mode 			= {'valuechoose':'PROFIL'};
	var profileadvance 		= StorageService.get('advanced-profile') 
	$scope.datauserlogin    = StorageService.get('advanced-profile');
	$scope.datauserprofile  = StorageService.get('advanced-profile').PROFILE;

	$scope.pilihjeniskelamin = function() 
    {
    
        $ionicActionSheet.show({
          titleText: 'Pilih Jenis Kelamin',
          buttons: 
          [
            { text: '<i class="icon ion-male"></i> Laki-laki' },
            { text: '<i class="icon ion-female"></i> Perempuan' },
          ],
          cancelText: 'Cancel',
          buttonClicked: function(index) 
          {
            if(index == 0)
            {
                $scope.datauserprofile.LAHIR_GENDER = 'Laki-laki';
            }
            else
            {
               $scope.datauserprofile.LAHIR_GENDER = 'Perempuan'; 
            }
            return true;
          }
        });
    };

    $scope.ubahprofile = function(dataprofile)
	{
		SecuredFac.UpdateProfileOps(dataprofile)
		.then(function(resupdateprofile)
		{
			profileadvance.PROFILE = dataprofile;
			StorageService.set('advanced-profile',profileadvance);
			$cordovaDialogs.alert('Data Profile Berhasil Diubah.','Information','Ok');
		},
		function(error)
		{
			$cordovaDialogs.alert('Data Profile Gagal Diubah.','Information','Ok');
		})
	} 

	// $rootScope.theme = {'name':'positive','headerstyle': 'bar-positive','itemstyle':'item-assertive','buttonstyle':'button-positive'};
	$scope.arraytemplate = [
								{'name':'assertive','headerstyle': 'bar-assertive','itemstyle':'item-assertive','buttonstyle':'button-assertive','img_display':'img/assertive.png'},
								{'name':'positive','headerstyle': 'bar-positive','itemstyle':'item-positive','buttonstyle':'button-positive','img_display':'img/positive.png'},
								{'name':'balanced','headerstyle': 'bar-balanced','itemstyle':'item-balanced','buttonstyle':'button-balanced','img_display':'img/balanced.png'},
								{'name':'dark','headerstyle': 'bar-dark','itemstyle':'item-dark','buttonstyle':'button-dark','img_display':'img/dark.png'},
								{'name':'calm','headerstyle': 'bar-calm','itemstyle':'item-calm','itemdividerstyle':'item-assertive','buttonstyle':'button-calm','img_display':'img/calm.png'}
							]
	

	$scope.showmodalimage = function(template) 
    {
        $ionicModal.fromTemplateUrl('templates/settings/modalimage.html', 
        {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalimage);
            if(resultcheckmodal)
            {
                $scope.modalimage          = modal;
                $scope.modalimage.show();
            }
            $scope.viewtemplate 	  = template;
        });
    }

    $scope.pilihtemplate = function()
	{
		$cordovaDialogs.confirm('Apakah Kamu Yakin Memilih Template Ini Sebagai Template Default ?', ['Delete','Cancel'])
        .then(function(buttonIndex) 
        {
            var btnIndex = buttonIndex;
            if(buttonIndex == 1)
            {
            	StorageService.set('template',$scope.viewtemplate);
            	TemplateService.ChangeTemplate();
				$scope.modalimage.remove();
            	$cordovaToast.show('Template Yang Anda Pilih Berhasil Diterapkan.', 'long', 'bottom');
            }
        });
		
	}

    $scope.closemodalimage = function() 
    {
        $scope.modalimage.remove()
    };
 
}])
.controller('SettingTokoCtrl',['StorageService','$scope',function(StorageService,$scope) 
{
	$scope.settingsList = StorageService.get('settingconfiguration');
	if(!$scope.settingsList)
	{
		$scope.settingsList = 
		[
		    { name:'ppnsetting',text: "PPN (10%)", checked: false },
		    { name:'bukabukusetting',text: "Buka/Tutup Buku", checked: false },
		    { name:'soundsetting',text: "Suara", checked: true },
		    { name:'gridsetting',text: "Mode Grid", checked: true },
	  	];
  	}

  	$scope.toggleChange = function(item,index) 
  	{
        if (item.checked == false) 
        {
            $scope.settingsList[index].checked = false
        } 
        else
        {

            $scope.settingsList[index].checked = true
        }
        StorageService.set('settingconfiguration',$scope.settingsList);
    };	
 
}])

.controller('SettingDeviceCtrl',['$ionicPlatform','$cordovaDevice','$scope',function($ionicPlatform,$cordovaDevice,$scope) 
{
    $ionicPlatform.ready(function() 
    {
        $scope.devicemodel      = $cordovaDevice.getModel();
        $scope.deviceplatform   = $cordovaDevice.getPlatform();
        $scope.deviceuuid       = $cordovaDevice.getUUID();
        $scope.deviceversion    = $cordovaDevice.getVersion();
    });  
 
}])