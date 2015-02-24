angular.module('app').config(function ($routeProvider) {
  $routeProvider
    .when('/post/:id', {
      templateUrl: 'routes/post/post.html',
      controller: 'PostCtrl',
      resolve: {
        post: function ($route, Post) {
          return Post.find($route.current.params.id);
        }
      }
    });
});
