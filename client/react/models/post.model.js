var Post = store.defineResource({
  name: 'post',
  endpoint: 'posts',
  relations: {
    belongsTo: {
      user: {
        localField: 'user',
        localKey: 'owner_id'
      }
    },
    hasMany: {
      comment: {
        localField: 'comments',
        foreignKey: 'post_id'
      }
    }
  }
});
