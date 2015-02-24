// This little generator simply saves us a lot of boilerplate code
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
