module.exports = function (r, container, Promise, mout, messageService, config, DS) {
  if (DS.definitions.comment) {
    return DS.definitions.comment;
  }

  return DS.defineResource({
    name: 'comment',
    table: 'comment',
    relations: {
      belongsTo: {
        user: {
          localField: 'user',
          localKey: 'ownerId'
        },
        post: {
          localField: 'post',
          localKey: 'ownerId'
        }
      }
    },
    schema: {
      postId: {
        type: 'string',
        nullable: false
      },
      ownerId: {
        type: 'string',
        nullable: false
      },
      id: {
        nullable: true
      },
      body: {
        type: 'string',
        maxLength: 5000,
        nullable: false
      },
      created: {
        nullable: true
      },
      updated: {
        nullable: true
      }
    },
    beforeValidate: function (Comment, comment, cb) {
      Comment.schema.stripNonSchemaAttrs(comment);
      cb(null, comment);
    },

    beforeCreate: function (Comment, comment, cb) {
      comment.created = r.now();
      comment.updated = r.now();
      Comment.schema.validate(comment, function (err) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, comment);
        }
      });
    },

    afterCreate: function (Comment, comment, cb) {
      // Broadcast that this comment was created
      messageService.sendCreateMessage('comment', comment);

      cb(null, comment);
    },

    beforeUpdate: function (Comment, comment, cb) {
      comment.updated = r.now();
      Comment.schema.validate(comment, function (err) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, comment);
        }
      });
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
