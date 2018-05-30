var myApp = angular.module('myApp', [
  'auth0', 'ngRoute', 'angular-jwt', 'angular-storage'
]);

myApp.config(function ($routeProvider, authProvider,
  $httpProvider, $locationProvider, jwtInterceptorProvider) {
  $routeProvider
  .when('/logout',  {
    templateUrl: 'views/logout.html',
    controller: 'LogoutCtrl'
  })
  .when('/login',   {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl',
  })
  .when('/', {
    templateUrl: 'views/root.html',
    controller: 'RootCtrl',
    requiresLogin: true
  });

  $locationProvider.hashPrefix('!');

  // authProvider.init({
  //   domain: 'samples.auth0.com',
  //   clientID: 'BUIJSW9x60sIHBw8Kd9EmCbj8eDIFxDC',
  //   loginUrl: '/login'
  // });



  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('token');
  };

  // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
  // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
  // want to check the delegation-token example
  $httpProvider.interceptors.push('jwtInterceptor');
}).run(function($rootScope, auth, store, jwtHelper, $location) {

  auth.init({
    domain: 'samples.auth0.com',
    clientID: 'gbVTAtzkesLnTcZQOhxec3S6bSpe31Je',
    loginUrl: '/login',
    initialScreen: 'forgotPassword',
    additionalSignUpFields: [{
      name: "address",                              // required
      placeholder: "enter your address",            // required
      icon: "https://example.com/address_icon.png", // optional
      prefill: "street 123",                        // optional
      validator: function(value) {                  // optional
        // only accept addresses with more than 10 chars
        return value.length > 10;
      }
    }]
  });
  var saveUserInfo = function(profile, token) {
    store.set('profile', profile);
    store.set('token', token);
  };
  auth.lockOn('show', function () {
    alert('shown');
  });
  auth.lockOn('hide', function () {
    alert('hidden');
  });
  auth.lockOn("authenticated", function(authResult) {
    console.log(authResult);
    auth.getProfile(authResult.idToken).then(function (profile) {

      console.log(profile);

      saveUserInfo(profile, authResult.idToken);

    })
  });
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token);
        } else {
          $location.path('/login');
        }
      }
    }

  });
});
