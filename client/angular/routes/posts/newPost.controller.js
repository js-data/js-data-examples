angular.module('app')
  .controller('NewPostCtrl', function ($scope, $location, Post) {
    $scope.create = function () {
      $scope.processing = true;
      return Post.create($scope.post).then(function (post) {
        $location.path('/post/' + post.id);
      }).finally(function () {
        $scope.processing = false;
      });
    };
  });
