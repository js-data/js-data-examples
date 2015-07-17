module.exports = function (container, Promise, mout, messageService, config, DS) {
  if (DS.definitions.post) {
    return DS.definitions.post;
  }

  return DS.defineResource({
    name: 'post',
    table: 'posts',
    relations: {
      belongsTo: {
        user: {
          localField: 'user',
          localKey: 'owner_id'
        }
      },
      hasMany: {
        comment: {
          localField: 'comments',
          foreignKey: 'post_id'
        }
      }
    }
  });
};
