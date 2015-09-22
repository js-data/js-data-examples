// Removes 'with' from the query and saves it separately on the request. This
// lets us use syntax like the following:
//     DS.findAll('user', req.query, { with: req.with });
//     DS.find('user', 5, { with: req.with })
module.exports = function() {
    return function rewriteRelations(req, res, next) {
        if ('with' in req.query) {
            req.with = Array.isArray(req.query.with) ? req.query.with : [req.query.with];
            delete req.query.with;
        }
        else {
            req.with = [];
        }

        next();
    };
};
