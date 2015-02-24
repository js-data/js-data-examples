module.exports = function (Post, mout) {

  return {
    /**
     * GET /posts
     */
    findAll: function (req, res) {
      return Post.findAll(req.query, { useClass: false }).then(function (posts) {
        return res.status(200).send(posts).end();
      });
    },

    /**
     * GET /posts/:id
     */
    findOneById: function (req, res) {
      return Post.find(req.params.id).then(function (post) {
        return res.status(200).send(post).end();
      });
    },

    /**
     * POST /posts
     */
    createOne: function (req, res) {
      var post = Post.createInstance(req.body);
      post.ownerId = req.user.id;
      return Post.create(post).then(function (post) {
        return res.status(201).send(post).end();
      });
    },

    /**
     * PUT /posts/:id
     */
    updateOneById: function (req, res, next) {
      return Post.find(req.params.id).then(function (post) {
        if (post.ownerId !== req.user.id) {
          return next(404);
        } else {
          delete req.body.created;
          delete req.body.updated;
          mout.object.deepMixIn(post, req.body);
          return Post.update(post.id, post).then(function (post) {
            return res.status(200).send(post).end();
          });
        }
      });
    },

    /**
     * DELETE /posts/:id
     */
    deleteOneById: function (req, res, next) {
      return Post.find(req.params.id).then(function (post) {
        if (post.ownerId !== req.user.id) {
          return next(404);
        } else {
          Post.inject(post);
          return Post.destroy(post.id).then(function () {
            return res.status(204).end();
          });
        }
      });
    }
  };
};
