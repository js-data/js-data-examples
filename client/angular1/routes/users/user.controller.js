angular.module('app').controller('UserCtrl', function ($scope, $routeParams, User, Post, Comment) {
  User.bindOne($routeParams.id, $scope, 'UserCtrl.user');

  Post.bindAll({
    owner_id: $routeParams.id
  }, $scope, 'UserCtrl.posts');

  Comment.bindAll({
    owner_id: $routeParams.id
  }, $scope, 'UserCtrl.comments');
});
