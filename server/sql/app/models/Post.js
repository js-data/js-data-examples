module.exports = function (r, container, Promise, mout, messageService, config, DS) {
  if (DS.definitions.post) {
    return DS.definitions.post;
  }

  return DS.defineResource({
    name: 'post',
    table: 'post',
    schema: {
      ownerId: {
        nullable: false
      },
      id: {
        nullable: true
      },
      title: {
        type: 'string',
        maxLength: 500,
        nullable: false
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
    beforeValidate: function (Post, post, cb) {
      Post.schema.stripNonSchemaAttrs(post);
      cb(null, post);
    },

    beforeCreate: function (Post, post, cb) {
      post.created = r.now();
      post.updated = r.now();
      Post.schema.validate(post, function (err) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, post);
        }
      });
    },

    afterCreate: function (Post, post, cb) {
      // Broadcast that this post was created
      messageService.sendCreateMessage('post', post);

      cb(null, post);
    },

    beforeUpdate: function (Post, post, cb) {
      post.updated = r.now();
      Post.schema.validate(post, function (err) {
        if (err) {
          return cb(err);
        } else {
          return cb(null, post);
        }
      });
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
