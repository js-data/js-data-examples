// This is to fully parse the JSON in req.query
module.exports = function () {
  return function (req, res, next) {
    if (req.query.where) {
      try {
        var where = JSON.parse(req.query.where);
        for (var key in where) {
          if (typeof where[key] === 'object' && '==' in where[key]) {
            where[key] = where[key]['=='];
          }
        }
        req.query.where = where;
        next();
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
  };
};
