var User = store.defineResource({
  name: 'user',
  endpoint: 'users',
  relations: {
    hasMany: {
      post: {
        localField: 'posts',
        foreignKey: 'owner_id'
      },
      comment: {
        localField: 'comments',
        foreignKey: 'owner_id'
      }
    }
  },

  // Static Methods
  getLoggedInUser: function () {
    return new JSData.DSUtils.Promise(function (resolve, reject) {
      if (User.loggedInUser) {
        resolve(User.loggedInUser);
      } else {
        store.getAdapter('http').GET('/api/users/loggedInUser').then(function (response) {
          var user = response.data;
          if (user) {
            user = User.createInstance(user);
            User.loggedInUser = user;
            User.loggedIn = true;
            User.loggedInUserId = user.id;
            User.inject(User.loggedInUser);
            return resolve(user);
          } else {
            User.loggedInUser = null;
            User.loggedIn = false;
            User.loggedInUserId = null;
            return resolve(null);
          }
        }, function (data) {
          if (data.status === 401) {
            return resolve(null);
          } else {
            return reject(data);
          }
        });
      }
    });
  }
});

User.getLoggedInUser();
