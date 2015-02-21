angular.module('app').config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'routes/home/home.html'
    });
});
