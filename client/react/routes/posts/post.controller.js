angular.module('app').controller('PostCtrl', function ($scope, $routeParams, Post, Comment) {
  var PostCtrl = this;

  Post.bindOne($routeParams.id, $scope, 'PostCtrl.post');
  Comment.bindAll({
    post_id: $routeParams.id
  }, $scope, 'PostCtrl.comments');

  $scope.$watch(Comment.lastModified, function () {
    console.log(Comment.getAll());
  });

  PostCtrl.submit = function () {
    Comment.create({
      body: PostCtrl.comment.body,
      post_id: $routeParams.id
    }).then(function () {
      PostCtrl.comment.body = '';
    });
  };
});
