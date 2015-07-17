module.exports = function (Post) {

  return {
    /**
     * GET /posts
     */
    findAll: function (req, res) {
      return Post.findAll(req.query).then(function (posts) {
        return res.status(200).send(posts).end();
      });
    },

    /**
     * GET /posts/:id
     */
    findOneById: function (req, res) {
      return Post.find(req.params.id, {'with': ['user', 'comment']}).then(function (post) {
        return res.status(200).send(post).end();
      });
    },

    /**
     * POST /posts
     */
    createOne: function (req, res) {
      var post = Post.createInstance(req.body);
      post.owner_id = req.user.id;
      return Post.create(post, {'with': ['user']}).then(function (post) {
        return res.status(201).send(post).end();
      });
    },

    /**
     * PUT /posts/:id
     */
    updateOneById: function (req, res, next) {
      return Post.find(req.params.id).then(function (post) {
        if (post.owner_id !== req.user.id) {
          return next(404);
        } else {
          return Post.update(post.id, req.body).then(function (post) {
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
        if (post.owner_id !== req.user.id) {
          return next(404);
        } else {
          return Post.destroy(post.id).then(function () {
            return res.status(204).end();
          });
        }
      });
    }
  };
};
