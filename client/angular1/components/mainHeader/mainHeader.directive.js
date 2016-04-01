angular.module('app').directive('mainHeader', function () {
  'use strict';
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'components/mainHeader/mainHeader.html',
    controller: function ($scope) {
      $scope.login = function () {
        window.location = '/auth/github';
      };
    }
  };
});
