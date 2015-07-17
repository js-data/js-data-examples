module.exports = function (container, Promise, mout, messageService, config, DS) {
  if (DS.definitions.user) {
    return DS.definitions.user;
  }

  return DS.defineResource({
    name: 'user',
    table: 'users',
    relations: {
      hasMany: {
        post: {
          localField: 'posts',
          foreignKey: 'owner_id'
        },
        comment: {
          localField: 'comments',
          foreignKey: 'owner_id'
        }
      }
    }
  });
};
