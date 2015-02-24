angular.module('app').config(function ($routeProvider, isLoggedInProvider, loggedInUserProvider) {
  $routeProvider
    .when('/posts/new', {
      templateUrl: 'routes/posts/newPost.html',
      controller: 'NewPostCtrl',
      resolve: {
        isLoggedIn: isLoggedInProvider.$get,
        loggedInUser: loggedInUserProvider.$get
      }
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
