'use strict'

exports.user = {
  hasMany: {
    post: {
      // database column, e.g. console.log(post.user_id) // 2
      foreignKey: 'user_id',
      // reference to related objects in memory, e.g. user.posts
      localField: 'posts'
    },
    comment: {
      // database column, e.g. console.log(comment.user_id) // 16
      foreignKey: 'user_id',
      // reference to related objects in memory, e.g. user.comments
      localField: 'comments'
    }
  }
}

exports.post = {
  belongsTo: {
    // comment belongsTo user
    user: {
      // database column, e.g. console.log(comment.user_id) // 2
      foreignKey: 'user_id',
      // reference to related object in memory, e.g. post.user
      localField: 'user'
    }
  },
  hasMany: {
    comment: {
      // database column, e.g. console.log(comment.post_id) // 5
      foreignKey: 'post_id',
      // reference to related objects in memory, e.g. post.comments
      localField: 'comments'
    }
  }
}

exports.comment = {
  belongsTo: {
    // comment belongsTo user
    user: {
      // database column, e.g. console.log(comment.user_id) // 16
      foreignKey: 'user_id',
      // reference to related object in memory, e.g. comment.user
      localField: 'user'
    },
    // comment belongsTo post
    post: {
      // database column, e.g. console.log(comment.post_id) // 5
      foreignKey: 'post_id',
      // reference to related object in memory, e.g. comment.post
      localField: 'post'
    }
  }
}
