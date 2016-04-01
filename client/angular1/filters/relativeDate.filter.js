angular.module('app').filter('relativeDate', function () {
  return function (x) {
    return moment(x).fromNow();
  };
});
