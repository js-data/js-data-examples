angular.module('app').controller('UserCtrl', function ($scope, $routeParams, User) {
  User.bindOne($routeParams.id, $scope, 'UserCtrl.user');
});
