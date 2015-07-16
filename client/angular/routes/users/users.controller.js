angular.module('app').controller('UsersCtrl', function ($scope, User) {
  User.bindAll(null, $scope, 'UsersCtrl.users');
});
