angular.module('app').factory('Comment', function (DS) {
  return DS.defineResource({
    name: 'comment',
    endpoint: 'comments',
    relations: {
      belongsTo: {
        user: {
          localField: 'user',
          localKey: 'owner_id'
        },
        post: {
          localField: 'post',
          localKey: 'post_id'
        }
      }
    }
  });
}).run(function (Comment) {
});
