var CACHE_NAME = 'contact-book-v1';

var resourcesToCache = [
    '/',
	'css/ionic.app.css',
    'build/minify/styles.min.css',
    'lib/nvd3/build/nv.d3.css',
    'lib/sweetalert/dist/sweetalert.css',
    'lib/angular-toastr/dist/angular-toastr.css',
    'cordova.js',
    'lib/ionic/js/ionic.bundle.js',
    'lib/underscore/underscore.js',
    'lib/ngCordova/dist/ng-cordova.js',
    'lib/angular-ui-clock/dist/angular-clock.js',
    'lib/sweetalert/dist/sweetalert.min.js',
    'lib/auth0.js/build/auth0.js',
    'lib/auth0-angular/build/auth0-angular.js',
    'lib/angular-animate/angular-animate.js',
    'lib/ngmap/build/scripts/ng-map.min.js',
    'lib/d3/d3.js',
    'lib/nvd3/build/nv.d3.js',
    'lib/angular-nvd3/dist/angular-nvd3.js',
    'lib/ng-letter-avatar/ngletteravatar.js',
    'lib/angular-toastr/dist/angular-toastr.tpls.js',
    'build/minify/app.min.js',
    'img/save-image.png',
    'img/kg.png',
    'img/assertive.png',
    'img/balanced.png',
    'img/calm.png',
    'img/dark.png',
    'img/positive.png',
    'img/login_bg.jpg',
    'img/image.jpg',
    'lib/ionic/fonts/ionicons.eot',
    'lib/ionic/fonts/ionicons.svg',
    'lib/ionic/fonts/ionicons.ttf',
    'lib/ionic/fonts/ionicons.woff'
 ]

self.addEventListener('install', function(event) 
{
    event.waitUntil(caches.open(CACHE_NAME)
	    .then(function(cache) 
	    {
	        return cache.addAll(resourcesToCache);
	    })
    );
});

self.addEventListener('activate', function (event) 
{
	console.info('service worker activated');
});

self.addEventListener('fetch', function(event) 
{
  event.respondWith(
    caches.match(event.request)
      .then(function(response) 
      {
        if (response) 
        {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', function (event) 
{

});