module.exports = function () {
  var JSData = require('js-data');
  var IllegalArgumentError = JSData.DSErrors.IllegalArgumentError;
  var RuntimeError = JSData.DSErrors.RuntimeError;
  return function (err, req, res) {
    var responder;
    if (err && req) {
      if (res) {
        // Normally you would be using some logging library
        console.log(err.message);
        console.log(err.stack);
      }
    }
    if (req && typeof req.send === 'function') {
      responder = req;
    } else if (res && typeof res.send === 'function') {
      responder = res;
    }
    if (err instanceof IllegalArgumentError) {
      responder.status(400).send(err.errors || err.message).end();
    } else if (err instanceof RuntimeError) {
      responder.status(500).send(err.errors || err.message).end();
    } else if (err === 'Not Found!' || (err.message && err.message === 'Not Found!')) {
      responder.status(404).end();
    } else if (typeof err === 'number') {
      responder.status(err).end();
    } else if (typeof err === 'object') {
      responder.status(400).send(err).end();
    } else {
      responder.status(500).send({ error: '500 - Internal Server Error' }).end();
    }
  };
};
