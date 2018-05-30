var myApp = angular.module('myApp');

myApp.controller('MenuCtrl', function ($scope, $location, auth, store) {
  $scope.go = function (target) {
    $location.path(target);
  };

  $scope.signup = function() {
    // Not supported in Lock 10. Just set 'initialScreen' option to 'signUp'
    // auth.signup()
  };

  $scope.reset = function () {
    // No need in Lock, set Just set 'initialScreen' option to 'forgotPassword'
  };

  $scope.login = function () {
    // auth.magicLink(function(email) {
    //
    //   console.log(email);
    //
    // });
    auth.sms(function (profile, token) {
      console.log(profile, token);
    });
    // auth.emailCode(function(profile, id_token) {
    //
    //     console.log(id_token);
    //
    // });
  };
});

myApp.controller('RootCtrl', function (auth, $scope) {
  $scope.auth = auth;
});

myApp.controller('LoginCtrl', function (auth, $scope) {
  $scope.auth = auth;
});

myApp.controller('LogoutCtrl', function (auth, $location, store) {
  auth.signout();
  store.remove('profile');
  store.remove('token');
  $location.path('/login');
});
