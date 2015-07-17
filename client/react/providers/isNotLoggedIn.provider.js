angular.module('app').provider('isNotLoggedIn', function () {
  'use strict';

  this.get = function (redirect) {
    return function ($rootScope, $location) {
      if ($rootScope.loggedIn) {
        $location.path(redirect || '/').replace();
      }
    };
  };

  this.$get = function ($rootScope, $location) {
    if ($rootScope.loggedIn) {
      $location.path('/').replace();
    }
  };
});
