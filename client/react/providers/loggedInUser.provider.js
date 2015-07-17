angular.module('app').provider('loggedInUser', function () {
  'use strict';

  this.$get = function (User) {
    return User.getLoggedInUser();
  };
});
