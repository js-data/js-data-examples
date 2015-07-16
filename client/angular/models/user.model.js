angular.module('app').factory('User', function ($rootScope, $q, DS, DSHttpAdapter) {
  var User = DS.defineResource({
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
      var deferred = $q.defer();

      if ($rootScope.loggedInUser) {
        deferred.resolve($rootScope.loggedInUser);
      } else {
        DSHttpAdapter.GET('/api/users/loggedInUser').then(function (response) {
          var user = response.data;
          if (user) {
            user = User.createInstance(user);
            $rootScope.loggedInUser = user;
            $rootScope.loggedIn = true;
            $rootScope.loggedInUserId = user.id;
            User.inject($rootScope.loggedInUser);
            return deferred.resolve(user);
          } else {
            $rootScope.loggedInUser = null;
            $rootScope.loggedIn = false;
            $rootScope.loggedInUserId = null;
            return deferred.resolve(null);
          }
        }, function (data) {
          if (data.status === 401) {
            return deferred.resolve(null);
          } else {
            return deferred.reject(data);
          }
        });
      }

      return deferred.promise;
    }
  });

  return User;
})
  .run(function (User) {
    User.getLoggedInUser();
  });
