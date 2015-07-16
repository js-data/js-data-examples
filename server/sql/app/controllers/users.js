module.exports = function (User) {

  return {
    /**
     * GET /users
     */
    findAll: function (req, res) {
      return User.findAll(req.query).then(function (users) {
        return res.status(200).send(users).end();
      });
    },

    /**
     * GET /users/:id
     */
    findOneById: function (req, res) {
      return User.find(req.params.id, {'with': ['post', 'comment']}).then(function (user) {
        user.posts = user.posts || [];
        user.comments = user.comments || [];
        // only return up to 10 comments
        user.comments.slice(0, 10);
        return res.status(200).send(user).end();
      });
    }
  };
};
