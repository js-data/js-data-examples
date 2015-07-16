angular.module('app').controller('PostCtrl', function ($scope, $routeParams, Post) {
  Post.bindOne($routeParams.id, $scope, 'PostCtrl.post');
});
