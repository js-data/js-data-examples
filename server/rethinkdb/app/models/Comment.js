module.exports = function (container, Promise, mout, messageService, config, DS) {
  if (DS.definitions.comment) {
    return DS.definitions.comment;
  }

  return DS.defineResource({
    name: 'comment',
    table: 'comments',
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
    },
    beforeCreate: function (Comment, comment, cb) {
      comment.created_at = new Date();
      comment.updated_at = new Date();
      return cb(null, comment);
    },

    afterCreate: function (Comment, comment, cb) {
      // Broadcast that this comment was created
      messageService.sendCreateMessage('comment', comment);

      cb(null, comment);
    },

    beforeUpdate: function (Comment, comment, cb) {
      comment.updated_at = new Date();
      return cb(null, comment);
    },

    afterUpdate: function (Comment, comment, cb) {
      // Broadcast that this comment was updated
      messageService.sendUpdateMessage('comment', comment);

      cb(null, comment);
    },

    afterDestroy: function (Comment, comment, cb) {
      // Broadcast that this comment was destroyed
      messageService.sendDestroyMessage('comment', comment);

      cb(null, comment);
    }
  });
};
