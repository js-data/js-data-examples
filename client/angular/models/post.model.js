angular.module('app')
  .factory('Post', function (DS) {
    return DS.defineResource({
      name: 'post',
      endpoint: 'posts'
    });
  })
  .run(function (Post) {
  });
