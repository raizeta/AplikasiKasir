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
  authProvider.init({
    domain: 'chris92.auth0.com',
    clientID: 'G7IwfyxcX3O5dHU2ikjdOXDpa7HAtjyr'
  });

  authProvider.on('loginSuccess', function($location, profilePromise, idToken, store) {
    console.log("Login Success");
    profilePromise.then(function(profile) {
      store.set('profile', profile);
      store.set('token', idToken);
    });
    $location.path('/');
  });



  jwtInterceptorProvider.tokenGetter = function(store) {
    return store.get('token');
  };

  // Add a simple interceptor that will fetch all requests and add the jwt token to its authorization header.
  // NOTE: in case you are calling APIs which expect a token signed with a different secret, you might
  // want to check the delegation-token example
  $httpProvider.interceptors.push('jwtInterceptor');
}).run(function($rootScope, auth, store, jwtHelper, $location) {

  var saveUserInfo = function(profile, token) {
    store.set('profile', profile);
    store.set('token', token);
  };
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
