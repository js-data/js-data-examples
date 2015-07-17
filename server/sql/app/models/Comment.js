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
    }
  });
};
