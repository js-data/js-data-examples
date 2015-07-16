angular.module('app').controller('PostsCtrl', function ($scope, Post) {
  Post.bindAll(null, $scope, 'PostsCtrl.posts');
});
