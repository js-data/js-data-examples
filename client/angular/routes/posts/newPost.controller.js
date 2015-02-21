angular.module('app')
  .controller('NewPostCtrl', function ($scope, Post) {
    $scope.create = function () {
      $scope.processing = true;
      return Post.create($scope.post).finally(function () {
        $scope.processing = false;
      });
    };
  });
