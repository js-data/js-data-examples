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
    },
    beforeCreate: function (User, user, cb) {
      user.created_at = new Date();
      user.updated_at = new Date();
      return cb(null, user);
    },

    afterCreate: function (User, user, cb) {
      // Broadcast that this user was created
      messageService.sendCreateMessage('user', user);

      cb(null, user);
    },

    beforeUpdate: function (User, user, cb) {
      user.updated_at = new Date();
      return cb(null, user);
    },

    afterUpdate: function (User, user, cb) {
      // Broadcast that this user was updated
      messageService.sendUpdateMessage('user', user);

      cb(null, user);
    },

    afterDestroy: function (User, user, cb) {
      // Broadcast that this user was destroyed
      messageService.sendDestroyMessage('user', user);

      cb(null, user);
    }
  });
};
