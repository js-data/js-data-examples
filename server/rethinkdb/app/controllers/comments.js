module.exports = function (Comment) {

  return {
    /**
     * GET /comments
     */
    findAll: function (req, res) {
      return Comment.findAll(req.query, {'with': ['user']}).then(function (comments) {
        return res.status(200).send(comments).end();
      });
    },

    /**
     * POST /comments
     */
    createOne: function (req, res) {
      var comment = Comment.createInstance(req.body);
      comment.owner_id = req.user.id;
      return Comment.create(comment, {'with': ['user']}).then(function (comment) {
        return res.status(201).send(comment).end();
      });
    },

    /**
     * PUT /comments/:id
     */
    updateOneById: function (req, res, next) {
      return Comment.find(req.params.id).then(function (comment) {
        if (comment.owner_id !== req.user.id) {
          return next(404);
        } else {
          return Comment.update(comment.id, req.body).then(function (comment) {
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
        if (comment.owner_id !== req.user.id) {
          return next(404);
        } else {
          return Comment.destroy(comment.id).then(function () {
            return res.status(204).end();
          });
        }
      });
    }
  };
};
