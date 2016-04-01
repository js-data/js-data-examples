angular.module('app').config(function ($routeProvider, isLoggedInProvider, loggedInUserProvider) {
  $routeProvider
    .when('/posts/new', {
      templateUrl: 'routes/posts/newPost.html',
      controller: 'NewPostCtrl',
      controllerAs: 'NewPostCtrl',
      resolve: {
        isLoggedIn: isLoggedInProvider.$get,
        loggedInUser: loggedInUserProvider.$get
      }
    })
    .when('/posts/:id', {
      templateUrl: 'routes/posts/post.html',
      controller: 'PostCtrl',
      controllerAs: 'PostCtrl',
      resolve: {
        post: function ($route, Post) {
          return Post.find($route.current.params.id);
        },
        comments: function ($route, Comment) {
          return Comment.findAll({
            post_id: $route.current.params.id
          });
        }
      }
    })
    .when('/posts', {
      templateUrl: 'routes/posts/posts.html',
      controller: 'PostsCtrl',
      controllerAs: 'PostsCtrl',
      resolve: {
        posts: function (Post) {
          return Post.findAll();
        }
      }
    });
});
