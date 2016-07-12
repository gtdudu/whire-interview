var myApp = angular.module('ngclient', ['ngRoute']);

myApp.config(function($routeProvider, $httpProvider, $locationProvider) {

  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'homeCtrl'
    })
    .otherwise({
      templateUrl: 'error/404.html',
    });

    // use the HTML5 History API
    // this is used to remove '#' from url
    // this works because <base href="/"> is defined in head
    // and server serves index.html on every route
    $locationProvider.html5Mode(true);

});
