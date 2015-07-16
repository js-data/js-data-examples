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
      }
    },
    beforeCreate: function (Post, post, cb) {
      post.created_at = new Date();
      post.updated_at = new Date();
      return cb(null, post);
    },

    afterCreate: function (Post, post, cb) {
      // Broadcast that this post was created
      messageService.sendCreateMessage('post', post);

      cb(null, post);
    },

    beforeUpdate: function (Post, post, cb) {
      post.updated_at = new Date();
      return cb(null, post);
    },

    afterUpdate: function (Post, post, cb) {
      // Broadcast that this post was updated
      messageService.sendUpdateMessage('post', post);

      cb(null, post);
    },

    afterDestroy: function (Post, post, cb) {
      // Broadcast that this post was destroyed
      messageService.sendDestroyMessage('post', post);

      cb(null, post);
    }
  });
};
