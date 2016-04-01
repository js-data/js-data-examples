angular.module('app').factory('Post', function (DS) {
  return DS.defineResource({
    name: 'post',
    endpoint: 'posts',
    relations: {
      belongsTo: {
        user: {
          localField: 'user',
          localKey: 'owner_id'
        }
      }
    }
  });
}).run(function (Post) {
});
