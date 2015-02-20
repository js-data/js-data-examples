module.exports = function (Promise) {
  function safeCall(method) {
    return function (req, res, next) {
      return Promise.try(function () {
        return method(req, res, next);
      }).catch(next).error(next);
    };
  }

  return safeCall;
};
