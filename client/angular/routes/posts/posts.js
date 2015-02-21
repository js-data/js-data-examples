angular.module('app').config(function ($routeProvider) {
  $routeProvider
    .when('/posts/new', {
      templateUrl: 'routes/posts/newPost.html',
      controller: 'NewPostCtrl'
    })
    .when('/posts', {
      templateUrl: 'routes/posts/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        posts: function (Post) {
          return Post.findAll();
        }
      }
    });
});
