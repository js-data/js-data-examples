angular.module('app', ['ngRoute', 'js-data'])
  .config(function ($locationProvider, DSHttpAdapterProvider) {
    angular.extend(DSHttpAdapterProvider.defaults, {
      basePath: '/api'
    });
    $locationProvider.html5Mode(true).hashPrefix('!');
  })
  .run(function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function ($event, next) {
      $rootScope.path = next.$$route.originalPath.substr(1).split('/')[0];
    });
  });
