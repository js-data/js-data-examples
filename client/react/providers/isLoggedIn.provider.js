angular.module('app').provider('isLoggedIn', function () {
  'use strict';

  this.$get = function ($q, User) {
    return User.getLoggedInUser().then(function (user) {
      if (!user) {
        window.location = '/auth/github';
        return null;
      } else {
        return user;
      }
    });
  };
});
