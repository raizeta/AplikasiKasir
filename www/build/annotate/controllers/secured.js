angular.module('starter')
.controller('LoginCtrl',['SecuredFac','auth','$cordovaDevice','$cordovaToast','$cordovaDialogs','$ionicHistory','$filter','$ionicModal','$timeout','$scope','$state','$ionicPopup','$ionicLoading','StorageService', 
function(SecuredFac,auth,$cordovaDevice,$cordovaToast,$cordovaDialogs,$ionicHistory,$filter,$ionicModal,$timeout,$scope,$state,$ionicPopup,$ionicLoading,StorageService) 
{
    $scope.datauserlogin = {};
    document.addEventListener("deviceready", function () 
    {
        $scope.devicemodel      = $cordovaDevice.getModel();
        $scope.deviceplatform   = $cordovaDevice.getPlatform();
        $scope.deviceuuid       = $cordovaDevice.getUUID();
        $scope.deviceversion    = $cordovaDevice.getVersion();
    }, false);
    $scope.login = function () 
    {
        // alert($scope.deviceuuid);
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        $scope.disableInput         = true;
        if($scope.deviceuuid)
        {
            $scope.datauserlogin.UUID   = $scope.deviceuuid;    
        }
        else
        {
            if($scope.datauserlogin.username == 'radumta@gmail.com')
            {
                $scope.datauserlogin.UUID  = '84e4948fb680e655';
            }
            else if($scope.datauserlogin.username == 'raizetacorp@gmail.com')
            {
                $scope.datauserlogin.UUID  = '84e4948fb680e655';
            }
            else
            {
                $scope.datauserlogin.UUID  = '84e4948fb680e6336';  
            }
            
        }
        
        SecuredFac.Login($scope.datauserlogin)
        .then(function (resultprofile) 
        {
            $timeout(function() 
            {
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('auth.wellcome', {}, {reload: false});
            }, 100);  
        }, 
        function (err) 
        {          
            if(err == 'password_salah')
            {
                $cordovaDialogs.alert('Password Salah!', 'Login Gagal', 'Ok');   
            }
            else if(err == 'username_salah')
            {
                $cordovaDialogs.alert('Username Salah!', 'Login Gagal', 'Ok');
            }
            else if(err == 'Active-Code')
            {
                $scope.openmodalregistrationconfirmation($scope.datauserlogin)
            }
            else
            {
                $cordovaDialogs.alert('Jaringan Bermasalah!Silahkan Coba Login Kembali.', 'Login Gagal', 'Ok');
            }
            $ionicLoading.hide();
        });
    }
    $scope.loginWithGoogle = function ()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });
        window.plugins.googleplus.login(
        {
        },
        function (user_data) 
        {
            var datalogin = {};
            datalogin.SOSMED_PROVIDER   = $filter('uppercase')('GOOGLE');
            datalogin.SOSMED_ID         = user_data.userId;
            datalogin.UUID              = $scope.deviceuuid;
            SecuredFac.Login(datalogin)
            .then(function(responsesocmed)
            {
                $timeout(function() 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('tab.sales', {}, {reload: true});
                }, 1000);
            }, 
            function (err) 
            {          
                if(err == 'wrong-sosmed')
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Account Anda Belum Terdaftar!'
                    });   
                }
                else
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Jaringan Bermasalah!Silahkan Coba Lagi.'
                    });
                    focus('focusUsername');
                }
                $ionicLoading.hide();
            });
        },
        function (msg) 
        {
            swal({
                  title: "Login failed",
                  text: "Please check your credentials.",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
            $cordovaDialogs.alert('Jaringan Bermasalah!Silahkan Coba Login Kembali.', 'Login Gagal', 'Ok');
            $ionicLoading.hide();
        });
    }

    $scope.loginWithSocmed = function (socmedprovider)
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        if(socmedprovider == 'yahoo')
        {
            var scopeprovider = 'openid offline_access';
        }
        else
        {
            var scopeprovider = 'openid name email offline_access'
        }
        auth.signin(
        {
            popup: true,
            connection: socmedprovider,
            scope: scopeprovider,
            device: 'Mobile device',
        }, 
        function(profile, token) 
        {
            var datalogin = {};
            datalogin.SOSMED_PROVIDER   = $filter('uppercase')(profile.identities[0].provider);
            datalogin.SOSMED_ID         = profile.identities[0].user_id;
            datalogin.UUID              = $scope.deviceuuid;
            SecuredFac.Login(datalogin)
            .then(function(responsesocmed)
            {
                $timeout(function() 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('auth.wellcome', {}, {reload: false});
                }, 1000);
            }, 
            function (err) 
            {          
                if(err == 'wrong-sosmed')
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Account Anda Belum Terdaftar!'
                    });   
                }
                else
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Jaringan Bermasalah!Silahkan Coba Lagi.'
                    });
                    focus('focusUsername');
                }
                $ionicLoading.hide();
            });
        }, 
        function(error) 
        {
            $ionicLoading.hide();
        });
    }

    $scope.signupnewuser = function()
    {
        $ionicModal.fromTemplateUrl('templates/secured/register.html', 
        {
            scope: $scope,
            animation: 'animated zoomInUp',
            hideDelay:1020,
            backdropClickToClose: false,
            hideOnStateChange:true,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.datauserbaru     = {};
            $scope.modalnewuser     = modal;
            $scope.modalnewuser.show();
        });
    }
    
    $scope.submitnewuser = function()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        $scope.datauserbaru.UUID        = $scope.deviceuuid;
        $scope.datauserbaru.username    = angular.copy($scope.datauserbaru.email);
        SecuredFac.Registration($scope.datauserbaru)
        .then(function(resregistrasikonfirmasi)
        {
            $scope.openmodalregistrationconfirmation($scope.datauserbaru);
        },
        function(error)
        {
            if(error == 'Email-Already-Exist')
            {
                $cordovaDialogs.alert('Email Yang Anda Gunakan Sudah Pernah Terdaftar Sebelumnya.','Pendaftaran Gagal','Ok'); 
            }
            else if(error == 'Username-Already-Exist')
            {
                $cordovaDialogs.alert('Username Yang Anda Gunakan Sudah Pernah Terdaftar Sebelumnya.','Pendaftaran Gagal','Ok'); 
            }
            else
            {
                $cordovaDialogs.alert('Mohon Maaf.Server Kami Sedang Mengalami Gangguan', 'Server Error', 'Ok');   
            }
        })
        .finally(function()
        {
            $ionicLoading.hide();
        });
          
    }

    $scope.signupmodalcancel = function()
    {
        $scope.modalnewuser.remove();
    }

    $scope.openmodalregistrationconfirmation = function(resregistrasikonfirmasi)
    {
        $ionicModal.fromTemplateUrl('templates/secured/registrationconfirmation.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {
            $scope.dataregistrasi                   = resregistrasikonfirmasi;
            $scope.modalregistrationconfirmation    = modal;
            $scope.modalregistrationconfirmation.show();
        });
    }

    $scope.submitregistrationconfirmation = function()
    {
        var active_code = $scope.dataregistrasi.x1 + $scope.dataregistrasi.x2+ $scope.dataregistrasi.x3 + $scope.dataregistrasi.x4;
        $scope.dataregistrasi.ACTIVE_CODE  = active_code.toString();
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        SecuredFac.Login($scope.dataregistrasi)
        .then(function (resultprofile) 
        {
            if($scope.modalregistrationconfirmation)
            {
                $scope.modalregistrationconfirmation.remove();      
            }
            if($scope.modalnewuser)
            {
               $scope.modalnewuser.remove(); 
            }
            
            $timeout(function() 
            {
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('auth.wellcome', {}, {reload: false});
            }, 100);  
        }, 
        function (err) 
        {          
            if(err == 'wrong-code')
            {
                $cordovaDialogs.alert('Silahkan Masukkan Kode Aktifasi Yang Benar!','Kode Aktifasi Salah!','Ok');
            }
            else
            {
                $cordovaDialogs.alert('Jaringan Anda Mengalami Gangguan, Silahkan Coba Lagi.','Login Gagal','Ok');
            }
        })
        .finally(function()
        {
            $ionicLoading.hide();
            
        });
    }
    $scope.closeregistrationconfirmation = function()
    {
        $scope.modalregistrationconfirmation.remove();
    }

    $scope.SignUpWithSocmed = function (socmedprovider)
    {

        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        if(socmedprovider == 'yahoo')
        {
            var scopeprovider = 'openid offline_access';
        }
        else
        {
            var scopeprovider = 'openid name email offline_access'
        }
        auth.signin(
        {
            popup: true,
            connection: socmedprovider,
            scope: scopeprovider,
            device: 'Mobile device',
        }, 
        function(profile, token) 
        {
            console.log(profile);
            var dataregistersocmed = {};
            dataregistersocmed.SOSMED_PROVIDER   = $filter('uppercase')(profile.identities[0].provider);
            dataregistersocmed.SOSMED_ID         = profile.identities[0].user_id;
            dataregistersocmed.email             = profile.email;
            dataregistersocmed.username          = profile.email;
            SecuredFac.Registration(dataregistersocmed)
            .then(function(resregistrasisocmed)
            {
                $scope.modalnewuser.remove();
                $timeout(function() 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('auth.wellcome', {}, {reload: false});
                }, 1000);
            },
            function(error)
            {
                if(error == 'Email-Already-Exist')
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Email-Already-Exist.Please Login!'
                    });   
                }
                else if(error == 'Username-Already-Exist')
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Username-Already-Exist!'
                    });
                }
                else if(error == 'Sosmed-Provider-Already-Exist')
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Sosmed-Provider-Already-Exist!'
                    });
                }
                $ionicLoading.hide();
            });

        }, 
        function(error) 
        {
            $ionicLoading.hide();
            $cordovaDialogs.alert('Please check your credentials.', 'Login Gagal', 'Ok');
        });
    }

    $scope.SignUpWithGoogle = function ()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });
        window.plugins.googleplus.login(
        {
        },
        function (user_data) 
        {
            var dataregistersocmed               = {};
            dataregistersocmed.SOSMED_PROVIDER   = $filter('uppercase')('GOOGLE');
            dataregistersocmed.SOSMED_ID         = user_data.userId;
            dataregistersocmed.email             = user_data.email;
            dataregistersocmed.username          = user_data.email;
            SecuredFac.Registration(dataregistersocmed)
            .then(function(resregistrasisocmed)
            {
                $scope.modalnewuser.remove();
                $timeout(function() 
                {
                    $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                    $state.go('auth.wellcome', {}, {reload: false});
                }, 1000);
            },
            function(error)
            {
                if(error == 'Email-Already-Exist')
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Email-Already-Exist.Please Login!'
                    });   
                }
                else if(error == 'Username-Already-Exist')
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Username-Already-Exist!'
                    });
                }
                else if(error == 'Sosmed-Provider-Already-Exist')
                {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Login failed!',
                      template: 'Sosmed-Provider-Already-Exist!'
                    });
                }
                $ionicLoading.hide();
            });
        },
        function (msg) 
        {
            swal({
                  title: "Login failed",
                  text: "Please check your credentials.",
                  allowOutsideClick:true,
                  showConfirmButton:true
                });
            $ionicLoading.hide();
        });
    }

    $scope.resetpassword = function()
    {
        swal({
              title: "Reset Password",
              text: "",
              type: "input",
              inputType:"email",
              showCancelButton: true,
              closeOnConfirm: false,
              animation: "slide-from-top",
              inputPlaceholder: "Input Email Anda Disini",
              showLoaderOnConfirm:true
            },
            function(inputValue)
            {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!re.test(inputValue))
                {
                    var testemail = true;  
                }

                if (inputValue === false) 
                {
                    return false;
                }
                if (inputValue === "" || testemail) 
                {
                    swal.showInputError("Wrong Format.Please Enter Valid Email!");
                    return false
                }
                var dataparameter   = {};
                dataparameter.email = inputValue;
                SecuredFac.ResetOldPassword(dataparameter)
                .then(function (resultresetoldpass) 
                {
                    $timeout(function() 
                    {
                        swal.close();
                        StorageService.set('reset-password-email',inputValue);
                        $scope.modalnewpassopen();
                    }, 50);
                }, 
                function (err) 
                {          
                    if(err == 'Email-Not-Exist')
                    {
                        swal.showInputError("Email Anda Tidak Ditemukan Di Server Kami!");
                        return false;
                    }
                }); 
            });
    }

    $scope.modalnewpassopen = function()
    {
        $ionicModal.fromTemplateUrl('templates/secured/resetpassword.html', 
        {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: true
        })
        .then(function(modal) 
        {            
            $scope.datanewpassword          = {};
            $scope.modalresetpass           = modal;
            $scope.modalresetpass.show();
        });
    }

    $scope.submitresetpass = function()
    {
        $ionicLoading.show
        ({
            noBackdrop:false,
            hideOnStateChange:true,
            template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
        });

        var active_code                     = $scope.datanewpassword.x1 + $scope.datanewpassword.x2+ $scope.datanewpassword.x3 + $scope.datanewpassword.x4;
        $scope.datanewpassword.ACTIVE_CODE  = active_code.toString();
        $scope.datanewpassword.email        = StorageService.get('reset-password-email');
        SecuredFac.SetNewPassword($scope.datanewpassword)
        .then(function (result) 
        {
            $scope.modalresetpass.hide();
            $cordovaToast.show('Reset Password Berhasil.Silahkan Login Dengan Password Terbaru Anda.', 'long', 'bottom');
        }, 
        function (err) 
        {          
            if(err == 'wrong-code')
            {
                $cordovaDialogs.alert('Reset Kode Yang Anda Masukkan Salah.','Error','Ok');
            }
        })
        .finally(function()
        {
            $ionicLoading.hide();     
        });    
    }

}])