module.exports = function (Comment, mout) {

  return {
    /**
     * GET /comments
     */
    findAll: function (req, res) {
      return Comment.findAll(req.query, { useClass: false }).then(function (comments) {
        return res.status(200).send(comments).end();
      });
    },

    /**
     * GET /comments/:id
     */
    findOneById: function (req, res) {
      return Comment.find(req.params.id).then(function (comment) {
        return res.status(200).send(comment).end();
      });
    },

    /**
     * POST /comments
     */
    createOne: function (req, res) {
      var comment = Comment.createInstance(req.body);
      comment.ownerId = req.user.id;
      return Comment.create(comment).then(function (comment) {
        return res.status(201).send(comment).end();
      });
    },

    /**
     * PUT /comments/:id
     */
    updateOneById: function (req, res, next) {
      return Comment.find(req.params.id).then(function (comment) {
        if (comment.ownerId !== req.user.id) {
          return next(404);
        } else {
          delete req.body.created;
          delete req.body.updated;
          mout.object.deepMixIn(comment, req.body);
          return Comment.update(comment.id, comment).then(function (comment) {
            return res.status(200).send(comment).end();
          });
        }
      });
    },

    /**
     * DELETE /comments/:id
     */
    deleteOneById: function (req, res, next) {
      return Comment.find(req.params.id).then(function (comment) {
        if (comment.ownerId !== req.user.id) {
          return next(404);
        } else {
          Comment.inject(comment);
          return Comment.destroy(comment.id).then(function () {
            return res.status(204).end();
          });
        }
      });
    }
  };
};
